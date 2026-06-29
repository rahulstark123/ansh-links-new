"use client";

import { useState } from "react";
import { useProfileStore, LinkItem } from "@/store/useProfileStore";
import LinkCreateModal from "@/components/dashboard/LinkCreateModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import DynamicIcon from "@/components/common/DynamicIcon";
import { PLATFORM_PRESETS } from "@/components/dashboard/SocialLinkModal";
import {
  Plus,
  Link2,
  LayoutGrid,
  TableProperties,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  ExternalLink,
  CheckCircle,
  XCircle,
  MoreVertical,
  Copy,
} from "lucide-react";

interface MyLinksPanelProps {
  searchQuery?: string;
  onEnterCanvasMode: (linkId: string) => void;
}

export default function MyLinksPanel({ searchQuery = "", onEnterCanvasMode }: MyLinksPanelProps) {
  const { profile, removeLink, updateLink, reorderLinks, addLink } = useProfileStore();

  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Context dropdown menu selection state
  const [openMenuLinkId, setOpenMenuLinkId] = useState<string | null>(null);

  // Custom delete confirmation states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);

  // Filter links dynamically based on global search query
  const filteredLinks = profile.links.filter((link) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      link.title.toLowerCase().includes(query) ||
      (link.subtitle && link.subtitle.toLowerCase().includes(query)) ||
      link.url.toLowerCase().includes(query)
    );
  });

  const handleOpenCreate = () => {
    const isTrialActive = profile.subscriptionStatus === "trial" && new Date() < new Date(profile.trialEndsAt || 0);
    const isUpgraded = profile.subscriptionStatus === "active" || profile.verified;
    const isPremium = isTrialActive || isUpgraded;

    if (!isPremium && profile.links.length >= 5) {
      alert("Your 14-day free trial has expired and you are on the Free Plan. Free Plan is limited to 5 redirect path links. Please upgrade to Pro or Pro Plus under Billing to add unlimited links.");
      return;
    }
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (link: LinkItem) => {
    onEnterCanvasMode(link.id);
  };

  const handleCreateSuccess = (newLinkId: string) => {
    setCreateModalOpen(false);
    onEnterCanvasMode(newLinkId);
  };

  const handleToggleActive = (link: LinkItem) => {
    updateLink(link.id, { active: !link.active });
  };

  const handleOpenDelete = (link: LinkItem) => {
    setDeletingLink(link);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingLink) {
      removeLink(deletingLink.id);
      setDeletingLink(null);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const reordered = [...profile.links];
    const temp = reordered[index];
    reordered[index] = reordered[index - 1];
    reordered[index - 1] = temp;
    reorderLinks(reordered);
  };

  const handleMoveDown = (index: number) => {
    if (index === profile.links.length - 1) return;
    const reordered = [...profile.links];
    const temp = reordered[index];
    reordered[index] = reordered[index + 1];
    reordered[index + 1] = temp;
    reorderLinks(reordered);
  };

  return (
    <div className="p-8 sm:p-10 space-y-8 w-full animate-fadeIn">
      
      {/* Panel Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 shadow-sm">
        <div className="space-y-2">
          <h3 className="font-black text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <Link2 className="w-5.5 h-5.5" />
            Manage Profile Links
          </h3>
          <p className="text-sm text-slate-400">
            Showcase your channels and redirect visitors. Toggle between grid cards and tables.
          </p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* Layout View Mode Selectors */}
          <div className="flex bg-slate-50 dark:bg-slate-950 p-1.5 border border-outline-variant/5 rounded-2xl">
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all ${
                viewMode === "card"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Table List View"
            >
              <TableProperties className="w-4 h-4" />
              Table
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white primary-gradient text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Create Link
          </button>
        </div>
      </div>

      {/* Main Display Grid / Table */}
      {viewMode === "card" ? (
        
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.map((link, idx) => (
            <div
              key={link.id}
              className={`bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:scale-[1.01] ${
                !link.active && "opacity-60"
              }`}
            >
              {/* Card Top */}
              <div className="flex justify-between items-start mb-6">
                {/* Icon display */}
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <DynamicIcon name={link.icon || "Link2"} className="w-5.5 h-5.5" />
                </div>
                
                {/* Quick actions & Toggle */}
                <div className="flex items-center gap-1.5 relative">
                  <button
                    onClick={() => handleToggleActive(link)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      link.active
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {link.active ? "Active" : "Disabled"}
                  </button>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuLinkId(openMenuLinkId === link.id ? null : link.id);
                      }}
                      className="w-8 h-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-650 transition-all cursor-pointer"
                      title="More Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openMenuLinkId === link.id && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setOpenMenuLinkId(null)} />
                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-xl shadow-lg z-40 p-1.5 space-y-1 animate-fadeIn">
                          <button
                            onClick={() => {
                              handleOpenEdit(link);
                              setOpenMenuLinkId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit Link
                          </button>

                          {profile.username && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(link.url);
                                alert("Link copied to clipboard!");
                                setOpenMenuLinkId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-55 dark:hover:bg-slate-800 rounded-lg text-left"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              Copy Link
                            </button>
                          )}

                          <div className="h-px bg-outline-variant/5 my-1" />

                          <button
                            onClick={() => {
                              handleOpenDelete(link);
                              setOpenMenuLinkId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-955/20 rounded-lg text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Link
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Middle */}
              <div className="space-y-1 mb-6">
                <span className="font-extrabold text-base block tracking-tight line-clamp-1">
                  {link.title}
                </span>
                <span className="text-xs text-slate-400 block line-clamp-2 min-h-[2rem]">
                  {link.subtitle || "No description provided."}
                </span>
                {link.url.startsWith("https://ansh.links/") ? (
                  <span className="text-xs text-rose-500 font-extrabold flex items-center gap-1.5 mt-2.5">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Old path format. Edit to fix destination URL.
                  </span>
                ) : (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 mt-2.5 truncate max-w-full"
                  >
                    <span className="truncate">{link.url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                )}
              </div>

              {/* Card Bottom */}
              <div className="pt-4 border-t border-outline-variant/5 flex justify-between items-center text-xs">
                <div className="flex items-center gap-1 text-slate-450 font-bold">
                  <Eye className="w-4 h-4" />
                  <span>{(link as any).clicks || 0} clicks</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        
        /* TABLE LIST VIEW */
        <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/10 bg-slate-50/50 dark:bg-slate-950/20 text-xs font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-4.5 px-6">Name / Subtitle</th>
                  <th className="py-4.5 px-6">Destination URL</th>
                  <th className="py-4.5 px-6">Symbol</th>
                  <th className="py-4.5 px-6 text-center">Status</th>
                  <th className="py-4.5 px-6 text-center">CTR clicks</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5 text-sm font-semibold">
                {filteredLinks.map((link, idx) => (
                  <tr
                    key={link.id}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors ${
                      !link.active && "opacity-60"
                    }`}
                  >
                    {/* Name */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">
                          {link.title}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {link.subtitle || "No description"}
                        </span>
                      </div>
                    </td>

                    {/* URL */}
                    <td className="py-4 px-6 max-w-[200px] truncate">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1.5"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </td>

                    {/* Icon */}
                    <td className="py-4 px-6">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <DynamicIcon name={link.icon || "Link2"} className="w-4.5 h-4.5" />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleActive(link)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          link.active
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        }`}
                      >
                        {link.active ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            Disabled
                          </>
                        )}
                      </button>
                    </td>

                    {/* Clicks */}
                    <td className="py-4 px-6 text-center text-slate-450 dark:text-slate-400">
                      {(link as any).clicks || 0}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right relative">
                      <div className="inline-flex gap-2 justify-end relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuLinkId(openMenuLinkId === link.id ? null : link.id);
                          }}
                          className="w-8 h-8 rounded-lg hover:bg-slate-55 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="Options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openMenuLinkId === link.id && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setOpenMenuLinkId(null)} />
                            <div className="absolute right-0 mt-8 w-40 bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-xl shadow-lg z-40 p-1.5 space-y-1 text-left">
                              <button
                                onClick={() => {
                                  handleOpenEdit(link);
                                  setOpenMenuLinkId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-55 dark:hover:bg-slate-800 rounded-lg text-left"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                Edit Link
                              </button>

                              {profile.username && (
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(link.url);
                                    alert("Link copied to clipboard!");
                                    setOpenMenuLinkId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                  Copy Link
                                </button>
                              )}

                              <div className="h-px bg-outline-variant/5 my-1" />

                              <button
                                onClick={() => {
                                  handleOpenDelete(link);
                                  setOpenMenuLinkId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-955/20 rounded-lg text-left"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete Link
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredLinks.length === 0 && (
        <div className="text-center py-24 bg-white dark:bg-slate-900 border border-dashed border-outline-variant/10 rounded-3xl p-8 text-slate-400 space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-300">
            <Link2 className="w-7 h-7" />
          </div>
          <p className="text-base font-bold">No custom links found</p>
          <p className="text-xs">
            {searchQuery ? "No links matched your search term." : "Click \"Create Link\" to get started."}
          </p>
        </div>
      )}

      {/* Create Overlay Modal */}
      <LinkCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateSuccess={handleCreateSuccess}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={deletingLink?.title}
      />

    </div>
  );
}
