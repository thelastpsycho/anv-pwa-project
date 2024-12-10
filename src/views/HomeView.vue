<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { amenities } from "@/data/amenities";
import { specialOffers } from "@/data/specialOffers";

const isLoaded = ref(false);

interface WeatherData {
  current_weather: {
    temperature: number;
    weathercode: number;
  };
}

const weather = ref<WeatherData | null>(null);
const weatherDescription = computed(() => {
  if (!weather.value) return "";
  // Weather codes from OpenMeteo
  const codes: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
  };
  return codes[weather.value.current_weather.weathercode] || "Unknown";
});

onMounted(async () => {
  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-8.7238&longitude=115.1722&current_weather=true"
    );
    weather.value = await response.json();
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
});

onMounted(() => {
  isLoaded.value = true;
});
</script>

<template>
  <div
    :class="[
      'p-4 opacity-0 translate-y-5 transition-all duration-600 ease-out',
      isLoaded ? 'opacity-100 translate-y-0' : '',
    ]"
  >
    <!-- Logo Section -->
    <div class="flex justify-center mb-6 p-4">
      <img
        src="https://www.theanvayabali.com/wp-content/themes/wcl/images/logo-theanvaya.svg"
        alt="The Anvaya Logo"
        class="w-48 opacity-0 scale-95 animate-[logoFadeIn_0.8s_ease-out_0.3s_forwards]"
      />
    </div>

    <!-- Weather Section -->
    <div
      class="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-sm mx-auto mb-8"
    >
      <div v-if="weather" class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-medium text-anvaya-blue">Kuta, Bali</h2>
          <p class="text-3xl font-bold text-anvaya-blue">
            {{ Math.round(weather.current_weather.temperature) }}°C
          </p>
          <p class="text-gray-600">{{ weatherDescription }}</p>
        </div>
        <i class="mdi mdi-weather-sunny text-5xl text-anvaya-blue"></i>
      </div>
      <div v-else class="text-center text-gray-600">Loading weather...</div>
    </div>

    <!-- Amenities Grid -->
    <div class="mt-8">
      <div
        class="grid grid-cols-2 gap-4 opacity-0 animate-[cardsFadeIn_0.8s_ease-out_0.6s_forwards]"
      >
        <router-link
          v-for="item in amenities"
          :key="item.id"
          :to="{ name: 'details', params: { id: item.id } }"
          class="group relative overflow-hidden rounded-2xl aspect-square focus:outline-none focus:ring-2 focus:ring-anvaya-blue/50"
        >
          <!-- Background Image -->
          <img
            :src="item.image"
            :alt="item.title"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300"
          ></div>

          <!-- Content -->
          <div class="absolute inset-0 p-4 flex flex-col justify-end">
            <div class="flex items-center space-x-2 mb-1">
              <i :class="[item.icon, 'text-white text-xl']"></i>
              <h3 class="text-white font-medium">{{ item.title }}</h3>
            </div>
            <p class="text-white/80 text-sm">{{ item.description }}</p>
          </div>

          <!-- Hover Effect -->
          <div
            :class="[
              'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
              `bg-gradient-to-tr ${item.color}`,
            ]"
          ></div>
        </router-link>
      </div>
    </div>

    <!-- Special Offers -->
    <div class="mt-12">
      <h2 class="text-xl font-medium text-anvaya-blue mb-4">Special Offers</h2>
      <div class="overflow-x-auto pb-4">
        <div class="flex space-x-4">
          <div
            v-for="offer in specialOffers"
            :key="offer.id"
            class="flex-shrink-0 w-80 bg-white rounded-xl overflow-hidden shadow-sm border border-anvaya-gray/20 group hover:shadow-md transition-all duration-300"
          >
            <!-- Image Section -->
            <div class="relative h-48 overflow-hidden">
              <img
                :src="offer.image"
                :alt="offer.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
              ></div>
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <p class="text-white/90 text-sm">
                  Valid until {{ offer.validUntil }}
                </p>
              </div>
            </div>

            <!-- Content Section -->
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-medium text-anvaya-blue text-lg">
                  {{ offer.title }}
                </h3>
                <span class="text-anvaya-blue font-medium">{{
                  offer.price
                }}</span>
              </div>
              <p class="text-sm text-gray-600">{{ offer.description }}</p>
              <button
                class="mt-4 w-full py-2.5 bg-anvaya-blue/10 text-anvaya-blue rounded-lg hover:bg-anvaya-blue/20 transition-colors font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="h-20"></div>
  </div>
</template>

<style>
@keyframes logoFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes cardsFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
