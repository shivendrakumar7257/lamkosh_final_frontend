import { createFileRoute } from "@tanstack/react-router";
import { ClothingHomePage } from "@/components/site/ClothingHomePage";
import { z } from "zod";

const clothingSearchSchema = z.object({
  categoryId: z.string().optional(),
});

export const Route = createFileRoute("/clothing")({
  validateSearch: (search: Record<string, unknown>) => clothingSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Clothing — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Handwoven Banarasi and Maheshwari silks, premium cottons, handpainted suit sets and designer formals from LaMoksh Fabrics.",
      },
      { property: "og:title", content: "Clothing — LaMoksh Fabrics" },
      {
        property: "og:description",
        content: "Handwoven silks and cotton suit sets with a contemporary drape.",
      },
      { property: "og:url", content: "/clothing" },
    ],
    links: [{ rel: "canonical", href: "/clothing" }],
  }),
  component: ClothingHomePage,
});
