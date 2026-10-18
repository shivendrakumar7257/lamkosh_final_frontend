import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { CartApi } from "@/lib/api/cart.api";
import { getGuestId, clearGuestId, setGuestId } from "@/lib/guest";
import { useAuthStore } from "@/lib/auth-store";
import { CartObject, CartCheckResponse, CartMergeResponse } from "@/types/cart";

export interface CartContextType {
  cart: CartObject;
  itemCount: number;
  subtotal: number;
  loading: boolean;
  itemLoading: Record<string, boolean>;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (productId: string, quantity?: number, variantId?: string) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  checkInCart: (productId: string, variantId?: string) => Promise<CartCheckResponse>;
  mergeAfterLogin: () => Promise<CartMergeResponse | null>;
  refreshCart: () => Promise<void>;
}

const GUEST_CART_KEY = "lamoksh_guest_cart";

const getSavedGuestCart = (): CartObject | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) return parsed;
    }
  } catch {}
  return null;
};

const saveGuestCart = (cartObj: CartObject | null) => {
  if (typeof window === "undefined") return;
  try {
    if (!cartObj || !cartObj.items || cartObj.items.length === 0) {
      localStorage.removeItem(GUEST_CART_KEY);
    } else {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartObj));
    }
  } catch {}
};

const initialCart: CartObject = {
  cartId: null,
  guestId: null,
  items: [],
  totalItems: 0,
  subtotal: 0,
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartObject>(() => {
    const guestCart = getSavedGuestCart();
    if (guestCart && guestCart.items && guestCart.items.length > 0) {
      return guestCart;
    }
    return initialCart;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [itemLoading, setItemLoading] = useState<Record<string, boolean>>({});
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const setSingleItemLoading = (id: string, isLoading: boolean) => {
    setItemLoading((prev) => ({ ...prev, [id]: isLoading }));
  };

  /**
   * Fetch current cart (Guest or Authenticated)
   */
  const refreshCart = useCallback(async () => {
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await CartApi.getCart();
      const activeGuestId = res.cart?.guestId || res.guestId;
      if (activeGuestId) {
        setGuestId(activeGuestId);
      }

      if (isAuthenticated) {
        setCart(res.cart || initialCart);
      } else {
        const serverCart = res.cart;
        if (serverCart && serverCart.items && serverCart.items.length > 0) {
          saveGuestCart(serverCart);
          setCart(serverCart);
        } else {
          // If server returned empty cart but we have cached guest cart, keep local guest cart
          const localCart = getSavedGuestCart();
          if (localCart && localCart.items && localCart.items.length > 0) {
            setCart(localCart);
          } else {
            setCart(serverCart || initialCart);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to load cart:", err);
      if (!isAuthenticated) {
        const localCart = getSavedGuestCart();
        if (localCart && localCart.items && localCart.items.length > 0) {
          setCart(localCart);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch cart on mount, on auth change, and on custom cart:refresh event
  useEffect(() => {
    refreshCart();
    const handleRefresh = () => {
      refreshCart();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("cart:refresh", handleRefresh);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("cart:refresh", handleRefresh);
      }
    };
  }, [refreshCart, isAuthenticated]);

  /**
   * Add Item to Cart
   * VariantId is required when product has variants, omit otherwise.
   */
  const addToCart = useCallback(
    async (productId: string, quantity = 1, variantId?: string): Promise<boolean> => {
      try {
        setLoading(true);
        const res = await CartApi.addItem({
          productId,
          quantity: Math.max(1, quantity),
          variantId,
        });

        const activeGuestId = res.cart?.guestId || res.guestId;
        if (activeGuestId) {
          setGuestId(activeGuestId);
        }

        setCart(res.cart);
        if (!isAuthenticated) {
          saveGuestCart(res.cart);
        }
        toast.success("Added to your bag");
        setCartOpen(true);
        return true;
      } catch (err: any) {
        // Global error toast handles 422 if present, but fallback message if not
        const msg = err?.response?.data?.message || err?.message || "Failed to add item to bag";
        if (err?.response?.status !== 422) {
          toast.error(msg);
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated],
  );

  /**
   * Remove single item from cart
   */
  const removeFromCart = useCallback(
    async (itemId: string): Promise<boolean> => {
      setSingleItemLoading(itemId, true);
      try {
        const res = await CartApi.removeItem(itemId);
        if (res.cart) {
          const activeGuestId = res.cart?.guestId;
          if (activeGuestId) {
            setGuestId(activeGuestId);
          }
          setCart(res.cart);
          if (!isAuthenticated) {
            saveGuestCart(res.cart);
          }
        } else {
          // Optimistically remove from state
          setCart((prev) => {
            const nextItems = prev.items.filter((item) => item.id !== itemId);
            const nextTotal = nextItems.reduce((acc, it) => acc + it.quantity, 0);
            const nextSubtotal = nextItems.reduce((acc, it) => acc + (it.subtotal || 0), 0);
            const nextCart = {
              ...prev,
              items: nextItems,
              totalItems: nextTotal,
              subtotal: nextSubtotal,
            };
            if (!isAuthenticated) {
              saveGuestCart(nextCart);
            }
            return nextCart;
          });
        }
        toast.success("Item removed from bag");
        return true;
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to remove item");
        return false;
      } finally {
        setSingleItemLoading(itemId, false);
      }
    },
    [isAuthenticated],
  );

  /**
   * Update quantity of an existing item in the cart
   */
  const updateQuantity = useCallback(
    async (itemId: string, quantity: number): Promise<boolean> => {
      if (quantity <= 0) {
        return removeFromCart(itemId);
      }

      setSingleItemLoading(itemId, true);
      try {
        const updatedCart = await CartApi.updateQuantity(itemId, quantity);
        const activeGuestId = updatedCart?.guestId;
        if (activeGuestId) {
          setGuestId(activeGuestId);
        }
        setCart(updatedCart);
        if (!isAuthenticated) {
          saveGuestCart(updatedCart);
        }
        return true;
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || "Failed to update quantity";
        if (err?.response?.status !== 422) {
          toast.error(msg);
        }
        return false;
      } finally {
        setSingleItemLoading(itemId, false);
      }
    },
    [removeFromCart, isAuthenticated],
  );

  /**
   * Clear the entire cart
   */
  const clearCart = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      await CartApi.clearCart();
      setCart(initialCart);
      if (!isAuthenticated) {
        saveGuestCart(null);
      }
      toast.success("Bag cleared");
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to clear bag");
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Check if an item is in the cart
   */
  const checkInCart = useCallback(
    async (productId: string, variantId?: string): Promise<CartCheckResponse> => {
      // First check local cart state
      const localItem = cart.items.find((item) => {
        if (item.productId !== productId) return false;
        if (variantId && item.variantId !== variantId) return false;
        return true;
      });

      if (localItem) {
        return { inCart: true, quantity: localItem.quantity };
      }

      // Check backend endpoint
      try {
        return await CartApi.checkItem(productId, variantId);
      } catch {
        return { inCart: false, quantity: 0 };
      }
    },
    [cart.items],
  );

  /**
   * Merge guest cart after login or signup
   */
  const mergeAfterLogin = useCallback(async (): Promise<CartMergeResponse | null> => {
    const guestId = getGuestId();
    if (!guestId) return null;

    try {
      const res = await CartApi.mergeCart(guestId);
      if (res.adjustedItems && res.adjustedItems.length > 0) {
        toast.warning("Some items in your cart were adjusted based on available stock");
      }
      if (res.cart) {
        setCart(res.cart);
      }
      return res;
    } catch (err) {
      console.warn("Failed to merge guest cart:", err);
      return null;
    }
  }, []);

  const value: CartContextType = {
    cart,
    itemCount: cart?.totalItems ?? 0,
    subtotal: cart?.subtotal ?? 0,
    loading,
    itemLoading,
    cartOpen,
    setCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkInCart,
    mergeAfterLogin,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

const fallbackCartContext: CartContextType = {
  cart: initialCart,
  itemCount: 0,
  subtotal: 0,
  loading: false,
  itemLoading: {},
  cartOpen: false,
  setCartOpen: () => {},
  addToCart: async () => false,
  updateQuantity: async () => false,
  removeFromCart: async () => false,
  clearCart: async () => false,
  checkInCart: async () => ({ inCart: false, quantity: 0 }),
  mergeAfterLogin: async () => null,
  refreshCart: async () => {},
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    return fallbackCartContext;
  }
  return context;
}

export default CartContext;
