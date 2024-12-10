<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  // Redirect to WhatsApp when the chat view is mounted
  window.location.href = "https://wa.me/62811389938";
  router.push("/"); // Fallback to home if redirect fails
});
</script>

<template>
  <div class="chat p-4">
    <div class="text-center text-gray-600">Redirecting to WhatsApp...</div>
  </div>
</template>
