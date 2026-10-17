import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { dbStore, Coupon } from "@/lib/db/store";
import { Plus, Edit, Trash2, Tag, CheckCircle, X, Save } from "lucide-react";

export const Route = createFileRoute("/admin/coupons/")({
  component: AdminCouponsPage,
});

function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadCoupons = () => {
    setCoupons(dbStore.getCoupons());
  };

  useEffect(() => {
    loadCoupons();
    const handleDbUpdate = () => loadCoupons();
    window.addEventListener("manmayi_db_updated", handleDbUpdate);
    return () => window.removeEventListener("manmayi_db_updated", handleDbUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingCoupon({
      code: "",
      discountType: "percentage",
      discountValue: 10,
      minOrderValue: 5000,
      maxDiscount: 2000,
      usageLimit: 100,
      usedCount: 0,
      perCustomerLimit: 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c: Coupon) => {
    setEditingCoupon({ ...c });
    setIsModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon?.code?.trim()) {
      showToast("Coupon code is required.");
      return;
    }

    dbStore.saveCoupon({
      ...editingCoupon,
      code: editingCoupon.code,
      discountValue: editingCoupon.discountValue || 10,
    } as any);

    loadCoupons();
    setIsModalOpen(false);
    setEditingCoupon(null);
    showToast(`Coupon "${editingCoupon.code?.toUpperCase()}" saved!`);
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    if (window.confirm(`Delete coupon "${code}"?`)) {
      dbStore.deleteCoupon(id);
      loadCoupons();
      showToast(`Coupon "${code}" deleted.`);
    }
  };

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
            Promotional Coupons & Vouchers
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Manage percentage and fixed-value discount codes for storefront checkout.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-5 py-2 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-[#E7E5E4] shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#E7E5E4] text-[11px] uppercase tracking-wider font-semibold text-[#78716C]">
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount Value</th>
              <th className="p-4">Min Order Value</th>
              <th className="p-4">Usage Count</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E5E4] text-xs text-[#1C1917]">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#78716C]">
                  No promotional coupons created yet. Click "+ Create New Coupon" to configure discount vouchers.
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                <td className="p-4">
                  <span className="font-mono font-bold text-[#6B1D2F] text-sm bg-[#FAF8F5] px-2.5 py-1 border border-[#E7E5E4]">
                    {c.code}
                  </span>
                </td>

                <td className="p-4 font-semibold">
                  {c.discountType === "percentage"
                    ? `${c.discountValue}% OFF`
                    : `₹${c.discountValue.toLocaleString("en-IN")} OFF`}
                </td>

                <td className="p-4 text-[#57534E]">₹{c.minOrderValue.toLocaleString("en-IN")}</td>

                <td className="p-4 font-mono text-[#57534E]">
                  {c.usedCount} / {c.usageLimit ? c.usageLimit : "∞"}
                </td>

                <td className="p-4">
                  {c.isActive ? (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200">
                      Disabled
                    </span>
                  )}
                </td>

                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(c)}
                    className="p-1.5 text-[#78716C] hover:text-[#6B1D2F]"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(c.id, c.code)}
                    className="p-1.5 text-[#78716C] hover:text-rose-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && editingCoupon && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E5E4] max-w-md w-full shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
              <h2 className="text-lg font-serif text-[#1C1917]">
                {editingCoupon.id ? "Edit Coupon" : "Create Coupon"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Code (e.g. FESTIVE20) *
                </label>
                <input
                  type="text"
                  required
                  value={editingCoupon.code || ""}
                  onChange={(e) =>
                    setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs font-mono uppercase focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                    Discount Type
                  </label>
                  <select
                    value={editingCoupon.discountType || "percentage"}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        discountType: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed INR Amount (₹)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingCoupon.discountValue || 10}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        discountValue: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs font-semibold focus:outline-none focus:border-[#6B1D2F]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Minimum Order Value (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingCoupon.minOrderValue || 0}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      minOrderValue: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <label className="flex items-center space-x-2 text-xs text-[#1C1917] cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={editingCoupon.isActive ?? true}
                  onChange={(e) =>
                    setEditingCoupon({ ...editingCoupon, isActive: e.target.checked })
                  }
                  className="accent-[#6B1D2F]"
                />
                <span className="font-medium">Coupon is Active</span>
              </label>

              <div className="pt-4 border-t border-[#E7E5E4] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E7E5E4] text-[#1C1917] text-xs uppercase font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6B1D2F] text-white text-xs uppercase font-semibold hover:bg-[#521624]"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
