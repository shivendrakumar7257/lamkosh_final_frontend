import { createFileRoute } from "@tanstack/react-router";
import { CollectionView } from "@/components/site/CollectionView";
import { images, productsIn } from "@/data/catalog";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "The latest handcrafted suit sets and handwoven clothing to leave the LaMoksh Fabrics atelier.",
      },
      { property: "og:title", content: "New Arrivals — LaMoksh Fabrics" },
      {
        property: "og:description",
        content: "Newly finished pieces, added as they leave the atelier.",
      },
      { property: "og:url", content: "/new-arrivals" },
    ],
    links: [{ rel: "canonical", href: "/new-arrivals" }],
  }),
  component: () => (
    <CollectionView
      eyebrow="Just Arrived"
      title="The New Edit"
      description="Pieces added as they are finished. Small runs, rarely repeated."
      image={images.catNew}
      items={productsIn("new-arrivals")}
    />
  ),
});
