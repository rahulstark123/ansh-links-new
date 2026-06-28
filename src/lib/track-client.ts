"use client";

export const TRAFFIC_ACTIONS = {
  PROFILE_VIEW: "profile_view",
  LINK_CLICK: "link_click",
  UPI_PAY: "upi_pay",
  WHATSAPP_CHAT: "whatsapp_chat",
  PRODUCT_CLICK: "product_click",
  SOCIAL_CLICK: "social_click",
} as const;

const SESSION_KEY = "ansh_links_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function detectDevice(): "mobile" | "desktop" | "tablet" {
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod/i.test(ua)) return "mobile";
  return "desktop";
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) return "Safari";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  return "Unknown";
}

export function trackAnalyticsEvent(payload: {
  username: string;
  action: string;
  details?: string;
  linkId?: string;
}) {
  const body = {
    ...payload,
    sessionId: getSessionId(),
    referrer: document.referrer || "direct",
    userAgent: navigator.userAgent,
    device: detectDevice(),
    browser: detectBrowser(),
  };

  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // Non-blocking analytics
  });
}
