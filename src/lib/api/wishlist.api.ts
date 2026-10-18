import { api, ApiResponse } from "@/lib/api";
import { getGuestId, getOrCreateGuestId, setGuestId } from "@/lib/guest";
import {
  WishlistItem,
  WishlistObject,
  WishlistResponseData,
  WishlistCheckResponse,
  WishlistMergeResponse,
} from "@/types/wishlist";

/**
 * Strips any protocol, hostnames, or blob URLs from IDs
 */
function sanitizeId(id: string): string {
  if (!id) return "";
  return id
    .replace(/^blob:https?:\/\/[^\/]+\//i, "")
    .replace(/^https?:\/\/[^\/]+\//i, "")
    .trim();
}

export const WishlistApi = {
  /**
   * POST /api/v1/wishlist/items
   * Add Item to Wishlist
   * Body: { productId: string, guestId?: string }
   */
  addItem: async (productId: string): Promise<{ item?: WishlistItem; guestId?: string }> => {
    const cleanId = sanitizeId(productId);
    const guestId = getGuestId() || getOrCreateGuestId();
    const body: Record<string, any> = { productId: cleanId };
    if (guestId) {
      body.guestId = guestId;
    }
    const res = await api.post<ApiResponse<any>>("/wishlist/items", body);
    const data = res.data?.data || res.data;
    const serverGuestId = data?.guestId || (res.headers && res.headers["x-guest-id"]);
    if (serverGuestId) {
      setGuestId(serverGuestId);
    }
    return {
      item: data?.item || (data?.id ? data : undefined),
      guestId: serverGuestId || data?.guestId,
    };
  },

  /**
   * GET /api/v1/wishlist
   * Retrieve current user or guest wishlist
   */
  getWishlist: async (): Promise<WishlistResponseData> => {
    const guestId = getGuestId();
    const res = await api.get<ApiResponse<any>>("/wishlist", {
      params: guestId ? { guestId } : undefined,
    });
    const data = res.data?.data || res.data;
    const serverGuestId = data?.guestId || (res.headers && res.headers["x-guest-id"]);
    if (serverGuestId && !guestId) {
      setGuestId(serverGuestId);
    }

    if (data?.wishlist) {
      return { wishlist: data.wishlist, guestId: serverGuestId || data.guestId };
    }
    return {
      wishlist: (data?.items ? data : { items: [], totalItems: 0 }) as WishlistObject,
      guestId: serverGuestId || data?.guestId,
    };
  },

  /**
   * DELETE /api/v1/wishlist/items/:itemId
   * Remove item from wishlist
   */
  removeItem: async (itemId: string): Promise<void> => {
    const cleanId = sanitizeId(itemId);
    const guestId = getGuestId();
    await api.delete<ApiResponse<any>>(`/wishlist/items/${cleanId}`, {
      data: guestId ? { guestId } : undefined,
    });
  },

  /**
   * DELETE /api/v1/wishlist
   * Clear all items from wishlist
   */
  clearWishlist: async (): Promise<void> => {
    const guestId = getGuestId();
    await api.delete<ApiResponse<any>>("/wishlist", {
      data: guestId ? { guestId } : undefined,
    });
  },

  /**
   * GET /api/v1/wishlist/check/:productId
   * Check if a product is in the wishlist
   */
  checkItem: async (productId: string): Promise<WishlistCheckResponse> => {
    const cleanId = sanitizeId(productId);
    const guestId = getGuestId();
    const res = await api.get<ApiResponse<any>>(`/wishlist/check/${cleanId}`, {
      params: guestId ? { guestId } : undefined,
    });
    const data = res.data?.data || res.data;
    return {
      productId: cleanId,
      isWishlisted: Boolean(data?.isWishlisted ?? data?.inWishlist),
    };
  },

  /**
   * POST /api/v1/wishlist/merge
   * Merge guest wishlist into user account post-login
   * Body: { guestId: string }
   * Auth: Required (Bearer token)
   */
  mergeWishlist: async (guestId: string): Promise<WishlistMergeResponse> => {
    const res = await api.post<ApiResponse<any>>("/wishlist/merge", { guestId });
    const data = res.data?.data || res.data;
    return {
      merged: Boolean(data?.merged ?? true),
      wishlist: data?.wishlist || (data?.items ? data : { items: [], totalItems: 0 }),
    };
  },
};

export default WishlistApi;
