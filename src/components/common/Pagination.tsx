"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

interface PaginationProps {
  page: number;
  total: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export function getPageCount(total: number, pageSize = PAGE_SIZE) {
  return Math.max(1, Math.ceil(total / pageSize));
}

export default function Pagination({
  page,
  total,
  pageSize = PAGE_SIZE,
  onPageChange,
}: PaginationProps) {
  const totalPages = getPageCount(total, pageSize);

  if (total <= pageSize) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-outline-variant/10 bg-slate-50/50 dark:bg-slate-950/20">
      <span className="text-[11px] font-bold text-slate-400">
        Showing {start}–{end} of {total}
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-outline-variant/10 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        <span className="text-xs font-black text-slate-500 px-2">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-outline-variant/10 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export { PAGE_SIZE };
