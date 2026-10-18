import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/data/catalog";
import { dbStore } from "@/lib/db/store";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export type CartLine = { handle: string; qty: number; size?: string | undefined };

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  recent: string[];
  cartOpen: boolean;
  searchOpen: boolean;
  addToCart: (handle: string, qty?: number, size?: string) => void;
  setQty: (handle: string, qty: number) => void;
  removeLine: (handle: string) => void;
  clearCart: () => void;
  toggleWishlist: (handle: string) => void;
  markViewed: (handle: string) => void;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  cartCount: number;
  subtotal: number;
  lines: { product: Product; qty: number; size?: string | undefined }[];
};

const ShopContext = createContext<ShopState | null>(null);

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const cartCtx = useCart();
  const wishlistCtx = useWishlist();
  const [recent, setRecent] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dbVersion, setDbVersion] = useState(0);

  useEffect(() => {
    setRecent(read<string[]>("mn.recent", []));

    const onDbUpdate = () => setDbVersion((v) => v + 1);
    window.addEventListener("manmayi_db_updated", onDbUpdate);
    return () => window.removeEventListener("manmayi_db_updated", onDbUpdate);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined")
      window.localStorage.setItem("mn.recent", JSON.stringify(recent));
  }, [recent]);

  const addToCart = useCallback(
    (handle: string, qty = 1) => {
      cartCtx.addToCart(handle, qty);
    },
    [cartCtx],
  );

  const setQty = useCallback(
    (handle: string, qty: number) => {
      const item = cartCtx.cart.items.find(
        (it) => it.product?.handle === handle || it.productId === handle || it.id === handle,
      );
      if (item) {
        cartCtx.updateQuantity(item.id, qty);
      }
    },
    [cartCtx],
  );

  const removeLine = useCallback(
    (handle: string) => {
      const item = cartCtx.cart.items.find(
        (it) => it.product?.handle === handle || it.productId === handle || it.id === handle,
      );
      if (item) {
        cartCtx.removeFromCart(item.id);
      }
    },
    [cartCtx],
  );

  const clearCart = useCallback(() => {
    cartCtx.clearCart();
  }, [cartCtx]);

  const toggleWishlist = useCallback(
    (handle: string) => {
      wishlistCtx.toggleWishlist(handle);
    },
    [wishlistCtx],
  );

  const markViewed = useCallback((handle: string) => {
    setRecent((prev) => [handle, ...prev.filter((h) => h !== handle)].slice(0, 8));
  }, []);

  const lines = useMemo(() => {
    const currentProducts = dbStore.getProducts();
    return cartCtx.cart.items.map((it) => {
      const product =
        (Array.isArray(currentProducts) ? currentProducts : []).find(
          (p) =>
            p?.handle === it.productId || p?.id === it.productId || p?.handle === it.product?.handle,
        ) ||
        (Array.isArray(products) ? products : []).find(
          (p) =>
            p?.handle === it.productId || p?.id === it.productId || p?.handle === it.product?.handle,
        ) ||
        ({
          id: it.productId,
          handle: it.product?.handle || it.productId,
          title: it.product?.name || "Product",
          price: it.product?.sellPrice || 0,
          category: "clothing",
          type: "Clothing",
          collections: [],
          material: "Silk",
          colour: it.product?.color || "",
          inStock: true,
          images: it.product?.media?.map((m) => m.url) ||
            it.product?.images || ["/placeholder.svg"],
          description: "",
          craft: "",
          dimensions: "",
          care: "",
        } as unknown as Product);

      return {
        product,
        qty: it.quantity,
        size: it.variant?.size,
      };
    });
  }, [cartCtx.cart.items, dbVersion]);

  const value: ShopState = {
    cart: cartCtx.cart.items.map((it) => ({
      handle: it.product?.handle || it.productId,
      qty: it.quantity,
      size: it.variant?.size,
    })),
    wishlist: wishlistCtx.wishlist.items.map((it) => it.product?.handle || it.productId),
    recent,
    cartOpen: cartCtx.cartOpen,
    searchOpen,
    addToCart,
    setQty,
    removeLine,
    clearCart,
    toggleWishlist,
    markViewed,
    setCartOpen: cartCtx.setCartOpen,
    setSearchOpen,
    cartCount: cartCtx.itemCount,
    subtotal: cartCtx.subtotal,
    lines,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

const fallbackShopState: ShopState = {
  cart: [],
  wishlist: [],
  recent: [],
  cartOpen: false,
  searchOpen: false,
  addToCart: () => {},
  setQty: () => {},
  removeLine: () => {},
  clearCart: () => {},
  toggleWishlist: () => {},
  markViewed: () => {},
  setCartOpen: () => {},
  setSearchOpen: () => {},
  cartCount: 0,
  subtotal: 0,
  lines: [],
};

export function useShop(): ShopState {
  const ctx = useContext(ShopContext);
  if (!ctx) return fallbackShopState;
  return ctx;
}
