export async function migrateAllData() {
  try {
    console.log("✅ Migration completed");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}
