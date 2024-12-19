import { migrateActivities } from './migrations/activitiesMigration';
import { migrateFAQs } from './migrations/faqMigration';

export async function migrateAllData() {
  try {
    // Migrate activities
    await migrateActivities();
    // Migrate FAQs
    await migrateFAQs();
    // ... other migrations
    console.log("✅ Migration completed");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}
