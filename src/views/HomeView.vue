<script setup lang="ts">
import { ref, onMounted } from "vue";
import { amenities } from "@/data/amenities";

const isLoaded = ref(false);

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
