import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { dbStore, StoreSettings } from "@/lib/db/store";
import { Save, CheckCircle, Layout, Megaphone, FileText } from "lucide-react";

export const Route = createFileRoute("/admin/content/")({
  component: AdminContentPage,
});

function AdminContentPage() {
  const [settings, setSettings] = useState<StoreSettings>(dbStore.getStoreSettings());
  const [announcementText, setAnnouncementText] = useState(
    "Complimentary Worldwide Express Shipping on All Orders Above ₹10,000",
  );
  const [heroHeading, setHeroHeading] = useState("Timeless Handloom Elegance");
  const [heroSubheading, setHeroSubheading] = useState(
    "Handcrafted suit sets and fine jewellery tailored for modern royalty.",
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    dbStore.updateStoreSettings(settings);
    showToast("Homepage banners and editorial content updated!");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-5 py-3 shadow-xl border-l-4 border-[#6B1D2F] flex items-center space-x-3 text-sm">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <h1 className="text-2xl font-serif font-light text-[#1C1917]">
          Homepage & Editorial Content Management
        </h1>
        <p className="text-xs text-[#78716C] mt-1 font-sans">
          Update high-impact hero banners, announcement bar alerts, and brand story copy.
        </p>
      </div>

      <form onSubmit={handleSaveContent} className="space-y-6">
        {/* Announcement Bar Settings */}
        <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4] flex items-center space-x-2">
            <Megaphone className="w-5 h-5 text-[#6B1D2F]" />
            <span>Top Announcement Ticker Bar</span>
          </h2>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
              Announcement Banner Message
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
            />
          </div>

          <div className="bg-[#6B1D2F] text-white p-2.5 text-center text-xs tracking-wider uppercase font-semibold">
            Live Preview: {announcementText}
          </div>
        </div>

        {/* Hero Banner Content */}
        <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4] flex items-center space-x-2">
            <Layout className="w-5 h-5 text-[#6B1D2F]" />
            <span>Homepage Hero Banner</span>
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Hero Main Heading
              </label>
              <input
                type="text"
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-sm font-serif focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Hero Subheading / Tagline
              </label>
              <textarea
                rows={3}
                value={heroSubheading}
                onChange={(e) => setHeroSubheading(e.target.value)}
                className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center space-x-2 px-8 py-3 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Homepage Content</span>
        </button>
      </form>
    </div>
  );
}
