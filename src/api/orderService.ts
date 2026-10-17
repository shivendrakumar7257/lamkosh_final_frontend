import { apiClient, ApiResponse } from "./apiClient";
import { Order, CheckoutPayload, TrackingData, OrdersListResponse } from "@/types/order";

export interface StoredGuestOrder {
  orderNumber: string;
  token: string;
  createdAt: string;
}

export const orderService = {
  // 1. Submit checkout & create order
  placeOrder: async (payload: CheckoutPayload): Promise<Order> => {
    const res = await apiClient.post<ApiResponse<Order>>("/orders", payload);
    const order = res.data.data;

    // If guest or has trackingToken, save tracking token for instant order tracking
    if (typeof window !== "undefined" && order && order.trackingToken) {
      try {
        const storedTokens: StoredGuestOrder[] = JSON.parse(
          localStorage.getItem("guest_orders") || "[]",
        );
        // Avoid duplicate entries
        const existingIdx = storedTokens.findIndex(
          (item) => item.token === order.trackingToken || item.orderNumber === order.orderNumber,
        );
        if (existingIdx >= 0) {
          storedTokens[existingIdx] = {
            orderNumber: order.orderNumber,
            token: order.trackingToken,
            createdAt: order.createdAt || new Date().toISOString(),
          };
        } else {
          storedTokens.unshift({
            orderNumber: order.orderNumber,
            token: order.trackingToken,
            createdAt: order.createdAt || new Date().toISOString(),
          });
        }
        localStorage.setItem("guest_orders", JSON.stringify(storedTokens.slice(0, 20)));
      } catch (err) {
        console.warn("Failed to save guest order token to localStorage:", err);
      }

      // Notify cart to refresh since the backend clears cart on checkout
      window.dispatchEvent(new CustomEvent("cart:refresh"));
    }

    return order;
  },

  // 2. Customer: Get orders history with pagination
  getUserOrders: async (page = 1, limit = 10, status?: string): Promise<OrdersListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status && status !== "ALL") {
      params.append("status", status);
    }
    const res = await apiClient.get<ApiResponse<OrdersListResponse>>(
      `/orders?${params.toString()}`,
    );
    return (
      res.data.data || {
        orders: [],
        pagination: { page, limit, totalCount: 0, totalPages: 0 },
      }
    );
  },

  // 3. Customer: Get order details by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    const res = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return res.data.data;
  },

  // 4. Customer: Cancel order
  cancelOrder: async (orderId: string): Promise<Order> => {
    const res = await apiClient.post<ApiResponse<Order>>(`/orders/${orderId}/cancel`);
    return res.data.data;
  },

  // 5. Guest: Lookup order by tracking token
  getGuestOrder: async (trackingToken: string): Promise<Order> => {
    const res = await apiClient.get<ApiResponse<Order>>(`/orders/guest/${trackingToken}`);
    return res.data.data;
  },

  // 6. Customer: Live order tracking
  trackCustomerOrder: async (orderId: string): Promise<TrackingData> => {
    const res = await apiClient.get<ApiResponse<TrackingData>>(`/shipping/orders/${orderId}/track`);
    return res.data.data;
  },

  // 7. Guest: Live order tracking
  trackGuestOrder: async (trackingToken: string): Promise<TrackingData> => {
    const res = await apiClient.get<ApiResponse<TrackingData>>(
      `/shipping/orders/guest/${trackingToken}/track`,
    );
    return res.data.data;
  },
};

export default orderService;
