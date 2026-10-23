import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { X, Search, Heart, User, Mail, Instagram, Facebook, Youtube, ChevronDown, Layers } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useShop } from "@/lib/shop-store";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { setSearchOpen } = useShop();
  const { wishlistCount } = useWishlist();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({ page: 1, limit: 30 });
  const categories = categoriesData?.categories || [];

  const [animateIn, setAnimateIn] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
  };

  const handleSearchClick = () => {
    onClose();
    setSearchOpen(true);
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999990] flex"
      style={{ height: "100dvh", width: "100vw" }}
      aria-modal="true"
      role="dialog"
      aria-label="Mobile Navigation"
    >
      {/* Translucent Backdrop Overlay Covering Viewport */}
      <div
        className={cn(
          "fixed inset-0 z-[999990] bg-black/55 transition-opacity duration-300 ease-out",
          animateIn ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      {/* Side Navigation Drawer (Left Aligned, 82vw max 340px) */}
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 z-[999999] flex flex-col bg-white text-[#1C1917] shadow-2xl transition-transform duration-300 ease-out border-r border-[#E7E5E4]",
          animateIn ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          width: "min(82vw, 340px)",
          height: "100dvh",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Logo Burgundy Drawer Header */}
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between bg-[#6B1D2F] px-5 text-white">
          <span className="font-serif text-lg font-semibold uppercase tracking-wider text-white">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center text-ivory transition-opacity hover:opacity-75"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {/* Main Navigation List */}
          <div className="space-y-1 divide-y divide-[#28201C]/12 border-b border-[#28201C]/12 pb-6">
            {/* HOME */}
            <div className="py-2">
              <Link
                to="/"
                onClick={handleLinkClick}
                className="block py-2 font-sans text-base font-semibold uppercase tracking-[0.18em] text-[#28201C]"
              >
                HOME
              </Link>
            </div>

            {/* CATEGORIES COLLAPSIBLE ACCORDION */}
            <div className="py-2">
              <button
                type="button"
                onClick={() => setCategoriesOpen((prev) => !prev)}
                aria-expanded={categoriesOpen}
                aria-controls="mobile-categories-accordion"
                className="flex w-full items-center justify-between py-2 font-sans text-base font-semibold uppercase tracking-[0.18em] text-[#28201C]"
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#6B1D2F]" />
                  <span>CATEGORIES</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-[#78716C] transition-transform duration-200",
                    categoriesOpen && "rotate-180 text-[#6B1D2F]",
                  )}
                />
              </button>

              {/* Accordion Content */}
              {categoriesOpen && (
                <div
                  id="mobile-categories-accordion"
                  className="mt-1 space-y-1 pl-4 pb-2 pt-1 border-l-2 border-[#6B1D2F]/30"
                >
                  <Link
                    to="/clothing"
                    onClick={handleLinkClick}
                    className="flex items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F]"
                  >
                    <span>All Clothing / Catalog</span>
                    <span>&rarr;</span>
                  </Link>

                  {categoriesLoading ? (
                    <div className="space-y-2 py-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-5 w-3/4 animate-pulse rounded bg-[#FAF8F5]" />
                      ))}
                    </div>
                  ) : categories.length === 0 ? (
                    <p className="py-1 text-xs text-[#78716C]">No categories available</p>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to="/category/$id"
                        params={{ id: cat.id }}
                        onClick={handleLinkClick}
                        className="flex items-center justify-between py-2 text-xs font-medium text-[#57534E] hover:text-[#6B1D2F] transition-colors"
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        {cat._count?.products !== undefined && (
                          <span className="shrink-0 rounded-full bg-[#FAF8F5] border border-[#E7E5E4] px-1.5 py-0.5 text-[10px] text-[#78716C]">
                            {cat._count.products}
                          </span>
                        )}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* ABOUT US */}
            <div className="py-2">
              <Link
                to="/about"
                onClick={handleLinkClick}
                className="block py-2 font-sans text-base font-semibold uppercase tracking-[0.18em] text-[#28201C]"
              >
                ABOUT US
              </Link>
            </div>

            {/* BLOGS */}
            <div className="py-2">
              <Link
                to="/blogs"
                onClick={handleLinkClick}
                className="block py-2 font-sans text-base font-semibold uppercase tracking-[0.18em] text-[#28201C]"
              >
                BLOGS
              </Link>
            </div>

            {/* TESTIMONIALS */}
            <div className="py-2">
              <a
                href="/#testimonials"
                onClick={handleLinkClick}
                className="block py-2 font-sans text-base font-semibold uppercase tracking-[0.18em] text-[#28201C]"
              >
                TESTIMONIALS
              </a>
            </div>

            {/* CONTACT */}
            <div className="py-2">
              <Link
                to="/contact"
                onClick={handleLinkClick}
                className="block py-2 font-sans text-base font-semibold uppercase tracking-[0.18em] text-[#28201C]"
              >
                CONTACT
              </Link>
            </div>

            {/* FAQS */}
            <div className="py-2">
              <Link
                to="/faq"
                onClick={handleLinkClick}
                className="block py-2 font-sans text-base font-semibold uppercase tracking-[0.18em] text-[#28201C]"
              >
                FAQS
              </Link>
            </div>
          </div>

          {/* Secondary Navigation */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-b border-[#28201C]/12 pb-6">
            <Link
              to="/wishlist"
              onClick={handleLinkClick}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#28201C]"
            >
              <Heart className="h-4 w-4 text-[#28201C]/70" />
              <span>Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}</span>
            </Link>
            <Link
              to="/account"
              onClick={handleLinkClick}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#28201C]"
            >
              <User className="h-4 w-4 text-[#28201C]/70" />
              <span>Account</span>
            </Link>
            <button
              type="button"
              onClick={handleSearchClick}
              className="flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wider text-[#28201C]"
            >
              <Search className="h-4 w-4 text-[#28201C]/70" />
              <span>Search</span>
            </button>
            <Link
              to="/contact"
              onClick={handleLinkClick}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#28201C]"
            >
              <Mail className="h-4 w-4 text-[#28201C]/70" />
              <span>Client Care</span>
            </Link>
          </div>

          {/* Footer Socials & Shipping Note */}
          <div className="mt-6 space-y-4 pt-2 pb-6">
            <div className="flex items-center gap-5 text-[#28201C]/80">
              <a
                href="https://www.instagram.com/lamokshfabrics"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-[#28201C]"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/LamokshFabrics/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="hover:text-[#28201C]"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.youtube.com/@lamoksh_fabrics"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="hover:text-[#28201C]"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
            <p className="text-[0.7rem] tracking-wider text-[#28201C]/60">
              Complimentary shipping across India · Handcrafted to order
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
