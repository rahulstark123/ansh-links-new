"use client";

import { useState } from "react";
import { useProfileStore, LinkItem } from "@/store/useProfileStore";
import { Trash2, Link2, Eye, EyeOff, ChevronUp, ChevronDown, Check, GripVertical } from "lucide-react";
import DynamicIcon from "@/components/common/DynamicIcon";

interface LinkEditorCardProps {
  link: LinkItem;
  index: number;
  totalLinks: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const PRESETS_ICONS = [
  "Link2",
  "Network",
  "Palette",
  "BookOpen",
  "Briefcase",
  "Calendar",
  "DollarSign",
  "Globe",
  "Heart",
  "Phone",
  "Shield",
  "User",
  "MessageCircle",
];

export default function LinkEditorCard({
  link,
  index,
  totalLinks,
  onMoveUp,
  onMoveDown,
}: LinkEditorCardProps) {
  const { updateLink, removeLink, toggleLink } = useProfileStore();
  const [showIconSelect, setShowIconSelect] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-xl p-5 shadow-sm relative group flex gap-4 transition-all duration-300">
      {/* Reorder actions */}
      <div className="flex flex-col justify-between items-center py-1 text-slate-400">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded disabled:opacity-30 disabled:hover:text-slate-400"
          title="Move Up"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <GripVertical className="w-4 h-4 cursor-grab active:cursor-grabbing text-slate-300" />
        <button
          onClick={onMoveDown}
          disabled={index === totalLinks - 1}
          className="p-1 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded disabled:opacity-30 disabled:hover:text-slate-400"
          title="Move Down"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Main Form Fields */}
      <div className="flex-1 space-y-4">
        {/* Row 1: Title & Active Toggle */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <label className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1">
              Title
            </label>
            <input
              type="text"
              value={link.title}
              onChange={(e) => updateLink(link.id, { title: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500"
              placeholder="e.g. Design Portfolio"
            />
          </div>

          <div className="flex items-center gap-2 pt-5">
            <button
              onClick={() => toggleLink(link.id)}
              className={`p-2 rounded-lg border transition-all ${
                link.active
                  ? "bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400"
                  : "bg-slate-50 dark:bg-slate-950 border-slate-200/50 dark:border-slate-800/40 text-slate-400"
              }`}
              title={link.active ? "Link is Active (Click to Hide)" : "Link is Hidden (Click to Show)"}
            >
              {link.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Row 2: Subtitle */}
        <div>
          <label className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1">
            Subtitle (Optional)
          </label>
          <input
            type="text"
            value={link.subtitle || ""}
            onChange={(e) => updateLink(link.id, { subtitle: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500"
            placeholder="e.g. View my latest editorial projects"
          />
        </div>

        {/* Row 3: URL & Icon Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1">
              URL
            </label>
            <input
              type="text"
              value={link.url}
              onChange={(e) => updateLink(link.id, { url: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-lg py-2 px-3 text-sm font-semibold focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500"
              placeholder="e.g. https://myportfolio.com"
            />
          </div>

          <div className="relative">
            <label className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1">
              Icon
            </label>
            <button
              onClick={() => setShowIconSelect(!showIconSelect)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 rounded-lg py-2 px-3 text-sm font-semibold flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <DynamicIcon name={link.icon || "Link2"} className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs truncate">{link.icon || "Link2"}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">Select</span>
            </button>

            {/* Icon selection dropdown */}
            {showIconSelect && (
              <div className="absolute top-[100%] right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-lg shadow-xl p-2.5 z-20 grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto">
                {PRESETS_ICONS.map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => {
                      updateLink(link.id, { icon: iconName });
                      setShowIconSelect(false);
                    }}
                    className={`p-1.5 rounded flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-950/40 ${
                      (link.icon || "Link2") === iconName ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600" : "text-slate-500"
                    }`}
                    title={iconName}
                  >
                    <DynamicIcon name={iconName} className="w-4 h-4" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete action */}
      <div className="flex flex-col justify-start pt-5">
        <button
          onClick={() => removeLink(link.id)}
          className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-100 dark:hover:border-rose-950/30 rounded-lg transition-all"
          title="Delete Link"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
