import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { usePublicProducts } from "@/hooks/use-products";
import { products } from "@/data/catalog";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Search the LaMoksh Fabrics catalogue of handcrafted suit sets and handwoven clothing.",
      },
      { property: "og:title", content: "Search — LaMoksh Fabrics" },
      { property: "og:description", content: "Find a piece by name, craft or material." },
      { property: "og:url", content: "/search" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQ(q.trim()), 350);
    return () => clearTimeout(handler);
  }, [q]);

  const { data: apiResponse, isLoading } = usePublicProducts(
    debouncedQ ? { search: debouncedQ, limit: 40 } : undefined,
  );

  const results = useMemo(() => {
    if (!debouncedQ) return [];
    if (apiResponse?.products && apiResponse.products.length > 0) {
      return apiResponse.products;
    }
    const term = debouncedQ.toLowerCase();
    return products.filter((p) =>
      [p.title, p.type, p.material, p.colour, p.description].join(" ").toLowerCase().includes(term),
    );
  }, [debouncedQ, apiResponse]);

  return (
    <div>
      <PageHeader
        eyebrow="Catalogue"
        title="Search"
        intro="Search by name, craft, material or occasion."
      />
      <div className="container-lux py-16">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Saree, Kurta, Silk, Banarasi…"
          aria-label="Search the catalogue"
          className="w-full max-w-xl border-b border-border bg-transparent py-3 font-display text-2xl outline-none focus:border-foreground"
        />
        {debouncedQ ? (
          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#6B1D2F]" />
                Searching atelier catalogue...
              </span>
            ) : (
              <span>
                {results.length} {results.length === 1 ? "piece" : "pieces"} found
              </span>
            )}
          </div>
        ) : null}

        {results.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {results.map((p: any) => (
              <ProductCard key={p.id || p.handle} product={p} />
            ))}
          </div>
        ) : debouncedQ && !isLoading ? (
          <p className="mt-12 py-12 text-center font-serif text-base text-[#78716C]">
            No handcrafted pieces match &quot;{debouncedQ}&quot;.
          </p>
        ) : null}
      </div>
    </div>
  );
}
