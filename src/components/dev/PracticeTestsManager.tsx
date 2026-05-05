"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Save, X, Upload, FileUp, ChevronDown, ChevronUp } from "lucide-react";
import * as XLSX from "xlsx";

interface Question { question: string; options: string[]; correctAnswer: number; explanation?: string; }
interface PracticeTest {
  _id?: string; testId: string; title: string; description: string; image?: string;
  category: string; duration: number; questionsCount: number; instructor?: string;
  level: string; rating?: number; reviews?: number; price: number;
  originalPrice?: number; isFree: boolean; questions: Question[];
  passPercentage?: number;
}

const EMPTY: PracticeTest = { testId: "", title: "", description: "", category: "Ethics", duration: 30, questionsCount: 0, level: "Intermediate", price: 0, isFree: false, questions: [], passPercentage: 65 };
const inputClass = "w-full px-4 py-2.5 bg-[#0a0f1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#3F9FA3]";

export default function PracticeTestsManager({ headers, uploadFile }: { headers: any; uploadFile?: (file: File) => Promise<string | null> }) {
  const [tests, setTests] = useState<PracticeTest[]>([]);
  const [editing, setEditing] = useState<PracticeTest | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"info" | "questions">("info");
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [activeDevPhase, setActiveDevPhase] = useState(0);
  const csvRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const excelRef = useRef<HTMLInputElement>(null);

  const fetchTests = async () => { setLoading(true); const res = await fetch("/api/dev/practice-tests", { headers, cache: 'no-store' }); setTests(await res.json()); setLoading(false); };
  useEffect(() => { fetchTests(); }, []);

  const loadFullTest = async (testId: string) => {
    const res = await fetch(`/api/dev/practice-tests/${testId}`, { headers });
    return await res.json();
  };

  const handleSave = async () => {
    if (!editing) return;

    // Validation
    if (!editing.testId || editing.testId.trim() === "") {
      setTab("info");
      alert("⚠️ Test ID is required. Please provide a unique ID (e.g., 'ethics-test-1').");
      return;
    }
    if (!editing.title || editing.title.trim() === "") {
      setTab("info");
      alert("⚠️ Test Title is required.");
      return;
    }
    if (!editing.category || editing.category.trim() === "") {
      setTab("info");
      alert("⚠️ Category is required.");
      return;
    }

    setSaving(true);
    editing.questionsCount = editing.questions.length;
    const url = isNew ? "/api/dev/practice-tests" : `/api/dev/practice-tests/${editing._id || editing.testId}`;
    try {
      const res = await fetch(url, { method: isNew ? "POST" : "PUT", headers, body: JSON.stringify(editing) });
      if (!res.ok) {
        const err = await res.json();
        alert(`❌ Failed to save: ${err.error || 'Unknown error'}`);
      } else {
        alert("✅ Practice test saved successfully!");
        setEditing(null); 
        await fetchTests();
      }
    } catch (e: any) {
      alert(`❌ Network error: ${e.message}`);
    }
    setSaving(false); 
  };

  const handleDelete = async (t: PracticeTest) => {
    if (!confirm(`Delete "${t.title}"?`)) return;
    try {
      const res = await fetch(`/api/dev/practice-tests/${t._id || t.testId}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error("Failed to delete");
      alert("✅ Deleted successfully");
      fetchTests();
    } catch (e: any) {
      alert(`❌ Error: ${e.message}`);
    }
  };

  const handleCSVImport = async () => {
    if (!editing || !csvText.trim()) return;
    setImporting(true);
    const res = await fetch(`/api/dev/practice-tests/${editing.testId}/import`, {
      method: "POST", headers, body: JSON.stringify({ csvData: csvText }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`✅ Imported ${data.imported} questions! Total: ${data.totalQuestions}`);
      const full = await loadFullTest(editing.testId);
      setEditing(full);
      setCsvText("");
    } else {
      alert(`❌ Error: ${data.error}`);
    }
    setImporting(false);
  };

  const handleCSVFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setCsvText(ev.target?.result as string || ""); };
    reader.readAsText(file);
  };

  const handleExcelFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setImporting(true);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      
      const newQuestions: Question[] = [];
      
      // Start loop from 1 to skip the header row
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[0]) continue;
        
        const questionText = String(row[0] || "").trim();
        
        // Extract up to 6 options
        const options: string[] = [];
        const optionIndexes = [2, 4, 6, 8, 10, 12];
        optionIndexes.forEach(idx => {
          if (row[idx] && String(row[idx]).trim() !== "") {
            options.push(String(row[idx]).trim());
          }
        });
        
        if (options.length === 0) continue;
        
        // Map Correct Answers (Column O = index 14) from 1-based to 0-based
        let correctIndex = 0;
        if (row[14] !== undefined) {
          const rawCorrect = String(row[14]).trim();
          const parsedInt = parseInt(rawCorrect, 10);
          if (!isNaN(parsedInt) && parsedInt > 0 && parsedInt <= options.length) {
            correctIndex = parsedInt - 1;
          }
        }
        
        // Overall Explanation (Column P = index 15)
        const explanation = String(row[15] || "").trim();
        
        newQuestions.push({
          question: questionText,
          options: options,
          correctAnswer: correctIndex,
          explanation: explanation
        });
      }
      
      if (newQuestions.length > 0) {
        setEditing({ ...editing, questions: [...editing.questions, ...newQuestions] });
        alert(`✅ Successfully extracted ${newQuestions.length} questions from Excel! Please review them and click "Save All Changes".`);
      } else {
        alert("❌ No valid questions found. Please ensure your Excel matches the 16-column format.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to parse Excel file.");
    } finally {
      setImporting(false);
      if (excelRef.current) excelRef.current.value = "";
    }
  };

  const addQuestion = () => {
    if (!editing) return;
    setEditing({ ...editing, questions: [...editing.questions, { question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }] });
    setExpandedQ(editing.questions.length);
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    if (!editing) return;
    const qs = [...editing.questions];
    (qs[idx] as any)[field] = value;
    setEditing({ ...editing, questions: qs });
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    if (!editing) return;
    const qs = [...editing.questions];
    qs[qIdx].options[oIdx] = value;
    setEditing({ ...editing, questions: qs });
  };

  const removeQuestion = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, questions: editing.questions.filter((_, i) => i !== idx) });
  };

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="sticky top-20 bg-[#0a0f1a] z-20 pt-2 pb-6 -mt-2 border-b border-white/5 mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{isNew ? "New Test" : `Edit: ${editing.title}`}</h2>
          <div className="flex gap-3">
            <button onClick={() => setEditing(null)} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm flex items-center gap-2"><X className="w-4 h-4" /> Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#3F9FA3] text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#3F9FA3]/20"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Test"}</button>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setTab("info")} className={`px-4 py-2 rounded-xl text-xs font-bold ${tab === "info" ? "bg-[#3F9FA3] text-white" : "bg-white/5 text-gray-400"}`}>Test Info</button>
          <button onClick={() => setTab("questions")} className={`px-4 py-2 rounded-xl text-xs font-bold ${tab === "questions" ? "bg-[#3F9FA3] text-white" : "bg-white/5 text-gray-400"}`}>Questions ({editing.questions.length})</button>
        </div>

        {tab === "info" && (
          <div className="bg-[#111827] rounded-2xl border border-white/5 p-6 grid grid-cols-2 gap-5">
            <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Test ID</label><input value={editing.testId} onChange={e => setEditing({ ...editing, testId: e.target.value })} className={inputClass} /></div>
            <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label><input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className={inputClass} /></div>
            <div className="col-span-2"><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label><input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className={inputClass} /></div>
            <div className="col-span-2"><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label><textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className={inputClass + " resize-none"} /></div>
            <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Duration (min)</label><input type="number" value={editing.duration} onChange={e => setEditing({ ...editing, duration: Number(e.target.value) })} className={inputClass} /></div>
            <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Level</label><input value={editing.level} onChange={e => setEditing({ ...editing, level: e.target.value })} className={inputClass} /></div>
            <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Price (CAD)</label><input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} className={inputClass} /></div>
            <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Pass Score (%)</label><input type="number" value={editing.passPercentage || 65} onChange={e => setEditing({ ...editing, passPercentage: Number(e.target.value) })} className={inputClass} /></div>
            <div className="flex items-end"><label className="flex items-center gap-3"><input type="checkbox" checked={editing.isFree} onChange={e => setEditing({ ...editing, isFree: e.target.checked })} className="w-4 h-4 accent-[#3F9FA3]" /><span className="text-sm text-gray-400">Free Test</span></label></div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cover Image</label>
              <div className="flex items-start gap-4">
                {editing.image && (
                  <img src={editing.image} className="w-24 h-24 rounded-xl object-cover border border-white/10" alt="Preview" />
                )}
                <div className="flex-1">
                  <input
                    type="text"
                    value={editing.image || ""}
                    onChange={e => setEditing({ ...editing, image: e.target.value })}
                    className={inputClass + " mb-2"}
                    placeholder="Image URL"
                  />
                  <input
                    type="file"
                    ref={fileRef}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && uploadFile) {
                        setUploading(true);
                        const url = await uploadFile(file);
                        if (url) setEditing({ ...editing, image: url });
                        setUploading(false);
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading || !uploadFile}
                    className="px-4 py-2 bg-white/5 text-gray-400 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-white/10 disabled:opacity-50"
                  >
                    <Upload className="w-3 h-3" /> {uploading ? "Uploading..." : "Upload New Photo"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "questions" && (
          <div className="space-y-4">
            {/* CSV & Excel Import */}
            <div className="bg-[#111827] rounded-2xl border border-white/5 p-6 mb-4">
              <h4 className="text-white font-bold text-sm mb-3">Import Questions</h4>
              <p className="text-gray-500 text-xs mb-4">
                <strong>CSV Format:</strong> question, optionA, optionB, optionC, optionD, correctAnswer (0-3), explanation<br/>
                <strong>Excel (.xlsx) Format:</strong> 16-columns (6 Options Layout). Correct Answer in Column O, Overall Explanation in Column P.
              </p>
              
              {/* CSV Upload */}
              <div className="mb-4 pb-4 border-b border-white/5">
                <textarea value={csvText} onChange={e => setCsvText(e.target.value)} rows={3} className={inputClass + " resize-none mb-3 font-mono text-xs"} placeholder="Paste CSV data here..." />
                <div className="flex gap-3">
                  <input ref={csvRef} type="file" accept=".csv,.txt" onChange={handleCSVFile} className="hidden" />
                  <button onClick={() => csvRef.current?.click()} className="px-4 py-2 bg-white/5 text-gray-400 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-white/10"><FileUp className="w-3 h-3" /> Load CSV File</button>
                  <button onClick={handleCSVImport} disabled={importing || !csvText.trim()} className="px-4 py-2 bg-[#3F9FA3] text-white rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-50"><Upload className="w-3 h-3" /> {importing ? "Importing..." : "Import CSV"}</button>
                </div>
              </div>

              {/* Excel Upload */}
              <div>
                <input ref={excelRef} type="file" accept=".xlsx,.xls" onChange={handleExcelFile} className="hidden" />
                <button onClick={() => excelRef.current?.click()} disabled={importing} className="px-4 py-2 bg-[#107c41] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#0c6132] disabled:opacity-50 shadow-lg shadow-[#107c41]/20">
                  <FileUp className="w-3 h-3" /> {importing ? "Processing Excel..." : "Upload Excel (.xlsx)"}
                </button>
              </div>
            </div>

            {/* Phase Selection for Dev Panel */}
            {editing.questions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 bg-white/5 p-3 rounded-xl border border-white/5">
                {Array.from({ length: Math.ceil(editing.questions.length / 110) }).map((_, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => setActiveDevPhase(pIdx)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      activeDevPhase === pIdx 
                        ? "bg-[#3F9FA3] text-white" 
                        : "bg-white/5 text-gray-500 hover:bg-white/10"
                    }`}
                  >
                    Phase {pIdx + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Question List */}
            <div className="space-y-2">
              {editing.questions
                .slice(activeDevPhase * 110, (activeDevPhase + 1) * 110)
                .map((q, idx) => {
                  const globalIdx = activeDevPhase * 110 + idx;
                  return (
                    <div key={globalIdx} className="bg-[#111827] rounded-xl border border-white/5 overflow-hidden">
                      <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={() => setExpandedQ(expandedQ === globalIdx ? null : globalIdx)}>
                        {expandedQ === globalIdx ? <ChevronUp className="w-3 h-3 text-gray-500" /> : <ChevronDown className="w-3 h-3 text-gray-500" />}
                        <span className="text-[#3F9FA3] text-xs font-bold w-8">Q{globalIdx + 1}</span>
                        <span className="text-white text-xs truncate flex-1">{q.question || "Empty question"}</span>
                        <button onClick={e => { e.stopPropagation(); removeQuestion(globalIdx); }} className="p-1 text-gray-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                      </div>
                      {expandedQ === globalIdx && (
                        <div className="px-4 pb-4 space-y-3">
                          <textarea value={q.question} onChange={e => updateQuestion(globalIdx, "question", e.target.value)} rows={2} className={inputClass + " resize-none text-xs"} placeholder="Question text" />
                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <input type="radio" name={`q${globalIdx}`} checked={q.correctAnswer === oIdx} onChange={() => updateQuestion(globalIdx, "correctAnswer", oIdx)} className="accent-[#3F9FA3]" />
                                <input value={opt} onChange={e => updateOption(globalIdx, oIdx, e.target.value)} className="flex-1 px-3 py-1.5 bg-[#0a0f1a] border border-white/10 rounded-lg text-white text-xs focus:outline-none" placeholder={`Option ${String.fromCharCode(65 + oIdx)}`} />
                              </div>
                            ))}
                          </div>
                          <textarea value={q.explanation || ""} onChange={e => updateQuestion(globalIdx, "explanation", e.target.value)} rows={2} className={inputClass + " resize-none text-xs"} placeholder="Explanation (shown after answering)" />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
            <button onClick={addQuestion} className="w-full py-3 bg-[#3F9FA3]/5 text-[#3F9FA3] rounded-xl text-sm font-bold hover:bg-[#3F9FA3]/10 flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Question Manually</button>
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
        <div><h2 className="text-2xl font-bold text-white">Practice Tests</h2><p className="text-gray-500 text-sm mt-1">{tests.length} tests</p></div>
        <button onClick={() => { setEditing({ ...EMPTY, questions: [] }); setIsNew(true); setTab("info"); }} className="px-5 py-2.5 bg-[#3F9FA3] text-white rounded-xl text-sm font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> New Test</button>
      </div>
      {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#3F9FA3] border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="space-y-3">
          {tests.map(t => (
            <div key={t._id || t.testId} className="bg-[#111827] rounded-xl border border-white/5 p-4 flex items-center gap-4 hover:border-[#3F9FA3]/20 transition-all">
              <div className="w-12 h-12 bg-[#3F9FA3]/10 rounded-xl flex items-center justify-center text-[#3F9FA3] font-bold text-sm">{t.questionsCount}Q</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm truncate">{t.title}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{t.category} · {t.duration} min · £{t.price}{t.isFree ? " (Free)" : ""}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={async () => { const full = await loadFullTest(t.testId); setEditing(full); setIsNew(false); setTab("info"); }} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-[#3F9FA3] hover:bg-[#3F9FA3]/10"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(t)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
