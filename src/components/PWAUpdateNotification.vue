<template>
  <div
    v-if="appStore.serviceWorkerUpdated"
    class="fixed bottom-20 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-anvaya-gray/10 dark:border-gray-700 p-4 flex items-center justify-between"
  >
    <div class="flex items-center gap-3">
      <i
        class="mdi mdi-update text-anvaya-blue dark:text-anvaya-light text-xl"
      ></i>
      <span class="text-sm text-anvaya-blue dark:text-anvaya-light">
        New version available
      </span>
    </div>
    <button
      @click="updateApp"
      class="px-4 py-2 bg-anvaya-blue text-white rounded-lg text-sm hover:bg-anvaya-blue/90 transition-colors"
    >
      Update
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();

const updateApp = () => {
  window.location.reload();
};
</script>
