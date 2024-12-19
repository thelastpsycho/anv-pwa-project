<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-medium mb-4">Data Migration</h2>

      <div v-if="!migrated" class="space-y-4">
        <p class="text-gray-600">
          This will migrate all local data to Firebase. This action cannot be
          undone.
        </p>

        <button
          @click="handleMigration"
          :disabled="loading"
          class="px-4 py-2 bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90 disabled:opacity-50"
        >
          {{ loading ? "Migrating..." : "Start Migration" }}
        </button>
      </div>

      <div v-else class="text-green-600">
        <i class="mdi mdi-check-circle text-xl mr-2"></i>
        Migration completed successfully!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { migrateAllData } from "@/utils/migration";

const loading = ref(false);
const migrated = ref(false);

async function handleMigration() {
  if (loading.value) return;
  
  loading.value = true;
  try {
    await migrateAllData();
    migrated.value = true;
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    loading.value = false;
  }
}
</script>
