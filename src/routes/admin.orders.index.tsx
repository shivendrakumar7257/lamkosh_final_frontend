import React, { useState, useEffect, useCallback } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  Package,
  XCircle,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { adminOrderService } from "@/api/adminOrderService";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { formatPrice } from "@/data/catalog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders/")({
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">("ALL");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminOrderService.getOrders({
        page,
        limit,
        search: searchQuery.trim() || undefined,
        status: selectedStatus === "ALL" ? undefined : selectedStatus,
        paymentStatus: selectedPaymentStatus === "ALL" ? undefined : selectedPaymentStatus,
        sortBy,
      });
      setOrders(res.orders || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalCount(res.pagination?.totalCount || 0);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load admin orders list.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, selectedStatus, selectedPaymentStatus, sortBy]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await adminOrderService.updateOrderStatus(orderId, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o)),
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PROCESSING":
        return "bg-amber-100 text-amber-900 border-amber-200";
      case "CONFIRMED":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "PENDING":
      default:
        return "bg-stone-100 text-stone-800 border-stone-200";
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "REFUNDED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "FAILED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "PENDING":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-light text-[#1C1917]">Client Order Management</h1>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Track order fulfillment, Shiprocket courier dispatches, live telemetry, and status
            updates.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => loadOrders()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] hover:bg-white transition-colors"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            <span>Refresh</span>
          </button>
          <span className="font-semibold text-[#1C1917]">{totalCount}</span> Total Orders
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 border border-[#E7E5E4] shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
            <input
              type="text"
              placeholder="Search by order number (e.g. LAM-20261017-...), customer, email, mobile..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
            />
          </div>

          {/* Fulfillment Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as any);
              setPage(1);
            }}
            className="py-2 px-3 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
          >
            <option value="ALL">All Order Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={selectedPaymentStatus}
            onChange={(e) => {
              setSelectedPaymentStatus(e.target.value as any);
              setPage(1);
            }}
            className="py-2 px-3 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="PENDING">Payment PENDING</option>
            <option value="PAID">PAID</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E7E5E4] shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#E7E5E4] text-[11px] uppercase tracking-wider font-semibold text-[#78716C]">
              <th className="p-4">Order Number & Date</th>
              <th className="p-4">Customer Details</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Shipment / AWB</th>
              <th className="p-4">Status & Pipeline</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E5E4] text-xs">
            {loading ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-[#78716C]">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#6B1D2F] mb-2" />
                  Loading client orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-[#78716C]">
                  No orders match your filter criteria.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const isUpdating = updatingId === order.id;

                return (
                  <tr key={order.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    {/* Order Number & Date */}
                    <td className="p-4">
                      <Link
                        to={`/admin/orders/${order.id}` as any}
                        className="font-mono font-bold text-[#6B1D2F] hover:underline block"
                      >
                        {order.orderNumber}
                      </Link>
                      <span className="text-[11px] text-[#78716C]">{dateStr}</span>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="font-medium text-[#1C1917]">{order.customer?.name}</div>
                      <div className="text-[11px] text-[#78716C]">
                        {order.customer?.email || "Guest (No email)"}
                      </div>
                      <div className="text-[11px] font-mono text-[#78716C]">
                        +91 {order.customer?.mobileNumber}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="p-4">
                      <span className="font-semibold text-[#1C1917]">{order.items.length}</span>{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </td>

                    {/* Total Amount */}
                    <td className="p-4 font-mono font-medium text-[#1C1917]">
                      {formatPrice(order.totalAmount)}
                    </td>

                    {/* Payment */}
                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 text-[10px] uppercase font-semibold border rounded-[2px]",
                          getPaymentBadge(order.paymentStatus),
                        )}
                      >
                        {order.paymentStatus}
                      </span>
                      <span className="block text-[10px] text-[#78716C] mt-0.5">
                        {order.paymentMethod === "ONLINE" ? "Prepaid" : "COD"}
                      </span>
                    </td>

                    {/* Shipment / AWB */}
                    <td className="p-4">
                      {order.shipment ? (
                        <div>
                          <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-[#1C1917]">
                            <Truck className="w-3 h-3 text-[#6B1D2F]" />
                            {order.shipment.courierName || "Courier Assigned"}
                          </span>
                          <span className="block font-mono text-[10px] text-[#78716C]">
                            AWB: {order.shipment.awbCode || "Pending"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#A8A29E] italic">Unfulfilled</span>
                      )}
                    </td>

                    {/* Fulfillment Status & Fast Pipeline Update */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <select
                          disabled={isUpdating}
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className={cn(
                            "px-2 py-1 text-[11px] font-semibold border rounded-[2px] bg-white cursor-pointer focus:outline-none",
                            getStatusBadge(order.status),
                          )}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                        {isUpdating && <Loader2 className="w-3 h-3 animate-spin text-[#6B1D2F]" />}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/orders/${order.id}` as any}
                          title="Manage Fulfillment & Shiprocket"
                          className="p-1.5 border border-[#E7E5E4] hover:border-[#6B1D2F] bg-white text-[#1C1917] hover:text-[#6B1D2F] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        {order.trackingToken && (
                          <Link
                            to={`/track/${order.trackingToken}` as any}
                            target="_blank"
                            title="Public Live Tracking"
                            className="p-1.5 border border-[#E7E5E4] hover:border-[#1C1917] bg-white text-[#78716C] hover:text-[#1C1917] transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 border border-[#E7E5E4] text-xs">
          <span className="text-[#78716C]">
            Page <span className="font-semibold text-[#1C1917]">{page}</span> of{" "}
            <span className="font-semibold text-[#1C1917]">{totalPages}</span>
          </span>

          <div className="flex items-center space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 border border-[#E7E5E4] bg-white disabled:opacity-40 hover:bg-[#FAF8F5]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 border border-[#E7E5E4] bg-white disabled:opacity-40 hover:bg-[#FAF8F5]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
