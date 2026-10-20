export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: "Products & Customisation" | "Orders & Delivery" | "Returns & Support";
  badge: string;
  action?: {
    label: string;
    to: string;
  };
}

export const FAQ_CATEGORIES = [
  "All Questions",
  "Products & Customisation",
  "Orders & Delivery",
  "Returns & Support",
] as const;

export type FAQCategory = (typeof FAQ_CATEGORIES)[number];

export const FAQS: FAQItem[] = [
  {
    id: 1,
    question: "What products can I shop for at Lamoksh Fabrics?",
    answer:
      "Lamoksh Fabrics offers a beautiful collection of ethnic wear, including sarees, unstitched suit materials, Upada silk dupattas, readymade corsets, and other fashionable pieces designed to complement your style.",
    category: "Products & Customisation",
    badge: "Ethnic Collections",
    action: {
      label: "Explore Collections",
      to: "/clothing",
    },
  },
  {
    id: 2,
    question: "Do you offer customised outfits?",
    answer:
      "Yes, you can contact our team to enquire about customisation options for selected products. Share your preferred design and requirements, and we will guide you based on availability and feasibility.",
    category: "Products & Customisation",
    badge: "Bespoke & Customisation",
    action: {
      label: "Enquire About Customisation",
      to: "/contact",
    },
  },
  {
    id: 3,
    question: "How can I choose the right size for my outfit?",
    answer:
      "We recommend checking the size chart and product description before placing your order. If you need help selecting the right size, please contact our team for assistance.",
    category: "Products & Customisation",
    badge: "Sizing Guide",
    action: {
      label: "Get Sizing Assistance",
      to: "/contact",
    },
  },
  {
    id: 4,
    question: "Do you deliver products across India?",
    answer:
      "We aim to make our collections accessible to customers across India. Please check the shipping information available at checkout or contact our team to confirm delivery availability for your location.",
    category: "Orders & Delivery",
    badge: "Pan-India Shipping",
    action: {
      label: "View Shipping Policy",
      to: "/shipping",
    },
  },
  {
    id: 5,
    question: "How can I place an order on the Lamoksh Fabrics website?",
    answer:
      "Browse our collections, select your preferred product, choose the available size or options, and proceed to checkout. Follow the instructions to enter your delivery details and complete your order.",
    category: "Orders & Delivery",
    badge: "Ordering Guide",
    action: {
      label: "Shop New Arrivals",
      to: "/new-arrivals",
    },
  },
  {
    id: 6,
    question: "Can I return or exchange a product?",
    answer:
      "Returns and exchanges are subject to Lamoksh Fabrics' applicable return policy and the product's eligibility. Please review the policy before purchasing and contact our support team if you receive a damaged, defective, or incorrect item.",
    category: "Returns & Support",
    badge: "Returns & Exchanges",
    action: {
      label: "Review Return Policy",
      to: "/returns",
    },
  },
  {
    id: 7,
    question: "How can I contact Lamoksh Fabrics for assistance?",
    answer:
      "For product enquiries, customisation requests, order updates, or other assistance, please contact us through the contact details or enquiry form available on our website. Our team will help you with your queries.",
    category: "Returns & Support",
    badge: "Client Care",
    action: {
      label: "Contact Atelier Support",
      to: "/contact",
    },
  },
];
