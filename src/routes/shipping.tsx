import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/site/PageHeader";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Complimentary insured shipping across India, worldwide delivery on request, and made-to-order timelines.",
      },
      { property: "og:title", content: "Shipping — LaMoksh Fabrics" },
      {
        property: "og:description",
        content: "Delivery timelines, insurance and international shipping.",
      },
      { property: "og:url", content: "/shipping" },
    ],
    links: [{ rel: "canonical", href: "/shipping" }],
  }),
  component: () => (
    <div>
      <PageHeader
        eyebrow="Client Care"
        title="Shipping"
        intro="Every parcel leaves the atelier insured and signature-required."
      />
      <Prose
        sections={[
          {
            heading: "Within India",
            body: [
              "Complimentary insured shipping on all orders, dispatched by trusted courier with signature on delivery.",
              "Ready pieces dispatch within two working days. Made-to-order jewellery takes four to six weeks; handwoven clothing six to eight.",
            ],
          },
          {
            heading: "International",
            body: [
              "We ship worldwide on request with full insurance and tracking. Delivery typically takes seven to twelve working days after dispatch.",
              "Import duties and local taxes are payable by the recipient and are not included at checkout.",
            ],
          },
          {
            heading: "Tracking",
            body: [
              "A tracking reference is emailed at dispatch. You can also follow your order from the Track Order page.",
            ],
          },
        ]}
      />
    </div>
  ),
});
