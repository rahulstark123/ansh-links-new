"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { Bookmark, Plus, Edit2, Trash2, Link2 } from "lucide-react";
import { useState } from "react";
import DynamicIcon from "@/components/common/DynamicIcon";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";

interface StandaloneQuickLink {
  id: string;
  title: string;
  url: string;
  icon: string;
}

const PRESET_ICONS = [
  "Link2", "Github", "Linkedin", "Twitter", "Youtube", "Instagram",
  "Briefcase", "Mail", "Globe", "MessageCircle", "Phone", "Award", "Flame"
];

export default function QuickLinksPanel() {
  const { profile, updateProfileInfo } = useProfileStore();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("Link2");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Custom delete confirmation states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingLink, setDeletingLink] = useState<StandaloneQuickLink | null>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Parse quickLinks stored as serialized JSON strings
  const getQuickLinksList = (): StandaloneQuickLink[] => {
    return (profile.quickLinkIds || [])
      .map((item) => {
        try {
          if (item.startsWith("{")) {
            return JSON.parse(item);
          }
        } catch (e) {
          // ignore parsing error
        }
        return null;
      })
      .filter((item): item is StandaloneQuickLink => item !== null);
  };

  const quickLinks = getQuickLinksList();

  const handleSave = async () => {
    if (!title.trim() || !url.trim()) return;

    const originalTitle = title.trim();
    const linkData = {
      wid: profile.wid,
      title: originalTitle,
      url: url.trim(),
      icon
    };

    try {
      if (editingId) {
        // PATCH /api/quick-links/[id]
        const res = await fetch(`/api/quick-links/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(linkData),
        });
        if (!res.ok) throw new Error("Failed to update quick link");

        const updatedList = (profile.quickLinkIds || []).map((item) => {
          try {
            if (item.startsWith("{")) {
              const parsed = JSON.parse(item);
              if (parsed.id === editingId) {
                return JSON.stringify({ id: editingId, title: originalTitle, url: url.trim(), icon });
              }
            }
          } catch (e) {}
          return item;
        });
        updateProfileInfo({ quickLinkIds: updatedList });
        setEditingId(null);
        showToast(`"${originalTitle}" updated successfully!`, "success");
      } else {
        // POST /api/quick-links
        const res = await fetch("/api/quick-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(linkData),
        });
        if (!res.ok) throw new Error("Failed to create quick link");
        const created = await res.json();

        const currentList = profile.quickLinkIds || [];
        const updatedList = [...currentList, JSON.stringify(created)];
        updateProfileInfo({ quickLinkIds: updatedList });
        showToast(`"${originalTitle}" created successfully!`, "success");
      }

      setTitle("");
      setUrl("");
      setIcon("Link2");
    } catch (err: any) {
      showToast("Error saving quick link: " + err.message, "error");
    }
  };

  const handleEdit = (link: StandaloneQuickLink) => {
    setEditingId(link.id);
    setTitle(link.title);
    setUrl(link.url);
    setIcon(link.icon || "Link2");
  };

  const handleDelete = (link: StandaloneQuickLink) => {
    setDeletingLink(link);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingLink) {
      try {
        const res = await fetch(`/api/quick-links/${deletingLink.id}?wid=${profile.wid}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Failed to delete quick link");

        const updatedList = (profile.quickLinkIds || []).filter((item) => {
          try {
            if (item.startsWith("{")) {
              const parsed = JSON.parse(item);
              return parsed.id !== deletingLink.id;
            }
          } catch (e) {}
          return true;
        });
        updateProfileInfo({ quickLinkIds: updatedList });
        showToast(`"${deletingLink.title}" deleted!`, "success");

        if (editingId === deletingLink.id) {
          setEditingId(null);
          setTitle("");
          setUrl("");
          setIcon("Link2");
        }
      } catch (err: any) {
        showToast("Error deleting quick link: " + err.message, "error");
      } finally {
        setDeletingLink(null);
        setIsConfirmOpen(false);
      }
    }
  };

  return (
    <div className="p-8 sm:p-10 space-y-8 w-full animate-fadeIn font-sans">
      
      {/* Header Block */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 shadow-sm transition-colors duration-300">
        <h3 className="font-black text-base flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
          <Bookmark className="w-5.5 h-5.5" />
          Quick Links Workspace
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Create and manage your workspace-specific quick redirect links. These standalone quick action links are rendered as header-level shortcut tags.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        
        {/* Left Form: Add / Edit Link */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-[2rem] p-6 shadow-sm space-y-5">
          <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
            {editingId ? "Modify Quick Link" : "Create Quick Link"}
          </h4>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black tracking-wider text-slate-450 dark:text-slate-500 uppercase block mb-1.5">
                Link Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="premium-input-large text-slate-855 dark:text-slate-100 border-slate-200 dark:border-slate-805 bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold"
                placeholder="e.g. My Website"
              />
            </div>

            <div>
              <label className="text-[10px] font-black tracking-wider text-slate-455 dark:text-slate-500 uppercase block mb-1.5">
                Destination URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="premium-input-large text-slate-855 dark:text-slate-100 border-slate-200 dark:border-slate-805 bg-slate-50/50 dark:bg-slate-955/20 text-xs font-semibold"
                placeholder="e.g. https://example.com"
              />
            </div>

            <div>
              <label className="text-[10px] font-black tracking-wider text-slate-455 dark:text-slate-500 uppercase block mb-2">
                Symbol Icon
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-55/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                {PRESET_ICONS.map((ico) => (
                  <button
                    key={ico}
                    type="button"
                    onClick={() => setIcon(ico)}
                    className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      icon === ico
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-900 border border-slate-202/50 dark:border-slate-800 text-slate-500 hover:bg-slate-100"
                    }`}
                    title={ico}
                  >
                    <DynamicIcon name={ico} className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={!title.trim() || !url.trim()}
                className="flex-grow flex items-center justify-center gap-1.5 py-3 text-white primary-gradient rounded-xl text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform disabled:opacity-50 cursor-pointer"
              >
                {editingId ? "Save Changes" : "Add Quick Link"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setUrl("");
                    setIcon("Link2");
                  }}
                  className="px-4 py-3 rounded-xl border border-outline-variant/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-black transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right List: Quick Links List */}
        <div className="md:col-span-3 space-y-4">
          <span className="text-[10px] font-black text-slate-405 dark:text-slate-500 uppercase tracking-widest block font-sans pl-1">
            Saved Quick Links List
          </span>

          <div className="space-y-3">
            {quickLinks.map((link) => (
              <div
                key={link.id}
                className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-5 shadow-sm flex items-center justify-between transition-all hover:border-indigo-500/25"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-202/50 dark:border-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                    <DynamicIcon name={link.icon || "Link2"} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black block truncate leading-none mb-1 text-slate-800 dark:text-slate-202">
                      {link.title}
                    </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-slate-400 font-bold block truncate hover:underline"
                    >
                      {link.url}
                    </a>
                  </div>
                </div>

                <div className="flex gap-1 shrink-0 ml-4">
                  <button
                    onClick={() => handleEdit(link)}
                    className="w-8 h-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                    title="Edit Quick Link"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(link)}
                    className="w-8 h-8 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-955/20 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Quick Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {quickLinks.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-900 border border-dashed border-outline-variant/10 rounded-3xl p-8 text-slate-400 space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-300">
                  <Bookmark className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold">No quick links saved</p>
                <p className="text-xs">Create your first quick link in the form on the left.</p>
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
        itemName={deletingLink?.title}
      />

      {/* Custom Toast Notification Overlay */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1050] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-white dark:bg-slate-900 border-outline-variant/10 animate-slideDown font-bold text-xs select-none">
          <div className={`w-2.5 h-2.5 rounded-full ${toast.type === "success" ? "bg-emerald-500 shadow-sm" : "bg-rose-500 shadow-sm"}`} />
          <span className="text-slate-800 dark:text-slate-202">{toast.message}</span>
        </div>
      )}

    </div>
  );
}
