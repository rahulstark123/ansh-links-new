import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        workspace: {
          include: {
            profile: { select: { name: true, username: true } },
          },
        },
        transactions: {
          where: { status: "captured" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: { status: "captured" },
      orderBy: { createdAt: "desc" },
      include: {
        workspace: {
          include: {
            profile: { select: { name: true, username: true } },
          },
        },
      },
    });

    return NextResponse.json({ subscriptions, transactions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load subscriptions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
