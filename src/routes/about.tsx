import { createFileRoute, Link } from "@tanstack/react-router";
import { images } from "@/data/catalog";
import founderSwatiGoel from "@/assets/founder-swati-goel.jpg";
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
  Crown,
  Quote,
  Gem,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      {
        title:
          "About Us & Founder Story — LaMoksh Fabrics | Swati Goel",
      },
      {
        name: "description",
        content:
          "Meet Swati Goel, Founder of LaMoksh Fabrics. Driven by passion and inspired by tradition, discover our journey from fabric origins to bridal couture, ethnic wear, and inclusive fashion.",
      },
      {
        property: "og:title",
        content:
          "About LaMoksh Fabrics — Swati Goel, Founder Profile & Brand Story",
      },
      {
        property: "og:description",
        content:
          "Where Tradition Meets Contemporary Elegance. Built on dedication, care, and inclusive fashion. Discover the story, collections, and philosophy of LaMoksh Fabrics.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-[#FAF8F5]/60 text-foreground selection:bg-[#6B1D2F] selection:text-white">
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="container-lux">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <Reveal>
                {/* Pill Eyebrow Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-[#6B1D2F]/20 bg-[#6B1D2F]/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F]">
                  <span className="flex h-2 w-2 rounded-full bg-[#6B1D2F] animate-pulse" />
                  <span>Where Tradition Meets Contemporary Elegance</span>
                </div>

                {/* Main Headline */}
                <h1 className="mt-6 font-serif text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
                  Crafted with Passion.{" "}
                  <span className="bg-gradient-to-r from-[#6B1D2F] via-[#8B2238] to-[#4A101E] bg-clip-text text-transparent font-medium">
                    Designed for Every Woman.
                  </span>
                </h1>

                {/* Intro Body */}
                <p className="mt-6 text-base font-normal leading-relaxed text-muted-foreground sm:text-lg">
                  Welcome to <strong className="text-foreground font-semibold">LaMoksh Fabrics</strong> — a fashion and textile destination that celebrates the richness of Indian craftsmanship while embracing contemporary fashion and individual style. From timeless traditional ensembles to modern silhouettes, we bring together fabrics, ethnic wear, bridal couture, western wear, and customised outfits under one roof.
                </p>

                {/* 3 Metric Counters */}
                <div className="mt-8 grid grid-cols-3 gap-4 border-y border-stone-200/80 py-6 sm:gap-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#6B1D2F] sm:text-3xl md:text-4xl">
                      7+ Years
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
                      Textile Heritage
                    </p>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#6B1D2F] sm:text-3xl md:text-4xl">
                      100%
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
                      Custom Feasibility
                    </p>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#6B1D2F] sm:text-3xl md:text-4xl">
                      Pan-India
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
                      Insured Delivery
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#founder-story"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#6B1D2F] px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-[#4A101E] hover:shadow-md"
                  >
                    <span>Meet the Founder</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>

                  <Link
                    to="/clothing"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full border border-stone-300 bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-foreground shadow-2xs transition-all hover:border-[#6B1D2F] hover:text-[#6B1D2F]"
                  >
                    <span>Explore Collections</span>
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right Media Grid (Collage with Founder Teaser) */}
            <div className="lg:col-span-5">
              <Reveal delay={150}>
                <div className="grid grid-cols-12 gap-3 sm:gap-4">
                  {/* Large Primary Card: Founder Portrait */}
                  <div className="col-span-8 overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-2 shadow-sm transition-transform duration-500 hover:scale-[1.01]">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100">
                      <img
                        src={founderSwatiGoel}
                        alt="Swati Goel — Founder of LaMoksh Fabric"
                        className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/95 backdrop-blur-xs p-3 shadow-sm border border-stone-100">
                        <p className="font-serif text-sm font-semibold text-[#6B1D2F]">
                          Swati Goel
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-stone-600 font-medium">
                          Founder &amp; Creative Mind
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Stack: 3 Smaller Cards */}
                  <div className="col-span-4 flex flex-col justify-between gap-3 sm:gap-4">
                    {/* Top Small Card: Bridal & Ethnic */}
                    <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-1.5 shadow-xs">
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
                        <img
                          src={images.catWedding}
                          alt="Bridal Couture & Occasion Wear"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Middle Small Card: Handloom Textiles */}
                    <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-1.5 shadow-xs">
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
                        <img
                          src={images.prodLavenderFloralSet}
                          alt="Handcrafted Ethnic Weaves"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Bottom Monogram Accent Card */}
                    <div className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#80132B] via-[#6B1D2F] to-[#480F1E] p-3 text-center text-white shadow-sm">
                      <Crown className="h-5 w-5 text-rose-200/90 mb-1" />
                      <span className="font-serif text-sm font-semibold tracking-wider text-white">
                        LaMoksh
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-white/80">
                        Couture
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. THE MIND BEHIND LAMOKSH FABRIC (FOUNDER PROFILE) ---------------- */}
      <section
        id="founder-story"
        className="scroll-mt-24 border-t border-stone-200/80 bg-white py-16 md:py-24"
      >
        <div className="container-lux">
          {/* Header Banner */}
          <div className="mx-auto max-w-3xl text-center mb-16">
            <Reveal>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.2em] uppercase bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <Sparkles className="w-3.5 h-3.5" />
                The Mind Behind LaMoksh Fabric
              </div>
              <h2 className="mt-3 font-serif text-3xl font-normal text-foreground sm:text-4xl md:text-5xl">
                Swati Goel — Founder of LaMoksh Fabric
              </h2>
              <p className="mt-3 font-serif text-lg italic text-[#6B1D2F] md:text-xl">
                &ldquo;Driven by Passion. Inspired by Tradition. Designed for Every Woman.&rdquo;
              </p>
            </Reveal>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left: Founder Portrait Card with Accolades */}
            <div className="lg:col-span-5">
              <Reveal>
                <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-3 shadow-md">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100">
                    <img
                      src={founderSwatiGoel}
                      alt="Swati Goel — Founder of LaMoksh Fabric"
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-serif text-2xl font-semibold">Swati Goel</p>
                      <p className="text-xs font-sans uppercase tracking-widest text-white/90">
                        Founder &amp; Creative Director, LaMoksh Fabric
                      </p>
                    </div>
                  </div>

                  {/* Accolades & Honours Pill Grid */}
                  <div className="mt-4 space-y-2.5 p-2">
                    <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
                      <Award className="h-5 w-5 shrink-0 text-amber-600" />
                      <div>
                        <p className="font-semibold">Powerful Woman Transforming Nation – 2023</p>
                        <p className="text-[11px] text-amber-800">
                          Honoured for transformative leadership in fashion &amp; entrepreneurship
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-xs text-rose-950">
                      <Crown className="h-5 w-5 shrink-0 text-[#6B1D2F]" />
                      <div>
                        <p className="font-semibold">Business Woman Recognition</p>
                        <p className="text-[11px] text-stone-600">
                          Felicitation at the prestigious Constitution Club of India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: Founder Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <Reveal delay={150}>
                <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  <p>
                    <strong className="text-foreground font-semibold">Swati Goel</strong> is the founder of LaMoksh Fabric, a fashion and textile brand that brings together the richness of Indian craftsmanship and the elegance of contemporary design.
                  </p>

                  <p>
                    Her entrepreneurial journey began during the challenging times of COVID-19. Recognising the difficulties faced by boutique owners, she started a small business supplying linings and offering complimentary doorstep delivery to support them during an uncertain period.
                  </p>

                  <p>
                    As her relationships with customers grew, they began approaching her for customised outfits and personalised designs. What started as a fabric business gradually evolved into a deeper passion for fashion design, laying the foundation for LaMoksh Fabric.
                  </p>

                  <p>
                    With a vision to blend traditional Indian aesthetics with modern silhouettes, Swati has built a brand that celebrates individuality, creativity, and personal expression. Her approach to design focuses on creating outfits that reflect each woman&apos;s unique personality, style, and preferences.
                  </p>

                  <p>
                    A strong believer in inclusive fashion, Swati strives to make every woman feel beautiful, comfortable, and confident, regardless of her body type or size. Through customised designs and personalised styling, she aims to make fashion a more personal and empowering experience.
                  </p>
                </div>

                {/* Pull Quote Box */}
                <div className="mt-8 rounded-2xl border-l-4 border-[#6B1D2F] bg-[#FAF8F5] p-6 shadow-2xs">
                  <Quote className="h-6 w-6 text-[#6B1D2F]/40 mb-2" />
                  <p className="font-serif text-lg italic leading-relaxed text-stone-900 md:text-xl">
                    &ldquo;For Swati, LaMoksh Fabric is more than a fashion brand; it is a reflection of her creativity, determination and belief that every woman deserves to feel confident in what she wears.&rdquo;
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-[#6B1D2F] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#4A101E]"
                  >
                    <span>Connect for Bespoke Styling</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href="tel:+919999875605"
                    className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:border-[#6B1D2F] hover:text-[#6B1D2F] transition-colors"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>+91 99998 75605 / 88825 10158</span>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 3. ABOUT LAMOKSH FABRIC & 7-YEAR JOURNEY ---------------- */}
      <section className="border-t border-stone-200/80 bg-[#FAF8F5]/80 py-16 md:py-24">
        <div className="container-lux">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow text-[#6B1D2F]">Our Heritage & Evolution</p>
                <h2 className="mt-3 font-serif text-2xl font-normal text-foreground sm:text-3xl md:text-4xl">
                  Where Tradition Meets Contemporary Elegance
                </h2>

                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground font-semibold">LaMoksh Fabric</strong> is a fashion and textile destination that celebrates the beauty of Indian craftsmanship while embracing contemporary fashion and individual style.
                  </p>
                  <p>
                    Established approximately seven years ago, the brand has evolved from its roots in fabric and textile supplies into a diverse fashion destination, bringing together fabrics, ethnic wear, bridal couture, western wear, and customised outfits under one roof.
                  </p>
                  <p>
                    From timeless traditional ensembles to contemporary silhouettes, our collections are designed for women with diverse tastes, lifestyles, and fashion preferences. Whether it is a bridal celebration, a family wedding, a festive gathering, or a special occasion, LaMoksh Fabric offers fashion choices that bring personal style to life.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-xs">
                    <p className="font-serif text-2xl font-bold text-[#6B1D2F]">7+ Years</p>
                    <p className="text-xs text-stone-600 mt-1">Estd. Legacy</p>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-xs">
                    <p className="font-serif text-2xl font-bold text-[#6B1D2F]">3 Domains</p>
                    <p className="text-xs text-stone-600 mt-1">Ethnic, Western, Fabrics</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 rounded-xl border border-stone-200 bg-white p-4 text-center shadow-xs">
                    <p className="font-serif text-2xl font-bold text-[#6B1D2F]">All Sizes</p>
                    <p className="text-xs text-stone-600 mt-1">Inclusive Tailoring</p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Graphic: LaMoksh Legacy */}
            <div className="lg:col-span-5">
              <Reveal delay={150}>
                <div className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-3 shadow-md">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
                    <img
                      src={images.brandStory}
                      alt="Artisan weavers and fabric craftsmanship"
                      className="h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-serif text-lg font-semibold">Generational Artisanship</p>
                      <p className="text-xs text-white/85">
                        Handcrafted by named hands in Varanasi, Maheshwar &amp; Chanderi
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. OUR DIVERSE COLLECTIONS (3 PILLARS) ---------------- */}
      <section className="border-t border-stone-200/80 bg-white py-16 md:py-24">
        <div className="container-lux">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <p className="eyebrow text-[#6B1D2F]">What We Create</p>
              <h2 className="mt-3 font-serif text-2xl font-normal text-foreground sm:text-3xl md:text-4xl">
                Our Collections
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed md:text-base">
                Discover a diverse spectrum of fashion choices — from regal bridal couture to versatile modern silhouettes and pure designer textiles.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Collection 1: Ethnic Wear & Bridal Couture */}
            <Reveal delay={50}>
              <div className="flex h-full flex-col justify-between rounded-3xl border border-stone-200/90 bg-[#FFFDFE] p-7 shadow-xs hover:border-[#6B1D2F]/40 hover:shadow-md transition-all">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6B1D2F]/10 text-[#6B1D2F] mb-6">
                    <Crown className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B1D2F]">
                    Couture &amp; Occasion
                  </span>
                  <h3 className="mt-1 font-serif text-2xl font-normal text-foreground">
                    Ethnic Wear &amp; Bridal Couture
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Rooted in Indian traditions and inspired by contemporary elegance, our ethnic wear celebrates craftsmanship, intricate detailing, and timeless silhouettes.
                  </p>

                  <ul className="mt-5 space-y-2 text-xs sm:text-sm text-stone-700">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#6B1D2F] shrink-0" />
                      <span>Bridal and designer lehengas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#6B1D2F] shrink-0" />
                      <span>Wedding &amp; occasion lehengas for brides &amp; family</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#6B1D2F] shrink-0" />
                      <span>Elegant gowns and occasion wear</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#6B1D2F] shrink-0" />
                      <span>Traditional &amp; contemporary sarees</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#6B1D2F] shrink-0" />
                      <span>Ready-to-wear pre-draped sarees</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#6B1D2F] shrink-0" />
                      <span>Unstitched &amp; ready-to-wear suit sets</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-stone-100">
                  <Link
                    to="/clothing"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E]"
                  >
                    <span>View Ethnic Edits</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Collection 2: Western & Contemporary Wear */}
            <Reveal delay={100}>
              <div className="flex h-full flex-col justify-between rounded-3xl border border-stone-200/90 bg-[#FFFDFE] p-7 shadow-xs hover:border-[#6B1D2F]/40 hover:shadow-md transition-all">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 mb-6">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                    Modern Silhouettes
                  </span>
                  <h3 className="mt-1 font-serif text-2xl font-normal text-foreground">
                    Western &amp; Contemporary Wear
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Our western and contemporary wear brings together modern aesthetics, versatile silhouettes, and personalised design.
                  </p>

                  <ul className="mt-5 space-y-2 text-xs sm:text-sm text-stone-700">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-amber-700 shrink-0" />
                      <span>Customised western gowns &amp; dresses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-amber-700 shrink-0" />
                      <span>Readymade &amp; bespoke corsets</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-amber-700 shrink-0" />
                      <span>Statement occasion wear</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-amber-700 shrink-0" />
                      <span>Indo-western fusion ensembles</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-amber-700 shrink-0" />
                      <span>Tailored cuts celebrating personal elegance</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-stone-100">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E]"
                  >
                    <span>Request Custom Outfit</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Collection 3: Fabrics & Raw Materials */}
            <Reveal delay={150}>
              <div className="flex h-full flex-col justify-between rounded-3xl border border-stone-200/90 bg-[#FFFDFE] p-7 shadow-xs hover:border-[#6B1D2F]/40 hover:shadow-md transition-all">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 mb-6">
                    <Layers className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                    Textile Roots
                  </span>
                  <h3 className="mt-1 font-serif text-2xl font-normal text-foreground">
                    Fabrics &amp; Raw Materials
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    At LaMoksh Fabric, we understand that every beautiful outfit begins with the right fabric. We supply designers, boutiques, and creators with premium raw textiles.
                  </p>

                  <ul className="mt-5 space-y-2 text-xs sm:text-sm text-stone-700">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>A variety of pure &amp; blended silk fabrics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>Plain fabrics and essential linings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>Fabrics for ethnic and contemporary wear</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>Materials for customised designer creations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>Upada silk dupattas &amp; stoles</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-stone-100">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E]"
                  >
                    <span>Fabric &amp; Wholesale Inquiry</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- 5. DESIGN PHILOSOPHY: FASHION THAT CELEBRATES INDIVIDUALITY ---------------- */}
      <section className="border-t border-stone-200/80 bg-[#FAF8F5]/80 py-16 md:py-24">
        <div className="container-lux">
          <div className="rounded-3xl border border-stone-200/90 bg-white p-8 shadow-xs md:p-14">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7">
                <Reveal>
                  <p className="eyebrow text-[#6B1D2F]">Our Design Philosophy</p>
                  <h2 className="mt-3 font-serif text-3xl font-normal text-foreground sm:text-4xl">
                    Fashion That Celebrates Individuality
                  </h2>
                  <p className="mt-4 font-serif text-lg italic text-[#6B1D2F]">
                    &ldquo;We believe confidence has no size.&rdquo;
                  </p>

                  <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                    <p>
                      At LaMoksh Fabric, we believe fashion is more than what you wear; it is an expression of who you are.
                    </p>
                    <p>
                      Our design philosophy brings together traditional Indian aesthetics, contemporary trends, thoughtful detailing, and personalised customisation. Every design is approached with an understanding that individual style is unique and deserves to be celebrated.
                    </p>
                    <p>
                      Our commitment to inclusive fashion extends to customised and plus-size designs, ensuring that women with diverse body types can explore styles that make them feel comfortable, elegant, and confident.
                    </p>
                    <p className="font-medium text-foreground">
                      Our goal is to create fashion experiences where every woman feels seen, valued, and beautifully represented.
                    </p>
                  </div>
                </Reveal>
              </div>

              {/* Right Column: 3 Philosophy Pillars */}
              <div className="lg:col-span-5 space-y-4">
                <Reveal delay={100}>
                  <div className="rounded-2xl border border-stone-200 bg-[#FAF8F5] p-5 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6B1D2F] text-white">
                        <Heart className="h-4 w-4" />
                      </div>
                      <h4 className="font-serif text-base font-semibold text-foreground">
                        Body-Inclusive Fit
                      </h4>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Customised sizing and flattering draping crafted for every body type and plus-size requirement with absolute confidence.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-[#FAF8F5] p-5 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6B1D2F] text-white">
                        <Scissors className="h-4 w-4" />
                      </div>
                      <h4 className="font-serif text-base font-semibold text-foreground">
                        Personalised Customisation
                      </h4>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Necklines, sleeves, drape lengths, and silhouette adjustments tailored to your exact taste and occasion.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-[#FAF8F5] p-5 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6B1D2F] text-white">
                        <Gem className="h-4 w-4" />
                      </div>
                      <h4 className="font-serif text-base font-semibold text-foreground">
                        Thoughtful Detailing
                      </h4>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      From hand-embroidered zardozi to precision stitching, each finish reflects genuine artisanal dedication.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 6. VISION & PROMISE ---------------- */}
      <section className="border-t border-stone-200/80 bg-white py-16 md:py-24">
        <div className="container-lux">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Our Vision */}
            <Reveal>
              <div className="h-full rounded-3xl border border-stone-200/90 bg-[#FAF9F6] p-8 sm:p-10 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6B1D2F]/10 text-[#6B1D2F] mb-6">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span className="eyebrow text-[#6B1D2F]">Our Vision</span>
                  <h3 className="mt-2 font-serif text-2xl font-normal text-foreground sm:text-3xl">
                    Bridging Craftsmanship with Modern Silhouettes
                  </h3>
                  <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                    To establish LaMoksh Fabric as a trusted and distinguished fashion destination, recognised for its diverse collections, quality fabrics, personalised designs, and commitment to customer satisfaction.
                  </p>
                  <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                    We aspire to bridge the beauty of traditional craftsmanship with the possibilities of contemporary fashion, making creativity, individuality, and inclusivity central to everything we do.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Our Promise */}
            <Reveal delay={150}>
              <div className="h-full rounded-3xl border border-[#6B1D2F]/20 bg-[#6B1D2F] p-8 sm:p-10 text-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white mb-6">
                    <HeartHandshake className="h-6 w-6" />
                  </div>
                  <span className="eyebrow text-white/80">Our Promise</span>
                  <h3 className="mt-2 font-serif text-2xl font-normal text-white sm:text-3xl">
                    Every Customer and Every Design Matters
                  </h3>
                  <p className="mt-4 text-base text-white/90 leading-relaxed">
                    Whether you are searching for your dream bridal lehenga, an ensemble for a family wedding, an elegant gown, a contemporary western outfit, a timeless saree, or the perfect fabric for your next creation, we strive to help you discover a style that feels uniquely yours.
                  </p>
                  <p className="mt-3 text-base text-white/90 leading-relaxed">
                    Through personalised attention, thoughtful design, and a passion for fashion, we aim to make every experience with LaMoksh Fabric memorable.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/20">
                  <p className="font-serif text-base italic text-rose-200">
                    &ldquo;LaMoksh Fabric — Crafted with Passion. Designed for You.&rdquo;
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- 7. GHAZIABAD STORE & SHOWROOM ---------------- */}
      <section className="border-t border-stone-200/80 bg-[#FAF8F5]/80 py-16 md:py-24">
        <div className="container-lux">
          <Reveal>
            <div className="rounded-3xl border border-stone-200/90 bg-white p-8 shadow-xs md:p-12">
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
                {/* Left: Location & Hub */}
                <div className="lg:col-span-6">
                  <div className="flex items-center gap-2 text-[#6B1D2F]">
                    <MapPin className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#6B1D2F]">
                      LaMoksh Store &amp; Showroom
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                    Visit Our Store in Indirapuram
                  </h3>

                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed md:text-base">
                    Based in Indirapuram, Ghaziabad (Delhi NCR), LaMoksh Fabrics welcomes clients for personalized styling appointments, bespoke bridal fittings, and fabric consultations.
                  </p>

                  <div className="mt-4 p-4 rounded-xl border border-stone-200 bg-[#FAF8F5] text-xs text-stone-700 space-y-1">
                    <p className="font-semibold text-foreground">Store Address:</p>
                    <p>
                      LG 3, LG 4 &amp; LG 8, HRC Shopping Complex, Vaibhav Khand, Indirapuram, Ghaziabad, Uttar Pradesh 201014
                    </p>
                    <p className="pt-1 text-[#6B1D2F] font-semibold">
                      Helpline: +91 99998 75605 / +91 88825 10158
                    </p>
                    <p className="text-stone-500">
                      Open Wednesday to Monday · 8:00 AM – 10:00 PM
                    </p>
                  </div>
                </div>

                {/* Right: Connect Directly */}
                <div className="lg:col-span-6 border-t border-stone-100 pt-8 lg:border-t-0 lg:border-l lg:border-stone-200/80 lg:pt-0 lg:pl-12">
                  <h3 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                    Begin Your Custom Journey
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Have a bespoke bridal lehenga in mind, need sizing advice, or wish to explore our raw fabric inventory? Our styling and support team is ready to guide you.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 rounded-full bg-[#6B1D2F] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#4A101E]"
                    >
                      <span>Book a Styling Appointment</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/faq"
                      className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:border-[#6B1D2F] hover:text-[#6B1D2F] transition-colors"
                    >
                      <span>View FAQs</span>
                    </Link>
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
            <p className="eyebrow text-[#6B1D2F]">Experience LaMoksh</p>
            <h2 className="mt-3 font-serif text-3xl font-normal text-foreground sm:text-4xl">
              Discover Fashion That Celebrates You
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Explore our bridal lehengas, occasion sarees, customised western wear, and fine fabrics — crafted with passion, designed for you.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/clothing"
                className="inline-flex items-center gap-2 rounded-full bg-[#6B1D2F] px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-[#4D1220]"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-foreground shadow-2xs transition-all hover:border-[#6B1D2F] hover:text-[#6B1D2F]"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Contact LaMoksh</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
