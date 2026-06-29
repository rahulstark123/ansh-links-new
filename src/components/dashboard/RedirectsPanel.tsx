"use client";

import { useProfileStore, LinkItem } from "@/store/useProfileStore";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import {
  CornerDownRight,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Search,
  Globe,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function RedirectsPanel() {
  const { profile, addLink, updateLink, removeLink } = useProfileStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Search query filter
  const [searchQuery, setSearchQuery] = useState("");

  // Editor Modal States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<LinkItem | null>(null);

  // Form Inputs
  const [selectedLinkId, setSelectedLinkId] = useState<string>("");
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formTargetUrl, setFormTargetUrl] = useState("");
  const [formError, setFormError] = useState("");
  
  // Custom dropdown open state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Delete confirm modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingRule, setDeletingRule] = useState<LinkItem | null>(null);

  // Local Copy Feedback Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // Filter links that are acting as custom short redirects or can be resolved
  const redirectRules = profile.links.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingRule(null);
    const firstLink = profile.links[0];
    setSelectedLinkId(firstLink ? firstLink.id : "");
    setFormTitle(firstLink ? firstLink.title : "");
    setFormSlug("");
    setFormTargetUrl(firstLink ? firstLink.url : "");
    setFormError("");
    setDropdownOpen(false);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (rule: LinkItem) => {
    setEditingRule(rule);
    setFormTitle(rule.title);
    setFormSlug(rule.id);
    setFormTargetUrl(rule.url);

    // If the rule points to one of our existing links, auto-select it in the dropdown
    const matchingLink = profile.links.find(
      (l) => l.url === rule.url && l.id !== rule.id
    );
    setSelectedLinkId(matchingLink ? matchingLink.id : "");
    setFormError("");
    setDropdownOpen(false);
    setIsEditorOpen(true);
  };

  const handleOpenDelete = (rule: LinkItem) => {
    setDeletingRule(rule);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingRule) {
      removeLink(deletingRule.id);
      showToast("Redirect rule deleted successfully.");
      setDeletingRule(null);
    }
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const slug = formSlug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    
    const selectedLink = profile.links.find((l) => l.id === selectedLinkId);
    if (!selectedLink) {
      setFormError("Please select a target destination link from your workspace.");
      return;
    }

    const targetUrl = selectedLink.url;
    const title = selectedLink.title;

    if (!slug) {
      setFormError("Please enter a valid alphanumeric redirect slug.");
      return;
    }
    if (!targetUrl || targetUrl === "https://" || targetUrl === "http://") {
      setFormError("Please enter a destination target URL.");
      return;
    }

    try {
      new URL(targetUrl);
    } catch {
      setFormError("Invalid target URL. Please include http:// or https://");
      return;
    }

    // Check slug uniqueness (excluding current editing rule)
    const exists = profile.links.some(
      (l) => l.id.toLowerCase() === slug && (!editingRule || editingRule.id !== l.id)
    );
    if (exists) {
      setFormError("Redirect link already exists in your workspace.");
      return;
    }

    const payload: Omit<LinkItem, "id"> & { id?: string } = {
      id: slug,
      title,
      url: targetUrl,
      subtitle: "Custom short redirect rule.",
      icon: "CornerDownRight",
      active: editingRule ? editingRule.active : true,
    };

    if (editingRule) {
      // If slug has changed, remove old and insert new since ID is primary key
      if (editingRule.id !== slug) {
        removeLink(editingRule.id);
        addLink(payload);
      } else {
        updateLink(editingRule.id, {
          title,
          url: targetUrl,
        });
      }
      showToast("Redirect rule updated successfully.");
    } else {
      addLink(payload);
      showToast("New redirect rule created!");
    }

    setIsEditorOpen(false);
  };

  const handleToggleActive = (rule: LinkItem) => {
    updateLink(rule.id, { active: !rule.active });
    showToast(`Redirect rule ${!rule.active ? "enabled" : "disabled"}.`);
  };

  // Get full short link URL
  const getShortLinkUrl = (slug: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/${profile.username}/${slug}`;
    }
    return `/${profile.username}/${slug}`;
  };

  return (
    <div className="p-8 sm:p-10 space-y-8 w-full animate-fadeIn font-sans">
      
      {/* Header Panel */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h3 className="font-black text-xl flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <CornerDownRight className="w-6 h-6" />
            Redirect Rules (Short Links)
          </h3>
          <p className="text-base text-slate-500 leading-relaxed font-medium">
            Create custom short URLs (e.g. <code className="bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded-lg text-indigo-650 dark:text-indigo-300 font-extrabold">ansh.links/{profile.username || "username"}/slug</code>) that automatically redirect visitors to your target destinations.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white primary-gradient text-sm font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform cursor-pointer shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          Create Redirect Rule
        </button>
      </div>

      {/* Rules Controls & Listing */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl shadow-sm overflow-hidden">
        {/* Search Header */}
        <div className="p-5 border-b border-outline-variant/5 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search redirects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="premium-input pl-10 pr-4 py-2.5 w-full text-sm font-bold bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
            />
          </div>
          <span className="text-sm text-slate-450 font-bold">
            Total Rules: <span className="text-slate-800 dark:text-slate-200">{redirectRules.length}</span>
          </span>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-outline-variant/5 bg-slate-50/30 dark:bg-slate-950/10 text-slate-400 uppercase tracking-widest text-xs font-black font-sans select-none">
                <th className="py-4.5 px-6">Rule Label</th>
                <th className="py-4.5 px-6">Short redirect link</th>
                <th className="py-4.5 px-6">Target Destination URL</th>
                <th className="py-4.5 px-6 text-center">Clicks</th>
                <th className="py-4.5 px-6 text-center">Status</th>
                <th className="py-4.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5 text-sm">
              {redirectRules.map((rule) => {
                const shortUrl = getShortLinkUrl(rule.id);
                return (
                  <tr
                    key={rule.id}
                    className={`hover:bg-slate-50/30 dark:hover:bg-slate-950/10 transition-colors font-sans ${
                      !rule.active && "opacity-60"
                    }`}
                  >
                    {/* Title */}
                    <td className="py-4.5 px-6 font-extrabold text-slate-800 dark:text-slate-250 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <CornerDownRight className="w-4.5 h-4.5" />
                        </div>
                        <span>{rule.title}</span>
                      </div>
                    </td>

                    {/* Short Link */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-indigo-700 dark:text-indigo-400">
                          /{rule.id}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(shortUrl);
                            showToast(`Copied Short Link /${rule.id}!`);
                          }}
                          className="w-7 h-7 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                          title="Copy short link"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Destination Target */}
                    <td className="py-4.5 px-6 max-w-[200px] truncate">
                      <a
                        href={rule.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline flex items-center gap-1.5 text-sm"
                      >
                        <span className="truncate">{rule.url}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </td>

                    {/* Clicks */}
                    <td className="py-4.5 px-6 text-center font-extrabold text-slate-700 dark:text-slate-300 text-sm">
                      {(rule as any).clicks || 0}
                    </td>

                    {/* Status */}
                    <td className="py-4.5 px-6 text-center">
                      <button
                        onClick={() => handleToggleActive(rule)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-colors cursor-pointer ${
                          rule.active
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        }`}
                      >
                        {rule.active ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Disabled
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-6 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(rule)}
                          className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="Edit rule"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(rule)}
                          className="w-8 h-8 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-955/20 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {redirectRules.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-300">
                      <Globe className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold">No redirect rules found</p>
                    <p className="text-xs">Create your first redirect rule with the button above.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl p-4 animate-fadeIn font-sans">
          <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 w-full max-w-md rounded-[2rem] shadow-2xl p-6.5 space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                {editingRule ? "Modify Redirect Rule" : "Create Redirect Rule"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-bold leading-normal">
                Map a clean URL slug to an existing link.
              </p>
            </div>

            <form onSubmit={validateAndSubmit} className="space-y-6">
              
              {/* Option 1: Custom Dropdown / Target Destination Selection */}
              <div className="space-y-2 relative">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block font-sans">
                  Target Destination Link
                </label>
                
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-left text-sm font-bold text-slate-800 dark:text-slate-205 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer min-h-[56px]"
                  >
                    {selectedLinkId ? (
                      <div className="min-w-0">
                        <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate max-w-[280px]">
                          {profile.links.find(l => l.id === selectedLinkId)?.title || "Select a link..."}
                        </div>
                        <div className="text-xs text-slate-450 font-medium truncate max-w-[280px] mt-0.5">
                          {profile.links.find(l => l.id === selectedLinkId)?.url || ""}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400">Select target link...</span>
                    )}
                    <span className="material-symbols-outlined text-slate-400 shrink-0 select-none">unfold_more</span>
                  </button>

                  {/* Dropdown Options List */}
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-[1200]" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute left-0 right-0 mt-1.5 max-h-56 overflow-y-auto bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-2xl shadow-xl z-[1210] p-1.5 space-y-1 animate-fadeIn">
                        {profile.links
                          .filter((l) => l.id !== editingRule?.id) // exclude current rule from listing
                          .map((l) => (
                            <button
                              key={l.id}
                              type="button"
                              onClick={() => {
                                setSelectedLinkId(l.id);
                                setFormTargetUrl(l.url);
                                setFormTitle(l.title);
                                setDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${
                                selectedLinkId === l.id ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-l-2 border-indigo-600" : ""
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="material-symbols-outlined text-base">link</span>
                              </div>
                              <div className="min-w-0">
                                <span className="text-sm font-black block text-slate-800 dark:text-slate-100 truncate">{l.title}</span>
                                <span className="text-xs text-slate-450 font-medium block truncate max-w-[240px] mt-0.5">{l.url}</span>
                              </div>
                            </button>
                          ))}
                        
                        {profile.links.filter((l) => l.id !== editingRule?.id).length === 0 && (
                          <div className="p-4 text-center text-slate-450 font-bold text-sm">
                            No links available. Create some links first.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Option 2: Redirect Slug Path Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block font-sans">
                  Redirect Short Slug Path
                </label>
                <div className="flex rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                  <span className="px-3.5 py-3 text-sm text-slate-555 dark:text-slate-405 bg-slate-100/50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex items-center select-none font-bold shrink-0">
                    /{profile.username || "username"}/
                  </span>
                  <input
                    type="text"
                    placeholder="portfolio"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                    className="premium-input-large flex-grow border-0 bg-transparent rounded-none focus:ring-0 focus:border-0 pl-3 text-sm text-slate-850 dark:text-slate-105"
                  />
                </div>
                <span className="text-xs text-slate-450 font-medium leading-relaxed block mt-1 font-sans">
                  Only lowercase letters, numbers, hyphens, and underscores are allowed.
                </span>
              </div>

              {/* Form validation error feedback */}
              {formError && (
                <div className="p-3.5 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs text-rose-500 font-bold">
                  {formError}
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="w-full py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-black transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl text-white primary-gradient text-sm font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform cursor-pointer"
                >
                  {editingRule ? "Save Rule" : "Create Rule"}
                </button>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={`redirect rule /${deletingRule?.id}`}
      />

      {/* Copy notification toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1060] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-white dark:bg-slate-900 border-outline-variant/10 font-bold text-xs select-none animate-fadeIn">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
          <span className="text-slate-800 dark:text-slate-200">{toast}</span>
        </div>
      )}

    </div>
  );
}
