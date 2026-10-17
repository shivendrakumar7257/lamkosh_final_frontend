import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Sparkles, ArrowRight, Layers, Tag } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { CategoryCard } from "@/components/site/CategoryCard";
import { cn } from "@/lib/utils";

interface CategoryDropdownProps {
  className?: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useCategories({ page: 1, limit: 20 });
  const categories = data?.categories || [];

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      // Focus first link in dropdown
      const firstLink = dropdownRef.current?.querySelector<HTMLAnchorElement>("a");
      firstLink?.focus();
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="category-dropdown-panel"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={cn(
          "nav-label group inline-flex items-center gap-1.5 py-2 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#6B1D2F]",
          isOpen ? "text-[#6B1D2F] font-semibold" : "text-[#1C1917] hover:text-[#6B1D2F]",
        )}
      >
        <span>Categories</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen ? "rotate-180 text-[#6B1D2F]" : "text-[#78716C] group-hover:text-[#6B1D2F]",
          )}
        />
      </button>

      {/* Mega Menu Dropdown Panel */}
      {isOpen && (
        <div
          id="category-dropdown-panel"
          ref={dropdownRef}
          role="menu"
          aria-label="Category navigation menu"
          onKeyDown={handleKeyDown}
          className="absolute left-0 top-full z-50 mt-1 w-[720px] max-w-[92vw] rounded-sm border border-[#E7E5E4] bg-white p-6 shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-top-2"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#6B1D2F]" />
              <h3 className="font-serif text-base font-normal tracking-wide text-[#1C1917]">
                Shop By Handcrafted Category
              </h3>
            </div>
            <Link
              to="/clothing"
              onClick={() => setIsOpen(false)}
              className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:underline"
            >
              <span>Explore All Catalog</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Body Content */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 py-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="h-12 w-12 rounded bg-[#FAF8F5] border border-[#E7E5E4]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-28 rounded bg-[#FAF8F5]" />
                    <div className="h-3 w-16 rounded bg-[#FAF8F5]" />
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center">
              <Tag className="mx-auto h-8 w-8 text-[#A8A29E]" />
              <p className="mt-2 font-serif text-sm text-[#57534E]">
                No categories available at the moment.
              </p>
              <Link
                to="/clothing"
                onClick={() => setIsOpen(false)}
                className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:underline"
              >
                Browse All Clothing &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-6 pt-5">
              {/* Category Grid (8 cols) */}
              <div className="col-span-8 grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-2 no-scrollbar">
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    variant="compact"
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </div>

              {/* Featured Showcase Spotlight (4 cols) */}
              <div className="col-span-4 border-l border-[#E7E5E4] pl-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#6B1D2F]">
                    <Sparkles className="h-3 w-3" />
                    <span>Featured Edit</span>
                  </div>
                  <h4 className="mt-1 font-serif text-lg font-light text-[#1C1917]">
                    Handwoven Festive & Everyday Luxe
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-[#57534E]">
                    Curated pure Banarasi, Maheshwari weaves, and hand-embroidered silhouettes.
                  </p>
                </div>

                <div className="mt-6 border-t border-[#E7E5E4] pt-4">
                  <div className="rounded-sm bg-[#FAF8F5] p-3 text-center border border-[#E7E5E4]">
                    <p className="text-[11px] font-medium text-[#1C1917]">
                      {categories.reduce((acc, c) => acc + (c._count?.products || 0), 0) || "Curated"}{" "}
                      Masterpieces Live
                    </p>
                    <Link
                      to="/clothing"
                      onClick={() => setIsOpen(false)}
                      className="mt-2 inline-flex items-center justify-center w-full bg-[#6B1D2F] py-2 text-[10px] font-semibold uppercase tracking-widest text-white hover:bg-[#521624] transition-colors"
                    >
                      View Full Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
