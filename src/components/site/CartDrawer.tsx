import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Loader2, Trash2 } from "lucide-react";
import { formatPrice } from "@/data/catalog";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cart,
    subtotal,
    itemCount,
    updateQuantity,
    removeFromCart,
    itemLoading,
    loading,
  } = useCart();

  if (!cartOpen) return null;

  const items = cart?.items || [];

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close bag"
        className="absolute inset-0 bg-espresso/40 backdrop-blur-xs transition-opacity"
        onClick={() => setCartOpen(false)}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <p className="nav-label">
            Your Bag ({itemCount} {itemCount === 1 ? "piece" : "pieces"})
          </p>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setCartOpen(false)}
            className="rounded p-1 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6">
          {loading && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="body-lux mt-3 text-sm">Loading your selection...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-24 text-center">
              <p className="body-lux">Your bag is empty.</p>
              <Link
                to="/new-arrivals"
                className="nav-label link-underline mt-6 inline-block"
                onClick={() => setCartOpen(false)}
              >
                Discover new arrivals &rarr;
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => {
                const isLoading = Boolean(itemLoading[item.id]);
                const imageUrl =
                  item.product?.media?.[0]?.url ||
                  (Array.isArray(item.product?.images) ? item.product.images[0] : null) ||
                  "/placeholder.svg";

                const isAtMaxStock =
                  item.availableStock !== undefined && item.quantity >= item.availableStock;

                const productLink = item.product?.handle
                  ? `/products/${item.product.handle}`
                  : `/products/${item.productId}`;

                return (
                  <li key={item.id} className="flex gap-4 py-6">
                    <Link
                      to={productLink as any}
                      onClick={() => setCartOpen(false)}
                      className="w-24 shrink-0 overflow-hidden bg-muted"
                    >
                      <img
                        src={imageUrl}
                        alt={item.product?.name || "Product"}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                        }}
                        className="aspect-[3/4] w-full object-cover transition-transform hover:scale-105"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display text-base leading-snug">
                            <Link
                              to={productLink as any}
                              onClick={() => setCartOpen(false)}
                              className="hover:underline"
                            >
                              {item.product?.name}
                            </Link>
                          </h4>
                          <span className="whitespace-nowrap font-serif text-sm font-medium">
                            {formatPrice(item.subtotal || item.product?.sellPrice * item.quantity)}
                          </span>
                        </div>

                        {item.variant?.size ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Size: {item.variant.size}
                          </p>
                        ) : null}

                        {item.product?.color ? (
                          <p className="text-xs text-muted-foreground">
                            Color: {item.product.color}
                          </p>
                        ) : null}

                        {item.availableStock !== undefined && item.availableStock <= 3 ? (
                          <p className="mt-1 text-[0.68rem] text-amber-700">
                            Only {item.availableStock} left in stock
                          </p>
                        ) : null}
                      </div>

                      {/* Controls */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={isLoading}
                            className="px-2.5 py-1 transition-colors hover:bg-muted disabled:opacity-40"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-6 text-center text-xs font-medium">
                            {isLoading ? (
                              <Loader2 className="mx-auto h-3 w-3 animate-spin text-muted-foreground" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={isLoading || isAtMaxStock}
                            title={
                              isAtMaxStock ? "Maximum available stock reached" : "Increase quantity"
                            }
                            className="px-2.5 py-1 transition-colors hover:bg-muted disabled:opacity-40"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={isLoading}
                          aria-label="Remove item"
                          className="flex items-center gap-1 text-[0.7rem] text-muted-foreground hover:text-red-700 disabled:opacity-40"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 ? (
          <div className="border-t border-border px-6 py-6 bg-background">
            <div className="flex items-center justify-between">
              <span className="nav-label">Subtotal</span>
              <span className="font-display text-xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Taxes included. Complimentary shipping across India.
            </p>
            <Link
              to="/cart"
              onClick={() => setCartOpen(false)}
              className="btn-lux mt-4 w-full text-center"
            >
              View Bag &amp; Checkout
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
