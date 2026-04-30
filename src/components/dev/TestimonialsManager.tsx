"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Save, X, Upload, Star, MessageSquare } from "lucide-react";

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);


interface Testimonial {
  _id?: string; testimonialId: string; name: string; role: string; company?: string;
  image: string; quote: string; rating: number; platform: string; date: string;
  category: string; featured: boolean; linkedInUrl?: string;
}

const EMPTY: Testimonial = { testimonialId: "", name: "", role: "", company: "", image: "", quote: "", rating: 5, platform: "LinkedIn", date: "", category: "General", featured: false, linkedInUrl: "" };
const PLATFORMS = ["LinkedIn", "Trustpilot", "Direct", "Google"];
const CATEGORIES = ["IMechE", "NCEES", "ICE", "IET", "General"];
const inputClass = "w-full px-4 py-2.5 bg-[#0a0f1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#3F9FA3]";

export default function TestimonialsManager({ headers, uploadFile }: { headers: any; uploadFile: (f: File) => Promise<string | null> }) {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => { setLoading(true); const res = await fetch("/api/dev/testimonials", { headers }); setItems(await res.json()); setLoading(false); };
  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (!editing.date) editing.date = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
      const url = isNew ? "/api/dev/testimonials" : `/api/dev/testimonials/${editing.testimonialId || editing._id}`;
      const res = await fetch(url, { 
        method: isNew ? "POST" : "PUT", 
        headers, 
        body: JSON.stringify(editing) 
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setEditing(null);
      await fetchItems();
    } catch (err: any) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (t: Testimonial) => {
    if (!confirm(`Delete testimonial from "${t.name}"?`)) return;
    await fetch(`/api/dev/testimonials/${t.testimonialId || t._id}`, { method: "DELETE", headers });
    fetchItems();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const url = await uploadFile(file);
    if (url) setEditing({ ...editing, image: url });
  };

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="sticky top-20 bg-[#0a0f1a] z-20 pt-2 pb-6 -mt-2 border-b border-white/5 mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{isNew ? "New Testimonial" : "Edit Testimonial"}</h2>
          <div className="flex gap-3">
            <button onClick={() => setEditing(null)} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm flex items-center gap-2"><X className="w-4 h-4" /> Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#3F9FA3] text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#3F9FA3]/20"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Testimonial"}</button>
          </div>
        </div>

        {/* Photo */}
        <div className="bg-[#111827] rounded-2xl border border-white/5 p-6">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Profile Photo</label>
          <div className="flex items-center gap-6">
            {editing.image && <img src={editing.image} alt="" className="w-20 h-20 object-cover rounded-full border-2 border-white/10" />}
            <div className="flex-1 space-y-3">
              <input value={editing.image} onChange={e => setEditing({ ...editing, image: e.target.value })} placeholder="Image URL..." className={inputClass} />
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <button onClick={() => fileRef.current?.click()} className="px-4 py-2 bg-[#3F9FA3]/10 text-[#3F9FA3] rounded-xl text-xs font-bold flex items-center gap-2"><Upload className="w-3 h-3" /> Upload</button>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-2xl border border-white/5 p-6 grid grid-cols-2 gap-5">
          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Name</label><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className={inputClass} /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Role</label><input value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })} className={inputClass} /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Company</label><input value={editing.company || ""} onChange={e => setEditing({ ...editing, company: e.target.value })} className={inputClass} /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Platform</label>
            <select value={editing.platform} onChange={e => setEditing({ ...editing, platform: e.target.value })} className={inputClass}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
            <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className={inputClass}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setEditing({ ...editing, rating: n })} className={`p-1 ${n <= editing.rating ? "text-amber-400" : "text-gray-600"}`}>
                  <Star className="w-5 h-5" fill={n <= editing.rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-2"><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">LinkedIn URL</label><input value={editing.linkedInUrl || ""} onChange={e => setEditing({ ...editing, linkedInUrl: e.target.value })} className={inputClass} placeholder="https://linkedin.com/in/..." /></div>
          <div className="col-span-2"><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Quote</label><textarea value={editing.quote} onChange={e => setEditing({ ...editing, quote: e.target.value })} rows={4} className={inputClass + " resize-none"} /></div>
          <div className="col-span-2 flex items-center gap-3">
            <input type="checkbox" checked={editing.featured} onChange={e => setEditing({ ...editing, featured: e.target.checked })} className="w-4 h-4 accent-[#3F9FA3]" />
            <span className="text-sm text-gray-400 font-medium">Featured Testimonial</span>
          </div>
        </div>
        <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
          <button onClick={() => setEditing(null)} className="px-6 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"><X className="w-4 h-4" /> Discard Changes</button>
          <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-[#3F9FA3] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#2d7a7d] transition-all disabled:opacity-50 shadow-lg shadow-[#3F9FA3]/20"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Testimonial"}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#111827] p-6 rounded-2xl border border-white/5 shadow-xl shadow-[#3F9FA3]/5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#3F9FA3]" />
            Testimonials
          </h2>
          <p className="text-gray-500 text-sm mt-1">{items.length} reviews managed</p>
        </div>
        <button 
          onClick={() => { setEditing({ ...EMPTY, testimonialId: `test-${Date.now()}` }); setIsNew(true); }} 
          className="px-6 py-3 bg-[#3F9FA3] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#2d7a7d] transition-all shadow-lg shadow-[#3F9FA3]/20"
        >
          <Plus className="w-5 h-5" /> New Testimonial
        </button>
      </div>
      {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#3F9FA3] border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="space-y-3">
          {items.map(t => (
            <div key={t._id || t.testimonialId} className="bg-[#111827] rounded-xl border border-white/5 p-4 flex items-center gap-4 hover:border-[#3F9FA3]/20 transition-all">
              {t.image && <img src={t.image} alt="" className="w-12 h-12 object-cover rounded-full flex-shrink-0 border border-white/10" />}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm">{t.name}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{t.role} · {t.company} · {t.platform}</p>
              </div>
              <div className="flex gap-0.5">{[1,2,3,4,5].map(n => <Star key={n} className={`w-3 h-3 ${n <= t.rating ? "text-amber-400" : "text-gray-700"}`} fill={n <= t.rating ? "currentColor" : "none"} />)}</div>
              {t.featured && <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-lg">Featured</span>}
              <div className="flex gap-2">
                <button onClick={() => { setEditing({ ...t }); setIsNew(false); }} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-[#3F9FA3] hover:bg-[#3F9FA3]/10"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(t)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
