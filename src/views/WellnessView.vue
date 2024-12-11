<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/PageHeader.vue";
import SakantiLogo from "@/assets/Sakanti Spa.svg";

const isLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});
</script>

<template>
  <div class="wellness px-4 pb-4">
    <PageHeader title="Wellness & Spa" />

    <div
      class="wellness pt-4 px-4 mb-4"
      :class="[
        'opacity-0 translate-y-5 transition-all duration-600 ease-out',
        isLoaded ? 'opacity-100 translate-y-0' : '',
      ]"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-anvaya-gray/10 dark:border-gray-700"
      >
        <div class="relative">
          <img
            src="https://www.theanvayabali.com/wp-content/uploads/2023/02/Sakanti_Spa_Bed_21050x700.jpg"
            alt="Sakanti Spa"
            class="w-full h-64 object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          ></div>
        </div>

        <div class="p-6">
          <img
            :src="SakantiLogo"
            alt="Sakanti Spa Logo"
            class="h-12 mb-4 dark:invert"
          />

          <div class="space-y-4 text-gray-600 dark:text-gray-400">
            <p class="italic text-anvaya-blue dark:text-anvaya-light">
              "Sakanti is an ancient sanskrit word meaning 'the beautiful sheen
              of a woman's child'"
            </p>

            <p>
              Sakanti Spa offers an oasis of serenity on the Island of the Gods
              – the ultimate barefoot sanctuary for Spa and Beauty rituals on
              this mystical island.
            </p>

            <div class="space-y-2 text-sm">
              <div
                class="flex items-center text-anvaya-blue dark:text-anvaya-light"
              >
                <i class="mdi mdi-clock-outline mr-2"></i>
                <span>Operation hours: 9 a.m. to 9 p.m.</span>
              </div>
            </div>

            <button
              class="w-full mt-4 py-2.5 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-lg hover:bg-anvaya-blue/20 dark:hover:bg-anvaya-light/20 transition-colors font-medium"
            >
              Book Treatment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
