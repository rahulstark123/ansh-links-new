import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { BillingPlan, getBillingPeriodEnd } from "@/lib/billing-plans";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      wid,
      plan,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      countryCode,
    } = body as {
      wid: number;
      plan: BillingPlan;
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      countryCode?: string;
    };

    if (!wid || !plan || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 });
    }

    if (plan !== "pro" && plan !== "pro-plus") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const isValid = verifyRazorpayPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const existingPayment = await prisma.transaction.findUnique({
      where: { razorpayPaymentId: razorpay_payment_id },
    });

    if (existingPayment?.status === "captured") {
      return NextResponse.json({
        message: "Payment already processed",
        transaction: existingPayment,
      });
    }

    const pendingTx = await prisma.transaction.findFirst({
      where: {
        wid: Number(wid),
        razorpayOrderId: razorpay_order_id,
        status: "pending",
      },
    });

    if (!pendingTx) {
      return NextResponse.json({ error: "Pending transaction not found" }, { status: 404 });
    }

    const periodStart = new Date();
    const periodEnd = getBillingPeriodEnd(periodStart);

    const result = await prisma.$transaction(async (tx) => {
      await tx.subscription.updateMany({
        where: { wid: Number(wid), status: "active" },
        data: {
          status: "cancelled",
          cancelledAt: new Date(),
        },
      });

      const subscription = await tx.subscription.create({
        data: {
          wid: Number(wid),
          plan,
          status: "active",
          currency: pendingTx.currency,
          amount: pendingTx.amount,
          billingInterval: "monthly",
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
        },
      });

      const transaction = await tx.transaction.update({
        where: { id: pendingTx.id },
        data: {
          status: "captured",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          subscriptionId: subscription.id,
          countryCode: countryCode || pendingTx.countryCode,
          metadata: {
            ...(pendingTx.metadata as object | null),
            verifiedAt: new Date().toISOString(),
          },
        },
      });

      await tx.workspace.update({
        where: { wid: Number(wid) },
        data: { subscriptionStatus: "active" },
      });

      const profile = await tx.profile.findUnique({ where: { wid: Number(wid) } });
      if (profile) {
        await tx.profile.update({
          where: { wid: Number(wid) },
          data: { verified: true },
        });
      }

      return { subscription, transaction };
    });

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
      transaction: result.transaction,
      subscriptionStatus: "active",
      verified: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Payment verification failed";
    console.error("Verify Razorpay payment error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
