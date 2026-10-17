import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, getProduct, products } from "@/data/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductReviews } from "@/components/site/ProductReviews";
import { ProductDescriptionView } from "@/components/site/ProductDescriptionView";
import { getCategoryNonModelImage } from "@/components/site/CategoryCard";
import { Reveal } from "@/components/site/Reveal";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductApi } from "@/lib/api/product.api";
import { dbStore } from "@/lib/db/store";
import { getMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$handle")({
  loader: async ({ params }) => {
    let product: any = null;

    // 1. Prioritize Live Public API for real product data and media
    try {
      const apiProd = await ProductApi.getPublicProductById(params.handle);
      if (apiProd && apiProd.id) {
        // Collect media images and filter out videos or invalid blob URLs
        const mediaImages = (apiProd.media || [])
          .filter(
            (m: any) =>
              m &&
              m.type !== "VIDEO" &&
              !(typeof m.url === "string" && m.url.toLowerCase().endsWith(".mp4")),
          )
          .map((m: any) => {
            const raw = typeof m === "string" ? m : m?.url || m?.imageUrl;
            return raw ? getMediaUrl(raw) : "";
          })
          .filter((url: string) => Boolean(url) && !url.startsWith("blob:"));

        const directImages = (apiProd.images || [])
          .map((img: any) => {
            const raw = typeof img === "string" ? img : img?.url || img?.imageUrl;
            return raw ? getMediaUrl(raw) : "";
          })
          .filter((url: string) => Boolean(url) && !url.startsWith("blob:"));

        const resolvedImages = mediaImages.length > 0 ? mediaImages : directImages;

        // Fallback to non-model image if no images in API
        const fallbackImg = getCategoryNonModelImage(apiProd.category?.name || apiProd.name, apiProd.id);
        const finalImages = resolvedImages.length > 0 ? resolvedImages : [fallbackImg];

        product = {
          id: apiProd.id,
          handle: apiProd.id,
          title: apiProd.name,
          name: apiProd.name,
          price: Number(apiProd.sellPrice ?? apiProd.price ?? 0),
          sellPrice: Number(apiProd.sellPrice ?? apiProd.price ?? 0),
          basePrice: Number(apiProd.basePrice ?? 0),
          category: apiProd.category?.name || "Clothing",
          categoryId: apiProd.category?.id || apiProd.categoryId,
          type: apiProd.category?.name || apiProd.color || "Handcrafted Piece",
          collections: [],
          material: apiProd.color || "Fine Silk",
          colour: apiProd.color || "Natural",
          inStock: (apiProd.stock ?? 0) > 0,
          images: finalImages,
          media: apiProd.media || [],
          description: apiProd.description || "",
          craft: "Atelier handcrafted weave with authentic zari embroidery",
          dimensions: "Standard dimensions",
          care: "Dry clean only to preserve fine zari threadwork",
          sizes: apiProd.variants?.map((v: any) => v.size) || [],
          variants: apiProd.variants || [],
          stock: apiProd.stock,
          gst: apiProd.gst,
        };
      }
    } catch (err) {
      console.warn("ProductApi.getPublicProductById error:", err);
    }

    // 2. Fallback to catalog seed
    if (!product) {
      product = getProduct(params.handle);
    }

    // 3. Fallback to dbStore if offline or local
    if (!product) {
      const localProd = dbStore
        .getProducts()
        .find((p) => p.handle === params.handle || p.id === params.handle);
      if (localProd) {
        const cleanImages = (localProd.images || []).filter(
          (img: string) => !img.startsWith("blob:"),
        );
        const fallbackImg = getCategoryNonModelImage(localProd.title, localProd.id);
        product = {
          ...localProd,
          images: cleanImages.length > 0 ? cleanImages : [fallbackImg],
        };
      }
    }

    if (!product) throw notFound();
    return { product };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData?.product) {
      return {
        meta: [
          { title: "Piece unavailable — LaMoksh Fabrics" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.title} — LaMoksh Fabrics` },
        { name: "description", content: (p.description || "").slice(0, 155) },
        { property: "og:title", content: `${p.title} — LaMoksh Fabrics` },
        { property: "og:description", content: (p.description || "").slice(0, 155) },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/products/${params.handle}` },
      ],
      links: [{ rel: "canonical", href: `/products/${params.handle}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.title,
            description: p.description,
            image: p.images?.[0] || "",
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: p.price,
              availability: p.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart } = useCart();
  const { toggleWishlist, isItemWishlisted } = useWishlist();

  const rawId = product.id || product.handle;
  const productId =
    typeof rawId === "string"
      ? rawId.replace(/^blob:https?:\/\/[^\/]+\//i, "").replace(/^https?:\/\/[^\/]+\//i, "").trim()
      : rawId;
  const isWishlisted =
    isItemWishlisted(productId) || (product.handle ? isItemWishlisted(product.handle) : false);

  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
  const [size, setSize] = useState<string | undefined>(
    hasVariants ? undefined : product.sizes?.[0],
  );
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [open, setOpen] = useState<string | null>("craft");
  const galleryRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Available stock calculation based on variant or base product stock
  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  const availableStock = selectedVariant ? selectedVariant.stock : (product.stock ?? 10);
  const isAtMaxStock = qty >= availableStock;

  // Similar Products dynamic state
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSimilar = async () => {
      setLoadingSimilar(true);
      try {
        // Query products matching category or general list
        const res = await ProductApi.getPublicProducts({
          categoryId: product.categoryId || undefined,
          limit: 12,
        });
        const list = res?.products || [];
        let filtered = list.filter((p: any) => p.id !== productId && p.handle !== product.handle);

        // If not enough in category, fetch general collection
        if (filtered.length < 4) {
          const generalRes = await ProductApi.getPublicProducts({ limit: 12 });
          const generalList = generalRes?.products || [];
          const combined = [
            ...filtered,
            ...generalList.filter(
              (p: any) =>
                p.id !== productId &&
                p.handle !== product.handle &&
                !filtered.some((f: any) => f.id === p.id),
            ),
          ];
          filtered = combined;
        }

        // Fallback to local store / catalog if API has 0
        if (filtered.length === 0) {
          filtered = products.filter((p) => p.handle !== product.handle);
        }

        if (isMounted) {
          setSimilarProducts(filtered);
        }
      } catch (err) {
        console.warn("Failed to fetch similar products:", err);
      } finally {
        if (isMounted) setLoadingSimilar(false);
      }
    };

    fetchSimilar();
    return () => {
      isMounted = false;
    };
  }, [productId, product.categoryId, product.handle]);

  const scrollGallery = (direction: "left" | "right") => {
    if (galleryRef.current) {
      const container = galleryRef.current;
      const scrollAmount = container.clientWidth || 300;
      const targetScroll =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  const handleGalleryScroll = () => {
    if (galleryRef.current && galleryRef.current.clientWidth > 0) {
      const container = galleryRef.current;
      const index = Math.round(container.scrollLeft / container.clientWidth);
      if (!isNaN(index)) {
        setActiveImageIndex(index);
      }
    }
  };

  const scrollSimilar = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const amount = direction === "left" ? -320 : 320;
      carouselRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const accordions = [
    { key: "craft", title: "Craft & Atelier Weave", body: product.craft },
    { key: "dimensions", title: "Dimensions & Fit", body: product.dimensions },
    { key: "care", title: "Wash & Care Instructions", body: product.care },
    {
      key: "shipping",
      title: "Shipping & Complimentary Delivery",
      body: "Complimentary insured shipping across India. Ready-to-wear pieces dispatch within 24–48 hours; bespoke pieces dispatch in 7–10 days. Easy returns accepted within 7 days of delivery on unworn pieces.",
    },
  ];

  const imagesList: string[] = product.images && product.images.length > 0 ? product.images : [];
  const primaryFallback = getCategoryNonModelImage(product.title, product.id);

  return (
    <div>
      <div className="container-lux grid gap-10 py-8 lg:grid-cols-2 lg:py-14">
        {/* Desktop View: Main Active View + Thumbnails Strip & Vertical Gallery */}
        <div className="hidden lg:block space-y-4">
          {imagesList.length > 0 ? (
            <div className="space-y-4">
              {/* Primary Focused Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#FAF8F5] border border-[#E7E5E4] shadow-xs">
                <ProductGalleryImage
                  src={imagesList[activeImageIndex] || imagesList[0]}
                  alt={`${product.title} — view ${activeImageIndex + 1}`}
                  fallbackSrc={primaryFallback}
                  priority
                />
              </div>

              {/* Thumbnail Strip if multiple images */}
              {imagesList.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {imagesList.map((src: string, i: number) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => setActiveImageIndex(i)}
                      className={cn(
                        "relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border transition-all duration-200",
                        activeImageIndex === i
                          ? "border-[#6B1D2F] ring-2 ring-[#6B1D2F]/30"
                          : "border-[#E7E5E4] opacity-70 hover:opacity-100 hover:border-[#6B1D2F]/40",
                      )}
                    >
                      <img
                        src={src}
                        alt={`Thumbnail ${i + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Additional Gallery Rows */}
              {imagesList.length > 1 && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {imagesList.slice(1).map((src: string, i: number) => (
                    <div
                      key={src + i}
                      onClick={() => setActiveImageIndex(i + 1)}
                      className="cursor-pointer aspect-[3/4] overflow-hidden rounded-sm border border-[#E7E5E4] bg-[#FAF8F5]"
                    >
                      <ProductGalleryImage
                        src={src}
                        alt={`${product.title} — detail ${i + 2}`}
                        fallbackSrc={primaryFallback}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[3/4] w-full flex flex-col items-center justify-center bg-[#FAF8F5] border border-[#E7E5E4] text-[#78716C] rounded-sm">
              <ImageIcon className="w-8 h-8 opacity-40 mb-2" />
              <span className="text-xs uppercase tracking-widest font-sans font-medium">
                No Media Available
              </span>
            </div>
          )}
        </div>

        {/* Mobile View: Horizontal Slider with Left/Right Arrows */}
        <div className="relative group overflow-hidden lg:hidden">
          <div
            ref={galleryRef}
            onScroll={handleGalleryScroll}
            className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none rounded-sm gap-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {imagesList.length > 0 ? (
              imagesList.map((src: string, i: number) => (
                <div key={src + i} className="w-full flex-shrink-0 snap-center relative aspect-[3/4]">
                  <ProductGalleryImage
                    src={src}
                    alt={`${product.title} — view ${i + 1}`}
                    fallbackSrc={primaryFallback}
                    priority={i === 0}
                  />
                </div>
              ))
            ) : (
              <div className="w-full aspect-[3/4] flex flex-col items-center justify-center bg-[#FAF8F5] border border-[#E7E5E4] text-[#78716C] rounded-sm">
                <ImageIcon className="w-8 h-8 opacity-40 mb-2" />
                <span className="text-xs uppercase tracking-widest font-sans font-medium">
                  No Media Available
                </span>
              </div>
            )}
          </div>

          {/* Left & Right Arrow Slider Buttons */}
          {imagesList.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => scrollGallery("left")}
                className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground shadow-md transition-all hover:bg-white hover:scale-110 active:scale-95 z-20"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => scrollGallery("right")}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground shadow-md transition-all hover:bg-white hover:scale-110 active:scale-95 z-20"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Slider Dots Indicator */}
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-20">
                {imagesList.map((_: any, i: number) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => {
                      if (galleryRef.current) {
                        galleryRef.current.scrollTo({
                          left: i * galleryRef.current.clientWidth,
                          behavior: "smooth",
                        });
                      }
                    }}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      activeImageIndex === i ? "w-5 bg-[#6B1D2F]" : "w-1.5 bg-black/40",
                    )}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>

        {/* Right Info Column */}
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <nav className="flex gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link to="/clothing" className="hover:text-foreground">
              Clothing
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <span className="text-foreground">{product.category}</span>
              </>
            )}
          </nav>

          <p className="eyebrow mt-6 text-[#6B1D2F]">{product.type}</p>
          <h1 className="display-md mt-2 text-2xl sm:text-3xl lg:text-4xl">{product.title}</h1>

          {/* Pricing with Base MRP and Discount Badge */}
          <div className="mt-3 flex items-baseline gap-3">
            <p className="text-xl sm:text-2xl font-serif text-[#1C1917] font-semibold">
              {formatPrice(product.price)}
            </p>
            {product.basePrice && product.basePrice > product.price && (
              <>
                <p className="text-sm text-[#A8A29E] line-through">
                  {formatPrice(product.basePrice)}
                </p>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                  {Math.round(((product.basePrice - product.price) / product.basePrice) * 100)}% off
                </span>
              </>
            )}
          </div>

          {/* Point-wise, Structured and Attractive Product Description */}
          <div className="mt-6 border-t border-[#E7E5E4] pt-5">
            <ProductDescriptionView description={product.description} />
          </div>

          {/* Variant Selection UI */}
          {hasVariants ? (
            <div className="mt-8 border-t border-[#E7E5E4] pt-6">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Select Size / Variant</p>
                {selectedVariant ? (
                  <span className="text-xs text-muted-foreground">
                    {selectedVariant.stock > 0
                      ? `${selectedVariant.stock} available in stock`
                      : "Out of stock"}
                  </span>
                ) : (
                  <span className="text-xs text-[#6B1D2F] font-medium">Please select a size</span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((v: any) => {
                  const isOutOfStock = v.stock <= 0;
                  const isSelected = selectedVariantId === v.id;
                  return (
                    <button
                      key={v.id || v.size}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => {
                        setSelectedVariantId(v.id);
                        setSize(v.size);
                        setQty(1);
                      }}
                      className={cn(
                        "border px-4 py-2 text-sm transition-colors rounded-sm",
                        isSelected
                          ? "border-[#6B1D2F] bg-[#6B1D2F] text-white"
                          : "border-border hover:border-foreground/60 bg-white",
                        isOutOfStock && "opacity-40 line-through cursor-not-allowed border-dashed",
                      )}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : product.sizes?.length ? (
            <div className="mt-8 border-t border-[#E7E5E4] pt-6">
              <p className="eyebrow">Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s: string) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      "border border-border px-4 py-2 text-sm transition-colors rounded-sm",
                      size === s && "border-[#6B1D2F] bg-[#6B1D2F] text-white",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Action Row: Quantity + Add to Bag + Wishlist */}
          <div className="mt-8 flex items-center gap-4 sm:gap-6">
            <div className="flex items-center border border-border bg-white rounded-sm">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="px-3 py-3 hover:bg-muted transition-colors disabled:opacity-40"
                disabled={qty <= 1}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={isAtMaxStock}
                title={isAtMaxStock ? "Maximum available stock reached" : "Increase quantity"}
                className="px-3 py-3 hover:bg-muted transition-colors disabled:opacity-40"
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              className="btn-lux flex-1 justify-center disabled:opacity-40 gap-2 text-xs uppercase tracking-wider py-3"
              disabled={!product.inStock || availableStock <= 0 || addingToCart}
              onClick={async () => {
                if (hasVariants && !selectedVariantId) {
                  toast.warning("Please select a size before adding to bag");
                  return;
                }
                try {
                  setAddingToCart(true);
                  await addToCart(productId, qty, hasVariants ? selectedVariantId : undefined);
                } finally {
                  setAddingToCart(false);
                }
              }}
            >
              {addingToCart ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : !product.inStock || availableStock <= 0 ? (
                "Sold Out"
              ) : (
                "Add to Bag"
              )}
            </button>

            <button
              type="button"
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => toggleWishlist(productId)}
              className="grid h-11 w-11 place-items-center rounded-sm border border-[#E7E5E4] bg-white transition-all hover:border-[#6B1D2F]"
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  isWishlisted ? "fill-[#6B1D2F] text-[#6B1D2F]" : "text-foreground",
                )}
              />
            </button>
          </div>

          {/* Accordions */}
          <dl className="mt-10 border-t border-border">
            {accordions.map((a) => (
              <div key={a.key} className="border-b border-border">
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpen((prev) => (prev === a.key ? null : a.key))}
                    className="nav-label flex w-full items-center justify-between py-4 text-left"
                  >
                    <span>{a.title}</span>
                    <span className="text-base">{open === a.key ? "−" : "+"}</span>
                  </button>
                </dt>
                {open === a.key ? <dd className="body-lux pb-4 text-xs sm:text-sm text-[#57534E] leading-relaxed">{a.body}</dd> : null}
              </div>
            ))}
          </dl>

          <p className="mt-6 text-xs text-muted-foreground">
            {product.material} · {product.colour} · Atelier Verified Piece
          </p>
        </div>
      </div>

      {/* Customer Reviews & Ratings (Compact & Attractive) */}
      <section className="container-lux">
        <ProductReviews
          productId={product.id || product.handle}
          productName={product.title}
        />
      </section>

      {/* Similar Products & Completing the Look */}
      {similarProducts.length > 0 ? (
        <section className="container-lux mt-20 pt-10 border-t border-[#E7E5E4]">
          <div className="flex items-end justify-between gap-4">
            <Reveal>
              <p className="eyebrow text-[#6B1D2F]">CURATED EDITS</p>
              <h2 className="display-md mt-1.5 text-2xl sm:text-3xl">Similar Creations & Completing the Look</h2>
            </Reveal>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollSimilar("left")}
                aria-label="Previous products"
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background transition-colors hover:bg-espresso hover:text-ivory"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollSimilar("right")}
                aria-label="Next products"
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background transition-colors hover:bg-espresso hover:text-ivory"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="no-scrollbar mt-8 flex gap-6 overflow-x-auto pb-6 pt-1 scroll-smooth"
          >
            {similarProducts.map((p) => (
              <div key={p.id || p.handle} className="w-[260px] shrink-0 sm:w-[280px] lg:w-[290px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ProductGalleryImage({
  src,
  alt,
  fallbackSrc,
  priority,
}: {
  src: string;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !currentSrc) {
    return (
      <div className="aspect-[3/4] w-full flex flex-col items-center justify-center bg-[#FAF8F5] border border-[#E7E5E4] text-[#A8A29E] rounded-sm">
        <ImageIcon className="w-10 h-10 stroke-[1.2] opacity-40 mb-2" />
        <span className="text-xs uppercase tracking-widest font-sans font-medium text-[#78716C]">
          Image Unavailable
        </span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      onError={handleError}
      className="aspect-[3/4] w-full bg-[#FAF8F5] object-cover object-top transition-transform duration-500 hover:scale-102"
    />
  );
}

export default ProductPage;
