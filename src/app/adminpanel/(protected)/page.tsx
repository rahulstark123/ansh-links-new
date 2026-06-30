"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MessageSquare,
  Send,
  Headphones,
  User,
  FileText,
  ExternalLink,
  Loader2,
} from "lucide-react";

type TicketListItem = {
  id: string;
  ticketRef: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  updatedAt: string;
  profile?: { name: string; username: string };
  messages: { authorType: string; body: string; createdAt: string }[];
  _count: { messages: number };
};

type TicketMessage = {
  id: string;
  authorType: string;
  authorName: string;
  body: string;
  createdAt: string;
  attachments: {
    id: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
  }[];
};

type TicketDetail = Omit<TicketListItem, "messages" | "_count"> & {
  messages: TicketMessage[];
};

function statusBadge(status: string) {
  const map: Record<string, string> = {
    open: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    in_progress: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    resolved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    closed: "bg-slate-700 text-slate-400 border-slate-600",
  };
  return map[status] || map.open;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<TicketDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);

  const loadTickets = useCallback(async () => {
    const res = await fetch("/api/admin/tickets");
    if (res.ok) setTickets(await res.json());
    setLoading(false);
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    const res = await fetch(`/api/admin/tickets/${id}`);
    if (res.ok) setDetail(await res.json());
    setDetailLoading(false);
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    if (selectedId) loadDetail(selectedId);
    else setDetail(null);
  }, [selectedId, loadDetail]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !replyBody.trim()) return;
    setReplying(true);
    setReplyError("");

    try {
      const res = await fetch(`/api/admin/tickets/${selectedId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send reply");
      }
      setReplyBody("");
      await Promise.all([loadDetail(selectedId), loadTickets()]);
    } catch (err: unknown) {
      setReplyError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setReplying(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedId) return;
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/admin/tickets/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await Promise.all([loadDetail(selectedId), loadTickets()]);
      }
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="shrink-0 px-6 py-4 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          Support Tickets
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">All workspaces · select a ticket to reply</p>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Left: ticket list */}
        <div className="w-[380px] shrink-0 border-r border-slate-800 flex flex-col min-h-0">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading tickets…
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm p-6 text-center">
              No support tickets yet.
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {tickets.map((ticket) => {
                const active = selectedId === ticket.id;
                const lastMsg = ticket.messages[0];
                return (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => setSelectedId(ticket.id)}
                    className={`w-full text-left px-4 py-3 border-b border-slate-800/80 transition-colors ${
                      active ? "bg-indigo-950/50 border-l-2 border-l-indigo-500" : "hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono text-indigo-400">{ticket.ticketRef}</span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${statusBadge(ticket.status)}`}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-200 truncate">{ticket.subject}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {ticket.profile?.name || "Unknown"} · @{ticket.profile?.username || "—"}
                    </p>
                    {lastMsg && (
                      <p className="text-[11px] text-slate-600 mt-1 truncate">{lastMsg.body}</p>
                    )}
                    <p className="text-[10px] text-slate-600 mt-1">{formatDate(ticket.updatedAt)}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: chat */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {!selectedId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Select a ticket to view the conversation</p>
            </div>
          ) : detailLoading && !detail ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading conversation…
            </div>
          ) : detail ? (
            <>
              <div className="shrink-0 px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-indigo-400">{detail.ticketRef}</p>
                  <h2 className="text-base font-bold text-white truncate">{detail.subject}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {detail.profile?.name} · @{detail.profile?.username} · {detail.category} ·{" "}
                    <span className="capitalize">{detail.priority}</span>
                  </p>
                </div>
                <select
                  value={detail.status}
                  disabled={statusUpdating}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {detail.messages.map((msg) => {
                  const isSupport = msg.authorType === "support";
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isSupport ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isSupport ? "bg-indigo-600" : "bg-slate-700"
                        }`}
                      >
                        {isSupport ? (
                          <Headphones className="w-4 h-4 text-white" />
                        ) : (
                          <User className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <div className={`max-w-[75%] ${isSupport ? "text-right" : ""}`}>
                        <p className="text-[10px] text-slate-500 mb-1">
                          {msg.authorName} · {formatDate(msg.createdAt)}
                        </p>
                        <div
                          className={`inline-block text-left px-4 py-2.5 rounded-2xl text-sm ${
                            isSupport
                              ? "bg-indigo-600 text-white rounded-tr-sm"
                              : "bg-slate-800 text-slate-200 rounded-tl-sm"
                          }`}
                        >
                          {msg.body}
                        </div>
                        {msg.attachments?.length > 0 && (
                          <div className={`mt-2 flex flex-wrap gap-2 ${isSupport ? "justify-end" : ""}`}>
                            {msg.attachments.map((file) => {
                              const isImage = file.mimeType.startsWith("image/");
                              return (
                                <a
                                  key={file.id}
                                  href={file.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:border-indigo-500/50 text-xs text-slate-300"
                                >
                                  {isImage ? (
                                    <img
                                      src={file.fileUrl}
                                      alt={file.fileName}
                                      className="w-8 h-8 rounded object-cover"
                                    />
                                  ) : (
                                    <FileText className="w-4 h-4 text-rose-400" />
                                  )}
                                  <span className="truncate max-w-[80px]">{file.fileName}</span>
                                  <ExternalLink className="w-3 h-3 opacity-50" />
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {detail.status !== "closed" && (
                <form onSubmit={handleReply} className="shrink-0 px-6 py-4 border-t border-slate-800">
                  {replyError && (
                    <p className="text-xs text-rose-400 mb-2">{replyError}</p>
                  )}
                  <div className="flex gap-2">
                    <textarea
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      placeholder="Reply as ANSH Support…"
                      rows={2}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white resize-none focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={replying || !replyBody.trim()}
                      className="shrink-0 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 flex items-center justify-center"
                    >
                      {replying ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
