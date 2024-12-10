export interface Amenity {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  details: {
    openHours?: string;
    priceRange?: string;
    description: string;
    highlights?: string[];
  };
}

export const amenities: Amenity[] = [
  {
    id: "spa",
    title: "Sakanti Spa",
    description: "Luxury spa treatments and wellness services",
    icon: "mdi mdi-spa",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Sakanti_Spa_Bed_21050x700.jpg",
    details: {
      openHours: "9:00 AM - 9:00 PM",
      priceRange: "IDR 500,000 - IDR 2,000,000",
      description:
        "Experience traditional Balinese healing and modern wellness treatments.",
      highlights: [
        "Traditional Balinese Massage",
        "Aromatherapy Treatments",
        "Couples Spa Packages",
        "Beauty Treatments",
      ],
    },
  },
  // Add more amenities as needed
];
