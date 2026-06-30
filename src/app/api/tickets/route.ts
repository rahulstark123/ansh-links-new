import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_ATTACHMENTS = 3;

type AttachmentPayload = {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
};

function buildAttachmentCreates(attachments?: AttachmentPayload[]) {
  if (!attachments?.length) return undefined;
  return {
    create: attachments.map((a) => ({
      fileName: a.fileName,
      fileUrl: a.fileUrl,
      fileSize: a.fileSize,
      mimeType: a.mimeType,
    })),
  };
}

function validateAttachments(attachments?: AttachmentPayload[]) {
  if (!attachments) return null;
  if (attachments.length > MAX_ATTACHMENTS) {
    return `Maximum ${MAX_ATTACHMENTS} attachments allowed.`;
  }
  for (const a of attachments) {
    if (!a.fileName || !a.fileUrl || !a.mimeType) {
      return "Invalid attachment data.";
    }
    if (a.fileSize > 2 * 1024 * 1024) {
      return "Each attachment must be 2 MB or smaller.";
    }
  }
  return null;
}

async function generateTicketRef(wid: number) {
  const count = await prisma.supportTicket.count({ where: { wid } });
  return `ANS-${String(wid).padStart(4, "0")}-${String(count + 1).padStart(4, "0")}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const widStr = searchParams.get("wid");
    if (!widStr) {
      return NextResponse.json({ error: "Missing wid parameter" }, { status: 400 });
    }
    const wid = parseInt(widStr, 10);
    if (isNaN(wid)) {
      return NextResponse.json({ error: "Invalid wid parameter" }, { status: 400 });
    }

    const tickets = await prisma.supportTicket.findMany({
      where: { wid },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { messages: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { attachments: true },
        },
      },
    });

    const result = tickets.map((ticket) => ({
      ...ticket,
      lastMessage: ticket.messages[0] ?? null,
      messages: undefined,
    }));

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("GET Tickets Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wid, subject, category, priority, body: messageBody, authorName, attachments } = body;

    if (!wid) {
      return NextResponse.json({ error: "Missing wid parameter" }, { status: 400 });
    }
    const parsedWid = parseInt(wid, 10);
    if (isNaN(parsedWid)) {
      return NextResponse.json({ error: "Invalid wid parameter" }, { status: 400 });
    }

    const attachmentError = validateAttachments(attachments);
    if (attachmentError) {
      return NextResponse.json({ error: attachmentError }, { status: 400 });
    }

    const trimmedBody = messageBody?.trim() || "";
    const hasAttachments = Array.isArray(attachments) && attachments.length > 0;

    if (!subject?.trim()) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }

    if (!trimmedBody && !hasAttachments) {
      return NextResponse.json({ error: "Message or at least one attachment is required" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { wid: parsedWid } });
    if (!profile) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const ticketRef = await generateTicketRef(parsedWid);
    const name = authorName?.trim() || profile.name || "User";

    const ticket = await prisma.supportTicket.create({
      data: {
        wid: parsedWid,
        profileId: profile.id,
        ticketRef,
        subject: subject.trim(),
        category: category || "general",
        priority: priority || "medium",
        messages: {
          create: {
            authorType: "user",
            authorName: name,
            body: trimmedBody,
            attachments: buildAttachmentCreates(attachments),
          },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { attachments: true },
        },
        _count: { select: { messages: true } },
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("POST Ticket Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
