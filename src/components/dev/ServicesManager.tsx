"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronUp } from "lucide-react";

interface ServiceItem { serviceId: string; title: string; description: string; price: number; originalPrice?: number; popular?: boolean; features: string[]; calendlyUrl: string; }
interface Step { stepNumber: number; title: string; description: string; content?: string; }
interface FAQ { question: string; answer: string; }
interface ServicePage {
  _id?: string; pageId: string; title: string; description: string; icon: string;
  image?: string; features: string[]; stepByStepProcess: Step[]; faqs: FAQ[]; services: ServiceItem[];
}

const inputClass = "w-full px-4 py-2.5 bg-[#0a0f1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#3F9FA3]";

export default function ServicesManager({ headers }: { headers: any }) {
  const [pages, setPages] = useState<ServicePage[]>([]);
  const [editing, setEditing] = useState<ServicePage | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"info" | "packages" | "steps" | "faqs">("info");

  const fetchPages = async () => { setLoading(true); const res = await fetch("/api/dev/services", { headers, cache: 'no-store' }); setPages(await res.json()); setLoading(false); };
  useEffect(() => { fetchPages(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    
    // Uniqueness validation
    const ids = editing.services.map(s => s.serviceId.trim()).filter(id => id !== "");
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      alert("Error: All service package IDs must be unique within this service.");
      return;
    }

    // Global Uniqueness validation (across all services)
    const otherPages = pages.filter(p => (p.pageId || p._id) !== (editing.pageId || editing._id));
    const allExistingIds = new Set<string>();
    otherPages.forEach(p => p.services.forEach(s => allExistingIds.add(s.serviceId.trim())));
    
    for (const id of ids) {
      if (allExistingIds.has(id)) {
        alert(`Error: The Service ID "${id}" is already used in another service page. Please use a unique ID.`);
        return;
      }
    }

    setSaving(true);
    try {
      const url = isNew ? "/api/dev/services" : `/api/dev/services/${editing._id || editing.pageId}`;
      const res = await fetch(url, { 
        method: isNew ? "POST" : "PUT", 
        headers, 
        body: JSON.stringify(editing) 
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save");
      }
      
      alert("✅ Service page saved successfully!");
      setEditing(null); 
      await fetchPages();
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: ServicePage) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try {
      const res = await fetch(`/api/dev/services/${p._id || p.pageId}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error("Failed to delete");
      alert("✅ Deleted successfully");
      fetchPages();
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  // Service package helpers
  const addPackage = () => { 
    if (!editing) return; 
    const randomId = Math.random().toString(36).substring(2, 8);
    const newId = `pkg-${randomId}`;
    setEditing({ ...editing, services: [...editing.services, { serviceId: newId, title: "", description: "", price: 0, features: [], calendlyUrl: "https://calendly.com/" }] }); 
  };
  const updatePackage = (idx: number, field: string, value: any) => { 
    if (!editing) return;
    const s = [...editing.services]; 
    (s[idx] as any)[field] = value; 
    setEditing({ ...editing, services: s }); 
  };
  const removePackage = (idx: number) => { 
    if (!editing) return;
    setEditing({ ...editing, services: editing.services.filter((_, i) => i !== idx) }); 
  };

  // Step helpers
  const addStep = () => { if (!editing) return; const num = editing.stepByStepProcess.length + 1; setEditing({ ...editing, stepByStepProcess: [...editing.stepByStepProcess, { stepNumber: num, title: "", description: "", content: "" }] }); };
  const updateStep = (idx: number, field: string, value: any) => { const s = [...editing!.stepByStepProcess]; (s[idx] as any)[field] = value; setEditing({ ...editing!, stepByStepProcess: s }); };
  const removeStep = (idx: number) => { setEditing({ ...editing!, stepByStepProcess: editing!.stepByStepProcess.filter((_, i) => i !== idx) }); };

  // FAQ helpers
  const addFaq = () => { if (!editing) return; setEditing({ ...editing, faqs: [...editing.faqs, { question: "", answer: "" }] }); };
  const updateFaq = (idx: number, field: string, value: string) => { const f = [...editing!.faqs]; (f[idx] as any)[field] = value; setEditing({ ...editing!, faqs: f }); };
  const removeFaq = (idx: number) => { setEditing({ ...editing!, faqs: editing!.faqs.filter((_, i) => i !== idx) }); };

  // Feature helpers for packages
  const [featureInputs, setFeatureInputs] = useState<Record<number, string>>({});
  const addFeatureToPackage = (idx: number) => {
    const val = featureInputs[idx]?.trim();
    if (!val || !editing) return;
    const s = [...editing.services];
    s[idx].features = [...s[idx].features, val];
    setEditing({ ...editing, services: s });
    setFeatureInputs({ ...featureInputs, [idx]: "" });
  };

  if (editing) {
    const tabs = [
      { id: "info" as const, label: "Basic Info" },
      { id: "packages" as const, label: `Packages (${editing.services.length})` },
      { id: "steps" as const, label: `Steps (${editing.stepByStepProcess.length})` },
      { id: "faqs" as const, label: `FAQs (${editing.faqs.length})` },
    ];

    return (
      <div className="space-y-6">
        <div className="sticky top-20 bg-[#0a0f1a] z-20 pt-2 pb-6 -mt-2 border-b border-white/5 mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{isNew ? "New Service Page" : `Edit: ${editing.title}`}</h2>
          <div className="flex gap-3">
            <button onClick={() => setEditing(null)} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm flex items-center gap-2 hover:bg-white/10 transition-all"><X className="w-4 h-4" /> Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#3F9FA3] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#2d7a7d] transition-all disabled:opacity-50 shadow-lg shadow-[#3F9FA3]/20"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t.id ? "bg-[#3F9FA3] text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>{t.label}</button>
          ))}
        </div>

        {tab === "info" && (
          <div className="bg-[#111827] rounded-2xl border border-white/5 p-6 grid grid-cols-2 gap-5">
            <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Page ID</label><input value={editing.pageId} onChange={e => setEditing({ ...editing, pageId: e.target.value })} className={inputClass} placeholder="e.g. us-pe" /></div>
            <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Icon</label><input value={editing.icon} onChange={e => setEditing({ ...editing, icon: e.target.value })} className={inputClass} /></div>
            <div className="col-span-2"><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label><input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className={inputClass} /></div>
            <div className="col-span-2"><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label><textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className={inputClass + " resize-none"} /></div>
          </div>
        )}

        {tab === "packages" && (
          <div className="space-y-4">
            {editing.services.map((pkg, idx) => (
              <div key={idx} className="bg-[#111827] rounded-2xl border border-white/5 p-6 space-y-4">
                <div className="flex items-center justify-between"><h4 className="text-white font-bold text-sm">{pkg.title || `Package ${idx + 1}`}</h4><button onClick={() => removePackage(idx)} className="p-1 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-[10px] text-gray-500 uppercase mb-1">Service ID</label><input value={pkg.serviceId} onChange={e => updatePackage(idx, "serviceId", e.target.value)} className={inputClass} /></div>
                  <div><label className="block text-[10px] text-gray-500 uppercase mb-1">Title</label><input value={pkg.title} onChange={e => updatePackage(idx, "title", e.target.value)} className={inputClass} /></div>
                  <div><label className="block text-[10px] text-gray-500 uppercase mb-1">Price (£)</label><input type="number" value={pkg.price} onChange={e => updatePackage(idx, "price", Number(e.target.value))} className={inputClass} /></div>
                  <div><label className="block text-[10px] text-gray-500 uppercase mb-1">Original Price (£)</label><input type="number" value={pkg.originalPrice || ""} onChange={e => updatePackage(idx, "originalPrice", Number(e.target.value))} className={inputClass} placeholder="Leave empty if no discount" /></div>
                  <div><label className="block text-[10px] text-gray-500 uppercase mb-1">Calendly URL</label><input value={pkg.calendlyUrl} onChange={e => updatePackage(idx, "calendlyUrl", e.target.value)} className={inputClass} placeholder="https://calendly.com/..." /></div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={pkg.popular || false} onChange={e => updatePackage(idx, "popular", e.target.checked)} className="w-4 h-4 accent-[#3F9FA3]" />
                      <span className="text-xs text-gray-400 font-bold uppercase">Most Popular</span>
                    </label>
                  </div>
                  <div className="col-span-2"><label className="block text-[10px] text-gray-500 uppercase mb-1">Description</label><textarea value={pkg.description} onChange={e => updatePackage(idx, "description", e.target.value)} rows={2} className={inputClass + " resize-none"} /></div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Features</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">{pkg.features.map((f, fi) => (
                      <span key={fi} className="px-2 py-1 bg-[#3F9FA3]/10 text-[#3F9FA3] text-[10px] font-bold rounded-lg flex items-center gap-1">{f}<button onClick={() => { const s = [...editing.services]; s[idx].features = s[idx].features.filter((_, j) => j !== fi); setEditing({ ...editing, services: s }); }}><X className="w-2 h-2" /></button></span>
                    ))}</div>
                    <div className="flex gap-2"><input value={featureInputs[idx] || ""} onChange={e => setFeatureInputs({ ...featureInputs, [idx]: e.target.value })} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeatureToPackage(idx))} placeholder="Add feature..." className={inputClass} /><button onClick={() => addFeatureToPackage(idx)} className="px-3 py-2 bg-[#3F9FA3]/10 text-[#3F9FA3] rounded-xl text-xs font-bold">Add</button></div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addPackage} className="w-full py-3 bg-[#3F9FA3]/5 text-[#3F9FA3] rounded-xl text-sm font-bold hover:bg-[#3F9FA3]/10 flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Package</button>
          </div>
        )}

        {tab === "steps" && (
          <div className="space-y-3">
            {editing.stepByStepProcess.map((step, idx) => (
              <div key={idx} className="bg-[#111827] rounded-xl border border-white/5 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3F9FA3]/10 text-[#3F9FA3] rounded-lg flex items-center justify-center text-xs font-bold">{step.stepNumber}</span>
                  <input value={step.title} onChange={e => updateStep(idx, "title", e.target.value)} className="flex-1 bg-transparent text-white text-sm font-medium focus:outline-none" placeholder="Step title" />
                  <button onClick={() => removeStep(idx)} className="p-1 text-gray-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                </div>
                <input value={step.description} onChange={e => updateStep(idx, "description", e.target.value)} className={inputClass} placeholder="Short description" />
                <textarea value={step.content || ""} onChange={e => updateStep(idx, "content", e.target.value)} rows={3} className={inputClass + " resize-none"} placeholder="Detailed content (shown in modal)" />
              </div>
            ))}
            <button onClick={addStep} className="w-full py-3 bg-[#3F9FA3]/5 text-[#3F9FA3] rounded-xl text-sm font-bold hover:bg-[#3F9FA3]/10 flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Step</button>
          </div>
        )}

        {tab === "faqs" && (
          <div className="space-y-3">
            {editing.faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#111827] rounded-xl border border-white/5 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <input value={faq.question} onChange={e => updateFaq(idx, "question", e.target.value)} className="flex-1 bg-transparent text-white text-sm font-medium focus:outline-none" placeholder="Question" />
                  <button onClick={() => removeFaq(idx)} className="p-1 text-gray-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                </div>
                <textarea value={faq.answer} onChange={e => updateFaq(idx, "answer", e.target.value)} rows={2} className={inputClass + " resize-none"} placeholder="Answer" />
              </div>
            ))}
            <button onClick={addFaq} className="w-full py-3 bg-[#3F9FA3]/5 text-[#3F9FA3] rounded-xl text-sm font-bold hover:bg-[#3F9FA3]/10 flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add FAQ</button>
          </div>
        )}
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
        <div><h2 className="text-2xl font-bold text-white">Service Pages</h2><p className="text-gray-500 text-sm mt-1">{pages.length} pages</p></div>
        <button onClick={() => { setEditing({ pageId: "", title: "", description: "", icon: "Briefcase", features: [], stepByStepProcess: [], faqs: [], services: [] }); setIsNew(true); }} className="px-5 py-2.5 bg-[#3F9FA3] text-white rounded-xl text-sm font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> New Service</button>
      </div>
      {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#3F9FA3] border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="space-y-3">
          {pages.map(p => (
            <div key={p._id || p.pageId} className="bg-[#111827] rounded-xl border border-white/5 p-4 flex items-center gap-4 hover:border-[#3F9FA3]/20 transition-all">
              <div className="w-12 h-12 bg-[#3F9FA3]/10 rounded-xl flex items-center justify-center text-[#3F9FA3] font-bold text-lg">{p.title.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm">{p.title}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{p.services.length} packages · {p.stepByStepProcess.length} steps · {p.faqs.length} FAQs</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing({ ...p }); setIsNew(false); setTab("info"); }} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-[#3F9FA3] hover:bg-[#3F9FA3]/10"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(p)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
