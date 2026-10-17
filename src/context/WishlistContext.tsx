import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { WishlistApi } from "@/lib/api/wishlist.api";
import { getGuestId, setGuestId } from "@/lib/guest";
import { useAuthStore } from "@/lib/auth-store";
import { WishlistObject, WishlistMergeResponse, WishlistItem } from "@/types/wishlist";

export interface WishlistContextType {
  wishlist: WishlistObject;
  wishlistCount: number;
  loading: boolean;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (itemIdOrProductId: string) => Promise<boolean>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isItemWishlisted: (productId: string) => boolean;
  clearWishlist: () => Promise<boolean>;
  mergeAfterLogin: () => Promise<WishlistMergeResponse | null>;
  refreshWishlist: () => Promise<void>;
}

const initialWishlist: WishlistObject = {
  wishlistId: null,
  guestId: null,
  items: [],
  totalItems: 0,
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistObject>(initialWishlist);
  const [loading, setLoading] = useState<boolean>(true);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  /**
   * Fetch current wishlist (Guest or Authenticated)
   */
  const refreshWishlist = useCallback(async () => {
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await WishlistApi.getWishlist();
      if (res.guestId && !localStorage.getItem("guest_id")) {
        setGuestId(res.guestId);
      }
      setWishlist(res.wishlist || initialWishlist);
    } catch (err) {
      console.warn("Failed to load wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch wishlist on mount, on auth change, and on custom wishlist:refresh event
  useEffect(() => {
    refreshWishlist();
    const handleRefresh = () => {
      refreshWishlist();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("wishlist:refresh", handleRefresh);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("wishlist:refresh", handleRefresh);
      }
    };
  }, [refreshWishlist, isAuthenticated]);

  /**
   * Check if a product is in the current wishlist
   */
  const isItemWishlisted = useCallback(
    (productId: string): boolean => {
      if (!productId || !wishlist?.items) return false;
      const cleanId = productId
        .replace(/^blob:https?:\/\/[^\/]+\//i, "")
        .replace(/^https?:\/\/[^\/]+\//i, "")
        .trim();
      return wishlist.items.some(
        (item) =>
          item.productId === productId ||
          item.productId === cleanId ||
          item.product?.id === productId ||
          item.product?.id === cleanId,
      );
    },
    [wishlist?.items],
  );

  /**
   * Add Item to Wishlist with optimistic update
   */
  const addToWishlist = useCallback(async (productId: string): Promise<boolean> => {
    if (!productId) return false;
    const cleanId = productId
      .replace(/^blob:https?:\/\/[^\/]+\//i, "")
      .replace(/^https?:\/\/[^\/]+\//i, "")
      .trim();

    // Optimistic addition
    const tempId = `temp-${Date.now()}`;
    setWishlist((prev) => {
      if (
        prev.items.some(
          (it) =>
            it.productId === cleanId ||
            it.productId === productId ||
            it.product?.id === cleanId ||
            it.product?.id === productId,
        )
      ) {
        return prev;
      }
      const optimisticItem: WishlistItem = {
        id: tempId,
        productId: cleanId,
        createdAt: new Date().toISOString(),
        product: {
          id: cleanId,
          name: "Saved Item",
          sellPrice: 0,
          stock: 1,
        },
      };
      const nextItems = [optimisticItem, ...prev.items];
      return {
        ...prev,
        items: nextItems,
        totalItems: nextItems.length,
      };
    });

    try {
      const res = await WishlistApi.addItem(cleanId);
      if (res.guestId && !localStorage.getItem("guest_id")) {
        setGuestId(res.guestId);
      }

      // Re-sync full wishlist details with product data from server
      refreshWishlist();
      toast.success("Saved to your wishlist");
      return true;
    } catch (err: any) {
      // Rollback optimistic addition on failure
      setWishlist((prev) => {
        const nextItems = prev.items.filter((it) => it.id !== tempId);
        return {
          ...prev,
          items: nextItems,
          totalItems: nextItems.length,
        };
      });
      toast.error(err?.response?.data?.message || "Failed to save to wishlist");
      return false;
    }
  }, [refreshWishlist]);

  /**
   * Remove Item from Wishlist with optimistic update
   * Accepts either item UUID or productId
   */
  const removeFromWishlist = useCallback(
    async (itemIdOrProductId: string): Promise<boolean> => {
      if (!itemIdOrProductId) return false;
      const cleanId = itemIdOrProductId
        .replace(/^blob:https?:\/\/[^\/]+\//i, "")
        .replace(/^https?:\/\/[^\/]+\//i, "")
        .trim();

      // Find item in state
      const targetItem = wishlist.items.find(
        (it) =>
          it.id === itemIdOrProductId ||
          it.id === cleanId ||
          it.productId === itemIdOrProductId ||
          it.productId === cleanId ||
          it.product?.id === itemIdOrProductId ||
          it.product?.id === cleanId,
      );

      const targetItemId = targetItem ? targetItem.id : cleanId;
      const prevWishlist = wishlist;

      // Optimistically remove
      setWishlist((prev) => {
        const nextItems = prev.items.filter(
          (it) =>
            it.id !== itemIdOrProductId &&
            it.id !== cleanId &&
            it.productId !== itemIdOrProductId &&
            it.productId !== cleanId &&
            it.product?.id !== itemIdOrProductId &&
            it.product?.id !== cleanId,
        );
        return {
          ...prev,
          items: nextItems,
          totalItems: nextItems.length,
        };
      });

      try {
        await WishlistApi.removeItem(targetItemId);
        refreshWishlist();
        toast.info("Removed from wishlist");
        return true;
      } catch (err: any) {
        // Rollback on failure
        setWishlist(prevWishlist);
        toast.error(err?.response?.data?.message || "Failed to remove from wishlist");
        return false;
      }
    },
    [wishlist, refreshWishlist],
  );

  /**
   * Toggle item in wishlist (Optimistic)
   */
  const toggleWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!productId) return false;
      if (isItemWishlisted(productId)) {
        return removeFromWishlist(productId);
      } else {
        return addToWishlist(productId);
      }
    },
    [isItemWishlisted, removeFromWishlist, addToWishlist],
  );

  /**
   * Clear entire wishlist
   */
  const clearWishlist = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      await WishlistApi.clearWishlist();
      setWishlist(initialWishlist);
      toast.success("Wishlist cleared");
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to clear wishlist");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Merge guest wishlist after login or signup
   */
  const mergeAfterLogin = useCallback(async (): Promise<WishlistMergeResponse | null> => {
    const guestId = getGuestId();
    if (!guestId) return null;

    try {
      const res = await WishlistApi.mergeWishlist(guestId);
      if (res.wishlist) {
        setWishlist(res.wishlist);
      }
      return res;
    } catch (err) {
      console.warn("Failed to merge guest wishlist:", err);
      return null;
    }
  }, []);

  const value: WishlistContextType = {
    wishlist,
    wishlistCount: wishlist?.totalItems ?? 0,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isItemWishlisted,
    clearWishlist,
    mergeAfterLogin,
    refreshWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

export default WishlistContext;
