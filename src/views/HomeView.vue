<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
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

const menuItems = [
  {
    id: "activities",
    title: "Activities",
    icon: "mdi mdi-compass-outline",
    route: "activities",
  },
  {
    id: "dining",
    title: "Dining",
    icon: "mdi mdi-silverware",
    route: "restaurant",
  },
  {
    id: "wellness",
    title: "Wellness",
    icon: "mdi mdi-flower-tulip-outline",
    route: "wellness",
  },
  {
    id: "information",
    title: "Information",
    icon: "mdi mdi-information-outline",
    route: "faq",
  },
  {
    id: "whatson",
    title: "What's On",
    icon: "mdi mdi-calendar-blank-outline",
    route: "events",
  },
  {
    id: "around",
    title: "Around Us",
    icon: "mdi mdi-map-marker-outline",
    route: "around",
  },
];
</script>

<template>
  <div
    :class="[
      'p-4 opacity-0 translate-y-5 transition-all duration-600 ease-out',
      isLoaded ? 'opacity-100 translate-y-0' : '',
    ]"
  >
    <!-- Logo Section -->
    <!-- <div class="flex justify-center p-3 -mt-6">
      <img
        src="https://www.theanvayabali.com/wp-content/themes/wcl/images/logo-theanvaya.svg"
        alt="The Anvaya Logo"
        class="w-36 opacity-0 scale-95 animate-[logoFadeIn_0.8s_ease-out_0.3s_forwards]"
      />
    </div> -->

    <!-- Weather Section -->
    <div
      class="bg-white/80 backdrop-blur-sm p-2.5 rounded-lg shadow-sm max-w-xs mx-auto mb-6"
    >
      <div v-if="weather" class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <p class="text-2xl font-medium text-anvaya-blue">
            {{ Math.round(weather.current_weather.temperature) }}°C
          </p>
          <div class="flex flex-col">
            <span class="text-xs font-medium text-anvaya-blue/80"
              >Kuta, Bali</span
            >
            <span class="text-xs text-gray-500">{{ weatherDescription }}</span>
          </div>
        </div>
        <i class="mdi mdi-weather-sunny text-2xl text-anvaya-blue/80"></i>
      </div>
      <div v-else class="text-center text-gray-600 text-sm">
        Loading weather...
      </div>
    </div>

    <!-- Amenities Grid -->
    <div class="mt-8 px-2">
      <div
        class="grid grid-cols-3 gap-3 opacity-0 animate-[cardsFadeIn_0.8s_ease-out_0.6s_forwards]"
      >
        <router-link
          v-for="item in menuItems"
          :key="item.id"
          :to="{ name: item.route }"
          class="group relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-white to-anvaya-gray/5 shadow-sm border border-anvaya-gray/10 p-4 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all duration-300"
        >
          <div
            class="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform duration-300"
          >
            <i :class="[item.icon, 'text-2xl text-anvaya-blue']"></i>
          </div>
          <h3
            class="text-xs font-medium text-center text-anvaya-blue/80 group-hover:text-anvaya-blue transition-colors"
          >
            {{ item.title }}
          </h3>
        </router-link>
      </div>
    </div>

    <!-- Special Offers -->
    <div class="mt-12">
      <h2 class="text-xl font-medium text-anvaya-blue mb-4">TRENDING</h2>
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
                <div class="flex items-center gap-2">
                  <span class="text-white/90 text-sm">
                    <i
                      :class="[
                        offer.type === 'activity'
                          ? 'mdi mdi-calendar-clock'
                          : 'mdi mdi-tag-outline',
                        'mr-1',
                      ]"
                    ></i>
                    {{ offer.validUntil }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Content Section -->
            <div class="p-4">
              <div class="mb-2">
                <h3 class="font-medium text-anvaya-blue text-lg">
                  {{ offer.title }}
                </h3>
              </div>
              <p class="text-sm text-gray-600">{{ offer.description }}</p>
              <button
                class="mt-4 w-full py-2.5 bg-anvaya-blue/10 text-anvaya-blue rounded-lg hover:bg-anvaya-blue/20 transition-colors font-medium"
              >
                {{ offer.type === "activity" ? "Book Now" : "View Details" }}
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
