import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Answers on made-to-order timelines, sizing, materials, shipping, returns and care at LaMoksh Fabrics.",
      },
      { property: "og:title", content: "FAQ — LaMoksh Fabrics" },
      { property: "og:description", content: "Orders, sizing, shipping, returns and care." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

const faqs = [
  {
    q: "How long does a made-to-order piece take?",
    a: "Most handcrafted suit sets are finished in two to four weeks. Handwoven clothing can take four to six weeks depending on the loom.",
  },
  {
    q: "Are the fabrics authentic?",
    a: "Every listing states its materials plainly — pure Banarasi silks, Maheshwari silk-cottons, fine-count cottons, and handblock printed fabrics.",
  },
  {
    q: "Can a piece be customised?",
    a: "Yes. Kurta length, sleeve length, drape and sizing can usually be adjusted. Write to care@lamoksh.in with the piece you have in mind.",
  },
  {
    q: "Do you ship internationally?",
    a: "We do, on request, fully insured. Duties and taxes at the destination are the client's responsibility.",
  },
  {
    q: "What is your returns policy?",
    a: "Unworn pieces may be returned within seven days of delivery. Customised and made-to-measure pieces are final sale.",
  },
  {
    q: "How should I care for my jewellery?",
    a: "Keep it away from perfume and water, store it in the pouch provided, and send it to us for cleaning or restringing whenever it needs attention.",
  },
];

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <PageHeader
        eyebrow="Client Care"
        title="Frequently Asked"
        intro="If your question is not answered here, write to us — we reply personally."
      />
      <div className="container-lux max-w-3xl py-16">
        <dl className="border-t border-border">
          {faqs.map((f, i) => (
            <div key={f.q} className="border-b border-border">
              <dt>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-lg"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {f.q}
                  <span className="text-muted-foreground">{open === i ? "−" : "+"}</span>
                </button>
              </dt>
              {open === i ? <dd className="body-lux pb-6 text-sm">{f.a}</dd> : null}
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
