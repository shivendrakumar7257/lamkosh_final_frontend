import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { images } from "@/data/catalog";
import {
  PackageCheck,
  MapPin,
  Clock,
  CreditCard,
  Search,
  AlertTriangle,
  HelpCircle,
  Truck,
  Globe2,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — Lamoksh Fabrics" },
      {
        name: "description",
        content:
          "Read Lamoksh Fabrics' Shipping Policy: order processing, delivery timelines across India, tracking, shipping charges, international delivery, and support.",
      },
      { property: "og:title", content: "Shipping Policy — Lamoksh Fabrics" },
      {
        property: "og:description",
        content:
          "Information on how orders are processed, packed, and delivered across India by Lamoksh Fabrics.",
      },
      { property: "og:url", content: "/shipping" },
    ],
    links: [{ rel: "canonical", href: "/shipping" }],
  }),
  component: ShippingPolicyPage,
});

interface PolicySection {
  id: string;
  number: string;
  title: string;
  icon: typeof Truck;
  paragraphs: string[];
  callout?: {
    type: "info" | "action";
    title?: string;
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
    id: "order-processing",
    number: "01",
    title: "Order Processing",
    icon: PackageCheck,
    paragraphs: [
      "Once you place an order successfully, you will receive an order confirmation through the contact details provided during checkout, where applicable.",
      "Orders are processed after payment confirmation and verification of the order details. Processing times may vary depending on product availability, order volume, customisation requirements, and other operational factors.",
      "Orders placed on holidays or during promotional periods may require additional processing time.",
    ],
  },
  {
    id: "shipping-locations",
    number: "02",
    title: "Shipping Locations",
    icon: MapPin,
    paragraphs: [
      "Lamoksh Fabrics aims to deliver its products to customers across India, subject to service availability at the delivery address.",
      "Please ensure that your shipping address, PIN code, contact number, and other required details are accurate and complete when placing your order.",
      "For locations where delivery is unavailable, our team may contact you to discuss the available options.",
    ],
  },
  {
    id: "delivery-timelines",
    number: "03",
    title: "Shipping and Delivery Timelines",
    icon: Clock,
    paragraphs: [
      "Delivery timelines depend on the destination, courier service availability, product availability, and order processing requirements.",
      "Estimated delivery information, where available, will be communicated during checkout or through order updates.",
      "Please note that delivery estimates are indicative and may be affected by circumstances beyond our control, including weather conditions, transportation disruptions, public holidays, and courier delays.",
      "For customised products or orders requiring additional preparation, processing and delivery may take longer.",
    ],
  },
  {
    id: "shipping-charges",
    number: "04",
    title: "Shipping Charges",
    icon: CreditCard,
    paragraphs: [
      "Applicable shipping charges, if any, will be displayed during checkout before you complete your purchase.",
      "Shipping charges may vary depending on the delivery location, order details, package size, weight, or applicable promotional offers.",
      "Any shipping offer or free-shipping benefit will be subject to the terms specified at the time of purchase.",
    ],
  },
  {
    id: "order-tracking",
    number: "05",
    title: "Order Tracking",
    icon: Search,
    paragraphs: [
      "Once your order has been dispatched, tracking information may be shared through your registered email address, mobile number, or other available communication channels.",
      "You can use the tracking details provided to check the shipment status. Tracking updates may take some time to appear after dispatch.",
      "If you experience difficulty tracking your order, please contact Lamoksh Fabrics with your order number for assistance.",
    ],
    callout: {
      type: "action",
      text: "Have your tracking token or order ID ready? Check live status now.",
      link: {
        label: "Track Order Online",
        to: "/track-order",
      },
    },
  },
  {
    id: "failed-delivery",
    number: "06",
    title: "Incorrect Address or Failed Delivery",
    icon: AlertTriangle,
    paragraphs: [
      "Customers are responsible for providing accurate and complete delivery information at checkout.",
      "If a shipment cannot be delivered because of an incorrect address, incomplete details, an unavailable recipient, or repeated failed delivery attempts, the courier may return the package to us.",
      "Any additional shipping charges or arrangements for re-delivery will be handled in accordance with our applicable policies and communicated to the customer, where appropriate.",
      "If you need to correct your address after placing an order, contact us as soon as possible. Address changes cannot be guaranteed once an order has been processed or dispatched.",
    ],
  },
  {
    id: "delayed-orders",
    number: "07",
    title: "Delayed or Undelivered Orders",
    icon: HelpCircle,
    paragraphs: [
      "Although we make reasonable efforts to ensure timely delivery, occasional delays may occur due to courier operations, weather conditions, logistical issues, public holidays, or other unforeseen circumstances.",
      "If your order has not arrived within the estimated delivery period, please contact our customer support team with your order details. We will assist you in checking the shipment status and determining the next steps.",
    ],
  },
  {
    id: "damaged-products",
    number: "08",
    title: "Damaged, Missing, or Incorrect Products",
    icon: ShieldCheck,
    paragraphs: [
      "Please inspect your package and products upon delivery.",
      "If you receive a damaged, defective, incomplete, or incorrect product, contact us as soon as possible and provide your order number, a description of the issue, and relevant photographs or other supporting information.",
      "We will review your concern and assist in accordance with our applicable return, replacement, or refund policy.",
    ],
    callout: {
      type: "action",
      text: "Need to review return eligibility and conditions?",
      link: {
        label: "View Returns & Exchange Policy",
        to: "/returns",
      },
    },
  },
  {
    id: "international-shipping",
    number: "09",
    title: "International Shipping",
    icon: Globe2,
    paragraphs: [
      "International shipping availability, if offered, will depend on the destination country and the shipping options available at the time of purchase.",
      "Any applicable international shipping charges, customs duties, import taxes, or other destination-related fees will be communicated where applicable. Customers may be responsible for duties and taxes imposed by the destination country, subject to applicable law and the terms communicated at checkout.",
      "Please contact us before placing an international order to confirm availability and applicable charges.",
    ],
  },
  {
    id: "contact-us",
    number: "10",
    title: "Contact Us",
    icon: Mail,
    paragraphs: [
      "If you have questions regarding shipping, delivery, or your order, please contact Lamoksh Fabrics through the contact information or enquiry form available on our website.",
      "Website: https://lamokshfabric.com/",
      "We appreciate your trust in Lamoksh Fabrics and thank you for shopping with us.",
    ],
    callout: {
      type: "action",
      text: "Reach our client care desk for personal assistance.",
      link: {
        label: "Open Contact Form",
        to: "/contact",
      },
    },
  },
];

function ShippingPolicyPage() {
  return (
    <div className="bg-[#FAF9F6]/40 min-h-screen">
      {/* Hero Banner */}
      <section className="relative flex min-h-[360px] items-center overflow-hidden border-b border-border md:min-h-[420px] lg:h-[46vh] lg:max-h-[500px]">
        <img
          src={images.heroCampaign}
          alt="Lamoksh Fabrics Shipping Policy"
          className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-[#4A101E]/80 backdrop-brightness-90" />
        <div className="container-lux relative z-10 py-16 text-white">
          <Reveal>
            <nav className="flex gap-2 text-xs text-white/80">
              <Link to="/" className="hover:text-white hover:underline">
                Home
              </Link>
              <span>/</span>
              <span className="font-medium text-white">Shipping Policy</span>
            </nav>
            <p className="eyebrow mt-6 text-white/85">Client Care & Logistics</p>
            <h1 className="display-lg mt-3 text-white">Shipping Policy</h1>
            <p className="body-lux mt-4 max-w-2xl text-white/90 text-sm sm:text-base leading-relaxed">
              At Lamoksh Fabrics, we strive to ensure that your shopping experience is smooth,
              convenient, and satisfying. This Shipping Policy explains how orders are processed,
              shipped, and delivered when you purchase products through our website.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Trust & Policy Highlights */}
      <section className="border-b border-[#E7E5E4] bg-white py-8">
        <div className="container-lux">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 md:gap-8">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <PackageCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Careful Processing
                </p>
                <p className="text-[11px] text-[#78716C]">Quality check on every piece</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Pan-India Delivery
                </p>
                <p className="text-[11px] text-[#78716C]">Accessible across India</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <Search className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Order Tracking
                </p>
                <p className="text-[11px] text-[#78716C]">SMS & Email dispatch details</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Insured Transit
                </p>
                <p className="text-[11px] text-[#78716C]">Trusted courier partners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="py-12 md:py-20">
        <div className="container-lux max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Quick Navigation Index */}
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

                {/* Quick Track Order Card */}
                <div className="rounded-sm border border-[#E7E5E4] bg-[#FAF8F5] p-6 shadow-sm">
                  <p className="eyebrow text-[#6B1D2F]">Need Live Tracking?</p>
                  <h4 className="font-display text-lg text-[#1C1917] mt-1">Track Your Order</h4>
                  <p className="text-xs text-[#57534E] mt-2 leading-relaxed">
                    Check the current delivery progress of your parcel with your order tracking
                    reference.
                  </p>
                  <Link
                    to="/track-order"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E]"
                  >
                    <span>Go to Live Tracking</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Support Helpline Card */}
                <div className="rounded-sm border border-[#E7E5E4] bg-white p-6 shadow-sm space-y-3">
                  <p className="eyebrow text-[#6B1D2F]">Client Assistance</p>
                  <p className="text-xs text-[#57534E]">
                    Have questions about an upcoming dispatch or address update?
                  </p>
                  <div className="pt-1 space-y-2 text-xs">
                    <a
                      href="tel:+919999875605"
                      className="flex items-center gap-2 text-[#1C1917] hover:text-[#6B1D2F]"
                    >
                      <Phone className="h-3.5 w-3.5 text-[#6B1D2F]" />
                      <span className="font-semibold">+91 99998 75605 / 88825 10158</span>
                    </a>
                    <a
                      href="mailto:fabricslamoksh@gmail.com"
                      className="flex items-center gap-2 text-[#1C1917] hover:text-[#6B1D2F]"
                    >
                      <Mail className="h-3.5 w-3.5 text-[#6B1D2F]" />
                      <span>fabricslamoksh@gmail.com</span>
                    </a>
                    <div className="flex items-center gap-2 text-stone-600 pt-0.5">
                      <Clock className="h-3.5 w-3.5 text-[#6B1D2F]" />
                      <span>Wed–Mon: 8:00 AM – 10:00 PM</span>
                    </div>
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
                        {sec.paragraphs.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}

                        {sec.callout && (
                          <div className="mt-4 rounded-sm border border-[#6B1D2F]/20 bg-[#FAF9F6] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <p className="text-xs sm:text-sm text-[#1C1917] font-medium">
                              {sec.callout.text}
                            </p>
                            {sec.callout.link?.to ? (
                              <Link
                                to={sec.callout.link.to}
                                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E]"
                              >
                                <span>{sec.callout.link.label}</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </section>
                  </Reveal>
                );
              })}

              {/* Bottom Gratitude & Help Box */}
              <div className="rounded-sm border border-[#6B1D2F]/20 bg-[#6B1D2F] p-8 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-sm">
                <div>
                  <h3 className="font-display text-2xl text-white">Questions about your order?</h3>
                  <p className="body-lux text-sm text-white/85 mt-2 max-w-xl">
                    We appreciate your trust in Lamoksh Fabrics and thank you for shopping with us.
                    Our team is happy to assist you at every step of your journey.
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
                    to="/track-order"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider border border-white/40 text-white hover:bg-white/10 transition-colors"
                  >
                    <span>Track Order</span>
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
