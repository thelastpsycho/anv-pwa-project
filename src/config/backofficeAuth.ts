import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with memory fallback
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  cacheSizeBytes: 100 * 1024 * 1024, // 100MB
});

// Set auth persistence with error handling
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn("Auth persistence failed, falling back to session:", error);
});

// Handle unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  if (event.reason?.name === "AbortError") {
    // Suppress AbortError messages from IndexedDB
    event.preventDefault();
  }
});
