"use client";

import { useProfileStore } from "@/store/useProfileStore";
import {
  User,
  CreditCard,
  Shield,
  Check,
  Lock,
  Sparkles,
  Key,
  Pencil,
  ExternalLink,
  Link2,
  CheckCircle2,
  Copy,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import ProfileEditModal from "./ProfileEditModal";
import Link from "next/link";

interface SettingsPanelProps {
  subTab: "profile" | "billing" | "security";
}

export default function SettingsPanel({ subTab }: SettingsPanelProps) {
  const { profile, updateProfileInfo } = useProfileStore();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Billing states
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro" | "pro-plus">("free");
  const [billingSuccess, setBillingSuccess] = useState(false);
  const [isIndia, setIsIndia] = useState(false);
  const [loadingGeo, setLoadingGeo] = useState(true);
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.country_code === "IN" || data.country === "India") {
          setIsIndia(true);
        } else {
          setIsIndia(false);
        }
      })
      .catch((err) => {
        console.error("Geo-IP check failed, using timezone fallback:", err);
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (
          tz.toLowerCase().includes("kolkata") ||
          tz.toLowerCase().includes("calcutta") ||
          tz.toLowerCase().includes("india")
        ) {
          setIsIndia(true);
        } else {
          setIsIndia(false);
        }
      })
      .finally(() => {
        setLoadingGeo(false);
      });
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlanUpgrade = async (plan: "free" | "pro" | "pro-plus") => {
    if (plan === "free") {
      setSelectedPlan("free");
      updateProfileInfo({ verified: false });
      return;
    }

    setLoadingUpgrade(true);
    const amount = plan === "pro" 
      ? (isIndia ? 199 : 5) 
      : (isIndia ? 399 : 7);
    const currency = isIndia ? "INR" : "USD";

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay payment gateway SDK failed to load. Please check your network connection.");
        setLoadingUpgrade(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_SdilED7xPbKcdV",
        amount: amount * 100, // amount in paisa (INR) or cents (USD)
        currency: currency,
        name: "ANSH Links",
        description: `Upgrade to ANSH Links ${plan === "pro" ? "Pro" : "Pro Plus"} Plan`,
        image: "/logoAnshapps.png",
        handler: function (response: any) {
          setSelectedPlan(plan);
          updateProfileInfo({ verified: true });
          setBillingSuccess(true);
          setTimeout(() => setBillingSuccess(false), 3000);
        },
        prefill: {
          name: profile.name || "",
          email: "billing@anshapps.com",
          contact: profile.whatsappNumber || "",
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert("An error occurred launching the billing portal. Please try again.");
    } finally {
      setLoadingUpgrade(false);
    }
  };

  const profileUrl = `ansh.links/${profile.username || "username"}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${profileUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return;

    setPasswordSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSuccess(false), 2000);
  };

  return (
    <div className="p-8 sm:p-10 space-y-8 max-w-4xl mx-auto animate-fadeIn font-sans">
      {subTab === "profile" && (
        <div className="space-y-6">
          {/* Profile Hero Card */}
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl shadow-sm transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className="relative p-8 sm:p-10">
              <div className="flex items-start justify-between mb-8">
                <div className="space-y-1">
                  <h3 className="font-black text-lg flex items-center gap-2.5 text-indigo-700 dark:text-indigo-400">
                    <User className="w-5 h-5" />
                    Profile Identity
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Your public profile card — how visitors see you on ANSH Links.
                  </p>
                </div>
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/40 transition-all cursor-pointer shrink-0 animate-fadeIn"
                  aria-label="Edit profile"
                >
                  <Pencil className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span className="text-xs font-black hidden sm:inline">Edit Profile</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                <div className="relative shrink-0">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-xl shadow-indigo-500/10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(profile.name || "User") +
                          "&background=4F46E5&color=fff&size=128";
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl primary-gradient flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-500/20 ring-4 ring-white dark:ring-slate-800">
                      {(profile.name || "A").charAt(0).toUpperCase()}
                    </div>
                  )}
                  {profile.verified && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h2 className="text-2xl font-black tracking-tight truncate text-slate-800 dark:text-slate-100">
                      {profile.name || "Your Name"}
                    </h2>
                    {profile.verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider shrink-0">
                        <Sparkles className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-indigo-650 dark:text-indigo-400 mb-3">
                    @{profile.username || "username"}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md font-medium">
                    {profile.bio || "No bio added yet. Click the edit button to tell the world about yourself."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Public URL</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs font-bold text-slate-700 dark:text-slate-300 truncate bg-slate-50 dark:bg-slate-950/50 px-3 py-2 rounded-xl">
                  {profileUrl}
                </code>
                <button
                  onClick={handleCopyUrl}
                  className="w-9 h-9 rounded-xl border border-outline-variant/10 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-colors cursor-pointer shrink-0"
                  aria-label="Copy URL"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-505" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-550/10 dark:bg-emerald-950/40 flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Live Preview</span>
              </div>
              <Link
                href={`/${profile.username || "ansh"}`}
                target="_blank"
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-650 dark:text-indigo-400 hover:underline"
              >
                View your public page
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <p className="text-xs text-slate-400 mt-1 font-medium">See exactly what visitors experience</p>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Bio Links", value: profile.links?.length ?? 0 },
              { label: "Social Links", value: profile.socialLinks?.length ?? 0 },
              { label: "Theme Preset", value: profile.theme.charAt(0).toUpperCase() + profile.theme.slice(1) },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-2xl p-4 text-center shadow-sm"
              >
                <p className="text-lg font-black text-indigo-650 dark:text-indigo-400">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <ProfileEditModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            profile={profile}
            onSave={updateProfileInfo}
          />
        </div>
      )}

      {subTab === "billing" && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 shadow-sm space-y-6 transition-colors duration-300">
            <div className="flex justify-between items-start pb-4 border-b border-outline-variant/5">
              <div className="space-y-1">
                <h3 className="font-black text-base flex items-center gap-2.5 text-indigo-700 dark:text-indigo-400">
                  <CreditCard className="w-5.5 h-5.5" />
                  Billing & Plans
                </h3>
                <p className="text-xs text-slate-400">
                  Upgrade your features, check pricing models, or manage subscriptions.
                </p>
              </div>

              {billingSuccess && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-[10px] font-black uppercase tracking-wider animate-fadeIn">
                  Plan Upgraded!
                </div>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/45 p-6 border border-outline-variant/5 rounded-3xl flex flex-col sm:flex-row justify-between sm:items-center gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">Your Active Tier</span>
                <span className="text-lg font-black block mt-1.5 capitalize text-indigo-650 dark:text-indigo-400">
                  ANSH Links {selectedPlan === "free" ? "Free" : selectedPlan === "pro" ? "Pro" : "Pro Plus"} Plan
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  {selectedPlan === "free" && "Limited redirect rules and social link cards."}
                  {selectedPlan === "pro" && "Unlimited redirect rules, all themes, and verified badge."}
                  {selectedPlan === "pro-plus" && "Unlimited Double-Sided Business Cards, featured storefront storefront, and priority support."}
                </span>
              </div>

              <div className="space-y-1 sm:text-right shrink-0">
                <span className="text-xs font-black block text-slate-800 dark:text-slate-200">
                  {selectedPlan === "free" && (isIndia ? "₹0.00 / month" : "$0.00 / month")}
                  {selectedPlan === "pro" && (isIndia ? "₹199 / month" : "$5.00 / month")}
                  {selectedPlan === "pro-plus" && (isIndia ? "₹399 / month" : "$7.00 / month")}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">Auto-renewal billing monthly</span>
              </div>
            </div>
          </div>

          {loadingGeo ? (
            <div className="text-center py-12 text-slate-400 animate-pulse font-sans font-bold text-xs">
              Detecting pricing parameters for your country...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* FREE PLAN */}
              <div className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all ${
                selectedPlan === "free" ? "border-indigo-600 ring-2 ring-indigo-500/10 scale-[1.01]" : "border-outline-variant/10"
              }`}>
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">Free Plan</span>
                  <h4 className="text-xl font-black block mt-1.5">{isIndia ? "₹0" : "$0.00"}</h4>
                  <p className="text-xs text-slate-400 font-medium">Perfect for simple bio link pages and basic redirect rules.</p>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                  <ul className="space-y-2 text-xs font-bold text-slate-500">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Up to 5 Redirect path links</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Organic Minimal theme</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Basic visitor traffic summary</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handlePlanUpgrade("free")}
                  disabled={selectedPlan === "free" || loadingUpgrade}
                  className="w-full mt-6 py-3 rounded-xl border border-outline-variant/10 text-xs font-black hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  {selectedPlan === "free" ? "Current Plan" : "Choose Free"}
                </button>
              </div>

              {/* PRO PLAN */}
              <div className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all relative ${
                selectedPlan === "pro" ? "border-indigo-600 ring-2 ring-indigo-500/10 scale-[1.01]" : "border-outline-variant/10"
              }`}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Creator Pick
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block leading-none mt-2">Pro Plan</span>
                  <h4 className="text-xl font-black block mt-1.5">{isIndia ? "₹199" : "$5.00"}<span className="text-xs text-slate-400 font-medium">/mo</span></h4>
                  <p className="text-xs text-slate-400 font-medium">Ideal for content creators, authors, and professionals needing brand style.</p>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                  <ul className="space-y-2 text-xs font-bold text-slate-500">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Unlimited Bio Redirect links</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>All 5 Premium editor themes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Verified Profile Badges</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Advanced analytics reporting</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handlePlanUpgrade("pro")}
                  disabled={selectedPlan === "pro" || loadingUpgrade}
                  className="w-full mt-6 py-3 rounded-xl text-white primary-gradient text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {selectedPlan === "pro" ? "Current Plan" : loadingUpgrade ? "Loading..." : `Upgrade for ${isIndia ? "₹199" : "$5"}`}
                </button>
              </div>

              {/* PRO PLUS PLAN */}
              <div className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all ${
                selectedPlan === "pro-plus" ? "border-indigo-600 ring-2 ring-indigo-500/10 scale-[1.01]" : "border-outline-variant/10"
              }`}>
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-405 uppercase tracking-widest block leading-none">Pro Plus Plan</span>
                  <h4 className="text-xl font-black block mt-1.5">{isIndia ? "₹399" : "$7.00"}<span className="text-xs text-slate-400 font-medium">/mo</span></h4>
                  <p className="text-xs text-slate-405 font-medium">For power sellers, agencies, and teams seeking digital business cards.</p>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                  <ul className="space-y-2 text-xs font-bold text-slate-500">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Everything in Pro Plan tier</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Unlimited Business Cards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Storefront storefront (0% fee)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Premium priority support</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => handlePlanUpgrade("pro-plus")}
                  disabled={selectedPlan === "pro-plus" || loadingUpgrade}
                  className="w-full mt-6 py-3 rounded-xl border border-outline-variant/10 text-xs font-black hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-slate-800 dark:text-slate-200"
                >
                  {selectedPlan === "pro-plus" ? "Current Plan" : loadingUpgrade ? "Loading..." : `Upgrade for ${isIndia ? "₹399" : "$7"}`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {subTab === "security" && (
        <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 shadow-sm space-y-6 transition-colors duration-300">
          <div className="pb-4 border-b border-outline-variant/5 flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="font-black text-base flex items-center gap-2.5 text-indigo-700 dark:text-indigo-400">
                <Shield className="w-5.5 h-5.5" />
                Account Credentials
              </h3>
              <p className="text-xs text-slate-400">
                Update account passwords or toggle security check parameters.
              </p>
            </div>

            {passwordSuccess && (
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-[10px] font-black uppercase tracking-wider animate-fadeIn">
                Password updated!
              </div>
            )}
          </div>

          <form onSubmit={handlePasswordReset} className="space-y-5 max-w-md">
            <div>
              <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5">
                Current Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                </span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="premium-input-large text-xs pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5">
                New Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <Key className="w-3.5 h-3.5" />
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="premium-input-large text-xs pl-10"
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1.5">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <Key className="w-3.5 h-3.5" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="premium-input-large text-xs pl-10"
                  placeholder="Repeat new password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-white primary-gradient text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-transform cursor-pointer"
            >
              Update Credentials
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
