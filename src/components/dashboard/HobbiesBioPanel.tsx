"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { Heart, Plus, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";

const HOBBIES_PRESETS = [
  "🛹 Skateboarding",
  "🎨 Painting & Drawing",
  "📸 Photography",
  "🍳 Culinary Arts",
  "🎮 Video Gaming",
  "📚 Reading & Writing",
  "🏃‍♂️ Running & Fitness",
  "✈️ Traveling & Exploring",
  "🎵 Music Production",
];

export default function HobbiesBioPanel() {
  const { profile, updateProfileInfo } = useProfileStore();
  const [showCustomHobbyInput, setShowCustomHobbyInput] = useState(false);
  const [newHobby, setNewHobby] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Custom delete confirmation states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingHobbyIndex, setDeletingHobbyIndex] = useState<number | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleRemoveHobby = async (index: number) => {
    const current = profile.hobbies || [];
    const hobbyName = current[index];
    if (!hobbyName) return;

    try {
      const res = await fetch(`/api/hobbies?wid=${profile.wid}&hobby=${encodeURIComponent(hobbyName)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete hobby");
      }

      const updated = current.filter((_, i) => i !== index);
      updateProfileInfo({ hobbies: updated });
      showToast(`"${hobbyName}" removed!`, "success");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleOpenDelete = (index: number) => {
    setDeletingHobbyIndex(index);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingHobbyIndex !== null) {
      await handleRemoveHobby(deletingHobbyIndex);
      setDeletingHobbyIndex(null);
      setIsConfirmOpen(false);
    }
  };

  const handleAddHobby = async (hobby: string) => {
    if (!hobby.trim()) return;
    const val = hobby.trim();
    const currentHobbies = profile.hobbies || [];
    if (currentHobbies.includes(val)) {
      showToast(`"${val}" is already in your list!`, "error");
      return;
    }

    try {
      const res = await fetch("/api/hobbies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wid: profile.wid, hobby: val }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add hobby");
      }

      updateProfileInfo({ hobbies: [...currentHobbies, val] });
      showToast(`"${val}" added to interests!`, "success");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="p-8 sm:p-10 space-y-8 w-full animate-fadeIn font-sans">
      
      {/* Header Block */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 shadow-sm transition-colors duration-300">
        <h3 className="font-black text-base flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
          <Heart className="w-5 h-5 text-rose-500" />
          Hobbies & Interests
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Create and manage your list of hobbies and interests. These will be available in the pre-fill dropdown when creating or editing custom bio links.
        </p>
      </div>

      {/* Main Hobbies CRUD Card */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-[2rem] p-8 shadow-sm space-y-6">
        <div className="space-y-4">
          <label className="text-[10px] font-black tracking-wider text-slate-450 dark:text-slate-500 uppercase block mb-1">
            Choose from Common Presets
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            
            {/* Custom Styled Select Dropdown Trigger */}
            <div className="relative flex-grow">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs font-black text-slate-700 dark:text-slate-300 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-sans"
              >
                <span>Add from common Presets...</span>
                <ChevronDown className={`w-4.5 h-4.5 text-slate-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-2xl shadow-xl z-[100] p-2 space-y-1 animate-fadeIn">
                    {HOBBIES_PRESETS.filter(p => !(profile.hobbies || []).includes(p)).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          handleAddHobby(preset);
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomHobbyInput(true);
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-800/80 mt-1 pt-2"
                    >
                      ➕ Create Custom Hobby...
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowCustomHobbyInput(true)}
              className="px-6 py-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-xs font-black shadow-sm shrink-0 border border-indigo-150/10 hover:bg-indigo-100/50 cursor-pointer"
            >
              Custom Hobby
            </button>
          </div>

          {showCustomHobbyInput && (
            <div className="flex gap-2 animate-slideDown p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-2xl">
              <input
                type="text"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (newHobby.trim()) {
                      handleAddHobby(newHobby);
                      setNewHobby("");
                      setShowCustomHobbyInput(false);
                    }
                  }
                }}
                className="premium-input-large flex-grow text-slate-855 dark:text-slate-100 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold font-sans"
                placeholder="e.g. 🏂 Snowboarding"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  if (newHobby.trim()) {
                    handleAddHobby(newHobby);
                    setNewHobby("");
                    setShowCustomHobbyInput(false);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black cursor-pointer hover:scale-[0.98]"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomHobbyInput(false);
                  setNewHobby("");
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-black cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Hobbies list */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-sans pl-1">
            My Added Hobbies & Interests
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.hobbies && profile.hobbies.map((hobby, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-805 rounded-2xl hover:border-indigo-500/25 transition-all"
              >
                <span className="text-xs font-black text-slate-750 dark:text-slate-350">{hobby}</span>
                <button
                  type="button"
                  onClick={() => handleOpenDelete(index)}
                  className="w-7 h-7 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-955/20 flex items-center justify-center text-slate-405 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete Hobby"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {(!profile.hobbies || profile.hobbies.length === 0) && (
              <div className="col-span-full text-center py-12 border border-dashed border-slate-200/60 dark:border-slate-800 rounded-[2rem] text-slate-400 text-xs font-bold bg-slate-50/20">
                No hobbies added yet. Add one from presets above or enter a custom hobby.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={deletingHobbyIndex !== null ? (profile.hobbies || [])[deletingHobbyIndex] : undefined}
      />

      {/* Custom Toast Notification Overlay */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1050] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-white dark:bg-slate-900 border-outline-variant/10 animate-slideDown font-bold text-xs select-none">
          <div className={`w-2.5 h-2.5 rounded-full ${toast.type === "success" ? "bg-emerald-500 shadow-sm" : "bg-rose-500 shadow-sm"}`} />
          <span className="text-slate-800 dark:text-slate-200">{toast.message}</span>
        </div>
      )}

    </div>
  );
}
