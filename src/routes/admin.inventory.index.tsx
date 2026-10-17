import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { dbStore, Product, InventoryLog } from "@/lib/db/store";
import { useAdminProducts } from "@/hooks/use-products";
import {
  Layers,
  Plus,
  Minus,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  History,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/admin/inventory/")({
  component: AdminInventoryPage,
});

function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantityChange, setQuantityChange] = useState<number>(5);
  const [reason, setReason] = useState<InventoryLog["reason"]>("restock");
  const [note, setNote] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: adminProdsData } = useAdminProducts({ limit: 100 });
  const liveAdminProducts = adminProdsData?.products || [];

  const loadData = () => {
    const pList = dbStore.getProducts();
    const mappedLive: Product[] = liveAdminProducts.map((p) => ({
      id: p.id,
      handle: p.id,
      title: p.name,
      price: p.sellPrice,
      category: "clothing" as const,
      type: p.color || "Product",
      collections: [],
      material: "Cotton",
      colour: p.color,
      inStock: p.stock > 0,
      images: p.media?.map((m) => m.url) || [],
      description: p.description,
      craft: "",
      dimensions: "",
      care: "",
      stockQuantity: p.stock,
    } as unknown as Product));

    const finalProducts = mappedLive.length > 0 ? mappedLive : pList;
    setProducts(finalProducts);
    if (!selectedProductId && finalProducts.length > 0) {
      setSelectedProductId(finalProducts[0].id);
    }
    setInventoryLogs(dbStore.getInventoryLogs());
  };

  useEffect(() => {
    loadData();
    const handleDbUpdate = () => loadData();
    window.addEventListener("manmayi_db_updated", handleDbUpdate);
    return () => window.removeEventListener("manmayi_db_updated", handleDbUpdate);
  }, [liveAdminProducts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    try {
      const updatedProduct = dbStore.adjustStock(
        selectedProductId,
        quantityChange,
        reason,
        note || "Manual stock update via Admin panel",
        "Administrator",
      );
      loadData();
      setNote("");
      showToast(
        `Stock updated for ${updatedProduct.title}. New balance: ${(updatedProduct as any).stockQuantity} units.`,
      );
    } catch (err: any) {
      showToast(err.message || "Failed to adjust stock.");
    }
  };

  const filteredLogs = inventoryLogs.filter(
    (log) =>
      log.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.productHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-5 py-3 shadow-xl border-l-4 border-[#6B1D2F] flex items-center space-x-3 text-sm">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-light text-[#1C1917]">
            Inventory Control & Audit Log
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Adjust stock levels, restock batches, log damaged units, and audit stock movements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Adjustment Card */}
        <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4] flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#6B1D2F]" />
            <span>Stock Level Adjustment</span>
          </h2>

          <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                Select Target Product *
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:outline-none focus:border-[#6B1D2F]"
              >
                {products.length === 0 ? (
                  <option value="">No products available in catalog</option>
                ) : (
                  products.map((p) => {
                    const stock = (p as any).stockQuantity ?? (p.inStock ? 12 : 0);
                    return (
                      <option key={p.id} value={p.id}>
                        {p.title} ({stock} currently in stock)
                      </option>
                    );
                  })
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                Quantity Adjustment (+/- Units) *
              </label>
              <input
                type="number"
                required
                value={quantityChange}
                onChange={(e) => setQuantityChange(Number(e.target.value))}
                placeholder="e.g. +10 or -2"
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] font-semibold text-[#1C1917] focus:outline-none focus:border-[#6B1D2F]"
              />
              <span className="text-[11px] text-[#78716C]">
                Use positive numbers (e.g., 10) to add stock, or negative numbers (e.g., -2) to
                deduct stock.
              </span>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                Reason for Adjustment *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:outline-none focus:border-[#6B1D2F]"
              >
                <option value="restock">New Stock Weaving Batch Arrival (Restock)</option>
                <option value="return">Customer Return to Stock</option>
                <option value="damaged">Fabric Defect / Damaged Unit Removal</option>
                <option value="audit_adjustment">Physical Stock Count Adjustment</option>
                <option value="initial_stock">Initial Stock Setup</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                Audit Note / Reference
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Batch #402 from Varanasi weaver..."
                className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#6B1D2F] text-white uppercase tracking-wider font-semibold text-xs hover:bg-[#521624] transition-colors"
            >
              Apply Stock Adjustment
            </button>
          </form>
        </div>

        {/* Audit Log Table */}
        <div className="lg:col-span-2 bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
            <h2 className="text-lg font-serif text-[#1C1917] flex items-center space-x-2">
              <History className="w-5 h-5 text-[#6B1D2F]" />
              <span>Inventory Movements Audit Log</span>
            </h2>

            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A8A29E]" />
              <input
                type="text"
                placeholder="Filter logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>
          </div>

          <div className="divide-y divide-[#E7E5E4] text-xs">
            {filteredLogs.length === 0 ? (
              <p className="py-6 text-center text-[#78716C]">No inventory logs recorded.</p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#1C1917]">{log.productTitle}</div>
                    <div className="text-[11px] text-[#78716C] mt-0.5">
                      Reason:{" "}
                      <strong className="capitalize">{log.reason.replace(/_/g, " ")}</strong> •{" "}
                      {log.note || "No note"}
                    </div>
                    <div className="text-[10px] text-[#A8A29E] mt-0.5">
                      By {log.performedBy} on {new Date(log.createdAt).toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-1 ${
                        log.quantityChange > 0
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange} units
                    </span>
                    <div className="text-[10px] text-[#78716C] mt-1">
                      {log.previousQuantity} → {log.newQuantity}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
