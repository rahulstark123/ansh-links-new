"use client";

import { buildProfileFillOptions } from "@/lib/quick-links";
import type { ProfileInfo } from "@/store/useProfileStore";

interface ProfileFillDropdownProps {
  profile: ProfileInfo;
  onSelect: (value: string) => void;
  className?: string;
}

export default function ProfileFillDropdown({
  profile,
  onSelect,
  className = "",
}: ProfileFillDropdownProps) {
  const options = buildProfileFillOptions(profile);

  if (options.length === 0) return null;

  const hobbies = options.filter((o) => o.group === "Hobbies");
  const profileOpts = options.filter((o) => o.group === "Profile");

  return (
    <div className={className}>
      <label className="text-xs font-black tracking-wider text-slate-450 dark:text-slate-500 uppercase block mb-1.5 font-sans">
        Fill from Advanced Profile
      </label>
      <select
        defaultValue=""
        onChange={(e) => {
          const value = e.target.value;
          if (!value) return;
          onSelect(value);
          e.target.value = "";
        }}
        className="premium-input-large text-xs font-bold font-sans cursor-pointer"
      >
        <option value="">Select bio or hobby...</option>
        {profileOpts.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {hobbies.length > 0 && (
          <optgroup label="Hobbies & Interests">
            {hobbies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        )}
      </select>
      <p className="text-[10px] text-slate-400 font-medium mt-1.5">
        Hobbies and bio are set in Advanced — use them to pre-fill link fields.
      </p>
    </div>
  );
}
