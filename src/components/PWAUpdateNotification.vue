<template>
  <div
    v-if="showNotification"
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
      :disabled="updating"
      class="px-4 py-2 bg-anvaya-blue text-white rounded-lg text-sm hover:bg-anvaya-blue/90 transition-colors disabled:opacity-50"
    >
      {{ updating ? "Updating..." : "Update" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const updating = ref(false);

const showNotification = computed(
  () => appStore.serviceWorkerUpdated && !updating.value
);

const updateApp = async () => {
  updating.value = true;

  try {
    // Get the registration
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration?.waiting) {
      // Send message to service worker to skip waiting
      registration.waiting.postMessage({ type: "SKIP_WAITING" });

      // Wait for the new service worker to take control
      await new Promise<void>((resolve) => {
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          resolve();
        });
      });

      // Reset the flag
      appStore.setServiceWorkerUpdated(false);

      // Reload the page
      window.location.reload();
    }
  } catch (error) {
    console.error("Failed to update:", error);
    updating.value = false;
  }
};
</script>
