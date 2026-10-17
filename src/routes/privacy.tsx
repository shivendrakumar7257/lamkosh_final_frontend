import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/site/PageHeader";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — LaMoksh Fabrics" },
      {
        name: "description",
        content: "How LaMoksh Fabrics collects, uses and protects your personal information.",
      },
      { property: "og:title", content: "Privacy Policy — LaMoksh Fabrics" },
      { property: "og:description", content: "Our approach to your data and privacy." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <div>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        intro="We collect as little as we need, and never sell it."
      />
      <Prose
        sections={[
          {
            heading: "What we collect",
            body: [
              "Contact and delivery details you provide, order history, and basic analytics about how the site is used.",
            ],
          },
          {
            heading: "How we use it",
            body: [
              "To fulfil orders, provide client care, and — only with your consent — to send the LaMoksh Letter. We never sell or rent personal data.",
            ],
          },
          {
            heading: "Your rights",
            body: [
              "You may request a copy, correction or deletion of your data at any time by writing to care@lamoksh.in.",
            ],
          },
        ]}
      />
    </div>
  ),
});
