export const TRAFFIC_ACTIONS = {
  PROFILE_VIEW: "profile_view",
  LINK_CLICK: "link_click",
  UPI_PAY: "upi_pay",
  WHATSAPP_CHAT: "whatsapp_chat",
  PRODUCT_CLICK: "product_click",
  SOCIAL_CLICK: "social_click",
} as const;

export type TrafficAction = (typeof TRAFFIC_ACTIONS)[keyof typeof TRAFFIC_ACTIONS];

export const ACTION_LABELS: Record<string, string> = {
  profile_view: "Profile View",
  link_click: "Link Click",
  upi_pay: "UPI Pay Trigger",
  whatsapp_chat: "WhatsApp Chat",
  product_click: "Link Click",
  social_click: "Link Click",
};

const REFERRER_COLORS: Record<string, string> = {
  LinkedIn: "#0A66C2",
  Direct: "#4F46E5",
  WhatsApp: "#25D366",
  "Twitter / X": "#000000",
  GitHub: "#24292F",
  Instagram: "#E4405F",
  Facebook: "#1877F2",
  Google: "#4285F4",
  Other: "#64748B",
};

const COUNTRY_NAMES: Record<string, string> = {
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  DE: "Germany",
  JP: "Japan",
  CA: "Canada",
  AU: "Australia",
  FR: "France",
  BR: "Brazil",
  SG: "Singapore",
};

export function countryCodeToFlag(code?: string | null): string {
  if (!code || code.length !== 2) return "🌍";
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...upper.split("").map((char) => 127397 + char.charCodeAt(0))
  );
}

export function countryCodeToName(code?: string | null): string {
  if (!code) return "Unknown";
  return COUNTRY_NAMES[code.toUpperCase()] || code.toUpperCase();
}

export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || null;
  }
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    null
  );
}

export function getCountryFromHeaders(request: Request): {
  countryCode: string | null;
  country: string | null;
} {
  const code =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country-code") ||
    null;

  if (!code || code === "XX") {
    return { countryCode: null, country: null };
  }

  const upper = code.toUpperCase();
  return {
    countryCode: upper,
    country: countryCodeToName(upper),
  };
}

export function parseUserAgent(userAgent?: string | null): {
  browser: string;
  device: "mobile" | "desktop" | "tablet";
} {
  const ua = userAgent || "";

  let device: "mobile" | "desktop" | "tablet" = "desktop";
  if (/tablet|ipad/i.test(ua)) device = "tablet";
  else if (/mobile|android|iphone|ipod/i.test(ua)) device = "mobile";

  let browser = "Unknown";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = "Safari";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/opera|opr\//i.test(ua)) browser = "Opera";

  return { browser, device };
}

export function normalizeReferrer(referrer?: string | null): string {
  if (!referrer || referrer === "direct") return "Direct";

  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes("linkedin")) return "LinkedIn";
    if (host.includes("whatsapp") || host.includes("wa.me")) return "WhatsApp";
    if (host.includes("twitter") || host.includes("x.com")) return "Twitter / X";
    if (host.includes("github")) return "GitHub";
    if (host.includes("instagram")) return "Instagram";
    if (host.includes("facebook")) return "Facebook";
    if (host.includes("google")) return "Google";
    return host.replace(/^www\./, "");
  } catch {
    return "Direct";
  }
}

export function getReferrerColor(name: string): string {
  return REFERRER_COLORS[name] || REFERRER_COLORS.Other;
}

export function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}

export function percentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function isClickAction(action: string): boolean {
  return action !== TRAFFIC_ACTIONS.PROFILE_VIEW;
}

export async function resolveProfileByWidOrUsername(
  prisma: { profile: { findFirst: Function } },
  wid?: number | null,
  username?: string | null
) {
  if (wid) {
    return prisma.profile.findFirst({
      where: { wid },
      select: { id: true, wid: true, username: true },
    });
  }

  if (username) {
    return prisma.profile.findFirst({
      where: { username: username.toLowerCase() },
      select: { id: true, wid: true, username: true },
    });
  }

  return null;
}
