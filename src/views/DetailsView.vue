<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { Amenity } from "@/types/amenities";
import { ref, onMounted } from "vue";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const amenity = ref<Amenity | null>(null);

async function loadAmenity() {
  try {
    const docRef = doc(db, "amenities", props.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      amenity.value = { id: docSnap.id, ...docSnap.data() } as Amenity;
    }
  } catch (error) {
    console.error("Error loading amenity:", error);
  }
}

onMounted(() => {
  loadAmenity();
});

const goBack = () => {
  router.push("/");
};
</script>

<template>
  <div v-if="amenity" class="min-h-screen bg-anvaya-cream/20">
    <!-- Header -->
    <div class="relative h-[40vh]">
      <img
        :src="amenity.image"
        :alt="amenity.title"
        class="w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
      ></div>

      <!-- Back Button -->
      <button
        class="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
        @click="goBack"
      >
        <i class="mdi mdi-arrow-left text-2xl"></i>
      </button>

      <!-- Title -->
      <div class="absolute bottom-0 left-0 right-0 p-6">
        <div class="flex items-center space-x-3 mb-2">
          <i :class="[amenity.icon, 'text-white text-2xl']"></i>
          <h1 class="text-2xl font-medium text-white">{{ amenity.title }}</h1>
        </div>
        <p class="text-white/90">{{ amenity.description }}</p>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 max-w-3xl mx-auto space-y-6">
      <div v-if="amenity.details.openHours" class="flex items-start space-x-4">
        <div class="p-2 rounded-lg bg-anvaya-blue/10">
          <i class="mdi mdi-clock-outline text-anvaya-blue text-xl"></i>
        </div>
        <div>
          <h3 class="font-medium text-anvaya-blue">Opening Hours</h3>
          <p class="text-gray-600">{{ amenity.details.openHours }}</p>
        </div>
      </div>

      <div v-if="amenity.details.priceRange" class="flex items-start space-x-4">
        <div class="p-2 rounded-lg bg-anvaya-blue/10">
          <i class="mdi mdi-currency-usd text-anvaya-blue text-xl"></i>
        </div>
        <div>
          <h3 class="font-medium text-anvaya-blue">Price Range</h3>
          <p class="text-gray-600">{{ amenity.details.priceRange }}</p>
        </div>
      </div>

      <div class="flex items-start space-x-4">
        <div class="p-2 rounded-lg bg-anvaya-blue/10">
          <i class="mdi mdi-information-outline text-anvaya-blue text-xl"></i>
        </div>
        <div>
          <h3 class="font-medium text-anvaya-blue">About</h3>
          <p class="text-gray-600 mt-1">{{ amenity.details.description }}</p>
        </div>
      </div>

      <div v-if="amenity.details.highlights" class="flex items-start space-x-4">
        <div class="p-2 rounded-lg bg-anvaya-blue/10">
          <i class="mdi mdi-star-outline text-anvaya-blue text-xl"></i>
        </div>
        <div>
          <h3 class="font-medium text-anvaya-blue">Highlights</h3>
          <ul class="mt-2 space-y-2">
            <li
              v-for="highlight in amenity.details.highlights"
              :key="highlight"
              class="flex items-center space-x-2 text-gray-600"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-anvaya-blue/40"></span>
              <span>{{ highlight }}</span>
            </li>
          </ul>
        </div>
      </div>

      <button
        class="w-full py-4 bg-anvaya-blue text-white rounded-xl font-medium hover:bg-anvaya-blue/90 transition-colors mt-8"
      >
        Make a Reservation
      </button>
    </div>
  </div>
</template>
