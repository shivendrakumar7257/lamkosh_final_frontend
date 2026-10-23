import { useEffect, useMemo, useRef, useState } from "react";
import { Facebook, Instagram } from "lucide-react";
import reel1Video from "@/assets/✨ Elegance, Reimagined in Fusion ✨Presenting this exquisite ensemble, beautifully crafted in LaM.mp4";
import reel2Video from "@/assets/Ladies, yeh mauka mat khona! 😍Saree khareedo & Suit FREE paao! ✔Aur bhi BOHOT saare exclusive o.mp4";
import reel3Video from "@/assets/New Arrival Alert Exhibition is live!Bringing elegance straight to your wardrobe Presenting our.mp4";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { CategoryShowcase } from "@/components/site/CategoryShowcase";
import { CategoryFilterBar } from "@/components/site/CategoryFilterBar";
import { VideoTestimonialsSection } from "@/components/site/VideoTestimonialsSection";
import { useCategories } from "@/hooks/useCategories";
import { usePublicProducts } from "@/hooks/use-products";
import { images, products } from "@/data/catalog";

type Sort = "featured" | "price-asc" | "price-desc" | "new";

interface ReelItem {
  id: string;
  url: string;
  title: string;
  poster: string;
  videoSrc: string;
}

const INSTAGRAM_REELS: ReelItem[] = [
  {
    id: "DcmDmx6Plbz",
    url: "https://www.instagram.com/reels/DcmDmx6Plbz/",
    title: "Elegance, Reimagined in Fusion — Handcrafted LaMoksh Collection",
    poster: images.catNew,
    videoSrc: reel1Video,
  },
  {
    id: "DRjYjEeD8hL",
    url: "https://www.instagram.com/reels/DRjYjEeD8hL/",
    title: "Exclusive Saree & Suit Edits — LaMoksh Festive Collection",
    poster: images.heroCampaign,
    videoSrc: reel2Video,
  },
  {
    id: "DOi3VXvDIRP",
    url: "https://www.instagram.com/reels/DOi3VXvDIRP/",
    title: "New Arrival Alert Exhibition Live — Fine Maheshwari & Chanderi Weaves",
    poster: images.catClothing,
    videoSrc: reel3Video,
  },
];

function ReelCard({ reel }: { reel: ReelItem }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.2 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="group relative aspect-[9/16] min-h-[480px] sm:min-h-[520px] md:min-h-[560px] max-h-[620px] w-[82vw] shrink-0 snap-center overflow-hidden rounded-sm border border-[#E7E5E4] bg-[#1C1917] shadow-sm transition-all duration-300 hover:shadow-md sm:w-[320px] md:w-full md:shrink"
    >
      {/* Autoplay Video Stream */}
      <video
        ref={videoRef}
        poster={reel.poster}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      >
        <source src={reel.videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Luxury Gradient Tint */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity group-hover:from-black/90" />

      {/* Instagram Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-white backdrop-blur-md">
        <Instagram className="h-3 w-3" />
        <span>REEL</span>
      </div>

      {/* Meta Content at bottom */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
        <p className="line-clamp-2 font-serif text-base font-normal leading-snug tracking-wide text-white drop-shadow-sm sm:text-lg">
          {reel.title}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3 text-[0.7rem] uppercase tracking-wider text-white/80">
          <span>@lamokshfabrics</span>
          <a
            href={reel.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-white underline-offset-4 hover:underline"
          >
            <span>VIEW ON INSTAGRAM &rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function InstagramReelsSection() {
  return (
    <section className="mt-28 border-t border-[#E7E5E4] bg-white py-20 md:py-28">
      <div className="container-lux">
        {/* Header Section */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow text-[#6B1D2F]">FOLLOW OUR STORY</p>
            <h2 className="mt-3 font-serif text-3xl font-normal text-[#1C1917] sm:text-4xl md:text-5xl">
              Step into our world
            </h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-[#57534E]">
              Discover our latest stories, craftsmanship and moments from LaMoksh.
            </p>
          </Reveal>
        </div>

        {/* Reels Content Grid / Swipeable Carousel on Mobile */}
        <div className="mt-12 md:mt-16">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:grid md:grid-cols-3 md:gap-8 md:px-0 md:pb-0">
            {INSTAGRAM_REELS.map((reel) => (
              <Reveal key={reel.id}>
                <ReelCard reel={reel} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Social CTA Buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-16">
          <a
            href="https://www.instagram.com/lamokshfabrics"
            target="_blank"
            rel="noreferrer"
            aria-label="Follow LaMoksh Fabrics on Instagram"
            className="inline-flex w-full items-center justify-center gap-2.5 bg-[#6B1D2F] px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#4D1220] sm:w-auto"
          >
            <Instagram className="h-4 w-4" />
            <span>FOLLOW ON INSTAGRAM</span>
          </a>

          <a
            href="https://www.facebook.com/LamokshFabrics/"
            target="_blank"
            rel="noreferrer"
            aria-label="Follow LaMoksh Fabrics on Facebook"
            className="inline-flex w-full items-center justify-center gap-2.5 border border-[#6B1D2F] bg-white px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#6B1D2F] transition-colors hover:bg-[#6B1D2F] hover:text-white sm:w-auto"
          >
            <Facebook className="h-4 w-4" />
            <span>FOLLOW ON FACEBOOK</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function ClothingHomePage() {
  const [sort, setSort] = useState<Sort>("featured");
  const [material, setMaterial] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Categories API & URL Query Parameter Synchronization
  const { data: categoryData, isLoading: categoriesLoading } = useCategories({ page: 1, limit: 50 });
  const categories = categoryData?.categories || [];

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get("categoryId");
    return catParam ? catParam.split(",").filter(Boolean) : [];
  });

  // Public Products API synchronization
  const { data: publicProductsRes, isLoading: productsLoading } = usePublicProducts({
    page: 1,
    limit: 50,
    categoryId: selectedCategoryIds.length === 1 ? selectedCategoryIds[0] : undefined,
  });

  const apiProducts = publicProductsRes?.products || [];

  const allClothing = useMemo(() => {
    if (apiProducts.length > 0) return apiProducts;
    if (productsLoading) return [];
    if (publicProductsRes && selectedCategoryIds.length > 0) return [];
    return products.filter((p) => p.category === "clothing");
  }, [apiProducts, productsLoading, publicProductsRes, selectedCategoryIds]);

  // Sync to and from URL
  const handleSelectCategory = (catId: string) => {
    const updated = !catId
      ? []
      : selectedCategoryIds.includes(catId)
        ? selectedCategoryIds.filter((id) => id !== catId)
        : [...selectedCategoryIds, catId];
    setSelectedCategoryIds(updated);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (updated.length > 0) {
        url.searchParams.set("categoryId", updated.join(","));
      } else {
        url.searchParams.delete("categoryId");
      }
      window.history.replaceState({}, "", url.toString());

      const catalogEl = document.getElementById("clothing-catalog");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleClearCategories = () => {
    setSelectedCategoryIds([]);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("categoryId");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const materials = useMemo(
    () => Array.from(new Set(allClothing.map((p: any) => p.material || p.color || ""))).filter(Boolean).sort(),
    [allClothing],
  );

  const filtered = useMemo(() => {
    let list = allClothing.filter((p: any) => {
      const pMaterial = p.material || p.color || "";
      const matchMaterial = material === "all" || pMaterial === material;
      const matchStock = !inStockOnly || (p.inStock ?? (p.stock === undefined || p.stock > 0));

      // Category matching
      let matchCategory = true;
      if (selectedCategoryIds.length > 0) {
        const prodCatId = p.categoryId || p.category?.id;
        const prodCat = p.category?.name || p.category;
        const prodType = p.type?.toLowerCase();

        matchCategory = selectedCategoryIds.some((selectedId) => {
          if (prodCatId && prodCatId === selectedId) return true;
          const matchingCatObj = categories.find((c) => c.id === selectedId);
          if (matchingCatObj) {
            const nameLower = matchingCatObj.name.toLowerCase();
            if (prodType && (prodType.includes(nameLower) || nameLower.includes(prodType))) return true;
            if (prodCat && typeof prodCat === "string" && prodCat.toLowerCase().includes(nameLower)) return true;
          }
          return false;
        });
      }

      return matchMaterial && matchStock && matchCategory;
    });

    const getPrice = (p: any) => Number(p.sellPrice ?? p.price ?? 0);
    if (sort === "price-asc") list = [...list].sort((a, b) => getPrice(a) - getPrice(b));
    if (sort === "price-desc") list = [...list].sort((a, b) => getPrice(b) - getPrice(a));
    if (sort === "new") list = [...list].reverse();
    return list;
  }, [allClothing, material, inStockOnly, sort, selectedCategoryIds, categories]);

  return (
    <div>
      {/* Home Page Campaign Hero Banner */}
      <section className="relative">
        <img
          src={images.heroCampaign}
          alt="LaMoksh Fabrics campaign — handcrafted clothing in a haveli courtyard"
          className="h-[78vh] min-h-[520px] w-full object-cover object-top md:object-[center_15%]"
        />
        <div className="absolute inset-0 bg-espresso/25" />
        <div className="container-lux absolute inset-x-0 bottom-14">
          <Reveal>
            <p className="eyebrow text-ivory/80">Autumn Celebration 2026</p>
            <h1 className="display-xl mt-4 max-w-3xl text-ivory">
              Rooted in craft. Made for celebration.
            </h1>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#clothing-catalog" className="btn-lux bg-ivory text-espresso">
                Explore Clothing Collection{allClothing.length > 0 ? ` (${allClothing.length} pieces)` : ""}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Shop by Category Showcase Section */}
      <CategoryShowcase
        selectedCategoryId={selectedCategoryIds[0]}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Interactive Clothing Catalog Showcase */}
      <section id="clothing-catalog" className="mt-16 pt-8">
        <div className="container-lux mb-8 flex flex-col items-center justify-center text-center">
          <Reveal>
            <p className="eyebrow">Clothing Collection</p>
            <h2 className="display-lg mt-2">All Clothing Pieces</h2>
          </Reveal>
          <p className="eyebrow mt-4">{filtered.length} pieces</p>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-[118px] z-30 border-y border-ivory/20 bg-espresso text-ivory shadow-md md:top-[112px]">
          <div className="container-lux flex flex-wrap items-center gap-x-6 gap-y-2.5 py-3.5">
            {/* Category Selector */}
            <label className="nav-label flex items-center gap-2 text-[0.7rem] text-ivory/90">
              Category
              <select
                value={selectedCategoryIds[0] || "all"}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "all") handleClearCategories();
                  else setSelectedCategoryIds([val]);
                  if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    if (val === "all") url.searchParams.delete("categoryId");
                    else url.searchParams.set("categoryId", val);
                    window.history.replaceState({}, "", url.toString());
                  }
                }}
                className="nav-label border-b border-ivory/40 bg-espresso py-0.5 text-[0.7rem] text-ivory outline-none focus:border-ivory"
              >
                <option value="all" className="bg-espresso text-ivory">
                  All Categories
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-espresso text-ivory">
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="nav-label flex items-center gap-2 text-[0.7rem] text-ivory/90">
              Material
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="nav-label border-b border-ivory/40 bg-espresso py-0.5 text-[0.7rem] text-ivory outline-none focus:border-ivory"
              >
                <option value="all" className="bg-espresso text-ivory">
                  All
                </option>
                {materials.map((m) => (
                  <option key={m} value={m} className="bg-espresso text-ivory">
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <label className="nav-label flex items-center gap-2 text-[0.7rem] text-ivory/90">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="nav-label border-b border-ivory/40 bg-espresso py-0.5 text-[0.7rem] text-ivory outline-none focus:border-ivory"
              >
                <option value="featured" className="bg-espresso text-ivory">
                  Featured
                </option>
                <option value="new" className="bg-espresso text-ivory">
                  Newest
                </option>
                <option value="price-asc" className="bg-espresso text-ivory">
                  Price: low to high
                </option>
                <option value="price-desc" className="bg-espresso text-ivory">
                  Price: high to low
                </option>
              </select>
            </label>

            <label className="nav-label flex cursor-pointer items-center gap-1.5 text-[0.7rem] text-ivory/90">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-3 w-3 accent-ivory"
              />
              In stock only
            </label>
          </div>
        </div>

        {/* Active Category Filter Chips Bar */}
        <div className="container-lux pt-6">
          <CategoryFilterBar
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            onSelectCategory={handleSelectCategory}
            onClearCategories={handleClearCategories}
            variant="chips"
          />
        </div>

        {/* Product Cards Grid */}
        <div className="container-lux py-10">
          {productsLoading ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3 animate-pulse">
                  <div className="aspect-[3/4] w-full rounded-sm bg-[#FAF8F5] border border-[#E7E5E4]" />
                  <div className="h-4 w-3/4 rounded bg-[#FAF8F5]" />
                  <div className="h-3 w-1/2 rounded bg-[#FAF8F5]" />
                </div>
              ))}
            </div>
          ) : filtered.length ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
              {filtered.map((p: any, i) => (
                <Reveal key={p.id || p.handle || i} delay={(i % 4) * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-3">
              <p className="font-serif text-2xl text-[#1C1917]">No clothing pieces found</p>
              <p className="body-lux text-[#78716C] max-w-md mx-auto">
                No pieces currently match these filters. New handcrafted creations are continuously arriving from LaMoksh.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* LaMoksh Craft Section */}
      <section className="container-lux mt-16 grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="media-zoom">
          <img
            src={images.brandStory}
            alt="Handloom weaving on pit looms"
            loading="lazy"
            className="aspect-[16/10] max-h-[380px] w-full object-cover object-top"
          />
        </Reveal>
        <Reveal>
          <p className="eyebrow">LaMoksh</p>
          <h2 className="display-lg mt-4">Woven by hand, thread by thread</h2>
          <p className="body-lux mt-6">
            Every LaMoksh Fabrics garment begins on a master weaver's loom. Zari threads are
            interlaced in Varanasi and Maheshwar, hand-painted motifs are rendered in natural
            pigments, and each piece is completed by the hands that made it.
          </p>
        </Reveal>
      </section>

      {/* Real Customer Video Testimonials Section (3 videos in a row with autoplay) */}
      <VideoTestimonialsSection />

      {/* Instagram Reels Showcase Section */}
      <InstagramReelsSection />

      {/* Service Pillars (Burgundy Benefits Section) */}
      <section className="container-lux mt-28">
        <div className="rounded-sm bg-espresso px-8 py-12 text-ivory md:px-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                t: "Made to order",
                d: "Most pieces are woven after you order them, in four to six weeks.",
              },
              {
                t: "Complimentary shipping",
                d: "Insured delivery across India, and worldwide on request.",
              },
              {
                t: "Care for life",
                d: "Finishing, refolding and repair for every LaMoksh Fabrics garment.",
              },
            ].map((p) => (
              <Reveal key={p.t}>
                <p className="font-display text-xl text-ivory">{p.t}</p>
                <p className="body-lux mt-3 text-sm text-ivory/80">{p.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
