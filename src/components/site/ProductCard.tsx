import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, Heart, ShoppingBag, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, type Product } from "@/data/catalog";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  className,
}: {
  product: Product | any;
  className?: string;
}) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isItemWishlisted } = useWishlist();
  const [addingToCart, setAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [hoverError, setHoverError] = useState(false);

  const rawId = product.id || product.handle;
  const productId =
    typeof rawId === "string"
      ? rawId.replace(/^blob:https?:\/\/[^\/]+\//i, "").replace(/^https?:\/\/[^\/]+\//i, "").trim()
      : rawId;
  const isWishlisted =
    isItemWishlisted(productId) || (product.handle ? isItemWishlisted(product.handle) : false);

  const inStock = product.inStock !== false && (product.stock === undefined || product.stock > 0);

  const hasVariants = Boolean(
    (product.variants && product.variants.length > 0) ||
    (product.sizes && product.sizes.length > 1),
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) return;

    if (hasVariants) {
      toast.warning("Please select a size/variant before adding to cart");
      navigate({
        to: "/products/$handle",
        params: { handle: product.handle || product.id },
      });
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(productId, 1);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(productId);
  };

  const rawFirst = product.media?.[0]?.url || product.images?.[0];
  const rawHover = product.media?.[1]?.url || product.images?.[1];

  const firstPath = typeof rawFirst === "object" && rawFirst?.url ? rawFirst.url : rawFirst;
  const hoverPath = typeof rawHover === "object" && rawHover?.url ? rawHover.url : rawHover;

  const imageUrl =
    firstPath && typeof firstPath === "string" && !firstPath.startsWith("blob:")
      ? getMediaUrl(firstPath)
      : null;
  const hoverImageUrl =
    hoverPath && typeof hoverPath === "string" && !hoverPath.startsWith("blob:")
      ? getMediaUrl(hoverPath)
      : null;

  const title = product.title || product.name;
  const sellPriceNum = Number(product.sellPrice ?? product.price ?? 0);
  const basePriceNum = Number(product.basePrice ?? 0);
  const hasDiscount = basePriceNum > sellPriceNum && sellPriceNum > 0;

  return (
    <div className={cn("group relative", className)}>
      <div className="media-zoom relative aspect-[3/4] overflow-hidden bg-[#FAF8F5] border border-[#E7E5E4] rounded-sm">
        <Link
          to="/products/$handle"
          params={{ handle: product.handle || product.id }}
          className="block h-full w-full"
        >
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-[#FAF8F5] text-[#A8A29E]">
              <ImageIcon className="h-8 w-8 stroke-[1.2] opacity-40 mb-1.5" />
              <span className="text-[10px] uppercase tracking-widest font-sans font-medium text-[#78716C]">
                No Image
              </span>
            </div>
          )}
          {hoverImageUrl && !hoverError ? (
            <img
              src={hoverImageUrl}
              alt=""
              aria-hidden
              loading="lazy"
              onError={() => setHoverError(true)}
              className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          ) : null}
        </Link>

        {/* Stock Status Tag */}
        {inStock ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-emerald-800/85 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm shadow-sm">
            In Stock
          </span>
        ) : (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-stone-900/85 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-stone-200 backdrop-blur-sm shadow-sm">
            Out of Stock
          </span>
        )}

        {/* 3 Circular Floating Action Buttons at Bottom of Image (Hover only) */}
        <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-3 px-2 opacity-0 translate-y-3 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
          {/* Option 1: Add to Bag */}
          <button
            type="button"
            title={inStock ? "Add to bag" : "Out of stock"}
            aria-label={inStock ? "Add to bag" : "Out of stock"}
            disabled={!inStock || addingToCart}
            onClick={handleAddToCart}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#1C1917] shadow-md transition-all duration-300 hover:scale-110 hover:bg-[#6B1D2F] hover:text-white focus-visible:scale-110 disabled:opacity-40"
          >
            {addingToCart ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <ShoppingBag className="h-4.5 w-4.5" />
            )}
          </button>

          {/* Option 2: Quick View */}
          <Link
            to="/products/$handle"
            params={{ handle: product.handle || product.id }}
            title="Quick view"
            aria-label="Quick view"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#1C1917] shadow-md transition-all duration-300 hover:scale-110 hover:bg-[#6B1D2F] hover:text-white focus-visible:scale-110"
          >
            <Eye className="h-4.5 w-4.5" />
          </Link>

          {/* Option 3: Wishlist Toggle */}
          <button
            type="button"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleToggleWishlist}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#1C1917] shadow-md transition-all duration-300 hover:scale-110 hover:bg-[#6B1D2F] hover:text-white focus-visible:scale-110"
          >
            <Heart
              className={cn(
                "h-4.5 w-4.5 transition-colors",
                isWishlisted && "fill-current text-[#6B1D2F]",
              )}
            />
          </button>
        </div>
      </div>

      <div className="pt-3.5 space-y-1">
        {/* Color Variant Tag / Product Type */}
        <div className="flex items-center gap-2">
          {product.color ? (
            <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
              {product.color}
            </span>
          ) : product.type ? (
            <span className="eyebrow text-[10px]">{product.type}</span>
          ) : null}
        </div>

        <h3 className="font-serif text-base leading-snug">
          <Link
            to="/products/$handle"
            params={{ handle: product.handle || product.id }}
            className="text-[#1C1917] hover:text-[#6B1D2F] transition-colors line-clamp-1"
          >
            {title}
          </Link>
        </h3>

        {/* Pricing with Strike-through Base Price & Discount */}
        <div className="flex flex-wrap items-baseline gap-2 pt-0.5">
          <span className="text-sm font-semibold text-[#1C1917]">
            {formatPrice(sellPriceNum)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-[#A8A29E] line-through">
              {formatPrice(basePriceNum)}
            </span>
          )}
          {hasDiscount && (
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
              {Math.round(((basePriceNum - sellPriceNum) / basePriceNum) * 100)}% off
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
