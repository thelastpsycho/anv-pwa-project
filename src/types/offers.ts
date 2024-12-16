export interface Offer {
  id: string;
  title: string;
  description: string;
  category: "staycation" | "dining" | "special";
  price?: string;
  image: string;
  date: string;
  details?: string;
}
