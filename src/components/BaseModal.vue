<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

defineProps<{
  show: boolean;
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape") emit("close");
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/30 backdrop-blur-sm"
        @click="emit('close')"
      ></div>

      <!-- Modal -->
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div
          class="relative w-full max-w-sm mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-4 border-b border-anvaya-gray/20"
          >
            <h3 class="text-lg font-medium text-anvaya-blue">{{ title }}</h3>
            <button
              class="p-1 text-anvaya-blue/60 hover:text-anvaya-blue transition-colors"
              @click="emit('close')"
            >
              <i class="mdi mdi-close text-xl"></i>
            </button>
          </div>

          <!-- Content -->
          <div class="p-4 overflow-y-auto">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
