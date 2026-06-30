import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const { body } = await request.json();

    if (!body?.trim()) {
      return NextResponse.json({ error: "Reply message is required" }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const [message] = await prisma.$transaction([
      prisma.ticketMessage.create({
        data: {
          ticketId: id,
          authorType: "support",
          authorName: "ANSH Support",
          body: body.trim(),
        },
        include: { attachments: true },
      }),
      prisma.supportTicket.update({
        where: { id },
        data: {
          status: ticket.status === "open" ? "in_progress" : ticket.status,
          updatedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json(message, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to send reply";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
