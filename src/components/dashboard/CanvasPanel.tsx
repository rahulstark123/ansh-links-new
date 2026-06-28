"use client";

import { useState } from "react";
import { useProfileStore, SocialLink } from "@/store/useProfileStore";
import PreviewDevice from "@/components/dashboard/PreviewDevice";
import DynamicIcon from "@/components/common/DynamicIcon";
import SocialLinkModal, { PLATFORM_PRESETS } from "@/components/dashboard/SocialLinkModal";
import {
  User,
  Layout,
  Sparkles,
  Check,
  Heart,
  ArrowLeft,
  Link2,
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit2,
  Globe,
  ShoppingBag,
} from "lucide-react";
import * as Icons from "lucide-react";

interface CanvasPanelProps {
  linkId: string;
  onBack: () => void;
}

const PRESET_ICONS = [
  "Link2", "Github", "Linkedin", "Twitter", "Youtube", "Instagram",
  "Briefcase", "Mail", "Globe", "MessageCircle", "Phone", "Award", "Flame"
];

const HOBBIES_PRESETS = [
  "📚 Reading",
  "💻 Coding",
  "✈️ Traveling",
  "🎨 Design",
  "🎵 Music",
  "🎮 Gaming",
  "🍳 Cooking",
  "🏋️ Fitness",
  "🍿 Movies",
  "📸 Photography",
  "🚗 Cars",
  "🌱 Gardening",
  "🚲 Cycling"
];


export default function CanvasPanel({ linkId, onBack }: CanvasPanelProps) {
  const {
    profile,
    updateLink,
    updateProfileInfo,
    updateProduct
  } = useProfileStore();

  const [viewMode, setViewMode] = useState<"mobile" | "tablet" | "desktop">("mobile");
  
  // Hobbies input state
  const [newHobby, setNewHobby] = useState("");
  const [showCustomHobbyInput, setShowCustomHobbyInput] = useState(false);

  // Auto populate state flag when adding social from link editor
  const [autoFillActiveLink, setAutoFillActiveLink] = useState(false);

  // Section Accordion Expand States
  const [activeSection, setActiveSection] = useState<string | null>(linkId ? "customLinks" : "personal");
  
  // Custom Link list edit sub-panel state
  const [editingLinkId, setEditingLinkId] = useState<string | null>(linkId || null);

  // Social Link Modal States inside Canvas
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);

  const activeLink = profile.links.find((l) => l.id === linkId);

  const themeOptions = [
    { value: "organic", label: "Organic Minimalist" },
    { value: "saffron", label: "Saffron Warmth" },
    { value: "emerald", label: "Emerald Forest" },
    { value: "noir", label: "Midnight Noir" },
    { value: "silk", label: "Silk Lavender" },
  ];

  const bgStyleOptions = [
    { value: "flat", label: "Clean Flat" },
    { value: "dots", label: "Aesthetic Dots" },
    { value: "mesh", label: "Soft Mesh" },
  ];

  const toggleSection = (secName: string) => {
    setActiveSection(activeSection === secName ? null : secName);
  };

  // Hobbies action handlers
  const handleAddHobby = () => {
    if (!newHobby.trim()) return;
    const currentHobbies = profile.hobbies || [];
    if (!currentHobbies.includes(newHobby.trim())) {
      updateProfileInfo({ hobbies: [...currentHobbies, newHobby.trim()] });
    }
    setNewHobby("");
  };

  const handleRemoveHobby = (index: number) => {
    const currentHobbies = profile.hobbies || [];
    const updated = currentHobbies.filter((_, i) => i !== index);
    updateProfileInfo({ hobbies: updated });
  };

  // Social actions
  const handleOpenAddSocial = () => {
    setEditingSocial(null);
    setAutoFillActiveLink(false);
    setSocialModalOpen(true);
  };

  const handleOpenAddSocialFromLink = () => {
    setEditingSocial(null);
    setAutoFillActiveLink(true);
    setSocialModalOpen(true);
  };

  const handleOpenEditSocial = (sLink: SocialLink) => {
    setEditingSocial(sLink);
    setAutoFillActiveLink(false);
    setSocialModalOpen(true);
  };

  const handleSaveSocial = (socialData: Omit<SocialLink, "id">) => {
    let updated = [...(profile.socialLinks || [])];
    const newId = `social-${Date.now()}`;
    if (editingSocial) {
      updated = updated.map((l) =>
        l.id === editingSocial.id ? { ...l, ...socialData } : l
      );
    } else {
      updated.push({
        id: newId,
        ...socialData,
      });
    }
    updateProfileInfo({ socialLinks: updated });

    if (autoFillActiveLink && activeLink) {
      const preset = PLATFORM_PRESETS.find((p) => p.value === socialData.platform);
      const presetName = preset ? preset.label : socialData.platform;
      const presetIcon = preset ? preset.iconName : "Globe";
      updateLink(linkId, {
        title: presetName,
        url: socialData.url,
        icon: presetIcon
      });
      setAutoFillActiveLink(false);
    }
  };

  const handleDeleteSocial = (id: string) => {
    const updated = (profile.socialLinks || []).filter((l) => l.id !== id);
    updateProfileInfo({ socialLinks: updated });
  };

  const getPresetIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Globe;
  };

  return (
    <div className="p-8 sm:p-10 animate-fadeIn max-w-[1400px] mx-auto font-sans">
      
      {/* Panel header controls */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-black transition-all cursor-pointer shadow-sm bg-white dark:bg-slate-900"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          Back to Links Manager
        </button>

        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
          Workspace Sandbox: <span className="font-extrabold text-indigo-750 dark:text-indigo-400">@{profile.username}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        
        {/* Left Form Editor Organized in Sections */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* SECTION 2: Custom Page Links (Multiple Links Manager) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
            <button
              onClick={() => toggleSection("customLinks")}
              className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/40 text-left border-b border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-705 dark:text-indigo-450 flex items-center justify-center">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 font-sans">Custom Page Links</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Manage, edit, and toggle multiple custom links</p>
                </div>
              </div>
              {activeSection === "customLinks" ? <ChevronUp className="w-4.5 h-4.5 text-slate-400" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-400" />}
            </button>

            {activeSection === "customLinks" && (
              <div className="p-6 space-y-4 animate-slideDown">
                
                {/* List all links inline with collapsible details */}
                <div className="space-y-3">
                  {profile.links.map((lnk) => {
                    const isEditingThis = editingLinkId === lnk.id;
                    return (
                      <div
                        key={lnk.id}
                        className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20"
                      >
                        {/* Header Row */}
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-905 border-b border-slate-100 dark:border-slate-850">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 text-slate-500">
                              <DynamicIcon name={lnk.icon || "Link2"} className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-black block truncate text-slate-850 dark:text-slate-200">{lnk.title}</span>
                              <span className="text-[9px] text-slate-400 truncate block mt-0.5 max-w-[180px] sm:max-w-[260px]">{lnk.url}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingLinkId(isEditingThis ? null : lnk.id)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${isEditingThis ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950" : ""}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = profile.links.map((l) =>
                                  l.id === lnk.id ? { ...l, active: !l.active } : l
                                );
                                updateProfileInfo({ links: updated });
                              }}
                              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                lnk.active
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                              }`}
                            >
                              {lnk.active ? "Active" : "Hidden"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = profile.links.filter((l) => l.id !== lnk.id);
                                updateProfileInfo({ links: updated });
                              }}
                              className="w-7 h-7 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Fields Editor */}
                        {isEditingThis && (
                          <div className="p-4 space-y-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-850 animate-slideDown">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              <div>
                                <label className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1">
                                  Link Title
                                </label>
                                <input
                                  type="text"
                                  value={lnk.title}
                                  onChange={(e) => {
                                    const updated = profile.links.map((l) =>
                                      l.id === lnk.id ? { ...l, title: e.target.value } : l
                                    );
                                    updateProfileInfo({ links: updated });
                                  }}
                                  className="premium-input-large text-slate-800 dark:text-slate-100 border-slate-350 dark:border-slate-805 bg-white dark:bg-slate-900 text-xs font-bold"
                                  placeholder="e.g. Portfolio"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1">
                                  Subtitle / Description
                                </label>
                                <input
                                  type="text"
                                  value={lnk.subtitle || ""}
                                  onChange={(e) => {
                                    const updated = profile.links.map((l) =>
                                      l.id === lnk.id ? { ...l, subtitle: e.target.value } : l
                                    );
                                    updateProfileInfo({ links: updated });
                                  }}
                                  className="premium-input-large text-slate-800 dark:text-slate-100 border-slate-350 dark:border-slate-805 bg-white dark:bg-slate-900 text-xs font-bold"
                                  placeholder="e.g. Check my designs"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1">
                                  Redirect Destination URL
                                </label>
                                <div className="flex rounded-2xl border border-slate-350 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-600 transition-all">
                                  <span className="flex items-center px-4 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-500 select-none shrink-0 font-sans">
                                    ansh.links/{profile.username || "username"}/
                                  </span>
                                  <input
                                    type="text"
                                    value={lnk.url.replace(new RegExp(`^https?:\\/\\/ansh\\.links\\/${profile.username || "username"}\\/`), "")}
                                    onChange={(e) => {
                                      const suffix = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
                                      const updated = profile.links.map((l) =>
                                        l.id === lnk.id
                                          ? { ...l, url: `https://ansh.links/${profile.username || "username"}/${suffix}` }
                                          : l
                                      );
                                      updateProfileInfo({ links: updated });
                                    }}
                                    className="flex-grow px-4 py-3 bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 outline-none border-none focus:ring-0"
                                    placeholder="e.g. github"
                                  />
                                </div>
                              </div>
                              
                              <div className="sm:col-span-2">
                                <label className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-2">
                                  Symbol Icon
                                </label>
                                <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                                  {PRESET_ICONS.map((ico) => (
                                    <button
                                      key={ico}
                                      type="button"
                                      onClick={() => {
                                        const updated = profile.links.map((l) =>
                                          l.id === lnk.id ? { ...l, icon: ico } : l
                                        );
                                        updateProfileInfo({ links: updated });
                                      }}
                                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                        lnk.icon === ico
                                          ? "bg-indigo-600 text-white shadow-sm"
                                          : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100"
                                      }`}
                                      title={ico}
                                    >
                                      <DynamicIcon name={ico} className="w-4 h-4" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {profile.links.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/30">
                      No custom page links created yet.
                    </div>
                  )}
                </div>

                {/* Inline Custom Link Creator */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-3 shadow-inner">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-sans">
                    Create New Custom Page Link
                  </span>
                  <div className="space-y-2">
                    <input
                      id="customLinkTitleInput"
                      type="text"
                      placeholder="Link Name / Title"
                      className="premium-input-large text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold"
                    />
                    <input
                      id="customLinkUrlInput"
                      type="url"
                      placeholder="Destination URL (e.g. https://...)"
                      className="premium-input-large text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-sans"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const titleInput = document.getElementById("customLinkTitleInput") as HTMLInputElement;
                      const urlInput = document.getElementById("customLinkUrlInput") as HTMLInputElement;
                      const titleVal = titleInput.value.trim();
                      const urlVal = urlInput.value.trim();
                      if (titleVal && urlVal) {
                        const updated = [...profile.links];
                        updated.push({
                          id: `link-${Date.now()}`,
                          title: titleVal,
                          subtitle: "",
                          url: urlVal,
                          icon: "Link2",
                          active: true
                        });
                        updateProfileInfo({ links: updated });
                        titleInput.value = "";
                        urlInput.value = "";
                      }
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 text-white primary-gradient rounded-xl text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Save Custom Link
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* SECTION 1: Personal Info & Identity */}
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
            <button
              onClick={() => toggleSection("personal")}
              className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/40 text-left border-b border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-450 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">Personal Info & Bio</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Customize avatar, display name, biography, UPI, and WhatsApp</p>
                </div>
              </div>
              {activeSection === "personal" ? <ChevronUp className="w-4.5 h-4.5 text-slate-400" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-400" />}
            </button>

            {activeSection === "personal" && (
              <div className="p-6 space-y-5 animate-slideDown">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => updateProfileInfo({ name: e.target.value })}
                      className="premium-input-large text-slate-850 dark:text-slate-100 border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950"
                      placeholder="Ansh Kumar"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1.5 font-sans">
                      Username Slug
                    </label>
                    <div className="flex rounded-2xl overflow-hidden border border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                      <span className="px-3.5 py-3 text-xs text-slate-400 dark:text-slate-500 bg-slate-100/50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex items-center select-none font-bold shrink-0">
                        ansh.links/
                      </span>
                      <input
                        type="text"
                        value={profile.username}
                        onChange={(e) => updateProfileInfo({ username: e.target.value.toLowerCase().replace(/\s+/g, "") })}
                        className="premium-input-large flex-grow border-0 bg-transparent rounded-none focus:ring-0 focus:border-0 pl-3 text-slate-800 dark:text-slate-100"
                        placeholder="ansh"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1.5">
                      Short Biography
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => updateProfileInfo({ bio: e.target.value })}
                      rows={3}
                      className="premium-input-large resize-none text-slate-800 dark:text-slate-100 border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950"
                      placeholder="Curator of fine aesthetics..."
                    />
                  </div>
                        <div className="md:col-span-2">
                    <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-2 font-sans">
                      Profile Avatar Picture
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-2xl">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md shrink-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-slate-400 text-[10px] font-bold">No Image</span>
                        )}
                      </div>
                      <div className="flex-grow w-full space-y-2">
                        <div className="flex gap-2">
                          <label className="flex-grow flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-900/30 hover:bg-indigo-100/40 dark:hover:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm text-center">
                            <span className="material-symbols-outlined text-sm">cloud_upload</span>
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const formData = new FormData();
                                formData.append("file", file);
                                try {
                                  updateProfileInfo({ avatar: "" }); // show empty state
                                  const res = await fetch("/api/upload", {
                                    method: "POST",
                                    body: formData,
                                  });
                                  if (!res.ok) throw new Error("Upload failed");
                                  const data = await res.json();
                                  updateProfileInfo({ avatar: data.url });
                                } catch (err) {
                                  console.error(err);
                                  alert("Failed to upload avatar image to Cloudflare R2.");
                                }
                              }}
                            />
                          </label>
                          {profile.avatar && (
                            <button
                              type="button"
                              onClick={() => updateProfileInfo({ avatar: "" })}
                              className="px-4 py-2.5 border border-rose-200 dark:border-rose-900/30 text-rose-605 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-955/30 text-xs font-black rounded-xl transition-all cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={profile.avatar}
                          onChange={(e) => updateProfileInfo({ avatar: e.target.value })}
                          className="premium-input-large text-[11px] font-sans border-slate-350 dark:border-slate-805 bg-white dark:bg-slate-900 h-9 px-3"
                          placeholder="Or paste avatar direct URL (https://...)"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1.5 font-sans">
                      Currently Exploring or Doing
                    </label>
                    <input
                      type="text"
                      value={profile.currentlyExploring || ""}
                      onChange={(e) => updateProfileInfo({ currentlyExploring: e.target.value })}
                      className="premium-input-large text-slate-800 dark:text-slate-100 border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 font-sans"
                      placeholder="e.g. Next.js 16 & Tailwind v4"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-0.5 font-sans">
                      Hobbies & Interests
                    </label>
                    
                    {/* Presets dropdown */}
                    <div className="flex flex-col gap-2">
                      <select
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) return;
                          if (val === "__custom__") {
                            setShowCustomHobbyInput(true);
                          } else {
                            const currentHobbies = profile.hobbies || [];
                            if (!currentHobbies.includes(val)) {
                              updateProfileInfo({ hobbies: [...currentHobbies, val] });
                            }
                          }
                          e.target.value = "";
                        }}
                        className="premium-input-large text-slate-800 dark:text-slate-100 border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs font-bold font-sans cursor-pointer"
                      >
                        <option value="">-- Select from common Hobbies --</option>
                        {HOBBIES_PRESETS.map((preset) => (
                          <option key={preset} value={preset}>
                            {preset}
                          </option>
                        ))}
                        <option value="__custom__">➕ Add Custom Hobby...</option>
                      </select>

                      {showCustomHobbyInput && (
                        <div className="flex gap-2 animate-slideDown mt-1.5">
                          <input
                            type="text"
                            value={newHobby}
                            onChange={(e) => setNewHobby(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (newHobby.trim()) {
                                  const val = newHobby.trim();
                                  const currentHobbies = profile.hobbies || [];
                                  if (!currentHobbies.includes(val)) {
                                    updateProfileInfo({ hobbies: [...currentHobbies, val] });
                                  }
                                  setNewHobby("");
                                  setShowCustomHobbyInput(false);
                                }
                              }
                            }}
                            className="premium-input-large flex-grow text-slate-800 dark:text-slate-100 border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs font-bold font-sans"
                            placeholder="Enter custom hobby (e.g. 🛹 Skateboarding)"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newHobby.trim()) {
                                const val = newHobby.trim();
                                const currentHobbies = profile.hobbies || [];
                                if (!currentHobbies.includes(val)) {
                                  updateProfileInfo({ hobbies: [...currentHobbies, val] });
                                }
                                setNewHobby("");
                                setShowCustomHobbyInput(false);
                              }
                            }}
                            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-black shadow-sm shrink-0 cursor-pointer transition-colors"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowCustomHobbyInput(false);
                              setNewHobby("");
                            }}
                            className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 text-xs font-black shrink-0 cursor-pointer transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    {profile.hobbies && profile.hobbies.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl">
                        {profile.hobbies.map((hobby, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-650 dark:text-slate-300 rounded-full"
                          >
                            <span>{hobby}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveHobby(index)}
                              className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[10px] cursor-pointer"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2 h-px bg-slate-200 dark:bg-slate-800 my-2" />

                  {/* UPI / WhatsApp Quick triggers */}
                  <div>
                    <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1.5">
                      UPI ID (Pay Quick link)
                    </label>
                    <input
                      type="text"
                      value={profile.upiId || ""}
                      onChange={(e) => updateProfileInfo({ upiId: e.target.value })}
                      className="premium-input-large text-slate-800 dark:text-slate-100 border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950"
                      placeholder="e.g. name@upi"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1.5">
                      WhatsApp Number (Chat link)
                    </label>
                    <input
                      type="text"
                      value={profile.whatsappNumber || ""}
                      onChange={(e) => updateProfileInfo({ whatsappNumber: e.target.value })}
                      className="premium-input-large text-slate-800 dark:text-slate-100 border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950"
                      placeholder="e.g. +919876543210"
                    />
                  </div>

                  {/* Verified Badge */}
                  <div className="md:col-span-2 flex items-center justify-between p-4.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl mt-2">
                    <div className="flex gap-3 items-center">
                      <Sparkles className="w-5.5 h-5.5 text-amber-500 shrink-0" />
                      <div>
                        <span className="font-extrabold text-xs block text-slate-800 dark:text-slate-200">Cryptographic Verified Badge</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">Add secure identity label chip to profile preview.</span>
                      </div>
                    </div>
                    <button
                      onClick={() => updateProfileInfo({ verified: !profile.verified })}
                      className={`w-12 h-6.5 rounded-full p-1.5 transition-all cursor-pointer shrink-0 ${
                        profile.verified ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-all ${
                          profile.verified ? "translate-x-5.5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Design Theme & Palette */}
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
            <button
              onClick={() => toggleSection("style")}
              className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/40 text-left border-b border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-450 flex items-center justify-center">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">Design Theme & Palette</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Configure layouts, backgrounds and color skins</p>
                </div>
              </div>
              {activeSection === "style" ? <ChevronUp className="w-4.5 h-4.5 text-slate-400" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-400" />}
            </button>

            {activeSection === "style" && (
              <div className="p-6 space-y-6 animate-slideDown">
                <div>
                  <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-3 font-sans">
                    Theme Color Preset
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {themeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          const isTrialActive = profile.subscriptionStatus === "trial" && new Date() < new Date(profile.trialEndsAt || 0);
                          const isUpgraded = profile.subscriptionStatus === "active" || profile.verified;
                          const isPremium = isTrialActive || isUpgraded;
                          if (!isPremium && opt.value !== "organic") {
                            alert("Your 14-day free trial has expired. Custom themes are a Pro Plan feature. Please upgrade to Pro or Pro Plus under Billing to unlock premium designer themes.");
                            return;
                          }
                          updateProfileInfo({ theme: opt.value as any });
                        }}
                        className={`p-4 rounded-2xl border text-left font-black text-xs flex justify-between items-center transition-all cursor-pointer ${
                          profile.theme === opt.value
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 shadow-sm"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/20 text-slate-700 dark:text-slate-355"
                        }`}
                      >
                        {opt.label}
                        {profile.theme === opt.value && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-3 font-sans">
                    Background Style Pattern
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {bgStyleOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateProfileInfo({ bgStyle: opt.value as any })}
                        className={`p-3.5 rounded-2xl border text-center font-black text-xs flex justify-between sm:justify-center items-center gap-2 transition-all cursor-pointer ${
                          profile.bgStyle === opt.value
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 shadow-sm"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/20 text-slate-700 dark:text-slate-350"
                        }`}
                      >
                        {opt.label}
                        {profile.bgStyle === opt.value && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: Social Links Manager */}
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
            <button
              onClick={() => toggleSection("socials")}
              className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/40 text-left border-b border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-450 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">Social Connections</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Connect and manage dynamic social buttons</p>
                </div>
              </div>
              {activeSection === "socials" ? <ChevronUp className="w-4.5 h-4.5 text-slate-400" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-400" />}
            </button>

            {activeSection === "socials" && (
              <div className="p-6 space-y-4 animate-slideDown">
                
                {/* List social connections */}
                <div className="space-y-2">
                  {profile.socialLinks.map((sLink) => {
                    const preset = PLATFORM_PRESETS.find((p) => p.value === sLink.platform);
                    const SocialIcon = getPresetIcon(preset ? preset.iconName : "Globe");
                    return (
                      <div
                        key={sLink.id}
                        className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex items-center justify-center shrink-0 ${preset ? preset.color.split(" ")[0] : ""}`}>
                            <SocialIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-black block leading-none capitalize">{sLink.platform}</span>
                            <span className="text-[10px] text-slate-400 truncate block mt-1 max-w-[180px] sm:max-w-[260px]">{sLink.url}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditSocial(sLink)}
                            className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSocial(sLink.id)}
                            className="w-7 h-7 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {profile.socialLinks.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/30">
                      No social links connected yet.
                    </div>
                  )}
                </div>

                {/* Inline Social Preset Adder */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-2xl space-y-3 shadow-inner">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-sans">
                    Add Connected Social Link
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <select
                      id="socialPlatformSelect"
                      className="premium-input-large text-slate-850 dark:text-slate-100 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold font-sans cursor-pointer"
                    >
                      {PLATFORM_PRESETS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    
                    <input
                      id="socialUrlInput"
                      type="url"
                      placeholder="Enter handle URL (e.g. https://...)"
                      className="premium-input-large text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-sans"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const platformSelect = document.getElementById("socialPlatformSelect") as HTMLSelectElement;
                      const urlInput = document.getElementById("socialUrlInput") as HTMLInputElement;
                      const platformVal = platformSelect.value;
                      const urlVal = urlInput.value.trim();
                      if (platformVal && urlVal) {
                        const updated = [...(profile.socialLinks || [])];
                        updated.push({
                          id: `social-${Date.now()}`,
                          platform: platformVal,
                          url: urlVal
                        });
                        updateProfileInfo({ socialLinks: updated });
                        urlInput.value = "";
                      }
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 text-white primary-gradient rounded-xl text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Save Connected Social
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: Digital Products Selector */}
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
            <button
              onClick={() => toggleSection("products")}
              className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/40 text-left border-b border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-455 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">Featured Shop Products</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Toggle active products in your digital shop</p>
                </div>
              </div>
              {activeSection === "products" ? <ChevronUp className="w-4.5 h-4.5 text-slate-400" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-400" />}
            </button>

            {activeSection === "products" && (
              <div className="p-6 space-y-3.5 animate-slideDown">
                
                {/* List products with toggle switches */}
                <div className="space-y-2">
                  {profile.products && profile.products.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {prod.imageUrl ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800 bg-white">
                            <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-xs font-black block leading-none truncate max-w-[160px] sm:max-w-[240px]">{prod.name}</span>
                          <span className="text-[10px] text-indigo-650 dark:text-indigo-400 font-extrabold block mt-1.5 leading-none">
                            {prod.currency || "₹"}{prod.price}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => updateProduct(prod.id, { active: !prod.active })}
                        className={`w-11 h-6 rounded-full p-1 transition-all cursor-pointer shrink-0 ${
                          prod.active ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-all ${
                            prod.active ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}

                  {(!profile.products || profile.products.length === 0) && (
                    <div className="text-center py-8 text-slate-400 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/30">
                      No products found. Add products in the Product Workspace.
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Right Phone Mockup Panel with Viewport Switcher */}
        <div className="lg:col-span-2 sticky top-8 flex flex-col items-center gap-6 z-10 w-full min-w-0">
          
          {/* Viewport switcher toolbar */}
          <div className="flex bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-2 rounded-2xl shadow-sm gap-1.5">
            <button
              onClick={() => setViewMode("mobile")}
              className={`px-4.5 py-3 rounded-xl flex items-center gap-2 text-xs font-black transition-all cursor-pointer ${
                viewMode === "mobile"
                  ? "bg-slate-100 dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-650"
              }`}
            >
              <Smartphone className="w-4.5 h-4.5" />
              Mobile
            </button>
            <button
              onClick={() => setViewMode("tablet")}
              className={`px-4.5 py-3 rounded-xl flex items-center gap-2 text-xs font-black transition-all cursor-pointer ${
                viewMode === "tablet"
                  ? "bg-slate-100 dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-650"
              }`}
            >
              <Tablet className="w-4.5 h-4.5" />
              Tablet
            </button>
            <button
              onClick={() => setViewMode("desktop")}
              className={`px-4.5 py-3 rounded-xl flex items-center gap-2 text-xs font-black transition-all cursor-pointer ${
                viewMode === "desktop"
                  ? "bg-slate-100 dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-650"
              }`}
            >
              <Monitor className="w-4.5 h-4.5" />
              Desktop View
            </button>
          </div>

          {/* Casing simulator */}
          <div className="w-full flex justify-center min-w-0">
            <PreviewDevice viewMode={viewMode} />
          </div>
        </div>

      </div>

      {/* Embedded Social Link Modal */}
      <SocialLinkModal
        isOpen={socialModalOpen}
        onClose={() => setSocialModalOpen(false)}
        onSave={handleSaveSocial}
        linkToEdit={editingSocial}
      />

    </div>
  );
}
