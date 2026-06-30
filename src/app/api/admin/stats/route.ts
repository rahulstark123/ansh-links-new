import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        messages: { select: { authorType: true } },
      },
    });

    let open = 0;
    let inProgress = 0;
    let closed = 0;
    let notReplied = 0;

    for (const ticket of tickets) {
      const hasSupportReply = ticket.messages.some((m) => m.authorType === "support");

      if (ticket.status === "open") open += 1;
      if (ticket.status === "in_progress") inProgress += 1;
      if (ticket.status === "closed" || ticket.status === "resolved") closed += 1;
      if (!hasSupportReply && ticket.status !== "closed") notReplied += 1;
    }

    const [activeSubscriptions, totalTransactions, capturedRevenue] = await Promise.all([
      prisma.subscription.count({ where: { status: "active" } }),
      prisma.transaction.count({ where: { status: "captured" } }),
      prisma.transaction.aggregate({
        where: { status: "captured" },
        _sum: { amount: true },
      }),
    ]);

    return NextResponse.json({
      tickets: {
        total: tickets.length,
        open,
        inProgress,
        notReplied,
        closed,
      },
      billing: {
        activeSubscriptions,
        totalTransactions,
        capturedAmountSmallestUnit: capturedRevenue._sum.amount || 0,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
