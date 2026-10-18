import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Minus, Plus, Loader2, Check } from "lucide-react";
import { formatPrice } from "@/data/catalog";
import { getMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export interface VariantSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onConfirm: (variantId?: string, quantity?: number) => Promise<void>;
  loading?: boolean;
}

export function VariantSelectModal({
  isOpen,
  onClose,
  product,
  onConfirm,
  loading = false,
}: VariantSelectModalProps) {
  if (!isOpen || !product) return null;
  if (typeof document === "undefined") return null;

  const rawFirst = product.media?.[0]?.url || product.images?.[0];
  const firstPath = typeof rawFirst === "object" && rawFirst?.url ? rawFirst.url : rawFirst;
  const imageUrl =
    firstPath && typeof firstPath === "string" && !firstPath.startsWith("blob:")
      ? getMediaUrl(firstPath)
      : null;

  const title = product.title || product.name || "Handcrafted Piece";
  const sellPriceNum = Number(product.sellPrice ?? product.price ?? 0);
  const basePriceNum = Number(product.basePrice ?? 0);
  const hasDiscount = basePriceNum > sellPriceNum && sellPriceNum > 0;

  // Variants list: backend variants [{ id, size, stock }] or mock string sizes ["S", "M"]
  const rawVariants: any[] = Array.isArray(product.variants) && product.variants.length > 0
    ? product.variants
    : Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes.map((s: string) => ({ id: undefined, size: s, stock: product.stock ?? 10 }))
      : [];

  const [selectedVariant, setSelectedVariant] = useState<any | null>(() => {
    // If only 1 variant in stock, pre-select it
    if (rawVariants.length === 1 && (rawVariants[0].stock === undefined || rawVariants[0].stock > 0)) {
      return rawVariants[0];
    }
    return null;
  });
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (isOpen) {
      if (rawVariants.length === 1 && (rawVariants[0].stock === undefined || rawVariants[0].stock > 0)) {
        setSelectedVariant(rawVariants[0]);
      } else {
        setSelectedVariant(null);
      }
      setQty(1);
    }
  }, [isOpen, product?.id]);

  const availableStock = selectedVariant
    ? (selectedVariant.stock ?? product.stock ?? 10)
    : (product.stock ?? 10);

  const isAtMaxStock = qty >= availableStock;

  const handleConfirm = async () => {
    if (rawVariants.length > 0 && !selectedVariant) {
      return;
    }
    await onConfirm(selectedVariant?.id, qty);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1917]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-sm border border-[#28201C]/15 bg-[#FAF8F5] p-6 text-[#28201C] shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 text-[#28201C]/60 transition-colors hover:bg-[#28201C]/10 hover:text-[#28201C]"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Product Summary Header */}
        <div className="flex gap-4 border-b border-[#28201C]/10 pb-5">
          <div className="aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-xs bg-muted shadow-xs">
            {imageUrl ? (
              <img src={imageUrl} alt={title} className="h-full w-full object-cover object-top" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-stone-200 text-stone-400 text-xs">
                LaMoksh
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-center">
            <span className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#28201C]/60">
              {product.type || product.color || "ATELIER SELECTION"}
            </span>
            <h3 className="mt-1 font-serif text-lg font-normal leading-snug text-[#28201C]">
              {title}
            </h3>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-base font-medium text-[#28201C]">
                {formatPrice(sellPriceNum)}
              </span>
              {hasDiscount && (
                <span className="font-serif text-xs text-[#28201C]/50 line-through">
                  {formatPrice(basePriceNum)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Size / Variant Picker */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[#28201C]/80">
              Select Size / Variant
            </p>
            {selectedVariant ? (
              <span className="text-[0.72rem] text-[#28201C]/60">
                {selectedVariant.stock !== undefined && selectedVariant.stock <= 3 && selectedVariant.stock > 0 ? (
                  <span className="font-medium text-amber-800">Only {selectedVariant.stock} left</span>
                ) : selectedVariant.stock <= 0 ? (
                  <span className="text-red-700 font-medium">Out of stock</span>
                ) : (
                  <span>Available</span>
                )}
              </span>
            ) : (
              <span className="text-[0.7rem] font-medium text-amber-800">Required</span>
            )}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {rawVariants.map((variant, idx) => {
              const isSelected =
                selectedVariant &&
                (variant.id ? selectedVariant.id === variant.id : selectedVariant.size === variant.size);
              const isOutOfStock = variant.stock !== undefined && variant.stock <= 0;

              return (
                <button
                  key={variant.id || variant.size || idx}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setQty(1);
                  }}
                  className={cn(
                    "relative flex h-11 items-center justify-center rounded-[2px] border font-sans text-xs font-semibold uppercase tracking-wider transition-all",
                    isSelected
                      ? "border-[#28201C] bg-[#28201C] text-[#FAF8F5] shadow-sm"
                      : "border-[#28201C]/25 bg-white text-[#28201C] hover:border-[#28201C]/70",
                    isOutOfStock &&
                      "cursor-not-allowed border-dashed border-[#28201C]/20 bg-stone-100/60 text-[#28201C]/35 line-through",
                  )}
                >
                  <span>{variant.size}</span>
                  {isSelected && (
                    <Check className="absolute right-1 top-1 h-2.5 w-2.5 text-[#FAF8F5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="mt-6 flex items-center justify-between border-t border-[#28201C]/10 pt-4">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[#28201C]/80">
            Quantity
          </span>

          <div className="flex items-center border border-[#28201C]/30 bg-white">
            <button
              type="button"
              disabled={qty <= 1 || loading}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-[#28201C] transition-colors hover:bg-stone-100 disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-8 text-center text-xs font-semibold">{qty}</span>
            <button
              type="button"
              disabled={isAtMaxStock || loading}
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-2 text-[#28201C] transition-colors hover:bg-stone-100 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          disabled={loading || (rawVariants.length > 0 && !selectedVariant) || availableStock <= 0}
          onClick={handleConfirm}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-[#28201C] font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] transition-colors hover:bg-[#3d322c] disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#FAF8F5]" />
          ) : rawVariants.length > 0 && !selectedVariant ? (
            "Select a Size"
          ) : availableStock <= 0 ? (
            "Sold Out"
          ) : (
            "Add to Bag"
          )}
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default VariantSelectModal;
