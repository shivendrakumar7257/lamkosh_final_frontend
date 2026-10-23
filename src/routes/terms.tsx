import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { images } from "@/data/catalog";
import {
  FileText,
  UserCheck,
  Sparkles,
  CreditCard,
  ShoppingBag,
  Truck,
  RotateCcw,
  Scissors,
  ShieldAlert,
  Scale,
  ExternalLink,
  Lock,
  AlertTriangle,
  Clock,
  Landmark,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Lamoksh Fabrics" },
      {
        name: "description",
        content:
          "Read Lamoksh Fabrics' Terms of Service: website usage, ordering, pricing, bespoke customisation, shipping, returns, intellectual property, and governing law.",
      },
      { property: "og:title", content: "Terms of Service — Lamoksh Fabrics" },
      {
        property: "og:description",
        content:
          "Terms governing the access, browsing, and purchase of handcrafted ethnic wear from Lamoksh Fabrics.",
      },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

interface TermSection {
  id: string;
  number: string;
  title: string;
  icon: typeof FileText;
  paragraphs?: string[];
  bullets?: string[];
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

const SECTIONS: TermSection[] = [
  {
    id: "about-us",
    number: "01",
    title: "About Lamoksh Fabrics",
    icon: Sparkles,
    paragraphs: [
      "Lamoksh Fabrics offers fashion and ethnic wear products, including sarees, unstitched suit materials, dupattas, readymade corsets, and other clothing and fashion items.",
      "Throughout these terms, references to “we,” “us,” and “our” mean Lamoksh Fabrics. References to “you” and “your” mean any person accessing or using our website.",
    ],
  },
  {
    id: "eligibility",
    number: "02",
    title: "Eligibility to Use the Website",
    icon: UserCheck,
    paragraphs: [
      "By using this website, you confirm that you are legally capable of entering into a binding agreement under applicable law.",
      "If you are using the website on behalf of another person or organisation, you confirm that you are authorised to act on their behalf.",
      "You agree to use our website only for lawful purposes and in accordance with these terms.",
    ],
  },
  {
    id: "product-information",
    number: "03",
    title: "Product Information and Availability",
    icon: ShoppingBag,
    paragraphs: [
      "We make reasonable efforts to provide accurate product descriptions, photographs, colours, prices, and other details.",
      "However, slight variations may occur due to screen settings, lighting, photography, fabric characteristics, dyeing processes, or other factors.",
      "All products are subject to availability. We reserve the right to update product information, discontinue products, correct listing errors, or limit quantities where reasonably necessary and permitted by law.",
      "If a product becomes unavailable after an order is placed, we will contact you regarding the available options, including cancellation and any applicable refund.",
    ],
  },
  {
    id: "pricing-payments",
    number: "04",
    title: "Pricing and Payments",
    icon: CreditCard,
    paragraphs: [
      "All prices displayed on the website are in the currency indicated at checkout and are subject to applicable taxes and charges.",
      "Shipping fees, where applicable, will be displayed or communicated before the order is completed.",
      "We may update prices from time to time. Any price changes will not retrospectively alter a confirmed order except where a correction or adjustment is lawfully required and appropriately communicated.",
      "Payments may be processed through third-party payment service providers. You agree to provide accurate information necessary to complete your transaction.",
      "If a payment fails, remains pending, or cannot be verified, order processing may be delayed until the payment status is resolved.",
    ],
  },
  {
    id: "order-placement",
    number: "05",
    title: "Order Placement and Confirmation",
    icon: FileText,
    paragraphs: [
      "When you place an order, you are submitting a request to purchase the selected products.",
      "An order confirmation or acknowledgement does not necessarily guarantee dispatch if payment verification, product availability, or other necessary checks remain incomplete.",
      "If we cannot fulfil an order, we will notify you and arrange any applicable cancellation and refund in accordance with our policies and applicable law.",
      "Please ensure that your name, contact number, email address, and shipping address are accurate when placing an order.",
    ],
  },
  {
    id: "shipping-delivery",
    number: "06",
    title: "Shipping and Delivery",
    icon: Truck,
    paragraphs: [
      "Orders are shipped according to our Shipping Policy and the delivery information available at checkout.",
      "Delivery timelines are estimates and may vary depending on the destination, product availability, courier operations, weather, holidays, and other circumstances.",
      "Customers are responsible for providing accurate delivery information and being available to receive their shipments where required.",
      "For details about delivery charges, tracking, delayed shipments, and shipping-related concerns, please refer to our Shipping Policy.",
    ],
    callout: {
      type: "action",
      text: "Need full details on courier dispatch, tracking, and delivery timelines?",
      link: {
        label: "View Shipping Policy",
        to: "/shipping",
      },
    },
  },
  {
    id: "returns-exchanges",
    number: "07",
    title: "Returns, Exchanges, and Refunds",
    icon: RotateCcw,
    paragraphs: [
      "Returns, exchanges, cancellations, and refunds are handled in accordance with our published Return & Exchange Policy and applicable consumer protection laws.",
      "Some products, including customised or made-to-order items, may be subject to specific eligibility conditions disclosed before purchase.",
      "If you receive a damaged, defective, incorrect, or otherwise non-conforming product, please contact us with your order details so that we can review and resolve the issue in accordance with applicable law.",
      "Nothing in these terms is intended to restrict any consumer rights available to you under applicable law.",
    ],
    callout: {
      type: "action",
      text: "Review eligibility criteria and the step-by-step return request process.",
      link: {
        label: "View Return & Exchange Policy",
        to: "/returns",
      },
    },
  },
  {
    id: "customised-products",
    number: "08",
    title: "Customised and Made-to-Order Products",
    icon: Scissors,
    paragraphs: [
      "Where customisation is offered, customers are responsible for providing accurate measurements, design preferences, colour choices, and other required specifications.",
      "We may contact you to clarify the details before proceeding with a customised order.",
      "Customised products may require additional processing time and may be subject to specific cancellation, return, or exchange conditions disclosed before purchase, subject to applicable law.",
    ],
    callout: {
      type: "action",
      text: "Looking for bespoke tailorings or customisation on select pieces?",
      link: {
        label: "Enquire with LaMoksh Styling",
        to: "/contact",
      },
    },
  },
  {
    id: "user-conduct",
    number: "09",
    title: "User Conduct",
    icon: ShieldAlert,
    paragraphs: ["When using our website, you agree not to:"],
    bullets: [
      "Use the website for unlawful, fraudulent, or misleading activities.",
      "Submit false, inaccurate, or misleading order or contact information.",
      "Attempt to gain unauthorised access to the website, its systems, or other users' information.",
      "Introduce malicious software, harmful code, or activities that interfere with website operations.",
      "Copy, misuse, or exploit website content for unauthorised commercial purposes.",
      "Engage in activities that may damage our business, website, or customers.",
    ],
    callout: {
      type: "warning",
      text: "We may take appropriate action where misuse or a violation of these terms is identified, subject to applicable law.",
    },
  },
  {
    id: "intellectual-property",
    number: "10",
    title: "Intellectual Property",
    icon: Scale,
    paragraphs: [
      "Unless otherwise stated, the content available on our website, including text, product descriptions, photographs, graphics, logos, designs, and branding, is owned by or lawfully used by Lamoksh Fabrics.",
      "You may browse the website and use its content for personal, non-commercial shopping purposes.",
      "You must not reproduce, distribute, modify, publish, or commercially exploit website content without prior written permission from the relevant rights holder, except where permitted by law.",
    ],
  },
  {
    id: "third-party-services",
    number: "11",
    title: "Third-Party Services and Links",
    icon: ExternalLink,
    paragraphs: [
      "Our website may use or link to third-party services, including payment gateways, shipping providers, social media platforms, and other external websites.",
      "These services may operate under their own terms and privacy policies. Lamoksh Fabrics is not responsible for independent third-party websites or services beyond its control.",
      "Your use of such services may be subject to the relevant provider's terms and conditions.",
    ],
  },
  {
    id: "privacy-policy",
    number: "12",
    title: "Privacy and Personal Information",
    icon: Lock,
    paragraphs: [
      "Your use of our website is also subject to our Privacy Policy, which explains how we collect, use, store, and protect personal information.",
      "By using the website, you acknowledge that personal information may be processed as described in that policy and in accordance with applicable law.",
    ],
    callout: {
      type: "action",
      text: "Learn more about our strict data protection, security, and your privacy rights.",
      link: {
        label: "View Privacy Policy",
        to: "/privacy",
      },
    },
  },
  {
    id: "limitation-of-liability",
    number: "13",
    title: "Limitation of Liability",
    icon: AlertTriangle,
    paragraphs: [
      "To the extent permitted by applicable law, Lamoksh Fabrics will not be responsible for losses arising from circumstances beyond our reasonable control, including third-party service interruptions, courier delays, or temporary website unavailability.",
      "Nothing in these terms excludes or limits liability where such exclusion or limitation is prohibited by law, including applicable consumer protection rights and remedies.",
    ],
  },
  {
    id: "changes-to-terms",
    number: "14",
    title: "Changes to These Terms",
    icon: Clock,
    paragraphs: [
      "We may revise these Terms of Service from time to time to reflect changes in our business operations, website features, or applicable laws.",
      "Updated terms will be published on this page with a revised effective date. Your continued use of the website after an update does not remove any rights you may have under applicable law.",
    ],
  },
  {
    id: "governing-law",
    number: "15",
    title: "Governing Law and Disputes",
    icon: Landmark,
    paragraphs: [
      "These Terms of Service are governed by the laws applicable in India.",
      "Any dispute arising from the use of our website or purchases made through it will be handled in accordance with applicable Indian law and the jurisdiction of the competent courts, without prejudice to any consumer rights or remedies available under law.",
    ],
  },
  {
    id: "contact-information",
    number: "16",
    title: "Contact Information",
    icon: Mail,
    paragraphs: [
      "For questions regarding these Terms of Service, orders, products, or website usage, please contact us using the details below:",
      "We appreciate your interest in Lamoksh Fabrics and thank you for shopping with us.",
    ],
  },
];

function TermsPage() {
  return (
    <div className="bg-[#FAF9F6]/40 min-h-screen">
      {/* Hero Banner */}
      <section className="relative flex min-h-[360px] items-center overflow-hidden border-b border-border md:min-h-[420px] lg:h-[46vh] lg:max-h-[500px]">
        <img
          src={images.catNew}
          alt="Lamoksh Fabrics Terms of Service"
          className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-[#4A101E]/80 backdrop-brightness-90" />
        <div className="container-lux relative z-10 py-16 text-white">
          <Reveal>
            <nav className="flex gap-2 text-xs text-white/80">
              <Link to="/" className="hover:text-white hover:underline">
                Home
              </Link>
              <span>/</span>
              <span className="font-medium text-white">Terms of Service</span>
            </nav>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="eyebrow text-white/85">Legal & Transparency</span>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-mono font-medium text-white">
                Effective: 19 October 2026
              </span>
            </div>
            <h1 className="display-lg mt-3 text-white">Terms of Service</h1>
            <p className="body-lux mt-4 max-w-2xl text-white/90 text-sm sm:text-base leading-relaxed">
              Welcome to Lamoksh Fabrics. These Terms of Service govern your access to and use of our
              website, https://lamokshfabric.com/, including browsing our collections, purchasing
              products, and using the services available through the website.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Legal & Quality Pillars */}
      <section className="border-b border-[#E7E5E4] bg-white py-8">
        <div className="container-lux">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 md:gap-8">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Fair Terms
                </p>
                <p className="text-[11px] text-[#78716C]">Transparent client agreement</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Authentic Crafts
                </p>
                <p className="text-[11px] text-[#78716C]">Genuine handcrafted textiles</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Consumer Rights
                </p>
                <p className="text-[11px] text-[#78716C]">Full consumer protection</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <Landmark className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Indian Jurisdiction
                </p>
                <p className="text-[11px] text-[#78716C]">Governed by the laws of India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="py-12 md:py-20">
        <div className="container-lux max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Table of Contents */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-sm border border-[#E7E5E4] bg-white p-6 shadow-sm">
                  <p className="eyebrow text-[#6B1D2F]">Terms Navigation</p>
                  <h3 className="font-display text-xl text-[#1C1917] mt-1 mb-4">
                    Table of Contents
                  </h3>
                  <nav className="space-y-1.5 text-xs max-h-[60vh] overflow-y-auto pr-2">
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
                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 shrink-0" />
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Quick Assistance Box */}
                <div className="rounded-sm border border-[#E7E5E4] bg-[#FAF8F5] p-6 shadow-sm space-y-3">
                  <p className="eyebrow text-[#6B1D2F]">Questions on Terms?</p>
                  <h4 className="font-display text-lg text-[#1C1917]">LaMoksh Support</h4>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    Need clarity on orders, bespoke fitting terms, or payment processing?
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E]"
                  >
                    <span>Send Inquiry</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Right Column: Policy Document Sections */}
            <div className="lg:col-span-8 space-y-10">
              {/* Introduction Note */}
              <div className="rounded-sm border border-[#E7E5E4] bg-white p-6 sm:p-8 shadow-sm text-sm text-[#57534E] leading-relaxed">
                <p>
                  Welcome to <strong className="text-[#1C1917]">Lamoksh Fabrics</strong>. These
                  Terms of Service govern your access to and use of our website,{" "}
                  <a
                    href="https://lamokshfabric.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#6B1D2F] underline underline-offset-4"
                  >
                    https://lamokshfabric.com/
                  </a>
                  , including browsing our collections, purchasing products, and using the services
                  available through the website.
                </p>
                <p className="mt-3 font-medium text-[#1C1917]">
                  By accessing our website or placing an order, you agree to these Terms of Service.
                  If you do not agree with these terms, please discontinue using the website.
                </p>
              </div>

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

                        {sec.callout && (
                          <div
                            className={
                              sec.callout.type === "warning"
                                ? "mt-4 rounded-sm border border-amber-300 bg-amber-50/60 p-4 text-xs sm:text-sm text-amber-900 leading-relaxed font-medium"
                                : "mt-4 rounded-sm border border-[#6B1D2F]/20 bg-[#FAF9F6] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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

                        {/* Special Details Card for Section 16 (Contact Information) */}
                        {sec.id === "contact-information" && (
                          <div className="mt-6 rounded-sm border border-[#E7E5E4] bg-[#FAF8F5] p-6 space-y-3">
                            <h4 className="font-sans font-semibold text-xs uppercase tracking-widest text-[#6B1D2F]">
                              Official Contact Details
                            </h4>
                            <div className="grid gap-2 text-xs sm:text-sm text-[#1C1917]">
                              <div>
                                <span className="font-semibold">Business Name: </span>
                                <span>Lamoksh Fabrics</span>
                              </div>
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
                                <span className="font-semibold">Contact Numbers: </span>
                                <a
                                  href="tel:+919999875605"
                                  className="text-[#6B1D2F] hover:underline"
                                >
                                  +91 9999875605
                                </a>{" "}
                                /{" "}
                                <a
                                  href="tel:+918882510158"
                                  className="text-[#6B1D2F] hover:underline"
                                >
                                  +91 8882510158
                                </a>
                              </div>
                              <div>
                                <span className="font-semibold">Working Days: </span>
                                <span>Wednesday to Monday</span>
                              </div>
                              <div>
                                <span className="font-semibold">Working Hours: </span>
                                <span>8:00 AM to 10:00 PM</span>
                              </div>
                              <div>
                                <span className="font-semibold">Location: </span>
                                <span>
                                  LG 3, LG 4 & LG 8, HRC Shopping Complex, Vaibhav Khand,
                                  Indirapuram, Ghaziabad, Uttar Pradesh 201014
                                </span>
                              </div>
                            </div>
                            <div className="pt-3">
                              <Link
                                to="/contact"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E]"
                              >
                                <span>Contact LaMoksh Support</span>
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
                  <h3 className="font-display text-2xl text-white">
                    Need further assistance or styling advice?
                  </h3>
                  <p className="body-lux text-sm text-white/85 mt-2 max-w-xl">
                    We appreciate your interest in Lamoksh Fabrics and thank you for shopping with
                    us. Our team is always available to assist.
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
