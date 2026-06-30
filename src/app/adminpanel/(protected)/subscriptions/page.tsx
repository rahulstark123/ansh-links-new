"use client";

import { useEffect, useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

type SubscriptionRow = {
  id: string;
  plan: string;
  status: string;
  currency: string;
  amount: number;
  billingInterval: string;
  currentPeriodEnd: string;
  createdAt: string;
  workspace: {
    wid: number;
    profile?: { name: string; username: string };
  };
  transactions: {
    razorpayPaymentId: string | null;
    createdAt: string;
  }[];
};

type TransactionRow = {
  id: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  razorpayPaymentId: string | null;
  countryCode: string | null;
  createdAt: string;
  workspace: {
    wid: number;
    profile?: { name: string; username: string };
  };
};

function formatMoney(amount: number, currency: string) {
  const value = amount / 100;
  if (currency === "INR") return `₹${value.toFixed(0)}`;
  if (currency === "USD") return `$${value.toFixed(2)}`;
  return `${value} ${currency}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"subscriptions" | "payments">("subscriptions");

  useEffect(() => {
    fetch("/api/admin/subscriptions")
      .then((res) => (res.ok ? res.json() : { subscriptions: [], transactions: [] }))
      .then((data) => {
        setSubscriptions(data.subscriptions || []);
        setTransactions(data.transactions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <header className="shrink-0 px-6 py-4 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-400" />
          Subscriptions & Payments
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">All paid workspaces</p>

        <div className="flex gap-2 mt-4">
          {(["subscriptions", "payments"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                tab === t
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center text-slate-500 text-sm py-12">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading…
          </div>
        ) : tab === "subscriptions" ? (
          subscriptions.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-12">No subscriptions yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-900 text-left text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3 font-semibold">Workspace</th>
                    <th className="px-4 py-3 font-semibold">Username</th>
                    <th className="px-4 py-3 font-semibold">Plan</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Period End</th>
                    <th className="px-4 py-3 font-semibold">Started</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="bg-slate-950/50 hover:bg-slate-900/50">
                      <td className="px-4 py-3 text-slate-200 font-medium">
                        {sub.workspace.profile?.name || `WID ${sub.workspace.wid}`}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        @{sub.workspace.profile?.username || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-300 capitalize">{sub.plan}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            sub.status === "active"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-slate-700 text-slate-400"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {formatMoney(sub.amount, sub.currency)}
                        <span className="text-slate-600 text-[10px] ml-1">/{sub.billingInterval}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {formatDate(sub.currentPeriodEnd)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(sub.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : transactions.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-12">No captured payments yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-left text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-semibold">Workspace</th>
                  <th className="px-4 py-3 font-semibold">Username</th>
                  <th className="px-4 py-3 font-semibold">Plan</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Country</th>
                  <th className="px-4 py-3 font-semibold">Payment ID</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="bg-slate-950/50 hover:bg-slate-900/50">
                    <td className="px-4 py-3 text-slate-200 font-medium">
                      {tx.workspace.profile?.name || `WID ${tx.workspace.wid}`}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      @{tx.workspace.profile?.username || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-300 capitalize">{tx.plan}</td>
                    <td className="px-4 py-3 text-slate-300">{formatMoney(tx.amount, tx.currency)}</td>
                    <td className="px-4 py-3 text-slate-500">{tx.countryCode || "—"}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[10px]">
                      {tx.razorpayPaymentId || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
