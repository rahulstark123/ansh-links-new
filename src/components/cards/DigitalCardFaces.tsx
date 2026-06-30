"use client";

import { CSSProperties, RefObject } from "react";
import { DigitalCard, SocialLink } from "@/store/useProfileStore";
import { getCardThemeConfig } from "@/lib/card-themes";
import { getCardQrTargetUrl } from "@/lib/card-url";
import CardQrCode from "@/components/common/CardQrCode";
import { PLATFORM_PRESETS } from "@/components/dashboard/SocialLinkModal";
import * as Icons from "lucide-react";
import { Phone, Mail, Globe } from "lucide-react";

interface DigitalCardFacesProps {
  card: DigitalCard;
  username: string;
  socialLinks?: SocialLink[];
  /** `hero` = full-width stacked cards for public share page */
  variant?: "default" | "hero";
  frontRef?: RefObject<HTMLDivElement | null>;
  backRef?: RefObject<HTMLDivElement | null>;
  frontStyle?: CSSProperties;
  backStyle?: CSSProperties;
  onFrontMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onBackMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onFrontMouseLeave?: () => void;
  onBackMouseLeave?: () => void;
}

function CompanyLogoMark({
  logoUrl,
  company,
  large,
}: {
  logoUrl?: string;
  company: string;
  large?: boolean;
}) {
  const size = large ? "w-20 h-20 sm:w-24 sm:h-24" : "w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem]";

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={company ? `${company} logo` : "Company logo"}
        className={`${size} shrink-0 object-contain`}
      />
    );
  }

  return null;
}

function ContactRow({
  icon: Icon,
  value,
  iconClass,
  textClass,
  rowClass,
}: {
  icon: typeof Phone;
  value: string;
  iconClass: string;
  textClass: string;
  rowClass: string;
}) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className={rowClass}>
        <Icon className={`w-5 h-5 shrink-0 ${iconClass}`} strokeWidth={1.75} />
      </div>
      <span className={`${textClass} truncate`}>{value}</span>
    </div>
  );
}

export default function DigitalCardFaces({
  card,
  username,
  socialLinks = [],
  variant = "default",
  frontRef,
  backRef,
  frontStyle,
  backStyle,
  onFrontMouseMove,
  onBackMouseMove,
  onFrontMouseLeave,
  onBackMouseLeave,
}: DigitalCardFacesProps) {
  const cfg = getCardThemeConfig(card.theme);
  const qrTarget = getCardQrTargetUrl(card, username);
  const isHero = variant === "hero";
  const cardSocialLinks = socialLinks.filter(
    (link) => link.platform !== "website" && link.platform !== "email"
  );

  const cardShell = [
    "digital-card w-full rounded-[1.35rem] relative overflow-hidden flex flex-col justify-between transition-all",
    isHero ? "digital-card-hero aspect-[1.85/1] p-8 sm:p-10 lg:p-12" : "aspect-[1.75/1] p-7 sm:p-8",
    cfg.container,
  ].join(" ");

  const qrSize = isHero ? 112 : 84;
  const wrapperClass = isHero ? "flex flex-col gap-10" : "grid grid-cols-1 lg:grid-cols-2 gap-8";
  const labelClass = isHero
    ? "text-sm font-medium text-slate-400 uppercase tracking-[0.2em] pl-1"
    : "text-xs font-medium text-slate-400 uppercase tracking-[0.2em] pl-1";

  return (
    <div className={wrapperClass}>
      <div className="space-y-2">
        <span className={labelClass}>Front</span>
        <div
          ref={frontRef}
          onMouseMove={onFrontMouseMove}
          onMouseLeave={onFrontMouseLeave}
          style={frontStyle}
          className={cardShell}
        >
          <div className={`absolute inset-0 pointer-events-none ${cfg.shine}`} />
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,transparent_70%)] rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

          <div className="relative z-[1] space-y-2">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0 flex-1">
                <span className={`${cfg.company} block truncate`}>
                  {card.company || "ANSH Ecosystem"}
                </span>
                {card.companyTagline ? (
                  <span className={`${cfg.tagline} block mt-1.5 line-clamp-2`}>
                    {card.companyTagline}
                  </span>
                ) : null}
              </div>
              <span className={`${cfg.badge} shrink-0`}>{card.theme}</span>
            </div>
          </div>

          <div className={`relative ${cfg.divider} z-[1]`} />

          <div className="relative flex justify-between items-end gap-4 z-[1]">
            <div className="min-w-0 space-y-1.5 flex-1 pr-2">
              <span className={`${cfg.name} block truncate`}>{card.cardName}</span>
              <span className={`${cfg.sub} block truncate`}>{card.jobTitle}</span>
            </div>
            {card.companyLogo ? (
              <CompanyLogoMark
                logoUrl={card.companyLogo}
                company={card.company}
                large={isHero}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <span className={labelClass}>Back</span>
        <div
          ref={backRef}
          onMouseMove={onBackMouseMove}
          onMouseLeave={onBackMouseLeave}
          style={backStyle}
          className={cardShell}
        >
          <div className={`absolute inset-0 pointer-events-none ${cfg.shine}`} />

          <div className="relative flex justify-between items-stretch h-full gap-5 z-[1]">
            <div className="flex flex-col justify-between min-w-0 flex-1 gap-4">
              <div className="space-y-3">
                {card.phone && (
                  <ContactRow
                    icon={Phone}
                    value={card.phone}
                    iconClass={cfg.contactIcon}
                    textClass={cfg.contactText}
                    rowClass={cfg.contactRow}
                  />
                )}
                {card.email && (
                  <ContactRow
                    icon={Mail}
                    value={card.email}
                    iconClass={cfg.contactIcon}
                    textClass={cfg.contactText}
                    rowClass={cfg.contactRow}
                  />
                )}
              </div>

              {cardSocialLinks.length > 0 && (
                <div className="flex gap-2.5 flex-wrap">
                  {cardSocialLinks.slice(0, 4).map((sLink) => {
                    const preset = PLATFORM_PRESETS.find((p) => p.value === sLink.platform);
                    const IconComponent = preset ? (Icons as any)[preset.iconName] : Globe;
                    const SocialIcon = IconComponent || Globe;
                    return (
                      <div
                        key={sLink.id}
                        className={`w-9 h-9 flex items-center justify-center ${cfg.contactRow}`}
                        title={sLink.platform}
                      >
                        <SocialIcon className="w-4 h-4" />
                      </div>
                    );
                  })}
                </div>
              )}

              {card.website && (
                <ContactRow
                  icon={Globe}
                  value={card.website.replace(/(^\w+:|^)\/\//, "")}
                  iconClass={cfg.contactIcon}
                  textClass={`${cfg.contactText} opacity-90`}
                  rowClass={cfg.contactRow}
                />
              )}
            </div>

            <div className="flex flex-col items-center justify-between shrink-0 gap-2">
              <div className={`p-2 rounded-xl ${cfg.qrBg}`}>
                <CardQrCode value={qrTarget} size={qrSize} className="!bg-transparent !p-0" />
              </div>
              <span className={`card-type-qr-label opacity-55 text-center max-w-[88px] leading-snug ${cfg.contactIcon}`}>
                {card.qrLink ? "Custom link" : "Scan to view"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
