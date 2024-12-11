export interface DiningVenue {
  id: number;
  name: string;
  logo?: string;
  description: string;
  image: string;
  hours: string;
  cuisine: string;
  additionalInfo?: string;
}

export const diningVenues: DiningVenue[] = [
  {
    id: 1,
    name: "Kunyit Restaurant",
    logo: "logo",
    description:
      "Experience authentic Indonesian cuisine in an elegant setting. Our signature restaurant offers a journey through the archipelago's rich culinary heritage.",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/01/Kunyit_Resturant_Front1050x700.jpg",
    hours: "07:00 - 23:00",
    cuisine: "Indonesian Cuisine",
    additionalInfo: "Smart Casual Dress Code",
  },
  {
    id: 2,
    name: "Sands Restaurant",
    logo: "logo",
    description:
      "Beachfront dining with international cuisine and stunning ocean views. Enjoy fresh seafood and global favorites in a relaxed atmosphere.",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/01/Sands-Front-1050x700-1.jpg",
    hours: "06:30 - 22:30",
    cuisine: "International Cuisine",
    additionalInfo: "Beachfront Location",
  },
  {
    id: 3,
    name: "Pool Bar",
    description:
      "Refresh and unwind at our poolside bar offering tropical cocktails, light bites, and refreshing beverages with stunning infinity pool views.",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/01/Sands-Front-1050x700-1.jpg",
    hours: "10:00 - 19:00",
    cuisine: "Cocktails & Light Meals",
    additionalInfo: "Poolside Service",
  },
];
