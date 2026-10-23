import React from "react";
import {
  Package,
  CheckCircle,
  Truck,
  MapPin,
  Clock,
  ExternalLink,
  AlertCircle,
  XCircle,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { TrackingData, OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";

interface LiveTrackingViewProps {
  data: TrackingData;
  className?: string;
}

const STEPS = [
  { key: "PLACED", label: "Order Placed", desc: "Received at LaMoksh" },
  { key: "CONFIRMED", label: "Confirmed", desc: "Crafting & packaging" },
  { key: "SHIPPED", label: "In Transit", desc: "Handed over to courier" },
  { key: "OUT_FOR_DELIVERY", label: "Out For Delivery", desc: "Reaching your doorstep" },
  { key: "DELIVERED", label: "Delivered", desc: "Delivered to client" },
];

export function LiveTrackingView({ data, className }: LiveTrackingViewProps) {
  const isCancelled = data.orderStatus === "CANCELLED" || data.shipment?.status === "CANCELLED";

  // Determine current active stepper step
  const getActiveStepIndex = (): number => {
    if (isCancelled) return -1;
    if (data.orderStatus === "DELIVERED" || data.shipment?.status === "DELIVERED") return 4;
    if (data.shipment?.status === "OUT_FOR_DELIVERY") return 3;
    if (
      data.orderStatus === "SHIPPED" ||
      data.shipment?.status === "IN_TRANSIT" ||
      data.shipment?.status === "PICKED_UP" ||
      data.shipment?.status === "AWB_ASSIGNED"
    )
      return 2;
    if (data.orderStatus === "CONFIRMED" || data.orderStatus === "PROCESSING") return 1;
    return 0; // PENDING
  };

  const activeStep = getActiveStepIndex();

  const shipment = data.shipment;
  const trackingDetails = data.trackingDetails;
  const courierName =
    trackingDetails?.courier_name || shipment?.courierName || "Shiprocket Logistics";
  const awbCode = trackingDetails?.awb_code || shipment?.awbCode;
  const trackingUrl = trackingDetails?.tracking_url || shipment?.trackingUrl;
  const activities = trackingDetails?.shipment_track_activities || [];

  return (
    <div className={cn("space-y-8", className)}>
      {/* Status Overview Card */}
      <div className="rounded-sm border border-border/80 bg-background p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <span className="text-[0.68rem] uppercase tracking-widest text-muted-foreground font-semibold">
              LIVE SHIPMENT STATUS
            </span>
            <h3 className="font-serif text-2xl font-normal text-foreground mt-0.5">
              Order {data.orderNumber}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Payment Status:{" "}
              <span className="font-medium text-foreground uppercase tracking-wider text-[0.68rem]">
                {data.paymentStatus} (
                {data.paymentMethod === "ONLINE" ? "Online Prepaid" : "Cash on Delivery"})
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isCancelled ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3.5 py-1 text-xs font-semibold text-rose-800">
                <XCircle className="h-4 w-4" /> Cancelled
              </span>
            ) : activeStep === 4 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold text-emerald-800">
                <CheckCircle className="h-4 w-4" /> Delivered
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-900">
                <Truck className="h-4 w-4 text-amber-700" />
                {trackingDetails?.shipment_status_label ||
                  (shipment?.status ? shipment.status.replace(/_/g, " ") : "In Processing")}
              </span>
            )}
          </div>
        </div>

        {/* Visual Progress Stepper */}
        <div className="pt-8 pb-4">
          {isCancelled ? (
            <div className="flex items-center gap-3 rounded-[2px] border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              <div>
                <span className="font-semibold">This order has been cancelled.</span>
                <p className="mt-0.5 text-rose-700/90 leading-relaxed">
                  The fulfillment was halted and any active courier pickup has been cancelled. If
                  payment was debited online, it will be automatically refunded to your original
                  source.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Stepper bar background */}
              <div className="absolute top-4 left-6 right-6 hidden md:block h-0.5 bg-border -z-0">
                <div
                  className="h-full bg-espresso transition-all duration-500"
                  style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
                />
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative z-10">
                {STEPS.map((step, idx) => {
                  const isDone = idx < activeStep;
                  const isCurrent = idx === activeStep;
                  return (
                    <div
                      key={step.key}
                      className={cn(
                        "flex md:flex-col items-center md:items-center md:text-center gap-3 md:gap-2",
                        isCurrent
                          ? "text-espresso"
                          : isDone
                            ? "text-foreground"
                            : "text-muted-foreground/60",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all",
                          isCurrent
                            ? "bg-espresso text-ivory ring-4 ring-espresso/20"
                            : isDone
                              ? "bg-espresso text-ivory"
                              : "border-2 border-border bg-background text-muted-foreground",
                        )}
                      >
                        {isDone ? <CheckCircle className="h-4 w-4" /> : <span>{idx + 1}</span>}
                      </div>

                      <div>
                        <p
                          className={cn(
                            "text-xs font-semibold uppercase tracking-wider",
                            isCurrent && "text-espresso",
                          )}
                        >
                          {step.label}
                        </p>
                        <p className="text-[0.68rem] text-muted-foreground hidden md:block">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Courier & AWB Waybill Details Card */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3 rounded-sm border border-border/60 bg-[#FAF8F5] p-5 text-xs">
          <div>
            <span className="text-[0.68rem] uppercase tracking-wider text-muted-foreground block font-semibold">
              COURIER PARTNER
            </span>
            <div className="mt-1 flex items-center gap-1.5 font-medium text-foreground">
              <Truck className="h-4 w-4 text-espresso" />
              <span>{courierName}</span>
            </div>
          </div>

          <div>
            <span className="text-[0.68rem] uppercase tracking-wider text-muted-foreground block font-semibold">
              AWB WAYBILL TRACKING NO.
            </span>
            <div className="mt-1 font-mono font-medium text-foreground">
              {awbCode ? (
                <span>{awbCode}</span>
              ) : (
                <span className="text-muted-foreground italic">Pending Waybill Assignment</span>
              )}
            </div>
          </div>

          <div className="sm:text-right flex sm:justify-end items-center">
            {trackingUrl ? (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 bg-[#28201C] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] transition-colors hover:bg-[#3d322c]"
              >
                <span>Courier Portal</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : awbCode ? (
              <a
                href={`https://shiprocket.co/tracking/${awbCode}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 bg-[#28201C] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] transition-colors hover:bg-[#3d322c]"
              >
                <span>Shiprocket Portal</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="text-[0.68rem] text-muted-foreground">
                Live URL available upon courier scan
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Shipment Activities Full Timeline */}
      <div className="rounded-sm border border-border/80 bg-background p-6 md:p-8 shadow-sm">
        <div className="border-b border-border/60 pb-4">
          <h4 className="font-serif text-lg font-medium text-foreground">
            Shipment Transit History
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time telemetry scan events reported by Shiprocket courier hubs.
          </p>
        </div>

        {activities.length > 0 ? (
          <div className="mt-6 relative pl-6 space-y-6 before:absolute before:bottom-2 before:top-2 before:left-[11px] before:w-0.5 before:bg-border">
            {activities.map((act, index) => (
              <div key={index} className="relative flex items-start gap-4 text-xs">
                {/* Dot */}
                <div
                  className={cn(
                    "absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-background ring-2",
                    index === 0
                      ? "bg-espresso ring-espresso/30"
                      : "bg-muted-foreground ring-muted-foreground/20",
                  )}
                />

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-foreground uppercase tracking-wider text-[0.7rem]">
                      {act.status || act.activity}
                    </span>
                    <span className="font-mono text-[0.68rem] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {act.date}
                    </span>
                  </div>

                  <p className="text-muted-foreground">{act.activity}</p>

                  {act.location && (
                    <div className="flex items-center gap-1 text-[0.68rem] text-muted-foreground/80 font-medium">
                      <MapPin className="h-3 w-3 text-espresso" />
                      <span>{act.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 text-center py-8 bg-[#FAF8F5] rounded-sm border border-border/60">
            <Clock className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <p className="mt-2 text-xs font-medium text-foreground">
              Awaiting First Courier Hub Scan
            </p>
            <p className="text-[0.68rem] text-muted-foreground mt-1 max-w-sm mx-auto">
              Waybill information has been notified to {courierName}. Real-time tracking check-ins
              will automatically appear here once the package is scanned at the hub.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveTrackingView;
