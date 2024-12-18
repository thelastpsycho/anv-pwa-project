import { register } from "register-service-worker";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();

register(`${import.meta.env.BASE_URL}service-worker.js`, {
  ready() {
    console.log("App is being served from cache by a service worker.");
  },
  registered() {
    console.log("Service worker has been registered.");
  },
  cached() {
    console.log("Content has been cached for offline use.");
  },
  updatefound() {
    console.log("New content is downloading.");
  },
  updated(registration) {
    console.log("New content is available; please refresh.");
    appStore.setServiceWorkerUpdated(true);

    // Add event listener for the skip waiting message
    if (registration.waiting) {
      registration.waiting.addEventListener("statechange", (event) => {
        if ((event.target as ServiceWorker).state === "activated") {
          window.location.reload();
        }
      });
    }
  },
  offline() {
    console.log(
      "No internet connection found. App is running in offline mode."
    );
  },
  error(error) {
    console.error("Error during service worker registration:", error);
  },
});

// Add event listener for the skip waiting message
navigator.serviceWorker.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
  }
});
