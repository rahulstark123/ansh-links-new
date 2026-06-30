"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Key, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [ready, setReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setCheckingSession(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true);
      }
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isMinLength = password.length >= 8;
  const isPasswordMatch = password === confirmPassword;
  const canSubmit = ready && isMinLength && isPasswordMatch && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      await supabase.auth.signOut();
      router.push("/login?reset=success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update password.";
      setErrorMsg(message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 text-white relative flex-col justify-between p-16 overflow-hidden border-r border-slate-900 bg-gradient-to-br from-slate-900 via-slate-950 to-black">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-slate-950 to-purple-950/30 pointer-events-none" />

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
            New Credentials
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Choose a strong new password.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            Use at least 8 characters. You&apos;ll sign in again with your updated password.
          </p>
        </div>

        <div className="relative z-10" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Set new password
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium font-sans">
              Enter and confirm your new password below.
            </p>
          </div>

          {checkingSession ? (
            <p className="text-sm text-slate-400 font-medium animate-pulse">Verifying reset link...</p>
          ) : !ready ? (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-2xl">
                This reset link is invalid or has expired. Request a new one to continue.
              </div>
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-1.5 text-sm font-black text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Request new reset link
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
                  New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="premium-input-large text-xs !pl-14 pr-12 w-full"
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-2 font-sans">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="premium-input-large text-xs !pl-14 pr-12 w-full"
                    placeholder="Repeat new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && !isPasswordMatch && (
                  <p className="text-[11px] text-rose-500 font-bold mt-2">Passwords do not match.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="w-full py-4 rounded-2xl font-black text-white primary-gradient shadow-lg shadow-indigo-600/10 hover:scale-[0.99] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center text-xs cursor-pointer"
              >
                {loading ? "Updating..." : "Update Password"}
                {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
