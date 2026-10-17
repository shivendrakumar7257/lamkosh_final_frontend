import React, { useState, useEffect, useCallback } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Printer,
  Truck,
  CheckCircle,
  Clock,
  Package,
  MapPin,
  User,
  CreditCard,
  FileText,
  Save,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Loader2,
  XCircle,
  FileDown,
  Navigation,
  Send,
  Sliders,
} from "lucide-react";
import { adminOrderService } from "@/api/adminOrderService";
import {
  Order,
  OrderStatus,
  PaymentStatus,
  CourierServiceabilityItem,
  TrackingActivity,
} from "@/types/order";
import { formatPrice } from "@/data/catalog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders/$id")({
  component: AdminOrderDetailPage,
});

function AdminOrderDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Status updates
  const [status, setStatus] = useState<OrderStatus>("PENDING");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("PENDING");

  // Shipping form state
  const [weight, setWeight] = useState(0.5);
  const [length, setLength] = useState(10);
  const [breadth, setBreadth] = useState(10);
  const [height, setHeight] = useState(10);
  const [pickupLocation, setPickupLocation] = useState("Primary");

  // Serviceability check state
  const [serviceability, setServiceability] = useState<CourierServiceabilityItem[] | null>(null);
  const [checkingServiceability, setCheckingServiceability] = useState(false);
  const [selectedCourierId, setSelectedCourierId] = useState<number | null>(null);

  // Tracking activities
  const [activities, setActivities] = useState<TrackingActivity[]>([]);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminOrderService.getOrderById(id);
      setOrder(data);
      setStatus(data.status);
      setPaymentStatus(data.paymentStatus);
      if (data.shipment?.packageDetails) {
        if (data.shipment.packageDetails.weight) setWeight(data.shipment.packageDetails.weight);
        if (data.shipment.packageDetails.length) setLength(data.shipment.packageDetails.length);
        if (data.shipment.packageDetails.breadth) setBreadth(data.shipment.packageDetails.breadth);
        if (data.shipment.packageDetails.height) setHeight(data.shipment.packageDetails.height);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load order details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  // Update order / payment status
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setActionLoading(true);
    try {
      const updated = await adminOrderService.updateOrderStatus(order.id, {
        status,
        paymentStatus,
      });
      setOrder(updated);
      toast.success("Order status updated successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update order status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Courier serviceability check
  const handleCheckServiceability = async () => {
    if (!order) return;
    setCheckingServiceability(true);
    try {
      const res = await adminOrderService.checkServiceability({
        orderId: order.id,
        delivery_postcode: order.shippingAddress.pincode,
        weight,
        cod: order.paymentMethod === "CASH_ON_DELIVERY" ? 1 : 0,
      });
      const couriers = res.available_courier_companies || [];
      setServiceability(couriers);
      if (couriers.length > 0) {
        setSelectedCourierId(couriers[0].courier_company_id);
        toast.success(`Found ${couriers.length} serviceable courier partner(s).`);
      } else {
        toast.warning("No couriers available for this postal code.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to verify courier serviceability.");
    } finally {
      setCheckingServiceability(false);
    }
  };

  // Create Shiprocket shipment
  const handleCreateShipment = async () => {
    if (!order) return;
    setActionLoading(true);
    try {
      await adminOrderService.createShipment(order.id, {
        weight,
        length,
        breadth,
        height,
        pickupLocation,
      });
      toast.success("Shiprocket shipment generated successfully!");
      await loadOrder();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create Shiprocket shipment.");
    } finally {
      setActionLoading(false);
    }
  };

  // Assign AWB courier code
  const handleAssignAwb = async () => {
    if (!order || !selectedCourierId) {
      toast.error("Please select a courier partner first.");
      return;
    }
    setActionLoading(true);
    try {
      await adminOrderService.assignAwb(order.id, selectedCourierId);
      toast.success("AWB waybill assigned successfully!");
      await loadOrder();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to assign AWB waybill code.");
    } finally {
      setActionLoading(false);
    }
  };

  // Request Pickup
  const handleRequestPickup = async () => {
    if (!order) return;
    setActionLoading(true);
    try {
      await adminOrderService.requestPickup(order.id);
      toast.success("Courier pickup requested!");
      await loadOrder();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to schedule pickup.");
    } finally {
      setActionLoading(false);
    }
  };

  // Generate & Download Label
  const handleGenerateLabel = async () => {
    if (!order) return;
    setActionLoading(true);
    try {
      const res = await adminOrderService.generateLabel(order.id);
      if (res.labelUrl) {
        window.open(res.labelUrl, "_blank");
        toast.success("Shipping label generated!");
      }
      await loadOrder();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to generate shipping label.");
    } finally {
      setActionLoading(false);
    }
  };

  // Generate Manifest
  const handleGenerateManifest = async () => {
    if (!order) return;
    setActionLoading(true);
    try {
      const res = await adminOrderService.generateManifest(order.id);
      if (res.manifestUrl) {
        window.open(res.manifestUrl, "_blank");
        toast.success("Manifest generated!");
      }
      await loadOrder();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to generate shipment manifest.");
    } finally {
      setActionLoading(false);
    }
  };

  // Live Sync Tracking
  const handleSyncTracking = async () => {
    if (!order) return;
    setActionLoading(true);
    try {
      const res = await adminOrderService.syncTracking(order.id);
      if (res.trackingDetails?.shipment_track_activities) {
        setActivities(res.trackingDetails.shipment_track_activities);
      }
      toast.success("Live courier telemetry synced!");
      await loadOrder();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to sync tracking telemetry.");
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel Shipment
  const handleCancelShipment = async () => {
    if (!order) return;
    if (!confirm("Are you sure you want to cancel the Shiprocket shipment?")) return;
    setActionLoading(true);
    try {
      await adminOrderService.cancelShipment(order.id);
      toast.success("Shiprocket shipment cancelled.");
      await loadOrder();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to cancel shipment.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center bg-white border border-[#E7E5E4]">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#6B1D2F] mb-3" />
        <p className="text-xs text-[#78716C]">Loading order specifications and shipment state...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center bg-white border border-[#E7E5E4]">
        <h2 className="text-xl font-serif text-[#1C1917]">Order Not Found</h2>
        <p className="text-xs text-[#78716C] mt-2">No order matching identifier "{id}".</p>
        <button
          onClick={() => navigate({ to: "/admin/orders" as any })}
          className="mt-4 px-4 py-2 bg-[#6B1D2F] text-white text-xs uppercase font-semibold"
        >
          Return to Orders List
        </button>
      </div>
    );
  }

  const shipment = order.shipment;

  return (
    <div className="space-y-6 max-w-6xl mx-auto print:p-0 print:max-w-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-sm print:hidden">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate({ to: "/admin/orders" as any })}
            className="p-2 border border-[#E7E5E4] bg-white hover:bg-[#FAF8F5] text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-light text-[#1C1917] flex flex-wrap items-center gap-3">
              <span>Order: {order.orderNumber}</span>
              <span className="text-xs uppercase px-2.5 py-0.5 bg-stone-100 text-[#1C1917] border border-[#E7E5E4] font-sans font-semibold">
                {order.status}
              </span>
              <span className="text-xs uppercase px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-sans font-semibold">
                {order.paymentStatus}
              </span>
            </h1>
            <p className="text-xs text-[#78716C] mt-1 font-sans">
              Placed on {new Date(order.createdAt).toLocaleString("en-IN")} &bull;{" "}
              {order.customer?.customerType === "USER" ? "Registered User" : "Guest Checkout"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {order.trackingToken && (
            <Link
              to={`/track/${order.trackingToken}` as any}
              target="_blank"
              className="flex items-center space-x-2 px-4 py-2 border border-[#E7E5E4] text-[#1C1917] bg-white hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#6B1D2F]" />
              <span>Public Tracking</span>
            </Link>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-4 py-2 border border-[#E7E5E4] text-[#1C1917] bg-white hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-[#6B1D2F]" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Items & Financials & Shiprocket Operations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4] flex items-center space-x-2">
              <Package className="w-5 h-5 text-[#6B1D2F]" />
              <span>Purchased Pieces ({order.items.length})</span>
            </h2>

            <div className="divide-y divide-[#E7E5E4]">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-14 h-18 object-cover border border-[#E7E5E4] bg-[#FAF8F5]"
                      />
                    ) : (
                      <div className="w-14 h-18 flex items-center justify-center border border-[#E7E5E4] bg-[#FAF8F5]">
                        <Package className="w-5 h-5 text-[#A8A29E]" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif font-medium text-[#1C1917]">{item.productName}</h3>
                      <div className="text-xs text-[#78716C] mt-0.5 space-x-3">
                        {item.size && (
                          <span>
                            Size: <strong>{item.size}</strong>
                          </span>
                        )}
                        {item.color && (
                          <span>
                            Color: <strong>{item.color}</strong>
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#57534E] mt-1 font-mono">
                        {formatPrice(item.unitPrice)} × {item.quantity} unit(s)
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-semibold text-[#1C1917] font-mono">
                    {formatPrice(item.lineTotal || item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-3 text-xs">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4] flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#6B1D2F]" />
              <span>Payment & Financial Summary</span>
            </h2>

            <div className="flex justify-between py-1 text-[#57534E]">
              <span>Subtotal</span>
              <span className="font-mono">{formatPrice(order.subtotal)}</span>
            </div>

            <div className="flex justify-between py-1 text-[#57534E]">
              <span>Shipping Fee</span>
              <span className="font-mono text-emerald-700">
                {order.shippingCharge === 0 ? "FREE (₹0)" : formatPrice(order.shippingCharge)}
              </span>
            </div>

            <div className="pt-3 border-t border-[#E7E5E4] flex justify-between items-center text-sm font-bold text-[#1C1917]">
              <span>Total Amount</span>
              <span className="text-lg font-serif text-[#6B1D2F] font-mono">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Shiprocket Shipping & Logistics Operations Panel */}
          <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
              <h2 className="text-lg font-serif text-[#1C1917] flex items-center space-x-2">
                <Truck className="w-5 h-5 text-[#6B1D2F]" />
                <span>Shiprocket Logistics & Fulfillment</span>
              </h2>

              {shipment && (
                <button
                  type="button"
                  onClick={handleSyncTracking}
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 text-xs text-[#6B1D2F] hover:underline"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", actionLoading && "animate-spin")} />
                  <span>Sync Telemetry</span>
                </button>
              )}
            </div>

            {/* Shipment State Banner */}
            {shipment ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-[#FAF8F5] p-4 border border-[#E7E5E4] text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#78716C] block">
                      SHIPMENT STATUS
                    </span>
                    <span className="font-bold text-[#1C1917] mt-0.5 block">{shipment.status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#78716C] block">
                      COURIER PARTNER
                    </span>
                    <span className="font-medium text-[#1C1917] mt-0.5 block">
                      {shipment.courierName || "Not Assigned"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#78716C] block">
                      AWB CODE
                    </span>
                    <span className="font-mono text-[#1C1917] mt-0.5 block">
                      {shipment.awbCode || "Pending"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#78716C] block">
                      PACKAGE WEIGHT
                    </span>
                    <span className="text-[#1C1917] mt-0.5 block font-mono">
                      {shipment.packageDetails?.weight || weight} kg
                    </span>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {!shipment.awbCode && (
                    <button
                      type="button"
                      onClick={handleAssignAwb}
                      disabled={actionLoading || !selectedCourierId}
                      className="px-4 py-2 bg-[#1C1917] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#3d322c] disabled:opacity-50"
                    >
                      Assign AWB
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleRequestPickup}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-[#E7E5E4] bg-white text-[#1C1917] text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF8F5] disabled:opacity-50"
                  >
                    Request Pickup
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateLabel}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-4 py-2 border border-[#E7E5E4] bg-white text-[#1C1917] text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF8F5] disabled:opacity-50"
                  >
                    <FileDown className="w-3.5 h-3.5 text-[#6B1D2F]" />
                    <span>Download Label</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateManifest}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-4 py-2 border border-[#E7E5E4] bg-white text-[#1C1917] text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF8F5] disabled:opacity-50"
                  >
                    <FileDown className="w-3.5 h-3.5 text-[#6B1D2F]" />
                    <span>Download Manifest</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelShipment}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold uppercase tracking-wider hover:bg-rose-100 disabled:opacity-50"
                  >
                    Cancel Shipment
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#78716C]">
                  No Shiprocket courier shipment has been created for this order yet. Configure
                  package dimensions and check courier serviceability below.
                </p>

                {/* Package Dimensions Inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#78716C] uppercase">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full mt-1 border border-[#E7E5E4] p-2 bg-[#FAF8F5] font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#78716C] uppercase">
                      Length (cm)
                    </label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className="w-full mt-1 border border-[#E7E5E4] p-2 bg-[#FAF8F5] font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#78716C] uppercase">
                      Breadth (cm)
                    </label>
                    <input
                      type="number"
                      value={breadth}
                      onChange={(e) => setBreadth(Number(e.target.value))}
                      className="w-full mt-1 border border-[#E7E5E4] p-2 bg-[#FAF8F5] font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#78716C] uppercase">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full mt-1 border border-[#E7E5E4] p-2 bg-[#FAF8F5] font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCheckServiceability}
                    disabled={checkingServiceability}
                    className="px-4 py-2.5 border border-[#1C1917] bg-white text-[#1C1917] text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF8F5] disabled:opacity-50"
                  >
                    {checkingServiceability ? "Checking Couriers..." : "Check Serviceability"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateShipment}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-[#6B1D2F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#85233a] disabled:opacity-50 flex items-center gap-2"
                  >
                    {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Create Shiprocket Shipment</span>
                  </button>
                </div>

                {/* Serviceability Results */}
                {serviceability && serviceability.length > 0 && (
                  <div className="mt-4 border border-[#E7E5E4] p-4 bg-[#FAF8F5] space-y-3">
                    <span className="text-[11px] uppercase font-semibold text-[#1C1917] block">
                      Available Courier Partners:
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {serviceability.map((courier) => (
                        <label
                          key={courier.courier_company_id}
                          className="flex items-center justify-between p-2.5 bg-white border border-[#E7E5E4] text-xs cursor-pointer hover:border-[#6B1D2F]"
                        >
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="courierSelection"
                              checked={selectedCourierId === courier.courier_company_id}
                              onChange={() => setSelectedCourierId(courier.courier_company_id)}
                              className="text-[#6B1D2F]"
                            />
                            <span className="font-semibold text-[#1C1917]">
                              {courier.courier_name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs font-mono">
                            <span>Rate: ₹{courier.rate}</span>
                            {courier.etd && (
                              <span className="text-[#78716C]">ETD: {courier.etd}</span>
                            )}
                            {courier.rating && (
                              <span className="text-amber-700">★ {courier.rating}</span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer Info & Status Controls */}
        <div className="space-y-6">
          {/* Customer & Address Details */}
          <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4] flex items-center space-x-2">
              <User className="w-5 h-5 text-[#6B1D2F]" />
              <span>Customer Details</span>
            </h2>

            <div className="text-xs space-y-2 text-[#57534E]">
              <div className="font-semibold text-[#1C1917] text-sm">{order.customer?.name}</div>
              <div>Email: {order.customer?.email || "Guest (No email provided)"}</div>
              <div className="font-mono">Mobile: +91 {order.customer?.mobileNumber}</div>
              <div>
                Type:{" "}
                <span className="font-semibold text-[#1C1917]">
                  {order.customer?.customerType === "USER" ? "Registered User" : "Guest Customer"}
                </span>
              </div>

              <div className="pt-3 border-t border-[#E7E5E4]">
                <div className="font-semibold text-[#1C1917] uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#6B1D2F]" />
                  <span>Delivery Address</span>
                </div>
                <div className="leading-relaxed">
                  {order.shippingAddress.fullAddress || order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city ? `${order.shippingAddress.city}, ` : ""}
                  {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </div>
              </div>
            </div>
          </div>

          {/* Status Pipeline Update Form */}
          <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4] flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-[#6B1D2F]" />
              <span>Pipeline & Status Controls</span>
            </h2>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#78716C] uppercase mb-1">
                  Fulfillment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full p-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#78716C] uppercase mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full p-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="FAILED">FAILED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1C1917] text-white uppercase text-xs font-semibold tracking-wider hover:bg-[#3d322c] disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Update Status</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
