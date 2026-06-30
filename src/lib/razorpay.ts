import crypto from "crypto";
import { BillingPlan, getPlanAmount, toSmallestUnit } from "@/lib/billing-plans";

const RAZORPAY_API = "https://api.razorpay.com/v1";

function getCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured on the server.");
  }

  return { keyId, keySecret };
}

function authHeader() {
  const { keyId, keySecret } = getCredentials();
  const token = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  return `Basic ${token}`;
}

export async function createRazorpayOrder(params: {
  plan: BillingPlan;
  currency: "INR" | "USD";
  wid: number;
  receipt: string;
}) {
  const { plan, currency, wid, receipt } = params;
  const amount = toSmallestUnit(getPlanAmount(plan, currency));

  const res = await fetch(`${RAZORPAY_API}/orders`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt,
      notes: {
        wid: String(wid),
        plan,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.description || "Failed to create Razorpay order");
  }

  return res.json() as Promise<{
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  }>;
}

export function verifyRazorpayPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const { keySecret } = getCredentials();
  const payload = `${params.orderId}|${params.paymentId}`;
  const expected = crypto.createHmac("sha256", keySecret).update(payload).digest("hex");
  return expected === params.signature;
}

export function getPublicKeyId(): string {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
}
