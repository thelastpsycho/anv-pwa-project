<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/PageHeader.vue";
import SakantiLogo from "@/assets/Sakanti Spa.svg";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { WellnessService } from "@/types/wellness";
import { trackEvent } from '@/utils/analytics';

const isLoaded = ref(false);
const wellnessServices = ref<WellnessService[]>([]);

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

function handleBookNow(serviceName: string) {
  trackEvent('wellness', 'book_service', serviceName);
  window.open('https://anvayabali.com/sakantispa/', '_blank');
}

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
  loadServices();
});
</script>

<template>
  <div class="wellness min-h-screen bg-white dark:bg-gray-900">
    <PageHeader title="Wellness & Spa" />

    <div
class="px-4 pb-12 space-y-6"
      :class="[
        'opacity-0 translate-y-5 transition-all duration-600 ease-out',
        isLoaded ? 'opacity-100 translate-y-0' : '',
      ]"
    >
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
              class="w-full py-3 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-lg hover:bg-anvaya-blue/20 dark:hover:bg-anvaya-light/20 transition-colors font-medium text-sm"
              @click="handleBookNow(service.title)"
            >
              Book Session
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wellness {
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 24px 24px;
}

.dark .wellness {
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px);
}
</style>
