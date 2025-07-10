<template>
  <div
    class="min-h-screen bg-gradient-to-br from-anvaya-blue/10 to-anvaya-blue/5 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
      <div class="p-8 pt-8 pb-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <div class="relative">
              <i
                class="mdi mdi-email-outline absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              ></i>
              <input
                v-model="email"
                type="email"
                id="email"
                required
                class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-anvaya-blue focus:ring-1 focus:ring-anvaya-blue/20 outline-none transition-colors text-sm"
                placeholder="Email Address"
              />
            </div>
          </div>

          <div>
            <div class="relative">
              <i
                class="mdi mdi-lock-outline absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              ></i>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                required
                class="w-full pl-10 pr-12 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-anvaya-blue focus:ring-1 focus:ring-anvaya-blue/20 outline-none transition-colors text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i
                  :class="[showPassword ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-outline']"
                ></i>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                v-model="rememberMe"
                class="h-4 w-4 text-anvaya-blue focus:ring-anvaya-blue border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Keep me signed in
              </label>
            </div>
          </div>

          <div v-if="error" class="text-red-500 text-sm text-center">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-anvaya-blue text-white py-3 rounded-lg text-base font-semibold hover:bg-anvaya-blue/90 transition-colors relative shadow-md"
          >
            <span :class="{ 'opacity-0': loading }">Sign In</span>
            <div
              v-if="loading"
              class="absolute inset-0 flex items-center justify-center"
            >
              <svg
                class="animate-spin h-5 w-5 text-white"
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
const rememberMe = ref(false);

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

    await authStore.loginBackoffice(email.value, password.value, rememberMe.value);
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
