<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <!-- Login Form -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-8">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <div class="relative">
              <i
                class="mdi mdi-email absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              ></i>
              <input
                v-model="email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <div class="relative">
              <i
                class="mdi mdi-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              ></i>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-12 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <i
                  :class="[showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye']"
                ></i>
              </button>
            </div>
          </div>

          <div v-if="error" class="text-red-500 text-xs px-1">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm hover:bg-gray-800 transition-colors relative font-medium"
          >
            <span :class="{ 'opacity-0': loading }">Sign In</span>
            <div
              v-if="loading"
              class="absolute inset-0 flex items-center justify-center"
            >
              <svg
                class="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </button>
        </form>
      </div>

      <!-- Footer -->
      <p class="text-center text-gray-500 text-xs mt-6">
        © {{ new Date().getFullYear() }} The Anvaya Beach Resort Bali. All
        rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

async function handleLogin() {
  loading.value = true;
  error.value = "";

  try {
    // Check if we can connect to Firestore
    try {
      await fetch("https://firestore.googleapis.com", {
        method: "HEAD",
        mode: "no-cors",
      });
    } catch (e) {
      throw new Error(
        "Unable to connect to server. Please check your internet connection."
      );
    }

    await authStore.loginBackoffice(email.value, password.value);
    router.push({ name: "backoffice-dashboard" });
  } catch (e: any) {
    error.value =
      e.message === "Firebase: Error (auth/invalid-credential)."
        ? "Invalid email or password"
        : e.message || "An error occurred during sign in";
  } finally {
    loading.value = false;
  }
}
</script>
