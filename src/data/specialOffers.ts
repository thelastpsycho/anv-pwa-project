interface SpecialOffer {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  validUntil: string;
}

export const specialOffers: SpecialOffer[] = [
  {
    id: 1,
    title: "Honeymoon Package",
    description: "Special rates for honeymooners with romantic dinner",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Romantic-Dinner.jpg",
    price: "IDR 8,500,000",
    validUntil: "31 March 2024",
  },
  {
    id: 2,
    title: "Spa Package",
    description: "Relaxing spa treatment for two",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Sakanti_Spa_Bed_21050x700.jpg",
    price: "IDR 2,500,000",
    validUntil: "31 March 2024",
  },
  {
    id: 3,
    title: "Weekend Getaway",
    description: "Special weekend rates with breakfast",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Swimming-Pool.jpg",
    price: "IDR 3,500,000",
    validUntil: "31 March 2024",
  },
];
