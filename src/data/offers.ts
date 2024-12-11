interface Offer {
  id: number;
  category: "staycation" | "dining" | "special";
  title: string;
  description: string;
  price?: string;
  image: string;
  date: string;
  details?: string[];
}

export const offers: Offer[] = [
  {
    id: 1,
    category: "staycation",
    title: "STAYCATION OFFER",
    description:
      "Unwind and recharge with our staycation offer: Best rates, breakfast, airport transfer, Wi-Fi, fitness center, pool access, and beach steps away!",
    price: "Starting from IDR 1,500,000++/night",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
    date: "Valid until Dec 31, 2024",
    details: [
      "Daily breakfast for 2 persons",
      "Complimentary airport transfer",
      "Free Wi-Fi access",
      "Access to fitness center and pools",
      "Late check-out subject to availability",
    ],
  },
  {
    id: 2,
    category: "dining",
    title: "SUNDAY BRUNCH",
    description:
      "Indulge in our lavish Sunday Brunch featuring international cuisine, live stations, fresh seafood, and free-flow beverages.",
    price: "IDR 588,000++/person",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
    date: "Every Sunday",
    details: [
      "International buffet selection",
      "Live cooking stations",
      "Fresh seafood bar",
      "Dessert corner",
      "Free flow soft drinks",
    ],
  },
  {
    id: 3,
    category: "special",
    title: "SPA PACKAGE",
    description:
      "Rejuvenate your body and soul with our special spa package including traditional Balinese massage and treatments.",
    price: "IDR 850,000++/person",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop",
    date: "Valid until Jun 30, 2024",
    details: [
      "90-minute Balinese massage",
      "30-minute body scrub",
      "Complimentary spa amenities",
      "Access to spa facilities",
      "Herbal tea service",
    ],
  },
];
