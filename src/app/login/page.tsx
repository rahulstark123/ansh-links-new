"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link2, Eye, EyeOff, Sparkles, Check, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AuthLoadingOverlay from "@/components/common/AuthLoadingOverlay";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "success") {
      setResetSuccess(true);
    }
  }, []);

  const isAuthenticating = loading || googleLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Invalid email or password.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Google Sign-In failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {isAuthenticating && (
        <AuthLoadingOverlay
          message="Signing you in"
          submessage="Welcome back to your digital sanctuary"
        />
      )}
      
      {/* LEFT SIDE: Premium Branding/Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 text-white relative flex-col justify-between p-16 overflow-hidden border-r border-slate-900 bg-gradient-to-br from-slate-900 via-slate-950 to-black">
        {/* Animated Mesh Gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-slate-950 to-purple-950/30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

        {/* Top Header */}
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

        {/* Mid Showcase Feature Card */}
        <div className="relative z-10 max-w-md space-y-8 my-auto">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Creator Space v1.2
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Your entire digital presence, beautifully organized.
            </h2>
            <p className="text-sm text-slate-405 leading-relaxed font-medium">
              Create gorgeous pages, connect custom redirect links, manage luxury business cards, and showcase storefront products in minutes.
            </p>
          </div>

          <div className="space-y-3.5 bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 text-xs font-bold text-slate-200">
              <div className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Custom Bio Links & Redirect Paths</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-200">
              <div className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Double-Sided Digital Business Cards</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-200">
              <div className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Featured Storefront Digital Goods</span>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof tag */}
        <div className="relative z-10 flex items-center gap-3 border-t border-slate-900 pt-6">
          <span className="text-xs text-slate-400 font-bold">
            🚀 Over <strong className="text-white font-extrabold">10,000+ creators</strong> trust Ansh Links.
          </span>
        </div>
      </div>

      {/* RIGHT SIDE: Centered Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Logo only visible on mobile */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            <Link href="/" className="flex items-center gap-2 group lg:hidden">
              <div className="w-12 h-12 rounded-xl bg-white border border-outline-variant/10 flex items-center justify-center shadow-lg overflow-hidden p-1">
                <img src="/logoAnshapps.png" alt="ANSH Apps Logo" className="w-full h-full object-contain" />
              </div>
            </Link>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Welcome Back</h1>
              <p className="text-sm text-slate-505 dark:text-slate-400 font-medium font-sans">
                Sign in to manage your digital sanctuary
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isAuthenticating}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-205 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-705 dark:text-slate-300 transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative px-3 bg-slate-50 dark:bg-slate-950 text-[10px] font-black uppercase text-slate-400">
                or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {resetSuccess && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-2xl">
                Password updated successfully. Sign in with your new password.
              </div>
            )}
            {errorMsg && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-455 text-xs font-bold rounded-2xl">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="text-[11px] font-black tracking-wider text-slate-550 dark:text-slate-400 uppercase block mb-2 font-sans">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-input-large"
                placeholder="e.g. name@anshapps.com"
              />
            </div>

            <div>
              <label className="text-[11px] font-black tracking-wider text-slate-550 dark:text-slate-400 uppercase block mb-2 font-sans">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="premium-input-large pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-650"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-4 rounded-2xl font-black text-white primary-gradient shadow-lg shadow-indigo-600/10 hover:scale-[0.99] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center text-xs cursor-pointer"
            >
              Sign In to Dashboard
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </form>

          <div className="pt-6 border-t border-outline-variant/10 text-center lg:text-left text-sm text-slate-550 dark:text-slate-400 font-sans font-medium">
            Don't have a profile?{" "}
            <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline">
              Create one free
            </Link>
          </div>
        </div>
      </div>

    </main>
  );
}
