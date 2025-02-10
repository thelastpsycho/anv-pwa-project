<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import BottomNav from "@/components/BottomNav.vue";
import SplashScreen from "@/components/SplashScreen.vue";
import PWAUpdateNotification from "@/components/PWAUpdateNotification.vue";
import { useAppStore } from "@/stores/app";
import CookieConsent from "@/components/CookieConsent.vue";
import { trackEvent } from '@/utils/analytics';

const showContent = ref(false);
const appStore = useAppStore();
const route = useRoute();

const isBackoffice = computed(() => route.path.startsWith("/backoffice"));

onMounted(() => {
  appStore.initTheme();
  if (isBackoffice.value) {
    showContent.value = true;
  }
});

const handleSplashFinished = () => {
  showContent.value = true;
};

// Example usage
trackEvent('user_action', 'button_click', 'login_button');
</script>

<template>
  <SplashScreen v-if="!isBackoffice" @finished="handleSplashFinished" />

  <Transition name="fade">
    <div v-if="showContent || isBackoffice">
      <main class="min-h-screen bg-white dark:bg-gray-900">
        <router-view v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </main>
      <BottomNav v-if="!isBackoffice" />
      <PWAUpdateNotification />
      <CookieConsent />
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
