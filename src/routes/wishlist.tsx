import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Trash2, Heart } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { getProduct, images } from "@/data/catalog";
import { dbStore } from "@/lib/db/store";
import { getMediaUrl } from "@/lib/media";
import { useWishlist } from "@/context/WishlistContext";

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

  const items = wishlist?.items || [];

  const savedProducts = useMemo(() => {
    return items.map((it) => {
      // Check catalog by handle or productId
      const seed =
        getProduct(it.productId) ||
        dbStore.getProducts().find((p) => p.handle === it.productId || p.id === it.productId);

      if (seed) {
        return {
          ...seed,
          wishlistItemId: it.id,
        };
      }

      // Convert backend WishlistProduct to standard product shape for ProductCard
      const p = it.product || ({} as any);

      const mediaImages = (p.media || [])
        .filter(
          (m: any) =>
            m &&
            m.type !== "VIDEO" &&
            !(typeof m.url === "string" && (m.url.startsWith("blob:") || m.url.toLowerCase().endsWith(".mp4"))),
        )
        .map((m: any) => {
          const raw = typeof m === "string" ? m : m?.url || m?.imageUrl;
          return raw ? getMediaUrl(raw) : "";
        })
        .filter((url: string) => Boolean(url) && !url.startsWith("blob:"));

      const directImages = (p.images || [])
        .map((img: any) => {
          const raw = typeof img === "string" ? img : img?.url || img?.imageUrl;
          return raw ? getMediaUrl(raw) : "";
        })
        .filter((url: string) => Boolean(url) && !url.startsWith("blob:"));

      const resolvedImages = mediaImages.length > 0 ? mediaImages : directImages;

      return {
        id: p.id || it.productId,
        handle: p.handle || p.id || it.productId,
        title: p.name || "Handcrafted Piece",
        name: p.name || "Handcrafted Piece",
        price: p.sellPrice || p.basePrice || 0,
        sellPrice: p.sellPrice || p.basePrice || 0,
        category: "clothing" as const,
        type: p.color || "Handcrafted Saree / Suit",
        collections: [],
        material: p.color || "Fine Silk",
        colour: p.color || "Natural",
        inStock: p.stock === undefined || p.stock > 0,
        images: resolvedImages.length > 0 ? resolvedImages : ["/placeholder.svg"],
        description: p.description || "",
        craft: "Handwoven in atelier",
        dimensions: "Standard dimensions",
        care: "Dry clean only",
        variants: (p as any).variants,
        stock: p.stock,
        wishlistItemId: it.id,
      };
    });
  }, [items]);

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
