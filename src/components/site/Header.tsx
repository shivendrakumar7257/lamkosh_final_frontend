import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import logo from "@/assets/logo.png";
import { MobileMenu } from "@/components/site/MobileMenu";
import { useShop } from "@/lib/shop-store";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { CategoryDropdown } from "@/components/site/CategoryDropdown";
import { cn } from "@/lib/utils";

export function Header() {
  const { setSearchOpen } = useShop();
  const { itemCount, setCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur transition-shadow",
        scrolled && "shadow-[0_1px_0_0_var(--border)]",
      )}
    >
      <p className="nav-label bg-espresso py-2 text-center text-ivory">
        Complimentary shipping across India · Handcrafted to order
      </p>

      <div className="container-lux flex h-16 items-center justify-between gap-6 md:h-20">
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="lg:hidden p-2 -ml-2 text-foreground focus:outline-none"
            aria-label="Open menu"
            aria-expanded={mobile}
            onClick={() => setMobile(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <nav className="hidden items-center gap-7 lg:flex">
            <Link to="/" className="nav-label link-underline">
              Home
            </Link>
            <CategoryDropdown />
            <Link to="/about" className="nav-label link-underline">
              About Us
            </Link>
            <Link to="/blogs" className="nav-label link-underline">
              Blogs
            </Link>
          </nav>
        </div>

        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center py-1 max-w-[55%] sm:max-w-none"
        >
          <img
            src={logo}
            alt="LaMoksh Fabrics"
            className="h-10 w-auto max-w-[180px] object-contain sm:h-12 sm:max-w-[320px] md:h-14 md:max-w-[480px]"
          />
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/wishlist" className="hidden md:flex nav-label link-underline items-center">
            Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}
          </Link>
          <nav className="hidden items-center gap-7 xl:flex">
            <a href="/#testimonials" className="nav-label link-underline">
              Testimonials
            </a>
            <Link to="/contact" className="nav-label link-underline">
              Contact
            </Link>
          </nav>
          <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search className="h-[1.15rem] w-[1.15rem]" />
          </button>
          <Link to="/account" aria-label="Account">
            <User className="h-[1.15rem] w-[1.15rem]" />
          </Link>
          <button
            type="button"
            aria-label="Open bag"
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
            {itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-espresso text-[0.6rem] text-ivory">
                {itemCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Navigation Drawer */}
      <MobileMenu isOpen={mobile} onClose={() => setMobile(false)} />
    </header>
  );
}
