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
import RedirectsPanel from "@/components/dashboard/RedirectsPanel";
import CustomFieldsPanel from "@/components/dashboard/CustomFieldsPanel";
import SupportPanel from "@/components/dashboard/SupportPanel";

export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState<PanelType>("links");
  const [canvasOrigin, setCanvasOrigin] = useState<"links" | "workspace-links">("links");
  const [activeLinkId, setActiveLinkId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const renderPanelContent = () => {
    switch (activePanel) {
      case "dashboard":
        return <AnalyticsPanel />;
      case "traffic":
        return <TrafficLogsPanel />;
      case "redirects":
        return <RedirectsPanel />;
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
      case "support":
        return <SupportPanel />;
      case "canvas-edit":
        return (
          <CanvasPanel
            linkId={activeLinkId || ""}
            previewOnly={false}
            onBack={() => {
              setActivePanel(canvasOrigin);
              setActiveLinkId(null);
            }}
          />
        );
      case "canvas-preview":
        return (
          <CanvasPanel
            linkId={activeLinkId || ""}
            previewOnly
            onBack={() => {
              setActivePanel(canvasOrigin);
              setActiveLinkId(null);
            }}
          />
        );
      case "workspace-links":
        return <CustomFieldsPanel />;
      case "links":
      default:
        return (
          <MyLinksPanel
            searchQuery={searchQuery}
            onEnterCanvasMode={(id) => {
              setCanvasOrigin(activePanel as "links" | "workspace-links");
              setActivePanel("canvas-edit");
              setActiveLinkId(id);
            }}
            onPreviewLink={(id) => {
              setCanvasOrigin("links");
              setActivePanel("canvas-preview");
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
