import { DigitalCard } from "@/store/useProfileStore";

export function getAppOrigin() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL || "https://ansh.links";
}

export function getCardPublicPath(username: string, cardId: string) {
  return `/${username}/card/${cardId}`;
}

export function getCardPublicUrl(username: string, cardId: string, origin?: string) {
  const base = (origin ?? getAppOrigin()).replace(/\/$/, "");
  return `${base}${getCardPublicPath(username, cardId)}`;
}

/** URL encoded in the QR — custom link if set, otherwise the card's public share page. */
export function getCardQrTargetUrl(card: DigitalCard, username: string, origin?: string) {
  const custom = card.qrLink?.trim();
  if (custom) return custom;
  return getCardPublicUrl(username, card.id, origin);
}
