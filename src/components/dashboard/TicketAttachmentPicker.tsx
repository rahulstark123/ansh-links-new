"use client";

import { useRef } from "react";
import { Paperclip, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  MAX_TICKET_ATTACHMENTS,
  validateTicketAttachment,
  formatFileSize,
} from "@/lib/ticket-attachments";

export interface PendingAttachment {
  id: string;
  file: File;
  preview?: string;
}

interface TicketAttachmentPickerProps {
  files: PendingAttachment[];
  onChange: (files: PendingAttachment[]) => void;
  disabled?: boolean;
  uploading?: boolean;
}

export default function TicketAttachmentPicker({
  files,
  onChange,
  disabled = false,
  uploading = false,
}: TicketAttachmentPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming?.length || disabled || uploading) return;

    const remaining = MAX_TICKET_ATTACHMENTS - files.length;
    if (remaining <= 0) {
      alert(`You can attach up to ${MAX_TICKET_ATTACHMENTS} files only.`);
      return;
    }

    const toAdd: PendingAttachment[] = [];
    for (let i = 0; i < Math.min(incoming.length, remaining); i++) {
      const file = incoming[i];
      const error = validateTicketAttachment(file);
      if (error) {
        alert(error);
        continue;
      }
      const id = `${Date.now()}-${i}-${file.name}`;
      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined;
      toAdd.push({ id, file, preview });
    }

    if (incoming.length > remaining) {
      alert(`Only ${MAX_TICKET_ATTACHMENTS} attachments allowed. Added ${toAdd.length} file(s).`);
    }

    if (toAdd.length > 0) {
      onChange([...files, ...toAdd]);
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (id: string) => {
    const removed = files.find((f) => f.id === id);
    if (removed?.preview) URL.revokeObjectURL(removed.preview);
    onChange(files.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
          Attachments
        </label>
        <span className="text-[10px] text-slate-400 font-medium">
          {files.length}/{MAX_TICKET_ATTACHMENTS} · max 2 MB each
        </span>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((item) => (
            <div
              key={item.id}
              className="relative group flex items-center gap-2 pl-2 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 max-w-full"
            >
              {item.preview ? (
                <img
                  src={item.preview}
                  alt={item.file.name}
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-rose-500" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                  {item.file.name}
                </p>
                <p className="text-[9px] text-slate-400">{formatFileSize(item.file.size)}</p>
              </div>
              {!disabled && !uploading && (
                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {files.length < MAX_TICKET_ATTACHMENTS && (
        <label
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed text-xs font-bold transition-colors ${
            disabled || uploading
              ? "opacity-50 pointer-events-none border-slate-200 text-slate-400"
              : "border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 cursor-pointer"
          }`}
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Paperclip className="w-3.5 h-3.5" />
          )}
          <span>{uploading ? "Uploading..." : "Add attachment"}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
            multiple
            className="hidden"
            disabled={disabled || uploading}
            onChange={(e) => addFiles(e.target.files)}
          />
        </label>
      )}

      <p className="text-[9px] text-slate-400 font-medium flex items-center gap-1">
        <ImageIcon className="w-3 h-3" />
        Images are compressed automatically before upload
      </p>
    </div>
  );
}
