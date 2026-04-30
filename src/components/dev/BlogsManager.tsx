"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Save, X, Upload, Eye } from "lucide-react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface Blog {
  _id?: string; blogId: string; service: string; title: string; desc: string;
  img: string; author: string; date: string; readTime: string; tags: string[];
  content: string; featured: boolean;
}

const EMPTY: Blog = { blogId: "", service: "US PE", title: "", desc: "", img: "", author: "Prof.Max oyom", date: "", readTime: "8 min", tags: [], content: "", featured: false };
const SERVICES = ["US PE", "IMECHE", "IET", "ICE", "P.Eng."];

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

export default function BlogsManager({ headers, uploadFile }: { headers: any; uploadFile: (f: File) => Promise<string | null> }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    const res = await fetch("/api/dev/blogs", { headers });
    setBlogs(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const url = isNew ? "/api/dev/blogs" : `/api/dev/blogs/${editing.blogId || editing._id}`;
    const method = isNew ? "POST" : "PUT";
    if (!editing.date) editing.date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    await fetch(url, { method, headers, body: JSON.stringify(editing) });
    setSaving(false);
    setEditing(null);
    fetchBlogs();
  };

  const handleDelete = async (blog: Blog) => {
    if (!confirm(`Delete "${blog.title}"?`)) return;
    await fetch(`/api/dev/blogs/${blog.blogId || blog._id}`, { method: "DELETE", headers });
    fetchBlogs();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const url = await uploadFile(file);
    if (url) setEditing({ ...editing, img: url });
  };

  const addTag = () => {
    if (tagInput.trim() && editing && !editing.tags.includes(tagInput.trim())) {
      setEditing({ ...editing, tags: [...editing.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="sticky top-20 bg-[#0a0f1a] z-20 pt-2 pb-6 -mt-2 border-b border-white/5 mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{isNew ? "New Blog Post" : "Edit Blog Post"}</h2>
          <div className="flex gap-3">
            <button onClick={() => setEditing(null)} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"><X className="w-4 h-4" /> Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#3F9FA3] text-white rounded-xl text-sm font-bold hover:bg-[#2d7a7d] transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#3F9FA3]/20"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Blog"}</button>
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-[#111827] rounded-2xl border border-white/5 p-6">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Cover Image</label>
          <div className="flex items-start gap-6">
            {editing.img && <img src={editing.img} alt="cover" className="w-48 h-32 object-cover rounded-xl border border-white/10" />}
            <div className="flex-1 space-y-3">
              <input value={editing.img} onChange={e => setEditing({ ...editing, img: e.target.value })} placeholder="Image URL..." className="w-full px-4 py-2.5 bg-[#0a0f1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#3F9FA3]" />
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <button onClick={() => fileRef.current?.click()} className="px-4 py-2 bg-[#3F9FA3]/10 text-[#3F9FA3] rounded-xl text-xs font-bold hover:bg-[#3F9FA3]/20 transition-all flex items-center gap-2"><Upload className="w-3 h-3" /> Upload to Cloudinary</button>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="bg-[#111827] rounded-2xl border border-white/5 p-6 grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
            <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full px-4 py-2.5 bg-[#0a0f1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#3F9FA3]" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
            <textarea value={editing.desc} onChange={e => setEditing({ ...editing, desc: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-[#0a0f1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#3F9FA3] resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Service</label>
            <select value={editing.service} onChange={e => setEditing({ ...editing, service: e.target.value })} className="w-full px-4 py-2.5 bg-[#0a0f1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#3F9FA3]">
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Author</label>
            <input value={editing.author} onChange={e => setEditing({ ...editing, author: e.target.value })} className="w-full px-4 py-2.5 bg-[#0a0f1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#3F9FA3]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Read Time</label>
            <input value={editing.readTime} onChange={e => setEditing({ ...editing, readTime: e.target.value })} className="w-full px-4 py-2.5 bg-[#0a0f1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#3F9FA3]" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={editing.featured} onChange={e => setEditing({ ...editing, featured: e.target.checked })} className="w-4 h-4 accent-[#3F9FA3]" />
              <span className="text-sm text-gray-400 font-medium">Featured Post</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editing.tags.map((t, i) => (
                <span key={i} className="px-3 py-1 bg-[#3F9FA3]/10 text-[#3F9FA3] text-xs font-bold rounded-lg flex items-center gap-1.5">
                  {t} <button onClick={() => setEditing({ ...editing, tags: editing.tags.filter((_, j) => j !== i) })} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tag..." className="flex-1 px-4 py-2 bg-[#0a0f1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#3F9FA3]" />
              <button onClick={addTag} className="px-4 py-2 bg-[#3F9FA3]/10 text-[#3F9FA3] rounded-xl text-xs font-bold">Add</button>
            </div>
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="bg-[#111827] rounded-2xl border border-white/5 p-6">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Content</label>
          <div className="bg-white rounded-xl overflow-hidden">
            <ReactQuill theme="snow" value={editing.content} onChange={val => setEditing({ ...editing, content: val })} modules={quillModules} style={{ minHeight: 300 }} />
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
          <button onClick={() => setEditing(null)} className="px-6 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"><X className="w-4 h-4" /> Discard Changes</button>
          <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-[#3F9FA3] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#2d7a7d] transition-all disabled:opacity-50 shadow-lg shadow-[#3F9FA3]/20"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Publish Blog Post"}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
          <p className="text-gray-500 text-sm mt-1">{blogs.length} articles</p>
        </div>
        <button onClick={() => { setEditing({ ...EMPTY }); setIsNew(true); }} className="px-5 py-2.5 bg-[#3F9FA3] text-white rounded-xl text-sm font-bold hover:bg-[#2d7a7d] transition-all flex items-center gap-2"><Plus className="w-4 h-4" /> New Blog</button>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#3F9FA3] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {blogs.map(blog => (
            <div key={blog._id || blog.blogId} className="bg-[#111827] rounded-xl border border-white/5 p-4 flex items-center gap-4 hover:border-[#3F9FA3]/20 transition-all">
              {blog.img && <img src={blog.img} alt="" className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm truncate">{blog.title}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{blog.service} · {blog.author} · {blog.date}</p>
              </div>
              {blog.featured && <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-lg uppercase">Featured</span>}
              <div className="flex gap-2">
                <button onClick={() => { setEditing({ ...blog }); setIsNew(false); }} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-[#3F9FA3] hover:bg-[#3F9FA3]/10 transition-all"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(blog)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
