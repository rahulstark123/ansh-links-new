"use client";

import { useState, useEffect } from "react";
import { useProfileStore, SocialLink, CustomField } from "@/store/useProfileStore";
import PreviewDevice from "@/components/dashboard/PreviewDevice";
import DynamicIcon from "@/components/common/DynamicIcon";
import SocialLinkModal, { PLATFORM_PRESETS } from "@/components/dashboard/SocialLinkModal";
import ProductModal from "@/components/dashboard/ProductModal";
import LinkCreateModal from "@/components/dashboard/LinkCreateModal";
import { CustomFieldModal } from "@/components/dashboard/CustomFieldsPanel";
import {
  createCustomField,
  updateCustomField,
  fetchCustomFields,
  isCustomFieldActive,
} from "@/lib/custom-fields-api";
import { uploadCompressedImage } from "@/lib/upload-image";
import {
  User,
  Layout,
  Sparkles,
  ShoppingBag,
  Check,
  Heart,
  ArrowLeft,
  Link2,
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown,
  ChevronUp,
  Globe,
  Briefcase,
  Zap,
  Edit2,
  Trash2,
  Bookmark,
  Plus,
  Palette
} from "lucide-react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MAX_QUICK_LINKS, applyProfileFill } from "@/lib/quick-links";
import ProfileFillDropdown from "@/components/dashboard/ProfileFillDropdown";

interface CanvasPanelProps {
  linkId: string;
  onBack: () => void;
  previewOnly?: boolean;
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


export default function CanvasPanel({ linkId, onBack, previewOnly = false }: CanvasPanelProps) {
  const {
    profile,
    updateLink,
    updateProfileInfo,
    updateProduct,
    syncWithCloud,
    saveStatus
  } = useProfileStore();

  const [viewMode, setViewMode] = useState<"mobile" | "tablet" | "desktop">("mobile");
  
  // Publish states
  const [isPublishSuccessOpen, setIsPublishSuccessOpen] = useState(false);
  
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

  // Product Creator modal state inside Canvas
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [socialDropdownOpen, setSocialDropdownOpen] = useState(false);
  const [customFieldDropdownOpen, setCustomFieldDropdownOpen] = useState(false);
  const [customFieldModalOpen, setCustomFieldModalOpen] = useState(false);
  const [editingCustomField, setEditingCustomField] = useState<CustomField | null>(null);
  const [linkCreateModalOpen, setLinkCreateModalOpen] = useState(false);
  
  // Custom toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const applyCustomFieldUpdate = (saved: CustomField) => {
    const fields = profile.customFields || [];
    const exists = fields.some((cf) => cf.id === saved.id);
    const updated = exists
      ? fields.map((cf) => (cf.id === saved.id ? saved : cf))
      : [...fields, saved];
    updateProfileInfo({ customFields: updated });
  };

  const patchCustomFieldActive = async (field: CustomField, active: boolean, successMessage: string) => {
    if (!profile.wid) {
      showToast("Workspace not found. Please reload your profile.", "error");
      return;
    }
    try {
      const saved = await updateCustomField(field.id, profile.wid, { active });
      applyCustomFieldUpdate(saved);
      showToast(successMessage, "success");
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  const loadCustomFields = () => {
    if (!profile.wid) return;
    fetchCustomFields(profile.wid)
      .then((loaded) => updateProfileInfo({ customFields: loaded }))
      .catch((err) => console.error("Failed to load custom fields:", err));
  };

  useEffect(() => {
    loadCustomFields();
  }, [profile.wid]);

  useEffect(() => {
    if (activeSection === "customLinks") {
      loadCustomFields();
    }
  }, [activeSection]);

  const allCustomFields = profile.customFields || [];
  const featuredCustomFields = allCustomFields.filter(isCustomFieldActive);

  const handlePublish = async () => {
    await syncWithCloud();
    const status = useProfileStore.getState().saveStatus;
    if (status === 'saved') {
      setIsPublishSuccessOpen(true);
    } else {
      showToast("Failed to save and publish profile. Please check connection.", "error");
    }
  };

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
    if (editingSocial && editingSocial.id) {
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
    <div className="p-8 sm:p-10 animate-fadeIn w-full font-sans">
      
      {/* Panel header controls */}
      <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-black transition-all cursor-pointer shadow-sm bg-white dark:bg-slate-900"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          {previewOnly ? "Back to My Links" : "Back to Links Manager"}
        </button>

        {!previewOnly && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden lg:inline">
            Workspace Sandbox: <span className="font-extrabold text-indigo-750 dark:text-indigo-400">@{profile.username}</span>
          </span>
          <button
            onClick={handlePublish}
            disabled={saveStatus === "saving"}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white primary-gradient text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            {saveStatus === "saving" ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm font-fill-1">send</span>
                Save & Publish Live
              </>
            )}
          </button>
        </div>
        )}
      </div>

      <div className={`grid grid-cols-1 gap-10 items-start ${previewOnly ? "justify-items-center" : "lg:grid-cols-5"}`}>
        
        {!previewOnly && (
        <div className="lg:col-span-3 space-y-6">
          {/* SECTION 1: Personal Info & Bio */}
          <div className={`bg-white dark:bg-slate-900 border rounded-3xl overflow-hidden transition-all duration-300 ${
            activeSection === "personal"
              ? "border-indigo-500/50 dark:border-indigo-500/35 shadow-[0_10px_30px_-5px_rgba(79,70,229,0.08)]"
              : "border-slate-205 dark:border-slate-800 shadow-sm"
          }`}>
            <button
              onClick={() => toggleSection("personal")}
              className={`w-full flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/40 text-left transition-all ${
                activeSection === "personal" ? "border-b border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/10" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-705 dark:text-emerald-455 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 font-sans">Personal Info & Bio</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Customize avatar, display name, biography, and verified status</p>
                </div>
              </div>
              {activeSection === "personal" ? <ChevronUp className="w-4.5 h-4.5 text-slate-400" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-400" />}
            </button>

            <AnimatePresence initial={false}>
              {activeSection === "personal" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1.5">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => updateProfileInfo({ name: e.target.value })}
                          className="premium-input-large text-slate-855 dark:text-slate-100 border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950"
                          placeholder="Ansh Kumar"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1.5 font-sans">
                          Username Slug
                        </label>
                        <div className="flex rounded-2xl overflow-hidden border border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                          <span className="px-3.5 py-3 text-xs text-slate-400 dark:text-slate-555 bg-slate-100/50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex items-center select-none font-bold shrink-0">
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
                        <label className="text-xs font-black tracking-wider text-slate-505 dark:text-slate-400 uppercase block mb-2 font-sans">
                          Profile Avatar Picture
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4.5 bg-slate-50 dark:bg-slate-955/20 border border-slate-200 dark:border-slate-800 rounded-2xl">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md shrink-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                            {profile.avatar ? (
                              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-slate-400 text-[10px] font-bold">No Image</span>
                            )}
                          </div>
                          <div className="flex-grow w-full space-y-2">
                            <div className="flex gap-2">
                              <label className="flex-grow flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-55 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-900/30 hover:bg-indigo-100/40 dark:hover:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm text-center">
                                <span className="material-symbols-outlined text-sm">cloud_upload</span>
                                <span>Upload Image</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                      updateProfileInfo({ avatar: "" });
                                      const url = await uploadCompressedImage(file, "avatar");
                                      updateProfileInfo({ avatar: url });
                                    } catch (err) {
                                      const message = err instanceof Error ? err.message : "Failed to upload avatar image.";
                                      alert(message);
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
                          className="premium-input-large text-slate-800 dark:text-slate-100 border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955 font-sans"
                          placeholder="e.g. Next.js 16 & Tailwind v4"
                        />
                      </div>

                      {/* Verified Badge */}
                      <div className="md:col-span-2 flex items-center justify-between p-4.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl mt-2">
                        <div className="flex gap-3 items-center">
                          <Sparkles className="w-5.5 h-5.5 text-amber-505 shrink-0" />
                          <div>
                            <span className="font-extrabold text-xs block text-slate-800 dark:text-slate-200">Cryptographic Verified Badge</span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">Add secure identity label chip to profile preview.</span>
                          </div>
                        </div>
                        <button
                          type="button"
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 4: Quick Payments & Contact */}
          <div className={`bg-white dark:bg-slate-900 border rounded-3xl overflow-hidden transition-all duration-300 ${
            activeSection === "quickTriggers"
              ? "border-indigo-500/50 dark:border-indigo-500/35 shadow-[0_10px_30px_-5px_rgba(79,70,229,0.08)]"
              : "border-slate-200 dark:border-slate-805 shadow-sm"
          }`}>
            <button
              onClick={() => toggleSection("quickTriggers")}
              className={`w-full flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/40 text-left transition-all ${
                activeSection === "quickTriggers" ? "border-b border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/10" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-455 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 font-sans">Payments & Chat Triggers</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Configure UPI payments and direct WhatsApp chat links</p>
                </div>
              </div>
              {activeSection === "quickTriggers" ? <ChevronUp className="w-4.5 h-4.5 text-slate-400" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-400" />}
            </button>

            <AnimatePresence initial={false}>
              {activeSection === "quickTriggers" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1.5 font-sans">
                          UPI ID (Quick payment link)
                        </label>
                        <input
                          type="text"
                          value={profile.upiId || ""}
                          onChange={(e) => updateProfileInfo({ upiId: e.target.value })}
                          className="premium-input-large text-slate-800 dark:text-slate-100 border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955 font-sans"
                          placeholder="e.g. name@upi"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1.5 font-sans">
                          WhatsApp Number (Chat trigger)
                        </label>
                        <input
                          type="text"
                          value={profile.whatsappNumber || ""}
                          onChange={(e) => updateProfileInfo({ whatsappNumber: e.target.value })}
                          className="premium-input-large text-slate-800 dark:text-slate-100 border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955 font-sans"
                          placeholder="e.g. +919876543210"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 5: Social Connections */}
          <div className={`bg-white dark:bg-slate-900 border rounded-3xl transition-all duration-300 ${
            activeSection === "socials"
              ? "border-indigo-500/50 dark:border-indigo-500/35 shadow-[0_10px_30px_-5px_rgba(79,70,229,0.08)] overflow-visible"
              : "border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
          }`}>
            <button
              onClick={() => toggleSection("socials")}
              className={`w-full flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-855/40 text-left transition-all ${
                activeSection === "socials" ? "border-b border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/10" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-455 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 font-sans">Social Connections</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Connect and manage dynamic social buttons</p>
                </div>
              </div>
              {activeSection === "socials" ? <ChevronUp className="w-4.5 h-4.5 text-slate-400" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-400" />}
            </button>

            <AnimatePresence initial={false}>
              {activeSection === "socials" && (
                <motion.div
                  initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                  animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } }}
                  exit={{ height: 0, opacity: 0, transitionEnd: { overflow: "hidden" } }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    {/* List social connections */}
                    <div className="space-y-2">
                      {(profile.socialLinks || []).filter(s => s.active !== false).map((sLink) => {
                        const preset = PLATFORM_PRESETS.find((p) => p.value === sLink.platform);
                        const SocialIcon = getPresetIcon(preset ? preset.iconName : "Globe");
                        return (
                          <div
                            key={sLink.id}
                            className="flex items-center justify-between p-3.5 bg-slate-55 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-2xl shadow-inner"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-850 flex items-center justify-center shrink-0 ${preset ? preset.color.split(" ")[0] : ""}`}>
                                <SocialIcon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-black block leading-none capitalize">{sLink.platform}</span>
                                <span className="text-[10px] text-slate-400 truncate block mt-1 max-w-[180px] sm:max-w-[260px]">{sLink.url}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditSocial(sLink)}
                                className="w-7 h-7 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-650 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSocial(sLink.id)}
                                className="w-7 h-7 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-955/20 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {(profile.socialLinks || []).filter(s => s.active !== false).length === 0 && (
                        <div className="text-center py-8 text-slate-455 font-bold text-xs border border-dashed border-slate-202/50 dark:border-slate-802 rounded-2xl bg-slate-50/30">
                          No active social links on profile. Select from the dropdown below to feature one.
                        </div>
                      )}
                    </div>

                    {/* Social connection selector and quick plus adder */}
                    <div className="relative">
                      {/* Styled Custom Select Dropdown Trigger */}
                      <button
                        type="button"
                        onClick={() => setSocialDropdownOpen(!socialDropdownOpen)}
                        className="w-full flex items-center justify-between px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs font-black text-slate-700 dark:text-slate-355 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-sans"
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-indigo-500" />
                          Add Social Profile...
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${socialDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {socialDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setSocialDropdownOpen(false)} />
                          <div className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-2xl shadow-xl z-[100] p-2 space-y-1 animate-fadeIn">
                            {(profile.socialLinks || []).filter(s => !s.active).map((sLink) => {
                              const preset = PLATFORM_PRESETS.find((p) => p.value === sLink.platform);
                              return (
                                <button
                                  key={sLink.id}
                                  type="button"
                                  onClick={() => {
                                    const updated = profile.socialLinks.map((s) =>
                                      s.id === sLink.id ? { ...s, active: true } : s
                                    );
                                    updateProfileInfo({ socialLinks: updated });
                                    setSocialDropdownOpen(false);
                                    showToast("Social connection featured on profile!", "success");
                                  }}
                                  className="w-full flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-305 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition-colors cursor-pointer"
                                >
                                  <span>{preset ? preset.label : sLink.platform} ({sLink.url})</span>
                                </button>
                              );
                            })}
                            
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSocial(null);
                                setSocialModalOpen(true);
                                setSocialDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-800/80 mt-1 pt-2"
                            >
                              ➕ Create & Feature New Social Profile...
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 6: Custom Page Links (Multiple Links Manager) */}
          <div className={`bg-white dark:bg-slate-900 border rounded-3xl transition-all duration-300 ${
            activeSection === "customLinks"
              ? `border-indigo-500/50 dark:border-indigo-500/35 shadow-[0_10px_30px_-5px_rgba(79,70,229,0.08)] overflow-visible ${customFieldDropdownOpen ? "relative z-40" : ""}`
              : "border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
          }`}>
            <button
              onClick={() => toggleSection("customLinks")}
              className={`w-full flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/40 text-left transition-all ${
                activeSection === "customLinks" ? "border-b border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/10" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-705 dark:text-indigo-455 flex items-center justify-center">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 font-sans">Custom Fields</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Manage, edit, and feature multiple custom fields</p>
                </div>
              </div>
              {activeSection === "customLinks" ? <ChevronUp className="w-4.5 h-4.5 text-slate-400" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-400" />}
            </button>

            <AnimatePresence initial={false}>
              {activeSection === "customLinks" && (
                <motion.div
                  initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                  animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } }}
                  exit={{ height: 0, opacity: 0, transitionEnd: { overflow: "hidden" } }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    {/* List all custom fields featured on the profile */}
                    <div className="space-y-3">
                      {featuredCustomFields.map((field) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-2xl shadow-inner animate-fadeIn"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-850 flex items-center justify-center shrink-0 text-slate-500">
                              <DynamicIcon name={field.icon || "Link2"} className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-black block leading-none capitalize">{field.key}</span>
                              <span className="text-[10px] text-slate-400 truncate block mt-1.5 max-w-[180px] sm:max-w-[260px]">{field.value}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCustomField(field);
                                setCustomFieldModalOpen(true);
                              }}
                              className="w-7 h-7 rounded-lg hover:bg-slate-55 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-650 transition-colors cursor-pointer"
                              title="Modify Field"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => patchCustomFieldActive(field, false, "Custom field hidden from profile page.")}
                              className="w-7 h-7 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-955/20 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Hide from profile page"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {featuredCustomFields.length === 0 && (
                        <div className="text-center py-8 text-slate-455 font-bold text-xs border border-dashed border-slate-202/50 dark:border-slate-802 rounded-2xl bg-slate-50/30">
                          No active custom fields on profile. Select from the dropdown below to feature one.
                        </div>
                      )}
                    </div>

                    {/* Custom Field selector dropdown trigger */}
                    <div className="relative z-50">
                      <button
                        type="button"
                        onClick={() => setCustomFieldDropdownOpen(!customFieldDropdownOpen)}
                        className="w-full flex items-center justify-between px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs font-black text-slate-700 dark:text-slate-355 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-sans"
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-indigo-500" />
                          Add Custom Field...
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${customFieldDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {customFieldDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setCustomFieldDropdownOpen(false)} />
                          <div className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-2xl shadow-xl z-[100] p-2 space-y-1 animate-fadeIn">
                            {allCustomFields.length === 0 && (
                              <p className="px-4 py-3 text-[10px] font-bold text-slate-400 text-center">
                                No custom fields yet. Create one below.
                              </p>
                            )}
                            {allCustomFields.map((field) => {
                              const isActive = isCustomFieldActive(field);
                              return (
                              <button
                                key={field.id}
                                type="button"
                                disabled={isActive}
                                onClick={async () => {
                                  if (isActive) return;
                                  await patchCustomFieldActive(field, true, "Custom field featured on profile!");
                                  setCustomFieldDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs font-extrabold text-left transition-colors ${
                                  isActive
                                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 cursor-default"
                                    : "text-slate-700 dark:text-slate-305 hover:bg-indigo-55 dark:hover:bg-indigo-955/40 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                                }`}
                              >
                                {isActive ? (
                                  <Check className="w-3.5 h-3.5 shrink-0" />
                                ) : (
                                  <DynamicIcon name={field.icon || "Link2"} className="w-3.5 h-3.5 shrink-0 opacity-70" />
                                )}
                                <span className="flex-1">{field.key}: {field.value}</span>
                                {isActive && (
                                  <span className="text-[9px] font-black uppercase tracking-wider opacity-70">Featured</span>
                                )}
                              </button>
                            );
                            })}
                            
                            <button
                              type="button"
                              onClick={() => {
                                setCustomFieldDropdownOpen(false);
                                setEditingCustomField(null);
                                setCustomFieldModalOpen(true);
                              }}
                              className="w-full flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-802/80 mt-1 pt-2"
                            >
                              ➕ Create & Feature New Custom Field...
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 7: Design Theme & Palette */}
          <div className={`bg-white dark:bg-slate-900 border rounded-3xl overflow-hidden transition-all duration-300 ${
            activeSection === "style"
              ? "border-indigo-500/50 dark:border-indigo-500/35 shadow-[0_10px_30px_-5px_rgba(79,70,229,0.08)]"
              : "border-slate-200 dark:border-slate-800 shadow-sm"
          }`}>
            <button
              onClick={() => toggleSection("style")}
              className={`w-full flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/40 text-left transition-all ${
                activeSection === "style" ? "border-b border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/10" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-955/40 text-purple-700 dark:text-purple-450 flex items-center justify-center">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">Design Theme & Palette</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Configure layouts, backgrounds and color skins</p>
                </div>
              </div>
              {activeSection === "style" ? <ChevronUp className="w-4.5 h-4.5 text-slate-400" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-400" />}
            </button>

            <AnimatePresence initial={false}>
              {activeSection === "style" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="text-xs font-black tracking-wider text-slate-555 dark:text-slate-400 uppercase block mb-3 font-sans">
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
                                ? "border-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 shadow-sm"
                                : "border-slate-205 dark:border-slate-805 hover:bg-slate-50 dark:hover:bg-slate-850/20 text-slate-700 dark:text-slate-355"
                            }`}
                          >
                            {opt.label}
                            {profile.theme === opt.value && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black tracking-wider text-slate-555 dark:text-slate-400 uppercase block mb-3 font-sans">
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
                                : "border-slate-200 dark:border-slate-805 hover:bg-slate-50 dark:hover:bg-slate-850/20 text-slate-705 dark:text-slate-350"
                            }`}
                          >
                            {opt.label}
                            {profile.bgStyle === opt.value && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 8: Featured Shop Products */}
          <div className={`bg-white dark:bg-slate-900 border rounded-3xl transition-all duration-300 ${
            activeSection === "products"
              ? "border-indigo-500/50 dark:border-indigo-500/35 shadow-[0_10px_30px_-5px_rgba(79,70,229,0.08)] overflow-visible"
              : "border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
          }`}>
            <button
              onClick={() => toggleSection("products")}
              className={`w-full flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-855/40 text-left transition-all ${
                activeSection === "products" ? "border-b border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-955/10" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-955/40 text-rose-700 dark:text-rose-455 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">Featured Shop Products</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Toggle active products in your digital shop</p>
                </div>
              </div>
              {activeSection === "products" ? <ChevronUp className="w-4.5 h-4.5 text-slate-400" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-400" />}
            </button>

            <AnimatePresence initial={false}>
              {activeSection === "products" && (
                <motion.div
                  initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                  animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } }}
                  exit={{ height: 0, opacity: 0, transitionEnd: { overflow: "hidden" } }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    
                    {/* Products selector and quick plus adder */}
                    <div className="relative">
                      {/* Styled Custom Select Dropdown Trigger */}
                      <button
                        type="button"
                        onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                        className="w-full flex items-center justify-between px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs font-black text-slate-700 dark:text-slate-300 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-sans"
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-indigo-500" />
                          Feature Product from Store...
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${productDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {productDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setProductDropdownOpen(false)} />
                          <div className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-2xl shadow-xl z-[100] p-2 space-y-1 animate-fadeIn">
                            {(profile.products || []).filter(p => !p.active).map((prod) => (
                              <button
                                key={prod.id}
                                type="button"
                                onClick={() => {
                                  const updated = (profile.products || []).map(p =>
                                    p.id === prod.id ? { ...p, active: true } : p
                                  );
                                  updateProfileInfo({ products: updated });
                                  setProductDropdownOpen(false);
                                  showToast("Product featured on profile!", "success");
                                }}
                                className="w-full flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 text-left transition-colors cursor-pointer"
                              >
                                <span>{prod.name} ({prod.currency || "₹"}{prod.price})</span>
                              </button>
                            ))}
                            
                            <button
                              type="button"
                              onClick={() => {
                                setProductModalOpen(true);
                                setProductDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-800/80 mt-1 pt-2"
                            >
                              ➕ Create & Feature New Product...
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* List products with toggle switches */}
                    <div className="space-y-2">
                      {profile.products && profile.products.filter(prod => prod.active).map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center justify-between p-3.5 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {prod.imageUrl ? (
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800 bg-white">
                                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-955/20 text-rose-505 flex items-center justify-center shrink-0">
                                <ShoppingBag className="w-5 h-5" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="text-xs font-black block leading-none truncate max-w-[160px] sm:max-w-[240px]">{prod.name}</span>
                              <span className="text-[10px] text-indigo-605 dark:text-indigo-400 font-extrabold block mt-1.5 leading-none">
                                {prod.currency || "₹"}{prod.price}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              updateProduct(prod.id, { active: false });
                              showToast("Product removed from featured list", "success");
                            }}
                            className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-955/20 text-slate-500 hover:text-rose-600 text-[10px] font-black rounded-xl transition-all cursor-pointer shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      {(!profile.products || profile.products.filter(prod => prod.active).length === 0) && (
                        <div className="text-center py-8 text-slate-405 text-xs font-bold border border-dashed border-slate-200/65 dark:border-slate-800 rounded-2xl bg-slate-50/30">
                          No featured products yet. Select from the store dropdown above to feature one.
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
        )}

        {/* Right Phone Mockup Panel with Viewport Switcher */}
        <div className={`${previewOnly ? "w-full max-w-2xl" : "lg:col-span-2"} sticky top-8 flex flex-col items-center gap-6 z-10 w-full min-w-0`}>
          
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

      {/* Embedded Product Creator Modal */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        productToEdit={null}
        showToast={showToast}
      />

      {/* Embedded Custom Link Creator Modal */}
      <LinkCreateModal
        isOpen={linkCreateModalOpen}
        onClose={() => setLinkCreateModalOpen(false)}
        onCreateSuccess={(newLinkId) => {
          setLinkCreateModalOpen(false);
          showToast("Custom link created and added to profile!", "success");
        }}
      />
      {/* Embedded Custom Field Creator Modal */}
      <CustomFieldModal
        isOpen={customFieldModalOpen}
        onClose={() => {
          setCustomFieldModalOpen(false);
          setEditingCustomField(null);
        }}
        onSave={async (fieldData) => {
          if (!profile.wid) {
            showToast("Workspace not found. Please reload your profile.", "error");
            return;
          }
          try {
            if (editingCustomField) {
              const saved = await updateCustomField(editingCustomField.id, profile.wid, fieldData);
              applyCustomFieldUpdate(saved);
              showToast("Custom field updated successfully!", "success");
            } else {
              const saved = await createCustomField(profile.wid, { ...fieldData, active: true });
              applyCustomFieldUpdate(saved);
              showToast("Custom field created and featured on profile!", "success");
            }
          } catch (err) {
            showToast((err as Error).message, "error");
          }
        }}
        fieldToEdit={editingCustomField}
      />

      {/* Custom Toast Notification Overlay */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1050] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-white dark:bg-slate-900 border-outline-variant/10 font-bold text-xs select-none animate-fadeIn">
          <div className={`w-2.5 h-2.5 rounded-full ${toast.type === "success" ? "bg-emerald-500 shadow-sm" : "bg-rose-500 shadow-sm"}`} />
          <span className="text-slate-800 dark:text-slate-200">{toast.message}</span>
        </div>
      )}

      {/* Publish Success Modal */}
      {isPublishSuccessOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fadeIn font-sans">
          <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 text-center space-y-6 animate-fadeIn">
            
            {/* Celebration Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-4xl animate-bounce">celebration</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">Profile Published Live!</h3>
              <p className="text-xs text-slate-450 font-medium">
                Your custom links, design layouts, and details have been successfully synchronized.
              </p>
            </div>

            {/* Public Link Display & Action */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4.5 border border-outline-variant/10 rounded-2xl space-y-3">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block text-left">
                Your Shareable Public Link
              </span>
              <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 pl-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-350 truncate text-left select-all">
                  {typeof window !== "undefined" ? `${window.location.origin}/${profile.username}` : `/${profile.username}`}
                </span>
                <button
                  onClick={() => {
                    const url = typeof window !== "undefined" ? `${window.location.origin}/${profile.username}` : `/${profile.username}`;
                    navigator.clipboard.writeText(url);
                    showToast("Link copied to clipboard!", "success");
                  }}
                  className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100/50 text-indigo-700 dark:text-indigo-400 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Copy
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setIsPublishSuccessOpen(false)}
                className="w-full py-3.5 rounded-2xl border border-outline-variant/10 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-black transition-all cursor-pointer"
              >
                Keep Editing
              </button>
              <a
                href={`/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl text-white primary-gradient text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm font-fill-1">open_in_new</span>
                View Live Page
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
