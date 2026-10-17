import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Category } from "@/types/category";
import { getMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import prodBanarasi from "@/assets/prod-banarasi.jpg";
import prodMaheshwari from "@/assets/prod-maheshwari.jpg";
import prodHandpaintStole from "@/assets/prod-handpaint-stole.jpg";
import prodLavenderFloralSet2 from "@/assets/prod-lavender-floral-set-2.png";
import prodLilacChikankariSet2 from "@/assets/prod-lilac-chikankari-set-2.png";
import prodTealIkatSet2 from "@/assets/prod-teal-ikat-set-2.png";
import prodPinkPaisleySet2 from "@/assets/prod-pink-paisley-set-2.png";

interface CategoryCardProps {
  category: Category;
  isActive?: boolean;
  variant?: "card" | "badge" | "compact" | "circle";
  className?: string;
  onClick?: () => void;
}

// Curated fabric & attire images without human models
export const getCategoryNonModelImage = (name = "", id = ""): string => {
  const lower = name.toLowerCase();
  if (lower.includes("dupatta") || lower.includes("stole")) return prodHandpaintStole;
  if (lower.includes("saree")) return prodBanarasi;
  if (lower.includes("unstitched")) return prodMaheshwari;
  if (lower.includes("cordset") || lower.includes("coord")) return prodTealIkatSet2;
  if (lower.includes("readymade") || lower.includes("suit")) return prodLilacChikankariSet2;
  if (lower.includes("indo") || lower.includes("western") || lower.includes("dress"))
    return prodLavenderFloralSet2;
  if (lower.includes("lehnga") || lower.includes("lehenga") || lower.includes("rental"))
    return prodPinkPaisleySet2;

  const fallbackList = [
    prodBanarasi,
    prodMaheshwari,
    prodHandpaintStole,
    prodTealIkatSet2,
    prodLilacChikankariSet2,
    prodLavenderFloralSet2,
    prodPinkPaisleySet2,
  ];

  const hash = (id || name).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return fallbackList[hash % fallbackList.length];
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isActive = false,
  variant = "circle",
  className,
  onClick,
}) => {
  // If category has a custom uploaded imageUrl use that, otherwise use curated non-model image
  const fallbackImg = getCategoryNonModelImage(category.name, category.id);
  const resolvedImageUrl = getMediaUrl(category.imageUrl) || fallbackImg;
  const productCount = category._count?.products;

  // 1. Circular Ring Variant (Small size, circular ring, image without model)
  if (variant === "circle") {
    return (
      <Link
        to="/category/$id"
        params={{ id: category.id }}
        onClick={onClick}
        aria-label={`Category ${category.name}`}
        className={cn(
          "group flex flex-col items-center text-center shrink-0 transition-transform duration-300 hover:-translate-y-1 focus:outline-none",
          className,
        )}
      >
        {/* Outer Circular Ring */}
        <div
          className={cn(
            "relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full p-[3px] transition-all duration-300 shadow-xs",
            isActive
              ? "border-2 border-[#6B1D2F] ring-4 ring-[#6B1D2F]/20"
              : "border-2 border-[#D4AF37]/60 group-hover:border-[#6B1D2F] group-hover:ring-4 group-hover:ring-[#6B1D2F]/15",
          )}
        >
          {/* Inner Circle Frame */}
          <div className="h-full w-full rounded-full overflow-hidden bg-[#FAF8F5] relative border border-[#E7E5E4]/80">
            <img
              src={resolvedImageUrl}
              alt={category.name}
              loading="lazy"
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-115"
            />
            <div className="absolute inset-0 rounded-full bg-black/0 transition-colors group-hover:bg-black/10" />
          </div>

          {/* Active Ping Indicator */}
          {isActive && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-[#6B1D2F] ring-2 ring-white" />
          )}
        </div>

        {/* Category Name */}
        <span
          className={cn(
            "mt-3 font-serif text-xs sm:text-sm md:text-base tracking-wide transition-colors line-clamp-2 max-w-[95px] sm:max-w-[120px] leading-tight",
            isActive
              ? "font-semibold text-[#6B1D2F]"
              : "text-[#1C1917] group-hover:text-[#6B1D2F]",
          )}
        >
          {category.name}
        </span>

        {productCount !== undefined && (
          <span className="text-[10px] sm:text-[11px] text-[#A8A29E] font-sans mt-0.5">
            {productCount} {productCount === 1 ? "piece" : "pieces"}
          </span>
        )}
      </Link>
    );
  }

  // 2. Badge Variant (Pill / Carousel Badge)
  if (variant === "badge") {
    return (
      <Link
        to="/category/$id"
        params={{ id: category.id }}
        onClick={onClick}
        className={cn(
          "group inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1D2F]",
          isActive
            ? "bg-[#6B1D2F] text-white shadow-md ring-2 ring-[#6B1D2F]/20"
            : "bg-white text-[#28201C] border border-[#E7E5E4] hover:border-[#6B1D2F] hover:text-[#6B1D2F] hover:bg-[#FAF8F5]",
          className,
        )}
      >
        <span>{category.name}</span>
        {productCount !== undefined && (
          <span
            className={cn(
              "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold transition-colors",
              isActive
                ? "bg-white/20 text-white"
                : "bg-[#FAF8F5] text-[#78716C] group-hover:bg-[#6B1D2F]/10 group-hover:text-[#6B1D2F]",
            )}
          >
            {productCount}
          </span>
        )}
      </Link>
    );
  }

  // 3. Compact Variant (Subtle card for dropdowns / quick lists)
  if (variant === "compact") {
    return (
      <Link
        to="/category/$id"
        params={{ id: category.id }}
        onClick={onClick}
        className={cn(
          "group flex items-center gap-3.5 p-2 rounded-sm transition-all duration-200 hover:bg-[#FAF8F5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1D2F]",
          isActive && "bg-[#FAF8F5] font-semibold",
          className,
        )}
      >
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-[#FAF8F5] border border-[#E7E5E4]">
          <img
            src={resolvedImageUrl}
            alt={category.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-serif text-sm text-[#1C1917] group-hover:text-[#6B1D2F] truncate transition-colors">
            {category.name}
          </p>
          <p className="text-[11px] text-[#78716C] tracking-wide">
            {productCount !== undefined ? `${productCount} pieces` : "Explore edit"}
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-[#A8A29E] opacity-0 transition-all duration-200 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#6B1D2F]" />
      </Link>
    );
  }

  // 4. Main Luxury Showcase Card (Aspect 3/4)
  return (
    <Link
      to="/category/$id"
      params={{ id: category.id }}
      onClick={onClick}
      role="article"
      aria-label={`Category ${category.name}, ${productCount !== undefined ? `${productCount} products available` : "explore collection"}`}
      className={cn(
        "group relative block aspect-[3/4] w-full overflow-hidden rounded-sm border border-[#E7E5E4] bg-[#1C1917] text-white shadow-sm transition-all duration-500 hover:shadow-xl hover:border-[#6B1D2F]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1D2F]",
        isActive && "ring-2 ring-[#6B1D2F] border-transparent",
        className,
      )}
    >
      <img
        src={resolvedImageUrl}
        alt={category.name}
        loading="lazy"
        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-500 group-hover:from-black/90 group-hover:via-black/40" />

      {isActive && (
        <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 rounded-full bg-[#6B1D2F] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-md">
          <Sparkles className="h-2.5 w-2.5" />
          <span>Active View</span>
        </div>
      )}

      {productCount !== undefined && (
        <div className="absolute top-3.5 right-3.5 z-10 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-white backdrop-blur-md transition-colors group-hover:bg-white/30">
          {productCount} {productCount === 1 ? "Piece" : "Pieces"}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 transition-transform duration-300">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/70">
          Atelier Collection
        </p>
        <h3 className="mt-1 font-serif text-xl sm:text-2xl font-normal leading-tight text-white drop-shadow-sm transition-colors group-hover:text-amber-100">
          {category.name}
        </h3>

        <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 border-t border-white/20 pt-3 transition-colors group-hover:text-white">
          <span>Shop Category</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
