import { migrateTrending } from './migrations/trendingMigration';

export async function migrateAllData() {
  try {
    await migrateTrending();
    console.log("✅ Migration completed");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}
