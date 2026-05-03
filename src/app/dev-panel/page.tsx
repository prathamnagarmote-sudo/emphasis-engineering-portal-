"use client";
import { useState, useEffect } from "react";
import DevPanel from "@/components/pages/DevPanel";

export default function DevPanelPage() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("dev-token");
    if (saved) setToken(saved);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dev/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("dev-token", data.token);
        setToken(data.token);
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  if (token) return <DevPanel token={token} onLogout={() => { sessionStorage.removeItem("dev-token"); setToken(null); }} />;

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#3F9FA3] to-[#2d7a7d] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#3F9FA3]/20">
            <span className="text-white text-2xl font-black">⚡</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Developer Panel</h1>
          <p className="text-gray-500 text-sm">Emphasis Engineering - Content Management</p>
        </div>
        <div className="bg-[#111827] rounded-2xl border border-white/5 p-8 shadow-2xl">
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">{error}</div>}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-[#0a0f1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#3F9FA3] transition-colors" placeholder="Enter username" onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-[#0a0f1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#3F9FA3] transition-colors" placeholder="Enter password" onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
            <button onClick={handleLogin} disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-[#3F9FA3] to-[#2d7a7d] text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-[#3F9FA3]/20 transition-all disabled:opacity-50">
              {loading ? "Authenticating..." : "Access Panel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
