<template>
  <div class="restaurant p-4">
    <h1 class="text-2xl font-medium text-anvaya-blue mb-6 text-center">
      Dining Experiences
    </h1>

    <div
      v-for="venue in diningVenues"
      :key="venue.id"
      class="mb-8 bg-white rounded-xl overflow-hidden shadow-lg"
    >
      <div class="flex flex-col md:flex-row">
        <div class="md:w-1/2">
          <img
            :src="venue.image"
            :alt="venue.name"
            class="w-full h-64 object-cover"
          />
        </div>
        <div class="md:w-1/2 p-6">
          <img
            v-if="venue.logo"
            :src="logos[venue.name]"
            :alt="`${venue.name} Logo`"
            class="h-12 mb-4"
          />
          <h2 v-else class="text-2xl font-medium text-anvaya-blue mb-2">
            {{ venue.name }}
          </h2>
          <p class="text-gray-600 mb-4">
            {{ venue.description }}
          </p>
          <div class="space-y-2 text-sm text-gray-600">
            <div>
              <i class="mdi mdi-clock-outline mr-1"></i> Open Daily:
              {{ venue.hours }}
            </div>
            <div>
              <i class="mdi mdi-silverware mr-1"></i> {{ venue.cuisine }}
            </div>
            <div v-if="venue.additionalInfo">
              <i class="mdi mdi-information-outline mr-1"></i>
              {{ venue.additionalInfo }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { diningVenues } from "@/data/dining";
import KunyitLogo from "@/assets/Kunyit Restaurant.svg";
import SandsLogo from "@/assets/Sands Restaurant.svg";

// Map the logos
const logos = {
  "Kunyit Restaurant": KunyitLogo,
  "Sands Restaurant": SandsLogo,
};
</script>
