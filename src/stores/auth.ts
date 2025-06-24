import { defineStore } from "pinia";
import { auth } from "@/config/firebase";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { authenticateWithWifi } from "@/services/wifiAuth";

interface ProfileUser {
  roomNumber: string;
}

interface State {
  backofficeUser: User | null;
  profileUser: ProfileUser | null;
  loading: boolean;
  isBackoffice: boolean;
  credentials: {
    isAdmin?: boolean;
  } | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): State => ({
    backofficeUser: null,
    profileUser: null,
    loading: true,
    isBackoffice: false,
    credentials: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.backofficeUser || !!state.profileUser,
    roomNumber: (state) => state.profileUser?.roomNumber || null,
  },

  actions: {
    async init() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            this.backofficeUser = user;
            this.isBackoffice = true;
          }
          this.loading = false;
          resolve(user);
        });
      });
    },

    async loginBackoffice(email: string, password: string) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.backofficeUser = userCredential.user;
        this.isBackoffice = true;
        return true;
      } catch (error) {
        console.error("Backoffice login error:", error);
        throw error;
      }
    },

    async loginProfile(roomNumber: string, password: string) {
      try {
        const isValid = await authenticateWithWifi(roomNumber, password);
        if (isValid) {
          this.profileUser = { roomNumber };
          this.isBackoffice = false;
          this.credentials = { isAdmin: false };
          return true;
        }
        throw new Error("Invalid credentials");
      } catch (error) {
        console.error("Profile login error:", error);
        if (error instanceof Error) {
          throw new Error(`Authentication failed: ${error.message}`);
        }
        throw error;
      }
    },

    logout() {
      if (this.isBackoffice) {
        auth.signOut();
        this.backofficeUser = null;
      } else {
        this.profileUser = null;
      }
      this.isBackoffice = false;
    },

    async signOut() {
      try {
        await firebaseSignOut(auth);
      } catch (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    }
  },
});
