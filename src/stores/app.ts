import { defineStore } from "pinia";
import type { AppState, BeforeInstallPromptEvent } from "@/types";

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    isOnline: navigator.onLine,
    isDarkMode: false,
    isInstallPromptShown: false,
    installPrompt: null as BeforeInstallPromptEvent | null,
    isInstalled: false,
    serviceWorkerUpdated: false,
  }),
  actions: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    },
    updateOnlineStatus(status: boolean) {
      this.isOnline = status;
    },
    setInstallPrompt(event: BeforeInstallPromptEvent | null) {
      this.installPrompt = event;
      this.isInstallPromptShown = !!event;
    },
    async installPWA() {
      if (!this.installPrompt) return;
      await this.installPrompt.prompt();
      this.installPrompt = null;
      this.isInstallPromptShown = false;
      this.isInstalled = true;
    },
    setServiceWorkerUpdated(value: boolean) {
      this.serviceWorkerUpdated = value;
    },
  },
});
