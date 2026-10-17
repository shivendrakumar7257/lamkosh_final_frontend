// Status Enums
export type OrderStatus =
  "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod = "CASH_ON_DELIVERY" | "ONLINE";

export type ShipmentStatus =
  | "PENDING"
  | "ORDER_CREATED"
  | "AWB_ASSIGNED"
  | "PICKUP_SCHEDULED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "FAILED";

// Checkout Form Payload
export interface CheckoutPayload {
  name: string; // 2 - 100 characters
  mobileNumber: string; // 10-digit Indian mobile regex: /^[6-9]\d{9}$/
  email?: string | null; // Optional. If provided for guest, account is auto-created!
  address: string; // 3 - 500 characters
  fullAddress?: string; // Optional detailed address
  landmark?: string; // Optional
  district?: string; // Optional
  homeTown?: string; // Optional
  city?: string; // Optional (fallbacks: district or homeTown)
  state: string; // Required
  pincode: string; // Exactly 6 digits: /^\d{6}$/
  paymentMethod?: PaymentMethod; // 'CASH_ON_DELIVERY' (default) or 'ONLINE'
}

// Order Item Snapshot
export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  description: string;
  color?: string | null;
  size?: string | null;
  quantity: number;
  unitBasePrice: number;
  unitPrice: number;
  gst: number;
  lineTotal: number;
  productImage?: string | null;
}

// Shipping Address Snapshot
export interface ShippingAddress {
  name: string;
  mobileNumber: string;
  email?: string | null;
  address: string;
  fullAddress: string;
  landmark?: string | null;
  district?: string | null;
  homeTown?: string | null;
  city?: string | null;
  state: string;
  pincode: string;
}

export interface PackageDetails {
  weight?: number | null;
  length?: number | null;
  breadth?: number | null;
  height?: number | null;
}

// Shipment Record
export interface Shipment {
  id: string;
  orderId: string;
  shiprocketOrderId?: string | null;
  shiprocketShipmentId?: string | null;
  awbCode?: string | null;
  courierName?: string | null;
  courierId?: number | null;
  status: ShipmentStatus;
  trackingUrl?: string | null;
  labelUrl?: string | null;
  manifestUrl?: string | null;
  pickupStatus?: string | null;
  pickupTokenNumber?: string | null;
  pickupScheduledDate?: string | null;
  lastTrackingUpdate?: string | null;
  errorMessage?: string | null;
  packageDetails: PackageDetails;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCustomer {
  name: string;
  email: string | null;
  mobileNumber: string;
  customerType: "USER" | "GUEST";
  userId: string | null;
}

// Order Entity
export interface Order {
  id: string;
  orderNumber: string; // e.g. "LAM-20261017-ABC123"
  trackingToken: string; // e.g. "tr_0a9b8c..."
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  customer: OrderCustomer;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shipment: Shipment | null;
  subtotal: number;
  discount: number;
  shippingCharge: number;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

// Tracking Activity & Details
export interface TrackingActivity {
  date: string;
  status: string;
  activity: string;
  location: string;
}

export interface TrackingDetails {
  track_status?: number;
  shipment_status_label?: string;
  awb_code?: string;
  courier_name?: string;
  tracking_url?: string;
  shipment_track_activities?: TrackingActivity[];
}

export interface TrackingData {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shipment: Shipment | null;
  trackingDetails?: TrackingDetails | null;
}

export interface OrdersPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface OrdersListResponse {
  orders: Order[];
  pagination: OrdersPagination;
}

export interface CourierServiceabilityItem {
  courier_company_id: number;
  courier_name: string;
  rate: number;
  rating?: number | string;
  etd?: string;
  estimated_delivery_days?: number | string;
  cod?: number;
}

export interface CourierServiceabilityResponse {
  available_courier_companies?: CourierServiceabilityItem[];
  recommended_courier_company_id?: number;
  [key: string]: unknown;
}
