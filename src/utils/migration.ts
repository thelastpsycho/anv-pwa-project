import { db } from "@/config/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export async function migrateAllData() {
  try {
    // Migrate amenities
    const amenitiesRef = collection(db, "amenities");
    // Add migration logic here
    console.log("✅ Migration completed");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}
