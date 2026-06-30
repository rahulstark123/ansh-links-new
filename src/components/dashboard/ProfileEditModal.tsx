"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, User, Sparkles, CheckCircle2, Camera } from "lucide-react";
import { ProfileInfo } from "@/store/useProfileStore";
import { uploadCompressedImage } from "@/lib/upload-image";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileInfo;
  onSave: (updates: Partial<ProfileInfo>) => void;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: ProfileEditModalProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [verified, setVerified] = useState(profile.verified);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setUsername(profile.username);
      setBio(profile.bio);
      setAvatar(profile.avatar);
      setVerified(profile.verified);
    }
  }, [isOpen, profile]);

  if (!isOpen || !mounted) return null;

  const handleSave = () => {
    onSave({
      name: name.trim(),
      username: username.toLowerCase().replace(/\s+/g, ""),
      bio: bio.trim(),
      avatar: avatar.trim(),
      verified,
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300">
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg primary-gradient flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-100">
              Edit Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="relative shrink-0 group">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://ui-avatars.com/api/?name=" + encodeURIComponent(name || "User") + "&background=4F46E5&color=fff&size=128";
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl primary-gradient flex items-center justify-center text-white text-xl font-black">
                  {(name || "A").charAt(0).toUpperCase()}
                </div>
              )}
              <label
                className={`absolute inset-0 rounded-2xl flex items-center justify-center bg-black/50 text-white cursor-pointer transition-opacity ${
                  uploadingAvatar ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {uploadingAvatar ? (
                  <span className="text-[8px] font-black uppercase">...</span>
                ) : (
                  <Camera className="w-4 h-4" />
                )}
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
                      setAvatar(url);
                    } catch (err) {
                      const message = err instanceof Error ? err.message : "Failed to upload image.";
                      alert(message);
                    } finally {
                      setUploadingAvatar(false);
                      e.target.value = "";
                    }
                  }}
                />
              </label>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Preview</p>
              <p className="font-black text-sm truncate flex items-center gap-1">
                {name || "Your Name"}
                {verified && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
              </p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold truncate">
                ansh.links/{username || "username"}
              </p>
              <p className="text-[9px] text-slate-400 mt-1">Hover photo to upload · max 2 MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="premium-input-large text-xs"
                placeholder="Ansh Kumar"
              />
            </div>
            <div>
              <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  ansh.links/
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))
                  }
                  className="premium-input-large text-xs pl-[5.5rem]"
                  placeholder="ansh"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="premium-input-large resize-none text-xs"
              placeholder="Tell the world about yourself..."
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <div className="flex gap-3 items-center">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="font-extrabold text-sm block">Verified Badge</span>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  Show verification checkmark on your profile
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setVerified(!verified)}
              className={`w-12 h-6.5 rounded-full p-1.5 transition-all cursor-pointer shrink-0 ${
                verified ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-all ${
                  verified ? "translate-x-5.5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="h-20 flex items-center justify-end px-6 gap-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 text-xs font-extrabold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || !username.trim()}
            className="px-6 py-2.5 rounded-xl text-white primary-gradient text-xs font-black shadow-lg shadow-indigo-600/10 hover:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
