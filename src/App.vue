<script setup lang="ts">
import { ref, onMounted } from "vue";
import BottomNav from "@/components/BottomNav.vue";
import SplashScreen from "@/components/SplashScreen.vue";
import PWAUpdateNotification from "@/components/PWAUpdateNotification.vue";
import { useAppStore } from "@/stores/app";

const showContent = ref(false);
const appStore = useAppStore();

onMounted(() => {
  appStore.initTheme();
});

const handleSplashFinished = () => {
  showContent.value = true;
};
</script>

<template>
  <SplashScreen @finished="handleSplashFinished" />

  <Transition name="fade">
    <div v-if="showContent">
      <main class="min-h-screen bg-white dark:bg-gray-900">
        <router-view v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </main>
      <BottomNav />
      <PWAUpdateNotification />
    </div>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
