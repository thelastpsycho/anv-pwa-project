import { defineStore } from "pinia";
import { getWifiCredentials } from "@/services/api";

// Master admin credentials
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin",
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    roomNumber: "",
    credentials: null as any,
  }),

  actions: {
    async login(roomNumber: string, password: string) {
      // Check admin credentials first
      if (
        roomNumber === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password
      ) {
        this.isAuthenticated = true;
        this.roomNumber = "admin";
        this.credentials = { isAdmin: true };
        return true;
      }

      try {
        const response = await getWifiCredentials();

        // Find matching credentials
        const credential = response.data.find(
          (cred) =>
            cred.username.trim() === roomNumber && cred.value === password
        );

        if (credential) {
          this.isAuthenticated = true;
          this.roomNumber = roomNumber;
          this.credentials = credential;
          return true;
        }

        return false;
      } catch (error) {
        console.error("Login error:", error);
        return false;
      }
    },

    logout() {
      this.isAuthenticated = false;
      this.roomNumber = "";
      this.credentials = null;
    },
  },
});
