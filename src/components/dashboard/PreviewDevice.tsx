"use client";

import { useProfileStore } from "@/store/useProfileStore";
import DynamicIcon from "@/components/common/DynamicIcon";
import { isCustomFieldActive } from "@/lib/custom-fields-api";
import { ArrowRight } from "lucide-react";
import { PLATFORM_PRESETS } from "@/components/dashboard/SocialLinkModal";
import QuickLinksRow from "@/components/dashboard/QuickLinksRow";
import { LANDING_DEMO_PROFILE } from "@/lib/landing-demo-profile";

interface PreviewDeviceProps {
  viewMode?: "mobile" | "tablet" | "desktop";
  /** Use static demo content (marketing landing page) instead of live profile store */
  demo?: boolean;
}

export default function PreviewDevice({ viewMode = "mobile", demo = false }: PreviewDeviceProps) {
  const liveProfile = useProfileStore((s) => s.profile);
  const profile = demo ? LANDING_DEMO_PROFILE : liveProfile;

  const getThemeClasses = () => {
    switch (profile.theme) {
      case "saffron":
        return "theme-saffron text-amber-950";
      case "emerald":
        return "theme-emerald text-emerald-950";
      case "noir":
        return "theme-noir text-slate-100";
      case "silk":
        return "theme-silk text-purple-950";
      case "organic":
      default:
        return "theme-organic text-slate-900 dark:text-slate-100";
    }
  };

  const getBgTextureClass = () => {
    switch (profile.bgStyle) {
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
    switch (profile.theme) {
      case "noir":
        return "bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-100";
      case "saffron":
        return "bg-white/80 hover:bg-white/90 border border-amber-200/50 text-amber-950";
      case "emerald":
        return "bg-white/80 hover:bg-white/90 border border-emerald-200/50 text-emerald-950";
      case "silk":
        return "bg-white/80 hover:bg-white/90 border border-purple-200/50 text-purple-950";
      case "organic":
      default:
        return "bg-white dark:bg-slate-950/60 hover:shadow-md border border-slate-100 dark:border-slate-800/40 text-slate-800 dark:text-slate-100";
    }
  };

  const getButtonPrimaryClass = () => {
    switch (profile.theme) {
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
    switch (profile.theme) {
      case "noir":
        return "bg-slate-800 text-white border border-slate-700";
      case "saffron":
        return "bg-amber-100 text-amber-900 border border-amber-200";
      case "emerald":
        return "bg-emerald-100 text-emerald-900 border border-emerald-200";
      case "silk":
        return "bg-purple-100 text-purple-900 border border-purple-200";
      case "organic":
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
    }
  };

  const renderScreenContent = () => {
    return (
      <div className="w-full flex flex-col items-center">
        {/* Profile Details */}
        <div className="flex flex-col items-center text-center mt-4 mb-8 w-full">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-900">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-500">
                  {profile.name[0]}
                </div>
              )}
            </div>
          </div>

          <h2 className="text-lg font-extrabold tracking-tight mb-1 flex items-center justify-center gap-1.5">
            <span>{profile.name}</span>
            {profile.verified && (
              <span className="material-symbols-outlined text-[14px] text-emerald-500 font-fill-1 shrink-0" title="Verified Account">
                verified
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium px-4 leading-relaxed line-clamp-3">
            {profile.bio}
          </p>

          {profile.currentlyExploring && (
            <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50/70 dark:bg-indigo-950/40 text-[9px] font-black text-indigo-700 dark:text-indigo-400 rounded-full border border-indigo-100/50 dark:border-indigo-900/20 shadow-sm animate-pulse-slow">
              <span className="material-symbols-outlined text-[10px] font-fill-1">rocket_launch</span>
              <span>Exploring: {profile.currentlyExploring}</span>
            </div>
          )}

          <QuickLinksRow
            profile={profile}
            compact
            getCardClasses={() =>
              "bg-white/75 dark:bg-slate-900/60 border border-outline-variant/10 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900"
            }
          />

          {/* Social Icons row */}
          <div className="flex justify-center gap-3 mt-4 flex-wrap max-w-[280px]">
            {(profile.socialLinks || []).filter(s => s.active !== false).map((social) => {
              const preset = PLATFORM_PRESETS.find((p) => p.value === social.platform);
              const iconName = preset ? preset.iconName : "Globe";

              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/75 dark:bg-slate-900/60 shadow-sm border border-outline-variant/10 text-slate-600 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <DynamicIcon name={iconName} className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Action Quick triggers */}
        <div className="grid grid-cols-2 gap-3 mb-8 w-full max-w-[280px]">
          {profile.upiId && (
            <button
              className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-[11px] font-bold shadow-sm transition-all hover:scale-[0.98] ${getButtonPrimaryClass()}`}
            >
              <span className="material-symbols-outlined text-[14px]">payments</span>
              Pay UPI
            </button>
          )}
          {profile.whatsappNumber && (
            <button
              className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-[11px] font-bold shadow-sm transition-all hover:scale-[0.98] ${getButtonSecondaryClass()}`}
            >
              <span className="material-symbols-outlined text-[14px]">chat</span>
              WhatsApp
            </button>
          )}
        </div>

        {/* Hobbies list tags */}
        {profile.hobbies && profile.hobbies.length > 0 && (
          <div className="w-full max-w-[310px] mb-6 flex flex-wrap justify-center gap-1.5 px-2">
            {profile.hobbies.map((hobby, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-white/75 dark:bg-slate-900/60 border border-outline-variant/5 text-[9px] font-black text-slate-500 dark:text-slate-400 rounded-full shadow-sm"
              >
                {hobby}
              </span>
            ))}
          </div>
        )}

        {/* Custom Fields list tags */}
        {profile.customFields && profile.customFields.filter(isCustomFieldActive).length > 0 && (
          <div className="w-full max-w-[310px] mb-5 flex flex-wrap justify-center gap-1.5 px-2">
            {profile.customFields.filter(isCustomFieldActive).map((field) => (
              <div
                key={field.id}
                className="px-2.5 py-1 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/40 dark:border-indigo-900/20 rounded-xl text-[9px] font-bold text-indigo-900 dark:text-indigo-200 shadow-sm flex items-center gap-1"
              >
                <DynamicIcon name={field.icon || "Link2"} className="w-3 h-3 opacity-70 shrink-0" />
                <span className="opacity-70">{field.key}:</span>
                <span className="font-extrabold">{field.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Custom Links List */}
        <div className="space-y-3 w-full max-w-[310px]">
          {profile.links.filter(l => l.active).map((link) => (
            <div
              key={link.id}
              className={`group flex items-center p-3.5 rounded-xl cursor-pointer shadow-sm hover:scale-[0.99] transition-all duration-300 ${getCardClasses()}`}
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3 shrink-0">
                <DynamicIcon name={link.icon || "Link2"} className="w-4 h-4" />
              </div>
              <div className="flex-grow min-w-0 pr-2">
                <h3 className="font-bold text-xs truncate">{link.title}</h3>
                {link.subtitle && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {link.subtitle}
                  </p>
                )}
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          ))}

          {profile.links.filter(l => l.active).length === 0 && (
            <div className="text-center py-8 px-4 rounded-xl border border-dashed border-outline-variant/30 text-slate-450 dark:text-slate-505 text-xs font-bold">
              No active links displayed.
            </div>
          )}
        </div>

        {/* Active Products Display Row */}
        {profile.products && profile.products.filter(p => p.active).length > 0 && (
          <div className="w-full max-w-[310px] mt-8 space-y-3">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-outline-variant/5 pb-1">
              Featured Products
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {profile.products.filter(p => p.active).map((product) => (
                <a
                  key={product.id}
                  href={product.linkUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center p-2.5 rounded-2xl shadow-sm hover:scale-[0.99] transition-all border border-outline-variant/5 bg-white/70 dark:bg-slate-900/60`}
                >
                  {product.imageUrl && (
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 mr-3 border border-outline-variant/5">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-grow min-w-0 pr-2">
                    <h5 className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200 truncate">{product.name}</h5>
                    <span className="text-[10px] font-black text-indigo-650 dark:text-indigo-400">
                      {product.currency || "₹"}{product.price}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Verification / Trust Badge */}
        <div className="mt-8 p-5 bg-white/40 dark:bg-slate-900/40 border border-outline-variant/5 rounded-xl text-center w-full max-w-[310px]">
          <div className="flex justify-center mb-2">
            <span className="material-symbols-outlined text-indigo-600 text-2xl font-fill-1">shield_with_heart</span>
          </div>
          <h4 className="font-extrabold text-[10px] uppercase tracking-wider mb-1">Verified Sanctuary</h4>
          <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            This profile is cryptographically signed and verified by the ANSH TREE network for secure communication.
          </p>
        </div>
      </div>
    );
  };

  if (viewMode === "desktop") {
    return (
      <div className="relative mx-auto border border-outline-variant/10 rounded-3xl w-full h-[680px] shadow-2xl bg-white dark:bg-slate-900 flex flex-col overflow-hidden transition-all duration-300">
        {/* Browser Top Bar */}
        <div className="h-11 bg-slate-50 dark:bg-slate-950 px-4 border-b border-outline-variant/10 flex items-center gap-4 shrink-0">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-400/80" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400/80" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex-grow max-w-sm mx-auto bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-xl py-1 px-3.5 text-[10px] text-slate-400 dark:text-slate-500 font-black tracking-tight truncate text-center select-none">
            ansh.links/{profile.username}
          </div>
        </div>
        {/* Browser Screen */}
        <div className={`flex-grow overflow-y-auto py-12 px-6 ${getThemeClasses()} ${getBgTextureClass()}`}>
          <div className="max-w-md mx-auto bg-white/40 dark:bg-slate-950/20 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-slate-800/10 shadow-lg">
            {renderScreenContent()}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "tablet") {
    return (
      <div className="relative mx-auto border-[16px] border-slate-950 rounded-[2.5rem] w-[500px] h-[680px] shadow-2xl bg-slate-950 ring-4 ring-indigo-500/10 flex flex-col overflow-hidden transition-all duration-300">
        {/* Screen Area */}
        <div
          className={`flex-grow overflow-y-auto px-10 pt-12 pb-10 scrollbar-none relative ${getThemeClasses()} ${getBgTextureClass()}`}
        >
          <div className="max-w-xs mx-auto">
            {renderScreenContent()}
          </div>
        </div>
        {/* Device Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-28 bg-slate-800 rounded-full z-30" />
      </div>
    );
  }

  // DEFAULT: mobile mode
  return (
    <div className="relative mx-auto border-[12px] border-slate-950 rounded-[3rem] w-[340px] h-[680px] shadow-2xl bg-slate-950 ring-4 ring-indigo-500/10 flex flex-col overflow-hidden transition-all duration-300">
      {/* Device Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-36 bg-slate-950 rounded-b-2xl z-30 flex items-center justify-center">
        <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
      </div>

      {/* Screen Area */}
      <div
        className={`flex-grow overflow-y-auto px-5 pt-12 pb-10 scrollbar-none relative ${getThemeClasses()} ${getBgTextureClass()}`}
      >
        {renderScreenContent()}
      </div>

      {/* Device Home Indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-28 bg-slate-800 rounded-full z-30" />
    </div>
  );
}
