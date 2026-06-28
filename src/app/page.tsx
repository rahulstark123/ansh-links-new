"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
    iconColor: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description: "WhatsApp chats and UPI payments — triggered directly from your profile.",
    color: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    span: "col-span-1",
  },
  {
    icon: ShieldCheck,
    title: "Verified Network",
    description: "Trust badges that signal authenticity across the ANSH ecosystem.",
    color: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    span: "col-span-1",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    description: "Track page views, link clicks, and audience engagement in real time.",
    color: "from-sky-500/10 to-blue-500/10",
    iconColor: "text-sky-600 dark:text-sky-400",
    iconBg: "bg-sky-50 dark:bg-sky-950/40",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: CreditCard,
    title: "Digital Business Cards",
    description: "Double-sided, theme-rich cards with QR codes — share your identity in one tap.",
    color: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-50 dark:bg-violet-950/40",
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
    badgeClass: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400",
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

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-20 overflow-hidden">
        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-mesh pointer-events-none" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold mb-8 shadow-sm"
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
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    beautifully
                  </span>{" "}
                  curated
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mb-10 leading-relaxed"
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
                    className="group px-8 py-4 rounded-2xl font-bold text-white primary-gradient shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/ansh"
                    className="px-8 py-4 rounded-2xl font-bold bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Globe className="w-4 h-4 text-indigo-500" />
                    Live Demo
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-center gap-6 mt-10"
                >
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-[10px] font-black"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5 mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Loved by 10,000+ creators</p>
                  </div>
                </motion.div>
              </div>

              {/* Phone Mockup */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative flex justify-center lg:justify-end"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-full blur-3xl scale-75 pointer-events-none" />
                <div className="relative w-[280px] sm:w-[300px]">
                  <div className="bg-slate-950 rounded-[2.5rem] p-3 shadow-2xl shadow-indigo-500/20 border border-slate-800">
                    <div className="bg-slate-900 rounded-[2rem] overflow-hidden">
                      <div className="flex justify-between items-center px-6 pt-4 pb-2">
                        <span className="text-[10px] text-slate-500 font-medium">9:41</span>
                        <div className="w-20 h-5 bg-slate-800 rounded-full" />
                        <div className="flex gap-1">
                          <div className="w-3 h-3 bg-slate-700 rounded-sm" />
                          <div className="w-3 h-3 bg-slate-700 rounded-sm" />
                        </div>
                      </div>

                      <div className="px-5 pb-6 pt-2">
                        <div className="flex flex-col items-center text-center mb-5">
                          <div className="w-16 h-16 rounded-2xl primary-gradient mb-3 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white text-xl font-black">
                            A
                          </div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-white font-black text-sm">Ansh Kumar</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                          </div>
                          <p className="text-[10px] text-slate-500 mb-2">@ansh · Creator & Designer</p>
                          <p className="text-[10px] text-slate-400 leading-relaxed px-2">
                            Building beautiful digital experiences ✨
                          </p>
                        </div>

                        <div className="space-y-2">
                          {[
                            { label: "Portfolio", color: "bg-indigo-500/20 text-indigo-300" },
                            { label: "YouTube Channel", color: "bg-red-500/20 text-red-300" },
                            { label: "WhatsApp Me", color: "bg-emerald-500/20 text-emerald-300" },
                            { label: "Mobile / Call", color: "bg-sky-500/20 text-sky-300" },
                          ].map((link) => (
                            <div
                              key={link.label}
                              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl ${link.color} border border-white/5`}
                            >
                              <span className="text-[11px] font-bold">{link.label}</span>
                              <ArrowRight className="w-3 h-3 opacity-50" />
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-center gap-3 mt-4">
                          {["IG", "GH", "TW"].map((s) => (
                            <div
                              key={s}
                              className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-[9px] font-black text-slate-400"
                            >
                              {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -right-4 bg-white dark:bg-slate-900 rounded-2xl px-3 py-2 shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-800 dark:text-slate-200">+847 clicks</p>
                      <p className="text-[9px] text-slate-400">This week</p>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-3 -left-6 bg-white dark:bg-slate-900 rounded-2xl px-3 py-2 shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
                      <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <p className="text-[10px] font-black text-slate-800 dark:text-slate-200">Profile shared!</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-outline-variant/10 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl md:text-4xl font-black text-indigo-600 dark:text-indigo-400">
                      {stat.value}
                    </span>
                    {stat.icon && <stat.icon className="w-5 h-5 fill-amber-400 text-amber-400" />}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <span className="inline-block text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">
                Features
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Everything you need, nothing you don&apos;t
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Designed under the Organic Minimalist philosophy — every detail is engineered to breathe.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`group relative overflow-hidden bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 ${feature.span}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-5`}>
                      <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-extrabold mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Themes Section */}
        <section id="themes" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/40">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-bold mb-4 uppercase tracking-wider">
                  <Palette className="w-3 h-3" />
                  Aesthetic Presets
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                  Five gorgeous themes, zero design skills needed
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                  Switch between curated editorial styles in one click. Each theme is carefully crafted to represent organic professionalism.
                </p>

                <div className="space-y-3">
                  {themes.map((theme) => (
                    <div
                      key={theme.name}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-900 transition-colors group cursor-default"
                    >
                      <div className={`w-8 h-8 rounded-full border-2 ${theme.color} shrink-0 group-hover:scale-110 transition-transform`} />
                      <div>
                        <h4 className="font-extrabold text-sm">{theme.name}</h4>
                        <p className="text-xs text-slate-500">{theme.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-3 gap-3"
              >
                {themes.map((theme, i) => (
                  <motion.div
                    key={theme.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`aspect-[3/4] rounded-2xl border-2 ${theme.color} p-4 flex flex-col justify-between shadow-sm hover:scale-105 transition-transform cursor-default`}
                  >
                    <div className="space-y-2">
                      <div className={`w-8 h-8 rounded-full ${i === 3 ? "bg-slate-700" : "bg-white/60"} opacity-60`} />
                      <div className={`h-2 rounded-full ${i === 3 ? "bg-slate-700" : "bg-white/60"} w-3/4 opacity-40`} />
                      <div className={`h-1.5 rounded-full ${i === 3 ? "bg-slate-700" : "bg-white/60"} w-1/2 opacity-30`} />
                    </div>
                    <div className="space-y-1.5">
                      <div className={`h-6 rounded-lg ${i === 3 ? "bg-slate-700/60" : "bg-white/40"}`} />
                      <div className={`h-6 rounded-lg ${i === 3 ? "bg-slate-700/40" : "bg-white/30"}`} />
                    </div>
                    <p className={`text-[10px] font-black ${i === 3 ? "text-slate-400" : "text-slate-600/70"}`}>
                      {theme.name}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Digital Cards Section */}
        <section id="cards" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/40">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 rounded-full text-[10px] font-bold mb-4 uppercase tracking-wider">
                  <CreditCard className="w-3 h-3" />
                  Digital Cards
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                  Business cards, reimagined for the web
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                  Create stunning double-sided digital business cards with 11+ curated themes. Flip to reveal contact details, QR codes, and social links — share instantly from your profile.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: RotateCcw, label: "Double-sided flip", desc: "Front & back design" },
                    { icon: QrCode, label: "QR code built-in", desc: "Scan to connect" },
                    { icon: Palette, label: "11+ card themes", desc: "Noir, Gold, Neon & more" },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col gap-2 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-outline-variant/10">
                      <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      <p className="text-xs font-black">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white primary-gradient shadow-lg shadow-indigo-600/20 hover:scale-[0.98] transition-all"
                >
                  Create Your Card
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Featured card preview — stacked */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative flex justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-full blur-3xl scale-75 pointer-events-none" />

                {/* Back card (offset) */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[85%] max-w-sm aspect-[1.65/1] rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-slate-800 shadow-xl rotate-[-6deg] opacity-60 scale-95" />

                {/* Front card */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-full max-w-sm aspect-[1.65/1] rounded-2xl bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 border border-amber-300/40 shadow-2xl shadow-amber-500/10 p-6 flex flex-col justify-between rotate-[3deg]"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-amber-800/70 block">ANSH Apps Suite</span>
                      <span className="text-[7px] font-bold text-amber-700/50 uppercase tracking-wider">Digital Identity</span>
                    </div>
                    <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900">gold Card</span>
                  </div>
                  <div>
                    <p className="text-lg font-black text-amber-950 leading-tight">Ansh Kumar</p>
                    <p className="text-[10px] font-bold text-amber-800/70 mt-0.5">Product Architect</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                      <p className="text-[8px] text-amber-700/60 font-bold">+91 98765 43210</p>
                      <p className="text-[8px] text-amber-700/60 font-bold">ansh@anshapps.com</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-amber-900/10 flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-amber-800/50" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-4 -right-2 bg-white dark:bg-slate-900 rounded-2xl px-3 py-2 shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-violet-500" />
                  <p className="text-[10px] font-black text-slate-800 dark:text-slate-200">Tap to flip</p>
                </motion.div>
              </motion.div>
            </div>

            {/* Card Template Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-center text-xs font-black text-slate-400 uppercase tracking-widest mb-8">
                Choose from 11+ card templates
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cardTemplates.map((card, i) => (
                  <motion.div
                    key={card.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="group cursor-default"
                  >
                    <div
                      className={`aspect-[1.65/1] rounded-2xl p-5 flex flex-col justify-between shadow-lg group-hover:scale-[1.02] group-hover:-translate-y-1 transition-all duration-300 ${card.themeClass}`}
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
                    <p className="text-xs font-black text-center mt-3 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {card.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <span className="inline-block text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">
                Pricing
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Simple, honest pricing
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Start free, upgrade when you&apos;re ready. No hidden fees, no surprises.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-outline-variant/10 shadow-sm flex flex-col"
              >
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Starter</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black">$0</span>
                  <span className="text-slate-400 text-sm">/ forever</span>
                </div>
                <p className="text-sm text-slate-500 mb-6">Everything you need to get started.</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {["Unlimited custom links", "Live device preview", "5 theme presets", "Digital business cards", "Basic analytics"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="w-full text-center py-3.5 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors"
                >
                  Get Started Free
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-indigo-500/30 shadow-xl shadow-indigo-500/10 flex flex-col overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black tracking-wider uppercase px-4 py-1.5 rounded-bl-2xl">
                  Most Popular
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 pointer-events-none" />
                <div className="relative">
                  <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Pro</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-black">$9</span>
                    <span className="text-slate-400 text-sm">/ one-time</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-6">Unlock the full ANSH experience.</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {[
                      "Everything in Starter",
                      "UPI Payment Actions",
                      "WhatsApp Chat Triggers",
                      "Verified Trust Badge",
                      "Priority support",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm">
                        <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-indigo-500" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/dashboard"
                    className="w-full text-center py-3.5 rounded-2xl font-bold text-white primary-gradient shadow-lg shadow-indigo-600/20 hover:scale-[0.98] transition-transform block"
                  >
                    Upgrade to Pro
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-6">
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
              <p className="text-indigo-100 max-w-lg mx-auto mb-8 text-lg">
                Join thousands of creators who&apos;ve made ANSH Links their digital home.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-white text-indigo-700 hover:bg-indigo-50 shadow-xl hover:scale-[0.98] transition-all"
              >
                Create Your Profile
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
