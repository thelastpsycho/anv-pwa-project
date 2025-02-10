<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/PageHeader.vue";
import SakantiLogo from "@/assets/Sakanti Spa.svg";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { WellnessService } from "@/types/wellness";
<<<<<<< HEAD

const isLoaded = ref(false);
const currentIndex = ref(0);
const wellnessServices = ref<WellnessService[]>([]);
let touchStartX = 0;
let touchEndX = 0;
=======
import { trackEvent } from '@/utils/analytics';

const isLoaded = ref(false);
const wellnessServices = ref<WellnessService[]>([]);
>>>>>>> dev

async function loadServices() {
  try {
    const querySnapshot = await getDocs(collection(db, "wellness"));
    wellnessServices.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as WellnessService[];
  } catch (error) {
    console.error("Error loading wellness services:", error);
  }
}

<<<<<<< HEAD
=======
function handleBookNow(serviceName: string) {
  trackEvent('wellness', 'book_service', serviceName);
  window.open('https://anvayabali.com/sakantispa/', '_blank');
}

>>>>>>> dev
onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
  loadServices();
});
<<<<<<< HEAD

const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX;
};

const handleTouchMove = (e: TouchEvent) => {
  touchEndX = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0 && currentIndex.value < wellnessServices.value.length - 1) {
      // Swipe left
      currentIndex.value++;
    } else if (diff < 0 && currentIndex.value > 0) {
      // Swipe right
      currentIndex.value--;
    }
  }
};
</script>

<template>
  <div class="wellness px-4 pb-12 mb-12">
    <PageHeader title="Wellness" />

    <div
      class="wellness mb-4"
=======
</script>

<template>
  <div class="wellness min-h-screen bg-white dark:bg-gray-900">
    <PageHeader title="Wellness & Spa" />

    <div class="px-4 pb-12 space-y-6"
>>>>>>> dev
      :class="[
        'opacity-0 translate-y-5 transition-all duration-600 ease-out',
        isLoaded ? 'opacity-100 translate-y-0' : '',
      ]"
    >
<<<<<<< HEAD
      <div class="relative">
        <!-- Pagination Dots -->
        <div class="flex justify-center gap-2 mb-4">
          <button
            v-for="(_, index) in wellnessServices"
            :key="index"
            @click="currentIndex = index"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="[
              currentIndex === index
                ? 'bg-anvaya-blue dark:bg-anvaya-light w-4'
                : 'bg-anvaya-blue/20 dark:bg-anvaya-light/20',
            ]"
          ></button>
        </div>

        <div
          class="overflow-hidden"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div
            class="flex transition-transform duration-300"
            :style="{ transform: `translateX(${-currentIndex * 100}%)` }"
          >
            <div
              v-for="service in wellnessServices"
              :key="service.id"
              class="flex-shrink-0 w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-anvaya-gray/10 dark:border-gray-700"
            >
              <div class="relative h-60">
                <div class="absolute inset-0 overflow-hidden">
                  <img
                    :src="service.image"
                    :alt="service.title"
                    class="w-full h-full object-cover animate-kenburns"
                  />
                </div>
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                ></div>
                <div
                  class="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"
                ></div>
                <div class="absolute bottom-2 left-2">
                  <img
                    v-if="service.id === '1'"
                    :src="SakantiLogo"
                    :alt="`${service.title} Logo`"
                    class="h-12 dark:invert"
                  />
                </div>
                <div
                  v-if="service.id !== '1'"
                  class="absolute inset-x-0 bottom-0 p-3 text-white"
                >
                  <h3 class="font-medium text-sm uppercase">
                    {{ service.title }}
                  </h3>
                </div>
              </div>

              <div class="p-4">
                <div class="space-y-3 text-gray-600 dark:text-gray-400">
                  <template v-if="service.additionalInfo">
                    <p
                      v-for="(info, index) in service.additionalInfo"
                      :key="index"
                      class="italic text-anvaya-blue dark:text-anvaya-light text-sm"
                    >
                      {{ info }}
                    </p>
                  </template>

                  <p class="text-sm">{{ service.description }}</p>

                  <div class="space-y-2 text-xs">
                    <div
                      class="flex items-center text-anvaya-blue dark:text-anvaya-light"
                    >
                      <i class="mdi mdi-clock-outline mr-2"></i>
                      <span>Operation hours: {{ service.operatingHours }}</span>
                    </div>
                  </div>

                  <button
                    v-if="service.hasBooking"
                    class="w-full mt-4 py-2.5 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-lg hover:bg-anvaya-blue/20 dark:hover:bg-anvaya-light/20 transition-colors font-small"
                  >
                  <a href="https://anvayabali.com/sakantispa/" target="_blank">Show Menu</a>
                    
                    <!-- {{
                      service.title === "Sakanti Spa" ? "Treatment" : "Session"
                    }} -->
                  </button>
                </div>
              </div>
            </div>
          </div>
=======
      <!-- Featured Service (Sakanti Spa) -->
      <!-- <div v-if="wellnessServices[0]" class="relative overflow-hidden rounded-2xl shadow-lg">
        <div class="relative h-[300px]">
          <img
            :src="wellnessServices[0].image"
            :alt="wellnessServices[0].title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-6 w-full">
            <img
              :src="SakantiLogo"
              alt="Sakanti Spa Logo"
              class="h-16 mb-4 dark:invert"
            />
            <p class="text-white text-sm mb-4">{{ wellnessServices[0].description }}</p>
            <button
              @click="handleBookNow('Sakanti Spa')"
              class="bg-white text-anvaya-blue px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Book Treatment
            </button>
          </div>
        </div>
      </div> -->

      <!-- Other Wellness Services -->
      <div class="grid grid-cols-1 gap-6">
        <div
          v-for="service in wellnessServices.slice(1)"
          :key="service.id"
          class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700"
        >
          <div class="relative h-48">
            <img
              :src="service.image"
              :alt="service.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4">
              <h3 class="text-white font-medium text-lg">{{ service.title }}</h3>
            </div>
          </div>

          <div class="p-4 space-y-4">
            <div class="space-y-2">
              <template v-if="service.additionalInfo">
                <p
                  v-for="(info, index) in service.additionalInfo"
                  :key="index"
                  class="text-anvaya-blue dark:text-anvaya-light text-sm italic"
                >
                  {{ info }}
                </p>
              </template>

              <p class="text-gray-600 dark:text-gray-300 text-sm">
                {{ service.description }}
              </p>
            </div>

            <div class="flex items-center text-anvaya-blue dark:text-anvaya-light text-sm">
              <i class="mdi mdi-clock-outline mr-2"></i>
              <span>{{ service.operatingHours }}</span>
            </div>

            <button
              v-if="service.hasBooking"
              @click="handleBookNow(service.title)"
              class="w-full py-3 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-lg hover:bg-anvaya-blue/20 dark:hover:bg-anvaya-light/20 transition-colors font-medium text-sm"
            >
              Book Session
            </button>
          </div>
>>>>>>> dev
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
<<<<<<< HEAD
@keyframes kenburns {
  0% {
    transform: scale(1) translate(0);
  }
  50% {
    transform: scale(1.1) translate(-1%, -1%);
  }
  100% {
    transform: scale(1) translate(0);
  }
}

.animate-kenburns {
  animation: kenburns 15s ease-in-out infinite;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
=======
.wellness {
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 24px 24px;
}

.dark .wellness {
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px);
>>>>>>> dev
}
</style>
