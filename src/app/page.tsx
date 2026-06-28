"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PreviewDevice from "@/components/dashboard/PreviewDevice";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Palette,
  Share2,
  Star,
  Users,
  Globe,
  Smartphone,
  BarChart3,
  Check,
  CreditCard,
  QrCode,
  RotateCcw,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Palette,
    title: "Editorial Themes",
    description: "Five curated aesthetic presets — from organic minimalism to midnight noir.",
    color: "from-indigo-500/10 to-violet-500/10",
    iconColor: "text-indigo-650 dark:text-indigo-400",
    iconBg: "bg-indigo-950/40",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description: "WhatsApp chats and UPI payments — triggered directly from your profile.",
    color: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-950/40",
    span: "col-span-1",
  },
  {
    icon: ShieldCheck,
    title: "Verified Network",
    description: "Trust badges that signal authenticity across the ANSH ecosystem.",
    color: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-950/40",
    span: "col-span-1",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    description: "Track page views, link clicks, and audience engagement in real time.",
    color: "from-sky-500/10 to-blue-500/10",
    iconColor: "text-sky-650 dark:text-sky-400",
    iconBg: "bg-sky-950/40",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: CreditCard,
    title: "Digital Business Cards",
    description: "Double-sided, theme-rich cards with QR codes — share your identity in one tap.",
    color: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-650 dark:text-violet-400",
    iconBg: "bg-violet-950/40",
    span: "col-span-1 md:col-span-3",
  },
];

const themes = [
  { name: "Organic", color: "bg-slate-100 border-slate-300", desc: "Clean & minimal" },
  { name: "Saffron", color: "bg-amber-400 border-amber-500", desc: "Warm Indian tones" },
  { name: "Emerald", color: "bg-emerald-500 border-emerald-600", desc: "Forest vibes" },
  { name: "Noir", color: "bg-slate-950 border-slate-700", desc: "Ultra-sleek dark" },
  { name: "Silk", color: "bg-rose-200 border-rose-300", desc: "Soft & elegant" },
];

const stats = [
  { value: "10K+", label: "Profiles Created" },
  { value: "50M+", label: "Link Clicks" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9", label: "User Rating", icon: Star },
];

const cardTemplates = [
  {
    name: "Midnight Executive",
    badge: "Professional",
    themeClass: "bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100 border border-slate-800",
    accent: "text-slate-400",
    badgeClass: "bg-slate-800 text-slate-300",
  },
  {
    name: "Golden Champagne",
    badge: "Luxury",
    themeClass: "bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 text-amber-950 border border-amber-300/40",
    accent: "text-amber-700/70",
    badgeClass: "bg-amber-200/60 text-amber-900",
  },
  {
    name: "Cyber Neon",
    badge: "Creative",
    themeClass: "bg-slate-950 border-2 border-emerald-500/80 text-emerald-400",
    accent: "text-emerald-500/70",
    badgeClass: "bg-emerald-500/20 text-emerald-400",
  },
  {
    name: "Glassmorphic",
    badge: "Modern",
    themeClass: "bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/40 text-slate-800 dark:text-slate-200",
    accent: "text-slate-500",
    badgeClass: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400",
  },
  {
    name: "Neo Brutalist",
    badge: "Authentic",
    themeClass: "bg-white border-4 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    accent: "text-black/60",
    badgeClass: "bg-black text-white",
  },
  {
    name: "Warm Terracotta",
    badge: "Rustic",
    themeClass: "bg-gradient-to-br from-[#C96F53] to-[#B05B41] text-[#FCF8F5] border border-[#D58C75]/40",
    accent: "text-[#FCF8F5]/70",
    badgeClass: "bg-white/20 text-[#FCF8F5]",
  },
];

const marqueeApps = [
  {
    name: "ANSH Booking",
    desc: "Meeting room & resource booking",
    status: "BUILDING",
    badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/30",
    statusColor: "text-pink-500",
    image: null,
    link: "#",
  },
  {
    name: "ANSH Visitor",
    desc: "Smart lobby & guest management",
    status: "LIVE",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    statusColor: "text-emerald-500",
    image: "/ANSH Visitor.jpg",
    link: "https://visitor.anshapps.com",
  },
  {
    name: "ANSH Tasks",
    desc: "Team task & project tracker",
    status: "LIVE",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    statusColor: "text-sky-500",
    image: "/Ansh Task.jpg",
    link: "https://tasks.anshapps.com",
  },
  {
    name: "ANSH HR",
    desc: "Human resource management",
    status: "LIVE",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    statusColor: "text-indigo-550",
    image: "/ANSH HR.jpg",
    link: "https://hr.anshapps.com",
  },
  {
    name: "ANSH Expense",
    desc: "Expense & reimbursement tracking",
    status: "LIVE",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    statusColor: "text-amber-500",
    image: "/ANSH Expense.jpg",
    link: "https://expense.anshapps.com",
  },
  {
    name: "ANSH Forms",
    desc: "Modern digital surveys & forms",
    status: "LIVE",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    statusColor: "text-teal-500",
    image: "/Ansh Forms New.jpg",
    link: "https://forms.anshapps.com",
  },
];

const duplicatedApps = [...marqueeApps, ...marqueeApps, ...marqueeApps];

export default function Home() {
  const [isIndia, setIsIndia] = useState(false);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.country_code === "IN" || data.country === "India") {
          setIsIndia(true);
        } else {
          setIsIndia(false);
        }
      })
      .catch(() => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz.toLowerCase().includes("kolkata") || tz.toLowerCase().includes("calcutta")) {
          setIsIndia(true);
        }
      });
  }, []);

  return (
    <div className="dark bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans transition-colors duration-300">
      <Header />
      <main className="flex-grow pt-20 overflow-hidden">
        
        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-mesh pointer-events-none opacity-40" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-sm border border-indigo-800/40 text-indigo-400 rounded-full text-xs font-bold mb-8 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  The future of link-in-bio
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6"
                >
                  Your identity,{" "}
                  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                    beautifully
                  </span>{" "}
                  curated
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg text-slate-400 max-w-lg mb-10 leading-relaxed font-medium"
                >
                  Build a stunning organic-minimalist profile with smooth gradients, verification badges, WhatsApp actions, and seamless UPI payments — all in minutes.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link
                    href="/signup"
                    className="group px-8 py-4 rounded-2xl font-bold text-white primary-gradient shadow-xl shadow-indigo-600/20 hover:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="https://anshapps.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-2xl font-bold bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer text-slate-300 hover:text-white"
                  >
                    <Globe className="w-4 h-4 text-indigo-400" />
                    Visit ANSH
                  </a>
                </motion.div>
              </div>

              {/* Visual preview */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent blur-2xl rounded-full" />
                <PreviewDevice />
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Marquee Section (Below Section 1) */}
        <section className="py-20 bg-slate-950/80 border-y border-slate-900/80 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-3">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.25em] block">
                Ecosystem
              </span>
              <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-white">
                The full Ansh Apps suite
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md font-medium leading-relaxed">
              One ecosystem, every business operation — manage tasks, HR, expenses, bookings and visitors from connected apps.
            </p>
          </div>

          {/* Marquee Track */}
          <div className="relative w-full overflow-hidden flex py-4">
            <div className="flex gap-6 animate-marquee whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer">
              {duplicatedApps.map((app, index) => (
                <a
                  key={`${app.name}-${index}`}
                  href={app.link}
                  target={app.link !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="w-[310px] shrink-0 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-850 hover:border-indigo-500/40 rounded-[2rem] p-5 transition-all duration-300 shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 block group"
                >
                  {/* Screenshot Container */}
                  <div className="h-[155px] rounded-[1.5rem] overflow-hidden bg-slate-905 border border-slate-800/60 relative mb-4 flex items-center justify-center">
                    {app.image ? (
                      <img
                        src={app.image}
                        alt={app.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-dashed border-pink-500/40 flex items-center justify-center animate-spin-slow">
                          <div className="w-2 h-2 rounded-full bg-pink-500/30" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-pink-400/80">
                          In Development
                        </span>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <span className={`absolute top-3 right-3 text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${app.badgeColor}`}>
                      {app.status}
                    </span>
                  </div>

                  {/* Info details */}
                  <div className="space-y-1.5 whitespace-normal">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${app.status === "LIVE" ? "bg-emerald-500 animate-pulse" : "bg-pink-500 animate-pulse"}`} />
                      <h4 className="font-black text-sm text-white group-hover:text-indigo-400 transition-colors">
                        {app.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                      {app.desc}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
            .animate-marquee {
              display: flex;
              width: max-content;
              animation: marquee 35s linear infinite;
            }
            .animate-spin-slow {
              animation: spin 8s linear infinite;
            }
          `}} />
        </section>

        {/* Stats */}
        <section className="py-16 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center space-y-1">
                  <p className="text-4xl font-black tracking-tight text-white flex items-center justify-center gap-1">
                    {stat.icon && <stat.icon className="w-5 h-5 text-amber-500" />}
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="inline-block text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">
                Features
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                Everything you need in one link
              </h2>
              <p className="text-slate-400 font-medium">
                Ditch the boring Linktree. Custom themes, double-sided business cards, digital products, and WhatsApp actions built right in.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className={`bg-slate-900/60 p-8 border border-slate-800 rounded-3xl relative overflow-hidden group hover:border-slate-700/80 transition-colors ${feat.span}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-2xl ${feat.iconBg} ${feat.iconColor} flex items-center justify-center mb-6`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black text-white mb-2">{feat.title}</h3>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed">{feat.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Theme presets Showcase */}
        <section className="py-24 px-6 bg-slate-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4 block">
                  Customization
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
                  Match your brand tone perfectly
                </h2>
                <p className="text-slate-400 font-medium leading-relaxed mb-10">
                  Select from five editor themes crafted by professional designers. Express your character through elegant minimalist interfaces.
                </p>

                <div className="space-y-4">
                  {themes.map((t) => (
                    <div
                      key={t.name}
                      className="flex items-center justify-between p-4.5 bg-slate-900/60 border border-slate-800 rounded-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border ${t.color}`} />
                        <span className="text-sm font-black text-white">{t.name} Preset</span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{t.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-full max-w-sm rounded-[2.5rem] bg-slate-900 border border-slate-800 p-4 shadow-2xl relative">
                  <div className="aspect-[9/19] rounded-[2rem] overflow-hidden bg-slate-950 relative flex flex-col justify-between p-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        ansh.links/ansh
                      </span>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>

                    <div className="flex flex-col items-center text-center my-8">
                      <div className="w-20 h-20 rounded-full bg-indigo-650 flex items-center justify-center text-2xl font-black text-white shadow-xl mb-4 border-2 border-white/10">
                        AK
                      </div>
                      <h4 className="text-lg font-black text-white">Ansh Kumar</h4>
                      <p className="text-xs text-slate-400 max-w-xs mt-1">Founder @ ANSH TREE. Building modern ecosystems.</p>
                    </div>

                    <div className="space-y-3">
                      {["My Portfolio", "WhatsApp Quick Trigger", "Pay via UPI"].map((label, idx) => (
                        <div
                          key={label}
                          className={`w-full py-3.5 rounded-xl text-center text-xs font-black border transition-all ${
                            idx === 0
                              ? "bg-white text-black border-white"
                              : "bg-slate-900 text-slate-300 border-slate-800"
                          }`}
                        >
                          {label}
                        </div>
                      ))}
                    </div>

                    <div className="text-center text-[9px] text-slate-500 mt-6 uppercase tracking-wider">
                      © ANSH Links
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Digital Business Cards */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
              <div>
                <span className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4 block">
                  Digital Cards
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
                  Interactive Double-Sided Cards
                </h2>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Every account comes with customizable double-sided identity cards. Tap to flip, download your custom QR code, or share contact files seamlessly.
                </p>
              </div>

              <div className="flex justify-center relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="w-full max-w-sm aspect-[1.65/1] rounded-3xl p-6 bg-gradient-to-br from-indigo-650 via-indigo-700 to-violet-850 text-white flex flex-col justify-between shadow-2xl relative cursor-pointer border border-indigo-500/20"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase tracking-wider text-indigo-200">
                      ANSH Ecosystem
                    </span>
                    <span className="text-[8px] font-black bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      Interactive
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight">Ansh Kumar</h3>
                    <p className="text-xs text-indigo-200 mt-0.5 font-bold">Product Architect</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-[10px] text-indigo-200 font-semibold space-y-0.5">
                      <p>ansh@anshapps.com</p>
                      <p>+91 98765 43210</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <QrCode className="w-5 h-5" />
                    </div>
                  </div>

                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -bottom-4 -right-2 bg-slate-900 rounded-2xl px-3 py-2 shadow-xl border border-slate-800 flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-violet-400 animate-spin-slow" />
                    <p className="text-[10px] font-black text-slate-200">Tap to flip</p>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Card Template Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-center text-xs font-black text-slate-500 uppercase tracking-widest mb-8">
                Choose from 6+ premium card templates
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cardTemplates.map((card, i) => (
                  <motion.div
                    key={card.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="group cursor-default animate-fadeIn"
                  >
                    <div
                      className={`aspect-[1.65/1] rounded-2xl p-5 flex flex-col justify-between shadow-lg group-hover:scale-[1.02] group-hover:-translate-y-1 transition-all duration-350 ${card.themeClass}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-[8px] font-black uppercase tracking-widest ${card.accent}`}>
                          ANSH Ecosystem
                        </span>
                        <span className={`text-[7px] font-black px-2 py-0.5 rounded-full ${card.badgeClass}`}>
                          {card.badge}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-black leading-tight">Ansh Kumar</p>
                        <p className={`text-[9px] font-bold mt-0.5 ${card.accent}`}>Product Architect</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className={`text-[8px] font-bold ${card.accent}`}>ansh@anshapps.com</p>
                        <div className={`w-7 h-7 rounded-md opacity-30 ${card.badgeClass}`} />
                      </div>
                    </div>
                    <p className="text-xs font-black text-center mt-3 text-slate-400 group-hover:text-indigo-400 transition-colors">
                      {card.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-6 bg-slate-900/10 border-t border-slate-900/60">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <span className="inline-block text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">
                Pricing Plans
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                Simple, honest pricing
              </h2>
              <p className="text-slate-450 font-medium">
                Start free, upgrade when you&apos;re ready. Get 14 days free trial of all premium features!
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              
              {/* Free Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 shadow-sm flex flex-col hover:border-slate-700/80 transition-all duration-300"
              >
                <p className="text-xs font-black text-slate-450 uppercase tracking-widest mb-2 font-sans">Free Plan</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white">{isIndia ? "₹0" : "$0"}</span>
                  <span className="text-slate-400 text-xs font-medium">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 font-medium mt-1">Perfect for simple bio link redirects.</p>
                <ul className="space-y-3.5 mb-8 flex-1">
                  {["Up to 5 Redirect path links", "Organic Minimal theme skin", "Basic traffic visitor summary"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold leading-relaxed">
                      <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-450" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Pro Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
                className="relative bg-slate-900/80 p-8 rounded-3xl border-2 border-indigo-500/30 shadow-xl shadow-indigo-500/5 flex flex-col overflow-hidden hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 bg-indigo-650 text-white text-[9px] font-black tracking-wider uppercase px-4.5 py-1.5 rounded-bl-2xl shadow-md">
                  Most Popular
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 pointer-events-none" />
                <div className="relative flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 font-sans">Pro Plan</p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-black text-white">{isIndia ? "₹199" : "$5"}</span>
                      <span className="text-slate-400 text-xs font-medium">/ month</span>
                    </div>
                    <p className="text-xs text-slate-450 mb-6 font-medium mt-1">Ideal for creators demanding custom style.</p>
                    <ul className="space-y-3.5 mb-8">
                      {[
                        "Unlimited Bio Redirect links",
                        "All 5 Premium editor themes",
                        "Verified Profile Badges",
                        "Advanced analytics reporting",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-xs text-slate-200 font-semibold leading-relaxed">
                          <div className="w-4.5 h-4.5 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-indigo-400" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Pro Plus Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.16 }}
                className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 shadow-sm flex flex-col hover:border-slate-700/80 transition-all duration-300"
              >
                <p className="text-xs font-black text-slate-450 uppercase tracking-widest mb-2 font-sans">Pro Plus</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white">{isIndia ? "₹399" : "$7"}</span>
                  <span className="text-slate-400 text-xs font-medium">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 font-medium mt-1">For power teams & storefront digital products.</p>
                <ul className="space-y-3.5 mb-8 flex-1">
                  {[
                    "Everything in Pro Plan tier",
                    "Unlimited Double-Sided Cards",
                    "Featured storefront (0% fee)",
                    "Premium priority support",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-xs text-slate-350 font-semibold leading-relaxed">
                      <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-450" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-6 bg-slate-950">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto relative overflow-hidden rounded-[2.5rem] primary-gradient p-12 md:p-16 text-center text-white"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 pointer-events-none" />
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="flex -space-x-2">
                  {[Users, Smartphone, Globe].map((Icon, i) => (
                    <div key={i} className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <Icon className="w-5 h-5" />
                    </div>
                  ))}
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                Ready to claim your link?
              </h2>
              <p className="text-indigo-150 max-w-lg mx-auto mb-8 text-lg font-medium">
                Join thousands of creators who&apos;ve made ANSH Links their digital home.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-white text-indigo-700 hover:bg-indigo-50 shadow-xl hover:scale-[0.98] transition-all cursor-pointer"
              >
                Create Your Profile
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
