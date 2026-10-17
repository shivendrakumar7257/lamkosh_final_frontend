import { api, ApiResponse } from "@/lib/api";
import {
  WishlistItem,
  WishlistObject,
  WishlistResponseData,
  WishlistCheckResponse,
  WishlistMergeResponse,
} from "@/types/wishlist";

/**
 * Strips any protocol, localhost hostnames, or blob URLs from IDs
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
   * Body: { productId: string }
   * Auth: Optional (Bearer token OR X-Guest-ID automatically attached)
   */
  addItem: async (productId: string): Promise<{ item?: WishlistItem; guestId?: string }> => {
    const cleanId = sanitizeId(productId);
    const res = await api.post<ApiResponse<any>>("/wishlist/items", { productId: cleanId });
    const data = res.data?.data || res.data;
    return {
      item: data?.item || (data?.id ? data : undefined),
      guestId: data?.guestId,
    };
  },

  /**
   * GET /api/v1/wishlist
   * Retrieve current user or guest wishlist
   */
  getWishlist: async (): Promise<WishlistResponseData> => {
    const res = await api.get<ApiResponse<any>>("/wishlist");
    const data = res.data?.data || res.data;

    if (data?.wishlist) {
      return { wishlist: data.wishlist, guestId: data.guestId };
    }
    return {
      wishlist: (data?.items ? data : { items: [], totalItems: 0 }) as WishlistObject,
      guestId: data?.guestId,
    };
  },

  /**
   * DELETE /api/v1/wishlist/items/:itemId
   * Remove item from wishlist
   */
  removeItem: async (itemId: string): Promise<void> => {
    const cleanId = sanitizeId(itemId);
    await api.delete<ApiResponse<any>>(`/wishlist/items/${cleanId}`);
  },

  /**
   * DELETE /api/v1/wishlist
   * Clear all items from wishlist
   */
  clearWishlist: async (): Promise<void> => {
    await api.delete<ApiResponse<any>>("/wishlist");
  },

  /**
   * GET /api/v1/wishlist/check/:productId
   * Check if a product is in the wishlist
   */
  checkItem: async (productId: string): Promise<WishlistCheckResponse> => {
    const cleanId = sanitizeId(productId);
    const res = await api.get<ApiResponse<any>>(`/wishlist/check/${cleanId}`);
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
