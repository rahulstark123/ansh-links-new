"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useProfileStore } from "@/store/useProfileStore";
import {
  fetchTickets,
  fetchTicket,
  createTicket,
  replyToTicket,
  SupportTicket,
  TicketPriority,
  TicketMessage,
  TicketAttachment,
} from "@/lib/tickets-api";
import { uploadTicketAttachments, TicketAttachmentInput } from "@/lib/ticket-attachments";
import TicketAttachmentPicker, { PendingAttachment } from "./TicketAttachmentPicker";
import {
  HelpCircle,
  Plus,
  MessageSquare,
  Clock,
  ChevronRight,
  Send,
  X,
  Headphones,
  User,
  FileText,
  ExternalLink,
} from "lucide-react";
import TicketCreateModal from "./TicketCreateModal";

function statusBadge(status: string) {
  const map: Record<string, string> = {
    open: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/40",
    in_progress: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/40",
    resolved: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/40",
    closed: "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200/40",
  };
  return map[status] || map.open;
}

function priorityBadge(priority: string) {
  const map: Record<string, string> = {
    low: "text-slate-500",
    medium: "text-amber-600 dark:text-amber-400",
    high: "text-rose-600 dark:text-rose-400",
  };
  return map[priority] || map.medium;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageAttachments({ attachments }: { attachments: TicketAttachment[] }) {
  if (!attachments.length) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {attachments.map((file) => {
        const isImage = file.mimeType.startsWith("image/");
        return (
          <a
            key={file.id}
            href={file.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors max-w-full"
          >
            {isImage ? (
              <img
                src={file.fileUrl}
                alt={file.fileName}
                className="w-10 h-10 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-rose-500" />
              </div>
            )}
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate max-w-[100px]">
              {file.fileName}
            </span>
            <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 shrink-0" />
          </a>
        );
      })}
    </div>
  );
}

export default function SupportPanel() {
  const { profile } = useProfileStore();
  const wid = profile.wid;

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [replyBody, setReplyBody] = useState("");
  const [replyAttachments, setReplyAttachments] = useState<PendingAttachment[]>([]);
  const [uploadingReplyFiles, setUploadingReplyFiles] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const loadTickets = async () => {
    if (!wid) return;
    setLoading(true);
    try {
      const data = await fetchTickets(wid);
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTicketDetail = async (id: string) => {
    if (!wid) return;
    setDetailLoading(true);
    try {
      const ticket = await fetchTicket(id, wid);
      setSelectedTicket(ticket);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeSidebar = () => {
    setSelectedId(null);
    setSelectedTicket(null);
    setReplyBody("");
    setReplyAttachments([]);
    setReplyError("");
  };

  useEffect(() => {
    loadTickets();
  }, [wid]);

  useEffect(() => {
    if (selectedId) {
      loadTicketDetail(selectedId);
    } else {
      setSelectedTicket(null);
      setReplyBody("");
      setReplyError("");
    }
  }, [selectedId, wid]);

  useEffect(() => {
    if (!selectedId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  const handleCreate = async (data: {
    subject: string;
    category: string;
    priority: TicketPriority;
    body: string;
    attachments?: TicketAttachmentInput[];
  }) => {
    if (!wid) return;

    setCreating(true);
    setCreateError("");
    try {
      await createTicket(wid, {
        ...data,
        authorName: profile.name,
      });
      setShowCreate(false);
      await loadTickets();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create ticket");
    } finally {
      setCreating(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wid || !selectedId) return;
    if (!replyBody.trim() && replyAttachments.length === 0) return;

    setReplying(true);
    setReplyError("");
    try {
      let uploaded;
      if (replyAttachments.length > 0) {
        setUploadingReplyFiles(true);
        uploaded = await uploadTicketAttachments(replyAttachments.map((a) => a.file));
        setUploadingReplyFiles(false);
      }

      await replyToTicket(selectedId, wid, {
        body: replyBody,
        authorName: profile.name,
        attachments: uploaded,
      });
      setReplyBody("");
      setReplyAttachments([]);
      await loadTicketDetail(selectedId);
      await loadTickets();
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : "Failed to send reply");
      setUploadingReplyFiles(false);
    } finally {
      setReplying(false);
    }
  };

  const isReplyBusy = replying || uploadingReplyFiles;
  const canSendReply = replyBody.trim() || replyAttachments.length > 0;

  const hasSupportReply = selectedTicket?.messages?.some((m) => m.authorType === "support");
  const sidebarOpen = !!selectedId;

  const ticketSidebar =
    mounted && sidebarOpen
      ? createPortal(
          <div className="fixed inset-0 z-[1050] flex justify-end">
            <button
              type="button"
              aria-label="Close ticket details"
              onClick={closeSidebar}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] animate-fadeIn"
            />

            <aside
              className="relative w-full max-w-md sm:max-w-lg h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-slideInRight"
            >
              {detailLoading || !selectedTicket ? (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-bold animate-pulse">
                  Loading conversation...
                </div>
              ) : (
                <>
                  <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 shrink-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {selectedTicket.ticketRef}
                        </span>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border ${statusBadge(selectedTicket.status)}`}
                        >
                          {selectedTicket.status.replace("_", " ")}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">
                        {selectedTicket.subject}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 capitalize">
                        {selectedTicket.category} · {selectedTicket.priority} priority · opened{" "}
                        {formatDate(selectedTicket.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={closeSidebar}
                      className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {hasSupportReply && (
                    <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/30 dark:border-indigo-800/30 flex items-center gap-2 shrink-0">
                      <Headphones className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <p className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                        ANSH Support has replied to your ticket
                      </p>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {selectedTicket.messages?.map((msg: TicketMessage) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.authorType === "support" ? "" : "flex-row-reverse"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            msg.authorType === "support"
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {msg.authorType === "support" ? (
                            <Headphones className="w-4 h-4" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            msg.authorType === "support"
                              ? "bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/30 dark:border-indigo-800/30"
                              : "bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-slate-600 dark:text-slate-300">
                              {msg.authorName}
                            </span>
                            {msg.authorType === "support" && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-600 text-white">
                                Support
                              </span>
                            )}
                          </div>
                          {msg.body.trim() && (
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {msg.body}
                            </p>
                          )}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <MessageAttachments attachments={msg.attachments} />
                          )}
                          <p className="text-[9px] text-slate-400 mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedTicket.status !== "closed" ? (
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 shrink-0 space-y-3">
                      {replyError && (
                        <p className="text-[11px] text-rose-500 font-bold">{replyError}</p>
                      )}
                      <TicketAttachmentPicker
                        files={replyAttachments}
                        onChange={setReplyAttachments}
                        disabled={isReplyBusy}
                        uploading={uploadingReplyFiles}
                      />
                      <form onSubmit={handleReply} className="flex gap-2">
                        <textarea
                          value={replyBody}
                          onChange={(e) => setReplyBody(e.target.value)}
                          rows={2}
                          className="premium-input-large text-xs flex-1 resize-none"
                          placeholder="Write a follow-up reply..."
                        />
                        <button
                          type="submit"
                          disabled={isReplyBusy || !canSendReply}
                          className="px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center disabled:opacity-50 cursor-pointer shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 font-medium shrink-0">
                      This ticket is closed. Open a new ticket if you need further help.
                    </div>
                  )}
                </>
              )}
            </aside>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="p-8 sm:p-10 space-y-8 w-full animate-fadeIn font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-black text-lg flex items-center gap-2.5 text-indigo-700 dark:text-indigo-400">
            <HelpCircle className="w-5 h-5" />
            Support Desk
          </h3>
          <p className="text-xs text-slate-400 max-w-md">
            Create a ticket and our ANSH Support team will get back to you. Click a row to view the conversation.
          </p>
        </div>
        <button
          onClick={() => {
            setCreateError("");
            setShowCreate(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-600/10 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add a Ticket
        </button>
      </div>

      <TicketCreateModal
        isOpen={showCreate}
        onClose={() => {
          if (!creating) {
            setShowCreate(false);
            setCreateError("");
          }
        }}
        onSubmit={handleCreate}
        loading={creating}
        error={createError}
      />

      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/5 flex items-center justify-between">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Your Tickets</span>
          <span className="text-[10px] font-bold text-slate-400">{tickets.length} total</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold animate-pulse">
            Loading tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-sm font-black text-slate-600 dark:text-slate-300">No tickets yet</p>
            <p className="text-xs text-slate-400">Create your first support ticket to get help from our team.</p>
            <button
              onClick={() => {
                setCreateError("");
                setShowCreate(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add a Ticket
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/5 bg-slate-50/50 dark:bg-slate-950/30">
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Ref</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Priority</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider hidden lg:table-cell">Updated</th>
                  <th className="px-6 py-3 w-8" />
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => setSelectedId(ticket.id)}
                    className={`border-b border-outline-variant/5 cursor-pointer transition-colors hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 ${
                      selectedId === ticket.id ? "bg-indigo-50/80 dark:bg-indigo-950/30" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {ticket.ticketRef}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {ticket.subject}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 sm:hidden capitalize">
                        {ticket.status.replace("_", " ")}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border ${statusBadge(ticket.status)}`}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-xs font-black capitalize hidden md:table-cell ${priorityBadge(ticket.priority)}`}
                    >
                      {ticket.priority}
                    </td>
                    <td className="px-6 py-4 text-[10px] text-slate-400 font-medium hidden lg:table-cell">
                      {formatDate(ticket.updatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {ticketSidebar}
    </div>
  );
}
