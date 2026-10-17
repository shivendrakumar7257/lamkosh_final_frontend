import { createFileRoute } from "@tanstack/react-router";
import { ClothingHomePage } from "@/components/site/ClothingHomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LaMoksh Fabrics — Handcrafted Luxury Clothing" },
      {
        name: "description",
        content:
          "A contemporary Indian luxury house of handwoven clothing. Banarasi sarees, Maheshwari silks, handpaint suit sets and wedding edits.",
      },
      { property: "og:title", content: "LaMoksh Fabrics — Handcrafted Luxury Clothing" },
      {
        property: "og:description",
        content:
          "Handwoven clothing and handcrafted textiles, made in small numbers for the occasions you remember.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: ClothingHomePage,
});
