<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-500"
    :class="{ 'opacity-0': isClosing }"
  >
    <img
      src="https://www.theanvayabali.com/wp-content/themes/wcl/images/logo-theanvaya.svg"
      alt="The Anvaya Logo"
      class="w-32 animate-splash"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const show = ref(true);
const isClosing = ref(false);

const emit = defineEmits<{
  (e: "finished"): void;
}>();

onMounted(() => {
  // Start fade out after 2 seconds
  setTimeout(() => {
    isClosing.value = true;
    // Remove splash screen after fade animation
    setTimeout(() => {
      show.value = false;
      emit("finished");
    }, 500);
  }, 2000);
});
</script>

<style scoped>
.animate-splash {
  animation: splash 1.5s ease-out;
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
