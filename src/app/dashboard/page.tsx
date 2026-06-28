"use client";

import { useState } from "react";
import AdminLayout, { PanelType } from "@/components/layout/AdminLayout";
import AnalyticsPanel from "@/components/dashboard/AnalyticsPanel";
import MyLinksPanel from "@/components/dashboard/MyLinksPanel";
import CanvasPanel from "@/components/dashboard/CanvasPanel";
import MyCardsPanel from "@/components/dashboard/MyCardsPanel";
import AllCardsPanel from "@/components/dashboard/AllCardsPanel";
import ProductsPanel from "@/components/dashboard/ProductsPanel";
import SocialProfilePanel from "@/components/dashboard/SocialProfilePanel";
import HobbiesBioPanel from "@/components/dashboard/HobbiesBioPanel";
import QuickLinksPanel from "@/components/dashboard/QuickLinksPanel";
import IntegrationsPanel from "@/components/dashboard/IntegrationsPanel";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import TrafficLogsPanel from "@/components/dashboard/TrafficLogsPanel";

export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState<PanelType>("links");
  const [activeLinkId, setActiveLinkId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const renderPanelContent = () => {
    switch (activePanel) {
      case "dashboard":
        return <AnalyticsPanel />;
      case "traffic":
        return <TrafficLogsPanel />;
      case "redirects":
        return (
          <div className="p-8 sm:p-10 font-sans max-w-4xl mx-auto space-y-4 animate-fadeIn">
            <h3 className="font-black text-lg text-indigo-700 dark:text-indigo-400">Redirect Rules</h3>
            <div className="p-8 bg-white dark:bg-slate-900 border border-outline-variant/10 rounded-3xl text-center text-slate-400">
              Manage custom link redirects, link grouping parameters, and geo-routing rules.
            </div>
          </div>
        );
      case "my-cards":
        return <MyCardsPanel />;
      case "all-cards":
        return <AllCardsPanel setActivePanel={setActivePanel} />;
      case "products":
        return <ProductsPanel />;
      case "social-profile":
        return <SocialProfilePanel />;
      case "hobbies-bio":
        return <HobbiesBioPanel />;
      case "quick-links":
        return <QuickLinksPanel />;
      case "integrations":
        return <IntegrationsPanel />;
      case "settings-profile":
        return <SettingsPanel subTab="profile" />;
      case "settings-billing":
        return <SettingsPanel subTab="billing" />;
      case "settings-security":
        return <SettingsPanel subTab="security" />;
      case "canvas-edit":
        return (
          <CanvasPanel
            linkId={activeLinkId || ""}
            onBack={() => {
              setActivePanel("links");
              setActiveLinkId(null);
            }}
          />
        );
      case "links":
      default:
        return (
          <MyLinksPanel
            searchQuery={searchQuery}
            onEnterCanvasMode={(id) => {
              setActivePanel("canvas-edit");
              setActiveLinkId(id);
            }}
          />
        );
    }
  };

  return (
    <AdminLayout
      activePanel={activePanel}
      setActivePanel={setActivePanel}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      <div className="pb-12">
        {renderPanelContent()}
      </div>
    </AdminLayout>
  );
}
