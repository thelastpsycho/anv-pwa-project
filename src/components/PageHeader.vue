<script setup lang="ts">
import { useRouter } from "vue-router";

defineProps<{
  title: string;
}>();

const router = useRouter();

const goBack = () => {
  router.push("/");
};
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-anvaya-gray/10 dark:border-gray-800"
  >
    <div class="flex items-center gap-3 px-4 py-3">
      <button
        @click="goBack"
        class="p-2 -ml-2 rounded-lg hover:bg-anvaya-blue/5 dark:hover:bg-anvaya-light/5 text-anvaya-blue dark:text-anvaya-light transition-colors"
      >
        <i class="mdi mdi-arrow-left text-xl"></i>
      </button>
      <h1
        class="text-md font-medium text-anvaya-blue dark:text-anvaya-light uppercase"
      >
        {{ title }}
      </h1>
    </div>
  </div>

  <!-- Spacer to prevent content from hiding under the header -->
  <div class="h-[60px]"></div>
</template>
