import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { images } from "@/data/catalog";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  EyeOff,
  FileText,
  Cookie,
  Server,
  KeyRound,
  AlertCircle,
  HelpCircle,
  Mail,
  Phone,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Lamoksh Fabrics" },
      {
        name: "description",
        content:
          "Read Lamoksh Fabrics' Privacy Policy: how we collect, use, store, and protect your personal information, cookies, payment security, and privacy rights.",
      },
      { property: "og:title", content: "Privacy Policy — Lamoksh Fabrics" },
      {
        property: "og:description",
        content:
          "Lamoksh Fabrics values your privacy and is committed to protecting your personal information and online data.",
      },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPolicyPage,
});

interface PrivacySection {
  id: string;
  number: string;
  title: string;
  icon: typeof ShieldCheck;
  subsections?: {
    subtitle?: string;
    paragraphs?: string[];
    bullets?: string[];
  }[];
  paragraphs?: string[];
  bullets?: string[];
  callout?: {
    type: "security" | "info" | "action";
    text: string;
    link?: {
      label: string;
      to?: string;
      href?: string;
    };
  };
}

const SECTIONS: PrivacySection[] = [
  {
    id: "information-we-collect",
    number: "01",
    title: "Information We Collect",
    icon: FileText,
    paragraphs: [
      "We may collect the following categories of information when you interact with our website:",
    ],
    subsections: [
      {
        subtitle: "Personal Information",
        paragraphs: [
          "When you place an order, submit an enquiry, or contact us, we may collect:",
        ],
        bullets: [
          "Full name",
          "Mobile number and email address",
          "Billing and shipping address",
          "Order details and purchase history",
          "Information you provide when contacting customer support",
        ],
      },
      {
        subtitle: "Payment Information",
        paragraphs: [
          "Payments made through our website may be processed by third-party payment service providers. We may receive transaction references, payment status, and related information necessary to manage your order.",
          "We do not intend to collect or store complete payment card details, banking passwords, or payment authentication credentials on our own systems.",
        ],
      },
      {
        subtitle: "Technical and Usage Information",
        paragraphs: [
          "When you browse our website, certain information may be collected automatically, depending on the website's configuration. This may include your IP address, browser type, device information, pages visited, access times, and website interaction data.",
        ],
      },
      {
        subtitle: "Cookies and Similar Technologies",
        paragraphs: [
          "Our website may use cookies or similar technologies to support essential website functionality, remember preferences, understand website usage, and improve your shopping experience. Third-party analytics or advertising technologies may also be used where configured and permitted by applicable law.",
        ],
      },
    ],
  },
  {
    id: "how-we-use-information",
    number: "02",
    title: "How We Use Your Information",
    icon: UserCheck,
    paragraphs: ["Lamoksh Fabrics may use your information to:"],
    bullets: [
      "Process, confirm, and deliver your orders.",
      "Communicate order confirmations, shipping updates, and delivery information.",
      "Respond to product enquiries and customer support requests.",
      "Process eligible returns, exchanges, cancellations, and refunds.",
      "Improve our website, products, services, and customer experience.",
      "Maintain business, accounting, tax, and transaction records.",
      "Detect, investigate, and prevent fraud, misuse, or unauthorised activity.",
      "Send promotional communications, offers, and updates where permitted by law and, where required, with your consent.",
      "Comply with applicable legal and regulatory obligations.",
    ],
  },
  {
    id: "how-we-share-information",
    number: "03",
    title: "How We Share Your Information",
    icon: EyeOff,
    paragraphs: [
      "We do not sell your personal information to third parties.",
      "We may share relevant information with trusted third parties when necessary to operate our business, including:",
    ],
    bullets: [
      "Delivery and logistics partners: To ship and deliver your orders.",
      "Payment service providers: To process payments and refunds securely.",
      "Website hosting and technology providers: To maintain website functionality, security, and performance.",
      "Analytics and marketing providers: To understand website usage and support marketing activities, where applicable.",
      "Professional advisers and authorities: Where necessary for legitimate business purposes or to comply with legal obligations.",
    ],
    subsections: [
      {
        paragraphs: [
          "These parties may process information according to their respective privacy practices, contractual obligations, and applicable laws.",
        ],
      },
    ],
  },
  {
    id: "payment-security",
    number: "04",
    title: "Payment Security",
    icon: Lock,
    paragraphs: [
      "We take reasonable steps to support secure transactions on our website. Online payments, where available, may be handled by third-party payment gateways using their security procedures.",
    ],
    callout: {
      type: "security",
      text: "Important Security Advisory: Customers should never share their passwords, OTPs, card PINs, or banking authentication credentials with anyone claiming to represent Lamoksh Fabrics.",
    },
  },
  {
    id: "cookies-analytics",
    number: "05",
    title: "Cookies and Website Analytics",
    icon: Cookie,
    paragraphs: [
      "Cookies help websites function effectively and may be used to remember user preferences and understand browsing activity.",
      "You may be able to manage or disable cookies through your browser settings. However, disabling certain cookies may affect some website features or functionality.",
      "Where required, non-essential cookies and tracking technologies will be used in accordance with applicable consent requirements.",
    ],
  },
  {
    id: "data-retention",
    number: "06",
    title: "Data Retention",
    icon: Server,
    paragraphs: [
      "We retain personal information only for as long as reasonably necessary to fulfil the purposes described in this policy, including order fulfilment, customer support, dispute resolution, accounting, tax compliance, and other legal obligations.",
      "When information is no longer required, we will take reasonable steps to delete it or anonymise it, subject to applicable law and legitimate record-retention requirements.",
    ],
  },
  {
    id: "data-security",
    number: "07",
    title: "Data Security",
    icon: KeyRound,
    paragraphs: [
      "We take reasonable technical and organisational measures to protect personal information against unauthorised access, disclosure, alteration, loss, or misuse.",
      "However, no method of electronic transmission or data storage can be guaranteed to be completely secure. We encourage customers to use secure devices and protect their account and contact information.",
    ],
  },
  {
    id: "privacy-rights",
    number: "08",
    title: "Your Privacy Rights",
    icon: ShieldCheck,
    paragraphs: ["Subject to applicable law, you may have the right to:"],
    bullets: [
      "Request access to personal information we hold about you.",
      "Request correction of inaccurate or incomplete information.",
      "Request deletion of personal information where legally permissible.",
      "Withdraw consent where processing is based on consent.",
      "Opt out of promotional communications.",
      "Raise a concern or complaint regarding how your information is handled.",
    ],
    subsections: [
      {
        paragraphs: [
          "To exercise these rights, please contact us using the details provided below. We may need to verify your identity before processing a request.",
          "Certain information may need to be retained where required by law or necessary to establish, exercise, or defend legal claims.",
        ],
      },
    ],
    callout: {
      type: "action",
      text: "Wish to update your profile or request data details?",
      link: {
        label: "Contact Client Care",
        to: "/contact",
      },
    },
  },
  {
    id: "third-party-services",
    number: "09",
    title: "Third-Party Websites and Services",
    icon: ArrowRight,
    paragraphs: [
      "Our website may contain links to third-party websites, payment services, social media platforms, or other external services.",
      "Lamoksh Fabrics does not control the privacy practices of these external services. We encourage you to review their respective privacy policies before sharing personal information with them.",
    ],
  },
  {
    id: "childrens-privacy",
    number: "10",
    title: "Children's Privacy",
    icon: AlertCircle,
    paragraphs: [
      "Our website is intended for general shopping use and is not specifically directed at children. We do not knowingly collect children's personal information in circumstances where parental consent or other safeguards are legally required.",
      "If you believe that a child has provided personal information to us inappropriately, please contact us so that we can review the matter and take appropriate action.",
    ],
  },
  {
    id: "policy-changes",
    number: "11",
    title: "Changes to This Privacy Policy",
    icon: Clock,
    paragraphs: [
      "We may update this Privacy Policy from time to time to reflect changes in our business practices, website functionality, technology, or applicable laws.",
      "Any revised policy will be published on this page with an updated effective date. We encourage you to review this page periodically.",
    ],
  },
  {
    id: "contact-us",
    number: "12",
    title: "Contact Us",
    icon: Mail,
    paragraphs: [
      "If you have any questions, concerns, or requests relating to this Privacy Policy or your personal information, please contact us using the details below:",
      "We will review privacy-related enquiries and respond as appropriate under applicable law.",
      "Thank you for trusting Lamoksh Fabrics. We are committed to treating your personal information responsibly and providing a secure and reliable shopping experience.",
    ],
  },
];

function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF9F6]/40 min-h-screen">
      {/* Hero Banner */}
      <section className="relative flex min-h-[360px] items-center overflow-hidden border-b border-border md:min-h-[420px] lg:h-[46vh] lg:max-h-[500px]">
        <img
          src={images.brandStory}
          alt="Lamoksh Fabrics Privacy Policy"
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
              <span className="font-medium text-white">Privacy Policy</span>
            </nav>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="eyebrow text-white/85">Client Trust & Data Protection</span>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-mono font-medium text-white">
                Effective: 19 October 2026
              </span>
            </div>
            <h1 className="display-lg mt-3 text-white">Privacy Policy</h1>
            <p className="body-lux mt-4 max-w-2xl text-white/90 text-sm sm:text-base leading-relaxed">
              At Lamoksh Fabrics, accessible at https://lamokshfabric.com/, we value your privacy
              and are committed to protecting your personal information. This Privacy Policy
              explains how we collect, use, store, and protect your information.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Trust & Privacy Pillars */}
      <section className="border-b border-[#E7E5E4] bg-white py-8">
        <div className="container-lux">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 md:gap-8">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <EyeOff className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  No Data Selling
                </p>
                <p className="text-[11px] text-[#78716C]">We never sell your details</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Payment Security
                </p>
                <p className="text-[11px] text-[#78716C]">Encrypted gateway transactions</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Your Rights
                </p>
                <p className="text-[11px] text-[#78716C]">Access, correct or delete data</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Strict Protection
                </p>
                <p className="text-[11px] text-[#78716C]">Technical & organisational care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Policy Content */}
      <main className="py-12 md:py-20">
        <div className="container-lux max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Sticky Index & Assistance */}
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

                {/* Privacy Officers Card */}
                <div className="rounded-sm border border-[#E7E5E4] bg-[#FAF8F5] p-6 shadow-sm space-y-3">
                  <p className="eyebrow text-[#6B1D2F]">Privacy Inquiries</p>
                  <h4 className="font-display text-lg text-[#1C1917]">Contact Our Team</h4>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    Have questions about your data or want to request information? Write directly
                    to our client care desk.
                  </p>
                  <a
                    href="mailto:fabricslamoksh@gmail.com"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E]"
                  >
                    <span>fabricslamoksh@gmail.com</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </aside>

            {/* Right Column: Policy Document Sections */}
            <div className="lg:col-span-8 space-y-10">
              {/* Introduction Note */}
              <div className="rounded-sm border border-[#E7E5E4] bg-white p-6 sm:p-8 shadow-sm text-sm text-[#57534E] leading-relaxed">
                <p>
                  At <strong className="text-[#1C1917]">Lamoksh Fabrics</strong>, accessible at{" "}
                  <a
                    href="https://lamokshfabric.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#6B1D2F] underline underline-offset-4"
                  >
                    https://lamokshfabric.com/
                  </a>
                  , we value your privacy and are committed to protecting your personal information.
                  This Privacy Policy explains how we collect, use, store, and protect your
                  information when you visit our website, make a purchase, contact us, or use our
                  services.
                </p>
                <p className="mt-3 font-medium text-[#1C1917]">
                  By accessing our website or placing an order, you acknowledge that you have read
                  this Privacy Policy.
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

                        {sec.subsections?.map((sub, sidx) => (
                          <div
                            key={sidx}
                            className="pt-4 border-t border-[#E7E5E4]/60 first:border-0 first:pt-0"
                          >
                            {sub.subtitle && (
                              <h3 className="font-sans font-semibold text-sm uppercase tracking-wider text-[#1C1917] mb-2">
                                {sub.subtitle}
                              </h3>
                            )}
                            {sub.paragraphs?.map((p, pidx) => (
                              <p key={pidx} className="mt-2 text-[#57534E]">
                                {p}
                              </p>
                            ))}
                            {sub.bullets && (
                              <ul className="mt-2 space-y-2 list-none">
                                {sub.bullets.map((b, bidx) => (
                                  <li key={bidx} className="flex items-start gap-2.5">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#6B1D2F] shrink-0" />
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}

                        {sec.callout && (
                          <div
                            className={
                              sec.callout.type === "security"
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

                        {/* Special Details Card for Section 12 (Contact Us) */}
                        {sec.id === "contact-us" && (
                          <div className="mt-6 rounded-sm border border-[#E7E5E4] bg-[#FAF8F5] p-6 space-y-3">
                            <h4 className="font-sans font-semibold text-xs uppercase tracking-widest text-[#6B1D2F]">
                              Contact Details
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
                            <div className="pt-3 flex gap-3">
                              <Link
                                to="/contact"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:text-[#4A101E]"
                              >
                                <span>Open Client Care Form</span>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
