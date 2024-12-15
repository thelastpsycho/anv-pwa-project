<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from "vue";
import { specialOffers } from "@/data/specialOffers";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";

const isLoaded = ref(false);
const authStore = useAuthStore();
let weatherInterval: number;

const weatherCodes: Record<number, string> = {
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

const weatherIcons: Record<number, string> = {
  0: "mdi mdi-weather-sunny",
  1: "mdi mdi-weather-partly-cloudy",
  2: "mdi mdi-weather-partly-cloudy",
  3: "mdi mdi-weather-cloudy",
  45: "mdi mdi-weather-fog",
  48: "mdi mdi-weather-fog",
  51: "mdi mdi-weather-rainy",
  53: "mdi mdi-weather-pouring",
  55: "mdi mdi-weather-pouring",
  61: "mdi mdi-weather-rainy",
  63: "mdi mdi-weather-pouring",
  65: "mdi mdi-weather-pouring",
  80: "mdi mdi-weather-rainy",
  81: "mdi mdi-weather-pouring",
  82: "mdi mdi-weather-lightning-rainy",
};

interface WeatherData {
  current_weather: {
    temperature: number;
    weathercode: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  };
  lastFetched?: number;
}

const weather = ref<WeatherData | null>(null);
const weatherDescription = computed(() => {
  if (!weather.value) return "";
  return weatherCodes[weather.value.current_weather.weathercode] || "Unknown";
});

const hourlyForecasts = computed(() => {
  if (!weather.value?.hourly) return [];

  const now = new Date();
  const currentHour = now.getHours();

  return weather.value.hourly.time
    .map((time, index) => ({
      time: new Date(time),
      temperature: Math.round(weather.value!.hourly.temperature_2m[index]),
      weathercode: weather.value!.hourly.weathercode[index],
    }))
    .filter((forecast) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const forecastDate = new Date(forecast.time);
      forecastDate.setHours(0, 0, 0, 0);

      const isToday = today.getTime() === forecastDate.getTime();
      const forecastHour = forecast.time.getHours();

      return (
        isToday && forecastHour >= currentHour && forecastHour < currentHour + 6
      );
    })
    .slice(0, 6);
});

const fetchWeather = async () => {
  try {
    // Show loading state
    weather.value = null;
    console.log("Fetching weather data...");

    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-8.7213&longitude=115.1697&timezone=Asia/Makassar&hourly=temperature_2m,weathercode&current=temperature_2m,weathercode&forecast_days=1"
    );

    if (!response.ok) {
      throw new Error("Weather API response was not ok");
    }

    const data = await response.json();
    console.log("Weather data received:", data);

    // Transform the data to match our interface
    const transformedData = {
      current_weather: {
        temperature: data.current.temperature_2m,
        weathercode: data.current.weathercode,
      },
      hourly: {
        time: data.hourly.time,
        temperature_2m: data.hourly.temperature_2m,
        weathercode: data.hourly.weathercode,
      },
      lastFetched: Date.now(),
    };

    weather.value = transformedData;
    localStorage.setItem("weatherData", JSON.stringify(weather.value));
    console.log("Weather data updated and cached");
  } catch (error) {
    console.error("Error fetching weather:", error);
    // Try to use cached data as fallback if fetch fails
    const cachedWeather = localStorage.getItem("weatherData");
    if (cachedWeather) {
      console.log("Using cached weather data");
      weather.value = JSON.parse(cachedWeather);
    }
  }
};

onMounted(() => {
  // Check if this is a page reload or navigation
  const pageLoadTime = sessionStorage.getItem("pageLoadTime");
  const currentTime = Date.now().toString();

  if (!pageLoadTime) {
    // First load of the page
    sessionStorage.setItem("pageLoadTime", currentTime);
    fetchWeather();
  } else {
    // Navigation back to page - use cached data
    const cachedWeather = localStorage.getItem("weatherData");
    if (cachedWeather) {
      weather.value = JSON.parse(cachedWeather);
    } else {
      fetchWeather();
    }
  }

  // Set up interval for every 15 minutes
  weatherInterval = setInterval(fetchWeather, 15 * 60 * 1000);
  isLoaded.value = true;
});

onUnmounted(() => {
  // Clean up interval
  if (weatherInterval) {
    clearInterval(weatherInterval);
  }
});

const menuItems = [
  // {
  //   id: "map",
  //   title: "Resort Map",
  //   icon: "mdi mdi-map",
  //   route: "map",
  // },
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

const currentIndex = ref(0);

const displayOffers = computed(() => {
  return [
    ...specialOffers,
    ...specialOffers,
    ...specialOffers,
    ...specialOffers,
    ...specialOffers,
  ];
});

const totalSlides = computed(() => specialOffers.length);

const nextSlide = () => {
  const isLastSlide = currentIndex.value === totalSlides.value * 3 - 1;

  if (isLastSlide) {
    // When reaching the last slide, quickly jump to the first set without animation
    currentIndex.value = totalSlides.value;
    // Then immediately move to the next slide with animation
    requestAnimationFrame(() => {
      currentIndex.value = totalSlides.value + 1;
    });
  } else {
    currentIndex.value++;
  }
};

const prevSlide = () => {
  const isFirstSlide = currentIndex.value === totalSlides.value;

  if (isFirstSlide) {
    // When reaching the first slide, quickly jump to the last set without animation
    currentIndex.value = totalSlides.value * 2;
    // Then immediately move to the previous slide with animation
    requestAnimationFrame(() => {
      currentIndex.value = totalSlides.value * 2 - 1;
    });
  } else {
    currentIndex.value--;
  }
};

const touchStart = ref(0);
const touchEnd = ref(0);

const handleTouchStart = (e: TouchEvent) => {
  touchStart.value = e.touches[0].clientX;
  touchEnd.value = touchStart.value;
};

const handleTouchMove = (e: TouchEvent) => {
  touchEnd.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  const swipeDistance = touchStart.value - touchEnd.value;
  const minSwipeDistance = 50; // minimum distance for swipe

  if (Math.abs(swipeDistance) > minSwipeDistance) {
    if (swipeDistance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
};

// Initialize to the middle set
onMounted(() => {
  // Start from the middle set of slides
  currentIndex.value = totalSlides.value;
});

// Add transition control
const isTransitioning = ref(false);
const handleTransitionEnd = () => {
  isTransitioning.value = false;
};

// Offer Details Modal
const router = useRouter();
const selectedOffer = ref<(typeof specialOffers)[0] | null>(null);

const handleOfferAction = (offer: (typeof specialOffers)[0]) => {
  if (offer.type === "activity") {
    router.push({ name: "activities" });
  }
  selectedOffer.value = null;
};

const appStore = useAppStore();
const isDarkMode = computed(() => appStore.isDarkMode);

const toggleDarkMode = () => {
  appStore.toggleDarkMode();
};
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
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 pt-2 rounded-lg shadow-sm w-full mb-2"
    >
      <div class="flex flex-col">
        <div class="flex items-center justify-between">
          <!-- Weather Info -->
          <div v-if="weather" class="flex items-center gap-3">
            <div class="flex flex-col items-center">
              <i
                :class="[
                  weatherCodes[weather.current_weather.weathercode] ||
                    'mdi mdi-weather-cloudy',
                  'text-2xl text-anvaya-blue dark:text-anvaya-light mb-1',
                ]"
              ></i>
              <p
                class="text-2xl font-medium text-anvaya-blue dark:text-anvaya-light"
              >
                {{ Math.round(weather.current_weather.temperature) }}°C
              </p>
            </div>
            <div class="flex flex-col">
              <span
                class="text-xs font-medium text-anvaya-blue/80 dark:text-anvaya-light/80"
                >Kuta, Bali</span
              >
              <span class="text-xs text-gray-500 dark:text-gray-400">{{
                weatherDescription
              }}</span>
            </div>
          </div>
          <div
            v-else
            class="text-center text-gray-600 dark:text-gray-400 text-sm"
          >
            Loading weather...
          </div>
          <div class="flex flex-col items-center">
            <!-- Theme Toggle -->
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg hover:bg-anvaya-blue/5 dark:hover:bg-anvaya-light/5 transition-colors"
            >
              <i
                :class="[
                  isDarkMode
                    ? 'mdi mdi-weather-sunny'
                    : 'mdi mdi-weather-night',
                  'text-2xl text-anvaya-blue dark:text-anvaya-light',
                ]"
              ></i>
              <!-- Room Number -->
              <div
                v-if="authStore.isAuthenticated"
                class="flex items-center gap-1 text-anvaya-blue/80 dark:text-anvaya-light/80"
              >
                <!-- <i class="mdi mdi-door text-lg"></i> -->
                <span class="text-xs">{{ authStore.roomNumber }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Divider -->
        <div
          class="w-full h-[1px] bg-anvaya-gray/10 dark:bg-gray-700/50 my-2"
        ></div>

        <!-- Hourly Forecast -->
        <div
          v-if="hourlyForecasts.length"
          class="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1"
        >
          <div
            v-for="forecast in hourlyForecasts"
            :key="forecast.time.toISOString()"
            class="flex flex-col items-center min-w-[3rem] bg-white/50 dark:bg-gray-800/50 rounded-lg py-1 px-1.5"
          >
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ forecast.time.getHours() }}
            </span>
            <span
              class="text-xs font-medium text-anvaya-blue dark:text-anvaya-light"
            >
              {{ forecast.temperature }}°C
            </span>
            <i
              :class="[
                weatherIcons[forecast.weathercode] || 'mdi mdi-weather-cloudy',
                'text-sm text-anvaya-blue/80 dark:text-anvaya-light/80',
              ]"
            ></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Amenities Grid -->
    <div class="mt-2 p-4">
      <div class="grid grid-cols-3 gap-3">
        <router-link
          v-for="item in menuItems"
          :key="item.id"
          :to="{ name: item.route }"
          class="group relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-white dark:from-gray-800 to-anvaya-gray/5 dark:to-gray-900/5 shadow-sm border border-anvaya-gray/10 dark:border-gray-700 p-4 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all duration-300"
        >
          <div
            class="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm group-hover:scale-110 transition-transform duration-300"
          >
            <i
              :class="[
                item.icon,
                'text-2xl text-anvaya-blue dark:text-anvaya-light',
              ]"
            ></i>
          </div>
          <h3
            class="text-xs font-medium text-center text-anvaya-blue/80 dark:text-anvaya-light/80 group-hover:text-anvaya-blue dark:group-hover:text-anvaya-light transition-colors"
          >
            {{ item.title }}
          </h3>
        </router-link>
      </div>
    </div>

    <!-- Special Offers -->
    <div class="mt-8">
      <h2 class="text-xl font-medium text-anvaya-blue mb-4">TRENDING</h2>
      <div class="relative">
        <div
          class="overflow-hidden"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div
            class="flex transition-transform duration-500 ease-out"
            :style="{
              transform: `translateX(calc(50vw - ${currentIndex * 240}px - 120px))`,
              touchAction: 'pan-y',
            }"
            @transitionend="handleTransitionEnd"
          >
            <div
              v-for="(offer, index) in displayOffers"
              :key="`${offer.id}-${index}`"
              class="flex-shrink-0 w-60 px-2 transition-all duration-500"
              :class="[
                currentIndex === index
                  ? 'scale-110 opacity-100 blur-none'
                  : Math.abs(currentIndex - index) <= 1
                    ? 'scale-90 opacity-40 blur-[1px]'
                    : 'scale-75 opacity-20 blur-[2px]',
              ]"
            >
              <div
                class="mb-12 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-anvaya-gray/20 dark:border-gray-700 group hover:shadow-md transition-all duration-300"
                @click="selectedOffer = offer"
              >
                <!-- Image Section -->
                <div class="relative h-64 overflow-hidden">
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
                      <span class="text-white/90 text-xs">
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
                    <h3
                      class="font-medium text-anvaya-blue dark:text-anvaya-light text-md"
                    >
                      {{ offer.title }}
                    </h3>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ offer.description }}
                  </p>
                  <button
                    class="mt-4 w-full py-1 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-lg hover:bg-anvaya-blue/20 dark:hover:bg-anvaya-light/20 transition-colors text-xs"
                  >
                    {{
                      offer.type === "activity" ? "Book Now" : "View Details"
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Offer Details Modal -->
    <div
      v-if="selectedOffer"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      @click="selectedOffer = null"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md overflow-hidden shadow-xl"
        @click.stop
      >
        <div class="relative h-64">
          <img
            :src="selectedOffer.image"
            :alt="selectedOffer.title"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          ></div>
          <button
            @click="selectedOffer = null"
            class="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          >
            <i class="mdi mdi-close text-lg"></i>
          </button>
          <div class="absolute bottom-4 left-4 flex items-center gap-2">
            <span
              class="px-2 py-1 bg-anvaya-blue/90 text-white text-xs rounded-full flex items-center gap-1"
            >
              <i
                :class="[
                  selectedOffer.type === 'activity'
                    ? 'mdi mdi-calendar-clock'
                    : 'mdi mdi-tag-outline',
                ]"
              ></i>
              {{ selectedOffer.validUntil }}
            </span>
          </div>
        </div>

        <div class="p-6">
          <h3
            class="text-xl font-medium text-anvaya-blue dark:text-anvaya-light mb-2"
          >
            {{ selectedOffer.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ selectedOffer.description }}
          </p>
          <div
            class="space-y-4 bg-anvaya-blue/5 dark:bg-anvaya-light/5 rounded-lg p-4"
          >
            <div
              v-if="selectedOffer.type === 'activity'"
              class="flex items-start gap-3"
            >
              <i class="mdi mdi-information text-anvaya-blue mt-1"></i>
              <div>
                <h4 class="text-sm font-medium text-anvaya-blue mb-1">
                  Activity Details
                </h4>
                <ul class="space-y-2">
                  <li class="text-sm text-gray-600 flex items-center gap-2">
                    <i class="mdi mdi-clock-outline text-anvaya-blue/60"></i>
                    <span>Available daily, advance booking required</span>
                  </li>
                  <li class="text-sm text-gray-600 flex items-center gap-2">
                    <i
                      class="mdi mdi-account-group-outline text-anvaya-blue/60"
                    ></i>
                    <span>Suitable for all ages</span>
                  </li>
                </ul>
              </div>
            </div>

            <div v-else class="flex items-start gap-3">
              <i class="mdi mdi-ticket-percent text-anvaya-blue mt-1"></i>
              <div>
                <h4 class="text-sm font-medium text-anvaya-blue mb-1">
                  Offer Terms
                </h4>
                <ul class="space-y-2">
                  <li class="text-sm text-gray-600 flex items-center gap-2">
                    <i class="mdi mdi-calendar-range text-anvaya-blue/60"></i>
                    <span>Valid for the specified period</span>
                  </li>
                  <li class="text-sm text-gray-600 flex items-center gap-2">
                    <i
                      class="mdi mdi-information-outline text-anvaya-blue/60"
                    ></i>
                    <span>Subject to availability</span>
                  </li>
                  <li class="text-sm text-gray-600 flex items-center gap-2">
                    <i class="mdi mdi-phone-outline text-anvaya-blue/60"></i>
                    <span>Contact front desk for more information</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <button
            @click="handleOfferAction(selectedOffer)"
            class="w-full py-3 bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90 transition-colors"
          >
            {{
              selectedOffer.type === "activity" ? "Book Now" : "View Details"
            }}
          </button>
        </div>
      </div>
    </div>

    <div class="h-20"></div>
  </div>
</template>

<style>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

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

.touch-pan-x {
  touch-action: pan-x;
  -webkit-overflow-scrolling: touch;
}
</style>
