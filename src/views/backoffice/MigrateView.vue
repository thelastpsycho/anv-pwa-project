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

      <!-- TV Channel Migration -->
      <div class="mt-8">
        <h3 class="text-lg font-semibold mb-2">Migrate TV Channel List</h3>
        <button
          @click="migrateTvChannels"
          class="px-4 py-2 bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90"
          :disabled="migrating"
        >
          {{ migrating ? 'Migrating...' : 'Migrate TV Channels' }}
        </button>
        <div v-if="success" class="mt-2 text-green-600">TV channels migrated successfully!</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { migrateAllData } from "@/utils/migration";
import { useTvChannelsStore } from '@/stores/tvChannels';

const loading = ref(false);
const migrated = ref(false);
const migrating = ref(false);
const success = ref(false);
const store = useTvChannelsStore();

const initialChannels = [
  { number: 1, name: 'KOMPAS TV' },
  { number: 2, name: 'TRANS TV' },
  { number: 3, name: 'TRANS 7' },
  { number: 4, name: 'GTV' },
  { number: 5, name: 'METRO TV' },
  { number: 6, name: 'NET' },
  { number: 7, name: 'TVRI' },
  { number: 8, name: 'RCTI' },
  { number: 9, name: 'SCTV' },
  { number: 10, name: 'TVONE' },
  { number: 11, name: 'INDOSIAR' },
  { number: 12, name: 'MNC TV' },
  { number: 13, name: 'ANTV' },
  { number: 14, name: 'CINEMACHI' },
  { number: 15, name: 'CINEMACHI MAX' },
  { number: 16, name: 'UNIQUES' },
  { number: 17, name: 'CELESTIAL MOVIES' },
  { number: 18, name: 'AXN' },
  { number: 19, name: 'KIX' },
  { number: 20, name: 'CINEIDGE' },
  { number: 21, name: 'ZEEBIOSKOP' },
  { number: 22, name: 'HITS MOVIES' },
  { number: 23, name: 'TV' },
  { number: 24, name: 'THRILL' },
  { number: 25, name: 'SPOTV' },
  { number: 26, name: 'FIGHT SPORT TV' },
  { number: 27, name: 'BBC EARTH' },
  { number: 28, name: 'MUSIC TV' },
  { number: 29, name: 'ONE' },
  { number: 30, name: 'SAHARA ONE' },
  { number: 31, name: 'LIFETIME' },
  { number: 32, name: 'DW NEWS' },
  { number: 33, name: 'ABC AUSTRALIA' },
  { number: 34, name: 'NHK WORLD' },
  { number: 35, name: 'BBC WORLD' },
  { number: 36, name: 'CNA' },
  { number: 37, name: 'AL-JAZEERA' },
  { number: 38, name: 'MNC NEWS' },
  { number: 39, name: 'ZEE NEWS' },
  { number: 40, name: 'MOONBUG' },
  { number: 41, name: 'NICKELODEON' },
  { number: 42, name: 'TV 5' },
  { number: 43, name: 'RTP' },
  { number: 44, name: 'PHOENIX TV' },
  { number: 45, name: 'RAI TV' },
];

async function handleMigration() {
  if (loading.value) return;
  
  loading.value = true;
  try {
    await migrateAllData();
    migrated.value = true;
    console.log("Migration completed successfully");
  } catch (error) {
    console.error('Migration failed:', error);
    alert('Migration failed. Please try again later.');
  } finally {
    loading.value = false;
  }
}

async function migrateTvChannels() {
  migrating.value = true;
  success.value = false;
  for (const channel of initialChannels) {
    await store.addChannel(channel);
  }
  migrating.value = false;
  success.value = true;
}
</script>
