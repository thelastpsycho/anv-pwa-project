<script setup lang="ts">
import { ref } from "vue";
import BottomNav from "@/components/BottomNav.vue";
import SplashScreen from "@/components/SplashScreen.vue";

const showContent = ref(false);

const handleSplashFinished = () => {
  showContent.value = true;
};
</script>

<template>
  <SplashScreen @finished="handleSplashFinished" />

  <Transition name="fade">
    <div v-if="showContent">
      <main class="min-h-screen bg-white">
        <RouterView />
      </main>
      <BottomNav />
    </div>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
