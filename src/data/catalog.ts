import heroCampaign from "@/assets/hero-campaign.jpg";
import catWedding from "@/assets/cat-wedding.jpg";
import catClothing from "@/assets/cat-clothing.jpg";
import catNew from "@/assets/cat-new.jpg";
import weddingCinematic from "@/assets/wedding-cinematic.jpg";
import brandStory from "@/assets/brand-story.jpg";
import prodBanarasi from "@/assets/prod-banarasi.jpg";
import prodMaheshwari from "@/assets/prod-maheshwari.jpg";
import prodHandpaintStole from "@/assets/prod-handpaint-stole.jpg";
import prodLavenderFloralSet from "@/assets/prod-lavender-floral-set.png";
import prodLavenderFloralSet2 from "@/assets/prod-lavender-floral-set-2.png";
import prodOliveIkatSet from "@/assets/prod-olive-ikat-set.jpg";
import prodOliveIkatSet2 from "@/assets/prod-olive-ikat-set-2.png";
import prodTealIkatSet from "@/assets/prod-teal-ikat-set.png";
import prodTealIkatSet2 from "@/assets/prod-teal-ikat-set-2.png";
import prodLilacChikankariSet from "@/assets/prod-lilac-chikankari-set.png";
import prodLilacChikankariSet2 from "@/assets/prod-lilac-chikankari-set-2.png";
import prodPinkPaisleySet from "@/assets/prod-pink-paisley-set.png";
import prodPinkPaisleySet2 from "@/assets/prod-pink-paisley-set-2.png";
import logo from "@/assets/logo.png";

export const images = {
  logo,
  heroCampaign,
  catWedding,
  catClothing,
  catNew,
  weddingCinematic,
  brandStory,
  prodBanarasi,
  prodMaheshwari,
  prodHandpaintStole,
  prodLavenderFloralSet,
  prodOliveIkatSet,
  prodTealIkatSet,
  prodLilacChikankariSet,
  prodPinkPaisleySet,
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  price: number;
  category: "clothing";
  type: string;
  collections: string[];
  material: string;
  colour: string;
  inStock: boolean;
  images: string[];
  description: string;
  craft: string;
  dimensions: string;
  care: string;
  sizes?: string[];
};

const inr = (n: number) => n;

type Seed = Omit<Product, "id" | "handle" | "images"> & {
  handle: string;
  images: string[];
};

const seeds: Seed[] = [];

export const products: Product[] = seeds.map((s, i) => ({
  ...s,
  id: `mn-${String(i + 1).padStart(3, "0")}`,
}));

export const getProduct = (handle: string) => products.find((p) => p.handle === handle);

export const productsIn = (collection: string) =>
  products.filter((p) => p.collections.includes(collection));

export type Collection = {
  handle: string;
  title: string;
  editorialTitle: string;
  description: string;
  image: string;
  group: "clothing" | "curated" | "wedding";
};

export const collections: Collection[] = [
  // Clothing
  {
    handle: "wedding-exclusive",
    title: "Wedding Exclusive",
    editorialTitle: "Wedding Exclusive",
    description: "Our most worked pieces, reserved for the ceremonies that matter most.",
    image: catWedding,
    group: "clothing",
  },
  {
    handle: "lamoksh-collection",
    title: "LaMoksh Collection",
    editorialTitle: "The LaMoksh Collection",
    description: "The house signature — contemporary drape, Indian hand.",
    image: prodLavenderFloralSet,
    group: "clothing",
  },
  {
    handle: "premium-cottons",
    title: "Premium Cottons",
    editorialTitle: "Premium Cottons",
    description: "Fine-count cottons with structure and breath.",
    image: prodTealIkatSet,
    group: "clothing",
  },
  {
    handle: "cottons",
    title: "Cottons",
    editorialTitle: "Cottons",
    description: "Handloom cottons for the everyday.",
    image: prodOliveIkatSet,
    group: "clothing",
  },
  {
    handle: "handpaint",
    title: "Handpaint",
    editorialTitle: "Handpaint",
    description: "Painted by hand, so no two are the same.",
    image: prodPinkPaisleySet,
    group: "clothing",
  },
  {
    handle: "maheshwari-silk",
    title: "Maheshwari Silk",
    editorialTitle: "Maheshwari Silk",
    description: "Featherlight silk-cotton woven on the banks of the Narmada.",
    image: prodMaheshwari,
    group: "clothing",
  },
  {
    handle: "designer-formals",
    title: "Designer Formals",
    editorialTitle: "Designer Formals",
    description: "Modern tailoring with an Indian sensibility.",
    image: prodLilacChikankariSet,
    group: "clothing",
  },
  {
    handle: "banarasi",
    title: "Banarasi",
    editorialTitle: "Banarasi",
    description: "Zari woven on pit looms in Varanasi.",
    image: prodBanarasi,
    group: "clothing",
  },
  {
    handle: "winter-specials",
    title: "Winter Specials",
    editorialTitle: "Winter Specials",
    description: "Layers for cold mornings and long evenings.",
    image: brandStory,
    group: "clothing",
  },
  {
    handle: "stoles",
    title: "Stoles",
    editorialTitle: "Stoles",
    description: "The finishing layer.",
    image: prodHandpaintStole,
    group: "clothing",
  },

  // Curated
  {
    handle: "new-arrivals",
    title: "New Arrivals",
    editorialTitle: "The New Edit",
    description: "The latest expressions of LaMoksh Fabrics, added as they are crafted.",
    image: prodLavenderFloralSet,
    group: "curated",
  },
  {
    handle: "bestsellers",
    title: "Most Loved",
    editorialTitle: "Most Loved by LaMoksh",
    description: "The pieces returned to again and again.",
    image: prodLilacChikankariSet,
    group: "curated",
  },
  {
    handle: "festive-edit",
    title: "Festive Edit",
    editorialTitle: "The Festive Edit",
    description: "For the season of light, sound and gathering.",
    image: prodTealIkatSet,
    group: "curated",
  },
  {
    handle: "occasion-wear",
    title: "Occasion Wear",
    editorialTitle: "Occasion Wear",
    description: "Dressing for the days that are marked in the calendar.",
    image: prodPinkPaisleySet,
    group: "curated",
  },

  // Wedding occasions
  {
    handle: "wedding-edit",
    title: "Wedding Edit",
    editorialTitle: "The Wedding Edit",
    description: "Designed for every celebration surrounding the big day.",
    image: catWedding,
    group: "wedding",
  },
  {
    handle: "bridal",
    title: "Bridal",
    editorialTitle: "Bridal",
    description: "For the bride, and the day she is the centre of.",
    image: catWedding,
    group: "wedding",
  },
  {
    handle: "haldi",
    title: "Haldi",
    editorialTitle: "Haldi",
    description: "Morning light, turmeric and marigold.",
    image: weddingCinematic,
    group: "wedding",
  },
  {
    handle: "mehendi",
    title: "Mehendi",
    editorialTitle: "Mehendi",
    description: "Green, gold and hands held still.",
    image: prodOliveIkatSet,
    group: "wedding",
  },
  {
    handle: "sangeet",
    title: "Sangeet",
    editorialTitle: "Sangeet",
    description: "Cut for movement and long nights.",
    image: prodLilacChikankariSet,
    group: "wedding",
  },
  {
    handle: "reception",
    title: "Reception",
    editorialTitle: "Reception",
    description: "The last, most composed look of the week.",
    image: prodLavenderFloralSet,
    group: "wedding",
  },
  {
    handle: "wedding-guest",
    title: "Wedding Guest",
    editorialTitle: "Wedding Guest",
    description: "Considered dressing that never competes.",
    image: prodTealIkatSet,
    group: "wedding",
  },
];

export const getCollection = (handle: string) => collections.find((c) => c.handle === handle);

export const formatPrice = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise);
