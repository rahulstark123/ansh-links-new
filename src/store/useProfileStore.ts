import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  subtitle?: string;
  icon?: string; // name of lucide or material icon
  active: boolean;
  type?: 'default' | 'whatsapp' | 'upi';
}

export interface SocialLink {
  id: string;
  platform: 'website' | 'email' | 'share' | 'github' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'facebook' | string;
  url: string;
  active?: boolean;
}

export interface CustomField {
  id: string;
  key: string;
  value: string;
  icon?: string;
  active?: boolean;
}

export interface DigitalCard {
  id: string;
  cardName: string;
  jobTitle: string;
  company: string;
  companyTagline?: string;
  companyLogo?: string;
  phone: string;
  email: string;
  website: string;
  theme: 'noir' | 'gold' | 'neon' | 'glass' | 'retro' | 'aurora' | 'editorial' | 'brutalist' | 'solarized' | 'parchment' | 'terracotta';
  active: boolean;
  qrLink?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: string;
  currency?: string;
  imageUrl?: string;
  linkUrl?: string;
  active: boolean;
}

export interface IntegrationItem {
  id: string;
  provider: 'stripe' | 'mailchimp' | 'analytics';
  connected: boolean;
  apiKey?: string;
}

export interface ProfileInfo {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  verified: boolean;
  theme: 'organic' | 'saffron' | 'emerald' | 'noir' | 'silk';
  bgStyle: 'flat' | 'dots' | 'mesh';
  links: LinkItem[];
  socialLinks: SocialLink[];
  upiId?: string;
  whatsappNumber?: string;
  hobbies?: string[];
  currentlyExploring?: string;
  quickLinkIds?: string[];
  cards: DigitalCard[];
  products: ProductItem[];
  integrations: IntegrationItem[];
  customFields: CustomField[];
  wid?: number;
  trialEndsAt?: string;
  subscriptionStatus?: "trial" | "active" | "expired";
}

interface ProfileState {
  profile: ProfileInfo;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  updateProfileInfo: (info: Partial<ProfileInfo>) => void;
  addLink: (link: Omit<LinkItem, 'id'> & { id?: string }) => void;
  updateLink: (id: string, updates: Partial<LinkItem>) => void;
  removeLink: (id: string) => void;
  reorderLinks: (newLinks: LinkItem[]) => void;
  toggleLink: (id: string) => void;
  addCard: (card: Omit<DigitalCard, 'id'>) => void;
  updateCard: (id: string, updates: Partial<DigitalCard>) => void;
  removeCard: (id: string) => void;
  addProduct: (product: Omit<ProductItem, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<ProductItem>) => void;
  removeProduct: (id: string) => void;
  updateIntegration: (provider: 'stripe' | 'mailchimp' | 'analytics', updates: Partial<IntegrationItem>) => void;
  resetToDefault: () => void;
  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
  syncWithCloud: () => Promise<void>;
  loadFromCloud: (username: string) => Promise<void>;
}

const DEFAULT_PROFILE: ProfileInfo = {
  name: 'Ansh Kumar',
  username: 'ansh',
  bio: 'Building the future of digital identity. Curator of fine aesthetics & organic minimalism. Founder at ANSH TREE.',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqT4rFFksHBC8kuoflJDQrqOF2rNbdHxZ_ZjYQcDY5h22g9Q7IxKY8M4FlczsG9LAcjHvUfwmRiSJfU8X6UogSgWObI1kIRRdBCpNLFrU3fLXQQE2FIRcTVHEjBVszDPDz-T5r9WbwdeyzMXkoiNPe95WkxzDo7P6wHF4fwKBrB-f3j8ZzFQWD1Z40kA4VuUq94NcT7S_YGkeweZvikknSxyQ3JJ9dtyC_sWBud7OU6BUQkjPrVHw_9Mqm3Dazha8xKvUBkOBgh9HI',
  verified: true,
  theme: 'organic',
  bgStyle: 'mesh',
  upiId: 'ansh@upi',
  whatsappNumber: '+919876543210',
  hobbies: ['📚 Reading', '💻 Coding', '✈️ Traveling', '🎨 Design'],
  currentlyExploring: 'Next.js 16 & Tailwind v4',
  quickLinkIds: [],
  trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  subscriptionStatus: 'trial',
  socialLinks: [
    { id: '1', platform: 'website', url: 'https://anshapps.com', active: true },
    { id: '2', platform: 'email', url: 'mailto:ansh@anshapps.com', active: true },
    { id: '3', platform: 'linkedin', url: 'https://linkedin.com', active: true },
  ],
  links: [
    {
      id: 'l1',
      title: 'ANSH TREE Platform',
      subtitle: 'Centralized digital sanctuary',
      url: 'https://anshapps.com/tree',
      icon: 'Network',
      active: true,
    },
    {
      id: 'l2',
      title: 'Design Portfolio',
      subtitle: 'Editorial and UI explorations',
      url: 'https://anshapps.com/portfolio',
      icon: 'Palette',
      active: true,
    },
    {
      id: 'l3',
      title: 'Reading List',
      subtitle: 'Curated books on tech & philosophy',
      url: 'https://anshapps.com/reading',
      icon: 'BookOpen',
      active: true,
    },
  ],
  cards: [
    {
      id: 'c1',
      cardName: 'Ansh Kumar',
      jobTitle: 'Founder & CEO',
      company: 'ANSH Apps Suite',
      phone: '+91 98765 43210',
      email: 'ansh@anshapps.com',
      website: 'https://anshapps.com',
      theme: 'gold',
      active: true,
    }
  ],
  products: [
    {
      id: 'p1',
      name: 'Minimalist Resume Template',
      price: '19.00',
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&auto=format&fit=crop&q=80',
      linkUrl: 'https://anshapps.com/tree',
      active: true,
    },
    {
      id: 'p2',
      name: 'Next.js Boilerplate Bundle',
      price: '49.00',
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=400&auto=format&fit=crop&q=80',
      linkUrl: 'https://anshapps.com/tree',
      active: true,
    }
  ],
  integrations: [
    { id: 'i1', provider: 'stripe', connected: false },
    { id: 'i2', provider: 'mailchimp', connected: false },
    { id: 'i3', provider: 'analytics', connected: false },
  ],
  customFields: []
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      saveStatus: 'idle',

      updateProfileInfo: (info) =>
        set((state) => ({
          profile: { ...state.profile, ...info },
        })),

      addLink: (link) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: [
              ...state.profile.links,
              { ...link, id: link.id || `link-${Date.now()}` },
            ],
          },
        })),

      updateLink: (id, updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.map((link) =>
              link.id === id ? { ...link, ...updates } : link
            ),
          },
        })),

      removeLink: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.filter((link) => link.id !== id),
          },
        })),

      reorderLinks: (newLinks) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: newLinks,
          },
        })),

      toggleLink: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.map((link) =>
              link.id === id ? { ...link, active: !link.active } : link
            ),
          },
        })),

      addCard: (card) =>
        set((state) => ({
          profile: {
            ...state.profile,
            cards: [
              ...(state.profile.cards || []),
              { ...card, id: `card-${Date.now()}` }
            ]
          }
        })),

      updateCard: (id, updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            cards: (state.profile.cards || []).map((c) =>
              c.id === id ? { ...c, ...updates } : c
            )
          }
        })),

      removeCard: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            cards: (state.profile.cards || []).filter((c) => c.id !== id)
          }
        })),

      addProduct: (product) =>
        set((state) => ({
          profile: {
            ...state.profile,
            products: [
              ...(state.profile.products || []),
              { ...product, id: `product-${Date.now()}` }
            ]
          }
        })),

      updateProduct: (id, updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            products: (state.profile.products || []).map((p) =>
              p.id === id ? { ...p, ...updates } : p
            )
          }
        })),

      removeProduct: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            products: (state.profile.products || []).filter((p) => p.id !== id)
          }
        })),

      updateIntegration: (provider, updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            integrations: (state.profile.integrations || []).map((i) =>
              i.provider === provider ? { ...i, ...updates } : i
            )
          }
        })),

      resetToDefault: () =>
        set(() => ({
          profile: DEFAULT_PROFILE,
        })),

      setSaveStatus: (status) => set({ saveStatus: status }),

      syncWithCloud: async () => {
        const state = get();
        const profileData = state.profile;
        if (!profileData.username) return;
        set({ saveStatus: 'saving' });
        try {
          const res = await fetch(`/api/profile/${profileData.username}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
          });
          if (!res.ok) throw new Error('Cloud sync failed');
          const data = await res.json();
          // Merge dynamic data from DB to ensure local state has sync IDs
          set({ profile: data, saveStatus: 'saved' });
          setTimeout(() => {
            if (get().saveStatus === 'saved') {
              set({ saveStatus: 'idle' });
            }
          }, 3000);
        } catch (error) {
          console.error(error);
          set({ saveStatus: 'error' });
        }
      },

      loadFromCloud: async (username) => {
        try {
          const res = await fetch(`/api/profile/${username}`);
          if (res.ok) {
            const data = await res.json();
            set({ profile: data });
          }
        } catch (error) {
          console.error('Failed to load profile from cloud:', error);
        }
      },
    }),
    {
      name: 'ansh-links-profile-store',
    }
  )
);
