<template>
  <form class="space-y-4" @submit.prevent="handleLogin">
    <div>
      <label>Email</label>
      <input v-model="email" type="email" required />
    </div>
    <div>
      <label>Password</label>
      <input v-model="password" type="password" required />
    </div>
    <p v-if="error" class="text-red-500">{{ error }}</p>
    <button type="submit">Login</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");

async function handleLogin() {
  try {
    await auth.loginBackoffice(email.value, password.value);
    router.push("/backoffice/dashboard"); // or your desired route
  } catch (err) {
    error.value = "Invalid email or password";
  }
}
</script>
