import { ProfileInfo } from "@/store/useProfileStore";

/** Static profile used on the marketing landing page — never tied to the live editor store. */
export const LANDING_DEMO_PROFILE: ProfileInfo = {
  name: "Ansh Kumar",
  username: "ansh",
  bio: "Building the future of digital identity. Curator of fine aesthetics & organic minimalism. Founder at ANSH TREE.",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCqT4rFFksHBC8kuoflJDQrqOF2rNbdHxZ_ZjYQcDY5h22g9Q7IxKY8M4FlczsG9LAcjHvUfwmRiSJfU8X6UogSgWObI1kIRRdBCpNLFrU3fLXQQE2FIRcTVHEjBVszDPDz-T5r9WbwdeyzMXkoiNPe95WkxzDo7P6wHF4fwKBrB-f3j8ZzFQWD1Z40kA4VuUq94NcT7S_YGkeweZvikknSxyQ3JJ9dtyC_sWBud7OU6BUQkjPrVHw_9Mqm3Dazha8xKvUBkOBgh9HI",
  verified: true,
  theme: "organic",
  bgStyle: "mesh",
  upiId: "ansh@upi",
  whatsappNumber: "+919876543210",
  hobbies: ["📚 Reading", "💻 Coding", "✈️ Traveling", "🎨 Design"],
  currentlyExploring: "Next.js 16 & Tailwind v4",
  quickLinkIds: [],
  socialLinks: [
    { id: "demo-1", platform: "website", url: "https://anshapps.com", active: true },
    { id: "demo-2", platform: "email", url: "mailto:ansh@anshapps.com", active: true },
    { id: "demo-3", platform: "linkedin", url: "https://linkedin.com", active: true },
  ],
  links: [
    {
      id: "demo-l1",
      title: "ANSH TREE Platform",
      subtitle: "Centralized digital sanctuary",
      url: "https://anshapps.com/tree",
      icon: "Network",
      active: true,
    },
    {
      id: "demo-l2",
      title: "Design Portfolio",
      subtitle: "Editorial and UI explorations",
      url: "https://anshapps.com/portfolio",
      icon: "Palette",
      active: true,
    },
    {
      id: "demo-l3",
      title: "Reading List",
      subtitle: "Curated books on tech & philosophy",
      url: "https://anshapps.com/reading",
      icon: "BookOpen",
      active: true,
    },
  ],
  cards: [],
  products: [],
  integrations: [],
  customFields: [],
};
