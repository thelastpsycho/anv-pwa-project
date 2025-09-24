<template>
  <form class="space-y-4" @submit.prevent="handleLogin">
    <div>
      <label>Room Number</label>
      <input v-model="roomNumber" type="text" required />
    </div>
    <div>
      <label>Password</label>
      <input v-model="password" type="password" required />
    </div>
    <button type="submit">Login</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const roomNumber = ref("");
const password = ref("");

async function handleLogin() {
  try {
    await auth.loginProfile(roomNumber.value, password.value);
    // Handle successful login (redirect, etc.)
  } catch (error) {
    // Handle error
  }
}
</script>
