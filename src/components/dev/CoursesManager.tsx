"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Save, X, Upload, ChevronDown, ChevronUp } from "lucide-react";

interface Lesson { id: string; title: string; duration: string; free: boolean; }
interface Section { section: string; lessons: Lesson[]; }
interface Resource { title: string; description: string; type: string; fileSize: string; url: string; }
interface Course {
  _id?: string; courseId: string; title: string; description: string; price: number;
  originalPrice?: number; rating?: number; reviews?: number; students?: number;
  instructor: string; instructorImage?: string; thumbnail: string; category: string;
  level?: string; duration?: string; lessonsCount?: number;
  curriculum: Section[]; downloadableResources: Resource[];
}

const EMPTY: Course = { courseId: "", title: "", description: "", price: 0, instructor: "Dr. Maxwell Oyom", thumbnail: "", category: "", curriculum: [], downloadableResources: [] };

export default function CoursesManager({ headers, uploadFile }: { headers: any; uploadFile: (f: File) => Promise<string | null> }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editing, setEditing] = useState<Course | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchCourses = async () => {
    setLoading(true);
    const res = await fetch("/api/dev/courses", { headers });
    setCourses(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    editing.lessonsCount = editing.curriculum.reduce((sum, s) => sum + s.lessons.length, 0);
    const url = isNew ? "/api/dev/courses" : `/api/dev/courses/${editing.courseId || editing._id}`;
    await fetch(url, { method: isNew ? "POST" : "PUT", headers, body: JSON.stringify(editing) });
    setSaving(false); setEditing(null); fetchCourses();
  };

  const handleDelete = async (c: Course) => {
    if (!confirm(`Delete "${c.title}"?`)) return;
    await fetch(`/api/dev/courses/${c.courseId || c._id}`, { method: "DELETE", headers });
    fetchCourses();
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const url = await uploadFile(file);
    if (url) setEditing({ ...editing, thumbnail: url });
  };

  const addSection = () => {
    if (!editing) return;
    setEditing({ ...editing, curriculum: [...editing.curriculum, { section: "New Section", lessons: [] }] });
    setExpandedSection(editing.curriculum.length);
  };

  const addLesson = (sectionIdx: number) => {
    if (!editing) return;
    const curr = [...editing.curriculum];
    const lessonNum = curr.reduce((sum, s) => sum + s.lessons.length, 0) + 1;
    curr[sectionIdx].lessons.push({ id: `${editing.courseId}-l${lessonNum}`, title: "", duration: "00:00", free: false });
    setEditing({ ...editing, curriculum: curr });
  };

  const updateSection = (idx: number, field: string, value: string) => {
    if (!editing) return;
    const curr = [...editing.curriculum];
    (curr[idx] as any)[field] = value;
    setEditing({ ...editing, curriculum: curr });
  };

  const updateLesson = (sIdx: number, lIdx: number, field: string, value: any) => {
    if (!editing) return;
    const curr = [...editing.curriculum];
    (curr[sIdx].lessons[lIdx] as any)[field] = value;
    setEditing({ ...editing, curriculum: curr });
  };

  const removeSection = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, curriculum: editing.curriculum.filter((_, i) => i !== idx) });
  };

  const removeLesson = (sIdx: number, lIdx: number) => {
    if (!editing) return;
    const curr = [...editing.curriculum];
    curr[sIdx].lessons = curr[sIdx].lessons.filter((_, i) => i !== lIdx);
    setEditing({ ...editing, curriculum: curr });
  };

  const inputClass = "w-full px-4 py-2.5 bg-[#0a0f1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#3F9FA3]";

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="sticky top-20 bg-[#0a0f1a] z-20 pt-2 pb-6 -mt-2 border-b border-white/5 mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{isNew ? "New Course" : "Edit Course"}</h2>
          <div className="flex gap-3">
            <button onClick={() => setEditing(null)} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"><X className="w-4 h-4" /> Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#3F9FA3] text-white rounded-xl text-sm font-bold hover:bg-[#2d7a7d] transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#3F9FA3]/20"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Course"}</button>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="bg-[#111827] rounded-2xl border border-white/5 p-6">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Thumbnail</label>
          <div className="flex items-start gap-6">
            {editing.thumbnail && <img src={editing.thumbnail} alt="" className="w-48 h-28 object-cover rounded-xl border border-white/10" />}
            <div className="flex-1 space-y-3">
              <input value={editing.thumbnail} onChange={e => setEditing({ ...editing, thumbnail: e.target.value })} placeholder="Thumbnail URL..." className={inputClass} />
              <input ref={fileRef} type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
              <button onClick={() => fileRef.current?.click()} className="px-4 py-2 bg-[#3F9FA3]/10 text-[#3F9FA3] rounded-xl text-xs font-bold hover:bg-[#3F9FA3]/20 flex items-center gap-2"><Upload className="w-3 h-3" /> Upload</button>
            </div>
          </div>
        </div>

        {/* Basic Fields */}
        <div className="bg-[#111827] rounded-2xl border border-white/5 p-6 grid grid-cols-2 gap-5">
          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Course ID</label><input value={editing.courseId} onChange={e => setEditing({ ...editing, courseId: e.target.value })} className={inputClass} placeholder="e.g. imech-101" /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label><input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className={inputClass} /></div>
          <div className="col-span-2"><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label><input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className={inputClass} /></div>
          <div className="col-span-2"><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label><textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className={inputClass + " resize-none"} /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Price (£)</label><input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} className={inputClass} /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Original Price</label><input type="number" value={editing.originalPrice || ""} onChange={e => setEditing({ ...editing, originalPrice: Number(e.target.value) })} className={inputClass} /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Instructor</label><input value={editing.instructor || ""} onChange={e => setEditing({ ...editing, instructor: e.target.value })} className={inputClass} /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Level</label><input value={editing.level || ""} onChange={e => setEditing({ ...editing, level: e.target.value })} className={inputClass} /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Duration</label><input value={editing.duration || ""} onChange={e => setEditing({ ...editing, duration: e.target.value })} className={inputClass} placeholder="e.g. 3 hours 12 minutes" /></div>
        </div>
        {/* Curriculum */}
        <div className="bg-[#111827] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Curriculum</label>
            <button onClick={addSection} className="px-3 py-1.5 bg-[#3F9FA3]/10 text-[#3F9FA3] rounded-lg text-xs font-bold hover:bg-[#3F9FA3]/20 flex items-center gap-1"><Plus className="w-3 h-3" /> Section</button>
          </div>
          <div className="space-y-3">
            {editing.curriculum.map((sec, sIdx) => (
              <div key={sIdx} className="bg-[#0a0f1a] rounded-xl border border-white/5 overflow-hidden">
                <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpandedSection(expandedSection === sIdx ? null : sIdx)}>
                  {expandedSection === sIdx ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  <input value={sec.section} onChange={e => updateSection(sIdx, "section", e.target.value)} onClick={e => e.stopPropagation()} className="flex-1 bg-transparent text-white text-sm font-medium focus:outline-none" />
                  <span className="text-gray-500 text-xs">{sec.lessons.length} lessons</span>
                  <button onClick={e => { e.stopPropagation(); removeSection(sIdx); }} className="p-1 text-gray-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                </div>
                {expandedSection === sIdx && (
                  <div className="px-4 pb-4 space-y-2">
                    {sec.lessons.map((les, lIdx) => (
                      <div key={lIdx} className="flex items-center gap-3 bg-[#111827] rounded-lg p-3">
                        <input value={les.id} onChange={e => updateLesson(sIdx, lIdx, "id", e.target.value)} className="w-32 px-2 py-1 bg-[#0a0f1a] border border-white/10 rounded text-white text-xs focus:outline-none" placeholder="Lesson ID" />
                        <input value={les.title} onChange={e => updateLesson(sIdx, lIdx, "title", e.target.value)} className="flex-1 px-2 py-1 bg-[#0a0f1a] border border-white/10 rounded text-white text-xs focus:outline-none" placeholder="Title" />
                        <input value={(les as any).vimeoId || ""} onChange={e => updateLesson(sIdx, lIdx, "vimeoId", e.target.value)} className="w-40 px-2 py-1 bg-[#0a0f1a] border border-white/10 rounded text-white text-xs focus:outline-none" placeholder="Vimeo ID (e.g. 12345678)" />
                        <input value={les.duration} onChange={e => updateLesson(sIdx, lIdx, "duration", e.target.value)} className="w-20 px-2 py-1 bg-[#0a0f1a] border border-white/10 rounded text-white text-xs focus:outline-none" placeholder="00:00" />
                        <label className="flex items-center gap-1 text-[10px] text-gray-400"><input type="checkbox" checked={les.free} onChange={e => updateLesson(sIdx, lIdx, "free", e.target.checked)} className="accent-[#3F9FA3]" /> Free</label>
                        <button onClick={() => removeLesson(sIdx, lIdx)} className="p-1 text-gray-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                    <button onClick={() => addLesson(sIdx)} className="w-full py-2 text-[#3F9FA3] text-xs font-bold bg-[#3F9FA3]/5 rounded-lg hover:bg-[#3F9FA3]/10 transition-all">+ Add Lesson</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Downloadable Resources */}
        <div className="bg-[#111827] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Downloadable Materials (PDF, Excel, Word)</label>
            <div className="flex gap-2">
              <input 
                type="file" 
                id="resource-upload" 
                className="hidden" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !editing) return;
                  const url = await uploadFile(file);
                  if (url) {
                    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
                    const size = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
                    setEditing({
                      ...editing,
                      downloadableResources: [
                        ...editing.downloadableResources,
                        { title: file.name.split('.')[0], description: `Downloadable ${ext} material`, type: ext, fileSize: size, url }
                      ]
                    });
                  }
                }} 
              />
              <button 
                onClick={() => document.getElementById('resource-upload')?.click()}
                className="px-3 py-1.5 bg-[#3F9FA3] text-white rounded-lg text-xs font-bold hover:bg-[#2d7a7d] flex items-center gap-1 shadow-lg shadow-[#3F9FA3]/20"
              >
                <Plus className="w-3 h-3" /> Upload File
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {editing.downloadableResources.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-xl">
                <p className="text-gray-500 text-xs italic">No materials uploaded yet.</p>
              </div>
            ) : (
              editing.downloadableResources.map((res, rIdx) => (
                <div key={rIdx} className="bg-[#0a0f1a] rounded-xl border border-white/5 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#3F9FA3]/10 flex items-center justify-center text-[#3F9FA3] font-bold text-[10px]">
                    {res.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <input 
                      value={res.title} 
                      onChange={e => {
                        const newRes = [...editing.downloadableResources];
                        newRes[rIdx].title = e.target.value;
                        setEditing({ ...editing, downloadableResources: newRes });
                      }}
                      className="w-full bg-transparent text-white text-sm font-bold focus:outline-none mb-0.5" 
                      placeholder="Resource Title"
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-gray-500">{res.fileSize}</span>
                      <input 
                        value={res.description} 
                        onChange={e => {
                          const newRes = [...editing.downloadableResources];
                          newRes[rIdx].description = e.target.value;
                          setEditing({ ...editing, downloadableResources: newRes });
                        }}
                        className="flex-1 bg-transparent text-[10px] text-gray-400 focus:outline-none" 
                        placeholder="Short description..."
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setEditing({
                        ...editing,
                        downloadableResources: editing.downloadableResources.filter((_, i) => i !== rIdx)
                      });
                    }}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
          <button onClick={() => setEditing(null)} className="px-6 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"><X className="w-4 h-4" /> Discard Changes</button>
          <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-[#3F9FA3] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#2d7a7d] transition-all disabled:opacity-50 shadow-lg shadow-[#3F9FA3]/20"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save All Changes"}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white">Courses</h2><p className="text-gray-500 text-sm mt-1">{courses.length} courses</p></div>
        <button onClick={() => { setEditing({ ...EMPTY, curriculum: [], downloadableResources: [] }); setIsNew(true); }} className="px-5 py-2.5 bg-[#3F9FA3] text-white rounded-xl text-sm font-bold hover:bg-[#2d7a7d] flex items-center gap-2"><Plus className="w-4 h-4" /> New Course</button>
      </div>
      {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#3F9FA3] border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="space-y-3">
          {courses.map(c => (
            <div key={c._id || c.courseId} className="bg-[#111827] rounded-xl border border-white/5 p-4 flex items-center gap-4 hover:border-[#3F9FA3]/20 transition-all">
              {c.thumbnail && <img src={c.thumbnail} alt="" className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm truncate">{c.title}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{c.category} · £{c.price} · {c.lessonsCount || 0} lessons</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing({ ...c }); setIsNew(false); }} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-[#3F9FA3] hover:bg-[#3F9FA3]/10 transition-all"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(c)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
