import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/site/PageHeader";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "The terms under which LaMoksh Fabrics sells handcrafted suit sets and handwoven clothing.",
      },
      { property: "og:title", content: "Terms of Service — LaMoksh Fabrics" },
      { property: "og:description", content: "Orders, pricing, craft variation and liability." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <div>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        intro="Plain terms for a handmade house."
      />
      <Prose
        sections={[
          {
            heading: "Orders and pricing",
            body: [
              "All prices are in Indian Rupees and inclusive of applicable GST. An order is confirmed once payment is received and acknowledged by email.",
            ],
          },
          {
            heading: "Handcraft variation",
            body: [
              "Because each piece is made by hand, slight variation in colour, weave and stone is inherent and is not considered a defect.",
            ],
          },
          {
            heading: "Liability",
            body: [
              "Our liability in respect of any order is limited to the value of that order. These terms are governed by the laws of India.",
            ],
          },
        ]}
      />
    </div>
  ),
});
