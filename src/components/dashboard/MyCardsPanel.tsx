"use client";

import { useState, useRef } from "react";
import { useProfileStore, DigitalCard } from "@/store/useProfileStore";
import CardModal from "@/components/dashboard/CardModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import * as Icons from "lucide-react";
import { Plus, CreditCard, Edit2, Trash2, Phone, Mail, Globe, Sparkles, ToggleLeft, ToggleRight, Link2, ExternalLink } from "lucide-react";
import { PLATFORM_PRESETS } from "@/components/dashboard/SocialLinkModal";


export default function MyCardsPanel() {
  const { profile, removeCard, updateCard } = useProfileStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<DigitalCard | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingCard, setDeletingCard] = useState<DigitalCard | null>(null);

  const cardsList = profile.cards || [];

  const handleOpenCreate = () => {
    setEditingCard(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (card: DigitalCard) => {
    setEditingCard(card);
    setModalOpen(true);
  };

  const handleOpenDelete = (card: DigitalCard) => {
    setDeletingCard(card);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingCard) {
      removeCard(deletingCard.id);
      setDeletingCard(null);
    }
  };

  return (
    <div className="p-8 sm:p-10 space-y-8 max-w-6xl mx-auto animate-fadeIn font-sans">
      
      {/* Panel Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 shadow-sm transition-colors duration-300">
        <div className="space-y-2">
          <h3 className="font-black text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <CreditCard className="w-5.5 h-5.5" />
            My Digital Business Cards
          </h3>
          <p className="text-sm text-slate-400">
            Create and manage luxury responsive contact cards. Displaying Front & Back mockup sheets.
          </p>
        </div>
        
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white primary-gradient text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform cursor-pointer shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          Create New Card
        </button>
      </div>

      {/* Cards Grid */}
      <div className="space-y-12">
        {cardsList.map((card) => (
          <InteractiveDoubleSidedCard
            key={card.id}
            card={card}
            onEdit={() => handleOpenEdit(card)}
            onDelete={() => handleOpenDelete(card)}
          />
        ))}

        {cardsList.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-slate-900 border border-dashed border-outline-variant/10 rounded-3xl p-8 text-slate-400 space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-300">
              <CreditCard className="w-7 h-7" />
            </div>
            <p className="text-base font-bold">No digital cards created yet</p>
            <p className="text-xs">Click the "Create New Card" button above to craft your first corporate sheet.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Card Modal */}
      <CardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        cardToEdit={editingCard}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={deletingCard?.cardName}
      />

    </div>
  );
}

// Custom theme configuration helper
interface ThemeConfig {
  container: string;
  name: string;
  sub: string;
  contactIcon: string;
  qrBg: string;
  badge: string;
  emblemColor: string;
}

const getCardThemeConfig = (theme: string): ThemeConfig => {
  switch (theme) {
    case "brutalist":
      return {
        container: "bg-white border-4 border-black text-black font-mono shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden",
        name: "text-xl font-black tracking-tighter text-black uppercase font-mono",
        sub: "text-xs font-black text-black font-mono pb-1 mb-2 inline-block",
        contactIcon: "text-black font-bold",
        qrBg: "bg-white border-2 border-black",
        badge: "text-[9px] font-black uppercase text-white bg-black px-2 py-0.5 rounded",
        emblemColor: "stroke-black fill-black/10",
      };
    case "solarized":
      return {
        container: "bg-[#FDF6E3] border border-[#D3C6A2] text-[#073642] shadow-lg relative overflow-hidden",
        name: "text-lg font-black tracking-tight text-[#002B36] font-sans",
        sub: "text-xs font-bold text-[#2AA198]",
        contactIcon: "text-[#268BD2]",
        qrBg: "bg-white border border-[#D3C6A2]",
        badge: "text-[9px] font-black uppercase text-[#2AA198] border border-[#2AA198]/30 px-2 py-0.5 rounded bg-[#93A1A1]/10",
        emblemColor: "stroke-[#268BD2] fill-[#2AA198]/10",
      };
    case "parchment":
      return {
        container: "bg-[#FAF4E8] border border-[#E4D1B9] text-[#2B231D] font-serif shadow-md relative overflow-hidden",
        name: "text-lg font-black tracking-tight text-[#1F1712] font-serif",
        sub: "text-xs font-semibold text-[#8B6E5A] italic font-serif",
        contactIcon: "text-[#8B6E5A]",
        qrBg: "bg-[#FAF4E8] border border-[#E4D1B9]",
        badge: "text-[9px] font-bold uppercase text-[#8B6E5A] border border-[#E4D1B9] px-2 py-0.5 rounded bg-[#FAF4E8]",
        emblemColor: "stroke-[#8B6E5A] fill-transparent",
      };
    case "terracotta":
      return {
        container: "bg-[#C96F53] border border-[#D58C75] text-[#FCF8F5] shadow-lg relative overflow-hidden",
        name: "text-lg font-black tracking-tight text-[#FCF8F5] font-sans",
        sub: "text-xs font-bold text-[#F3D5C8]/90",
        contactIcon: "text-[#F3D5C8]",
        qrBg: "bg-white border border-[#D58C75]/20",
        badge: "text-[9px] font-black uppercase text-[#FCF8F5] bg-[#A44E35]/40 px-2 py-0.5 rounded-full",
        emblemColor: "stroke-[#F3D5C8] fill-transparent",
      };
    case "retro":
      return {
        container: "bg-[#0A0E17] border-2 border-emerald-500/40 text-emerald-400 font-mono shadow-xl relative overflow-hidden",
        name: "text-lg font-black tracking-widest text-emerald-300 font-mono uppercase",
        sub: "text-xs font-bold text-emerald-500 font-mono",
        contactIcon: "text-emerald-500",
        qrBg: "bg-emerald-50 border border-emerald-500/30",
        badge: "text-[9px] font-black uppercase text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-950/20",
        emblemColor: "stroke-emerald-400 fill-emerald-950/20",
      };
    case "aurora":
      return {
        container: "bg-gradient-to-br from-indigo-900 via-purple-950 to-pink-900 text-white shadow-xl relative overflow-hidden border border-white/10",
        name: "text-xl font-black tracking-tight text-white",
        sub: "text-xs font-bold text-indigo-200/90",
        contactIcon: "text-pink-400",
        qrBg: "bg-white border border-white/20",
        badge: "text-[9px] font-black uppercase text-indigo-200 bg-white/15 px-2 py-0.5 rounded-full",
        emblemColor: "stroke-pink-400 fill-purple-900/30",
      };
    case "editorial":
      return {
        container: "bg-[#FCFBF9] border border-[#EBE7DF] text-[#363229] shadow-md",
        name: "text-xl font-black font-serif text-[#1C1A16] tracking-tight",
        sub: "text-xs font-bold font-serif text-[#878072] italic",
        contactIcon: "text-[#878072]",
        qrBg: "bg-white border border-[#EBE7DF]",
        badge: "text-[9px] font-bold uppercase tracking-wider text-[#878072] border border-[#EBE7DF] px-2 py-0.5 rounded-full bg-[#FAF9F6]",
        emblemColor: "stroke-[#878072] fill-transparent",
      };
    case "gold":
      return {
        container: "bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 text-amber-950 border border-amber-300/40 shadow-md",
        name: "text-lg font-black tracking-tight text-amber-950",
        sub: "text-xs font-bold text-amber-800/80",
        contactIcon: "text-amber-850",
        qrBg: "bg-white border border-amber-300/20",
        badge: "text-[9px] font-black uppercase text-amber-800 border border-amber-400/20 px-2 py-0.5 rounded-full bg-amber-50/50",
        emblemColor: "stroke-amber-800 fill-transparent",
      };
    case "neon":
      return {
        container: "bg-slate-950 border-2 border-emerald-500/85 text-emerald-400 shadow-xl",
        name: "text-lg font-black tracking-tight text-white",
        sub: "text-xs font-bold text-emerald-500",
        contactIcon: "text-emerald-400",
        qrBg: "bg-white border border-emerald-500/20",
        badge: "text-[9px] font-black uppercase text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/40",
        emblemColor: "stroke-emerald-400 fill-transparent",
      };
    case "glass":
      return {
        container: "bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/20 text-slate-800 dark:text-slate-200 shadow-sm",
        name: "text-lg font-black tracking-tight",
        sub: "text-xs font-bold text-slate-500 dark:text-slate-400",
        contactIcon: "text-indigo-500 dark:text-indigo-400",
        qrBg: "bg-white border border-outline-variant/10",
        badge: "text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 border border-outline-variant/15 px-2 py-0.5 rounded-full bg-white/30 dark:bg-slate-950/20",
        emblemColor: "stroke-indigo-500 dark:stroke-indigo-400 fill-transparent",
      };
    case "noir":
    default:
      return {
        container: "bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100 border border-slate-800/80 shadow-xl",
        name: "text-lg font-black tracking-tight text-white",
        sub: "text-xs font-bold text-slate-400",
        contactIcon: "text-slate-300",
        qrBg: "bg-white border border-slate-850",
        badge: "text-[9px] font-black uppercase text-slate-400 border border-slate-850 px-2 py-0.5 rounded-full bg-slate-950/50",
        emblemColor: "stroke-slate-400 fill-transparent",
      };
  }
};

interface InteractiveDoubleSidedCardProps {
  card: DigitalCard;
  onEdit: () => void;
  onDelete: () => void;
}

function InteractiveDoubleSidedCard({ card, onEdit, onDelete }: InteractiveDoubleSidedCardProps) {
  const { profile, updateCard } = useProfileStore();
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const [frontTilt, setFrontTilt] = useState({});
  const [backTilt, setBackTilt] = useState({});

  const cfg = getCardThemeConfig(card.theme);

  // 3D Perspective Tilt on Mouse Movement
  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLDivElement | null>,
    setTilt: (style: any) => void
  ) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;

    const maxTilt = 12;
    const tiltX = (yPct * -maxTilt).toFixed(2);
    const tiltY = (xPct * maxTilt).toFixed(2);

    setTilt({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`,
      transition: "transform 0.05s ease-out",
    });
  };

  const handleMouseLeave = (setTilt: (style: any) => void) => {
    setTilt({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.4s ease",
    });
  };

  return (
    <div className={`space-y-4 bg-slate-50/50 dark:bg-slate-950/10 border border-outline-variant/5 rounded-3xl p-6 transition-opacity duration-300 ${!card.active ? "opacity-60" : ""}`}>
      {/* Status row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-700 dark:text-slate-200">{card.cardName}</span>
          <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            card.active
              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400"
              : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
          }`}>
            {card.active ? "Sharing On" : "Not Shared"}
          </span>
          {card.qrLink && (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-indigo-500">
              <Link2 className="w-3 h-3" />
              Custom QR
            </span>
          )}
        </div>
      </div>
      {/* Front and Back Cards Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FRONT SIDE */}
        <div className="space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Front Side</span>
          <div
            ref={frontRef}
            onMouseMove={(e) => handleMouseMove(e, frontRef, setFrontTilt)}
            onMouseLeave={() => handleMouseLeave(setFrontTilt)}
            style={frontTilt}
            className={`w-full aspect-[1.65/1] rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg cursor-default transition-all ${cfg.container}`}
          >
            {/* Holographic light layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none mix-blend-overlay" />
            
            {/* Top branding bar */}
            <div className="flex justify-between items-start">
              <div className="space-y-0.5 min-w-0">
                <span className={`text-[10px] font-black uppercase tracking-widest block truncate ${card.theme === "neon" ? "text-emerald-400" : "opacity-80"}`}>
                  {card.company || "ANSH Ecosystem"}
                </span>
                {card.companyTagline && (
                  <span className="text-[8px] font-bold opacity-60 block truncate leading-tight uppercase tracking-wider">
                    {card.companyTagline}
                  </span>
                )}
              </div>
              <span className={cfg.badge}>{card.theme} Card</span>
            </div>

            {/* Mid branding and Emblem */}
            <div className="flex justify-between items-end mt-4">
              <div className="space-y-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight block leading-tight">{card.cardName}</span>
                <span className={cfg.sub}>{card.jobTitle}</span>
              </div>
              
              {/* Premium geometric layout emblem SVG */}
              <svg viewBox="0 0 100 100" className="w-12 h-12 shrink-0 opacity-40">
                <circle cx="50" cy="50" r="40" strokeWidth="2.5" strokeDasharray="4 2" className={cfg.emblemColor} />
                <polygon points="50,20 75,70 25,70" strokeWidth="2.5" className={cfg.emblemColor} />
                <circle cx="50" cy="50" r="10" strokeWidth="2" className={cfg.emblemColor} />
              </svg>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Back Side</span>
          <div
            ref={backRef}
            onMouseMove={(e) => handleMouseMove(e, backRef, setBackTilt)}
            onMouseLeave={() => handleMouseLeave(setBackTilt)}
            style={backTilt}
            className={`w-full aspect-[1.65/1] rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg cursor-default transition-all ${cfg.container}`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none mix-blend-overlay" />

            {/* Back card details */}
            <div className="flex justify-between items-start h-full">
              
              {/* Stacked contact information on the left */}
              <div className="flex flex-col justify-between h-full py-1.5 max-w-[65%]">
                <div className="space-y-3">
                  {card.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className={`w-4 h-4 shrink-0 ${cfg.contactIcon}`} />
                      <span className="text-xs font-bold truncate leading-none">{card.phone}</span>
                    </div>
                  )}
                  {card.email && (
                    <div className="flex items-center gap-2">
                      <Mail className={`w-4 h-4 shrink-0 ${cfg.contactIcon}`} />
                      <span className="text-xs font-bold truncate leading-none">{card.email}</span>
                    </div>
                  )}
                </div>

                {/* Social links row */}
                <div className="flex gap-2.5 pt-1.5 flex-wrap">
                  {profile.socialLinks && profile.socialLinks.length > 0 ? (
                    profile.socialLinks.slice(0, 4).map((sLink) => {
                      const preset = PLATFORM_PRESETS.find((p) => p.value === sLink.platform);
                      const IconComponent = preset ? (Icons as any)[preset.iconName] : null;
                      const SocialIcon = IconComponent || Globe;
                      return (
                        <div
                          key={sLink.id}
                          className="w-7 h-7 rounded-full bg-slate-900/10 dark:bg-white/10 border border-slate-950/5 dark:border-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300"
                          title={sLink.platform}
                        >
                          <SocialIcon className="w-3.5 h-3.5" />
                        </div>
                      );
                    })
                  ) : (
                    // Fallback icons if no socials connected
                    ["Github", "Twitter", "Linkedin", "Instagram"].map((ico) => {
                      const IconComponent = (Icons as any)[ico] || Globe;
                      return (
                        <div
                          key={ico}
                          className="w-7 h-7 rounded-full bg-slate-900/10 dark:bg-white/10 border border-slate-950/5 dark:border-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300"
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                      );
                    })
                  )}
                </div>
                
                {/* Website positioned specifically bottom left */}
                <div className="text-[9px] opacity-40 uppercase tracking-widest font-black font-mono">
                  Corporate Sheet
                </div>
              </div>

              {/* QR Code and Website positioned on the right */}
              <div className="flex flex-col justify-between items-end h-full py-1.5 shrink-0 ml-4">
                
                {/* Mock QR Code */}
                <div className={`w-14 h-14 p-1.5 rounded-xl flex items-center justify-center ${
                  card.theme === "noir" || card.theme === "retro" ? "bg-white border-slate-700" : "bg-white border-outline-variant/10"
                }`}>
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                    <rect x="0" y="0" width="25" height="25" fill="currentColor" />
                    <rect x="5" y="5" width="15" height="15" fill="white" />
                    <rect x="75" y="0" width="25" height="25" fill="currentColor" />
                    <rect x="80" y="5" width="15" height="15" fill="white" />
                    <rect x="0" y="75" width="25" height="25" fill="currentColor" />
                    <rect x="5" y="80" width="15" height="15" fill="white" />
                    <rect x="35" y="35" width="30" height="30" fill="currentColor" />
                    <rect x="42" y="42" width="16" height="16" fill="white" />
                    <rect x="35" y="10" width="10" height="15" fill="currentColor" />
                    <rect x="55" y="5" width="10" height="15" fill="currentColor" />
                    <rect x="10" y="35" width="15" height="10" fill="currentColor" />
                    <rect x="15" y="55" width="10" height="10" fill="currentColor" />
                    <rect x="75" y="45" width="15" height="15" fill="currentColor" />
                    <rect x="45" y="75" width="20" height="10" fill="currentColor" />
                    <rect x="75" y="75" width="15" height="20" fill="currentColor" />
                  </svg>
                </div>

                {/* Website URL strictly bottom right */}
                {card.website && (
                  <div className="flex items-center gap-1 text-[11px] font-extrabold max-w-[140px] truncate">
                    <Globe className={`w-3.5 h-3.5 shrink-0 ${cfg.contactIcon}`} />
                    <span className="truncate">{card.website.replace(/(^\w+:|^)\/\//, "")}</span>
                  </div>
                )}
                {/* QR code embed type label */}
                <div className={`text-[7px] font-black uppercase tracking-widest mt-0.5 ${card.qrLink ? "text-indigo-400" : "opacity-30"}`}>
                  {card.qrLink ? "↑ Custom Link" : "↑ QR Code"}
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Card Admin Controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between pt-3 border-t border-outline-variant/5">
        {/* Left side: Active toggle + QR link indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateCard(card.id, { active: !card.active })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
              card.active
                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-400"
            }`}
            title={card.active ? "Card is Active - Click to Deactivate" : "Card is Inactive - Click to Activate"}
          >
            {card.active
              ? <ToggleRight className="w-4 h-4" />
              : <ToggleLeft className="w-4 h-4" />}
            {card.active ? "Active" : "Inactive"}
          </button>

          {card.qrLink && (
            <a
              href={card.qrLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-all"
              title={`QR Embedded: ${card.qrLink}`}
            >
              <Link2 className="w-3.5 h-3.5" />
              QR Link
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Right side: Edit / Delete */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-4 py-2 border border-outline-variant/10 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-black transition-all text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Card
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-4 py-2 border border-rose-100 dark:border-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-xs font-black transition-all text-rose-500 hover:text-rose-600 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove Card
          </button>
        </div>
      </div>

    </div>
  );
}
