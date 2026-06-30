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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { wid, body: messageBody, authorName, authorType, attachments } = body;

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

    if (!trimmedBody && !hasAttachments) {
      return NextResponse.json({ error: "Message or at least one attachment is required" }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.findFirst({
      where: { id, wid: parsedWid },
      include: { profile: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.status === "closed") {
      return NextResponse.json({ error: "This ticket is closed" }, { status: 400 });
    }

    const supportKey = request.headers.get("x-support-key");
    const isSupportReply =
      authorType === "support" &&
      supportKey &&
      supportKey === process.env.SUPPORT_ADMIN_SECRET;

    const resolvedAuthorType = isSupportReply ? "support" : "user";
    const resolvedAuthorName = isSupportReply
      ? "ANSH Support"
      : authorName?.trim() || ticket.profile.name || "User";

    if (resolvedAuthorType === "user" && ticket.status === "resolved") {
      await prisma.supportTicket.update({
        where: { id },
        data: { status: "open" },
      });
    }

    const [message] = await prisma.$transaction([
      prisma.ticketMessage.create({
        data: {
          ticketId: id,
          authorType: resolvedAuthorType,
          authorName: resolvedAuthorName,
          body: trimmedBody,
          attachments: buildAttachmentCreates(attachments),
        },
        include: { attachments: true },
      }),
      prisma.supportTicket.update({
        where: { id },
        data: {
          updatedAt: new Date(),
          ...(isSupportReply ? { status: "in_progress" } : {}),
        },
      }),
    ]);

    return NextResponse.json(message, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("POST Ticket Message Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
