import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import subcategoryBannerBg from "@/assets/subcategory-banner-bg.png";
import { Reveal } from "@/components/site/Reveal";
import { images } from "@/data/catalog";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Appointments — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Speak with the LaMoksh Fabrics client care team, request a styling appointment, or visit the atelier.",
      },
      { property: "og:title", content: "Contact & Appointments — LaMoksh Fabrics" },
      { property: "og:description", content: "Client care, appointments and atelier visits." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div>
      {/* Full-Bleed Atelier Hero Banner */}
      <section className="relative flex min-h-[420px] items-center overflow-hidden border-b border-border md:min-h-[480px] lg:h-[55vh] lg:max-h-[600px]">
        <img
          src={images.brandStory}
          alt="LaMoksh Fabrics Atelier — Contact & Styling Appointments"
          className="absolute inset-0 h-full w-full object-cover object-top md:object-[center_15%]"
        />
        <div className="absolute inset-0 bg-espresso/45 backdrop-brightness-90" />
        <div className="container-lux relative z-10 py-16 text-ivory">
          <Reveal>
            <nav className="flex gap-2 text-xs text-ivory/80">
              <Link to="/" className="hover:text-ivory hover:underline">
                Home
              </Link>
              <span>/</span>
              <span className="font-medium text-ivory">Contact</span>
            </nav>
            <p className="eyebrow mt-6 text-ivory/80">Client Care & Styling</p>
            <h1 className="display-lg mt-3 text-ivory">Contact the Atelier</h1>
            <p className="body-lux mt-4 max-w-xl text-ivory/90">
              We answer every message personally, usually within one working day. Speak with our
              team, request bespoke fitting, or schedule a styling appointment.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Luxury Contact Form & Details Section */}
      <section className="relative overflow-hidden border-b border-[#E7E5E4] bg-white">
        {/* Fine Textile Weave Texture & Soft Shadow Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1C1917_0.3px,transparent_0.3px)] [background-size:24px_24px] opacity-10" />

        {/* Soft Luxury Textile Watermark Background on Right */}
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 hidden w-1/2 overflow-hidden opacity-[0.06] grayscale filter md:block">
          <img
            src={subcategoryBannerBg}
            alt=""
            className="h-full w-full object-cover object-right"
          />
        </div>

        <div className="container-lux relative z-10 max-w-6xl py-16 md:py-24">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            {/* Left Column: Reach Us Details & Map */}
            <div className="md:col-span-5 md:border-r md:border-[#28201C]/12 md:pr-12 lg:pr-16">
              <Reveal>
                <div>
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#28201C]/60">
                    GET IN TOUCH
                  </span>
                  <h2 className="mt-1 font-serif text-3xl font-normal tracking-wide text-[#28201C] md:text-4xl">
                    Reach us
                  </h2>
                  <div className="mt-3 h-[1px] w-12 bg-[#28201C]/30" />
                </div>

                <dl className="mt-8 space-y-7 text-sm">
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#28201C]/60">
                      Email
                    </dt>
                    <dd className="mt-1 font-sans text-sm font-medium text-[#28201C]/85">
                      care@lamoksh.in
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#28201C]/60">
                      Telephone / WhatsApp
                    </dt>
                    <dd className="mt-1 font-sans text-sm font-medium text-[#28201C]/85">
                      +91 99998 75605 · Mon–Sat, 10am–7pm IST
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#28201C]/60">
                      Atelier & Store Location
                    </dt>
                    <dd className="mt-1 font-sans text-sm font-medium leading-relaxed text-[#28201C]/85">
                      LaMoksh Fabrics, LG 3, LG 4 & LG 8, HRC Shopping Complex, Vaibhav Khand,
                      Indirapuram, Ghaziabad, Uttar Pradesh 201014
                    </dd>

                    {/* Google Map Frame */}
                    <div className="mt-4 overflow-hidden border border-[#28201C]/15 shadow-sm">
                      <iframe
                        title="LaMoksh Fabrics Store Location Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.767597116817!2d77.3652369!3d28.6353727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5304f12a6d1%3A0x1c0781d15c6d853f!2sLamoksh%20Fabrics!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                        width="100%"
                        height="220"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full border-0"
                      />
                    </div>

                    <div className="mt-3">
                      <a
                        href="https://www.google.com/maps/dir//Lamoksh+Fabrics,+LG+3+LG4+LG8,+HRC+Shopping+Complex,+Vaibhav+Khand,+Indirapuram,+Ghaziabad,+Uttar+Pradesh+201014/@28.6346957,77.4587233,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x390ce5304f12a6d1:0x1c0781d15c6d853f!2m2!1d77.3652369!2d28.6353727"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#28201C] underline underline-offset-4 hover:opacity-75"
                      >
                        Get Directions &rarr;
                      </a>
                    </div>
                  </div>
                </dl>
              </Reveal>
            </div>

            {/* Right Column: Contact Form */}
            <div className="md:col-span-7">
              <Reveal>
                <div>
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#28201C]/60">
                    INQUIRIES & BESPOKE FITTING
                  </span>
                  <h2 className="mt-1 font-serif text-3xl font-normal tracking-wide text-[#28201C] md:text-4xl">
                    Send a Message
                  </h2>
                  <div className="mt-3 h-[1px] w-12 bg-[#28201C]/30" />
                </div>

                <form
                  className="mt-8 grid gap-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <Field label="Name" name="name" />
                  <Field label="Email" name="email" type="email" />
                  <Field label="Subject" name="subject" />
                  <label className="grid gap-2">
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#28201C]/70">
                      Message
                    </span>
                    <textarea
                      required
                      rows={5}
                      name="message"
                      placeholder="Tell us about your bespoke fitting or inquiry..."
                      className="border-b border-[#28201C]/25 bg-transparent py-2 text-sm text-[#28201C] outline-none transition-colors placeholder:text-[#28201C]/40 focus:border-[#28201C]"
                    />
                  </label>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="btn-lux bg-[#28201C] px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-[#FAF8F5] transition-colors hover:bg-[#3d322c]"
                    >
                      {sent ? "Message received" : "Send message"}
                    </button>
                  </div>

                  {sent ? (
                    <p className="pt-2 text-sm font-medium text-[#28201C]/80">
                      Thank you — our client care team will be in touch shortly.
                    </p>
                  ) : null}
                </form>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#28201C]/70">
        {label}
      </span>
      <input
        required
        type={type}
        name={name}
        className="border-b border-[#28201C]/25 bg-transparent py-2 text-sm text-[#28201C] outline-none transition-colors placeholder:text-[#28201C]/40 focus:border-[#28201C]"
      />
    </label>
  );
}
