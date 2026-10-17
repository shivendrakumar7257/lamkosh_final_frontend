import { useState, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Package,
  Truck,
  ExternalLink,
  Loader2,
  XCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  ShoppingBag,
  Star,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/RouteGuards";
import { orderService } from "@/api/orderService";
import { Order, OrderStatus } from "@/types/order";
import { formatPrice } from "@/data/catalog";
import { Reveal } from "@/components/site/Reveal";
import { WriteReviewModal } from "@/components/reviews/WriteReviewModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Track your past and active orders, view shipment status, or cancel processing orders.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountOrdersPageWrapper,
});

function AccountOrdersPageWrapper() {
  return (
    <ProtectedRoute>
      <AccountOrdersPage />
    </ProtectedRoute>
  );
}

type TabType = "ALL" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED";

function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Cancellation modal state
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  // Review modal state
  const [reviewTarget, setReviewTarget] = useState<{
    productId: string;
    orderId: string;
    productName: string;
  } | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderService.getUserOrders(page, 10);
      setOrders(res.orders || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalCount(res.pagination?.totalCount || 0);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load order history.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async () => {
    if (!cancellingOrder) return;
    setIsCancelLoading(true);
    try {
      const updatedOrder = await orderService.cancelOrder(cancellingOrder.id);
      toast.success(`Order ${cancellingOrder.orderNumber} was successfully cancelled.`);
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? { ...o, status: "CANCELLED" } : o)),
      );
      setCancellingOrder(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Could not cancel order. It may have already been dispatched.",
      );
    } finally {
      setIsCancelLoading(false);
    }
  };

  // Tab filtering
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "IN_PROGRESS") {
      return (
        order.status === "PENDING" ||
        order.status === "CONFIRMED" ||
        order.status === "PROCESSING" ||
        order.status === "SHIPPED"
      );
    }
    if (activeTab === "DELIVERED") return order.status === "DELIVERED";
    if (activeTab === "CANCELLED") return order.status === "CANCELLED";
    return true;
  });

  const isEligibleForCancellation = (status: OrderStatus) => {
    return status === "PENDING" || status === "CONFIRMED" || status === "PROCESSING";
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[0.68rem] font-semibold text-emerald-800">
            <CheckCircle className="h-3 w-3" /> Delivered
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[0.68rem] font-semibold text-blue-800">
            <Truck className="h-3 w-3" /> In Transit
          </span>
        );
      case "CONFIRMED":
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[0.68rem] font-semibold text-amber-900">
            <Clock className="h-3 w-3" /> At Atelier Bench
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[0.68rem] font-semibold text-rose-800">
            <XCircle className="h-3 w-3" /> Cancelled
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-[0.68rem] font-semibold text-stone-700">
            <Clock className="h-3 w-3" /> Pending Confirmation
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container-lux py-12 md:py-16">
        <Reveal>
          {/* Top Title & Navigation Tabs */}
          <div className="border-b border-border/80 pb-6">
            <h1 className="font-serif text-3xl font-light text-foreground sm:text-4xl">
              Client Atelier Account
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Manage your personal atelier wardrobe, ongoing deliveries, and preferences.
            </p>

            {/* Account Navigation Tabs */}
            <div className="mt-8 flex flex-wrap gap-8 border-b border-border/60 text-xs">
              <Link
                to="/account/profile"
                className="border-b-2 border-transparent pb-3 font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                Personal Profile
              </Link>
              <Link
                to="/account/orders"
                className="border-b-2 border-espresso pb-3 font-semibold uppercase tracking-wider text-foreground"
              >
                My Orders
              </Link>
              <Link
                to="/account/reviews"
                className="border-b-2 border-transparent pb-3 font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                My Reviews
              </Link>
              <Link
                to="/account/security"
                className="border-b-2 border-transparent pb-3 font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                Security & Password
              </Link>
              <Link
                to="/wishlist"
                className="border-b-2 border-transparent pb-3 font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                Saved Wishlist
              </Link>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { id: "ALL", label: "All Orders" },
                { id: "IN_PROGRESS", label: "In Progress" },
                { id: "DELIVERED", label: "Delivered" },
                { id: "CANCELLED", label: "Cancelled" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    "rounded-[2px] px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
                    activeTab === tab.id
                      ? "bg-[#28201C] text-[#FAF8F5]"
                      : "border border-border bg-[#FAF8F5] text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-muted-foreground">
              Showing {filteredOrders.length} of {totalCount} orders
            </span>
          </div>

          {/* Orders List Content */}
          <div className="mt-6 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#28201C]/60" />
                <p className="body-lux mt-4 text-xs text-[#28201C]/80">Loading your orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-sm border border-border bg-[#FAF8F5] p-12 text-center text-xs">
                <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground/60" />
                <h3 className="font-serif text-xl font-normal text-foreground mt-3">
                  No Orders in this Category
                </h3>
                <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                  {activeTab === "ALL"
                    ? "You haven't placed any orders yet. Discover our handcrafted fabrics and couture pieces."
                    : "No orders match the selected filter."}
                </p>
                <div className="mt-6">
                  <Link
                    to="/new-arrivals"
                    className="inline-block bg-[#28201C] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]"
                  >
                    Discover Collections
                  </Link>
                </div>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const eligibleCancel = isEligibleForCancellation(order.status);

                return (
                  <div
                    key={order.id}
                    className="rounded-sm border border-border/80 bg-background p-6 shadow-sm transition hover:border-espresso/40"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-foreground">
                            {order.orderNumber}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-[0.68rem] text-muted-foreground mt-1">
                          Placed on {dateStr} &bull; Payment:{" "}
                          <span className="font-medium text-foreground">
                            {order.paymentMethod === "ONLINE"
                              ? "Online Prepaid"
                              : "Cash on Delivery"}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Live Tracking Link */}
                        <Link
                          to={`/track/${order.trackingToken || order.id}` as any}
                          className="inline-flex items-center gap-1.5 border border-border bg-[#FAF8F5] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-champagne/40 transition-colors"
                        >
                          <Truck className="h-3.5 w-3.5 text-espresso" />
                          <span>Track Shipment</span>
                        </Link>

                        {/* Cancel Button */}
                        {eligibleCancel && (
                          <button
                            type="button"
                            onClick={() => setCancellingOrder(order)}
                            className="inline-flex items-center gap-1 rounded-[2px] border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-700 hover:bg-rose-100 transition-colors"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Cancel Order</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Order Items Snapshot */}
                    <div className="divide-y divide-border/40 py-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-3 text-xs gap-4"
                        >
                          <div className="flex items-center gap-3">
                            {item.productImage ? (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="h-12 w-10 object-cover rounded-[2px] border border-border/50"
                              />
                            ) : (
                              <div className="h-12 w-10 flex items-center justify-center bg-[#FAF8F5] border border-border/50">
                                <Package className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-foreground">{item.productName}</p>
                              <p className="text-[0.68rem] text-muted-foreground">
                                {item.size && `Size: ${item.size} `}
                                {item.color && `Color: ${item.color} `}
                                &bull; Qty: {item.quantity}
                              </p>
                              {order.status === "DELIVERED" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setReviewTarget({
                                      productId: item.productId,
                                      orderId: order.id,
                                      productName: item.productName,
                                    })
                                  }
                                  className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#6B1D2F] hover:underline"
                                >
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  <span>Write Review</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <span className="font-mono font-medium text-foreground">
                            {formatPrice(item.lineTotal || item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/60 pt-4 text-xs">
                      <div className="text-muted-foreground text-[0.68rem]">
                        <span>Delivery to: </span>
                        <span className="font-medium text-foreground">
                          {order.shippingAddress.name}, {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state} — {order.shippingAddress.pincode}
                        </span>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-[0.68rem] uppercase tracking-wider text-muted-foreground mr-2">
                          Total Amount:
                        </span>
                        <span className="font-serif text-base font-bold text-foreground">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-[2px] border border-border p-2 text-foreground disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-mono text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-[2px] border border-border p-2 text-foreground disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Cancellation Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(cancellingOrder)}
        onOpenChange={(open) => !open && setCancellingOrder(null)}
      >
        <AlertDialogContent className="max-w-md bg-white border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-lg font-normal text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              <span>Cancel Order {cancellingOrder?.orderNumber}?</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed pt-2">
              Are you sure you wish to cancel this order? The reserved inventory will be
              automatically restored to the atelier stock, and any active Shiprocket shipment will
              be halted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel
              disabled={isCancelLoading}
              className="text-xs uppercase tracking-wider"
            >
              Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={isCancelLoading}
              className="bg-rose-700 hover:bg-rose-800 text-white text-xs uppercase tracking-wider font-semibold"
            >
              {isCancelLoading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <span>Confirm Cancellation</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Review Submission Dialog */}
      {reviewTarget && (
        <WriteReviewModal
          isOpen={Boolean(reviewTarget)}
          onClose={() => setReviewTarget(null)}
          productId={reviewTarget.productId}
          orderId={reviewTarget.orderId}
          productName={reviewTarget.productName}
          onSuccess={() => {
            fetchOrders();
          }}
        />
      )}
    </div>
  );
}
