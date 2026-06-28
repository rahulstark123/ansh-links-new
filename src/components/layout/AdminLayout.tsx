"use client";

import Link from "next/link";
import { useProfileStore } from "@/store/useProfileStore";
import {
  BarChart3,
  Link2,
  Paintbrush,
  LogOut,
  ArrowLeft,
  Copy,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  ChevronDown,
  User,
  CreditCard,
  Briefcase,
  TrendingUp,
  Sliders,
  Smile,
  Sparkles,
  Layers,
  Settings,
  HelpCircle,
  Shield,
  ArrowUpRight,
  Bookmark,
  Globe,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type PanelType =
  | "dashboard"
  | "traffic"
  | "links"
  | "redirects"
  | "my-cards"
  | "all-cards"
  | "products"
  | "social-profile"
  | "custom-pages"
  | "integrations"
  | "settings-profile"
  | "settings-billing"
  | "settings-security"
  | "canvas-edit";

interface AdminLayoutProps {
  children: React.ReactNode;
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function AdminLayout({
  children,
  activePanel,
  setActivePanel,
  searchQuery,
  setSearchQuery,
}: AdminLayoutProps) {
  const { profile, saveStatus, syncWithCloud, loadFromCloud } = useProfileStore();
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isPrimaryCollapsed, setIsPrimaryCollapsed] = useState(true);

  // Sync profile from Supabase on mount
  useEffect(() => {
    if (profile.username) {
      loadFromCloud(profile.username);
    }
  }, []);

  const getTrialDaysRemaining = () => {
    if (!profile.trialEndsAt) return 0;
    const ends = new Date(profile.trialEndsAt).getTime();
    const now = Date.now();
    const diff = ends - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getTrialDaysRemaining();
  const isTrialActive = profile.subscriptionStatus === "trial" && daysLeft > 0;
  const isUpgraded = profile.subscriptionStatus === "active" || profile.verified;
  
  // Spotlight Command Palette State
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [paletteIndex, setPaletteIndex] = useState(0);
  const paletteInputRef = useRef<HTMLInputElement>(null);

  // Initialize theme mode from document class list
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      html.classList.add("light");
      setIsDarkMode(false);
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${profile.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Derive primary category
  const getPrimaryCategory = (panel: PanelType): "dashboard" | "links" | "cards" | "workspaces" | "settings" => {
    if (panel === "dashboard" || panel === "traffic") return "dashboard";
    if (panel === "links" || panel === "redirects") return "links";
    if (panel === "my-cards" || panel === "all-cards") return "cards";
    if (panel === "products" || panel === "social-profile" || panel === "integrations" || panel === "canvas-edit") return "workspaces";
    return "settings";
  };

  const activeCategory = getPrimaryCategory(activePanel);

  const handleCategoryClick = (category: "dashboard" | "links" | "cards" | "workspaces" | "settings") => {
    if (category === "dashboard") setActivePanel("dashboard");
    else if (category === "links") setActivePanel("links");
    else if (category === "cards") setActivePanel("my-cards");
    else if (category === "workspaces") setActivePanel("products");
    else if (category === "settings") setActivePanel("settings-profile");
  };

  const primaryItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "links", label: "Links Manager", icon: Link2 },
    { id: "cards", label: "Digital Cards", icon: CreditCard },
    { id: "workspaces", label: "Workspaces", icon: Briefcase },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  // Command Palette Items Catalog
  const paletteItems = [
    { id: "p1", label: "Dashboard Analytics Overview", category: "Quick Navigation", action: () => setActivePanel("dashboard"), icon: BarChart3 },
    { id: "p2", label: "Traffic Regional Activity Logs", category: "Quick Navigation", action: () => setActivePanel("traffic"), icon: Layers },
    { id: "p3", label: "My Custom Links Manager", category: "Quick Navigation", action: () => setActivePanel("links"), icon: Link2 },
    { id: "p4", label: "Redirect Rules Configuration", category: "Quick Navigation", action: () => setActivePanel("redirects"), icon: Sliders },
    { id: "p5", label: "My Digital Cards Mockups", category: "Quick Navigation", action: () => setActivePanel("my-cards"), icon: CreditCard },
    { id: "p6", label: "Ready-Made Card Templates", category: "Quick Navigation", action: () => setActivePanel("all-cards"), icon: Sparkles },
    { id: "p7", label: "Digital Products Store Workspace", category: "Quick Navigation", action: () => setActivePanel("products"), icon: Briefcase },
    { id: "p8", label: "Social Profiles Connection Workspace", category: "Quick Navigation", action: () => setActivePanel("social-profile"), icon: Globe },
    { id: "p9", label: "API Integrations Panel", category: "Quick Navigation", action: () => setActivePanel("integrations"), icon: Settings },
    { id: "p10", label: "Configure Profile Identity Info", category: "Quick Navigation", action: () => setActivePanel("settings-profile"), icon: User },
    { id: "p11", label: "Billing & Subscription Tiers", category: "Quick Navigation", action: () => setActivePanel("settings-billing"), icon: CreditCard },
    { id: "p12", label: "Security Credentials Configuration", category: "Quick Navigation", action: () => setActivePanel("settings-security"), icon: Shield },
    { id: "s1", label: "Copy Public Profile Link", category: "Shortcuts & Actions", action: () => handleCopyLink(), icon: Copy },
    { id: "s2", label: "Exit Sanctuary Dashboard", category: "Shortcuts & Actions", action: () => { window.location.href = "/login"; }, icon: LogOut },
  ];

  const filteredPaletteItems = paletteItems.filter((item) =>
    item.label.toLowerCase().includes(paletteQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(paletteQuery.toLowerCase())
  );

  // Global keyboard listener for Ctrl + K command palette
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
        setPaletteQuery("");
        setPaletteIndex(0);
      }
    };
    window.addEventListener("keydown", handleGlobalKeys);
    return () => window.removeEventListener("keydown", handleGlobalKeys);
  }, []);

  // Keyboard navigation inside Command Palette Modal
  useEffect(() => {
    if (!searchModalOpen) return;
    
    // Auto-focus input on mount
    setTimeout(() => paletteInputRef.current?.focus(), 50);

    const handleModalKeys = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setSearchModalOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setPaletteIndex((prev) => (filteredPaletteItems.length > 0 ? (prev + 1) % filteredPaletteItems.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setPaletteIndex((prev) => (filteredPaletteItems.length > 0 ? (prev - 1 + filteredPaletteItems.length) % filteredPaletteItems.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredPaletteItems[paletteIndex];
        if (selected) {
          selected.action();
          setSearchModalOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleModalKeys);
    return () => window.removeEventListener("keydown", handleModalKeys);
  }, [searchModalOpen, filteredPaletteItems, paletteIndex]);

  const renderSecondaryNavigation = () => {
    switch (activeCategory) {
      case "dashboard":
        return (
          <>
            <div className="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Metrics Suite</span>
              <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-400 mt-1">Dashboard</h4>
            </div>
            <div className="p-4 space-y-1.5">
              <button
                onClick={() => setActivePanel("dashboard")}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activePanel === "dashboard"
                    ? "bg-slate-100 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                Analytics Overview
              </button>
              <button
                onClick={() => setActivePanel("traffic")}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activePanel === "traffic"
                    ? "bg-slate-100 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                Traffic Logs
              </button>
            </div>
          </>
        );
      case "links":
        return (
          <>
            <div className="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Channels Setup</span>
              <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-400 mt-1">Links Manager</h4>
            </div>
            <div className="p-4 space-y-1.5">
              <button
                onClick={() => setActivePanel("links")}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activePanel === "links"
                    ? "bg-slate-100 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <Link2 className="w-4 h-4 shrink-0" />
                My Custom Links
              </button>
              <button
                onClick={() => setActivePanel("redirects")}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activePanel === "redirects"
                    ? "bg-slate-100 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <Sliders className="w-4 h-4 shrink-0" />
                Redirect Rules
              </button>
            </div>
          </>
        );
      case "cards":
        return (
          <>
            <div className="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Smart Sheets</span>
              <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-400 mt-1">Digital Cards</h4>
            </div>
            <div className="p-4 space-y-1.5">
              <button
                onClick={() => setActivePanel("my-cards")}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activePanel === "my-cards"
                    ? "bg-slate-100 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                My Cards
              </button>
              <button
                onClick={() => setActivePanel("all-cards")}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activePanel === "all-cards"
                    ? "bg-slate-100 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
                All Cards
              </button>
            </div>
          </>
        );
      case "workspaces":
        return (
          <>
            <div className="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Core Workstation</span>
              <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-400 mt-1">Workspace</h4>
            </div>
            <div className="p-4 space-y-1.5">
              <button
                onClick={() => setActivePanel("products")}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activePanel === "products"
                    ? "bg-slate-100 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <Briefcase className="w-4 h-4 shrink-0" />
                Products Store
              </button>
              <button
                onClick={() => setActivePanel("canvas-edit")}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activePanel === "canvas-edit"
                    ? "bg-slate-100 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <Smile className="w-4 h-4 shrink-0" />
                Hobbies & Bio
              </button>
              <button
                onClick={() => setActivePanel("social-profile")}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activePanel === "social-profile"
                    ? "bg-slate-100 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <Globe className="w-4 h-4 shrink-0" />
                Social Profiles
              </button>
              <button
                onClick={() => setActivePanel("integrations")}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activePanel === "integrations"
                    ? "bg-slate-100 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                Integrations
              </button>
            </div>
          </>
        );
      case "settings":
        return (
          <>
            <div className="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Configure System</span>
              <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-400 mt-1">Settings</h4>
            </div>
            <div className="p-4 space-y-1.5">
              <button
                onClick={() => setActivePanel("settings-profile")}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activePanel === "settings-profile"
                    ? "bg-slate-100 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                Identity Config
              </button>
              <button
                onClick={() => setActivePanel("settings-billing")}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activePanel === "settings-billing"
                    ? "bg-slate-100 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                Billing Options
              </button>
              <button
                onClick={() => setActivePanel("settings-security")}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activePanel === "settings-security"
                    ? "bg-slate-100 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <Shield className="w-4 h-4 shrink-0" />
                Access Security
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
      
      {/* 1. PRIMARY SIDEBAR (COLLAPSABLE & ALIGNED TOP) */}
      <aside className={`hidden md:flex flex-col bg-slate-900 dark:bg-slate-950 text-slate-400 justify-between shrink-0 py-6 border-r border-slate-800/80 relative z-20 shadow-lg transition-all duration-300 ${
        isPrimaryCollapsed ? "w-[76px] items-center" : "w-[240px] px-4"
      }`}>
        
        {/* Brand Header */}
        <div className={`w-full flex items-center gap-3 shrink-0 ${isPrimaryCollapsed ? "justify-center" : "px-3 mb-6"}`}>
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-md cursor-pointer shrink-0 overflow-hidden p-1">
            <img src="/logoAnshapps.png" alt="ANSH Apps" className="w-full h-full object-contain" />
          </div>
          {!isPrimaryCollapsed && (
            <div className="flex flex-col animate-fadeIn min-w-0">
              <span className="text-sm font-black tracking-tight text-white leading-none">
                ANSH <span className="font-light text-slate-400">Links</span>
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 leading-none">
                Sanctuary
              </span>
            </div>
          )}
        </div>

        {/* Primary Navigation Icons starting from top */}
        <div className="flex flex-col gap-3.5 flex-grow w-full pt-8">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleCategoryClick(item.id)}
                className={`w-full py-3.5 rounded-xl flex items-center transition-all cursor-pointer ${
                  isPrimaryCollapsed ? "justify-center" : "px-4 gap-3.5"
                } ${
                  isActive
                    ? "bg-indigo-600 text-white font-extrabold shadow-md scale-[1.02]"
                    : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
                }`}
                title={isPrimaryCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isPrimaryCollapsed && (
                  <span className="text-xs font-black tracking-tight animate-fadeIn">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer actions & Collapse toggle */}
        <div className="flex flex-col gap-4.5 w-full items-center">
          
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className={`w-full py-2.5 rounded-xl hover:bg-white/5 flex items-center text-slate-400 transition-colors cursor-pointer ${
              isPrimaryCollapsed ? "justify-center" : "px-4 gap-3.5"
            }`}
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-500 shrink-0" /> : <Moon className="w-4.5 h-4.5 text-indigo-400 shrink-0" />}
            {!isPrimaryCollapsed && (
              <span className="text-xs font-black tracking-tight animate-fadeIn">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            )}
          </button>

          {/* Primary Sidebar Collapse button */}
          <button
            onClick={() => setIsPrimaryCollapsed(!isPrimaryCollapsed)}
            className={`w-full py-2.5 rounded-xl hover:bg-white/5 flex items-center text-slate-400 transition-colors cursor-pointer ${
              isPrimaryCollapsed ? "justify-center" : "px-4 gap-3.5"
            }`}
            title={isPrimaryCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isPrimaryCollapsed ? <ChevronRight className="w-4.5 h-4.5 shrink-0" /> : <ChevronLeft className="w-4.5 h-4.5 shrink-0" />}
            {!isPrimaryCollapsed && (
              <span className="text-xs font-black tracking-tight animate-fadeIn">Collapse Side</span>
            )}
          </button>
          
          {/* Exit / Sign Out */}
          <Link
            href="/login"
            className={`w-full py-2.5 rounded-xl hover:bg-rose-950/20 flex items-center text-rose-500 transition-all ${
              isPrimaryCollapsed ? "justify-center" : "px-4 gap-3.5"
            }`}
            title="Exit Admin"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {!isPrimaryCollapsed && (
              <span className="text-xs font-black tracking-tight animate-fadeIn">Exit Sanctuary</span>
            )}
          </Link>
        </div>

      </aside>

      {/* 2. SECONDARY CONTEXTUAL SUB-SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[230px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 transition-colors duration-300 relative z-10 shadow-sm">
        {renderSecondaryNavigation()}
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Panel */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between z-30">
          
          <div className="flex items-center gap-8">
            {/* Mobile panel indicator */}
            <div className="flex items-center gap-3 md:hidden">
              <Link
                href="/"
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-850 flex items-center justify-center text-slate-650"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
            
            <h2 className="text-xs font-black capitalize tracking-widest uppercase hidden sm:block text-slate-500 dark:text-slate-400">
              {activePanel === "dashboard" && "Analytics Overview"}
              {activePanel === "traffic" && "Traffic Logs"}
              {activePanel === "links" && "My Links Manager"}
              {activePanel === "redirects" && "Redirect Rules"}
              {activePanel === "my-cards" && "My Digital Cards"}
              {activePanel === "all-cards" && "Ready-Made Templates"}
              {activePanel === "products" && "Product Workspace"}
              {activePanel === "social-profile" && "Social Profiles Workspace"}
              {activePanel === "custom-pages" && "Custom Sub-Pages"}
              {activePanel === "integrations" && "API Connections"}
              {activePanel === "settings-profile" && "Profile Identity Configuration"}
              {activePanel === "settings-billing" && "Billing & Pricing tiers"}
              {activePanel === "settings-security" && "Security credentials"}
            </h2>

            {/* Mock Search trigger opening Command Palette Modal */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="relative flex items-center w-52 sm:w-72 pl-10 pr-16 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-extrabold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350 cursor-pointer shadow-inner text-left transition-colors"
            >
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <span>Search Sanctuary...</span>
              <span className="absolute right-3 text-[9px] font-black text-slate-500 border border-slate-300 dark:border-slate-800 px-1.5 py-0.5 rounded-lg bg-white dark:bg-slate-900 pointer-events-none uppercase tracking-tight shadow-sm">
                Ctrl K
              </span>
            </button>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-5 font-sans">
            {/* Trial & Subscription Status */}
            <div className="hidden sm:flex items-center gap-2">
              {isUpgraded ? (
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200/30 dark:border-indigo-850">
                  Pro Plan Active
                </span>
              ) : isTrialActive ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/30 dark:border-amber-850">
                    Trial: {daysLeft} {daysLeft === 1 ? "day" : "days"} left
                  </span>
                  <button
                    onClick={() => setActivePanel("settings-billing")}
                    className="text-[9px] font-black text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:underline cursor-pointer uppercase"
                  >
                    Upgrade
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-455 border border-rose-200/30 dark:border-rose-850">
                    Trial Expired
                  </span>
                  <button
                    onClick={() => setActivePanel("settings-billing")}
                    className="text-[9px] font-black text-indigo-650 hover:text-indigo-800 dark:text-indigo-400 hover:underline cursor-pointer uppercase"
                  >
                    Upgrade
                  </button>
                </div>
              )}
            </div>

            {/* Cloud Sync Status & Action */}
            <div className="hidden sm:flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                saveStatus === "saving"
                  ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 animate-pulse"
                  : saveStatus === "saved"
                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                  : saveStatus === "error"
                  ? "bg-rose-100 dark:bg-rose-950/40 text-rose-650"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}>
                {saveStatus === "saving" && "Syncing..."}
                {saveStatus === "saved" && "Cloud Synced"}
                {saveStatus === "error" && "Sync Error"}
                {saveStatus === "idle" && "Cloud Connected"}
              </span>
              <button
                onClick={syncWithCloud}
                disabled={saveStatus === "saving"}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/50 hover:bg-indigo-100/80 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 border border-indigo-200/40 dark:border-indigo-850 rounded-xl text-[10px] font-black text-indigo-700 dark:text-indigo-400 transition-colors cursor-pointer disabled:opacity-50"
                title="Sync local modifications to Supabase database"
              >
                <span className={`material-symbols-outlined text-[12px] ${saveStatus === "saving" ? "animate-spin" : ""}`}>
                  sync
                </span>
                Sync Now
              </button>
            </div>
            
            {/* Profile Dropdown Chip */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 pl-3 pr-2.5 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                <div className="w-7.5 h-7.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 shrink-0">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-xs">
                      {profile.name[0]}
                    </div>
                  )}
                </div>
                <span className="text-xs font-black text-slate-700 dark:text-slate-200 hidden lg:block">
                  {profile.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile dropdown submenu card */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 animate-fadeIn">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800/80 mb-3 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-sm">
                          {profile.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-black block truncate text-slate-900 dark:text-slate-100">{profile.name}</span>
                      <span className="text-xs text-slate-500 block truncate">@{profile.username}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Link
                      href={`/${profile.username}`}
                      target="_blank"
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-650 dark:text-slate-300 hover:text-indigo-600"
                    >
                      <User className="w-4.5 h-4.5 text-slate-400" />
                      View Profile Page
                    </Link>
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-650 dark:text-slate-300 hover:text-indigo-600 text-left cursor-pointer"
                    >
                      {copied ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Copy className="w-4.5 h-4.5 text-slate-400" />}
                      {copied ? "Copied to Clipboard" : "Copy Profile Link"}
                    </button>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-1.5" />
                    <Link
                      href="/login"
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-450"
                    >
                      <LogOut className="w-4.5 h-4.5 text-rose-500" />
                      Sign Out
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Mobile Navigation Bar */}
        <nav className="md:hidden flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 justify-around text-center py-3.5 shrink-0 z-15">
          <button
            onClick={() => setActivePanel("dashboard")}
            className={`flex flex-col items-center py-2 px-3 rounded-xl cursor-pointer ${
              activeCategory === "dashboard" ? "text-indigo-650 dark:text-indigo-400 font-extrabold" : "text-slate-500 font-semibold"
            }`}
          >
            <BarChart3 className="w-5.5 h-5.5 mb-1" />
            <span className="text-[10px]">Dashboard</span>
          </button>
          <button
            onClick={() => setActivePanel("links")}
            className={`flex flex-col items-center py-2 px-3 rounded-xl cursor-pointer ${
              activeCategory === "links" ? "text-indigo-650 dark:text-indigo-400 font-extrabold" : "text-slate-500 font-semibold"
            }`}
          >
            <Link2 className="w-5.5 h-5.5 mb-1" />
            <span className="text-[10px]">Links</span>
          </button>
          <button
            onClick={() => setActivePanel("my-cards")}
            className={`flex flex-col items-center py-2 px-3 rounded-xl cursor-pointer ${
              activeCategory === "cards" ? "text-indigo-650 dark:text-indigo-400 font-extrabold" : "text-slate-500 font-semibold"
            }`}
          >
            <CreditCard className="w-5.5 h-5.5 mb-1" />
            <span className="text-[10px]">Cards</span>
          </button>
          <button
            onClick={() => setActivePanel("products")}
            className={`flex flex-col items-center py-2 px-3 rounded-xl cursor-pointer ${
              activeCategory === "workspaces" ? "text-indigo-650 dark:text-indigo-400 font-extrabold" : "text-slate-500 font-semibold"
            }`}
          >
            <Briefcase className="w-5.5 h-5.5 mb-1" />
            <span className="text-[10px]">Workspace</span>
          </button>
        </nav>

        {/* Scrollable Workstation Area */}
        <div className="flex-grow overflow-y-auto min-w-0 bg-slate-100/40 dark:bg-slate-950 transition-colors duration-300">
          {children}
        </div>

      </div>

      {/* Spotlight Cmd+K Command Palette Portal Modal */}
      {searchModalOpen && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-slate-950/70 backdrop-blur-sm p-4 sm:p-20 animate-fadeIn">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-350 dark:border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col mt-10 transition-colors duration-300">
            
            {/* Modal search bar */}
            <div className="relative flex items-center p-4.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
              <Search className="w-5 h-5 text-slate-400 absolute left-6 pointer-events-none" />
              <input
                ref={paletteInputRef}
                type="text"
                value={paletteQuery}
                onChange={(e) => {
                  setPaletteQuery(e.target.value);
                  setPaletteIndex(0);
                }}
                className="w-full pl-10 pr-4 py-2 bg-transparent text-sm font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                placeholder="Type to search navigation pages or actions..."
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="px-2.5 py-1 text-[10px] font-black text-slate-400 border border-slate-300 dark:border-slate-800 rounded bg-white dark:bg-slate-950 shadow-sm"
              >
                ESC
              </button>
            </div>

            {/* List of actions & links */}
            <div className="max-h-[50vh] overflow-y-auto p-3 space-y-3.5">
              
              {/* Categorize & list items */}
              {["Quick Navigation", "Shortcuts & Actions"].map((category) => {
                const categoryItems = filteredPaletteItems.filter((i) => i.category === category);
                if (categoryItems.length === 0) return null;
                return (
                  <div key={category} className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider px-3.5 block mb-1.5">
                      {category}
                    </span>
                    <div className="space-y-0.5">
                      {categoryItems.map((item) => {
                        const globalIndex = filteredPaletteItems.findIndex((x) => x.id === item.id);
                        const isFocused = globalIndex === paletteIndex;
                        const ItemIcon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onMouseEnter={() => setPaletteIndex(globalIndex)}
                            onClick={() => {
                              item.action();
                              setSearchModalOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-extrabold text-left transition-all cursor-pointer ${
                              isFocused
                                ? "bg-indigo-600 text-white shadow-md scale-[1.01]"
                                : "text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <ItemIcon className={`w-4.5 h-4.5 ${isFocused ? "text-white" : "text-slate-400"}`} />
                              <span>{item.label}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {isFocused && (
                                <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${isFocused ? "bg-indigo-700 text-indigo-100" : "bg-slate-100 text-slate-500"}`}>
                                  Execute
                                </span>
                              )}
                              <ArrowUpRight className={`w-3.5 h-3.5 ${isFocused ? "text-white" : "text-slate-300"}`} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredPaletteItems.length === 0 && (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-850 flex items-center justify-center mx-auto text-slate-300">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="font-extrabold text-xs text-slate-700 dark:text-slate-300">No results found for "{paletteQuery}"</p>
                  <p className="text-[10px] text-slate-400">Double check spelling or try simple words like "traffic" or "card".</p>
                </div>
              )}

            </div>

            {/* Footer hints */}
            <div className="h-10 flex items-center justify-between px-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 font-bold">
              <div className="flex items-center gap-4">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
              </div>
              <span>Sanctuary Spotlight</span>
            </div>

          </div>

        </div>,
        document.body
      )}

    </div>
  );
}
