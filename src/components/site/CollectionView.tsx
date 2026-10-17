import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import subcategoryBannerBg from "@/assets/subcategory-banner-bg.png";
import type { Product } from "@/data/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";

type Sort = "featured" | "price-asc" | "price-desc" | "new";

export function CollectionView({
  title,
  description,
  image,
  items,
  crumb,
}: {
  eyebrow?: string | undefined;
  title: string;
  description: string;
  image?: string | undefined;
  items: Product[];
  crumb?: { label: string; to: string } | undefined;
}) {
  const [sort, setSort] = useState<Sort>("featured");
  const [material, setMaterial] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  const bannerBg = image || subcategoryBannerBg;
  const isLightBanner = bannerBg === subcategoryBannerBg;

  const materials = useMemo(
    () => Array.from(new Set(items.map((p) => p.material))).sort(),
    [items],
  );

  const filtered = useMemo(() => {
    let list = items.filter(
      (p) => (material === "all" || p.material === material) && (!inStockOnly || p.inStock),
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].reverse();
    return list;
  }, [items, material, inStockOnly, sort]);

  return (
    <div>
      {/* Subcategory Banner with Luxury Silk & Botanical Shadows Background */}
      {isLightBanner ? (
        <section className="relative flex min-h-[300px] items-center justify-center overflow-hidden border-b border-border text-center md:min-h-[360px] py-16 md:py-20">
          <img
            src={subcategoryBannerBg}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="container-lux relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center">
            <Reveal>
              <h1 className="font-sans text-3xl font-bold uppercase tracking-[0.15em] text-foreground sm:text-4xl md:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-xl font-serif text-base italic text-foreground/80 sm:text-lg">
                {description}
              </p>
              <nav className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Link to="/" className="hover:text-foreground hover:underline">
                  Home
                </Link>
                <span>›</span>
                {crumb ? (
                  <>
                    <Link to={crumb.to} className="hover:text-foreground hover:underline">
                      {crumb.label}
                    </Link>
                    <span>›</span>
                  </>
                ) : null}
                <span className="font-medium text-foreground">{title}</span>
              </nav>
            </Reveal>
          </div>
        </section>
      ) : (
        <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden border-b border-border text-center md:min-h-[480px] lg:h-[55vh] lg:max-h-[600px]">
          <img
            src={bannerBg}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover object-top md:object-[center_15%]"
          />
          <div className="absolute inset-0 bg-espresso/45 backdrop-brightness-90" />
          <div className="container-lux relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center py-16 text-ivory">
            <Reveal>
              <h1 className="font-sans text-3xl font-bold uppercase tracking-[0.15em] text-ivory sm:text-4xl md:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-xl font-serif text-base italic text-ivory/90 sm:text-lg">
                {description}
              </p>
              <nav className="mt-6 flex items-center justify-center gap-2 text-xs text-ivory/80">
                <Link to="/" className="hover:text-ivory hover:underline">
                  Home
                </Link>
                <span>›</span>
                {crumb ? (
                  <>
                    <Link to={crumb.to} className="hover:text-ivory hover:underline">
                      {crumb.label}
                    </Link>
                    <span>›</span>
                  </>
                ) : null}
                <span className="font-medium text-ivory">{title}</span>
              </nav>
            </Reveal>
          </div>
        </section>
      )}

      {/* Filter Bar */}
      <div className="sticky top-[118px] z-30 border-b border-ivory/20 bg-espresso text-ivory shadow-md md:top-[112px]">
        <div className="container-lux flex flex-wrap items-center justify-between gap-x-6 gap-y-2.5 py-3.5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
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
          <p className="eyebrow text-[0.7rem] text-ivory/80">{filtered.length} pieces</p>
        </div>
      </div>

      {/* Products Grid */}
      <section className="container-lux py-14">
        {filtered.length ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
            {filtered.map((p, i) => (
              <Reveal key={p.handle} delay={(i % 4) * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="body-lux py-20 text-center">
            No pieces match these filters. Try widening your selection.
          </p>
        )}
      </section>
    </div>
  );
}
