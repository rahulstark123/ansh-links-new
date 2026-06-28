"use client";

import { useState, useEffect } from "react";
import { useProfileStore, LinkItem } from "@/store/useProfileStore";
import { X, Sparkles, Link2 } from "lucide-react";
import DynamicIcon from "@/components/common/DynamicIcon";
import ProfileFillDropdown from "@/components/dashboard/ProfileFillDropdown";
import { applyProfileFill } from "@/lib/quick-links";

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkToEdit?: LinkItem | null;
}

const PRESET_ICONS = [
  "Link2", "Github", "Linkedin", "Twitter", "Youtube", "Instagram",
  "Briefcase", "Mail", "Globe", "MessageCircle", "Phone", "Award", "Flame"
];

export default function LinkModal({ isOpen, onClose, linkToEdit }: LinkModalProps) {
  const { profile, addLink, updateLink } = useProfileStore();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [url, setUrl] = useState("https://");
  const [icon, setIcon] = useState("Link2");
  const [active, setActive] = useState(true);

  // Initialize fields on open or change
  useEffect(() => {
    if (linkToEdit) {
      setTitle(linkToEdit.title);
      setSubtitle(linkToEdit.subtitle || "");
      setUrl(linkToEdit.url);
      setIcon(linkToEdit.icon || "Link2");
      setActive(linkToEdit.active);
    } else {
      setTitle("");
      setSubtitle("");
      setUrl("https://");
      setIcon("Link2");
      setActive(true);
    }
  }, [linkToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;

    const linkData = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      url: url.trim(),
      icon,
      active,
    };

    if (linkToEdit) {
      updateLink(linkToEdit.id, linkData);
    } else {
      addLink(linkData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      
      {/* Modal Card */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300">
        
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-outline-variant/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg primary-gradient flex items-center justify-center text-white">
              <Link2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black tracking-tight">
              {linkToEdit ? "Modify Bio Link" : "Create Bio Link"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">

          <ProfileFillDropdown
            profile={profile}
            onSelect={(value) =>
              applyProfileFill(value, profile, { setTitle, setSubtitle, setUrl })
            }
          />
          
          {/* Title */}
          <div>
            <label className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5">
              Link Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="premium-input-large"
              placeholder="e.g. My GitHub Portfolio"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5">
              Short Description / Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="premium-input-large"
              placeholder="e.g. Code showcases & open-source tools"
            />
          </div>

          {/* URL */}
          <div>
            <label className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5">
              Redirect URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="premium-input-large"
              placeholder="https://github.com/..."
              required
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-2">
              Select Icon Symbol
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-950/40 border border-outline-variant/5 rounded-2xl">
              {PRESET_ICONS.map((ico) => (
                <button
                  key={ico}
                  onClick={() => setIcon(ico)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    icon === ico
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 scale-95"
                      : "bg-white dark:bg-slate-900 border border-outline-variant/10 text-slate-500 hover:bg-slate-100"
                  }`}
                  title={ico}
                >
                  <DynamicIcon name={ico} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Active Status toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/40 border border-outline-variant/5 rounded-2xl">
            <div className="flex gap-2.5 items-center">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <div>
                <span className="font-bold text-xs block">Active Redirect Status</span>
                <span className="text-[9px] text-slate-400">Instantly toggle visibility on your profile.</span>
              </div>
            </div>
            <button
              onClick={() => setActive(!active)}
              className={`w-12 h-6 rounded-full p-1 transition-all ${
                active ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-all ${
                  active ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="h-20 flex items-center justify-end px-6 gap-3 border-t border-outline-variant/5 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-outline-variant/10 hover:bg-slate-100 text-xs font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-6 py-2.5 rounded-xl text-white primary-gradient text-xs font-bold shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:pointer-events-none"
          >
            Save Link
          </button>
        </div>

      </div>

    </div>
  );
}
