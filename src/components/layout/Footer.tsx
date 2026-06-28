"use client";

import Link from "next/link";
import { Link2, Mail } from "lucide-react";

const productLinks = [
  { label: "Bio Links", href: "/#features" },
  { label: "Digital Cards", href: "/#cards" },
  { label: "Themes", href: "/#themes" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Live Demo", href: "/ansh" },
  { label: "Analytics", href: "/dashboard" },
];

const accountLinks = [
  { label: "Sign In", href: "/login" },
  { label: "Sign Up", href: "/signup" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Support Desk", href: "mailto:hello@anshapps.com" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact Us", href: "mailto:hello@anshapps.com" },
];

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-slate-50 dark:bg-slate-950 border-t border-outline-variant/10">
      {/* Large Brand Banner */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Handled by
          </span>
          <img
            src="/logoAnshapps.png"
            alt="ANSH Logo"
            className="w-5 h-5 object-contain"
          />
        </div>
        <h2
          className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem] font-black tracking-tight leading-none select-none uppercase"
          style={{
            background: "linear-gradient(90deg, #38bdf8 0%, #6366f1 45%, #a855f7 75%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ANSH APPS
        </h2>
      </div>

      {/* Four-Column Links */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/logoAnshapps.png"
                alt="ANSH Logo"
                className="w-7 h-7 object-contain shrink-0"
              />
              <span className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-100">
                ANSH Links
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              The ultimate link-in-bio canvas designed for creators who ship content, manage digital identity, and grow their audience daily.
            </p>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
              Product
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Column */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
              Account
            </h4>
            <ul className="space-y-2.5">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch Column */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
              Get In Touch
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Have questions or need custom business plans? Talk to our creators.
            </p>
            <a
              href="mailto:hello@anshapps.com"
              className="inline-flex items-center gap-2 text-xs font-bold text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              hello@anshapps.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-slate-400 font-medium">
            © {new Date().getFullYear()} ANSH Links. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
