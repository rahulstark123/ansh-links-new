"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Globe, Mail, Check, ChevronDown, Search } from "lucide-react";
import * as Icons from "lucide-react";
import { SocialLink } from "@/store/useProfileStore";

interface SocialLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (linkData: Omit<SocialLink, "id">) => void;
  linkToEdit?: SocialLink | null;
}

export const PLATFORM_PRESETS = [
  { value: "instagram", label: "Instagram", iconName: "Instagram", color: "text-pink-500 hover:bg-pink-50/50 dark:hover:bg-pink-950/10" },
  { value: "github", label: "GitHub", iconName: "Github", color: "text-slate-800 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/20" },
  { value: "twitter", label: "Twitter / X", iconName: "Twitter", color: "text-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/10" },
  { value: "linkedin", label: "LinkedIn", iconName: "Linkedin", color: "text-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/10" },
  { value: "youtube", label: "YouTube", iconName: "Youtube", color: "text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/10" },
  { value: "facebook", label: "Facebook", iconName: "Facebook", color: "text-blue-750 hover:bg-blue-50/50 dark:hover:bg-blue-950/10" },
  { value: "whatsapp", label: "WhatsApp", iconName: "MessageCircle", color: "text-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10" },
  { value: "telegram", label: "Telegram", iconName: "Send", color: "text-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-950/10" },
  { value: "discord", label: "Discord", iconName: "MessageSquare", color: "text-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/10" },
  { value: "spotify", label: "Spotify", iconName: "Music", color: "text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10" },
  { value: "pinterest", label: "Pinterest", iconName: "Compass", color: "text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/10" },
  { value: "tiktok", label: "TikTok", iconName: "PlayCircle", color: "text-slate-900 dark:text-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800/10" },
  { value: "twitch", label: "Twitch", iconName: "Twitch", color: "text-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-950/10" },
  { value: "medium", label: "Medium", iconName: "BookOpen", color: "text-slate-800 dark:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/10" },
  { value: "devto", label: "Dev.to", iconName: "Code", color: "text-slate-900 dark:text-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800/10" },
  { value: "dribbble", label: "Dribbble", iconName: "Activity", color: "text-pink-600 hover:bg-pink-50/50 dark:hover:bg-pink-950/10" },
  { value: "behance", label: "Behance", iconName: "Sparkles", color: "text-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/10" },
  { value: "reddit", label: "Reddit", iconName: "Smile", color: "text-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-950/10" },
  { value: "substack", label: "Substack", iconName: "Bookmark", color: "text-orange-600 hover:bg-orange-50/50 dark:hover:bg-orange-950/10" },
  { value: "slack", label: "Slack", iconName: "Slack", color: "text-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/10" },
  { value: "snapchat", label: "Snapchat", iconName: "Ghost", color: "text-yellow-500 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/10" },
  { value: "email", label: "Email Address", iconName: "Mail", color: "text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/10" },
  { value: "website", label: "Other Website", iconName: "Globe", color: "text-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/10" },
];

export default function SocialLinkModal({ isOpen, onClose, onSave, linkToEdit }: SocialLinkModalProps) {
  const [platform, setPlatform] = useState("website");
  const [url, setUrl] = useState("");
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (linkToEdit) {
      setPlatform(linkToEdit.platform);
      setUrl(linkToEdit.url);
    } else {
      setPlatform("website");
      setUrl("");
    }
  }, [linkToEdit, isOpen]);

  // Handle outside clicks to close the custom dropdown popover
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      window.addEventListener("mousedown", handleOutsideClick);
      // Auto focus dropdown search
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [dropdownOpen]);

  if (!isOpen || !mounted) return null;

  const handleSave = () => {
    if (!url.trim()) return;
    onSave({
      platform,
      url: url.trim(),
    });
    onClose();
  };

  const selectedPreset = PLATFORM_PRESETS.find((p) => p.value === platform) || PLATFORM_PRESETS[PLATFORM_PRESETS.length - 1];

  const getPresetIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Globe;
  };

  const SelectedIcon = getPresetIcon(selectedPreset.iconName);

  const filteredPresets = PLATFORM_PRESETS.filter((preset) =>
    preset.label.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return createPortal(
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      
      {/* Modal Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-350 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl flex flex-col transition-colors duration-300 relative">
        
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg primary-gradient flex items-center justify-center text-white">
              <Globe className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-sm font-black tracking-tight font-sans text-slate-900 dark:text-slate-100">
              {linkToEdit ? "Modify Social Link" : "Add Social Link"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Custom Dropdown Selector */}
          <div className="relative" ref={dropdownRef}>
            <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-2 font-sans">
              Choose Social Platform
            </label>
            
            {/* Dropdown Trigger Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-extrabold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-600 cursor-pointer shadow-sm transition-colors"
            >
              <div className="flex items-center gap-3">
                <SelectedIcon className={`w-5 h-5 ${selectedPreset.color.split(" ")[0]}`} />
                <span>{selectedPreset.label}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Dropdown Overlay List Card */}
            {dropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
                
                {/* Search presets bar */}
                <div className="relative flex items-center p-3 border-b border-slate-100 dark:border-slate-800">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-6" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="Search social platforms..."
                  />
                </div>

                {/* Preset Choices List */}
                <div className="max-h-60 overflow-y-auto p-2 space-y-0.5">
                  {filteredPresets.map((preset) => {
                    const PresetIcon = getPresetIcon(preset.iconName);
                    const isSelected = preset.value === platform;
                    return (
                      <button
                        key={preset.value}
                        onClick={() => {
                          setPlatform(preset.value);
                          setSearchFilter("");
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-200 text-left transition-colors cursor-pointer ${preset.color.split(" ").slice(1).join(" ")} ${
                          isSelected ? "bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <PresetIcon className={`w-4.5 h-4.5 ${preset.color.split(" ")[0]}`} />
                          <span>{preset.label}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                      </button>
                    );
                  })}

                  {filteredPresets.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs font-bold">
                      No matching platform found
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Profile URL Input */}
          <div>
            <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-2 font-sans">
              Profile Link / URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="premium-input-large text-xs font-extrabold text-slate-800 dark:text-slate-100 border-slate-350 dark:border-slate-800"
              placeholder={platform === "email" ? "mailto:username@example.com" : `https://${platform}.com/username`}
              required
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="h-20 flex items-center justify-end px-6 gap-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 text-xs font-extrabold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!url.trim()}
            className="px-6 py-2.5 rounded-xl text-white primary-gradient text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            Save Profile Link
          </button>
        </div>

      </div>

    </div>,
    document.body
  );
}
