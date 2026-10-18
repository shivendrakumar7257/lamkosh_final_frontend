import { api, ApiResponse } from "@/lib/api";
import { getGuestId, getOrCreateGuestId, setGuestId } from "@/lib/guest";
import {
  CartObject,
  CartResponseData,
  AddToCartPayload,
  CartCheckResponse,
  CartMergeResponse,
} from "@/types/cart";

function sanitizeId(id: string): string {
  if (!id) return "";
  return id
    .replace(/^blob:https?:\/\/[^\/]+\//i, "")
    .replace(/^https?:\/\/[^\/]+\//i, "")
    .trim();
}

export const CartApi = {
  /**
   * POST /api/v1/cart/items
   * Add Item to Cart
   * Body: { productId: string, variantId?: string, quantity: number, guestId?: string }
   */
  addItem: async (payload: AddToCartPayload): Promise<CartResponseData> => {
    const guestId = getGuestId() || getOrCreateGuestId();
    // Only send variantId if defined
    const body: Record<string, any> = {
      productId: sanitizeId(payload.productId),
      quantity: payload.quantity,
    };
    if (payload.variantId) {
      body.variantId = sanitizeId(payload.variantId);
    }
    if (guestId) {
      body.guestId = guestId;
    }

    const res = await api.post<ApiResponse<any>>("/cart/items", body);
    const data = res.data?.data || res.data;
    const serverGuestId = data?.guestId || (res.headers && res.headers["x-guest-id"]);
    if (serverGuestId) {
      setGuestId(serverGuestId);
    }

    if (data?.cart) {
      return { cart: data.cart, guestId: serverGuestId || data.guestId };
    }
    // Fallback if data is the cart object itself
    return {
      cart: (data?.items ? data : { items: [], totalItems: 0, subtotal: 0 }) as CartObject,
      guestId: serverGuestId || data?.guestId,
    };
  },

  /**
   * GET /api/v1/cart
   * Retrieve current user or guest cart
   */
  getCart: async (): Promise<CartResponseData> => {
    const guestId = getGuestId();
    const res = await api.get<ApiResponse<any>>("/cart", {
      params: guestId ? { guestId } : undefined,
    });
    const data = res.data?.data || res.data;
    const serverGuestId = data?.guestId || (res.headers && res.headers["x-guest-id"]);
    if (serverGuestId && !guestId) {
      setGuestId(serverGuestId);
    }

    if (data?.cart) {
      return { cart: data.cart, guestId: serverGuestId || data.guestId };
    }
    return {
      cart: (data?.items ? data : { items: [], totalItems: 0, subtotal: 0 }) as CartObject,
      guestId: serverGuestId || data?.guestId,
    };
  },

  /**
   * PUT /api/v1/cart/items/:itemId
   * Update quantity of a cart item
   */
  updateQuantity: async (itemId: string, quantity: number): Promise<CartObject> => {
    const guestId = getGuestId();
    const res = await api.put<ApiResponse<any>>(`/cart/items/${itemId}`, {
      quantity,
      ...(guestId ? { guestId } : {}),
    });
    const data = res.data?.data || res.data;
    if (data?.cart) {
      return data.cart as CartObject;
    }
    return (data?.items ? data : { items: [], totalItems: 0, subtotal: 0 }) as CartObject;
  },

  /**
   * DELETE /api/v1/cart/items/:itemId
   * Remove item from cart
   */
  removeItem: async (itemId: string): Promise<{ message: string; cart?: CartObject }> => {
    const guestId = getGuestId();
    const res = await api.delete<ApiResponse<any>>(`/cart/items/${itemId}`, {
      data: guestId ? { guestId } : undefined,
    });
    const data = res.data?.data || res.data;
    return {
      message: res.data?.message || "Cart item removed successfully",
      cart: data?.cart,
    };
  },

  /**
   * DELETE /api/v1/cart
   * Clear the entire cart
   */
  clearCart: async (): Promise<void> => {
    const guestId = getGuestId();
    await api.delete<ApiResponse<any>>("/cart", {
      data: guestId ? { guestId } : undefined,
    });
  },

  /**
   * GET /api/v1/cart/check?productId=<uuid>&variantId=<uuid>
   * Check if a product/variant is in cart
   */
  checkItem: async (productId: string, variantId?: string): Promise<CartCheckResponse> => {
    const cleanPid = sanitizeId(productId);
    const guestId = getGuestId();
    const params: Record<string, string> = { productId: cleanPid };
    if (variantId) {
      params.variantId = sanitizeId(variantId);
    }
    if (guestId) {
      params.guestId = guestId;
    }
    const res = await api.get<ApiResponse<any>>("/cart/check", { params });
    const data = res.data?.data || res.data;
    return {
      inCart: Boolean(data?.inCart),
      quantity: Number(data?.quantity || 0),
    };
  },

  /**
   * POST /api/v1/cart/merge
   * Merge guest cart into user account post-login
   * Body: { guestId: string }
   * Auth: Required (Bearer token)
   */
  mergeCart: async (guestId: string): Promise<CartMergeResponse> => {
    const res = await api.post<ApiResponse<any>>("/cart/merge", { guestId });
    const data = res.data?.data || res.data;
    return {
      merged: Boolean(data?.merged ?? true),
      adjustedItems: Array.isArray(data?.adjustedItems) ? data.adjustedItems : [],
      cart: data?.cart || (data?.items ? data : { items: [], totalItems: 0, subtotal: 0 }),
    };
  },
};

export default CartApi;
