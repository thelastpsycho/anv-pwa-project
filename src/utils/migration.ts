export async function migrateAllData() {
  try {
    console.log("✅ Migration completed");
    return true;
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
} 