import type { ProfileInfo } from "@/store/useProfileStore";

export const MAX_QUICK_LINKS = 3;

export function getQuickLinks(profile: ProfileInfo) {
  return (profile.quickLinkIds || [])
    .map((item) => {
      try {
        if (item.startsWith("{")) {
          return JSON.parse(item);
        }
      } catch (e) {}
      // Fallback: check if it's an ID from profile.links (backward compatibility)
      return profile.links.find((link) => link.id === item && link.active);
    })
    .filter((link): link is NonNullable<typeof link> => Boolean(link));
}

export function buildProfileFillOptions(profile: ProfileInfo) {
  const options: { value: string; label: string; group: string }[] = [];

  if (profile.bio?.trim()) {
    options.push({
      value: "bio",
      label: "Bio → Description",
      group: "Profile",
    });
  }

  if (profile.upiId?.trim()) {
    options.push({
      value: "upi",
      label: "UPI Payment Link",
      group: "Profile",
    });
  }

  if (profile.whatsappNumber?.trim()) {
    options.push({
      value: "whatsapp",
      label: "WhatsApp Chat Link",
      group: "Profile",
    });
  }

  (profile.hobbies || []).forEach((hobby) => {
    options.push({
      value: `hobby:${hobby}`,
      label: `${hobby} → Title`,
      group: "Hobbies",
    });
  });

  return options;
}

export function applyProfileFill(
  value: string,
  profile: ProfileInfo,
  setters: {
    setTitle: (v: string) => void;
    setSubtitle: (v: string) => void;
    setUrl?: (v: string) => void;
  }
) {
  if (!value) return;

  if (value === "bio") {
    setters.setSubtitle(profile.bio.trim());
    return;
  }

  if (value === "upi" && profile.upiId) {
    setters.setTitle("Pay via UPI");
    setters.setSubtitle("Direct UPI payment channel");
    if (setters.setUrl) {
      setters.setUrl(`https://ansh.links/${profile.username}/pay`);
    }
    return;
  }

  if (value === "whatsapp" && profile.whatsappNumber) {
    setters.setTitle("WhatsApp Chat");
    setters.setSubtitle("Chat directly with me");
    if (setters.setUrl) {
      const cleanNum = profile.whatsappNumber.replace(/[^0-9]/g, "");
      setters.setUrl(`https://wa.me/${cleanNum}`);
    }
    return;
  }

  if (value.startsWith("hobby:")) {
    setters.setTitle(value.replace("hobby:", ""));
  }
}
