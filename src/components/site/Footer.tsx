import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer className="mt-28 border-t border-[#4A101E] bg-[#6B1D2F] text-white">
      <div className="container-lux grid gap-14 py-20 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="inline-block bg-white p-2.5 shadow-sm">
            <img
              src={logo}
              alt="LaMoksh Fabrics"
              className="h-12 w-auto object-contain object-left md:h-14"
            />
          </Link>
          <p className="mt-6 max-w-sm text-sm text-white/80 leading-relaxed font-sans">
            An Indian house of handwoven clothing — made in small numbers, by named hands, for the
            occasions you remember.
          </p>
          <div className="mt-5 space-y-1 text-xs text-white/75">
            <p className="font-semibold uppercase tracking-wider text-white">
              Atelier & Store Location:
            </p>
            <p>
              LG 3, LG 4 & LG 8, HRC Shopping Complex, Vaibhav Khand, Indirapuram, Ghaziabad, Uttar
              Pradesh 201014
            </p>
            <p className="pt-1 font-semibold text-white">
              Contact:{" "}
              <a href="tel:+919999875605" className="hover:underline text-white">
                +91 99998 75605
              </a>
            </p>
          </div>
          <div className="mt-6 flex gap-5 text-white/70">
            <a
              href="https://www.instagram.com/lamokshfabrics"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.facebook.com/LamokshFabrics/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-white transition-colors"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://www.youtube.com/@lamoksh_fabrics"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="hover:text-white transition-colors"
            >
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        <FooterCol
          title="Shop"
          links={[
            { to: "/clothing", label: "Clothing" },
            { to: "/new-arrivals", label: "New Arrivals" },
            { to: "/bestsellers", label: "Most Loved" },
            { to: "/wishlist", label: "Wishlist" },
            { to: "/clothing", label: "All Clothing" },
          ]}
        />
        <FooterCol
          title="Help"
          links={[
            { to: "/contact", label: "Contact Us" },
            { to: "/faq", label: "FAQ" },
          ]}
        />
        <FooterCol
          title="Client Care"
          links={[
            { to: "/shipping", label: "Shipping" },
            { to: "/returns", label: "Returns & Exchanges" },
            { to: "/track-order", label: "Track Order" },
            { to: "/account", label: "Account" },
            { to: "/privacy", label: "Privacy Policy" },
            { to: "/terms", label: "Terms of Service" },
          ]}
        />
      </div>

      <div className="border-t border-white/15">
        <div className="container-lux flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              The LaMoksh Letter
            </p>
            <p className="mt-2 text-sm text-white/75">
              New collection arrivals, handloom notes and private previews. No noise.
            </p>
          </div>
          <form
            className="flex w-full max-w-md items-center border-b border-white/40"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
              setEmail("");
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email address"
              className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/50"
            />
            <button
              type="submit"
              className="nav-label whitespace-nowrap pl-4 text-white hover:opacity-80"
            >
              {done ? "Thank you" : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-lux flex flex-col gap-2 py-6 text-xs text-white/60 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} LaMoksh Fabrics. All rights reserved.</p>
          <p>Handcrafted in India · Shipped worldwide</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white">
        {title}
      </p>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={`${l.to}-${l.label}`}>
            <Link to={l.to} className="text-sm text-white/75 transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
