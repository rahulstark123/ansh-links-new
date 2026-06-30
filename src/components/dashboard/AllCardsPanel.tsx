"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { createCard } from "@/lib/cards-api";
import { Sparkles, CreditCard, Check, ArrowRight } from "lucide-react";

interface TemplateCard {
  name: string;
  theme: "noir" | "gold" | "neon" | "glass" | "retro" | "aurora" | "editorial" | "brutalist" | "solarized" | "parchment" | "terracotta";
  description: string;
  badge: string;
  themeClass: string;
}

export default function AllCardsPanel({ setActivePanel }: { setActivePanel: (panel: any) => void }) {
  const { profile, updateProfileInfo } = useProfileStore();

  const templates: TemplateCard[] = [
    {
      name: "Midnight Executive",
      theme: "noir",
      description: "Deep charcoal mesh gradient with minimalist elements. Fits corporate executives and researchers.",
      badge: "Professional",
      themeClass: "bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100 border border-slate-800 shadow-xl",
    },
    {
      name: "Golden Champagne",
      theme: "gold",
      description: "Elegant gold radial gradient with classic serif typography. Designed for curators and founders.",
      badge: "Luxury",
      themeClass: "bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 text-amber-950 border border-amber-300/40 shadow-xl",
    },
    {
      name: "Cyber Neon",
      theme: "neon",
      description: "Dark canvas with glowing emerald borders. Perfect for tech enthusiasts, engineers, and creators.",
      badge: "Creative",
      themeClass: "bg-slate-950 border-2 border-emerald-500/80 text-emerald-400 shadow-xl shadow-emerald-950/10",
    },
    {
      name: "Glassmorphic Translucent",
      theme: "glass",
      description: "High blur transparency displaying colors behind it. Built for modern UI designers and digital artists.",
      badge: "Modern",
      themeClass: "bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/20 text-slate-800 dark:text-slate-200 shadow-xl",
    },
    {
      name: "Neo Brutalist",
      theme: "brutalist",
      description: "Stark raw black outline layout with card shadowing. Authentic high-contrast modern editorial aesthetic.",
      badge: "Authentic",
      themeClass: "bg-white border-4 border-black text-black font-mono shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
    },
    {
      name: "Solarized Architect",
      theme: "solarized",
      description: "Sandy beige gradient with deep teal-indigo typography. Highly authentic and sophisticated layout.",
      badge: "Authentic",
      themeClass: "bg-gradient-to-br from-[#FDF6E3] to-[#EEE8D5] text-[#073642] border border-[#D3C6A2] shadow-xl",
    },
    {
      name: "Vintage Parchment",
      theme: "parchment",
      description: "Classical textured warm paper styling featuring typewriter serif print. Retro, academic, and nostalgic.",
      badge: "Old School",
      themeClass: "bg-[#FAF4E8] border border-[#E4D1B9] text-[#2B231D] font-serif shadow-lg",
    },
    {
      name: "Warm Terracotta",
      theme: "terracotta",
      description: "Clay red backdrop accented by cream letterings. Rustic mid-century design style.",
      badge: "Old School",
      themeClass: "bg-gradient-to-br from-[#C96F53] to-[#B05B41] text-[#FCF8F5] border border-[#D58C75]/40 shadow-xl",
    },
  ];

  const handleUseTemplate = async (template: TemplateCard) => {
    if (!profile.wid) {
      alert("Workspace ID not found. Please reload your profile.");
      return;
    }
    try {
      const saved = await createCard(profile.wid, {
        cardName: profile.name || "Ansh Kumar",
        jobTitle: "Product Architect",
        company: "ANSH Apps Suite",
        phone: profile.whatsappNumber || "+91 98765 43210",
        email: profile.socialLinks?.find((s) => s.platform === "email")?.url.replace("mailto:", "") || "ansh@anshapps.com",
        website: "https://anshapps.com",
        theme: template.theme,
        active: true,
        qrLink: "",
      });
      updateProfileInfo({ cards: [...(profile.cards || []), saved] });
      setActivePanel("my-cards");
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  return (
    <div className="p-8 sm:p-10 space-y-8 w-full animate-fadeIn">
      
      {/* Overview Block */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 shadow-sm space-y-2 transition-colors duration-300">
        <h3 className="font-black text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
          <Sparkles className="w-5.5 h-5.5 text-amber-500" />
          Digital Card Template Library
        </h3>
        <p className="text-sm text-slate-400">
          Kickstart your networking sheet with our curated collection of business card styles. Select a preset below to populate details.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {templates.map((tpl, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group transition-colors duration-300"
          >
            {/* Visual template Card mockup */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{tpl.badge}</span>
                <span className="text-xs font-bold bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-outline-variant/5">
                  Preset Mode
                </span>
              </div>

              {/* Card visual body */}
              <div className={`w-full aspect-[1.75/1] rounded-2xl p-6 flex flex-col justify-between select-none ${tpl.themeClass}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">Company Name</span>
                    <span className="text-[7px] font-bold opacity-45 uppercase tracking-wider block mt-0.5">Company Slogan Tagline</span>
                    <h4 className="text-base font-black tracking-tight mt-1.5 font-sans">Card Holder Name</h4>
                    <span className="text-[10px] opacity-75">Job Position Title</span>
                  </div>
                  
                  <div className={`w-10 h-10 p-1.5 rounded-lg flex items-center justify-center shrink-0 ${
                    tpl.theme === "noir" ? "bg-white text-slate-900" : "bg-white/70 text-slate-900 border border-white/20"
                  }`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="text-[10px] opacity-65 flex gap-3 border-t border-white/5 pt-3">
                  <span>+91 98765 43210</span>
                  <span>|</span>
                  <span>name@company.com</span>
                </div>
              </div>
            </div>

            {/* Description and Trigger button */}
            <div className="space-y-4 mt-6">
              <div className="space-y-1">
                <h4 className="text-sm font-black">{tpl.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{tpl.description}</p>
              </div>
              <button
                onClick={() => handleUseTemplate(tpl)}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-indigo-100 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-black transition-colors cursor-pointer"
              >
                Use This Template
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
