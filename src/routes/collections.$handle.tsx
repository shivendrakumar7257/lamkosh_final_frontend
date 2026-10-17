import { createFileRoute, notFound } from "@tanstack/react-router";
import { CollectionView } from "@/components/site/CollectionView";
import { getCollection, productsIn } from "@/data/catalog";

export const Route = createFileRoute("/collections/$handle")({
  loader: ({ params }) => {
    const collection = getCollection(params.handle);
    if (!collection) throw notFound();
    return { collection };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData?.collection) {
      return {
        meta: [
          { title: "Collection unavailable — LaMoksh Fabrics" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const c = loaderData.collection;
    return {
      meta: [
        { title: `${c.title} — LaMoksh Fabrics` },
        { name: "description", content: c.description },
        { property: "og:title", content: `${c.editorialTitle} — LaMoksh Fabrics` },
        { property: "og:description", content: c.description },
        { property: "og:url", content: `/collections/${params.handle}` },
      ],
      links: [{ rel: "canonical", href: `/collections/${params.handle}` }],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { collection } = Route.useLoaderData();
  return (
    <CollectionView
      eyebrow="Collection"
      title={collection.editorialTitle}
      description={collection.description}
      items={productsIn(collection.handle)}
      crumb={{ label: "Clothing", to: "/clothing" }}
    />
  );
}
