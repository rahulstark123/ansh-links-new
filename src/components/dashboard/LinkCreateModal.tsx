"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useProfileStore } from "@/store/useProfileStore";
import { X, Link2, Plus } from "lucide-react";
import { PLATFORM_PRESETS } from "@/components/dashboard/SocialLinkModal";
import SocialLinkModal from "@/components/dashboard/SocialLinkModal";

interface LinkCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess: (newLinkId: string) => void;
}

export default function LinkCreateModal({ isOpen, onClose, onCreateSuccess }: LinkCreateModalProps) {
  const { profile, addLink, updateProfileInfo } = useProfileStore();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [url, setUrl] = useState(`https://ansh.links/${profile.username || "username"}/`);
  const [icon, setIcon] = useState("Link2");
  const [mounted, setMounted] = useState(false);

  // Social account quick modal state
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    setMounted(true);
    if (profile.username) {
      setUrl(`https://ansh.links/${profile.username}/`);
    }
    return () => setMounted(false);
  }, [profile.username]);

  if (!isOpen || !mounted) return null;

  const handleCreate = () => {
    if (!title.trim()) {
      showToast("Link Name / Title is required!", "error");
      return;
    }

    const suffix = url.replace(new RegExp(`^https?:\\/\\/ansh\\.links\\/${profile.username || "username"}\\/`), "").trim();
    if (!suffix) {
      showToast("Destination URL path is required!", "error");
      return;
    }

    addLink({
      title: title.trim(),
      subtitle: subtitle.trim(),
      url: url.trim(),
      icon: icon,
      active: true,
    });

    showToast("Bio link created successfully!", "success");

    setTimeout(() => {
      const currentLinks = useProfileStore.getState().profile.links;
      const newlyAdded = currentLinks[currentLinks.length - 1];
      if (newlyAdded) {
        onCreateSuccess(newlyAdded.id);
      } else {
        onClose();
      }
    }, 1500);
  };

  const handleSaveSocial = (socialData: any) => {
    const updated = [...(profile.socialLinks || [])];
    const newId = `social-${Date.now()}`;
    updated.push({
      id: newId,
      ...socialData,
    });
    updateProfileInfo({ socialLinks: updated });

    // Pre-populate fields from the newly added social account
    const preset = PLATFORM_PRESETS.find((p) => p.value === socialData.platform);
    const presetName = preset ? preset.label : socialData.platform;
    const presetIcon = preset ? preset.iconName : "Globe";

    setTitle(presetName);
    setUrl(socialData.url);
    setIcon(presetIcon);
    setSocialModalOpen(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn font-sans">
      
      {/* Modal Card */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300">
        
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-outline-variant/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg primary-gradient flex items-center justify-center text-white">
              <Link2 className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-black tracking-tight font-sans">Create Bio Link</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">

          {/* Title */}
          <div>
            <label className="text-xs font-black tracking-wider text-slate-450 dark:text-slate-500 uppercase block mb-1.5 font-sans">
              Link Name / Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="premium-input-large font-sans"
              placeholder="e.g. Github Portfolio"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="text-xs font-black tracking-wider text-slate-455 dark:text-slate-500 uppercase block mb-1.5 font-sans">
              Description (Optional)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="premium-input-large font-sans"
              placeholder="e.g. Code repositories and prototypes"
            />
          </div>

          {/* URL destination */}
          <div>
            <label className="text-xs font-black tracking-wider text-slate-455 dark:text-slate-500 uppercase block mb-1.5 font-sans">
              Destination URL
            </label>
            <div className="flex rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-600 transition-all">
              <span className="flex items-center px-3.5 bg-slate-105 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-500 select-none shrink-0 font-sans">
                ansh.links/{profile.username || "username"}/
              </span>
              <input
                type="text"
                value={url.replace(new RegExp(`^https?:\\/\\/ansh\\.links\\/${profile.username || "username"}\\/`), "")}
                onChange={(e) => {
                  const suffix = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
                  setUrl(`https://ansh.links/${profile.username || "username"}/${suffix}`);
                }}
                className="flex-grow px-3.5 py-2.5 bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 outline-none border-none focus:ring-0"
                placeholder="e.g. github"
                required
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="h-20 flex items-center justify-end px-6 gap-3 border-t border-outline-variant/5 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-outline-variant/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold font-sans transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-6 py-2.5 rounded-xl text-white primary-gradient text-xs font-bold font-sans shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform cursor-pointer"
          >
            Create & Customize
          </button>
        </div>

      </div>

      {/* Social connection quick adder */}
      <SocialLinkModal
        isOpen={socialModalOpen}
        onClose={() => setSocialModalOpen(false)}
        onSave={handleSaveSocial}
        linkToEdit={null}
      />

      {/* Custom Toast Notification Overlay */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1050] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-white dark:bg-slate-900 border-outline-variant/10 animate-slideDown font-bold text-xs select-none">
          <div className={`w-2.5 h-2.5 rounded-full ${toast.type === "success" ? "bg-emerald-500 shadow-sm" : "bg-rose-500 shadow-sm"}`} />
          <span className="text-slate-800 dark:text-slate-200">{toast.message}</span>
        </div>
      )}

    </div>,
    document.body
  );
}
