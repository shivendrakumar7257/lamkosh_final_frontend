import { createFileRoute } from "@tanstack/react-router";
import { ClothingHomePage } from "@/components/site/ClothingHomePage";
import { z } from "zod";

const shopSearchSchema = z.object({
  categoryId: z.string().optional(),
  sort: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => shopSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Shop Handcrafted Clothing — LaMoksh Fabrics" },
      {
        name: "description",
        content: "Browse our entire catalog of handcrafted silks, linen, and designer silhouettes.",
      },
    ],
  }),
  component: ClothingHomePage,
});

export default Route;
