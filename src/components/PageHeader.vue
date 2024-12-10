<script setup lang="ts">
import { useRouter } from "vue-router";

defineProps<{
  title: string;
}>();

const router = useRouter();

const goBack = () => {
  router.push("/");
};
</script>

<template>
  <div class="flex items-center gap-3 mb-6">
    <button
      @click="goBack"
      class="p-2 rounded-lg hover:bg-anvaya-blue/5 text-anvaya-blue transition-colors"
    >
      <i class="mdi mdi-arrow-left text-2xl"></i>
    </button>
    <h1 class="text-2xl font-medium text-anvaya-blue">{{ title }}</h1>
  </div>
</template>
