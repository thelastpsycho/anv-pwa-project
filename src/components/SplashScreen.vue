<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center transition-opacity duration-500"
    :class="{ 'opacity-0': isClosing }"
  >
    <img
      src="https://www.theanvayabali.com/wp-content/themes/wcl/images/logo-theanvaya.svg"
      alt="The Anvaya Logo"
      class="w-32 animate-splash mb-8"
    />
    <div class="w-48 h-0.5 bg-anvaya-gray/10 rounded-full overflow-hidden">
      <div
        class="h-full bg-anvaya-blue rounded-full transition-all duration-200 ease-out"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Cookies from "js-cookie";

const show = ref(true);
const isClosing = ref(false);
const progress = ref(0);

const emit = defineEmits<{
  (e: "finished"): void;
}>();

onMounted(() => {
  const lastShown = Cookies.get("lastSplashScreen");
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;

  // Skip splash if shown in last 30 minutes
  if (lastShown && now - Number(lastShown) < thirtyMinutes) {
    show.value = false;
    emit("finished");
    return;
  }

  // Set cookie with current timestamp
  Cookies.set("lastSplashScreen", now.toString(), { expires: 1 }); // expires in 1 day

  // Progress animation over 2 seconds
  const duration = 2000;
  const interval = 20;
  const steps = duration / interval;
  const increment = 100 / steps;

  const progressInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value = Math.min(100, progress.value + increment);
    } else {
      clearInterval(progressInterval);
      isClosing.value = true;
      setTimeout(() => {
        show.value = false;
        emit("finished");
      }, 500);
    }
  }, interval);
});
</script>

<style scoped>
.animate-splash {
  animation: splash 1s ease-out;
}

@keyframes splash {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
