"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ArrowRight,
} from "lucide-react";

type Stats = {
  tickets: {
    total: number;
    open: number;
    inProgress: number;
    notReplied: number;
    closed: number;
  };
  billing: {
    activeSubscriptions: number;
    totalTransactions: number;
    capturedAmountSmallestUnit: number;
  };
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <header className="shrink-0 px-6 py-4 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-indigo-400" />
          Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">Support & billing overview</p>
      </header>

      <div className="p-6 space-y-8">
        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Support Tickets
          </h2>
          {loading ? (
            <p className="text-slate-500 text-sm">Loading stats…</p>
          ) : stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                label="Open"
                value={stats.tickets.open}
                icon={MessageSquare}
                color="bg-blue-500/20 text-blue-400"
              />
              <StatCard
                label="In Progress"
                value={stats.tickets.inProgress}
                icon={Clock}
                color="bg-amber-500/20 text-amber-400"
              />
              <StatCard
                label="Not Replied"
                value={stats.tickets.notReplied}
                icon={AlertCircle}
                color="bg-rose-500/20 text-rose-400"
              />
              <StatCard
                label="Closed"
                value={stats.tickets.closed}
                icon={CheckCircle2}
                color="bg-emerald-500/20 text-emerald-400"
              />
            </div>
          ) : (
            <p className="text-rose-400 text-sm">Failed to load stats.</p>
          )}

          <Link
            href="/adminpanel"
            className="inline-flex items-center gap-2 mt-4 text-sm text-indigo-400 hover:text-indigo-300"
          >
            Go to tickets
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Billing
          </h2>
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Active Subscriptions"
                value={stats.billing.activeSubscriptions}
                icon={CreditCard}
                color="bg-indigo-500/20 text-indigo-400"
              />
              <StatCard
                label="Captured Payments"
                value={stats.billing.totalTransactions}
                icon={CheckCircle2}
                color="bg-emerald-500/20 text-emerald-400"
              />
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Revenue (mixed currencies)
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.billing.capturedAmountSmallestUnit.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-600 mt-1">Smallest currency units (paise/cents)</p>
              </div>
            </div>
          )}

          <Link
            href="/adminpanel/subscriptions"
            className="inline-flex items-center gap-2 mt-4 text-sm text-indigo-400 hover:text-indigo-300"
          >
            View all subscriptions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
