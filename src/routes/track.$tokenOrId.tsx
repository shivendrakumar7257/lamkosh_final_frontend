import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, ArrowLeft, Truck, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { LiveTrackingView } from "@/components/orders/LiveTrackingView";
import { orderService } from "@/api/orderService";
import { TrackingData } from "@/types/order";
import { getErrorMessage } from "@/lib/api";

export const Route = createFileRoute("/track/$tokenOrId")({
  head: () => ({
    meta: [
      { title: "Live Tracking — LaMoksh Atelier" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TrackSingleOrderPage,
});

function TrackSingleOrderPage() {
  const { tokenOrId } = Route.useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchTracking() {
      if (!tokenOrId) return;
      setLoading(true);
      setError(null);

      try {
        let data: TrackingData;
        if (tokenOrId.startsWith("tr_") || tokenOrId.length > 25) {
          data = await orderService.trackGuestOrder(tokenOrId);
        } else {
          try {
            data = await orderService.trackCustomerOrder(tokenOrId);
          } catch {
            data = await orderService.trackGuestOrder(tokenOrId);
          }
        }
        if (mounted) {
          setTrackingData(data);
        }
      } catch (err: unknown) {
        if (mounted) {
          // Fallback to guest order lookup
          try {
            const ord = await orderService.getGuestOrder(tokenOrId);
            setTrackingData({
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
            });
          } catch (e: unknown) {
            void e;
            setError(
              getErrorMessage(
                err,
                "Unable to retrieve tracking details for this order. It may not exist or has expired.",
              ),
            );
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTracking();
    return () => {
      mounted = false;
    };
  }, [tokenOrId]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        eyebrow="Live Telemetry"
        title="Shipment Tracking"
        intro="Live updates directly from Shiprocket courier partner hubs."
      />

      <div className="container-lux max-w-4xl py-10 md:py-16 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/track-order"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Search Another Order</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#28201C]/60" />
            <p className="body-lux mt-4 text-xs text-[#28201C]/80">
              Fetching live transit telemetry...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-sm border border-red-200 bg-red-50 p-8 text-center text-xs text-red-800">
            <AlertCircle className="mx-auto h-8 w-8 text-red-600 mb-2" />
            <h3 className="font-serif text-lg font-medium text-red-950">
              Tracking Information Unavailable
            </h3>
            <p className="mt-1 max-w-md mx-auto text-red-700/90 leading-relaxed">{error}</p>
            <div className="mt-4">
              <Link
                to="/track-order"
                className="inline-block bg-[#28201C] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5]"
              >
                Track by Order Number
              </Link>
            </div>
          </div>
        ) : trackingData ? (
          <LiveTrackingView data={trackingData} />
        ) : null}
      </div>
    </div>
  );
}
