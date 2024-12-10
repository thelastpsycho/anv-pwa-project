import { defineStore } from "pinia";

interface User {
  id: string;
  name: string;
  roomNumber: string;
}

// Test credentials
const TEST_ROOM = "1520";
const TEST_PASSWORD = "1520";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
  }),

  actions: {
    login(roomNumber: string, password: string) {
      // Check against test credentials
      if (roomNumber === TEST_ROOM && password === TEST_PASSWORD) {
        this.user = {
          id: "1",
          name: "Guest Room 123",
          roomNumber,
        };
        this.isAuthenticated = true;
        return true;
      }
      return false;
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});
