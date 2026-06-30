export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high";
export type TicketAuthorType = "user" | "support";

export interface TicketAttachment {
  id: string;
  messageId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorType: TicketAuthorType;
  authorName: string;
  body: string;
  createdAt: string;
  attachments?: TicketAttachment[];
}

export interface SupportTicket {
  id: string;
  wid: number;
  profileId: string;
  ticketRef: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
  _count?: { messages: number };
  lastMessage?: TicketMessage | null;
}

export async function fetchTickets(wid: number): Promise<SupportTicket[]> {
  const res = await fetch(`/api/tickets?wid=${wid}`);
  if (!res.ok) throw new Error("Failed to load support tickets");
  return res.json();
}

export async function fetchTicket(id: string, wid: number): Promise<SupportTicket> {
  const res = await fetch(`/api/tickets/${id}?wid=${wid}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to load ticket");
  }
  return res.json();
}

import { TicketAttachmentInput } from "@/lib/ticket-attachments";

export async function createTicket(
  wid: number,
  data: {
    subject: string;
    category: string;
    priority: TicketPriority;
    body: string;
    authorName: string;
    attachments?: TicketAttachmentInput[];
  }
): Promise<SupportTicket> {
  const res = await fetch("/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wid, ...data }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create ticket");
  }
  return res.json();
}

export async function replyToTicket(
  ticketId: string,
  wid: number,
  data: { body: string; authorName: string; attachments?: TicketAttachmentInput[] }
): Promise<TicketMessage> {
  const res = await fetch(`/api/tickets/${ticketId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wid, ...data }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to send reply");
  }
  return res.json();
}
