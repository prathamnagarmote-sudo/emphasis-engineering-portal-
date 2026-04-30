"use client";
import { useState, useEffect } from "react";

import { BookOpen, Briefcase, FileText, ClipboardList, MessageSquare, LogOut, Upload, Image } from "lucide-react";
import BlogsManager from "@/components/dev/BlogsManager";
import CoursesManager from "@/components/dev/CoursesManager";
import ServicesManager from "@/components/dev/ServicesManager";
import TestimonialsManager from "@/components/dev/TestimonialsManager";
import PracticeTestsManager from "@/components/dev/PracticeTestsManager";
import AchievementsManager from "@/components/dev/AchievementsManager";
import { Award } from "lucide-react";

const TABS = [
  { id: "blogs", label: "Blogs", icon: FileText },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "tests", label: "Practice Tests", icon: ClipboardList },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "achievements", label: "Achievements", icon: Award },
];

export default function DevPanel({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("blogs");
  const [dbStatus, setDbStatus] = useState<any>(null);

  const headers = { "x-dev-token": token, "Content-Type": "application/json" };

  useEffect(() => {
    fetch("/api/dev/status", { headers })
      .then(res => res.json())
      .then(setDbStatus)
      .catch(console.error);
  }, []);

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/dev/upload", {
        method: "POST",
        headers: { "x-dev-token": token },
        body: formData,
      });
      const data = await res.json();
      return data.url || null;
    } catch { return null; }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-white/5 flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3F9FA3] to-[#2d7a7d] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-black">⚡</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">Dev Panel</h2>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest">Content Manager</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all ${
                activeTab === id ? "text-[#3F9FA3] bg-[#3F9FA3]/10 border-r-2 border-[#3F9FA3]" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/5 p-4 space-y-4">
          {dbStatus && (
            <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Database</p>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${dbStatus.status === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-300 font-medium">{dbStatus.status}</span>
              </div>
              <p className="text-[9px] text-gray-600 mt-1 truncate">{dbStatus.database}</p>
            </div>
          )}
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-red-400 rounded-xl hover:bg-red-500/5 transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 pt-28">
        {activeTab === "blogs" && <BlogsManager headers={headers} uploadFile={uploadFile} />}
        {activeTab === "courses" && <CoursesManager headers={headers} uploadFile={uploadFile} />}
        {activeTab === "services" && <ServicesManager headers={headers} />}
        {activeTab === "tests" && <PracticeTestsManager headers={headers} />}
        {activeTab === "testimonials" && <TestimonialsManager headers={headers} uploadFile={uploadFile} />}
        {activeTab === "achievements" && <AchievementsManager headers={headers} uploadFile={uploadFile} />}
      </main>
    </div>
  );
}
