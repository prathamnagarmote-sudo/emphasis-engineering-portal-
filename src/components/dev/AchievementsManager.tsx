"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Award } from "lucide-react";

interface Achievement {
  _id?: string;
  name: string;
  credential: string;
  location: string;
  detail: string;
  photo: string;
  badge: string;
  color: string;
  isActive: boolean;
  expiresAt: string | null;
}

const inputClass =
  "w-full px-4 py-2.5 bg-[#0a0f1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#3F9FA3]";

export default function AchievementsManager({
  headers,
  uploadFile,
}: {
  headers: any;
  uploadFile: (file: File) => Promise<string | null>;
}) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dev/achievements", { headers });
      setAchievements(await res.json());
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const url = isNew ? "/api/dev/achievements" : `/api/dev/achievements/${editing._id}`;
      const method = isNew ? "POST" : "PUT";
      await fetch(url, {
        method,
        headers,
        body: JSON.stringify(editing),
      });
      await fetchAchievements();
      setEditing(null);
      setIsNew(false);
    } catch (error) {
      console.error("Failed to save:", error);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    try {
      await fetch(`/api/dev/achievements/${id}`, { method: "DELETE", headers });
      await fetchAchievements();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !editing) return;
    setUploadingImage(true);
    const url = await uploadFile(e.target.files[0]);
    if (url) {
      setEditing({ ...editing, photo: url });
    }
    setUploadingImage(false);
  };

  if (loading) {
    return <div className="text-gray-400">Loading achievements...</div>;
  }

  if (editing) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {isNew ? "New Achievement" : "Edit Achievement"}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditing(null);
                setIsNew(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-[#3F9FA3] text-white text-sm font-bold rounded-xl hover:bg-[#2d7a7d] transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="bg-[#111827] rounded-2xl border border-white/5 p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Student Name
              </label>
              <input
                className={inputClass}
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="e.g. Adedayo Stephen Osore"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Credential
              </label>
              <input
                className={inputClass}
                value={editing.credential}
                onChange={(e) => setEditing({ ...editing, credential: e.target.value })}
                placeholder="e.g. IET Membership"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Location
              </label>
              <input
                className={inputClass}
                value={editing.location}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                placeholder="e.g. United Kingdom"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Badge Text
              </label>
              <input
                className={inputClass}
                value={editing.badge}
                onChange={(e) => setEditing({ ...editing, badge: e.target.value })}
                placeholder="e.g. MIET"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Achievement Detail / Quote
            </label>
            <textarea
              className={`${inputClass} min-h-[100px]`}
              value={editing.detail}
              onChange={(e) => setEditing({ ...editing, detail: e.target.value })}
              placeholder="e.g. A great milestone and an important step..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Theme Color
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={editing.color || "#3F9FA3"}
                  onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  className={inputClass}
                  value={editing.color || "#3F9FA3"}
                  onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                  placeholder="#3F9FA3"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Status
              </label>
              <div className="flex items-center gap-3 h-12">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={editing.isActive}
                    onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3F9FA3]"></div>
                  <span className="ml-3 text-sm font-medium text-gray-300">
                    {editing.isActive ? "Active (Will show in popup)" : "Inactive"}
                  </span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                className={inputClass}
                value={editing.expiresAt ? new Date(editing.expiresAt).toISOString().split('T')[0] : ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep forever until manually disabled.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Student Photo
            </label>
            <div className="flex gap-4 items-end">
              {editing.photo ? (
                <img
                  src={editing.photo}
                  alt="Student"
                  className="w-24 h-24 object-cover rounded-xl border border-white/10"
                />
              ) : (
                <div className="w-24 h-24 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-600" />
                </div>
              )}
              <div className="flex-1">
                <label className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm cursor-pointer transition-colors w-max">
                  {uploadingImage ? "Uploading..." : "Upload New Photo"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
                <input
                  className={`${inputClass} mt-3`}
                  value={editing.photo}
                  onChange={(e) => setEditing({ ...editing, photo: e.target.value })}
                  placeholder="Or paste image URL here"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Achievements</h2>
          <p className="text-sm text-gray-400">Manage student achievements shown in the homepage popup.</p>
        </div>
        <button
          onClick={() => {
            setIsNew(true);
            setEditing({
              name: "",
              credential: "",
              location: "",
              detail: "",
              photo: "",
              badge: "",
              color: "#3F9FA3",
              isActive: true,
              expiresAt: null,
            });
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#3F9FA3] text-white text-sm font-bold rounded-xl hover:bg-[#2d7a7d] transition-all"
        >
          <Plus className="w-4 h-4" /> Add Achievement
        </button>
      </div>

      <div className="grid gap-4">
        {achievements.length === 0 ? (
          <div className="text-center py-12 bg-[#111827] rounded-2xl border border-white/5">
            <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No achievements found. Add one to get started.</p>
          </div>
        ) : (
          achievements.map((ach) => (
            <div
              key={ach._id}
              className="flex items-center gap-6 p-4 bg-[#111827] rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
            >
              <img
                src={ach.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(ach.name)}`}
                alt={ach.name}
                className="w-16 h-16 rounded-full object-cover border-2"
                style={{ borderColor: ach.color }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-white text-lg">{ach.name}</h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      ach.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {ach.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {ach.credential} • {ach.location}
                </p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{ach.detail}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(ach)}
                  className="p-2 text-gray-400 hover:text-[#3F9FA3] hover:bg-[#3F9FA3]/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(ach._id!)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
