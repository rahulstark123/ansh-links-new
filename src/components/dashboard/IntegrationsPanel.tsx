"use client";

import { useProfileStore, IntegrationItem } from "@/store/useProfileStore";
import { Settings, CreditCard, Mail, BarChart3, Check, Link2, Key } from "lucide-react";
import { useState } from "react";

interface ProviderDetails {
  provider: 'stripe' | 'mailchimp' | 'analytics';
  title: string;
  description: string;
  icon: any;
  colorClass: string;
}

export default function IntegrationsPanel() {
  const { profile, updateIntegration } = useProfileStore();
  const [keys, setKeys] = useState<{ [key: string]: string }>({});

  const providers: ProviderDetails[] = [
    {
      provider: "stripe",
      title: "Stripe Checkout",
      description: "Charge customers for resume templates, digital assets, or e-books. Instantly connect payments.",
      icon: CreditCard,
      colorClass: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-950/40",
    },
    {
      provider: "mailchimp",
      title: "Mailchimp Newsletters",
      description: "Sync your visitor email capture forms to active subscriber lists for recurring newsletters.",
      icon: Mail,
      colorClass: "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-950/40",
    },
    {
      provider: "analytics",
      title: "Google Analytics & Pixel",
      description: "Inject Google Analytics GTAG or Meta Pixel codes to monitor traffic logs and user click maps.",
      icon: BarChart3,
      colorClass: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/40",
    },
  ];

  const getIntegration = (prov: string): IntegrationItem => {
    const list = profile.integrations || [];
    return list.find((i) => i.provider === prov) || { id: prov, provider: prov as any, connected: false };
  };

  const handleToggleConnect = (prov: 'stripe' | 'mailchimp' | 'analytics') => {
    const current = getIntegration(prov);
    const apiVal = keys[prov] || "";
    
    if (current.connected) {
      // Disconnect
      updateIntegration(prov, { connected: false, apiKey: undefined });
      setKeys((prev) => ({ ...prev, [prov]: "" }));
    } else {
      // Connect
      if (!apiVal.trim()) return;
      updateIntegration(prov, { connected: true, apiKey: apiVal.trim() });
    }
  };

  return (
    <div className="p-8 sm:p-10 space-y-8 w-full animate-fadeIn font-sans">
      
      {/* Header Overview */}
      <div className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-8 shadow-sm space-y-2 transition-colors duration-300">
        <h3 className="font-black text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
          <Settings className="w-5.5 h-5.5" />
          Third-Party Integrations
        </h3>
        <p className="text-sm text-slate-400">
          Link external business channels to unlock monetization, newsletter subscription, and analytics reports.
        </p>
      </div>

      {/* Integration grid list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {providers.map((item) => {
          const ProviderIcon = item.icon;
          const config = getIntegration(item.provider);
          
          return (
            <div
              key={item.provider}
              className="bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6 transition-colors duration-300"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.colorClass}`}>
                    <ProviderIcon className="w-5.5 h-5.5" />
                  </div>
                  
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                    config.connected
                      ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}>
                    {config.connected ? "Connected" : "Inactive"}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-black">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.description}</p>
                </div>
              </div>

              {/* API Configuration field */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/5">
                {!config.connected ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      API Client Key
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-slate-400">
                        <Key className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="password"
                        value={keys[item.provider] || ""}
                        onChange={(e) => setKeys({ ...keys, [item.provider]: e.target.value })}
                        className="premium-input-large text-xs pl-9 font-sans"
                        placeholder="sk_live_..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-950/45 border border-outline-variant/5 rounded-2xl p-4.5 flex gap-2.5 items-center">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">Secret Key Linked</span>
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-mono block mt-1 truncate">••••••••••••••••</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleToggleConnect(item.provider)}
                  disabled={!config.connected && !(keys[item.provider] || "").trim()}
                  className={`w-full py-3 rounded-xl text-xs font-black cursor-pointer shadow-sm transition-all text-center ${
                    config.connected
                      ? "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-950/40"
                      : "primary-gradient text-white hover:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                  }`}
                >
                  {config.connected ? "Disconnect" : "Connect Account"}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
