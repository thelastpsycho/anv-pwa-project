export interface Amenity {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  details: {
    openHours?: string;
    priceRange?: string;
    description: string;
    highlights?: string[];
  };
}
