"use client";

import { useEffect, useState } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import Pagination, { PAGE_SIZE, getPageCount } from "@/components/common/Pagination";
import {
  Layers,
  Search,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
  ArrowUpRight,
  Clock,
  Activity,
  Flame,
} from "lucide-react";

interface LogEntry {
  id: string;
  ip: string;
  country: string;
  flag: string;
  browser: string;
  device: "mobile" | "desktop" | "tablet";
  action: string;
  details: string;
  timestamp: string;
}

interface TrafficResponse {
  summary: {
    totalHits: number;
    totalHitsChange: number;
    avgDurationSeconds: number;
    bounceRate: number;
    topCountry: string;
    topCountryPercent: number;
  };
  logs: LogEntry[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function TrafficLogsPanel() {
  const { profile } = useProfileStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("All");
  const [data, setData] = useState<TrafficResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [actionFilter, searchTerm]);

  const totalLogs = data?.pagination?.total ?? data?.logs?.length ?? 0;

  useEffect(() => {
    const maxPage = getPageCount(totalLogs);
    if (currentPage > maxPage) setCurrentPage(maxPage);
  }, [totalLogs, currentPage]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (profile.wid) params.set("wid", String(profile.wid));
    else params.set("username", profile.username);
    if (actionFilter !== "All") params.set("action", actionFilter);
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    params.set("page", String(currentPage));
    params.set("limit", String(PAGE_SIZE));

    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/analytics/traffic?${params.toString()}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => setData(json))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, searchTerm ? 400 : 0);

    return () => clearTimeout(timer);
  }, [profile.wid, profile.username, actionFilter, searchTerm, currentPage]);

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile": return Smartphone;
      case "tablet": return Tablet;
      case "desktop":
      default:
        return Laptop;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "UPI Pay Trigger":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-100 dark:border-amber-900/30";
      case "WhatsApp Chat":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-100 dark:border-emerald-900/30";
      case "Link Click":
        return "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 border-indigo-100 dark:border-indigo-900/30";
      case "Profile View":
      default:
        return "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-800";
    }
  };

  const summary = data?.summary;
  const filteredLogs = data?.logs || [];

  return (
    <div className="p-8 sm:p-10 space-y-8 w-full animate-fadeIn font-sans">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 block">Total Logs Compiled</span>
            <span className="text-2xl font-black block tracking-tight">
              {loading ? "—" : `${(summary?.totalHits || 0).toLocaleString()} hits`}
            </span>
            <span className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              {summary ? `${summary.totalHitsChange > 0 ? "+" : ""}${summary.totalHitsChange}%` : "—"} Live
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 block">Avg Duration</span>
            <span className="text-2xl font-black block tracking-tight">
              {loading ? "—" : formatDuration(summary?.avgDurationSeconds || 0)}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">Per session estimate</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 block">Average Bounce</span>
            <span className="text-2xl font-black block tracking-tight">
              {loading ? "—" : `${summary?.bounceRate || 0}%`}
            </span>
            <span className="text-[10px] text-emerald-500 font-extrabold">Single-event sessions</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 block">Top Traffic Origin</span>
            <span className="text-2xl font-black block tracking-tight">
              {loading ? "—" : `${summary?.topCountry || "—"} (${summary?.topCountryPercent || 0}%)`}
            </span>
            <span className="text-[10px] text-indigo-500 font-extrabold">Active Region</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>

      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-6 shadow-sm transition-colors duration-300">
        
        <div className="relative flex items-center w-full md:max-w-xs">
          <span className="absolute left-3.5 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-outline-variant/10 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
            placeholder="Search by country, IP or details..."
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
          {["All", "Profile View", "Link Click", "UPI Pay Trigger", "WhatsApp Chat"].map((category) => (
            <button
              key={category}
              onClick={() => setActionFilter(category)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                actionFilter === category
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              {category === "All" ? "Show All" : category}
            </button>
          ))}
        </div>

      </div>

      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-slate-50/50 dark:bg-slate-950/20 text-xs font-black uppercase text-slate-400 tracking-wider">
                <th className="py-4.5 px-6">Country / Origin</th>
                <th className="py-4.5 px-6">Visitor IP</th>
                <th className="py-4.5 px-6">Browser & Device</th>
                <th className="py-4.5 px-6 text-center">Action Category</th>
                <th className="py-4.5 px-6">Event Details</th>
                <th className="py-4.5 px-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5 text-xs font-bold text-slate-700 dark:text-slate-350">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-400 font-bold">
                    Loading traffic logs...
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const DeviceIcon = getDeviceIcon(log.device);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">{log.flag}</span>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100">{log.country}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono text-[11px] text-slate-400">
                        {log.ip}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <DeviceIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>{log.browser} on <span className="capitalize">{log.device}</span></span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-medium text-slate-400 max-w-[200px] truncate">
                        {log.details}
                      </td>

                      <td className="py-4 px-6 text-right text-slate-400 font-medium">
                        {log.timestamp}
                      </td>

                    </tr>
                  );
                })
              )}

              {!loading && filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-slate-400 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-300">
                      <Globe className="w-6 h-6" />
                    </div>
                    <p className="font-extrabold">No traffic logs match filter criteria</p>
                    <p className="text-[10px] text-slate-400/80">Share your public profile to start collecting visitor events.</p>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        <Pagination
          page={currentPage}
          total={totalLogs}
          onPageChange={setCurrentPage}
        />
      </div>

    </div>
  );
}
