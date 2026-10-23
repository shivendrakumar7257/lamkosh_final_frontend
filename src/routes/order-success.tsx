import { useEffect, useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  CheckCircle,
  Truck,
  ArrowRight,
  Package,
  Mail,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { orderService } from "@/api/orderService";
import { Order } from "@/types/order";
import { formatPrice } from "@/data/catalog";
import subcategoryBannerBg from "@/assets/subcategory-banner-bg.png";
import { toast } from "sonner";

interface OrderSuccessSearch {
  orderId?: string;
  token?: string;
  orderNumber?: string;
  hasEmail?: string;
}

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>): OrderSuccessSearch => {
    return {
      orderId: (search.orderId as string) || undefined,
      token: (search.token as string) || undefined,
      orderNumber: (search.orderNumber as string) || undefined,
      hasEmail: (search.hasEmail as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Order Confirmed — LaMoksh" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const search = useSearch({ from: "/order-success" });
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const orderNumber = search.orderNumber || order?.orderNumber || "LAM-ORDER";
  const token = search.token || order?.trackingToken || "";
  const orderId = search.orderId || order?.id || "";
  const hasEmail = search.hasEmail === "true" || Boolean(order?.customer?.email);

  useEffect(() => {
    // If we have a tracking token or orderId, fetch full snapshot
    async function fetchOrder() {
      if (token) {
        try {
          setLoading(true);
          const data = await orderService.getGuestOrder(token);
          setOrder(data);
        } catch {
          // If guest lookup fails, try authenticated getOrderById if orderId present
          if (orderId) {
            try {
              const data = await orderService.getOrderById(orderId);
              setOrder(data);
            } catch (e) {
              console.warn("Could not fetch full order details:", e);
            }
          }
        } finally {
          setLoading(false);
        }
      } else if (orderId) {
        try {
          setLoading(true);
          const data = await orderService.getOrderById(orderId);
          setOrder(data);
        } catch (e) {
          console.warn("Could not fetch full order details:", e);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchOrder();
  }, [token, orderId]);

  const copyOrderNumber = () => {
    if (!orderNumber) return;
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    toast.success("Order reference copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Editorial Luxury Header Banner */}
      <section className="relative flex min-h-[220px] items-center overflow-hidden border-b border-border/80 py-12 md:min-h-[260px]">
        <img
          src={subcategoryBannerBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#28201C]/45 backdrop-brightness-90" />
        <div className="container-lux relative z-10 text-center text-ivory">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700/80 text-ivory ring-4 ring-emerald-500/30">
            <CheckCircle className="h-7 w-7" />
          </div>
          <p className="eyebrow uppercase tracking-[0.22em] text-ivory/85">ORDER CONFIRMED</p>
          <h1 className="mt-2 font-serif text-3xl font-normal text-ivory sm:text-4xl md:text-5xl">
            Thank You For Your Order
          </h1>
          <p className="mt-2 font-serif text-sm italic text-ivory/95">
            Your artisanal garment is now being prepared at LaMoksh.
          </p>
        </div>
      </section>

      <div className="container-lux max-w-3xl py-12 md:py-16">
        {/* Main Success Card */}
        <div className="rounded-sm border border-border/80 bg-background p-6 md:p-10 shadow-sm space-y-8">
          {/* Order Reference Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <span className="text-[0.68rem] uppercase tracking-widest text-muted-foreground font-semibold">
                ORDER REFERENCE NUMBER
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-xl md:text-2xl font-bold text-foreground">
                  {orderNumber}
                </span>
                <button
                  type="button"
                  onClick={copyOrderNumber}
                  title="Copy reference number"
                  className="rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Payment: {order?.paymentMethod === "ONLINE" ? "Online Prepaid" : "Cash on Delivery"}
              </span>
            </div>
          </div>

          {/* Guest Account Auto-Created Alert Requirement */}
          {hasEmail && (
            <div className="flex items-start gap-3 rounded-[2px] border border-emerald-300 bg-emerald-50/80 p-4 text-xs text-emerald-950">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
              <div>
                <p className="font-semibold text-emerald-900">
                  We've created an account for you! Check your email for login details.
                </p>
                <p className="mt-1 text-emerald-800/80 leading-relaxed">
                  A temporary password and receipt have been dispatched to your email address. You
                  can sign in at any time to review your order history and manage your LaMoksh
                  wardrobe.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              to="/track-order"
              search={token ? { token } : { ref: orderNumber }}
              className="flex items-center justify-center gap-2 bg-[#28201C] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] transition-colors hover:bg-[#3d322c]"
            >
              <Truck className="h-4 w-4" />
              <span>Track Shipment Live</span>
            </Link>

            <Link
              to="/"
              className="flex items-center justify-center gap-2 border border-border bg-background px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-muted"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Detailed Order Snapshot if loaded */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-espresso" />
            </div>
          ) : order ? (
            <div className="border-t border-border/60 pt-6 space-y-6">
              <h3 className="font-serif text-lg font-medium text-foreground">Order Items</h3>
              <div className="divide-y divide-border/50">
                {order.items.map((it) => (
                  <div key={it.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {it.productImage && (
                        <img
                          src={it.productImage}
                          alt={it.productName}
                          className="h-12 w-10 object-cover rounded-[2px] border border-border/50"
                        />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{it.productName}</p>
                        <p className="text-[0.68rem] text-muted-foreground">
                          {it.size && `Size: ${it.size} `}
                          {it.color && `Color: ${it.color} `}
                          &bull; Qty: {it.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-medium text-foreground">
                      {formatPrice(it.lineTotal || it.unitPrice * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Address Snapshot */}
              <div className="grid sm:grid-cols-2 gap-4 rounded-sm border border-border/60 bg-[#FAF8F5] p-4 text-xs">
                <div>
                  <span className="font-semibold uppercase tracking-wider text-[0.68rem] text-muted-foreground block mb-1">
                    DELIVERY ADDRESS
                  </span>
                  <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
                  <p className="text-muted-foreground mt-0.5">
                    {order.shippingAddress.fullAddress || order.shippingAddress.address}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city ? `${order.shippingAddress.city}, ` : ""}
                    {order.shippingAddress.state} — {order.shippingAddress.pincode}
                  </p>
                  <p className="font-mono text-muted-foreground mt-1">
                    Mobile: +91 {order.shippingAddress.mobileNumber}
                  </p>
                </div>

                <div className="sm:text-right flex flex-col justify-between">
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-[0.68rem] text-muted-foreground block mb-1">
                      TOTAL SUMMARY
                    </span>
                    <p className="text-muted-foreground">Subtotal: {formatPrice(order.subtotal)}</p>
                    <p className="text-emerald-700">Shipping: Complimentary (₹0)</p>
                    <p className="font-serif text-base font-bold text-foreground mt-1">
                      Total: {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Fulfillment Roadmap Steps */}
          <div className="border-t border-border/60 pt-6">
            <h4 className="font-serif text-sm uppercase tracking-wider text-muted-foreground mb-4">
              What to Expect Next
            </h4>
            <div className="grid gap-4 sm:grid-cols-3 text-xs text-muted-foreground">
              <div className="border-l-2 border-espresso pl-3 space-y-1">
                <span className="font-semibold text-foreground block">
                  1. Tailoring & Inspection
                </span>
                <p className="text-[0.68rem] leading-relaxed">
                  Each weave is examined for impeccable thread finish and packaged in LaMoksh dust
                  covers.
                </p>
              </div>
              <div className="border-l-2 border-espresso pl-3 space-y-1">
                <span className="font-semibold text-foreground block">
                  2. Shiprocket Courier Dispatch
                </span>
                <p className="text-[0.68rem] leading-relaxed">
                  AWB waybill assigned with SMS alerts and real-time transit telemetry.
                </p>
              </div>
              <div className="border-l-2 border-espresso pl-3 space-y-1">
                <span className="font-semibold text-foreground block">3. White-Glove Handover</span>
                <p className="text-[0.68rem] leading-relaxed">
                  Delivered straight to your doorstep with easy verification and care support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
