export type BillingPlan = "pro" | "pro-plus";

export const PLAN_PRICING: Record<
  BillingPlan,
  { INR: number; USD: number; label: string }
> = {
  pro: { INR: 199, USD: 5, label: "Pro" },
  "pro-plus": { INR: 399, USD: 7, label: "Pro Plus" },
};

export function getPlanAmount(plan: BillingPlan, currency: "INR" | "USD"): number {
  return PLAN_PRICING[plan][currency];
}

export function toSmallestUnit(amount: number): number {
  return Math.round(amount * 100);
}

export function getBillingPeriodEnd(from = new Date()): Date {
  const end = new Date(from);
  end.setMonth(end.getMonth() + 1);
  return end;
}
