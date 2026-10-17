import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "@tanstack/react-router";
import { X, Image as ImageIcon } from "lucide-react";
import { formatPrice, products } from "@/data/catalog";
import { usePublicProducts } from "@/hooks/use-products";
import { getMediaUrl } from "@/lib/media";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useShop();
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [animateIn, setAnimateIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(handler);
  }, [q]);

  const { data: apiResponse } = usePublicProducts(
    debouncedQ ? { search: debouncedQ, limit: 8 } : undefined,
  );

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      document.body.style.overflow = "";
      setQ("");
    }
  }, [searchOpen]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  const results = useMemo(() => {
    if (!debouncedQ) return [];
    if (apiResponse?.products && apiResponse.products.length > 0) {
      return apiResponse.products.map((p) => {
        const rawFirst = p.media?.[0]?.url || p.images?.[0];
        const firstPath = typeof rawFirst === "object" && rawFirst?.url ? rawFirst.url : rawFirst;
        return {
          id: p.id,
          handle: p.id,
          title: p.name,
          price: p.sellPrice,
          image: firstPath ? getMediaUrl(firstPath) : null,
        };
      });
    }
    const term = debouncedQ.toLowerCase();
    return products
      .filter((p) =>
        [p.title, p.type, p.material, p.colour, ...p.collections]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .map((p) => ({
        id: p.id,
        handle: p.handle,
        title: p.title,
        price: p.price,
        image: p.images?.[0] || null,
      }));
  }, [debouncedQ, apiResponse]);

  const handleClose = () => {
    setSearchOpen(false);
  };

  const handlePopularClick = (to: string, params?: Record<string, string>) => {
    setSearchOpen(false);
    if (params && params.handle) {
      navigate({ to: "/collections/$handle", params: { handle: params.handle } });
    } else {
      navigate({ to: to as any });
    }
  };

  if (!searchOpen || typeof document === "undefined") return null;

  const popularItems = [
    {
      label: "Wedding Exclusive",
      to: "/collections/$handle",
      params: { handle: "wedding-exclusive" },
    },
    { label: "New In", to: "/new-arrivals" },
    { label: "Most Loved", to: "/bestsellers" },
    { label: "Banarasi", to: "/collections/$handle", params: { handle: "banarasi" } },
    { label: "Cottons", to: "/collections/$handle", params: { handle: "cottons" } },
    { label: "Handpaint", to: "/collections/$handle", params: { handle: "handpaint" } },
    {
      label: "Maheshwari Silk",
      to: "/collections/$handle",
      params: { handle: "maheshwari-silk" },
    },
    {
      label: "Designer Formals",
      to: "/collections/$handle",
      params: { handle: "designer-formals" },
    },
    { label: "Winter Specials", to: "/collections/$handle", params: { handle: "winter-specials" } },
    { label: "Stoles", to: "/collections/$handle", params: { handle: "stoles" } },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[999990] flex flex-col"
      aria-modal="true"
      role="dialog"
      aria-label="Search"
    >
      {/* Translucent Dark Backdrop Overlay Below Search Panel */}
      <div
        className={cn(
          "fixed inset-0 z-[999990] bg-black/40 backdrop-brightness-90 transition-opacity duration-300 ease-out",
          animateIn ? "opacity-100" : "opacity-0",
        )}
        onClick={handleClose}
      />

      {/* Top-Anchored Luxury Search Panel */}
      <div
        className={cn(
          "relative z-[999999] flex max-h-[65vh] w-full flex-col overflow-hidden border-b border-[#E7E5E4] bg-white text-[#1C1917] shadow-2xl transition-transform duration-300 ease-out",
          animateIn ? "translate-y-0" : "-translate-y-full",
        )}
        style={{ backgroundColor: "#ffffff", color: "#1C1917" }}
      >
        {/* Panel Header */}
        <div className="container-lux flex h-14 shrink-0 items-center justify-between border-b border-[#28201C]/10 pt-2">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#28201C]/60">
            SEARCH
          </span>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#28201C] transition-opacity hover:opacity-75"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Panel Content Area */}
        <div className="container-lux flex-1 overflow-y-auto py-6 md:py-8">
          {/* Large Editorial Search Input */}
          <div className="relative">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search pieces, collections, materials"
              aria-label="Search pieces, collections, materials"
              className="w-full border-b border-[#28201C]/30 bg-transparent pb-3 font-serif text-2xl text-[#28201C] outline-none transition-colors placeholder:text-[#28201C]/40 focus:border-[#28201C] sm:text-3xl md:text-4xl"
            />
            {q ? (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wider text-[#28201C]/50 hover:text-[#28201C]"
              >
                Clear
              </button>
            ) : null}
          </div>

          {/* Search Results or Popular Searches */}
          {q ? (
            <div className="mt-6 md:mt-8">
              <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-[#28201C]/60">
                SEARCH RESULTS ({results.length})
              </p>
              {results.length > 0 ? (
                <div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {results.slice(0, 6).map((p) => (
                      <Link
                        key={p.id || p.handle}
                        to="/products/$handle"
                        params={{ handle: p.handle }}
                        onClick={handleClose}
                        className="group block"
                      >
                        <div className="aspect-[3/4] w-full overflow-hidden bg-[#FAF8F5] border border-[#E7E5E4] rounded-sm">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.title}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                              }}
                              className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center text-[#A8A29E]">
                              <ImageIcon className="h-6 w-6 stroke-[1.2] opacity-40 mb-1" />
                              <span className="text-[9px] uppercase tracking-wider font-sans font-medium text-[#78716C]">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="mt-2 line-clamp-1 font-serif text-sm font-medium text-[#28201C]">
                          {p.title}
                        </p>
                        <p className="text-xs text-[#28201C]/70">{formatPrice(p.price)}</p>
                      </Link>
                    ))}
                  </div>
                  {results.length > 6 ? (
                    <div className="mt-6 text-center">
                      <Link
                        to="/clothing"
                        onClick={handleClose}
                        className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#28201C] underline underline-offset-4 hover:opacity-80"
                      >
                        VIEW ALL RESULTS ({results.length}) &rarr;
                      </Link>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="py-4 font-serif text-base italic text-[#28201C]/70">
                  No pieces match &quot;{q}&quot;. Try searching for &quot;Banarasi&quot;,
                  &quot;Silk&quot;, or &quot;Chikankari&quot;.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-6 md:mt-8">
              <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-[#28201C]/60">
                POPULAR SEARCHES
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2.5">
                {popularItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handlePopularClick(item.to, item.params)}
                    className="font-sans text-xs font-medium text-[#28201C]/80 underline underline-offset-4 decoration-[#28201C]/30 transition-colors hover:text-[#28201C]"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
