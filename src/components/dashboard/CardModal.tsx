"use client";

import { useState, useEffect } from "react";
import { useProfileStore, DigitalCard } from "@/store/useProfileStore";
import { X, CreditCard, Check } from "lucide-react";
import { createPortal } from "react-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardToEdit?: DigitalCard | null;
}

const THEME_OPTIONS = [
  { value: "noir", label: "Midnight Noir", description: "Executive deep dark theme" },
  { value: "gold", label: "Golden Minimalist", description: "Luxury golden champagne theme" },
  { value: "neon", label: "Cyber Neon", description: "Vibrant high-contrast neon theme" },
  { value: "glass", label: "Glassmorphic Tech", description: "Translucent aesthetic blur theme" },
  { value: "retro", label: "Retro Matrix", description: "Nostalgic monospace green cyber theme" },
  { value: "aurora", label: "Aurora Glow", description: "Vibrant glowing aurora radial gradient" },
  { value: "editorial", label: "Editorial Serif", description: "Sophisticated print paper serif layout" },
  { value: "brutalist", label: "Neo Brutalist", description: "High-contrast stark raw editorial grid" },
  { value: "solarized", label: "Solarized Architect", description: "Sandy warmth with deep indigo ink" },
  { value: "parchment", label: "Vintage Parchment", description: "Textured paper look with classic typewriter serif" },
  { value: "terracotta", label: "Warm Terracotta", description: "Clay background with retro organic layouts" },
] as const;

export default function CardModal({ isOpen, onClose, cardToEdit }: CardModalProps) {
  const { addCard, updateCard } = useProfileStore();

  const [cardName, setCardName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [companyTagline, setCompanyTagline] = useState("");
  const [phone, setPhone] = useState<string | undefined>("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("https://");
  const [qrLink, setQrLink] = useState("");
  const [theme, setTheme] = useState<"noir" | "gold" | "neon" | "glass" | "retro" | "aurora" | "editorial" | "brutalist" | "solarized" | "parchment" | "terracotta">("noir");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (cardToEdit) {
      setCardName(cardToEdit.cardName);
      setJobTitle(cardToEdit.jobTitle);
      setCompany(cardToEdit.company);
      setCompanyTagline(cardToEdit.companyTagline || "");
      setPhone(cardToEdit.phone || "");
      setEmail(cardToEdit.email);
      setWebsite(cardToEdit.website);
      setQrLink(cardToEdit.qrLink || "");
      setTheme(cardToEdit.theme as any);
    } else {
      setCardName("");
      setJobTitle("");
      setCompany("");
      setCompanyTagline("");
      setPhone("");
      setEmail("");
      setWebsite("https://");
      setQrLink("");
      setTheme("noir");
    }
  }, [cardToEdit, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSave = () => {
    if (!cardName.trim() || !jobTitle.trim()) return;

    const cardData = {
      cardName: cardName.trim(),
      jobTitle: jobTitle.trim(),
      company: company.trim(),
      companyTagline: companyTagline.trim(),
      phone: phone ? phone.trim() : "",
      email: email.trim(),
      website: website.trim(),
      theme,
      qrLink: qrLink.trim(),
      active: cardToEdit ? cardToEdit.active : true,
    };

    if (cardToEdit) {
      updateCard(cardToEdit.id, cardData);
    } else {
      addCard(cardData);
    }
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      
      {/* Modal Card */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300">
        
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-outline-variant/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg primary-gradient flex items-center justify-center text-white">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black tracking-tight font-sans">
              {cardToEdit ? "Modify Digital Card" : "Create Digital Card"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          
          {/* Card Holder Name */}
          <div>
            <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5 font-sans">
              Full Name
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="premium-input-large font-sans"
              placeholder="e.g. Ansh Kumar"
              required
            />
          </div>

          {/* Job Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5 font-sans">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="premium-input-large font-sans"
                placeholder="e.g. Lead Designer"
                required
              />
            </div>
            <div>
              <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5 font-sans">
                Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="premium-input-large font-sans"
                placeholder="e.g. ANSH Apps"
              />
            </div>
          </div>

          {/* Company Tagline */}
          <div>
            <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5 font-sans">
              Company Tagline
            </label>
            <input
              type="text"
              value={companyTagline}
              onChange={(e) => setCompanyTagline(e.target.value)}
              className="premium-input-large font-sans"
              placeholder="e.g. Building the future of digital identity"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5 font-sans">
                Mobile Number
              </label>
              <PhoneInput
                defaultCountry="IN"
                placeholder="Enter phone number"
                value={phone}
                onChange={setPhone}
                className="font-sans"
              />
            </div>
            <div>
              <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5 font-sans">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-input-large font-sans"
                placeholder="e.g. name@company.com"
              />
            </div>
          </div>

          {/* Website Link */}
          <div>
            <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5 font-sans">
              Website URL
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="premium-input-large font-sans"
              placeholder="https://company.com"
            />
          </div>

          {/* Embed QR Code Link */}
          <div>
            <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5 font-sans">
              Embed Custom QR Code Link (e.g. CV, Resume, Portfolio)
            </label>
            <input
              type="url"
              value={qrLink}
              onChange={(e) => setQrLink(e.target.value)}
              className="premium-input-large font-sans"
              placeholder="https://drive.google.com/your-cv-link"
            />
            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-bold mt-1">
              If provided, scanning the QR Code on the back of this card will direct scanners to this URL instead of your profile page.
            </p>
          </div>

          {/* Card Style Theme Selectors */}
          <div>
            <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-2 font-sans">
              Select Luxury Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={`p-3.5 rounded-2xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                    theme === opt.value
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 shadow-sm"
                      : "border-outline-variant/10 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-black">{opt.label}</span>
                    <span className="text-[9px] font-normal text-slate-400 leading-none mt-0.5">{opt.description}</span>
                  </div>
                  {theme === opt.value && <Check className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="h-20 flex items-center justify-end px-6 gap-3 border-t border-outline-variant/5 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-outline-variant/10 hover:bg-slate-100 text-xs font-bold font-sans transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!cardName.trim() || !jobTitle.trim()}
            className="px-6 py-2.5 rounded-xl text-white primary-gradient text-xs font-bold font-sans shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:pointer-events-none"
          >
            Save Card
          </button>
        </div>

      </div>

    </div>,
    document.body
  );
}
