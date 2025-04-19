export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export interface AppState {
  isOnline: boolean;
  isDarkMode: boolean;
  isInstallPromptShown: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  isInstalled: boolean;
  serviceWorkerUpdated: boolean;
}