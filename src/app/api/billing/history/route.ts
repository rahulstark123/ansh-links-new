import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const [subscriptions, transactions] = await Promise.all([
      prisma.subscription.findMany({
        where: { wid },
        orderBy: { createdAt: "desc" },
      }),
      prisma.transaction.findMany({
        where: { wid },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    return NextResponse.json({ subscriptions, transactions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("GET billing history error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
