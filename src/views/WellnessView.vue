<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/PageHeader.vue";
import SakantiLogo from "@/assets/Sakanti Spa.svg";
import { wellnessServices } from "@/data/wellness";

const isLoaded = ref(false);
const currentIndex = ref(0);
let touchStartX = 0;
let touchEndX = 0;

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});

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
    if (diff > 0 && currentIndex.value < wellnessServices.length - 1) {
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
    <PageHeader title="Wellness & Spa" />

    <div
      class="wellness mb-4"
      :class="[
        'opacity-0 translate-y-5 transition-all duration-600 ease-out',
        isLoaded ? 'opacity-100 translate-y-0' : '',
      ]"
    >
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
                    v-if="service.id === 1"
                    :src="SakantiLogo"
                    :alt="`${service.title} Logo`"
                    class="h-12 dark:invert"
                  />
                </div>
                <div
                  v-if="service.id !== 1"
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
                    Book
                    {{
                      service.title === "Sakanti Spa" ? "Treatment" : "Session"
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  animation: kenburns 10s ease-in-out infinite;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
