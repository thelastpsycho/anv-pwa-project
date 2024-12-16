export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  image: string;
  validUntil: string;
  type: "activity" | "offer";
}
