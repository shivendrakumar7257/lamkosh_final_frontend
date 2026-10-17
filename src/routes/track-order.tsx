import { useState, useEffect, useCallback } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Search, Loader2, Package, ArrowRight, Truck } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { LiveTrackingView } from "@/components/orders/LiveTrackingView";
import { orderService, StoredGuestOrder } from "@/api/orderService";
import { TrackingData } from "@/types/order";
import { getErrorMessage } from "@/lib/api";
import { toast } from "sonner";

interface TrackOrderSearch {
  token?: string;
  ref?: string;
}

export const Route = createFileRoute("/track-order")({
  validateSearch: (search: Record<string, unknown>): TrackOrderSearch => {
    return {
      token: (search.token as string) || undefined,
      ref: (search.ref as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Track Your Order — LaMoksh Atelier" },
      {
        name: "description",
        content:
          "Live Shiprocket courier tracking and delivery milestones for your LaMoksh pieces.",
      },
      { property: "og:title", content: "Track Your Order — LaMoksh Atelier" },
    ],
  }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  const search = useSearch({ from: "/track-order" });
  const [query, setQuery] = useState(search.token || search.ref || "");
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [storedGuestOrders, setStoredGuestOrders] = useState<StoredGuestOrder[]>([]);
  const [searched, setSearched] = useState(false);

  // Load guest orders from localStorage on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("guest_orders") || "[]");
      if (Array.isArray(stored)) {
        setStoredGuestOrders(stored);
      }
    } catch (e) {
      void e;
    }
  }, []);

  const executeTrack = useCallback(
    async (searchStr: string) => {
      const term = searchStr.trim();
      if (!term) {
        toast.error("Please enter your Order Reference or Tracking Token.");
        return;
      }

      setLoading(true);
      setSearched(true);
      try {
        let data: TrackingData | null = null;

        // 1. If term starts with tr_ or looks like token, try guest track endpoint
        if (term.startsWith("tr_") || term.length > 25) {
          try {
            data = await orderService.trackGuestOrder(term);
          } catch {
            // Fallback: try getting full order then extracting tracking data
            const ord = await orderService.getGuestOrder(term);
            data = {
              orderId: ord.id,
              orderNumber: ord.orderNumber,
              orderStatus: ord.status,
              paymentStatus: ord.paymentStatus,
              paymentMethod: ord.paymentMethod,
              shipment: ord.shipment,
              trackingDetails: ord.shipment
                ? {
                    awb_code: ord.shipment.awbCode || undefined,
                    courier_name: ord.shipment.courierName || undefined,
                    tracking_url: ord.shipment.trackingUrl || undefined,
                    shipment_status_label: ord.shipment.status,
                  }
                : null,
            };
          }
        } else {
          // 2. Check if this reference matches one of our stored guest tokens
          const matched = storedGuestOrders.find(
            (item) => item.orderNumber.toLowerCase() === term.toLowerCase(),
          );
          if (matched?.token) {
            data = await orderService.trackGuestOrder(matched.token);
          } else {
            // 3. Try customer track endpoint (works if logged in and term is orderId)
            try {
              data = await orderService.trackCustomerOrder(term);
            } catch {
              // 4. Try guest order lookup as token directly
              data = await orderService.trackGuestOrder(term);
            }
          }
        }

        setTrackingData(data);
      } catch (err: unknown) {
        setTrackingData(null);
        toast.error(
          getErrorMessage(
            err,
            "Could not locate tracking information for this reference. Please verify and try again.",
          ),
        );
      } finally {
        setLoading(false);
      }
    },
    [storedGuestOrders],
  );

  // If query passed in URL params, auto-execute tracking
  useEffect(() => {
    if (search.token) {
      executeTrack(search.token);
    } else if (search.ref) {
      executeTrack(search.ref);
    }
  }, [search.token, search.ref, executeTrack]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeTrack(query);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        eyebrow="Client Concierge"
        title="Live Order Tracking"
        intro="Follow your handcrafted textile garments from our master weavers to your doorstep."
      />

      <div className="container-lux max-w-4xl py-12 md:py-16 space-y-12">
        {/* Search Input Bar */}
        <div className="mx-auto max-w-2xl rounded-sm border border-border/80 bg-background p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground">
              Enter Order Reference or Tracking Token
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. LAM-20261017-XXXXXX or tr_6f3e82..."
                  className="w-full border border-border bg-[#FAF8F5] pl-10 pr-4 py-3 text-xs font-mono text-foreground focus:bg-white focus:outline-none focus:ring-1 focus:ring-espresso"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-[#28201C] px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] transition-colors hover:bg-[#3d322c] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Track</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
            <p className="text-[0.68rem] text-muted-foreground">
              You can find your reference code in your order confirmation email or SMS.
            </p>
          </form>

          {/* Quick Select from Saved Guest Orders */}
          {storedGuestOrders.length > 0 && (
            <div className="mt-6 border-t border-border/60 pt-4">
              <span className="text-[0.68rem] uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
                Recently Placed on this Browser:
              </span>
              <div className="flex flex-wrap gap-2">
                {storedGuestOrders.map((item) => (
                  <button
                    key={item.token}
                    type="button"
                    onClick={() => {
                      setQuery(item.token);
                      executeTrack(item.token);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-[2px] border border-border bg-[#FAF8F5] px-3 py-1.5 text-xs font-mono text-foreground hover:border-espresso hover:bg-champagne/40 transition-colors"
                  >
                    <Package className="h-3 w-3 text-espresso" />
                    <span>{item.orderNumber}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Tracking Result */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#28201C]/60" />
            <p className="body-lux mt-4 text-xs text-[#28201C]/80">
              Querying Shiprocket telemetry network...
            </p>
          </div>
        ) : trackingData ? (
          <LiveTrackingView data={trackingData} />
        ) : searched ? (
          <div className="mx-auto max-w-lg rounded-sm border border-border bg-[#FAF8F5] p-8 text-center text-xs">
            <Truck className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <h3 className="font-serif text-lg text-foreground mt-2">No Tracking Record Found</h3>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              We couldn&apos;t find live logistics updates for the provided identifier. Please
              ensure the reference is correct or contact our atelier team at{" "}
              <a href="mailto:care@lamoksh.in" className="text-espresso underline">
                care@lamoksh.in
              </a>
              .
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
