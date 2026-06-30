export interface CardThemeConfig {
  container: string;
  name: string;
  sub: string;
  company: string;
  tagline: string;
  contactIcon: string;
  contactText: string;
  contactRow: string;
  qrBg: string;
  badge: string;
  divider: string;
  emblemColor: string;
  shine: string;
}

export function getCardThemeConfig(theme: string): CardThemeConfig {
  const base = {
    name: "card-type-name",
    sub: "card-type-sub",
    company: "card-type-company",
    tagline: "card-type-tagline",
    contactText: "card-type-contact",
    badge: "card-type-badge px-2.5 py-1 rounded-full",
    contactRow: "rounded-full p-2 bg-black/[0.04] border border-black/[0.06]",
    divider: "h-px w-full opacity-25",
    shine: "card-premium-shine",
  };

  switch (theme) {
    case "brutalist":
      return {
        container:
          "bg-white border-[3px] border-black text-black font-mono card-premium-frame relative overflow-hidden",
        name: `${base.name} text-black uppercase font-mono`,
        sub: `${base.sub} text-black/75 font-mono`,
        company: `${base.company} text-black/65`,
        tagline: `${base.tagline} uppercase text-black/45`,
        contactIcon: "text-black",
        contactText: `${base.contactText} font-mono`,
        contactRow: "rounded-none p-2 bg-black/5 border-2 border-black",
        qrBg: "bg-white border-2 border-black card-qr-frame",
        badge: `${base.badge} text-white bg-black rounded-none`,
        divider: `${base.divider} bg-black`,
        emblemColor: "stroke-black fill-black/10",
        shine: "opacity-0",
      };
    case "solarized":
      return {
        container:
          "bg-[#FDF6E3] border border-[#C9B88A] text-[#073642] card-premium-frame relative overflow-hidden",
        name: `${base.name} text-[#002B36]`,
        sub: `${base.sub} text-[#2AA198]`,
        company: `${base.company} text-[#586E75]`,
        tagline: `${base.tagline} text-[#93A1A1]`,
        contactIcon: "text-[#268BD2]",
        contactText: base.contactText,
        contactRow: "rounded-full p-2 bg-[#002B36]/[0.05] border border-[#D3C6A2]/60",
        qrBg: "bg-white border border-[#D3C6A2] card-qr-frame",
        badge: `${base.badge} text-[#2AA198] border border-[#2AA198]/35 bg-white/50`,
        divider: `${base.divider} bg-[#2AA198]`,
        emblemColor: "stroke-[#268BD2] fill-[#2AA198]/10",
        shine: base.shine,
      };
    case "parchment":
      return {
        container:
          "bg-[#FAF4E8] border border-[#D4BC9A] text-[#2B231D] font-serif card-premium-frame relative overflow-hidden",
        name: `${base.name} text-[#1F1712] font-serif`,
        sub: `${base.sub} text-[#8B6E5A] italic font-serif`,
        company: `${base.company} text-[#8B6E5A] font-serif`,
        tagline: `${base.tagline} italic text-[#8B6E5A]/75 font-serif`,
        contactIcon: "text-[#8B6E5A]",
        contactText: `${base.contactText} font-serif`,
        contactRow: "rounded-full p-2 bg-[#8B6E5A]/[0.07] border border-[#E4D1B9]",
        qrBg: "bg-[#FFFCF7] border border-[#E4D1B9] card-qr-frame",
        badge: `${base.badge} text-[#8B6E5A] border border-[#E4D1B9] bg-[#FAF4E8]`,
        divider: `${base.divider} bg-[#8B6E5A]/40`,
        emblemColor: "stroke-[#8B6E5A] fill-transparent",
        shine: base.shine,
      };
    case "terracotta":
      return {
        container:
          "bg-gradient-to-br from-[#D4785C] to-[#B85A3F] border border-[#E8A090]/40 text-[#FCF8F5] card-premium-frame relative overflow-hidden",
        name: `${base.name} text-[#FFFCFA]`,
        sub: `${base.sub} text-[#F3D5C8]`,
        company: `${base.company} text-[#FCF8F5]/90`,
        tagline: `${base.tagline} text-[#F3D5C8]/85`,
        contactIcon: "text-[#FFEDE6]",
        contactText: base.contactText,
        contactRow: "rounded-full p-2 bg-black/10 border border-white/15",
        qrBg: "bg-white border border-white/25 card-qr-frame",
        badge: `${base.badge} text-[#FCF8F5] bg-black/15 border border-white/20`,
        divider: `${base.divider} bg-white/35`,
        emblemColor: "stroke-[#FFEDE6] fill-transparent",
        shine: base.shine,
      };
    case "retro":
      return {
        container:
          "bg-[#0A0E17] border border-emerald-500/50 text-emerald-400 font-mono card-premium-frame relative overflow-hidden",
        name: `${base.name} text-emerald-200 font-mono uppercase tracking-wide`,
        sub: `${base.sub} text-emerald-400/95 font-mono`,
        company: `${base.company} text-emerald-500/85`,
        tagline: `${base.tagline} text-emerald-600/75`,
        contactIcon: "text-emerald-400",
        contactText: `${base.contactText} font-mono`,
        contactRow: "rounded-lg p-2 bg-emerald-500/10 border border-emerald-500/25",
        qrBg: "bg-emerald-50 border border-emerald-500/35 card-qr-frame",
        badge: `${base.badge} text-emerald-300 border border-emerald-500/35 bg-emerald-950/40`,
        divider: `${base.divider} bg-emerald-500/50`,
        emblemColor: "stroke-emerald-400 fill-emerald-950/25",
        shine: "opacity-0",
      };
    case "aurora":
      return {
        container:
          "bg-gradient-to-br from-indigo-950 via-purple-950 to-fuchsia-950 text-white border border-white/15 card-premium-frame relative overflow-hidden",
        name: `${base.name} text-white`,
        sub: `${base.sub} text-indigo-100/95`,
        company: `${base.company} text-indigo-200/85`,
        tagline: `${base.tagline} text-indigo-200/65`,
        contactIcon: "text-pink-300",
        contactText: base.contactText,
        contactRow: "rounded-full p-2 bg-white/10 border border-white/15",
        qrBg: "bg-white border border-white/25 card-qr-frame",
        badge: `${base.badge} text-indigo-100 bg-white/12 border border-white/20`,
        divider: `${base.divider} bg-gradient-to-r from-transparent via-pink-400/50 to-transparent`,
        emblemColor: "stroke-pink-300 fill-purple-900/35",
        shine: base.shine,
      };
    case "editorial":
      return {
        container:
          "bg-[#FCFBF9] border border-[#E0DBD2] text-[#363229] card-premium-frame relative overflow-hidden",
        name: `${base.name} font-serif text-[#1C1A16]`,
        sub: `${base.sub} font-serif text-[#878072] italic`,
        company: `${base.company} text-[#878072] font-serif`,
        tagline: `${base.tagline} italic text-[#878072]/75 font-serif`,
        contactIcon: "text-[#878072]",
        contactText: `${base.contactText} font-serif`,
        contactRow: "rounded-full p-2 bg-[#878072]/[0.06] border border-[#EBE7DF]",
        qrBg: "bg-white border border-[#EBE7DF] card-qr-frame",
        badge: `${base.badge} text-[#878072] border border-[#EBE7DF] bg-[#FAF9F6]`,
        divider: `${base.divider} bg-[#878072]/30`,
        emblemColor: "stroke-[#878072] fill-transparent",
        shine: base.shine,
      };
    case "gold":
      return {
        container:
          "bg-gradient-to-br from-[#FFF8E8] via-[#F5E6C8] to-[#E8D4A8] text-amber-950 border border-amber-400/35 card-premium-frame relative overflow-hidden",
        name: `${base.name} text-[#3D2E0A]`,
        sub: `${base.sub} text-[#6B4F1D]`,
        company: `${base.company} text-[#8B6914]`,
        tagline: `${base.tagline} text-[#9A7B2E]/85`,
        contactIcon: "text-[#7A5C12]",
        contactText: base.contactText,
        contactRow: "rounded-full p-2 bg-amber-900/[0.06] border border-amber-700/15",
        qrBg: "bg-white border border-amber-400/30 card-qr-frame",
        badge: `${base.badge} text-[#7A5C12] border border-amber-500/30 bg-white/40`,
        divider: `${base.divider} bg-gradient-to-r from-transparent via-amber-600/45 to-transparent`,
        emblemColor: "stroke-[#8B6914] fill-amber-900/8",
        shine: base.shine,
      };
    case "neon":
      return {
        container:
          "bg-slate-950 border border-emerald-500/70 text-emerald-400 card-premium-frame relative overflow-hidden",
        name: `${base.name} text-white`,
        sub: `${base.sub} text-emerald-400`,
        company: `${base.company} text-emerald-500/85`,
        tagline: `${base.tagline} text-emerald-600/70`,
        contactIcon: "text-emerald-400",
        contactText: base.contactText,
        contactRow: "rounded-lg p-2 bg-emerald-500/10 border border-emerald-500/30",
        qrBg: "bg-white border border-emerald-500/25 card-qr-frame",
        badge: `${base.badge} text-emerald-300 bg-emerald-950/50 border border-emerald-500/45`,
        divider: `${base.divider} bg-emerald-500/45`,
        emblemColor: "stroke-emerald-400 fill-transparent",
        shine: "opacity-0",
      };
    case "glass":
      return {
        container:
          "bg-white/55 dark:bg-slate-900/55 backdrop-blur-2xl border border-white/40 dark:border-slate-700/40 text-slate-800 dark:text-slate-100 card-premium-frame relative overflow-hidden",
        name: base.name,
        sub: `${base.sub} text-slate-600 dark:text-slate-300`,
        company: `${base.company} text-slate-500 dark:text-slate-400`,
        tagline: `${base.tagline} text-slate-500/80 dark:text-slate-400/75`,
        contactIcon: "text-indigo-600 dark:text-indigo-400",
        contactText: base.contactText,
        contactRow: "rounded-full p-2 bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10",
        qrBg: "bg-white border border-white/80 dark:border-slate-600/40 card-qr-frame",
        badge: `${base.badge} text-slate-600 dark:text-slate-300 border border-white/50 dark:border-slate-600/40 bg-white/30`,
        divider: `${base.divider} bg-slate-400/30`,
        emblemColor: "stroke-indigo-500 dark:stroke-indigo-400 fill-transparent",
        shine: base.shine,
      };
    case "noir":
    default:
      return {
        container:
          "bg-gradient-to-br from-[#1a1f2e] via-[#12151c] to-[#080a0f] text-slate-100 border border-slate-700/60 card-premium-frame relative overflow-hidden",
        name: `${base.name} text-white`,
        sub: `${base.sub} text-slate-300`,
        company: `${base.company} text-slate-400`,
        tagline: `${base.tagline} text-slate-500`,
        contactIcon: "text-slate-300",
        contactText: base.contactText,
        contactRow: "rounded-full p-2 bg-white/[0.06] border border-white/10",
        qrBg: "bg-white border border-slate-600/50 card-qr-frame",
        badge: `${base.badge} text-slate-300 border border-slate-600/60 bg-slate-950/60`,
        divider: `${base.divider} bg-gradient-to-r from-transparent via-slate-500/50 to-transparent`,
        emblemColor: "stroke-slate-400 fill-slate-800/30",
        shine: base.shine,
      };
  }
}
