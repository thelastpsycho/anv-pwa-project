import "./utils/console-override";

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

// Online/Offline status handlers
window.addEventListener("online", () => appStore.updateOnlineStatus(true));
window.addEventListener("offline", () => appStore.updateOnlineStatus(false));

app.use(router);

app.mount("#app");
