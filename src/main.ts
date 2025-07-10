import "./utils/console-override";

import "./assets/main.css";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import clickOutside from "./directives/click-outside";
import { useAppStore } from "./stores/app";
import type { BeforeInstallPromptEvent } from "@/types";
import { initializeGoogleAnalytics } from './utils/analytics';
import { initializePWA } from './services/pwa';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// Initialize store
const appStore = useAppStore();

// PWA install prompt handler
window.addEventListener("beforeinstallprompt", (event: Event) => {
  event.preventDefault();
  appStore.setInstallPrompt(event as BeforeInstallPromptEvent);
});

// PWA installed handler
window.addEventListener("appinstalled", () => {
  appStore.setInstallPrompt(null);
  appStore.isInstalled = true;
});

// Online/Offline status handlers
window.addEventListener("online", () => appStore.updateOnlineStatus(true));
window.addEventListener("offline", () => appStore.updateOnlineStatus(false));

app.use(router);
app.directive('click-outside', clickOutside);

// Add this after creating the app but before mounting
if (import.meta.env.PROD) {
  initializeGoogleAnalytics();
}

app.mount("#app");

// Initialize PWA features
initializePWA().catch(console.error);
