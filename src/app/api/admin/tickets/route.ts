import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  try {
    const tickets = await prisma.supportTicket.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        profile: { select: { name: true, username: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { authorType: true, body: true, createdAt: true },
        },
        _count: { select: { messages: true } },
      },
    });

    return NextResponse.json(tickets);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load tickets";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
