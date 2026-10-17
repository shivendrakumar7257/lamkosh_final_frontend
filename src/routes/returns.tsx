import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/site/PageHeader";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns & Exchanges — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Seven-day returns on unworn pieces, exchange terms, and how repairs and aftercare work at LaMoksh Fabrics.",
      },
      { property: "og:title", content: "Returns & Exchanges — LaMoksh Fabrics" },
      {
        property: "og:description",
        content: "How to return, exchange or repair a LaMoksh Fabrics piece.",
      },
      { property: "og:url", content: "/returns" },
    ],
    links: [{ rel: "canonical", href: "/returns" }],
  }),
  component: () => (
    <div>
      <PageHeader
        eyebrow="Client Care"
        title="Returns & Exchanges"
        intro="We want each piece to be right. If it is not, we will make it so."
      />
      <Prose
        sections={[
          {
            heading: "Returns",
            body: [
              "Unworn pieces in their original packaging may be returned within seven days of delivery for a full refund.",
              "Customised and made-to-measure pieces are final sale.",
            ],
          },
          {
            heading: "Exchanges",
            body: [
              "Exchanges are offered within fourteen days, subject to availability. Made-to-order replacements follow standard atelier timelines.",
            ],
          },
          {
            heading: "Repairs & aftercare",
            body: [
              "Finishing and repair are offered for the life of every LaMoksh Fabrics piece. Write to care@lamoksh.in to arrange collection.",
            ],
          },
        ]}
      />
    </div>
  ),
});
