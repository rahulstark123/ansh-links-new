"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Link2 } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/10">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 sm:px-8 h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logoAnshapps.png"
            alt="ANSH Logo"
            className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform duration-300"
          />
          <span className="text-xl font-black tracking-tight text-indigo-700 dark:text-indigo-400">
            ANSH <span className="font-light text-slate-500 dark:text-slate-400">Links</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#features"
            className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="/#themes"
            className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            Themes
          </Link>
          <Link
            href="/#cards"
            className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            Cards
          </Link>
          <Link
            href="/#pricing"
            className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            Dashboard
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/login"
            className="text-slate-600 dark:text-slate-300 font-semibold px-4 py-2 hover:opacity-80 transition-opacity"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-950 border-b border-outline-variant/10 shadow-lg px-6 py-8 flex flex-col gap-6 animate-fadeIn">
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-600 dark:text-slate-400 font-semibold text-lg hover:text-indigo-600"
          >
            Features
          </Link>
          <Link
            href="/#themes"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-600 dark:text-slate-400 font-semibold text-lg hover:text-indigo-600"
          >
            Themes
          </Link>
          <Link
            href="/#cards"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-600 dark:text-slate-400 font-semibold text-lg hover:text-indigo-600"
          >
            Cards
          </Link>
          <Link
            href="/#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-600 dark:text-slate-400 font-semibold text-lg hover:text-indigo-600"
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-600 dark:text-slate-400 font-semibold text-lg hover:text-indigo-600"
          >
            Dashboard
          </Link>
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
          <div className="flex flex-col gap-4">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-slate-600 dark:text-slate-300 font-semibold py-2 hover:opacity-80"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
