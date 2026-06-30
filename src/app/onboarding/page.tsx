"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProfileStore } from "@/store/useProfileStore";
import { Sparkles, Phone, ArrowRight, ShieldCheck, Palette, User, Check, ArrowLeft, XCircle } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { supabase } from "@/lib/supabase";
import { uploadCompressedImage } from "@/lib/upload-image";

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfileInfo } = useProfileStore();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState<"organic" | "saffron" | "emerald" | "noir" | "silk">("organic");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const themeOptions = [
    { value: "organic", label: "Organic Minimalist", color: "bg-slate-100 border-slate-350" },
    { value: "saffron", label: "Saffron Warmth", color: "bg-amber-400 border-amber-500" },
    { value: "emerald", label: "Emerald Forest", color: "bg-emerald-500 border-emerald-600" },
    { value: "noir", label: "Midnight Noir", color: "bg-slate-950 border-slate-800" },
    { value: "silk", label: "Silk Lavender", color: "bg-rose-200 border-rose-300" },
  ] as const;

  // Debounced check for username slug availability
  useEffect(() => {
    if (!username.trim()) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    setUsernameAvailable(null);

    const delayDebounceFn = setTimeout(async () => {
      const lowerUsername = username.toLowerCase().replace(/\s+/g, "");
      try {
        const res = await fetch(`/api/profile/${lowerUsername}`);
        if (res.status === 200) {
          // Profile exists, username is already taken
          setUsernameAvailable(false);
        } else if (res.status === 404) {
          // Profile not found, username is available
          setUsernameAvailable(true);
        } else {
          setUsernameAvailable(null);
        }
      } catch (err) {
        console.error("Availability Check Error:", err);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  // Fetch Supabase user session on mount to load user's full name
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.user_metadata?.full_name) {
          setDisplayName(user.user_metadata.full_name);
        }
      } catch (err) {
        console.error("Failed to load user session:", err);
      }
    };
    loadSession();
  }, []);

  const handleNextStep = () => {
    setErrorMsg("");
    if (step === 1) {
      const trimmedPhone = phone.trim();
      if (!trimmedPhone) {
        setErrorMsg("Phone number is mandatory to proceed.");
        return;
      }
      // Require '+' followed by country code digits
      if (!/^\+\d/.test(trimmedPhone)) {
        setErrorMsg("Please include your country code starting with '+' (e.g. +91 98765 43210).");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!username.trim()) {
        setErrorMsg("Please enter a username slug.");
        return;
      }
      if (usernameAvailable === false) {
        setErrorMsg("This username is already taken. Please choose another one.");
        return;
      }
      setStep(3);
    }
  };

  const handleBackStep = () => {
    setErrorMsg("");
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    setErrorMsg("");
    const lowerUsername = username.toLowerCase().replace(/\s+/g, "");

    const profileData = {
      username: lowerUsername,
      name: displayName || "Ansh Creator",
      bio: bio || "Building beautiful digital experiences ✨",
      avatar: avatarUrl,
      verified: true,
      theme,
      bgStyle: "mesh" as const,
      upiId: "",
      whatsappNumber: phone,
      currentlyExploring: "Next.js & Cloudflare R2",
      hobbies: ["📚 Reading", "💻 Coding"],
      links: [
        {
          id: `link-1`,
          title: "My Portfolio",
          subtitle: "Explore my designs",
          url: "https://anshapps.com",
          icon: "Palette",
          active: true,
        }
      ],
      socialLinks: [
        { id: `social-1`, platform: "website", url: "https://anshapps.com" }
      ],
      cards: [
        {
          id: `card-1`,
          cardName: displayName || "Ansh Creator",
          jobTitle: "Creator",
          company: "ANSH Apps",
          phone: phone,
          email: "",
          website: `https://anshapps.com/${lowerUsername}`,
          theme: "gold" as const,
          active: true,
        }
      ],
      products: [],
      integrations: [],
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const res = await fetch(`/api/profile/${lowerUsername}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profileData,
          userId: user?.id ?? null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile. This username might already be claimed.");
      }

      const savedData = await res.json();
      
      // Update local state
      updateProfileInfo(savedData);
      
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col justify-between pt-10 pb-20 px-6 transition-colors duration-305">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-mesh pointer-events-none opacity-40" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <div className="relative z-10 max-w-xl mx-auto w-full flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/logoAnshapps.png" alt="ANSH Apps Logo" className="w-9 h-9 object-contain" />
          <span className="font-black text-sm tracking-tight text-slate-805 dark:text-white uppercase font-sans">
            ANSH Links
          </span>
        </Link>
        <span className="text-[10px] font-black text-slate-405 uppercase tracking-widest">
          Step {step} of 3
        </span>
      </div>

      {/* Onboarding Wizard Card */}
      <div className="relative z-10 max-w-xl mx-auto w-full bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-[2rem] shadow-xl p-8 sm:p-12 transition-colors duration-300">
        
        {/* Progress Dots */}
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-350 ${
                s === step
                  ? "w-8 bg-indigo-600"
                  : s < step
                  ? "w-3 bg-emerald-500"
                  : "w-3 bg-slate-205 dark:bg-slate-800"
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-205 dark:border-rose-900/30 text-rose-605 dark:text-rose-455 text-xs font-bold rounded-2xl mb-6">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Phone Number */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-655 dark:text-indigo-400 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-4">
                What is your phone number?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium font-sans">
                Enter your WhatsApp/Mobile number to enable direct instant chat and connection triggers on your profile. <strong className="text-indigo-650 dark:text-indigo-400">(Mandatory, must include country code e.g. +91)</strong>
              </p>
            </div>

            <div>
              <label className="text-[11px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-2 font-sans">
                Phone / Mobile Number
              </label>
              <div className="phone-input-wrapper relative">
                <PhoneInput
                  international
                  defaultCountry="IN"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(val) => setPhone(val || "")}
                  className="flex items-center gap-2.5 px-4 py-3.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-650 transition-all font-sans text-xs font-bold text-slate-800 dark:text-slate-100"
                  numberInputProps={{
                    className: "bg-transparent border-none outline-none focus:ring-0 w-full text-slate-800 dark:text-slate-100 pl-1 py-0 outline-0",
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-4 rounded-2xl font-black text-white primary-gradient shadow-lg shadow-indigo-600/10 hover:scale-[0.99] active:scale-[0.98] transition-all flex items-center justify-center text-xs cursor-pointer"
            >
              Continue to Step 2
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        )}

        {/* STEP 2: Claim Slug */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-4">
                Claim your custom link
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Choose a unique username slug for your page URL. Share it with your clients, add it in social bio spaces, and put it on cards.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-black tracking-wider text-slate-550 dark:text-slate-400 uppercase block mb-2 font-sans">
                Username Slug
              </label>
              <div className="flex rounded-2xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-650 transition-all">
                <span className="flex items-center px-4 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 select-none shrink-0">
                  ansh.links/
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  className="flex-grow px-4 py-3.5 bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 outline-none border-none focus:ring-0"
                  placeholder="yourname"
                />
              </div>

              {/* Availability feedback info */}
              <div className="mt-2.5 min-h-[16px] text-[10px] font-black tracking-wide uppercase flex items-center gap-1.5 pl-1.5 font-sans">
                {checkingUsername && (
                  <span className="text-slate-400 animate-pulse">Checking availability...</span>
                )}
                {!checkingUsername && usernameAvailable === true && (
                  <span className="text-emerald-505 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Username is available!
                  </span>
                )}
                {!checkingUsername && usernameAvailable === false && (
                  <span className="text-rose-605 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                    Already taken
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBackStep}
                className="w-1/3 py-4 rounded-2xl border border-slate-205 dark:border-slate-800 text-slate-655 dark:text-slate-300 font-black hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors flex items-center justify-center gap-1.5 text-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="w-2/3 py-4 rounded-2xl font-black text-white primary-gradient shadow-lg shadow-indigo-600/10 hover:scale-[0.99] active:scale-[0.98] transition-all flex items-center justify-center text-xs cursor-pointer"
              >
                Continue to Step 3
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Theme & Profile Info */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-4">
                Personalize your space
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Set up your profile name, optional bio, profile picture, and pick one of our beautifully curated editor theme skins.
              </p>
            </div>

            {/* Avatar Profile Image Uploader */}
            <div className="flex flex-col items-center gap-4 p-4.5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-md shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-9 h-9 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                    Uploading...
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <label className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-900/30 hover:bg-indigo-100/40 dark:hover:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-black rounded-xl transition-all cursor-pointer shadow-sm text-center">
                  <span className="material-symbols-outlined text-[13px]">cloud_upload</span>
                  <span>Upload Picture</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingAvatar}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setUploadingAvatar(true);
                        const url = await uploadCompressedImage(file, "avatar");
                        setAvatarUrl(url);
                      } catch (err) {
                        console.error(err);
                        alert("Failed to upload profile image to Cloudflare R2.");
                      } finally {
                        setUploadingAvatar(false);
                      }
                    }}
                  />
                </label>
                <span className="text-[9px] text-slate-400 font-medium">PNG or JPG, maximum size 5MB</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="premium-input-large bg-slate-50/50 dark:bg-slate-950 border-slate-350 dark:border-slate-805 text-xs font-bold w-full"
                  placeholder="e.g. Ansh Kumar"
                />
              </div>

              <div>
                <label className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1.5">
                  Brief Bio
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="premium-input-large bg-slate-50/50 dark:bg-slate-950 border-slate-350 dark:border-slate-805 text-xs font-bold w-full"
                  placeholder="e.g. Creator & designer"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-3 font-sans">
                Choose Theme Preset
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={`flex flex-col items-center justify-between p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      theme === opt.value
                        ? "border-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 shadow-sm"
                        : "border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full border ${opt.color} shrink-0 mb-2 flex items-center justify-center text-white`}>
                      {theme === opt.value && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <span className="text-[9px] font-extrabold tracking-tight leading-none block">{opt.label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBackStep}
                disabled={loading || uploadingAvatar}
                className="w-1/3 py-4 rounded-2xl border border-slate-205 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-black hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors flex items-center justify-center gap-1.5 text-xs cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={loading || uploadingAvatar}
                className="w-2/3 py-4 rounded-2xl font-black text-white primary-gradient shadow-lg shadow-indigo-600/10 hover:scale-[0.99] active:scale-[0.98] transition-all flex items-center justify-center text-xs cursor-pointer disabled:opacity-50"
              >
                {loading ? "Completing setup..." : "Finish & Open Dashboard"}
                {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="relative z-10 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} ANSH Links. Built from Bharat.
      </div>
    </main>
  );
}
