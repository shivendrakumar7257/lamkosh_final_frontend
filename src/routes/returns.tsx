import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { images } from "@/data/catalog";
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  PackageCheck,
  CreditCard,
  RefreshCw,
  XCircle,
  ShieldAlert,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Camera,
} from "lucide-react";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Return & Exchange Policy — Lamoksh Fabrics" },
      {
        name: "description",
        content:
          "Read Lamoksh Fabrics' Return & Exchange Policy: eligibility, conditions, step-by-step request process, refunds, replacements, and cancellations.",
      },
      { property: "og:title", content: "Return & Exchange Policy — Lamoksh Fabrics" },
      {
        property: "og:description",
        content:
          "How to request a return, exchange, or resolution for your handcrafted orders at Lamoksh Fabrics.",
      },
      { property: "og:url", content: "/returns" },
    ],
    links: [{ rel: "canonical", href: "/returns" }],
  }),
  component: ReturnPolicyPage,
});

interface PolicySection {
  id: string;
  number: string;
  title: string;
  icon: typeof RotateCcw;
  paragraphs?: string[];
  bullets?: string[];
  steps?: { step: number; text: string }[];
  callout?: {
    type: "info" | "action" | "warning";
    text: string;
    link?: {
      label: string;
      to?: string;
      href?: string;
    };
  };
}

const SECTIONS: PolicySection[] = [
  {
    id: "eligibility",
    number: "01",
    title: "Return and Exchange Eligibility",
    icon: CheckCircle2,
    paragraphs: [
      "Returns and exchanges are subject to the product's eligibility and the conditions specified at the time of purchase.",
      "A return or exchange request may be considered in cases such as:",
    ],
    bullets: [
      "You receive a damaged or defective product.",
      "You receive a product different from the one ordered.",
      "An item is missing from your order.",
      "A product qualifies for a return or exchange under the terms stated on its product page.",
    ],
    callout: {
      type: "info",
      text: "Please review the product description and applicable terms carefully before placing your order.",
    },
  },
  {
    id: "conditions",
    number: "02",
    title: "Conditions for Returns and Exchanges",
    icon: PackageCheck,
    paragraphs: ["To help us assess your request, please ensure that:"],
    bullets: [
      "The product is unused, unworn, unwashed, and undamaged, except where the reported issue itself involves damage or a defect.",
      "Original tags, labels, packaging, and accessories are retained, wherever applicable.",
      "You provide the order number and supporting photographs or videos if requested.",
      "Your request is submitted within the applicable return or exchange period communicated by Lamoksh Fabrics.",
    ],
    callout: {
      type: "warning",
      text: "Products showing signs of use, alteration, washing, damage caused after delivery, or missing original tags may not qualify, subject to applicable consumer protection laws.",
    },
  },
  {
    id: "not-eligible",
    number: "03",
    title: "Products That May Not Be Eligible",
    icon: XCircle,
    paragraphs: [
      "Certain products may be excluded from returns or exchanges, including:",
    ],
    bullets: [
      "Customised, personalised, or made-to-order outfits.",
      "Products specifically marked as non-returnable or non-exchangeable before purchase.",
      "Items damaged due to improper handling, washing, alteration, or use after delivery.",
      "Products returned without the required original tags, packaging, or accessories, where applicable.",
    ],
    callout: {
      type: "info",
      text: "These exclusions do not affect any rights you may have under applicable law, including in cases involving defective, deficient, spurious, or incorrectly supplied products.",
    },
  },
  {
    id: "how-to-request",
    number: "04",
    title: "How to Request a Return or Exchange",
    icon: Camera,
    paragraphs: [
      "To initiate a request, please follow these steps:",
    ],
    steps: [
      {
        step: 1,
        text: "Contact Lamoksh Fabrics through the contact details or enquiry form available on our website.",
      },
      {
        step: 2,
        text: "Provide your order number, the product name, and the reason for your request.",
      },
      {
        step: 3,
        text: "Share clear photographs or videos of the product and packaging if the item is damaged, defective, or incorrect.",
      },
      {
        step: 4,
        text: "Wait for our team to review your request and provide instructions.",
      },
      {
        step: 5,
        text: "If approved, follow the return or exchange instructions provided by our team.",
      },
    ],
    callout: {
      type: "action",
      text: "Please do not dispatch a product back to us before receiving return instructions, unless otherwise required by applicable law.",
      link: {
        label: "Contact Client Care",
        to: "/contact",
      },
    },
  },
  {
    id: "return-shipping-charges",
    number: "05",
    title: "Return Shipping Charges",
    icon: RotateCcw,
    paragraphs: [
      "Responsibility for return shipping charges will depend on the reason for the return and the applicable policy.",
      "Where a return or exchange is approved because a product is defective, damaged, or incorrectly supplied, Lamoksh Fabrics will communicate the appropriate resolution and applicable shipping arrangements.",
      "For other eligible returns or exchanges, any applicable shipping charges will be communicated before the return is completed.",
    ],
  },
  {
    id: "refund-policy",
    number: "06",
    title: "Refund Policy",
    icon: CreditCard,
    paragraphs: [
      "Where a refund is approved, it will be processed through the original payment method wherever possible, or through another lawful method agreed upon with the customer.",
      "The time required for the refund to appear in your account may depend on the payment provider, bank, or payment method.",
      "Any applicable refund amount, deductions permitted by law, and expected processing timeline will be communicated to you during the resolution process.",
    ],
  },
  {
    id: "exchange-policy",
    number: "07",
    title: "Exchange Policy",
    icon: RefreshCw,
    paragraphs: [
      "Exchanges are subject to product availability and approval under the applicable policy.",
      "If the requested replacement product, size, colour, or design is unavailable, our team will contact you to discuss the available options, which may include an alternative product or an eligible refund, as applicable.",
    ],
  },
  {
    id: "order-cancellation",
    number: "08",
    title: "Order Cancellation",
    icon: AlertTriangle,
    paragraphs: [
      "If you wish to cancel an order, please contact us as soon as possible.",
      "Cancellation requests may be accommodated before the order is processed or dispatched, subject to the applicable terms and law. Orders that have already been dispatched or customised may not be eligible for cancellation under the standard cancellation process.",
      "Where a cancellation and refund are approved, the applicable refund will be processed in accordance with our refund procedure and applicable law.",
    ],
  },
  {
    id: "damaged-products",
    number: "09",
    title: "Incorrect, Damaged, or Defective Products",
    icon: ShieldAlert,
    paragraphs: [
      "If you receive an incorrect, damaged, or defective product, please notify us as soon as reasonably possible after delivery.",
      "Include your order number, a description of the issue, and clear supporting photographs or videos where available. Our team will review the matter and communicate the appropriate next steps, which may include a replacement, exchange, refund, or another legally appropriate resolution.",
    ],
    callout: {
      type: "action",
      text: "Received an issue with your parcel? Reach out with photos and order ID.",
      link: {
        label: "Report Issue Now",
        to: "/contact",
      },
    },
  },
  {
    id: "contact-us",
    number: "10",
    title: "Contact Us",
    icon: Mail,
    paragraphs: [
      "For questions or assistance regarding returns, exchanges, refunds, or cancellations, please contact Lamoksh Fabrics through the official contact details or enquiry form available on our website.",
      "Website: https://lamokshfabric.com/",
      "We appreciate your understanding and the opportunity to resolve any concerns you may have with your purchase.",
    ],
    callout: {
      type: "action",
      text: "Our dedicated client care team replies personally to every inquiry.",
      link: {
        label: "Open Enquiry Form",
        to: "/contact",
      },
    },
  },
];

function ReturnPolicyPage() {
  return (
    <div className="bg-[#FAF9F6]/40 min-h-screen">
      {/* Hero Banner */}
      <section className="relative flex min-h-[360px] items-center overflow-hidden border-b border-border md:min-h-[420px] lg:h-[46vh] lg:max-h-[500px]">
        <img
          src={images.catWedding}
          alt="Lamoksh Fabrics Return & Exchange Policy"
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-[#4A101E]/80 backdrop-brightness-90" />
        <div className="container-lux relative z-10 py-16 text-white">
          <Reveal>
            <nav className="flex gap-2 text-xs text-white/80">
              <Link to="/" className="hover:text-white hover:underline">
                Home
              </Link>
              <span>/</span>
              <span className="font-medium text-white">Return & Exchange Policy</span>
            </nav>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="eyebrow text-white/85">Client Care & Guarantees</span>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-mono font-medium text-white">
                Effective: 19 October 2026
              </span>
            </div>
            <h1 className="display-lg mt-3 text-white">Return & Exchange Policy</h1>
            <p className="body-lux mt-4 max-w-2xl text-white/90 text-sm sm:text-base leading-relaxed">
              At Lamoksh Fabrics, we want you to be happy with your purchase. We take care to
              present our products as accurately as possible and maintain quality standards. If you
              experience an issue with your order, this policy explains how to request a return,
              exchange, or resolution.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Trust & Guarantee Highlights */}
      <section className="border-b border-[#E7E5E4] bg-white py-8">
        <div className="container-lux">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 md:gap-8">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <RotateCcw className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Fair Resolution
                </p>
                <p className="text-[11px] text-[#78716C]">Defect & damage protection</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <PackageCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Unworn Guarantee
                </p>
                <p className="text-[11px] text-[#78716C]">Retain tags and packaging</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Secure Refunds
                </p>
                <p className="text-[11px] text-[#78716C]">Original payment method</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Dedicated Care
                </p>
                <p className="text-[11px] text-[#78716C]">Personal guidance for sizing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="py-12 md:py-20">
        <div className="container-lux max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Sticky Table of Contents */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-sm border border-[#E7E5E4] bg-white p-6 shadow-sm">
                  <p className="eyebrow text-[#6B1D2F]">Policy Contents</p>
                  <h3 className="font-display text-xl text-[#1C1917] mt-1 mb-4">
                    Table of Contents
                  </h3>
                  <nav className="space-y-1.5 text-xs">
                    {SECTIONS.map((sec) => (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        className="group flex items-center justify-between py-1.5 text-[#57534E] hover:text-[#6B1D2F] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-[#78716C] group-hover:text-[#6B1D2F]">
                            {sec.number}.
                          </span>
                          <span className="truncate">{sec.title}</span>
                        </span>
                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Return Request Quick Action Card */}
                <div className="rounded-sm border border-[#E7E5E4] bg-[#FAF8F5] p-6 shadow-sm space-y-3">
                  <p className="eyebrow text-[#6B1D2F]">Need to Request a Return?</p>
                  <h4 className="font-display text-lg text-[#1C1917]">Contact Our Atelier</h4>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    Have your order ID and pictures ready. Our team will review your request and
                    provide instructions.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E]"
                  >
                    <span>Submit Request</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Direct Helpline */}
                <div className="rounded-sm border border-[#E7E5E4] bg-white p-6 shadow-sm space-y-2 text-xs">
                  <p className="eyebrow text-[#6B1D2F]">Immediate Assistance</p>
                  <p className="text-[#57534E]">
                    Questions regarding size swaps, cancellations, or damaged shipments?
                  </p>
                  <div className="pt-2 space-y-2">
                    <a
                      href="tel:+919999875605"
                      className="flex items-center gap-2 text-[#1C1917] hover:text-[#6B1D2F]"
                    >
                      <Phone className="h-3.5 w-3.5 text-[#6B1D2F]" />
                      <span className="font-semibold">+91 99998 75605</span>
                    </a>
                    <a
                      href="mailto:fabricslamoksh@gmail.com"
                      className="flex items-center gap-2 text-[#1C1917] hover:text-[#6B1D2F]"
                    >
                      <Mail className="h-3.5 w-3.5 text-[#6B1D2F]" />
                      <span>fabricslamoksh@gmail.com</span>
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Column: Policy Document Sections */}
            <div className="lg:col-span-8 space-y-10">
              {SECTIONS.map((sec) => {
                const IconComponent = sec.icon;

                return (
                  <Reveal key={sec.id}>
                    <section
                      id={sec.id}
                      className="scroll-mt-28 rounded-sm border border-[#E7E5E4] bg-white p-6 sm:p-8 shadow-sm hover:border-[#6B1D2F]/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <span className="shrink-0 font-mono text-xs font-semibold px-2.5 py-1 rounded-xs bg-[#FAF8F5] text-[#6B1D2F] border border-[#E7E5E4]">
                          {sec.number}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-[#6B1D2F] mb-1">
                            <IconComponent className="h-4 w-4" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                              Section {sec.number}
                            </span>
                          </div>
                          <h2 className="font-display text-2xl sm:text-3xl text-[#1C1917]">
                            {sec.title}
                          </h2>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-[#57534E] pl-0 sm:pl-11">
                        {sec.paragraphs?.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}

                        {sec.bullets && (
                          <ul className="space-y-2 list-none pt-1">
                            {sec.bullets.map((b, idx) => (
                              <li key={idx} className="flex items-start gap-2.5">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#6B1D2F] shrink-0" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {sec.steps && (
                          <div className="pt-2 space-y-3">
                            {sec.steps.map((st) => (
                              <div
                                key={st.step}
                                className="flex items-start gap-3 rounded-sm border border-[#E7E5E4] bg-[#FAF8F5]/60 p-3.5 text-xs sm:text-sm"
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F] font-mono text-xs font-semibold text-white">
                                  {st.step}
                                </span>
                                <span className="text-[#1C1917] leading-relaxed pt-0.5">
                                  {st.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {sec.callout && (
                          <div
                            className={
                              sec.callout.type === "warning"
                                ? "mt-4 rounded-sm border border-amber-300 bg-amber-50/60 p-4 text-xs sm:text-sm text-amber-900 leading-relaxed font-medium"
                                : sec.callout.type === "action"
                                  ? "mt-4 rounded-sm border border-[#6B1D2F]/20 bg-[#FAF9F6] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                  : "mt-4 rounded-sm border border-[#E7E5E4] bg-[#FAF8F5] p-4 text-xs sm:text-sm text-[#1C1917]"
                            }
                          >
                            <p className="text-xs sm:text-sm font-medium">{sec.callout.text}</p>
                            {sec.callout.link?.to && (
                              <Link
                                to={sec.callout.link.to}
                                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E]"
                              >
                                <span>{sec.callout.link.label}</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            )}
                          </div>
                        )}

                        {/* Special Details Card for Section 10 (Contact Us) */}
                        {sec.id === "contact-us" && (
                          <div className="mt-6 rounded-sm border border-[#E7E5E4] bg-[#FAF8F5] p-6 space-y-3">
                            <h4 className="font-sans font-semibold text-xs uppercase tracking-widest text-[#6B1D2F]">
                              Client Care Contact
                            </h4>
                            <div className="grid gap-2 text-xs sm:text-sm text-[#1C1917]">
                              <div>
                                <span className="font-semibold">Website: </span>
                                <a
                                  href="https://lamokshfabric.com/"
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#6B1D2F] hover:underline"
                                >
                                  https://lamokshfabric.com/
                                </a>
                              </div>
                              <div>
                                <span className="font-semibold">Email: </span>
                                <a
                                  href="mailto:fabricslamoksh@gmail.com"
                                  className="text-[#6B1D2F] hover:underline"
                                >
                                  fabricslamoksh@gmail.com
                                </a>
                              </div>
                              <div>
                                <span className="font-semibold">Phone: </span>
                                <a
                                  href="tel:+919999875605"
                                  className="text-[#6B1D2F] hover:underline"
                                >
                                  +91 99998 75605
                                </a>
                              </div>
                            </div>
                            <div className="pt-3">
                              <Link
                                to="/contact"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E]"
                              >
                                <span>Contact Atelier Support</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  </Reveal>
                );
              })}

              {/* Bottom Reassurance Banner */}
              <div className="rounded-sm border border-[#6B1D2F]/20 bg-[#6B1D2F] p-8 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-sm">
                <div>
                  <h3 className="font-display text-2xl text-white">We are here to help</h3>
                  <p className="body-lux text-sm text-white/85 mt-2 max-w-xl">
                    We appreciate your understanding and the opportunity to resolve any concerns you
                    may have with your purchase. Speak directly with our atelier team.
                  </p>
                </div>
                <div className="mt-6 sm:mt-0 shrink-0 flex flex-wrap gap-3 justify-center">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-white text-[#6B1D2F] hover:bg-[#FAF8F5] transition-colors"
                  >
                    <span>Contact Us</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/faq"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider border border-white/40 text-white hover:bg-white/10 transition-colors"
                  >
                    <span>Read FAQs</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
