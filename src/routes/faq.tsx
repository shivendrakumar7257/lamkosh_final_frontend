import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { FaqSection } from "@/components/site/FaqSection";
import { images } from "@/data/catalog";
import { FAQS } from "@/data/faqs";
import { Sparkles, Scissors, Truck, Headphones } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions (FAQs) — Lamoksh Fabrics" },
      {
        name: "description",
        content:
          "Browse FAQs on Lamoksh Fabrics ethnic wear: sarees, unstitched suit materials, Upada silk dupattas, corsets, customisation, sizing, delivery across India, and orders.",
      },
      { property: "og:title", content: "Frequently Asked Questions (FAQs) — Lamoksh Fabrics" },
      {
        property: "og:description",
        content:
          "Find answers regarding ethnic wear collections, customisation, sizing, pan-India delivery, order placement, and returns.",
      },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="bg-[#FAF9F6]/40 min-h-screen">
      {/* JSON-LD Structured Data for Search Engine Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Banner */}
      <section className="relative flex min-h-[360px] items-center overflow-hidden border-b border-border md:min-h-[420px] lg:h-[46vh] lg:max-h-[500px]">
        <img
          src={images.catClothing}
          alt="Lamoksh Fabrics FAQs — Client Care & Assistance"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#4A101E]/80 backdrop-brightness-90" />
        <div className="container-lux relative z-10 py-16 text-white">
          <Reveal>
            <nav className="flex gap-2 text-xs text-white/80">
              <Link to="/" className="hover:text-white hover:underline">
                Home
              </Link>
              <span>/</span>
              <span className="font-medium text-white">FAQs</span>
            </nav>
            <p className="eyebrow mt-6 text-white/85">Client Care & Concierge</p>
            <h1 className="display-lg mt-3 text-white">Frequently Asked Questions</h1>
            <p className="body-lux mt-4 max-w-2xl text-white/90 text-sm sm:text-base leading-relaxed">
              Explore answers regarding our handcrafted ethnic collections, custom outfits,
              sizing guidance, nationwide delivery across India, and support services.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Assurance Feature Highlights */}
      <section className="border-b border-[#E7E5E4] bg-white py-8">
        <div className="container-lux">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 md:gap-8">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Ethnic Wear
                </p>
                <p className="text-[11px] text-[#78716C]">Sarees, suits & corsets</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <Scissors className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Custom Outfits
                </p>
                <p className="text-[11px] text-[#78716C]">Tailored upon request</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <Truck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Pan-India Shipping
                </p>
                <p className="text-[11px] text-[#78716C]">Secure insured transit</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <Headphones className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Personal Support
                </p>
                <p className="text-[11px] text-[#78716C]">Direct team guidance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive FAQ Section */}
      <main>
        <FaqSection showTitle={false} showSupportCards={true} />
      </main>
    </div>
  );
}
