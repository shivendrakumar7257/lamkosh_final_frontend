import { createFileRoute } from "@tanstack/react-router";
import { CollectionView } from "@/components/site/CollectionView";
import { images, productsIn } from "@/data/catalog";

export const Route = createFileRoute("/bestsellers")({
  head: () => ({
    meta: [
      { title: "Most Loved — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "The LaMoksh Fabrics pieces returned to again and again — bestselling handcrafted suit sets and handwoven clothing.",
      },
      { property: "og:title", content: "Most Loved — LaMoksh Fabrics" },
      { property: "og:description", content: "The pieces our clients return to again and again." },
      { property: "og:url", content: "/bestsellers" },
    ],
    links: [{ rel: "canonical", href: "/bestsellers" }],
  }),
  component: () => (
    <CollectionView
      eyebrow="Most Loved"
      title="Most Loved by LaMoksh"
      description="Quietly, these are the pieces that leave the atelier most often."
      image={images.heroCampaign}
      items={productsIn("bestsellers")}
    />
  ),
});
