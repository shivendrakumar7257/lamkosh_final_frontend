import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { dbStore, StoreSettings } from "@/lib/db/store";
import { Save, CheckCircle, Store, DollarSign, Share2, Globe } from "lucide-react";

export const Route = createFileRoute("/admin/settings/")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(dbStore.getStoreSettings());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dbStore.updateStoreSettings(settings);
    showToast("Store settings and operational parameters saved successfully!");
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
          General Store Configuration
        </h1>
        <p className="text-xs text-[#78716C] mt-1 font-sans">
          Configure brand details, tax parameters, shipping cutoffs, and social profiles.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Identity */}
        <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4] flex items-center space-x-2">
            <Store className="w-5 h-5 text-[#6B1D2F]" />
            <span>Store Identity & Contact Details</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                Store Brand Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                Support Phone Number
              </label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                Currency Symbol
              </label>
              <input
                type="text"
                disabled
                value={settings.currency}
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-[#78716C]"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                Business Atelier Address
              </label>
              <input
                type="text"
                value={settings.businessAddress}
                onChange={(e) => setSettings({ ...settings, businessAddress: e.target.value })}
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>
          </div>
        </div>

        {/* E-commerce Rules */}
        <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4] flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-[#6B1D2F]" />
            <span>Tax & Shipping Policy Thresholds</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                GST Tax Rate (%)
              </label>
              <input
                type="number"
                value={settings.taxRatePercent}
                onChange={(e) =>
                  setSettings({ ...settings, taxRatePercent: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                Low Stock Threshold
              </label>
              <input
                type="number"
                value={settings.defaultLowStockThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, defaultLowStockThreshold: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.complimentaryShippingMinOrder}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    complimentaryShippingMinOrder: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4] flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-[#6B1D2F]" />
            <span>Social Media Handles</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                Instagram URL
              </label>
              <input
                type="text"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                Facebook URL
              </label>
              <input
                type="text"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                YouTube Channel URL
              </label>
              <input
                type="text"
                value={settings.youtubeUrl}
                onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center space-x-2 px-8 py-3 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Store Settings</span>
        </button>
      </form>
    </div>
  );
}
