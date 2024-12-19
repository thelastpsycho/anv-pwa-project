import { collection, addDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { TrendingItem } from "@/types/trending";

const initialTrendingData: Omit<TrendingItem, 'id'>[] = [
  {
    title: "Sunset Yoga Session",
    description: "Join our daily sunset yoga sessions by the beach. Perfect for all skill levels.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    validUntil: "Daily",
    type: "activity"
  },
  {
    title: "Special Dining Experience",
    description: "Enjoy a romantic dinner under the stars with our special 5-course menu.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    validUntil: "Every Weekend",
    type: "promotion"
  },
  {
    title: "Balinese Cooking Class",
    description: "Learn authentic Balinese recipes from our expert chefs.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
    validUntil: "Every Tuesday",
    type: "event"
  }
];

export async function migrateTrending() {
  try {
    const trendingRef = collection(db, "trending");
    
    for (const item of initialTrendingData) {
      await addDoc(trendingRef, {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log("✅ Trending data migration completed");
  } catch (error) {
    console.error("Error migrating trending data:", error);
    throw error;
  }
} 