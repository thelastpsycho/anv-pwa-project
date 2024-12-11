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
      if (this.isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("darkMode", this.isDarkMode.toString());
    },
    initTheme() {
      const savedTheme = localStorage.getItem("darkMode");
      if (savedTheme !== null) {
        this.isDarkMode = savedTheme === "true";
      } else {
        this.isDarkMode = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
      }
      if (this.isDarkMode) {
        document.documentElement.classList.add("dark");
      }
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
