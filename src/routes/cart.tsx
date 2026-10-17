import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Loader2,
} from "lucide-react";
import subcategoryBannerBg from "@/assets/subcategory-banner-bg.png";
import { ProductCard } from "@/components/site/ProductCard";
import { formatPrice, products } from "@/data/catalog";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — LaMoksh Fabrics" },
      {
        name: "description",
        content: "Review the handcrafted pieces in your LaMoksh Fabrics bag before checkout.",
      },
      { property: "og:title", content: "Your Bag — LaMoksh Fabrics" },
      { property: "og:description", content: "Review your selection before checkout." },
      { property: "og:url", content: "/cart" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    subtotal,
    itemCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemLoading,
    loading,
  } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const items = cart?.items || [];

  // Curated recommendations from catalog
  const curatedEdit = products.slice(0, 4);
  const completeYourLook = products.slice(4, 8);

  const handleCheckout = () => {
    navigate({ to: "/checkout" });
  };

  return (
    <div className={cn("min-h-screen bg-background", items.length > 0 && "pb-28 md:pb-16")}>
      {/* Editorial Bag Header with Silk & Botanical Shadow Banner */}
      <section className="relative flex min-h-[220px] items-center overflow-hidden border-b border-border/80 py-12 md:min-h-[260px] md:py-16">
        <img
          src={subcategoryBannerBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#28201C]/25 backdrop-brightness-95" />
        <div className="container-lux relative z-10 text-center text-ivory">
          <nav className="flex justify-center gap-2 text-xs text-ivory/85">
            <Link to="/" className="hover:text-ivory hover:underline">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-ivory">Your Bag</span>
          </nav>
          <p className="eyebrow mt-5 uppercase tracking-[0.2em] text-ivory/85">CHECKOUT</p>
          <h1 className="mt-2 font-serif text-3xl font-normal text-ivory sm:text-4xl md:text-5xl">
            Your Bag
          </h1>
          <p className="mt-2 font-serif text-sm italic text-ivory/95">
            Pieces chosen for your next occasion.
          </p>
        </div>
      </section>

      {/* Main Bag Content */}
      <div className="container-lux py-12 md:py-20">
        {loading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#28201C]/60" />
            <p className="body-lux mt-4 text-sm text-[#28201C]/80">Loading your atelier bag...</p>
          </div>
        ) : items.length === 0 ? (
          /* EMPTY BAG EXPERIENCE */
          <div className="space-y-20">
            <div className="mx-auto max-w-xl text-center">
              <div className="relative overflow-hidden border border-[#28201C]/12 bg-[#FAF8F5] px-8 py-14 shadow-sm sm:px-12 md:py-16">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#28201C_0.35px,transparent_0.35px)] [background-size:24px_24px] opacity-15" />
                <div className="relative z-10">
                  <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#28201C]/60">
                    ATELIER DRESSING ROOM
                  </span>
                  <h2 className="mt-3 font-serif text-2xl uppercase tracking-wider text-[#28201C] sm:text-3xl">
                    YOUR BAG IS WAITING
                  </h2>
                  <p className="mt-3 font-sans text-sm text-[#28201C]/75">
                    Your carefully chosen pieces will appear here.
                  </p>

                  <div className="mt-8 space-y-4">
                    <Link
                      to="/new-arrivals"
                      className="inline-block bg-[#28201C] px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] transition-colors hover:bg-[#3d322c]"
                    >
                      DISCOVER NEW ARRIVALS
                    </Link>

                    <div>
                      <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#28201C] underline underline-offset-4 decoration-[#28201C]/30 transition-colors hover:text-black"
                      >
                        EXPLORE ALL COLLECTIONS &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty Bag Recommendations */}
            {curatedEdit.length > 0 && (
              <div className="border-t border-border/70 pt-16">
                <div className="mb-10 text-center">
                  <p className="eyebrow text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    DISCOVER THE MANMAYI EDIT
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-foreground md:text-3xl">
                    Handcrafted Creations
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
                  {curatedEdit.map((product) => (
                    <ProductCard key={product.handle || product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* NON-EMPTY BAG LAYOUT (Two Column Desktop) */
          <div className="space-y-20">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* LEFT COLUMN: Product Rows (~65%) */}
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="flex items-center justify-between border-b border-[#28201C]/20 pb-4">
                  <h2 className="font-serif text-xl font-normal uppercase tracking-wider text-[#28201C]">
                    YOUR BAG
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[#28201C]/70">
                      {itemCount} {itemCount === 1 ? "PIECE" : "PIECES"}
                    </span>
                    <button
                      type="button"
                      onClick={() => clearCart()}
                      className="text-[0.7rem] font-sans uppercase tracking-wider text-muted-foreground hover:text-red-700 underline underline-offset-2"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <ul className="divide-y divide-[#28201C]/15">
                  {items.map((item) => {
                    const isItemBusy = Boolean(itemLoading[item.id]);
                    const imageUrl =
                      item.product?.media?.[0]?.url ||
                      (Array.isArray(item.product?.images) ? item.product.images[0] : null) ||
                      "/placeholder.svg";

                    const isAtMaxStock =
                      item.availableStock !== undefined && item.quantity >= item.availableStock;

                    const productPath = item.product?.handle
                      ? `/products/${item.product.handle}`
                      : `/products/${item.productId}`;

                    return (
                      <li key={item.id} className="flex gap-5 py-6 sm:gap-8 sm:py-8">
                        {/* Product Thumbnail */}
                        <Link to={productPath as any} className="w-28 shrink-0 sm:w-40 md:w-44">
                          <div className="aspect-[3/4] w-full overflow-hidden bg-muted">
                            <img
                              src={imageUrl}
                              alt={item.product?.name || "Product"}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                              }}
                              className="h-full w-full object-cover object-top transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                        </Link>

                        {/* Product Information */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-serif text-base font-normal text-[#28201C] sm:text-lg md:text-xl">
                                  <Link to={productPath as any} className="hover:underline">
                                    {item.product?.name}
                                  </Link>
                                </h3>
                                <p className="mt-1 font-sans text-xs text-[#28201C]/70">
                                  {item.product?.color ? `${item.product.color} · ` : ""}
                                  {item.variant?.size
                                    ? `Size ${item.variant.size}`
                                    : "Standard Size"}
                                </p>
                                {item.availableStock !== undefined && item.availableStock <= 3 ? (
                                  <p className="mt-1 font-sans text-[0.7rem] text-amber-800">
                                    Only {item.availableStock} remaining in stock
                                  </p>
                                ) : null}
                              </div>

                              <p className="whitespace-nowrap font-serif text-base font-medium text-[#28201C] sm:text-lg">
                                {formatPrice(
                                  item.subtotal || (item.product?.sellPrice || 0) * item.quantity,
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Quantity Counter & Remove Action */}
                          <div className="mt-6 flex items-center justify-between border-t border-[#28201C]/10 pt-4">
                            <div className="flex items-center border border-[#28201C]/30 bg-transparent text-xs text-[#28201C]">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                disabled={isItemBusy}
                                className="px-3 py-1.5 transition-colors hover:bg-[#28201C]/5 disabled:opacity-40"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {isItemBusy ? (
                                  <Loader2 className="mx-auto h-3 w-3 animate-spin text-muted-foreground" />
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                disabled={isItemBusy || isAtMaxStock}
                                title={
                                  isAtMaxStock
                                    ? "Maximum available stock reached"
                                    : "Increase quantity"
                                }
                                className="px-3 py-1.5 transition-colors hover:bg-[#28201C]/5 disabled:opacity-40"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              type="button"
                              disabled={isItemBusy}
                              onClick={() => removeFromCart(item.id)}
                              className="flex items-center gap-1.5 font-sans text-[0.7rem] font-semibold uppercase tracking-wider text-[#28201C]/60 transition-colors hover:text-red-700 disabled:opacity-40"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>REMOVE</span>
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* RIGHT COLUMN: Editorial Summary (~35%) */}
              <aside className="lg:col-span-5 xl:col-span-4">
                <div className="sticky top-32 border border-[#28201C]/15 bg-[#FAF8F5] p-6 text-[#28201C] shadow-sm sm:p-8">
                  <h3 className="border-b border-[#28201C]/15 pb-4 font-serif text-xl font-normal uppercase tracking-wider text-[#28201C]">
                    SUMMARY
                  </h3>

                  <div className="mt-6 space-y-3.5 font-sans text-sm">
                    <div className="flex justify-between text-[#28201C]/80">
                      <span>Subtotal</span>
                      <span className="font-serif font-medium text-[#28201C]">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#28201C]/80">
                      <span>Shipping</span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#28201C]/70">
                        Complimentary
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-[#28201C]/15 pt-4 text-base font-bold text-[#28201C]">
                      <span>TOTAL</span>
                      <span className="font-serif text-lg">{formatPrice(subtotal)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={checkoutLoading || items.length === 0}
                    className="mt-8 w-full bg-[#28201C] py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] transition-colors hover:bg-[#3d322c] disabled:opacity-50"
                  >
                    {checkoutLoading ? "Processing..." : "PROCEED TO CHECKOUT"}
                  </button>

                  <div className="mt-6 space-y-2 border-t border-[#28201C]/10 pt-4 text-center text-xs text-[#28201C]/70">
                    <p className="font-medium">Complimentary shipping across India.</p>
                    <p>Handcrafted-to-order pieces dispatch in 4–6 weeks.</p>
                  </div>
                </div>
              </aside>
            </div>

            {/* Reassurance Row */}
            <div className="grid gap-6 border-y border-border/80 py-10 text-center sm:grid-cols-3">
              <div className="space-y-1">
                <Truck className="mx-auto h-5 w-5 text-[#28201C]/70" />
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-foreground">
                  COMPLIMENTARY SHIPPING
                </p>
                <p className="text-xs text-muted-foreground">Across India</p>
              </div>

              <div className="space-y-1">
                <Sparkles className="mx-auto h-5 w-5 text-[#28201C]/70" />
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-foreground">
                  HANDCRAFTED TO ORDER
                </p>
                <p className="text-xs text-muted-foreground">Made with care</p>
              </div>

              <div className="space-y-1">
                <ShieldCheck className="mx-auto h-5 w-5 text-[#28201C]/70" />
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-foreground">
                  CLIENT CARE
                </p>
                <p className="text-xs text-muted-foreground">We&apos;re here to help</p>
              </div>
            </div>

            {/* Complete Your Look Recommendations */}
            <div className="pt-6">
              <div className="mb-10 text-center">
                <p className="eyebrow text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  CURATED SELECTION
                </p>
                <h3 className="mt-2 font-serif text-2xl text-foreground md:text-3xl">
                  COMPLETE YOUR LOOK
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
                {completeYourLook.map((product) => (
                  <ProductCard key={product.handle || product.id} product={product} />
                ))}
              </div>
            </div>

            {/* Sticky Bottom Mobile Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-ivory/20 bg-espresso px-6 py-4 text-ivory shadow-2xl md:hidden">
              <div>
                <span className="block text-[0.65rem] uppercase tracking-widest text-ivory/70">
                  TOTAL
                </span>
                <span className="font-serif text-lg font-bold text-ivory">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkoutLoading || items.length === 0}
                className="flex items-center gap-2 bg-ivory px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-espresso transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <span>{checkoutLoading ? "Processing..." : "CHECKOUT"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
