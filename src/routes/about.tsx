import { createFileRoute, Link } from "@tanstack/react-router";
import { images } from "@/data/catalog";
import { Reveal } from "@/components/site/Reveal";
import {
  MapPin,
  Calendar,
  Award,
  Users,
  Heart,
  Palette,
  Tag,
  Store,
  ShieldCheck,
  Sparkles,
  Scissors,
  Truck,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Layers,
  Sparkle,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      {
        title:
          "About Us — LaMoksh Fabrics | Matching Fabrics & Dress Manufacturer in India",
      },
      {
        name: "description",
        content:
          "Established in 2020, LaMoksh Fabrics is India's trusted manufacturer and wholesale supplier of matching fabrics, handcrafted suit sets, and premium ethnic dress materials.",
      },
      {
        property: "og:title",
        content:
          "About LaMoksh Fabrics — Trusted Matching Fabrics & Dress Manufacturer & Wholesale Supplier",
      },
      {
        property: "og:description",
        content:
          "Founded in 2020. Built on dedication, care, and comfort. Discover the story, vision, and craftsmanship of LaMoksh Fabrics.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-[#FAF8F5]/60 text-foreground selection:bg-[#E11D48] selection:text-white">
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="container-lux">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <Reveal>
                {/* Pill Eyebrow Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-rose-50/90 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#D91B5C]">
                  <span className="flex h-2 w-2 rounded-full bg-[#E11D48] animate-pulse" />
                  <span>Trusted Matching Fabrics & Dress Manufacturer in India</span>
                </div>

                {/* Main Headline */}
                <h1 className="mt-6 font-serif text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
                  About LaMoksh —{" "}
                  <span className="bg-gradient-to-r from-[#D91B5C] via-[#E11D48] to-[#9F1239] bg-clip-text text-transparent font-medium">
                    Trusted Matching Fabrics & Dress Manufacturer & Wholesale Supplier in India
                  </span>
                </h1>

                {/* Intro Body */}
                <p className="mt-6 text-base font-normal leading-relaxed text-muted-foreground sm:text-lg">
                  Welcome to <strong className="text-foreground font-semibold">LaMoksh Fabrics</strong>, a premier destination in India&apos;s ethnic fashion and textile ecosystem. Established in 2020, we specialize in manufacturing and supplying exquisitely coordinated matching fabrics, unstitched suit sets, and artisanal dress materials designed for timeless style, lasting comfort, and accessible elegance.
                </p>

                {/* 3 Metric Counters */}
                <div className="mt-8 grid grid-cols-3 gap-4 border-y border-stone-200/80 py-6 sm:gap-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#E11D48] sm:text-3xl md:text-4xl">
                      500+
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
                      Curated Designs
                    </p>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#3B82F6] sm:text-3xl md:text-4xl">
                      100%
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
                      Quality Tested
                    </p>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#0D9488] sm:text-3xl md:text-4xl">
                      Fast
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
                      Pan-India Dispatch
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/clothing"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#1C1917] px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-[#6B1D2F] hover:shadow-md"
                  >
                    <span>Browse Catalog</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full border border-stone-300 bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-foreground shadow-2xs transition-all hover:border-[#E11D48] hover:text-[#E11D48]"
                  >
                    <span>Wholesale Inquiry</span>
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right Media Grid (4-Card Collage matching reference image) */}
            <div className="lg:col-span-5">
              <Reveal delay={150}>
                <div className="grid grid-cols-12 gap-3 sm:gap-4">
                  {/* Large Primary Card */}
                  <div className="col-span-8 overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-2 shadow-sm transition-transform duration-500 hover:scale-[1.01]">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100">
                      <img
                        src={images.prodLavenderFloralSet}
                        alt="LaMoksh Handcrafted Suit Set"
                        className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-xs px-3 py-1 text-[11px] font-semibold text-[#6B1D2F] shadow-xs">
                        Handcrafted Grace
                      </div>
                    </div>
                  </div>

                  {/* Right Side Stack: 3 Smaller Cards */}
                  <div className="col-span-4 flex flex-col justify-between gap-3 sm:gap-4">
                    {/* Top Small Card */}
                    <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-1.5 shadow-xs">
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
                        <img
                          src={images.prodPinkPaisleySet}
                          alt="Matching Fabrics Swatch"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Middle Small Card */}
                    <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-1.5 shadow-xs">
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
                        <img
                          src={images.prodOliveIkatSet}
                          alt="Artisan Weave Detail"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Bottom Monogram Accent Card */}
                    <div className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#80132B] via-[#6B1D2F] to-[#480F1E] p-3 text-center text-white shadow-sm">
                      <Scissors className="h-5 w-5 text-rose-200/90 mb-1" />
                      <span className="font-serif text-sm font-semibold tracking-wider text-white">
                        Estd. 2020
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-white/70">
                        LaMoksh
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. OUR STORY & MILESTONES ---------------- */}
      <section className="border-t border-stone-200/80 bg-white py-16 md:py-24">
        <div className="container-lux">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Narrative & Quote */}
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow text-[#E11D48]">Our Story</p>
                <h2 className="mt-3 font-serif text-2xl font-normal text-foreground sm:text-3xl md:text-4xl">
                  Built on Dedication, Care, and Comfort
                </h2>

                <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground font-semibold">LaMoksh Fabrics</strong> was founded in 2020 with a clear vision: to bring exquisite matching fabrics, handcrafted ethnic wear, and premium dress materials to life with uncompromising quality. Over the years, we have grown into a trusted manufacturer, wholesaler, and retailer, serving women, boutique owners, and retail partners across India.
                  </p>
                  <p>
                    From our roots in Ghaziabad (Delhi NCR) in 2020, we identified a persistent void in the ethnic wear landscape: finding unstitched suits and dress fabrics with genuine fiber purity, flawless color harmony, and durable drape. By working directly with master weaving hubs in Varanasi, Maheshwar, and Chanderi, we ensure every thread meets the highest artisanal standards.
                  </p>
                </div>

                {/* Highlight Quote Box with Red Border */}
                <div className="mt-8 rounded-r-2xl border-l-4 border-[#E11D48] bg-rose-50/50 p-6 shadow-2xs">
                  <p className="font-serif text-base italic leading-relaxed text-stone-800 md:text-lg">
                    &ldquo;What started with a passion for authentic textiles and perfect matching ensembles has now grown into a brand trusted by retail partners and thousands of happy customers across India.&rdquo;
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Key Milestones Card */}
            <div className="lg:col-span-5">
              <Reveal delay={150}>
                <div className="rounded-3xl border border-rose-100 bg-[#FFFDFE] p-7 shadow-xs sm:p-9">
                  <div className="flex items-center gap-2.5 text-[#E11D48]">
                    <Sparkle className="h-4 w-4 fill-current" />
                    <h3 className="font-serif text-xl font-semibold text-[#E11D48]">
                      Key Milestones
                    </h3>
                  </div>

                  <div className="mt-8 space-y-7">
                    {/* Milestone 1 */}
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-[#E11D48] border border-rose-100">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-500">
                          The Genesis
                        </span>
                        <h4 className="font-serif text-lg font-semibold text-foreground">
                          Founded in 2020
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          Started our journey with a dedicated mission to craft authentic matching fabrics, breathable cottons, and handloom dress materials.
                        </p>
                      </div>
                    </div>

                    {/* Milestone 2 */}
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-[#E11D48] border border-rose-100">
                        <Scissors className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-500">
                          Craft Mastery
                        </span>
                        <h4 className="font-serif text-lg font-semibold text-foreground">
                          Weaving & Cluster Expansion
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          Established direct partnerships with master artisanal weaving clusters across Varanasi, Maheshwar, and Chanderi for pure, transparent sourcing.
                        </p>
                      </div>
                    </div>

                    {/* Milestone 3 */}
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-[#E11D48] border border-rose-100">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-500">
                          Nationwide Reach
                        </span>
                        <h4 className="font-serif text-lg font-semibold text-foreground">
                          50,000+ Happy Customers & Boutiques
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          Supplying premium matching fabric sets to boutique owners, apparel designers, and retail connoisseurs pan-India with unwavering trust.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 3. WHAT WE ASPIRE TO BE (5 VALUES CARDS) ---------------- */}
      <section className="border-t border-stone-200/80 bg-[#FAF8F5]/80 py-16 md:py-24">
        <div className="container-lux">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <p className="eyebrow text-[#E11D48]">Our Vision & Values</p>
              <h2 className="mt-3 font-serif text-2xl font-normal text-foreground sm:text-3xl md:text-4xl">
                What We Aspire To Be
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed md:text-base">
                We believe every thread carries an emotion, and every matching ensemble should embody grace, comfort, and enduring Indian heritage.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {/* Card 1 */}
            <Reveal delay={50}>
              <div className="h-full rounded-2xl border border-stone-200/80 bg-white p-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-[#E11D48] border border-rose-100 mb-5">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Fabric-First Comfort
                </h3>
                <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                  Pure, breathable cottons, silks, and Chanderi designed for everyday ease and opulent festive poise.
                </p>
              </div>
            </Reveal>

            {/* Card 2 */}
            <Reveal delay={100}>
              <div className="h-full rounded-2xl border border-stone-200/80 bg-white p-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-100 mb-5">
                  <Palette className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Mastery of Matching
                </h3>
                <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                  Thoughtfully paired kurtas, bottoms, and artisanal dupattas for seamlessly balanced ensembles.
                </p>
              </div>
            </Reveal>

            {/* Card 3 */}
            <Reveal delay={150}>
              <div className="h-full rounded-2xl border border-stone-200/80 bg-white p-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5">
                  <Tag className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Affordable Pricing
                </h3>
                <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                  Direct manufacturer-to-consumer and wholesale pricing with zero compromise on fabric purity.
                </p>
              </div>
            </Reveal>

            {/* Card 4 */}
            <Reveal delay={200}>
              <div className="h-full rounded-2xl border border-stone-200/80 bg-white p-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-600 border border-sky-100 mb-5">
                  <Store className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Reliable Wholesale
                </h3>
                <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                  Consistent fabric weight (GSM), ready stock availability, and scheduled on-time delivery.
                </p>
              </div>
            </Reveal>

            {/* Card 5 */}
            <Reveal delay={250}>
              <div className="h-full rounded-2xl border border-stone-200/80 bg-white p-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600 border border-purple-100 mb-5">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Consistent Trust
                </h3>
                <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                  Every meter tested for color-fastness, yarn durability, and heirloom longevity.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- 4. WHAT MAKES LAMOKSH DIFFERENT (6 CARDS GRID) ---------------- */}
      <section className="border-t border-stone-200/80 bg-white py-16 md:py-24">
        <div className="container-lux">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <p className="eyebrow text-[#E11D48]">Why We Stand Out</p>
              <h2 className="mt-3 font-serif text-2xl font-normal text-foreground sm:text-3xl md:text-4xl">
                What Makes LaMoksh Different
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed md:text-base">
                How we deliver superior fabric quality, authentic designs, and dependable value across every touchpoint.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <Reveal delay={50}>
              <div className="h-full rounded-2xl border border-stone-200/80 bg-white p-7 shadow-xs transition-all duration-300 hover:border-rose-200 hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 mb-5">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Premium Quality Fabrics
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  At LaMoksh, quality is never a compromise. We use only high-count combed cottons, Chanderi silk, Banarasi weaves, and pure Maheshwari fabrics that feel luxuriously soft and drape flatteringly.
                </p>
              </div>
            </Reveal>

            {/* Card 2 */}
            <Reveal delay={100}>
              <div className="h-full rounded-2xl border border-stone-200/80 bg-white p-7 shadow-xs transition-all duration-300 hover:border-rose-200 hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-[#E11D48] border border-rose-100 mb-5">
                  <Scissors className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Trendy & Heritage Designs
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Our in-house design studio curates exclusive floral prints, fine Chikankari, and intricate zari borders that bridge India&apos;s cultural heritage with contemporary occasion-wear silhouettes.
                </p>
              </div>
            </Reveal>

            {/* Card 3 */}
            <Reveal delay={150}>
              <div className="h-full rounded-2xl border border-stone-200/80 bg-white p-7 shadow-xs transition-all duration-300 hover:border-rose-200 hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 mb-5">
                  <Tag className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Affordable & Honest Pricing
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  By manufacturing and sourcing directly from master weaving hubs, we bypass traditional middlemen to offer authentic handloom and matching sets at transparent, pocket-friendly prices.
                </p>
              </div>
            </Reveal>

            {/* Card 4 */}
            <Reveal delay={200}>
              <div className="h-full rounded-2xl border border-stone-200/80 bg-white p-7 shadow-xs transition-all duration-300 hover:border-rose-200 hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 mb-5">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Wholesale & Retail Versatility
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  From a single bespoke dress material set for an intimate family celebration to bulk commercial orders for retail fashion boutiques, we cater to all requirements with equal care.
                </p>
              </div>
            </Reveal>

            {/* Card 5 */}
            <Reveal delay={250}>
              <div className="h-full rounded-2xl border border-stone-200/80 bg-white p-7 shadow-xs transition-all duration-300 hover:border-rose-200 hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 mb-5">
                  <Truck className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Pan-India Express Delivery
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  With central warehousing in Delhi NCR and trusted express courier tie-ups, all orders are safely packed and dispatched quickly to over 19,000 pin codes across India.
                </p>
              </div>
            </Reveal>

            {/* Card 6 */}
            <Reveal delay={300}>
              <div className="h-full rounded-2xl border border-stone-200/80 bg-white p-7 shadow-xs transition-all duration-300 hover:border-rose-200 hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 mb-5">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Customer-Focused Approach
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  We believe in building lasting relationships. Our team provides dedicated fabric guidance, transparent descriptions, and prompt after-sales support so you shop with absolute peace of mind.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- 5. WHY RETAILERS CHOOSE LAMOKSH & CIRCULAR STAMP ---------------- */}
      <section className="border-t border-stone-200/80 bg-[#FAF8F5]/80 py-16 md:py-24">
        <div className="container-lux">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow text-[#E11D48]">For Boutiques & Retail Partners</p>
                <h2 className="mt-3 font-serif text-2xl font-normal text-foreground sm:text-3xl md:text-4xl">
                  Why Retailers Choose LaMoksh
                </h2>
                <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                  Boutique owners, apparel designers, and fabric merchants across India partner with LaMoksh Fabrics for consistent weave purity, trending seasonal designs, and profitable wholesale margins.
                </p>

                {/* 6 Checkmarks Grid */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-sm font-medium text-foreground">
                      Consistent fabric GSM & weave purity
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-sm font-medium text-foreground">
                      Flexible minimum order quantities (MOQ)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-sm font-medium text-foreground">
                      Fresh design catalogues added weekly
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-sm font-medium text-foreground">
                      Dedicated wholesale manager support
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-sm font-medium text-foreground">
                      Bulk ready stock for immediate dispatch
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-sm font-medium text-foreground">
                      Insured express door-to-door transit
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-[#E11D48] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#BE123C]"
                  >
                    <span>Partner With Us / Wholesale</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right Side: Circular Brand Stamp Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <Reveal delay={150}>
                <div className="relative flex aspect-square w-72 sm:w-84 items-center justify-center rounded-3xl border border-stone-200/90 bg-white p-6 shadow-sm">
                  {/* Custom SVG Circular Emblem Stamp */}
                  <svg
                    viewBox="0 0 300 300"
                    className="w-full h-full text-[#6B1D2F] drop-shadow-2xs select-none"
                    aria-label="LaMoksh Fabrics Official Stamp - Estd 2020"
                  >
                    {/* Definitions for curved text paths */}
                    <defs>
                      <path
                        id="stampTextPathTop"
                        d="M 45 150 A 105 105 0 0 1 255 150"
                        fill="none"
                      />
                      <path
                        id="stampTextPathBottom"
                        d="M 255 150 A 105 105 0 0 1 45 150"
                        fill="none"
                      />
                    </defs>

                    {/* Outer jagged/stitched circle */}
                    <circle
                      cx="150"
                      cy="150"
                      r="142"
                      fill="none"
                      stroke="#6B1D2F"
                      strokeWidth="2.5"
                      strokeDasharray="4 3"
                    />

                    {/* Outer solid border */}
                    <circle
                      cx="150"
                      cy="150"
                      r="134"
                      fill="none"
                      stroke="#6B1D2F"
                      strokeWidth="3.5"
                    />

                    {/* Decorative ribbon band */}
                    <circle
                      cx="150"
                      cy="150"
                      r="104"
                      fill="#FFF5F7"
                      stroke="#6B1D2F"
                      strokeWidth="2"
                    />

                    {/* Circular Curved Text Top */}
                    <text
                      fill="#6B1D2F"
                      fontSize="14.5"
                      fontFamily="serif"
                      fontWeight="bold"
                      letterSpacing="3.5"
                    >
                      <textPath
                        href="#stampTextPathTop"
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        LAMOKSH FABRICS
                      </textPath>
                    </text>

                    {/* Circular Curved Text Bottom */}
                    <text
                      fill="#E11D48"
                      fontSize="12.5"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                      letterSpacing="2.8"
                    >
                      <textPath
                        href="#stampTextPathBottom"
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        • ESTABLISHED 2020 •
                      </textPath>
                    </text>

                    {/* Inner Medallion Background */}
                    <circle
                      cx="150"
                      cy="150"
                      r="84"
                      fill="#6B1D2F"
                    />

                    {/* Inner Inner Beaded Ring */}
                    <circle
                      cx="150"
                      cy="150"
                      r="78"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                      opacity="0.6"
                    />

                    {/* Center Icon & Text */}
                    {/* Crossed Needle & Shears Motif */}
                    <g transform="translate(150, 118)" stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
                      <path d="M-14 -12 L14 12" />
                      <path d="M14 -12 L-14 12" />
                      <circle cx="0" cy="0" r="3" fill="#ffffff" />
                    </g>

                    <text
                      x="150"
                      y="148"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="15"
                      fontFamily="serif"
                      fontWeight="bold"
                      letterSpacing="2.5"
                    >
                      MATCHING
                    </text>
                    <text
                      x="150"
                      y="166"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="12"
                      fontFamily="serif"
                      letterSpacing="3"
                    >
                      FABRICS & DRESS
                    </text>

                    <line x1="110" y1="174" x2="190" y2="174" stroke="#ffffff" strokeWidth="1" opacity="0.4" />

                    <text
                      x="150"
                      y="188"
                      textAnchor="middle"
                      fill="#FFD2DC"
                      fontSize="9.5"
                      fontFamily="sans-serif"
                      fontWeight="600"
                      letterSpacing="2"
                    >
                      DELHI NCR · INDIA
                    </text>
                  </svg>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 6. GHAZIABAD & DELHI NCR HUB & COMMITMENT ---------------- */}
      <section className="border-t border-stone-200/80 bg-[#FAF8F5]/80 py-16 md:py-24">
        <div className="container-lux">
          <Reveal>
            <div className="rounded-3xl border border-stone-200/90 bg-white p-8 shadow-xs md:p-12">
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                {/* Left: Location & Hub */}
                <div className="lg:col-span-6">
                  <div className="flex items-center gap-2 text-[#E11D48]">
                    <MapPin className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#E11D48]">
                      Headquarters &amp; Distribution
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                    Ghaziabad &amp; Delhi NCR Hub
                  </h3>

                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed md:text-base">
                    Based in Indirapuram, Ghaziabad (Delhi NCR), LaMoksh Fabrics operates from the heart of North India&apos;s textile and trade corridor. Our centralized facility houses our creative design studio, fabric quality laboratory, physical wholesale display showroom, and express fulfillment center.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    <span className="rounded-full border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-xs font-medium text-stone-700">
                      Direct Loom &amp; Mill Sourcing
                    </span>
                    <span className="rounded-full border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-xs font-medium text-stone-700">
                      In-House Quality Lab
                    </span>
                    <span className="rounded-full border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-xs font-medium text-stone-700">
                      Wholesale Display Showroom
                    </span>
                    <span className="rounded-full border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-xs font-medium text-stone-700">
                      Central Dispatch Hub
                    </span>
                  </div>
                </div>

                {/* Right: Our Commitment */}
                <div className="lg:col-span-6 border-t border-stone-100 pt-8 lg:border-t-0 lg:border-l lg:border-stone-200/80 lg:pt-0 lg:pl-12">
                  <h3 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                    Our Commitment
                  </h3>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#E11D48] text-xs font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          100% Honest Fabric Disclosure
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Pure cottons, silks, and verified blends with transparent counts and wash-care details.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#E11D48] text-xs font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          Direct Artisan Empowerment
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Fair compensation and continuous support directly empowering generational weaver families.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#E11D48] text-xs font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          Zero Compromise on Quality
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Multi-tier checks for color-fastness, yarn integrity, and shrinkage before any dispatch.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#E11D48] text-xs font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          End-to-End Buyer Support
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Personalized assistance for matching combinations, bespoke lengths, and wholesale orders.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- 8. FINAL CALL TO ACTION ---------------- */}
      <section className="border-t border-stone-200/80 bg-white py-20 text-center">
        <div className="container-lux max-w-3xl">
          <Reveal>
            <p className="eyebrow text-[#E11D48]">Experience LaMoksh</p>
            <h2 className="mt-3 font-serif text-3xl font-normal text-foreground sm:text-4xl">
              Experience the Art of Matching Fabrics
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Explore our curated edits of Banarasi silks, Maheshwari weaves, and handcrafted festive suit sets — or connect with our team for boutique wholesale partnerships.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/clothing"
                className="inline-flex items-center gap-2 rounded-full bg-[#6B1D2F] px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-[#4D1220]"
              >
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-foreground shadow-2xs transition-all hover:border-[#6B1D2F] hover:text-[#6B1D2F]"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Contact Atelier</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
