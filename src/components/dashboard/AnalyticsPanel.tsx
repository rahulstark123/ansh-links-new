"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { Eye, MousePointerClick, TrendingUp, Smartphone, Globe, Laptop, Tablet } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export default function AnalyticsPanel() {
  const { profile } = useProfileStore();

  const stats = [
    {
      title: "Total Profile Views",
      value: "1,284",
      change: "+14.8%",
      icon: Eye,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      title: "Total Link Clicks",
      value: "842",
      change: "+12.2%",
      icon: MousePointerClick,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: "Average Click-Through Rate",
      value: "65.5%",
      change: "+2.4%",
      icon: TrendingUp,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
    },
  ];

  // Daily visitors data for Recharts Area Chart
  const trafficData = [
    { name: "Day 1", Views: 35, Clicks: 22 },
    { name: "Day 2", Views: 42, Clicks: 28 },
    { name: "Day 3", Views: 38, Clicks: 24 },
    { name: "Day 4", Views: 55, Clicks: 35 },
    { name: "Day 5", Views: 68, Clicks: 45 },
    { name: "Day 6", Views: 80, Clicks: 52 },
    { name: "Day 7", Views: 75, Clicks: 48 },
    { name: "Day 8", Views: 92, Clicks: 60 },
    { name: "Day 9", Views: 88, Clicks: 58 },
    { name: "Day 10", Views: 110, Clicks: 75 },
    { name: "Day 11", Views: 128, Clicks: 88 },
    { name: "Today", Views: 142, Clicks: 97 },
  ];

  // Referrers data for Recharts Bar Chart
  const referrerData = [
    { name: "LinkedIn", views: 412, fill: "#0A66C2" },
    { name: "Direct", views: 385, fill: "#4F46E5" },
    { name: "WhatsApp", views: 256, fill: "#25D366" },
    { name: "Twitter / X", views: 128, fill: "#000000" },
    { name: "GitHub", views: 103, fill: "#24292F" },
  ];

  const deviceUsage = [
    { name: "Mobile", percentage: 84, icon: Smartphone, color: "bg-indigo-600" },
    { name: "Desktop", percentage: 13, icon: Laptop, color: "bg-slate-400" },
    { name: "Tablet", percentage: 3, icon: Tablet, color: "bg-amber-500" },
  ];

  // Custom tooltips styling matching editorial layout
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border border-outline-variant/10 p-3 rounded-2xl shadow-xl text-white font-sans text-xs">
          <p className="font-black text-slate-300 mb-1">{label}</p>
          {payload.map((item: any, i: number) => (
            <p key={i} className="font-extrabold" style={{ color: item.color }}>
              {item.name}: <span className="text-white">{item.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 sm:p-10 space-y-8 max-w-6xl mx-auto animate-fadeIn font-sans">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:scale-[1.01]"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 block">{stat.title}</span>
                <span className="text-3xl font-black block tracking-tight">{stat.value}</span>
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  <span className="text-emerald-500">{stat.change}</span>
                  <span className="text-slate-400">vs last month</span>
                </div>
              </div>

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Traffic Area Chart */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-black text-base text-slate-800 dark:text-slate-200">Visitor Analytics</h3>
            <p className="text-xs text-slate-400">Total clicks and profile impressions over the last 12 days.</p>
          </div>
          <span className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black px-4 py-2 rounded-xl border border-outline-variant/5">
            Last 12 Days
          </span>
        </div>

        {/* Chart Canvas Area */}
        <div className="w-full h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94A3B8", fontSize: 9, fontWeight: 800 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94A3B8", fontSize: 9, fontWeight: 800 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="Views"
                stroke="#4F46E5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorViews)"
              />
              <Area
                type="monotone"
                dataKey="Clicks"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorClicks)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Referrers & Devices breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recharts Bar Chart for Referrers */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="mb-6">
            <h3 className="font-black text-base text-slate-800 dark:text-slate-200">Referrer Channels</h3>
            <p className="text-xs text-slate-400">Discover where your profile traffic originates from.</p>
          </div>

          <div className="w-full h-[180px] flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={referrerData} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148, 163, 184, 0.08)" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 9, fontWeight: 800 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 9, fontWeight: 800 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.04)" }} />
                <Bar dataKey="views" radius={[0, 8, 8, 0]}>
                  {referrerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-base text-slate-800 dark:text-slate-200">Device & Viewport</h3>
            <p className="text-xs text-slate-400">Visitor viewport client classifications.</p>
          </div>

          <div className="space-y-5 my-6">
            {deviceUsage.map((device, idx) => {
              const Icon = device.icon;
              return (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black">{device.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-bold">{device.percentage}%</span>
                    <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${device.color}`} style={{ width: `${device.percentage}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4.5 border border-outline-variant/5 rounded-2xl text-center">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">
              Mobile Optimization Score
            </span>
            <span className="text-base font-extrabold block">98 / 100</span>
          </div>
        </div>

      </div>

    </div>
  );
}
