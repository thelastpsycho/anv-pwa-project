interface Activity {
  id: number;
  title: string;
  duration: string;
  description: string;
  image: string;
  groupSize: string;
}

export const activities: Activity[] = [
  {
    id: 1,
    title: "Cycling Tour",
    duration: "07:00 AM - 09:00 AM",
    description:
      "Explore the scenic beauty of Bali on our guided cycling tour through traditional villages, rice paddies, and coastal paths.",
    image:
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1470&auto=format&fit=crop",
    groupSize: "2-8 persons",
  },
  {
    id: 2,
    title: "Cooking Class",
    duration: "10:00 AM - 12:30 PM",
    description:
      "Learn the art of Balinese cuisine with our expert chefs. Includes market visit, cooking session, and lunch with your creations.",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1470&auto=format&fit=crop",
    groupSize: "4-10 persons",
  },
  {
    id: 3,
    title: "Water Aerobics",
    duration: "09:00 AM - 10:00 AM",
    description:
      "Join our energetic water aerobics session for a fun and effective low-impact workout in our infinity pool.",
    image:
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1470&auto=format&fit=crop",
    groupSize: "Up to 12 persons",
  },
  {
    id: 4,
    title: "Chess Master",
    duration: "02:00 PM - 04:00 PM",
    description:
      "Challenge yourself with a game of chess in our elegant lobby lounge. Available for all skill levels.",
    image:
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1471&auto=format&fit=crop",
    groupSize: "2 persons",
  },
  {
    id: 5,
    title: "Water Volleyball",
    duration: "03:00 PM - 04:00 PM",
    description:
      "Enjoy a friendly game of water volleyball in our pool. Perfect for family fun or meeting other guests.",
    image:
      "https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=1470&auto=format&fit=crop",
    groupSize: "6-12 persons",
  },
];
