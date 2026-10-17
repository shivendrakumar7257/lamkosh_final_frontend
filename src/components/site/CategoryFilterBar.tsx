import React from "react";
import { X, Filter, RotateCcw, Check } from "lucide-react";
import { Category } from "@/types/category";
import { cn } from "@/lib/utils";

interface CategoryFilterBarProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onSelectCategory: (categoryId: string) => void;
  onClearCategories: () => void;
  isLoading?: boolean;
  className?: string;
  variant?: "sidebar" | "chips";
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  categories,
  selectedCategoryIds,
  onSelectCategory,
  onClearCategories,
  isLoading = false,
  className,
  variant = "chips",
}) => {
  // If variant === "chips", render the top active chips bar
  if (variant === "chips") {
    if (selectedCategoryIds.length === 0) return null;

    const selectedCategories = categories.filter((c) => selectedCategoryIds.includes(c.id));

    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 py-3 border-b border-[#E7E5E4] text-xs",
          className,
        )}
        role="region"
        aria-label="Active category filters"
      >
        <span className="font-semibold uppercase tracking-wider text-[#78716C] mr-1">
          Active Filters:
        </span>

        {selectedCategories.map((cat) => (
          <span
            key={cat.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F] border border-[#6B1D2F]/20 px-3 py-1 font-medium text-xs transition-colors"
          >
            <span>{cat.name}</span>
            <button
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              aria-label={`Remove ${cat.name} filter`}
              className="hover:text-[#4A1420] focus:outline-none p-0.5 rounded-full hover:bg-[#6B1D2F]/20"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {selectedCategoryIds.length > 0 && (
          <button
            type="button"
            onClick={onClearCategories}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#6B1D2F]"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>
    );
  }

  // Sidebar Filter List View
  return (
    <div
      className={cn("space-y-4", className)}
      role="region"
      aria-label="Category filter options"
    >
      <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#6B1D2F]" />
          <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#1C1917]">
            Categories
          </h4>
        </div>
        {selectedCategoryIds.length > 0 && (
          <button
            type="button"
            onClick={onClearCategories}
            className="text-[11px] font-semibold uppercase tracking-wider text-[#6B1D2F] hover:underline focus:outline-none"
          >
            Clear ({selectedCategoryIds.length})
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2.5 py-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="h-4 w-28 rounded bg-[#FAF8F5]" />
              <div className="h-4 w-6 rounded bg-[#FAF8F5]" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-xs text-[#78716C]">No categories available</p>
      ) : (
        <ul className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategoryIds.includes(cat.id);
            return (
              <li key={cat.id}>
                <label
                  className={cn(
                    "flex items-center justify-between rounded px-2.5 py-2 text-xs font-medium cursor-pointer transition-colors select-none",
                    isSelected
                      ? "bg-[#FAF8F5] text-[#6B1D2F] font-semibold"
                      : "text-[#57534E] hover:bg-[#FAF8F5] hover:text-[#1C1917]",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "grid h-4 w-4 shrink-0 place-items-center rounded-sm border transition-colors",
                        isSelected
                          ? "border-[#6B1D2F] bg-[#6B1D2F] text-white"
                          : "border-[#D6D3D1] bg-white",
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </div>

                  {cat._count?.products !== undefined && (
                    <span
                      className={cn(
                        "ml-2 shrink-0 rounded-full px-1.5 py-0.5 text-[10px]",
                        isSelected
                          ? "bg-[#6B1D2F]/10 text-[#6B1D2F]"
                          : "bg-[#FAF8F5] text-[#A8A29E]",
                      )}
                    >
                      {cat._count.products}
                    </span>
                  )}

                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectCategory(cat.id)}
                    className="sr-only"
                    aria-label={`Filter by ${cat.name}`}
                  />
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CategoryFilterBar;
