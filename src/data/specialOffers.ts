export interface SpecialOffer {
  id: number;
  title: string;
  description: string;
  image: string;
  validUntil: string;
  type: "offer" | "activity";
}

export const specialOffers: SpecialOffer[] = [
  {
    id: 1,
    title: "Honeymoon Package",
    description: "Special rates for honeymooners with romantic dinner",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Romantic-Dinner.jpg",
    validUntil: "31 March 2024",
    type: "offer",
  },
  {
    id: 2,
    title: "Spa Package",
    description: "Relaxing spa treatment for two",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Sakanti_Spa_Bed_21050x700.jpg",
    validUntil: "31 March 2024",
    type: "offer",
  },
  {
    id: 3,
    title: "Weekend Getaway",
    description: "Special weekend rates with breakfast",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Romantic-Dinner.jpg",
    validUntil: "31 March 2024",
    type: "offer",
  },
  {
    id: 4,
    title: "Yoga Session",
    description: "Start your day with a peaceful yoga session by the beach",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070",
    validUntil: "Available Daily",
    type: "activity",
  },
  {
    id: 5,
    title: "Cooking Class",
    description: "Learn to cook authentic Balinese dishes with our master chef",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070",
    validUntil: "Every Wednesday & Saturday",
    type: "activity",
  },
];
