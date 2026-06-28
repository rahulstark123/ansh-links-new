"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }: DeleteConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      
      {/* Modal Card */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300">
        
        {/* Top Header close */}
        <div className="h-14 flex items-center justify-end px-4 border-b border-outline-variant/5">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 text-center space-y-4">
          
          {/* Warning Icon Badge */}
          <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6.5 h-6.5" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-black tracking-tight font-sans text-slate-800 dark:text-slate-200">
              Confirm Deletion
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed font-sans px-2">
              Are you sure you want to remove <span className="font-extrabold text-slate-700 dark:text-slate-300">"{itemName || "this item"}"</span>? This action is permanent and cannot be undone.
            </p>
          </div>

        </div>

        {/* Actions Footer */}
        <div className="h-18 flex items-center justify-end px-6 gap-2.5 border-t border-outline-variant/5 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4.5 py-2.5 rounded-xl border border-outline-variant/10 hover:bg-slate-100 text-[11px] font-black font-sans transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl text-white bg-rose-600 hover:bg-rose-700 text-[11px] font-black font-sans shadow-lg shadow-rose-600/10 hover:scale-[0.98] transition-transform flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Item
          </button>
        </div>

      </div>

    </div>,
    document.body
  );
}
