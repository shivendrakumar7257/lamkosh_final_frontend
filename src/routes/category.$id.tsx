import React, { useState, useMemo } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ChevronRight, ArrowUpDown, Layers, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCategory } from "@/hooks/useCategories";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/category/$id")({
  head: () => ({
    meta: [
      { title: "Category Catalog — LaMoksh Fabrics" },
      {
        name: "description",
        content: "Explore handcrafted artisanal luxury sorted by category.",
      },
    ],
  }),
  component: CategoryDetailPage,
});

type SortOption = "newest" | "price-asc" | "price-desc";

function CategoryDetailPage() {
  const { id } = useParams({ from: "/category/$id" });
  const { data: category, isLoading, isError, error, refetch } = useCategory(id);

  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Sorted product list
  const sortedProducts = useMemo(() => {
    if (!category?.products) return [];
    const list = [...category.products];

    if (sortBy === "price-asc") {
      list.sort((a, b) => Number(a.sellPrice) - Number(b.sellPrice));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => Number(b.sellPrice) - Number(a.sellPrice));
    } else {
      // Newest / default
      list.sort((a, b) => {
        // If items don't have createdAt, maintain order
        return 0;
      });
    }

    return list;
  }, [category?.products, sortBy]);

  const productCount = sortedProducts.length;

  return (
    <div className="min-h-screen bg-[#FAF8F5]/30 pb-24">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-[#E7E5E4] bg-white">
        <div className="container-lux py-3.5">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-[#78716C]">
            <Link to="/" className="hover:text-[#6B1D2F] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#A8A29E]" />
            <Link to="/clothing" className="hover:text-[#6B1D2F] transition-colors">
              Categories
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#A8A29E]" />
            <span className="font-semibold text-[#1C1917] truncate max-w-[200px] sm:max-w-none">
              {category?.name || (isLoading ? "Loading..." : "Category")}
            </span>
          </nav>
        </div>
      </div>

      {/* Category Header Hero */}
      <div className="border-b border-[#E7E5E4] bg-white py-10 sm:py-14">
        <div className="container-lux">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <Reveal>
                <div className="flex items-center gap-2 text-[#6B1D2F]">
                  <Layers className="h-4 w-4" />
                  <span className="eyebrow tracking-[0.25em]">ATELIER ARCHIVE</span>
                </div>
                <h1 className="display-xl mt-3 text-[#1C1917]">
                  {isLoading ? (
                    <span className="inline-block h-10 w-64 animate-pulse rounded bg-[#FAF8F5]" />
                  ) : (
                    category?.name || "Curated Category"
                  )}
                </h1>
                {category?.description && (
                  <p className="mt-3 text-sm text-[#57534E] leading-relaxed">
                    {category.description}
                  </p>
                )}
              </Reveal>
            </div>

            {/* Product Count & Sort Bar */}
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 border-t border-[#E7E5E4] pt-4 md:border-none md:pt-0">
              <p className="eyebrow text-[#78716C]">
                {isLoading ? "Counting pieces..." : `${productCount} ${productCount === 1 ? "Piece" : "Pieces"} in Collection`}
              </p>

              {/* Product Sorting Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-[#78716C]" />
                <label htmlFor="category-sort" className="sr-only">
                  Sort products
                </label>
                <select
                  id="category-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="rounded border border-[#E7E5E4] bg-white px-3 py-1.5 text-xs font-medium text-[#1C1917] outline-none transition-colors hover:border-[#6B1D2F] focus:border-[#6B1D2F] focus:ring-1 focus:ring-[#6B1D2F]"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Catalog Grid / States */}
      <main className="container-lux mt-10">
        {isLoading ? (
          /* Loading Skeletons Grid */
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-[3/4] w-full rounded-sm bg-[#FAF8F5] border border-[#E7E5E4]" />
                <div className="h-4 w-3/4 rounded bg-[#FAF8F5]" />
                <div className="h-3 w-1/2 rounded bg-[#FAF8F5]" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="mx-auto max-w-md py-16 text-center">
            <p className="text-sm text-rose-700">
              {error instanceof Error ? error.message : "Failed to load category products"}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-2 bg-[#6B1D2F] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#521624]"
            >
              Try Again
            </button>
          </div>
        ) : sortedProducts.length === 0 ? (
          /* Empty State */
          <div className="mx-auto max-w-lg rounded-sm border border-dashed border-[#E7E5E4] bg-white p-12 text-center shadow-sm">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#FAF8F5] text-[#A8A29E]">
              <ShoppingBag className="h-6 w-6 text-[#6B1D2F]" />
            </div>
            <h3 className="mt-4 font-serif text-lg text-[#1C1917]">
              No products found in this category yet
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#78716C]">
              We are currently handcrafting new silhouettes and weaves for this category. Please
              check back soon or browse our full clothing catalog.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/clothing"
                className="inline-flex items-center gap-2 bg-[#6B1D2F] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#521624] transition-colors"
              >
                <span>Browse All Clothing</span>
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 border border-[#E7E5E4] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Responsive Product Grid */
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 sm:gap-6">
            {sortedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={{
                  id: prod.id,
                  name: prod.name,
                  title: prod.name,
                  color: prod.color,
                  gst: prod.gst,
                  basePrice: prod.basePrice,
                  sellPrice: prod.sellPrice,
                  stock: prod.stock,
                  inStock: prod.stock > 0,
                  media: prod.media,
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
