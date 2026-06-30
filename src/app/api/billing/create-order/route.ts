import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRazorpayOrder, getPublicKeyId } from "@/lib/razorpay";
import { BillingPlan, getPlanAmount, toSmallestUnit } from "@/lib/billing-plans";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wid, plan, currency, countryCode } = body as {
      wid: number;
      plan: BillingPlan;
      currency: "INR" | "USD";
      countryCode?: string;
    };

    if (!wid || !plan || !currency) {
      return NextResponse.json({ error: "wid, plan, and currency are required" }, { status: 400 });
    }

    if (plan !== "pro" && plan !== "pro-plus") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (currency !== "INR" && currency !== "USD") {
      return NextResponse.json({ error: "Currency must be INR or USD" }, { status: 400 });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { wid: Number(wid) },
      include: { profile: true },
    });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const amount = toSmallestUnit(getPlanAmount(plan, currency));
    const receipt = `ansh-${wid}-${Date.now()}`;

    const order = await createRazorpayOrder({
      plan,
      currency,
      wid: Number(wid),
      receipt,
    });

    const transaction = await prisma.transaction.create({
      data: {
        wid: Number(wid),
        plan,
        amount,
        currency,
        status: "pending",
        provider: "razorpay",
        razorpayOrderId: order.id,
        receipt,
        countryCode: countryCode || (currency === "INR" ? "IN" : "US"),
        metadata: {
          planLabel: plan,
          username: workspace.profile?.username,
        },
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: getPublicKeyId(),
      transactionId: transaction.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    console.error("Create Razorpay order error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
