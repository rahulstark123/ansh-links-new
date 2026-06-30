"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  HelpCircle,
  ChevronDown,
  Check,
  CreditCard,
  Wrench,
  User,
  Sparkles,
  Circle,
} from "lucide-react";
import { TicketPriority } from "@/lib/tickets-api";
import { TicketAttachmentInput, uploadTicketAttachments } from "@/lib/ticket-attachments";
import TicketAttachmentPicker, { PendingAttachment } from "./TicketAttachmentPicker";

const CATEGORIES = [
  { value: "general", label: "General", icon: HelpCircle, color: "text-indigo-600 dark:text-indigo-400" },
  { value: "billing", label: "Billing", icon: CreditCard, color: "text-emerald-600 dark:text-emerald-400" },
  { value: "technical", label: "Technical", icon: Wrench, color: "text-violet-600 dark:text-violet-400" },
  { value: "account", label: "Account", icon: User, color: "text-blue-600 dark:text-blue-400" },
  { value: "feature", label: "Feature Request", icon: Sparkles, color: "text-amber-600 dark:text-amber-400" },
];

const PRIORITIES: {
  value: TicketPriority;
  label: string;
  description: string;
  dot: string;
}[] = [
  { value: "low", label: "Low", description: "General question", dot: "bg-slate-400" },
  { value: "medium", label: "Medium", description: "Needs attention", dot: "bg-amber-500" },
  { value: "high", label: "High", description: "Urgent issue", dot: "bg-rose-500" },
];

interface TicketDropdownProps<T extends string> {
  label: string;
  value: T;
  options: {
    value: T;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
    description?: string;
    dot?: string;
  }[];
  onChange: (value: T) => void;
}

function TicketDropdown<T extends string>({ label, value, options, onChange }: TicketDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];
  const SelectedIcon = selected.icon;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-2">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3.5 bg-slate-50 dark:bg-slate-950/60 border rounded-2xl text-xs font-extrabold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer shadow-sm transition-all ${
          open
            ? "border-indigo-500 ring-2 ring-indigo-500/15 bg-white dark:bg-slate-900"
            : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selected.dot ? (
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${selected.dot}`} />
          ) : SelectedIcon ? (
            <SelectedIcon className={`w-4 h-4 shrink-0 ${selected.color}`} />
          ) : null}
          <span className="truncate">{selected.label}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
          <div className="p-1.5 max-h-52 overflow-y-auto">
            {options.map((option) => {
              const Icon = option.icon;
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {option.dot ? (
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${option.dot}`} />
                    ) : Icon ? (
                      <Icon className={`w-4 h-4 shrink-0 ${option.color}`} />
                    ) : (
                      <Circle className="w-4 h-4 shrink-0 text-slate-300" />
                    )}
                    <div className="min-w-0">
                      <span className="text-xs font-extrabold block">{option.label}</span>
                      {option.description && (
                        <span className="text-[10px] text-slate-400 font-medium block truncate">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface TicketCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    subject: string;
    category: string;
    priority: TicketPriority;
    body: string;
    attachments?: TicketAttachmentInput[];
  }) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export default function TicketCreateModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  error = "",
}: TicketCreateModalProps) {
  const [mounted, setMounted] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSubject("");
      setCategory("general");
      setPriority("medium");
      setBody("");
      setAttachments([]);
      setUploadingFiles(false);
      setLocalError("");
    }
  }, [isOpen]);

  const isBusy = loading || uploadingFiles;
  const displayError = localError || error;
  const canSubmit = subject.trim() && (body.trim() || attachments.length > 0);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    let uploaded: TicketAttachmentInput[] | undefined;
    if (attachments.length > 0) {
      setUploadingFiles(true);
      setLocalError("");
      try {
        uploaded = await uploadTicketAttachments(attachments.map((a) => a.file));
      } catch (err) {
        setLocalError(err instanceof Error ? err.message : "Failed to upload attachments");
        setUploadingFiles(false);
        return;
      }
      setUploadingFiles(false);
    }

    await onSubmit({
      subject,
      category,
      priority,
      body,
      attachments: uploaded,
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300">
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg primary-gradient flex items-center justify-center text-white">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-100">
              Create Support Ticket
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form id="ticket-create-form" onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {displayError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 text-xs font-bold">
              {displayError}
            </div>
          )}

          <div>
            <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-2">
              Subject
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="premium-input-large text-xs w-full"
              placeholder="Brief summary of your issue"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TicketDropdown
              label="Category"
              value={category}
              options={CATEGORIES}
              onChange={setCategory}
            />
            <TicketDropdown
              label="Priority"
              value={priority}
              options={PRIORITIES}
              onChange={setPriority}
            />
          </div>

          <div>
            <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-2">
              Message
            </label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="premium-input-large text-xs w-full resize-none"
              placeholder="Describe your issue in detail..."
            />
          </div>

          <TicketAttachmentPicker
            files={attachments}
            onChange={setAttachments}
            disabled={isBusy}
            uploading={uploadingFiles}
          />
        </form>

        <div className="h-20 flex items-center justify-end px-6 gap-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 text-xs font-extrabold text-slate-600 dark:text-slate-300 transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="ticket-create-form"
            disabled={isBusy || !canSubmit}
            className="px-6 py-2.5 rounded-xl text-white primary-gradient text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {uploadingFiles ? "Uploading files..." : loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
