"use client";

import DynamicIcon from "@/components/common/DynamicIcon";
import type { ProfileInfo } from "@/store/useProfileStore";
import { getQuickLinks } from "@/lib/quick-links";

interface QuickLinksRowProps {
  profile: ProfileInfo;
  getCardClasses?: () => string;
  compact?: boolean;
  onLinkClick?: (title: string, linkId: string) => void;
}

export default function QuickLinksRow({
  profile,
  getCardClasses,
  compact = false,
  onLinkClick,
}: QuickLinksRowProps) {
  const quickLinks = getQuickLinks(profile);

  if (quickLinks.length === 0) return null;

  const defaultCardClass =
    "bg-white/80 dark:bg-slate-900/60 border border-outline-variant/10 text-slate-800 dark:text-slate-100";

  return (
    <div
      className={`flex flex-wrap justify-center gap-2 w-full ${
        compact ? "max-w-[280px] mt-3" : "max-w-md mt-4"
      }`}
    >
      {quickLinks.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          onClick={() => onLinkClick?.(link.title, link.id)}
          className={`inline-flex items-center gap-1.5 rounded-full shadow-sm hover:scale-[0.98] transition-all ${
            compact
              ? "px-3 py-1.5 text-[9px] font-black"
              : "px-4 py-2 text-[11px] font-bold"
          } ${getCardClasses ? getCardClasses() : defaultCardClass}`}
        >
          <DynamicIcon name={link.icon || "Link2"} className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
          <span className="truncate max-w-[120px]">{link.title}</span>
        </a>
      ))}
    </div>
  );
}
