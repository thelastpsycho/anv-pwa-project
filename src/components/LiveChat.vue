<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import type { TawkAPI } from "@/types/tawk";

const authStore = useAuthStore();

const initTawkTo = () => {
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://embed.tawk.to/675808b5af5bfec1dbd9b94a/1ienu41pj";
  script.charset = "UTF-8";
  script.setAttribute("crossorigin", "*");
  document.head.appendChild(script);

  window.Tawk_API = (window.Tawk_API || {}) as TawkAPI;
  window.Tawk_LoadStart = new Date();
};

const removeTawkTo = () => {
  if (window.Tawk_API) {
    window.Tawk_API.hideWidget();
  }
  // Remove the script
  const scripts = document.getElementsByTagName("script");
  for (let script of scripts) {
    if (script.src.includes("tawk.to")) {
      script.remove();
    }
  }
};

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      initTawkTo();
    } else {
      removeTawkTo();
    }
  }
);

onMounted(() => {
  if (authStore.isAuthenticated) {
    initTawkTo();
  }
});
</script>

<template>
  <!-- Tawk.to will automatically inject the chat widget -->
</template>
