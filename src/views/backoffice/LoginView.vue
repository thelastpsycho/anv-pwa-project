<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-center mb-6">Backoffice Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-anvaya-blue focus:ring-anvaya-blue"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-anvaya-blue focus:ring-anvaya-blue"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-anvaya-blue text-white rounded-md py-2 hover:bg-anvaya-blue/90"
          :disabled="loading"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>
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
const loading = ref(false);

async function handleLogin() {
  loading.value = true;
  try {
    const success = await authStore.login(email.value, password.value);
    if (success) {
      router.push({ name: "backoffice-dashboard" });
    } else {
      alert("Invalid credentials");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed");
  } finally {
    loading.value = false;
  }
}
</script>
