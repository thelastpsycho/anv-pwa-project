export interface Attraction {
  id: string;
  title: string;
  description: string;
  distance: string;
  image: string;
  category: "Beach" | "Shopping" | "Entertainment";
}
