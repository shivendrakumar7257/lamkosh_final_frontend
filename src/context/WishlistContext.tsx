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
  addToWishlist: (productId: string, productSnapshot?: any) => Promise<boolean>;
  removeFromWishlist: (itemIdOrProductId: string) => Promise<boolean>;
  toggleWishlist: (productId: string, productSnapshot?: any) => Promise<boolean>;
  isItemWishlisted: (productId: string) => boolean;
  clearWishlist: () => Promise<boolean>;
  mergeAfterLogin: () => Promise<WishlistMergeResponse | null>;
  refreshWishlist: () => Promise<void>;
}

const GUEST_WISHLIST_KEY = "lamoksh_guest_wishlist";

const getSavedGuestWishlist = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
};

const saveGuestWishlist = (items: WishlistItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
  } catch {}
};

const initialWishlist: WishlistObject = {
  wishlistId: null,
  guestId: null,
  items: [],
  totalItems: 0,
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistObject>(() => {
    const guestItems = getSavedGuestWishlist();
    if (guestItems.length > 0) {
      return {
        wishlistId: null,
        guestId: getGuestId(),
        items: guestItems,
        totalItems: guestItems.length,
      };
    }
    return initialWishlist;
  });

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
      
      if (isAuthenticated) {
        setWishlist(res.wishlist || initialWishlist);
      } else {
        // Guest user: preserve and merge local items with server items
        const localItems = getSavedGuestWishlist();
        const serverItems = res.wishlist?.items || [];

        const mergedMap = new Map<string, WishlistItem>();
        localItems.forEach((it) => mergedMap.set(it.productId, it));
        serverItems.forEach((it) => {
          const existing = mergedMap.get(it.productId);
          mergedMap.set(it.productId, {
            ...existing,
            ...it,
            product:
              it.product && it.product.name && it.product.name !== "Saved Piece"
                ? it.product
                : existing?.product || it.product,
          });
        });

        const mergedList = Array.from(mergedMap.values());
        saveGuestWishlist(mergedList);

        const activeGuestId = res.guestId || res.wishlist?.guestId || getGuestId();
        if (activeGuestId) {
          setGuestId(activeGuestId);
        }

        setWishlist({
          wishlistId: res.wishlist?.wishlistId || null,
          guestId: activeGuestId,
          items: mergedList,
          totalItems: mergedList.length,
        });
      }
    } catch (err) {
      console.warn("Failed to load wishlist:", err);
      if (!isAuthenticated) {
        const localItems = getSavedGuestWishlist();
        if (localItems.length > 0) {
          setWishlist({
            wishlistId: null,
            guestId: getGuestId(),
            items: localItems,
            totalItems: localItems.length,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

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
  const addToWishlist = useCallback(async (productId: string, productSnapshot?: any): Promise<boolean> => {
    if (!productId) return false;
    const cleanId = productId
      .replace(/^blob:https?:\/\/[^\/]+\//i, "")
      .replace(/^https?:\/\/[^\/]+\//i, "")
      .trim();

    // Optimistic addition
    const tempId = `temp-${Date.now()}`;
    const optimisticItem: WishlistItem = {
      id: tempId,
      productId: cleanId,
      createdAt: new Date().toISOString(),
      product: productSnapshot ? {
        id: cleanId,
        name: productSnapshot.name || productSnapshot.title || "Saved Piece",
        sellPrice: Number(productSnapshot.sellPrice ?? productSnapshot.price ?? 0),
        basePrice: Number(productSnapshot.basePrice ?? 0),
        media: productSnapshot.media,
        color: productSnapshot.color,
        stock: productSnapshot.stock !== undefined ? productSnapshot.stock : 1,
      } : {
        id: cleanId,
        name: "Saved Piece",
        sellPrice: 0,
        stock: 1,
      },
    };

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
      const nextItems = [optimisticItem, ...prev.items];
      if (!isAuthenticated) {
        saveGuestWishlist(nextItems);
      }
      return {
        ...prev,
        items: nextItems,
        totalItems: nextItems.length,
      };
    });

    try {
      const res = await WishlistApi.addItem(cleanId);
      const activeGuestId = res.guestId || getGuestId();
      if (activeGuestId) {
        setGuestId(activeGuestId);
      }

      if (res.item) {
        setWishlist((prev) => {
          const next = prev.items.map((it) =>
            it.id === tempId ? { ...it, ...res.item, product: (res.item as any)?.product || it.product } : it,
          );
          if (!isAuthenticated) {
            saveGuestWishlist(next);
          }
          return { ...prev, items: next };
        });
      }

      toast.success("Saved to your wishlist");
      return true;
    } catch (err: any) {
      // Rollback optimistic addition on failure
      setWishlist((prev) => {
        const nextItems = prev.items.filter((it) => it.id !== tempId);
        if (!isAuthenticated) {
          saveGuestWishlist(nextItems);
        }
        return {
          ...prev,
          items: nextItems,
          totalItems: nextItems.length,
        };
      });
      toast.error(err?.response?.data?.message || "Failed to save to wishlist");
      return false;
    }
  }, [isAuthenticated]);

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
        if (!isAuthenticated) {
          saveGuestWishlist(nextItems);
        }
        return {
          ...prev,
          items: nextItems,
          totalItems: nextItems.length,
        };
      });

      try {
        await WishlistApi.removeItem(targetItemId);
        toast.info("Removed from wishlist");
        return true;
      } catch (err: any) {
        // Rollback on failure
        setWishlist(prevWishlist);
        if (!isAuthenticated) {
          saveGuestWishlist(prevWishlist.items);
        }
        toast.error(err?.response?.data?.message || "Failed to remove from wishlist");
        return false;
      }
    },
    [wishlist, isAuthenticated],
  );

  /**
   * Toggle item in wishlist (Optimistic)
   */
  const toggleWishlist = useCallback(
    async (productId: string, productSnapshot?: any): Promise<boolean> => {
      if (!productId) return false;
      if (isItemWishlisted(productId)) {
        return removeFromWishlist(productId);
      } else {
        return addToWishlist(productId, productSnapshot);
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
      if (!isAuthenticated) {
        saveGuestWishlist([]);
      }
      toast.success("Wishlist cleared");
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to clear wishlist");
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

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
        if (typeof window !== "undefined") {
          localStorage.removeItem(GUEST_WISHLIST_KEY);
        }
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

const fallbackWishlistContext: WishlistContextType = {
  wishlist: initialWishlist,
  wishlistCount: 0,
  loading: false,
  addToWishlist: async () => false,
  removeFromWishlist: async () => false,
  toggleWishlist: async () => false,
  isItemWishlisted: () => false,
  clearWishlist: async () => false,
  mergeAfterLogin: async () => null,
  refreshWishlist: async () => {},
};

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    return fallbackWishlistContext;
  }
  return context;
}

export default WishlistContext;
