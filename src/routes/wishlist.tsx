import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Trash2, Heart } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { getProduct, images } from "@/data/catalog";
import { dbStore } from "@/lib/db/store";
import { getMediaUrl } from "@/lib/media";
import { useWishlist } from "@/context/WishlistContext";
import { usePublicProducts } from "@/hooks/use-products";
import { ProductApi } from "@/lib/api/product.api";
import { getCategoryNonModelImage } from "@/components/site/CategoryCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Your saved handcrafted suit sets, Banarasi silks, and fine textiles at LaMoksh Fabrics.",
      },
      { property: "og:title", content: "Your Wishlist — LaMoksh Fabrics" },
      { property: "og:description", content: "Your saved pieces, kept for your return." },
      { property: "og:url", content: "/wishlist" },
    ],
    links: [{ rel: "canonical", href: "/wishlist" }],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, wishlistCount, loading, clearWishlist, removeFromWishlist } = useWishlist();
  const { data: publicProductsRes } = usePublicProducts({ page: 1, limit: 100 });
  const apiProducts = publicProductsRes?.products || [];

  const items = wishlist?.items || [];
  const [extraProducts, setExtraProducts] = useState<Record<string, any>>({});

  useEffect(() => {
    items.forEach((it) => {
      const pid = it.productId;
      if (!pid) return;
      const alreadyHas =
        apiProducts.some((p: any) => p.id === pid || p.handle === pid) ||
        (it.product && it.product.media && it.product.media.length > 0) ||
        extraProducts[pid];
      if (!alreadyHas) {
        ProductApi.getPublicProductById(pid)
          .then((fetched) => {
            if (fetched) {
              setExtraProducts((prev) => ({ ...prev, [pid]: fetched }));
            }
          })
          .catch(() => {});
      }
    });
  }, [items, apiProducts, extraProducts]);

  const savedProducts = useMemo(() => {
    return items.map((it) => {
      // 1. Primary: Match from live public products API or fetched extraProducts
      const extra = extraProducts[it.productId];
      const apiProd =
        apiProducts.find(
          (p: any) =>
            p.id === it.productId ||
            p.handle === it.productId ||
            (p.name && it.product?.name && p.name.trim().toLowerCase() === it.product.name.trim().toLowerCase()),
        ) || extra;

      // 2. Secondary: Backend WishlistProduct from it.product
      const p = (it.product && it.product.name !== "Saved Piece" ? it.product : apiProd) || it.product || ({} as any);

      // 3. Fallback: catalog or local dbStore
      const seed =
        getProduct(it.productId) ||
        dbStore.getProducts().find((s) => s.handle === it.productId || s.id === it.productId);

      // Collect all candidate images from all sources, prioritizing live API and backend media
      const rawCandidates = [
        ...(Array.isArray(p.media) ? p.media : []),
        ...(apiProd && Array.isArray(apiProd.media) ? apiProd.media : []),
        ...(extra && Array.isArray(extra.media) ? extra.media : []),
        ...(Array.isArray(p.images) ? p.images : []),
        ...(apiProd && Array.isArray(apiProd.images) ? apiProd.images : []),
        ...(seed && Array.isArray(seed.images) ? seed.images : []),
        p.imageUrl,
        apiProd?.imageUrl,
      ];

      const resolvedImages = rawCandidates
        .map((m: any) => {
          if (!m) return "";
          const raw = typeof m === "string" ? m : m.url || m.imageUrl;
          if (raw && typeof raw === "string" && !raw.startsWith("blob:") && !raw.toLowerCase().endsWith(".mp4")) {
            return getMediaUrl(raw);
          }
          return "";
        })
        .filter(Boolean);

      const title = p.name || apiProd?.name || seed?.title || "Handcrafted Piece";
      const fallbackImg = getCategoryNonModelImage(
        p.category?.name || apiProd?.category?.name || seed?.type || p.color || title,
        p.id || it.productId,
      );

      const finalImages = resolvedImages.length > 0 ? resolvedImages : [fallbackImg];
      const validMedia =
        Array.isArray(p.media) && p.media.length > 0
          ? p.media
          : apiProd?.media && apiProd.media.length > 0
            ? apiProd.media
            : [{ id: "fallback-media", type: "IMAGE", url: fallbackImg, sortOrder: 0 }];

      return {
        id: p.id || apiProd?.id || seed?.id || it.productId,
        handle: p.handle || apiProd?.id || seed?.handle || p.id || it.productId,
        title,
        name: title,
        price: Number(p.sellPrice ?? apiProd?.sellPrice ?? seed?.price ?? 0),
        sellPrice: Number(p.sellPrice ?? apiProd?.sellPrice ?? seed?.price ?? 0),
        basePrice: Number(p.basePrice ?? apiProd?.basePrice ?? seed?.basePrice ?? 0),
        category: "clothing" as const,
        type: p.category?.name || apiProd?.category?.name || p.color || seed?.type || "Handcrafted Saree / Suit",
        collections: [],
        material: p.color || apiProd?.color || seed?.material || "Fine Silk",
        color: p.color || apiProd?.color || seed?.color || "Natural",
        colour: p.color || apiProd?.color || seed?.color || "Natural",
        inStock: p.stock !== undefined ? p.stock > 0 : apiProd?.stock !== undefined ? apiProd.stock > 0 : true,
        images: finalImages,
        media: validMedia,
        description: p.description || apiProd?.description || seed?.description || "",
        craft: "Handwoven by LaMoksh",
        dimensions: "Standard dimensions",
        care: "Dry clean only",
        variants: p.variants || apiProd?.variants || (seed as any)?.variants,
        stock: p.stock ?? apiProd?.stock ?? seed?.stock,
        wishlistItemId: it.id,
      };
    });
  }, [items, apiProducts]);

  return (
    <div>
      {/* Relatable Campaign Hero Banner */}
      <section className="relative flex min-h-[420px] items-center overflow-hidden border-b border-border md:min-h-[480px]">
        <img
          src={images.heroCampaign}
          alt="LaMoksh Fabrics campaign — Saved Wishlist Pieces"
          className="absolute inset-0 h-full w-full object-cover object-top md:object-[center_15%]"
        />
        <div className="absolute inset-0 bg-espresso/45 backdrop-brightness-90" />
        <div className="container-lux relative z-10 py-16 text-ivory">
          <Reveal>
            <nav className="flex gap-2 text-xs text-ivory/80">
              <Link to="/" className="hover:text-ivory hover:underline">
                Home
              </Link>
              <span>/</span>
              <span className="font-medium text-ivory">Wishlist</span>
            </nav>
            <p className="eyebrow mt-6 text-ivory/80">Saved Pieces</p>
            <h1 className="display-lg mt-3 text-ivory">Your Wishlist</h1>
            <p className="body-lux mt-4 max-w-xl text-ivory/90">
              A private edit of the pieces you are considering — saved to return to whenever you are
              ready.
            </p>
            <p className="eyebrow mt-6 text-ivory/80">
              {wishlistCount} {wishlistCount === 1 ? "piece" : "pieces"} saved
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Wishlist Products Showcase Grid */}
      <section className="container-lux py-16 md:py-24">
        {loading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#28201C]/60" />
            <p className="body-lux mt-4 text-sm text-muted-foreground">
              Loading your saved wishlist...
            </p>
          </div>
        ) : savedProducts.length > 0 ? (
          <div>
            <div className="mb-10 flex items-center justify-between border-b border-border pb-4">
              <Reveal>
                <h2 className="display-md">Saved Collection</h2>
              </Reveal>
              <div className="flex items-center gap-4">
                <p className="eyebrow">
                  {wishlistCount} {wishlistCount === 1 ? "item" : "items"}
                </p>
                <button
                  type="button"
                  onClick={() => clearWishlist()}
                  className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground hover:text-red-700 underline underline-offset-2"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear Wishlist</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
              {savedProducts.map((p, i) => (
                <Reveal key={p.wishlistItemId || p.handle || p.id} delay={(i % 4) * 80}>
                  <div className="relative group">
                    <ProductCard product={p} />
                    <button
                      type="button"
                      aria-label="Remove from wishlist"
                      onClick={() => removeFromWishlist(p.wishlistItemId || p.id || p.handle)}
                      className="mt-2 flex items-center gap-1 text-[0.68rem] font-sans uppercase tracking-wider text-muted-foreground hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-md py-16 text-center">
            <Reveal>
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-muted">
                <Heart className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="eyebrow">Your wishlist is empty</p>
              <h2 className="display-md mt-4">No saved pieces yet</h2>
              <p className="body-lux mt-4 text-muted-foreground">
                As you browse the collection, tap the heart button on any piece to save it here for
                later.
              </p>
              <div className="mt-8">
                <Link to="/clothing" className="btn-lux inline-flex">
                  Explore Clothing Collection
                </Link>
              </div>
            </Reveal>
          </div>
        )}
      </section>
    </div>
  );
}
