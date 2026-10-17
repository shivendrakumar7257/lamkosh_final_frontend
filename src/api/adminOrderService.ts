import { apiClient, ApiResponse } from "./apiClient";
import {
  Order,
  OrderStatus,
  PaymentStatus,
  Shipment,
  TrackingData,
  CourierServiceabilityResponse,
  OrdersListResponse,
} from "@/types/order";

export interface AdminOrdersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus | "ALL" | "";
  paymentStatus?: PaymentStatus | "ALL" | "";
  sortBy?: "newest" | "oldest";
}

export interface ShipmentDimensionPayload {
  weight?: number;
  length?: number;
  breadth?: number;
  height?: number;
  pickupLocation?: string;
}

export const adminOrderService = {
  // 1. Admin Orders List with filters & pagination
  getOrders: async (query: AdminOrdersQuery = {}): Promise<OrdersListResponse> => {
    const params = new URLSearchParams();
    if (query.page) params.append("page", String(query.page));
    if (query.limit) params.append("limit", String(query.limit));
    if (query.search?.trim()) params.append("search", query.search.trim());
    if (query.status && query.status !== "ALL") params.append("status", query.status);
    if (query.paymentStatus && query.paymentStatus !== "ALL")
      params.append("paymentStatus", query.paymentStatus);
    if (query.sortBy) params.append("sortBy", query.sortBy);

    const res = await apiClient.get<ApiResponse<OrdersListResponse>>(
      `/admin/orders?${params.toString()}`,
    );
    return (
      res.data.data || {
        orders: [],
        pagination: { page: 1, limit: 10, totalCount: 0, totalPages: 0 },
      }
    );
  },

  // Get single order for admin
  getOrderById: async (orderId: string): Promise<Order> => {
    const res = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return res.data.data;
  },

  // 2. Update Order Status & Payment Status
  updateOrderStatus: async (
    orderId: string,
    data: { status?: OrderStatus; paymentStatus?: PaymentStatus },
  ): Promise<Order> => {
    const res = await apiClient.patch<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, data);
    return res.data.data;
  },

  // 3. Courier Serviceability Check
  checkServiceability: async (params: {
    delivery_postcode?: string;
    weight?: number;
    cod?: number;
    orderId?: string;
  }): Promise<CourierServiceabilityResponse> => {
    const query = new URLSearchParams();
    if (params.delivery_postcode) query.append("delivery_postcode", params.delivery_postcode);
    if (params.weight !== undefined) query.append("weight", String(params.weight));
    if (params.cod !== undefined) query.append("cod", String(params.cod));
    if (params.orderId) query.append("orderId", params.orderId);

    const res = await apiClient.get<ApiResponse<CourierServiceabilityResponse>>(
      `/admin/shipping/serviceability?${query.toString()}`,
    );
    return res.data.data;
  },

  // 4. Create Shiprocket Shipment
  createShipment: async (
    orderId: string,
    payload: ShipmentDimensionPayload = {},
  ): Promise<{ shipment: Shipment; [key: string]: any }> => {
    const res = await apiClient.post<ApiResponse<any>>(
      `/admin/shipping/orders/${orderId}/create`,
      payload,
    );
    return res.data.data;
  },

  // Retry Shiprocket Shipment
  retryShipment: async (
    orderId: string,
    payload: ShipmentDimensionPayload = {},
  ): Promise<{ shipment: Shipment; [key: string]: any }> => {
    const res = await apiClient.post<ApiResponse<any>>(
      `/admin/shipping/orders/${orderId}/retry`,
      payload,
    );
    return res.data.data;
  },

  // 5. Assign AWB Courier Code
  assignAwb: async (
    orderId: string,
    courierId: number,
  ): Promise<{ awbCode?: string; shipment: Shipment }> => {
    const res = await apiClient.post<ApiResponse<any>>(
      `/admin/shipping/orders/${orderId}/assign-awb`,
      { courierId },
    );
    return res.data.data;
  },

  // 6. Request Pickup
  requestPickup: async (orderId: string): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>(
      `/admin/shipping/orders/${orderId}/generate-pickup`,
    );
    return res.data.data;
  },

  // 7. Generate Printable Shipping Label
  generateLabel: async (orderId: string): Promise<{ labelUrl: string; shipment: Shipment }> => {
    const res = await apiClient.post<ApiResponse<{ labelUrl: string; shipment: Shipment }>>(
      `/admin/shipping/orders/${orderId}/generate-label`,
    );
    return res.data.data;
  },

  // 8. Generate Manifest
  generateManifest: async (
    orderId: string,
  ): Promise<{ manifestUrl: string; shipment: Shipment }> => {
    const res = await apiClient.post<ApiResponse<{ manifestUrl: string; shipment: Shipment }>>(
      `/admin/shipping/orders/${orderId}/generate-manifest`,
    );
    return res.data.data;
  },

  // 9. Admin Live Sync / Track
  syncTracking: async (orderId: string): Promise<TrackingData> => {
    const res = await apiClient.post<ApiResponse<TrackingData>>(
      `/admin/shipping/orders/${orderId}/sync`,
    );
    return res.data.data;
  },

  // 10. Cancel Shipment
  cancelShipment: async (orderId: string): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>(`/admin/shipping/orders/${orderId}/cancel`);
    return res.data.data;
  },
};

export default adminOrderService;
