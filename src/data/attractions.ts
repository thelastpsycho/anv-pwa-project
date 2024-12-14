interface Attraction {
  id: number;
  title: string;
  description: string;
  distance: string;
  image: string;
  category: "Beach" | "Shopping" | "Entertainment";
}

export const attractions: Attraction[] = [
  {
    id: 1,
    title: "Kuta Beach",
    description:
      "Famous beach known for its surfing, sunsets, and vibrant atmosphere. Just steps away from the hotel.",
    distance: "5 minutes walk",
    image:
      "https://images.unsplash.com/photo-1567520595708-2fb411a6ce88?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Beach",
  },
  {
    id: 2,
    title: "Beachwalk Shopping Center",
    description:
      "Modern shopping mall with international brands, dining options, and entertainment facilities.",
    distance: "10 minutes walk",
    image: "https://cms.beachwalkbali.com/uploads/COVER_WEB_493d853f2d.jpg",
    category: "Shopping",
  },
  {
    id: 3,
    title: "Waterbom Bali",
    description:
      "Asia's #1 waterpark featuring exciting slides and attractions for all ages.",
    distance: "15 minutes walk",
    image: "https://www.waterbom-bali.com/media/wysiwyg/1_3.png",
    category: "Entertainment",
  },
  {
    id: 4,
    title: "Discovery Shopping Mall",
    description:
      "Beachfront shopping center with local and international retailers.",
    distance: "15 minutes walk",
    image:
      "https://www.nowbali.co.id/wp-content/uploads/2024/09/Discovery-Shopping-Mall-Kuta-Shopping-Malls-in-Bali.webp",
    category: "Shopping",
  },
];
