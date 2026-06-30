"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Mail, Sparkles, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset email.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 text-white relative flex-col justify-between p-16 overflow-hidden border-r border-slate-900 bg-gradient-to-br from-slate-900 via-slate-950 to-black">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-slate-950 to-purple-950/30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-white border border-white/10 flex items-center justify-center shadow-lg overflow-hidden p-1">
              <img src="/logoAnshapps.png" alt="ANSH Apps Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-sm tracking-tight text-white uppercase font-sans">
              ANSH Links
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md space-y-6 my-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Account Recovery
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Reset your password securely.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            We&apos;ll email you a secure link to choose a new password and get back into your dashboard.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-400 font-bold">
          Links expire after a short time for your security.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="space-y-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>

            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Forgot password?
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium font-sans">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>
          </div>

          {sent ? (
            <div className="space-y-6">
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  Check your inbox
                </p>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 font-medium leading-relaxed">
                  If an account exists for <strong>{email}</strong>, we sent a password reset link. Check spam if you don&apos;t see it within a few minutes.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-black text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Return to sign in
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-2xl">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="text-[11px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-2 font-sans">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="premium-input-large text-xs !pl-14 w-full"
                    placeholder="e.g. name@anshapps.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-white primary-gradient shadow-lg shadow-indigo-600/10 hover:scale-[0.99] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center text-xs cursor-pointer"
              >
                {loading ? "Sending..." : "Send Reset Link"}
                {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
