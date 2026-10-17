import React, { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Layers, ArrowUpRight, Sparkles } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { CategoryCard } from "@/components/site/CategoryCard";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
import prodBanarasi from "@/assets/prod-banarasi.jpg";

interface CategoryShowcaseProps {
  className?: string;
  selectedCategoryId?: string;
  onSelectCategory?: (id: string) => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  className,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { data, isLoading } = useCategories({ page: 1, limit: 20 });
  const categories = data?.categories || [];
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -240 : 240;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section
      aria-label="Shop by category"
      className={cn("py-12 sm:py-16 border-t border-[#E7E5E4] bg-[#FAF8F5]/60", className)}
    >
      <div className="container-lux">
        {/* Header and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <Reveal>
              <div className="flex items-center gap-2 text-[#6B1D2F]">
                <Layers className="h-4 w-4" />
                <span className="eyebrow tracking-[0.25em]">CURATED ATELIER EDITS</span>
              </div>
              <h2 className="display-md mt-1.5 text-[#1C1917]">Shop by Category</h2>
            </Reveal>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Scroll Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                aria-label="Scroll categories left"
                className="grid h-9 w-9 place-items-center rounded-full border border-[#E7E5E4] bg-white text-[#1C1917] shadow-xs transition-colors hover:border-[#6B1D2F] hover:text-[#6B1D2F] focus:outline-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                aria-label="Scroll categories right"
                className="grid h-9 w-9 place-items-center rounded-full border border-[#E7E5E4] bg-white text-[#1C1917] shadow-xs transition-colors hover:border-[#6B1D2F] hover:text-[#6B1D2F] focus:outline-none"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <Link
              to="/clothing"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:underline ml-2"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Circular Ring Categories Row */}
        {isLoading ? (
          <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-8 overflow-x-auto py-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2.5 shrink-0 animate-pulse">
                <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full bg-[#E7E5E4]/80" />
                <div className="h-3.5 w-16 rounded bg-[#E7E5E4]/60" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-[#E7E5E4] bg-white rounded-sm">
            <Layers className="mx-auto h-8 w-8 text-[#A8A29E]" />
            <p className="mt-2 font-serif text-sm text-[#1C1917]">No categories found</p>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="no-scrollbar flex items-start gap-6 sm:gap-8 overflow-x-auto py-3 px-1 scroll-smooth sm:justify-start lg:justify-center"
          >
            {/* First Item: All Weaves Circular Ring */}
            <Link
              to="/clothing"
              className="group flex flex-col items-center text-center shrink-0 transition-transform duration-300 hover:-translate-y-1 focus:outline-none"
            >
              <div
                className={cn(
                  "relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full p-[3px] transition-all duration-300 shadow-xs",
                  !selectedCategoryId
                    ? "border-2 border-[#6B1D2F] ring-4 ring-[#6B1D2F]/20"
                    : "border-2 border-[#D4AF37]/60 group-hover:border-[#6B1D2F] group-hover:ring-4 group-hover:ring-[#6B1D2F]/15",
                )}
              >
                <div className="h-full w-full rounded-full overflow-hidden bg-[#FAF8F5] relative border border-[#E7E5E4]/80">
                  <img
                    src={prodBanarasi}
                    alt="All Weaves"
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-115"
                  />
                  <div className="absolute inset-0 rounded-full bg-[#1C1917]/25 flex items-center justify-center transition-colors group-hover:bg-[#1C1917]/15">
                    <Sparkles className="h-5 w-5 text-white drop-shadow-sm" />
                  </div>
                </div>
              </div>
              <span className="mt-3 font-serif text-xs sm:text-sm md:text-base font-semibold tracking-wide text-[#1C1917] group-hover:text-[#6B1D2F] transition-colors leading-tight line-clamp-2 max-w-[95px] sm:max-w-[120px]">
                All Weaves
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#A8A29E] font-sans mt-0.5">
                Full Collection
              </span>
            </Link>

            {/* Category Circular Rings */}
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                variant="circle"
                isActive={selectedCategoryId === cat.id}
                onClick={() => onSelectCategory?.(cat.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryShowcase;
