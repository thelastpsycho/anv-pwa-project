import "./assets/main.css";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useAppStore } from "./stores/app";
import type { BeforeInstallPromptEvent } from "@/types";

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

// Service Worker registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      // Check for updates
      registration.addEventListener("controllerchange", () => {
        appStore.setServiceWorkerUpdated(true);
      });

      // Check if there's an update on page load
      registration.update();
    })
    .catch((error) => {
      console.error("Service worker registration failed:", error);
    });
}

// Online/Offline status handlers
window.addEventListener("online", () => appStore.updateOnlineStatus(true));
window.addEventListener("offline", () => appStore.updateOnlineStatus(false));

app.use(router);

app.mount("#app");
