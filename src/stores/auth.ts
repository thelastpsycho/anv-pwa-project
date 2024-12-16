import { defineStore } from "pinia";
import { auth } from "@/config/firebase";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

interface State {
  user: User | null;
  loading: boolean;
  roomNumber: string | null;
  credentials: {
    isAdmin?: boolean;
  } | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): State => ({
    user: null,
    loading: true,
    roomNumber: null,
    credentials: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async init() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          this.user = user;
          this.loading = false;
          resolve(user);
        });
      });
    },

    async login(email: string, password: string) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.user = userCredential.user;
        return true;
      } catch (error) {
        console.error("Login error:", error);
        return false;
      }
    },

    async signOut() {
      try {
        await firebaseSignOut(auth);
        this.user = null;
        return true;
      } catch (error) {
        console.error("Logout error:", error);
        return false;
      }
    },
  },
});
