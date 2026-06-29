"use client";

import { useState } from "react";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { Plus, Paintbrush, Layout, Trash2 } from "lucide-react";

interface SubPageItem {
  id: string;
  title: string;
  path: string;
  views: number;
  status: "published" | "draft";
}

export default function CustomPagesPanel() {
  const [pages, setPages] = useState<SubPageItem[]>([
    { id: "1", title: "Personal Newsletter", path: "/newsletter", views: 242, status: "published" },
    { id: "2", title: "UI/UX Case Studies", path: "/cases", views: 180, status: "published" },
    { id: "3", title: "Tech Musings Blog", path: "/blog", views: 98, status: "draft" },
  ]);

  // Custom delete confirmation states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingPage, setDeletingPage] = useState<SubPageItem | null>(null);

  const handleAddPage = () => {
    const newPage: SubPageItem = {
      id: `p-${Date.now()}`,
      title: "New Custom Page",
      path: "/new-page",
      views: 0,
      status: "draft",
    };
    setPages([...pages, newPage]);
  };

  const handleOpenDelete = (pg: SubPageItem) => {
    setDeletingPage(pg);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingPage) {
      setPages(pages.filter((p) => p.id !== deletingPage.id));
      setDeletingPage(null);
    }
  };

  return (
    <div className="p-8 sm:p-10 space-y-8 w-full animate-fadeIn font-sans">
      
      {/* Header action panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 shadow-sm transition-colors duration-300">
        <div className="space-y-2">
          <h3 className="font-black text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <Paintbrush className="w-5.5 h-5.5" />
            Custom Profile Sub-Pages
          </h3>
          <p className="text-sm text-slate-400">
            Publish custom landing routes or pages to direct traffic from your main tree.
          </p>
        </div>
        
        <button
          onClick={handleAddPage}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white primary-gradient text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform cursor-pointer shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          Create Custom Page
        </button>
      </div>

      {/* Pages listing */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-slate-50/50 dark:bg-slate-950/20 text-xs font-black uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-6">Page Name</th>
                <th className="py-4 px-6">URL Path</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Visitor Views</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5 text-sm font-semibold">
              {pages.map((pg) => (
                <tr key={pg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Layout className="w-4.5 h-4.5" />
                      </div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{pg.title}</span>
                    </div>
                  </td>
                  <td className="py-4.5 px-6 font-mono text-xs text-indigo-600 dark:text-indigo-400">
                    {pg.path}
                  </td>
                  <td className="py-4.5 px-6 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                      pg.status === "published"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}>
                      {pg.status}
                    </span>
                  </td>
                  <td className="py-4.5 px-6 text-center text-slate-400">
                    {pg.views}
                  </td>
                  <td className="py-4.5 px-6 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleOpenDelete(pg)}
                        className="w-8 h-8 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete subpage"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={deletingPage?.title}
      />

    </div>
  );
}
