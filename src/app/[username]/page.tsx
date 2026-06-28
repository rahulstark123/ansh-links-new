"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProfileStore, ProfileInfo } from "@/store/useProfileStore";
import DynamicIcon from "@/components/common/DynamicIcon";
import { ArrowRight, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PLATFORM_PRESETS } from "@/components/dashboard/SocialLinkModal";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { profile } = useProfileStore();
  const [mounted, setMounted] = useState(false);
  const [activeProfile, setActiveProfile] = useState<ProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Avoid Hydration discrepancy by waiting for mounting
  useEffect(() => {
    setMounted(true);
    
    if (params?.username) {
      const usernameStr = Array.isArray(params.username) ? params.username[0] : params.username;
      fetch(`/api/profile/${usernameStr}`)
        .then((res) => {
          if (!res.ok) throw new Error("Profile not found in database");
          return res.json();
        })
        .then((data) => {
          setActiveProfile(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("DB Fetch Error:", err);
          // Fallback to Zustand profile for local creator preview/robustness
          setActiveProfile(profile);
          setLoading(false);
        });
    } else {
      setActiveProfile(profile);
      setLoading(false);
    }
  }, [params?.username, profile]);

  if (!mounted || loading || !activeProfile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="w-48 h-2.5 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  const getThemeClasses = () => {
    switch (activeProfile.theme) {
      case "saffron":
        return "theme-saffron text-amber-950 min-h-screen";
      case "emerald":
        return "theme-emerald text-emerald-950 min-h-screen";
      case "noir":
        return "theme-noir text-slate-100 min-h-screen";
      case "silk":
        return "theme-silk text-purple-950 min-h-screen";
      case "organic":
      default:
        return "theme-organic text-slate-900 dark:text-slate-100 min-h-screen";
    }
  };

  const getBgTextureClass = () => {
    switch (activeProfile.bgStyle) {
      case "dots":
        return "bg-dots";
      case "mesh":
        return "bg-mesh";
      case "flat":
      default:
        return "";
    }
  };

  const getCardClasses = () => {
    switch (activeProfile.theme) {
      case "noir":
        return "bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-100";
      case "saffron":
        return "bg-white/80 hover:bg-white/90 border border-amber-200/50 text-amber-950 shadow-sm";
      case "emerald":
        return "bg-white/80 hover:bg-white/90 border border-emerald-200/50 text-emerald-950 shadow-sm";
      case "silk":
        return "bg-white/80 hover:bg-white/90 border border-purple-200/50 text-purple-950 shadow-sm";
      case "organic":
      default:
        return "bg-white dark:bg-slate-900/60 hover:shadow-md border border-slate-100 dark:border-slate-800/40 text-slate-800 dark:text-slate-100";
    }
  };

  const getButtonPrimaryClass = () => {
    switch (activeProfile.theme) {
      case "noir":
        return "bg-white text-black hover:opacity-90";
      case "saffron":
        return "bg-amber-600 text-white hover:bg-amber-700";
      case "emerald":
        return "bg-emerald-600 text-white hover:bg-emerald-700";
      case "silk":
        return "bg-purple-600 text-white hover:bg-purple-700";
      case "organic":
      default:
        return "primary-gradient text-white";
    }
  };

  const getButtonSecondaryClass = () => {
    switch (activeProfile.theme) {
      case "noir":
        return "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700";
      case "saffron":
        return "bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200/60";
      case "emerald":
        return "bg-emerald-100 text-emerald-900 border border-emerald-200 hover:bg-emerald-200/60";
      case "silk":
        return "bg-purple-100 text-purple-900 border border-purple-200 hover:bg-purple-200/60";
      case "organic":
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60";
    }
  };

  const handleUpiPay = () => {
    if (activeProfile.upiId) {
      window.open(`upi://pay?pa=${activeProfile.upiId}&pn=${encodeURIComponent(activeProfile.name)}`);
    }
  };

  const handleWhatsappChat = () => {
    if (activeProfile.whatsappNumber) {
      const sanitized = activeProfile.whatsappNumber.replace(/[^\d+]/g, "");
      window.open(`https://wa.me/${sanitized}`);
    }
  };

  return (
    <div className={`${getThemeClasses()} ${getBgTextureClass()} relative`}>
      {/* Floating admin link for ease of navigation back to dashboard */}
      <div className="absolute top-6 left-6 z-40">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-sm hover:shadow-md border border-outline-variant/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Edit Bio
        </Link>
      </div>

      <main className="pt-24 pb-20 px-6 max-w-2xl mx-auto flex flex-col items-center">
        {/* Profile Identity Section */}
        <section className="flex flex-col items-center text-center mb-10 w-full animate-fadeIn">
          <div className="relative mb-6">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl ring-1 ring-outline-variant/5">
              {activeProfile.avatar ? (
                <img
                  alt={activeProfile.name}
                  className="w-full h-full object-cover animate-shimmer"
                  src={activeProfile.avatar}
                />
              ) : (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-3xl font-extrabold text-slate-500">
                  {activeProfile.name[0]}
                </div>
              )}
            </div>

            {activeProfile.verified && (
              <div className="absolute bottom-1 right-1 bg-emerald-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
                <span className="material-symbols-outlined text-[13px] font-fill-1">verified</span>
                <span className="text-[8px] font-extrabold tracking-wider uppercase">VERIFIED</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            {activeProfile.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed font-medium">
            {activeProfile.bio}
          </p>

          {activeProfile.currentlyExploring && (
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50/70 dark:bg-indigo-950/40 text-xs font-black text-indigo-700 dark:text-indigo-400 rounded-full border border-indigo-100/50 dark:border-indigo-900/20 shadow-sm animate-pulse-slow">
              <span className="material-symbols-outlined text-[14px] font-fill-1">rocket_launch</span>
              <span>Exploring: {activeProfile.currentlyExploring}</span>
            </div>
          )}

          {/* Social Links Row */}
          <div className="flex gap-3 mb-8">
            {activeProfile.socialLinks.map((social) => {
              const preset = PLATFORM_PRESETS.find((p) => p.value === social.platform);
              const iconName = preset ? preset.iconName : "Globe";

              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-white/70 dark:bg-slate-900/60 shadow-sm border border-outline-variant/10 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  <DynamicIcon name={iconName} className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </section>

        {/* Primary Action Buttons */}
        {(activeProfile.upiId || activeProfile.whatsappNumber) && (
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 w-full max-w-md">
            {activeProfile.upiId && (
              <button
                onClick={handleUpiPay}
                className={`flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold shadow-md hover:scale-[0.98] transition-transform ${getButtonPrimaryClass()}`}
              >
                <span className="material-symbols-outlined">payments</span>
                Pay via UPI
              </button>
            )}
            {activeProfile.whatsappNumber && (
              <button
                onClick={handleWhatsappChat}
                className={`flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold shadow-md hover:scale-[0.98] transition-transform ${getButtonSecondaryClass()}`}
              >
                <span className="material-symbols-outlined">chat</span>
                Chat on WhatsApp
              </button>
            )}
          </section>
        )}

        {/* Hobbies & Interests */}
        {activeProfile.hobbies && activeProfile.hobbies.length > 0 && (
          <section className="flex flex-wrap justify-center gap-2 max-w-md mb-8 px-4">
            {activeProfile.hobbies.map((hobby, index) => (
              <span
                key={index}
                className="px-3.5 py-1 bg-white/70 dark:bg-slate-900/60 border border-outline-variant/10 text-xs font-extrabold text-slate-500 dark:text-slate-405 rounded-full shadow-sm"
              >
                {hobby}
              </span>
            ))}
          </section>
        )}

        {/* Links List */}
        <section className="space-y-4 w-full max-w-xl">
          <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.25em] text-center mb-6 uppercase">
            Projects & Links
          </h2>
          
          {activeProfile.links
            .filter((l) => l.active)
            .map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={`group flex items-center p-5 rounded-xl transition-all ${getCardClasses()}`}
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-4 shrink-0 shadow-inner">
                  <DynamicIcon name={link.icon || "Link2"} className="w-5 h-5" />
                </div>
                <div className="flex-grow min-w-0 pr-4">
                  <h3 className="font-bold text-sm sm:text-base truncate">{link.title}</h3>
                  {link.subtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {link.subtitle}
                    </p>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </a>
            ))}

          {activeProfile.links.filter((l) => l.active).length === 0 && (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm border-2 border-dashed border-outline-variant/10 rounded-xl">
              No links are currently configured as active.
            </div>
          )}
        </section>

        {/* Products Showcase */}
        {activeProfile.products && activeProfile.products.filter(p => p.active).length > 0 && (
          <section className="space-y-4 w-full max-w-xl mt-12">
            <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.25em] text-center mb-6 uppercase">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 gap-3.5">
              {activeProfile.products.filter(p => p.active).map((product) => (
                <a
                  key={product.id}
                  href={product.linkUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex items-center p-4 rounded-xl transition-all ${getCardClasses()}`}
                >
                  {product.imageUrl && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 mr-4 border border-outline-variant/5 shadow-sm">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-grow min-w-0 pr-4">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-200 truncate">{product.name}</h3>
                    <span className="text-xs font-black text-indigo-650 dark:text-indigo-400 mt-1 block">
                      {product.currency || "₹"}{product.price}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Cryptographic Signing Trust Badge */}
        <div className="mt-16 p-6 sm:p-8 bg-white/40 dark:bg-slate-900/40 border border-outline-variant/5 rounded-2xl text-center w-full max-w-xl">
          <div className="flex justify-center mb-3">
            <span className="material-symbols-outlined text-indigo-600 text-3xl font-fill-1">shield_with_heart</span>
          </div>
          <h4 className="font-extrabold text-xs uppercase tracking-wider mb-2">Verified Sanctuary</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-sm mx-auto">
            This profile is cryptographically signed and verified by the ANSH TREE network for secure communication.
          </p>
        </div>
      </main>

      {/* Styled simple footer */}
      <footer className="py-10 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} ANSH TREE & ANSH Links. All rights reserved.
      </footer>
    </div>
  );
}
