<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/PageHeader.vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Attraction } from "@/types/attractions";

const isLoaded = ref(false);
const attractions = ref<Attraction[]>([]);

async function loadAttractions() {
  try {
    const querySnapshot = await getDocs(collection(db, "attractions"));
    attractions.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as Attraction[];
  } catch (error) {
    console.error("Error loading attractions:", error);
  }
}

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
  loadAttractions();
});
</script>

<template>
  <div class="around px-4 pb-12 mb-12">
    <PageHeader title="Around Us" />

    <div
      :class="[
        'opacity-0 translate-y-5 transition-all duration-600 ease-out',
        isLoaded ? 'opacity-100 translate-y-0' : '',
      ]"
    >
      <div class="grid gap-6">
        <div
          v-for="attraction in attractions"
          :key="attraction.id"
          class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-anvaya-gray/10 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
        >
          <div class="relative h-48">
            <img
              :src="attraction.image"
              :alt="attraction.title"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
            ></div>
            <div class="absolute top-4 right-4">
              <span
                class="px-2 py-1 bg-anvaya-blue/90 text-white text-xs rounded-full"
              >
                {{ attraction.category }}
              </span>
            </div>
          </div>

          <div class="p-6">
            <h3
              class="text-xl font-medium text-anvaya-blue dark:text-anvaya-light mb-2"
            >
              {{ attraction.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ attraction.description }}
            </p>
            <div
              class="flex items-center text-sm text-anvaya-blue/80 dark:text-anvaya-light/80"
            >
              <i class="mdi mdi-walk mr-2"></i>
              <span>{{ attraction.distance }}</span>
            </div>
            <button
              class="w-full mt-4 py-2.5 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-lg hover:bg-anvaya-blue/20 dark:hover:bg-anvaya-light/20 transition-colors font-medium"
            >
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
