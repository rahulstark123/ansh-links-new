"use client";

import { useProfileStore, SocialLink } from "@/store/useProfileStore";
import SocialLinkModal from "@/components/dashboard/SocialLinkModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { User, Plus, Edit2, Trash2, Globe, Mail, Linkedin, Github, Twitter, Instagram, Youtube, Facebook } from "lucide-react";
import { useState } from "react";

export const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "instagram": return Instagram;
    case "github": return Github;
    case "twitter": return Twitter;
    case "linkedin": return Linkedin;
    case "email": return Mail;
    case "youtube": return Youtube;
    case "facebook": return Facebook;
    case "website":
    default:
      return Globe;
  }
};

const getSocialColorClass = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "instagram": return "text-pink-600 bg-pink-50 dark:bg-pink-950/20";
    case "github": return "text-slate-800 bg-slate-100 dark:text-slate-200 dark:bg-slate-800/40";
    case "twitter": return "text-sky-400 bg-sky-50 dark:bg-sky-950/20";
    case "linkedin": return "text-sky-600 bg-sky-50 dark:bg-sky-950/20";
    case "email": return "text-rose-500 bg-rose-50 dark:bg-rose-950/20";
    case "youtube": return "text-red-600 bg-red-50 dark:bg-red-950/20";
    case "facebook": return "text-blue-600 bg-blue-50 dark:bg-blue-950/20";
    case "website":
    default:
      return "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20";
  }
};

export default function SocialProfilePanel() {
  const { profile, updateProfileInfo } = useProfileStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  // Custom delete confirmation states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingLink, setDeletingLink] = useState<SocialLink | null>(null);

  const socialLinks = profile.socialLinks || [];

  const handleOpenCreate = () => {
    setEditingLink(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (link: SocialLink) => {
    setEditingLink(link);
    setModalOpen(true);
  };

  const handleOpenDelete = (link: SocialLink) => {
    setDeletingLink(link);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingLink) {
      const updated = socialLinks.filter((l) => l.id !== deletingLink.id);
      updateProfileInfo({ socialLinks: updated });
      setDeletingLink(null);
    }
  };

  const handleSaveSocial = (linkData: Omit<SocialLink, "id">) => {
    let updated = [...socialLinks];

    if (editingLink) {
      // Modify existing link
      updated = updated.map((l) =>
        l.id === editingLink.id ? { ...l, ...linkData } : l
      );
    } else {
      // Append new link (supports duplicates!)
      updated.push({
        id: `social-${Date.now()}`,
        ...linkData,
      });
    }

    updateProfileInfo({ socialLinks: updated });
  };

  return (
    <div className="p-8 sm:p-10 space-y-8 max-w-5xl mx-auto animate-fadeIn font-sans">
      
      {/* Header Block */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-colors duration-300">
        <div className="space-y-2">
          <h3 className="font-black text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <User className="w-5.5 h-5.5" />
            Social Profiles Setup
          </h3>
          <p className="text-sm text-slate-400">
            Connect your handles to display quick-redirect badges on your identity landing page. Supports multiple profiles per platform.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white primary-gradient text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform cursor-pointer shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          Add Social Profile
        </button>
      </div>

      {/* Social Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {socialLinks.map((link) => {
          const PlatformIcon = getSocialIcon(link.platform);
          const colorClass = getSocialColorClass(link.platform);
          
          return (
            <div
              key={link.id}
              className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                  <PlatformIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black capitalize block">{link.platform} Link</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-400 font-bold block truncate hover:underline max-w-[200px] mt-0.5"
                  >
                    {link.url}
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 shrink-0 ml-4">
                <button
                  onClick={() => handleOpenEdit(link)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                  title="Modify Profile"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenDelete(link)}
                  className="w-8 h-8 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove Profile"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}

        {socialLinks.length === 0 && (
          <div className="col-span-full text-center py-24 bg-white dark:bg-slate-900 border border-dashed border-outline-variant/10 rounded-3xl p-8 text-slate-400 space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-300">
              <User className="w-7 h-7" />
            </div>
            <p className="text-base font-bold">No social profiles connected</p>
            <p className="text-xs">Select "Add Social Profile" above to connect your Instagram, GitHub, or LinkedIn.</p>
          </div>
        )}
      </div>

      {/* Social Link Form Modal */}
      <SocialLinkModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSocial}
        linkToEdit={editingLink}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={`${deletingLink?.platform} link`}
      />

    </div>
  );
}
