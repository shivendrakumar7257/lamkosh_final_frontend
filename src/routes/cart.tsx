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
  Heart,
  CheckCircle2,
  AlertCircle,
  Tag,
  Lock,
  ShoppingBag,
} from "lucide-react";
import subcategoryBannerBg from "@/assets/subcategory-banner-bg.png";
import { ProductCard } from "@/components/site/ProductCard";
import { formatPrice, products } from "@/data/catalog";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Atelier Bag — LaMoksh Fabrics" },
      {
        name: "description",
        content: "Review your handcrafted artisanal pieces, fabric details, and proceed to secure checkout.",
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
  const { addToWishlist } = useWishlist();
  const [movingToWishlist, setMovingToWishlist] = useState<Record<string, boolean>>({});

  const items = cart?.items || [];

  // Curated recommendations from catalog
  const curatedEdit = products.slice(0, 4);
  const completeYourLook = products.slice(4, 8);

  const handleCheckout = () => {
    navigate({ to: "/checkout" });
  };

  const handleMoveToWishlist = async (itemId: string, productId: string, productSnapshot?: any) => {
    setMovingToWishlist((prev) => ({ ...prev, [itemId]: true }));
    try {
      await addToWishlist(productId, productSnapshot);
      await removeFromCart(itemId);
      toast.success("Piece moved to your Saved Wishlist");
    } catch {
      toast.error("Failed to move item to wishlist");
    } finally {
      setMovingToWishlist((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  // Calculate total original base price & savings if available
  const totalBasePrice = items.reduce((acc, item) => {
    const bp = item.product?.basePrice || item.product?.sellPrice || 0;
    return acc + bp * item.quantity;
  }, 0);
  const totalSavings = Math.max(0, totalBasePrice - subtotal);

  return (
    <div className={cn("min-h-screen bg-background", items.length > 0 && "pb-28 md:pb-20")}>
      {/* Editorial Luxury Header Banner */}
      <section className="relative flex min-h-[220px] items-center overflow-hidden border-b border-border/80 py-12 md:min-h-[260px] md:py-16">
        <img
          src={subcategoryBannerBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#28201C]/35 backdrop-brightness-95" />
        <div className="container-lux relative z-10 text-center text-ivory">
          <nav className="flex justify-center gap-2 text-xs text-ivory/85">
            <Link to="/" className="hover:text-ivory hover:underline">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-ivory">Your Bag</span>
          </nav>
          <p className="eyebrow mt-4 uppercase tracking-[0.22em] text-ivory/85">ATELIER CART</p>
          <h1 className="mt-2 font-serif text-3xl font-normal text-ivory sm:text-4xl md:text-5xl">
            Your Bag
          </h1>
          <p className="mt-2 font-serif text-sm italic text-ivory/95">
            Handcrafted pieces reserved for your wardrobe.
          </p>
        </div>
      </section>

      {/* Main Bag Content */}
      <div className="container-lux py-10 md:py-16">
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
                  <ShoppingBag className="mx-auto h-12 w-12 text-[#28201C]/50" />
                  <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#28201C]/60 mt-4 block">
                    ATELIER DRESSING ROOM
                  </span>
                  <h2 className="mt-2 font-serif text-2xl uppercase tracking-wider text-[#28201C] sm:text-3xl">
                    YOUR BAG IS WAITING
                  </h2>
                  <p className="mt-3 font-sans text-xs text-[#28201C]/75 leading-relaxed max-w-md mx-auto">
                    Your handcrafted fabrics and bespoke garment selections will appear here. Each
                    creation is tailored with artisanal precision.
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
          <div className="space-y-16">
            {/* Complimentary Shipping Banner */}
            <div className="flex items-center justify-between gap-4 border border-emerald-200/80 bg-emerald-50/60 px-5 py-3 text-xs text-emerald-950 rounded-[2px]">
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>
                  <strong className="font-semibold text-emerald-900">Complimentary Doorstep Shipping</strong> across India is applied to your order.
                </span>
              </div>
              <span className="font-mono text-[0.68rem] font-bold text-emerald-800 uppercase tracking-widest hidden sm:inline-block">
                ₹0 FREE DELIVERY
              </span>
            </div>

            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* LEFT COLUMN: Product Rows (~68%) */}
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="flex items-center justify-between border-b border-[#28201C]/20 pb-4">
                  <div>
                    <h2 className="font-serif text-xl font-normal uppercase tracking-wider text-[#28201C]">
                      YOUR BAG
                    </h2>
                    <p className="text-[0.68rem] text-muted-foreground uppercase tracking-widest mt-0.5">
                      {itemCount} {itemCount === 1 ? "PIECE RESERVED" : "PIECES RESERVED"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => clearCart()}
                    className="text-[0.7rem] font-sans uppercase tracking-wider text-muted-foreground hover:text-red-700 underline underline-offset-2 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <ul className="divide-y divide-[#28201C]/15">
                  {items.map((item) => {
                    const isItemBusy = Boolean(itemLoading[item.id]);
                    const isWishlistBusy = Boolean(movingToWishlist[item.id]);
                    const imageUrl =
                      item.product?.media?.[0]?.url ||
                      (Array.isArray(item.product?.images) ? item.product.images[0] : null) ||
                      "/placeholder.svg";

                    const isAtMaxStock =
                      item.availableStock !== undefined && item.quantity >= item.availableStock;

                    const productPath = item.product?.handle
                      ? `/products/${item.product.handle}`
                      : `/products/${item.productId}`;

                    const unitSellPrice = item.product?.sellPrice || 0;
                    const unitBasePrice = item.product?.basePrice || 0;
                    const hasDiscount = unitBasePrice > unitSellPrice;
                    const itemSavings = hasDiscount ? (unitBasePrice - unitSellPrice) * item.quantity : 0;
                    const discountPercent = hasDiscount
                      ? Math.round(((unitBasePrice - unitSellPrice) / unitBasePrice) * 100)
                      : 0;

                    return (
                      <li key={item.id} className="flex flex-col sm:flex-row gap-5 py-8 sm:gap-7 border-b border-[#28201C]/10 last:border-b-0">
                        {/* Product Thumbnail with Luxury aspect ratio */}
                        <Link
                          to={productPath as any}
                          className="relative w-full sm:w-40 md:w-48 shrink-0 overflow-hidden bg-[#FAF8F5] border border-border/80 group"
                        >
                          <div className="aspect-[3/4] w-full overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={item.product?.name || "Product"}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                              }}
                              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <span className="absolute top-2 left-2 bg-[#28201C]/80 backdrop-blur-sm text-[0.6rem] font-semibold uppercase tracking-widest text-[#FAF8F5] px-2 py-0.5">
                            Handcrafted
                          </span>
                        </Link>

                        {/* Product Detailed Information */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="space-y-3">
                            {/* Title & Line Price */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div>
                                <h3 className="font-serif text-lg font-normal text-[#28201C] sm:text-xl">
                                  <Link to={productPath as any} className="hover:underline">
                                    {item.product?.name}
                                  </Link>
                                </h3>

                                {/* Specification Badges */}
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                  {item.variant?.size && (
                                    <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-border/80 px-2.5 py-0.5 text-[0.7rem] font-medium text-foreground">
                                      Size: <strong className="font-semibold">{item.variant.size}</strong>
                                    </span>
                                  )}
                                  {item.product?.color && (
                                    <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-border/80 px-2.5 py-0.5 text-[0.7rem] font-medium text-foreground">
                                      Color: <strong className="font-semibold">{item.product.color}</strong>
                                    </span>
                                  )}
                                  <span className="text-[0.68rem] text-muted-foreground font-mono">
                                    Ref: {item.productId.slice(0, 8)}
                                  </span>
                                </div>
                              </div>

                              {/* Price Display */}
                              <div className="sm:text-right">
                                <div className="font-serif text-lg font-bold text-[#28201C] sm:text-xl font-mono">
                                  {formatPrice(
                                    item.subtotal || unitSellPrice * item.quantity,
                                  )}
                                </div>
                                <div className="text-[0.7rem] text-muted-foreground font-mono mt-0.5">
                                  {formatPrice(unitSellPrice)} each
                                  {hasDiscount && (
                                    <span className="line-through ml-1.5 text-muted-foreground/70">
                                      {formatPrice(unitBasePrice)}
                                    </span>
                                  )}
                                </div>
                                {hasDiscount && (
                                  <span className="inline-block mt-1 bg-amber-100 text-amber-900 border border-amber-200 text-[0.65rem] font-semibold uppercase px-2 py-0.5 rounded-[2px]">
                                    Save {formatPrice(itemSavings)} ({discountPercent}% Off)
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Artisanal Description Snippet */}
                            {item.product?.description && (
                              <p className="text-xs text-[#28201C]/75 line-clamp-2 italic font-serif leading-relaxed">
                                &ldquo;{item.product.description}&rdquo;
                              </p>
                            )}

                            {/* Stock & Delivery Status */}
                            <div className="pt-1">
                              {item.availableStock !== undefined && item.availableStock <= 3 ? (
                                <p className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold text-amber-800">
                                  <AlertCircle className="h-3.5 w-3.5" />
                                  Only {item.availableStock} left in atelier stock
                                </p>
                              ) : (
                                <p className="inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-emerald-800">
                                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                                  In Stock &bull; Ready for Atelier Inspection & Dispatch
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quantity Counter & Actions Row */}
                          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#28201C]/10 pt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <span className="text-[0.68rem] uppercase tracking-wider text-muted-foreground font-semibold">
                                Quantity:
                              </span>
                              <div className="flex items-center border border-[#28201C]/30 bg-[#FAF8F5] text-xs text-[#28201C]">
                                <button
                                  type="button"
                                  aria-label="Decrease quantity"
                                  disabled={isItemBusy || item.quantity <= 1}
                                  className="px-3 py-1.5 transition-colors hover:bg-[#28201C]/10 disabled:opacity-40"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center font-mono font-medium text-xs">
                                  {isItemBusy ? (
                                    <Loader2 className="inline h-3 w-3 animate-spin text-[#28201C]" />
                                  ) : (
                                    item.quantity
                                  )}
                                </span>
                                <button
                                  type="button"
                                  aria-label="Increase quantity"
                                  disabled={isItemBusy || isAtMaxStock}
                                  className="px-3 py-1.5 transition-colors hover:bg-[#28201C]/10 disabled:opacity-40"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              {isAtMaxStock && (
                                <span className="text-[0.65rem] text-muted-foreground italic">
                                  (Max stock reached)
                                </span>
                              )}
                            </div>

                            {/* Secondary Action Buttons */}
                            <div className="flex items-center gap-4 text-xs">
                              {/* Move to Wishlist */}
                              <button
                                type="button"
                                disabled={isWishlistBusy}
                                onClick={() => handleMoveToWishlist(item.id, item.productId, item.product)}
                                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-espresso text-[0.7rem] uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                              >
                                {isWishlistBusy ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Heart className="h-3.5 w-3.5" />
                                )}
                                <span>Save For Later</span>
                              </button>

                              {/* Remove Item */}
                              <button
                                type="button"
                                disabled={isItemBusy}
                                onClick={() => removeFromCart(item.id)}
                                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-red-700 text-[0.7rem] uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* RIGHT COLUMN: Premium Sticky Order Summary (~32%) */}
              <div className="lg:col-span-5 xl:col-span-4">
                <aside className="sticky top-28 space-y-6">
                  <div className="rounded-sm border border-border/80 bg-[#FAF8F5] p-6 md:p-8 shadow-sm space-y-6">
                    <div className="border-b border-[#28201C]/15 pb-4">
                      <span className="eyebrow text-[0.68rem] text-muted-foreground uppercase tracking-widest">
                        ATELIER CHECKOUT
                      </span>
                      <h2 className="font-serif text-2xl font-normal text-[#28201C] mt-1">
                        Order Summary
                      </h2>
                    </div>

                    <div className="space-y-3.5 text-xs text-[#28201C]/80">
                      <div className="flex justify-between">
                        <span>Items Subtotal ({itemCount} {itemCount === 1 ? "piece" : "pieces"})</span>
                        <span className="font-mono font-medium text-foreground">
                          {formatPrice(totalBasePrice > subtotal ? totalBasePrice : subtotal)}
                        </span>
                      </div>

                      {totalSavings > 0 && (
                        <div className="flex justify-between text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1.5 rounded-[2px] border border-emerald-200">
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span>Atelier Savings</span>
                          </span>
                          <span className="font-mono">- {formatPrice(totalSavings)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="flex items-center gap-1.5">
                          <Truck className="h-3.5 w-3.5 text-emerald-700" />
                          <span>Insured Courier Shipping</span>
                        </span>
                        <span className="font-mono font-semibold text-emerald-700 uppercase tracking-widest text-[0.7rem]">
                          COMPLIMENTARY
                        </span>
                      </div>

                      <div className="flex justify-between text-[0.7rem] text-muted-foreground pt-1">
                        <span>GST & Government Levies</span>
                        <span className="italic">Inclusive in product price</span>
                      </div>
                    </div>

                    {/* Total Highlight */}
                    <div className="border-t border-[#28201C]/20 pt-5">
                      <div className="flex items-baseline justify-between">
                        <span className="font-serif text-base uppercase tracking-wider text-[#28201C]">
                          Estimated Total
                        </span>
                        <span className="font-serif text-2xl md:text-3xl font-bold text-[#28201C] font-mono">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                      <p className="mt-1 text-[0.68rem] text-muted-foreground">
                        Payable via Cash on Delivery or Secure Online UPI / Cards.
                      </p>
                    </div>

                    {/* Desktop Checkout CTA */}
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={items.length === 0}
                      className="w-full flex items-center justify-center gap-2 bg-[#28201C] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] transition-all hover:bg-[#3d322c] shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>PROCEED TO LUXURY CHECKOUT</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <div className="space-y-2 border-t border-[#28201C]/10 pt-4 text-center text-[0.7rem] text-[#28201C]/70">
                      <p className="font-medium text-foreground">
                        Live GPS tracking with Shiprocket courier updates.
                      </p>
                      <p>
                        Handcrafted-to-order pieces dispatch with priority insurance.
                      </p>
                    </div>
                  </div>

                  {/* Trust & Guarantee Badges */}
                  <div className="rounded-sm border border-border/80 bg-background p-5 text-xs text-muted-foreground space-y-3 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-espresso shrink-0" />
                      <span>100% Certified Authentic Handloom & Textiles</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="h-4 w-4 text-espresso shrink-0" />
                      <span>Bespoke Hand-Finished Packaging & Atelier Dust Cover</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Truck className="h-4 w-4 text-espresso shrink-0" />
                      <span>Verified Doorstep Delivery with OTP Handover</span>
                    </div>
                  </div>
                </aside>
              </div>
            </div>

            {/* Complete Your Look Recommendations */}
            {completeYourLook.length > 0 && (
              <div className="border-t border-border/70 pt-16">
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
            )}

            {/* Sticky Bottom Mobile Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-ivory/20 bg-espresso px-6 py-4 text-ivory shadow-2xl md:hidden">
              <div>
                <span className="block text-[0.65rem] uppercase tracking-widest text-ivory/70">
                  TOTAL
                </span>
                <span className="font-serif text-lg font-bold text-ivory font-mono">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="flex items-center gap-2 bg-ivory px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-espresso transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <span>CHECKOUT</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
