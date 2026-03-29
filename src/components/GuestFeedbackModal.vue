<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: { missingFacility: string; whyImprove: string }];
}>();

const missingFacility = ref("");
const whyImprove = ref("");
const isSubmitting = ref(false);
const showThankYou = ref(false);

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.show && !showThankYou.value) emit("close");
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});

const handleSubmit = () => {
  if (!missingFacility.value.trim() || !whyImprove.value.trim()) return;

  isSubmitting.value = true;

  // Simulate a brief submission delay for better UX
  setTimeout(() => {
    emit("submit", {
      missingFacility: missingFacility.value.trim(),
      whyImprove: whyImprove.value.trim()
    });

    // Reset form after submission
    missingFacility.value = "";
    whyImprove.value = "";
    isSubmitting.value = false;

    // Show thank you message
    showThankYou.value = true;

    // Close modal after showing thank you
    setTimeout(() => {
      showThankYou.value = false;
      emit("close");
    }, 2000);
  }, 500);
};
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="show" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div class="min-h-screen w-full flex items-center justify-center py-8">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        @click="!showThankYou && emit('close')"
      ></div>

      <!-- Modal Content -->
      <div
        class="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        @click.stop
      >
        <!-- Thank You State -->
        <div v-if="showThankYou" class="p-8 text-center">
          <div class="mb-4 flex justify-center">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <i class="mdi mdi-check-circle text-4xl text-green-500 dark:text-green-400"></i>
            </div>
          </div>
          <h3 class="text-2xl font-semibold text-anvaya-blue dark:text-anvaya-light mb-2">
            Thank You!
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Your feedback helps us improve your experience.
          </p>
        </div>

        <!-- Form State -->
        <template v-else>
          <!-- Header -->
          <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 class="text-xl font-semibold text-anvaya-blue dark:text-anvaya-light">
                We Value Your Feedback
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Help us elevate your experience.
              </p>
            </div>
            <button
              class="p-2 -mr-2 text-gray-400 hover:text-anvaya-blue dark:hover:text-anvaya-light transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="emit('close')"
            >
              <i class="mdi mdi-close text-xl"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto max-h-[70vh]">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Question 1 -->
              <div class="space-y-2">
                <label for="missingFacility" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  1. What facility or experience do you feel is missing at our hotel? <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="missingFacility"
                  v-model="missingFacility"
                  rows="3"
                  required
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-anvaya-blue/50 focus:border-anvaya-blue dark:focus:ring-anvaya-light/50 dark:focus:border-anvaya-light text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors resize-none"
                  placeholder="Share your thoughts here..."
                ></textarea>
              </div>

              <!-- Question 2 -->
              <div class="space-y-2">
                <label for="whyImprove" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  2. Why would this improve your stay? <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="whyImprove"
                  v-model="whyImprove"
                  rows="3"
                  required
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-anvaya-blue/50 focus:border-anvaya-blue dark:focus:ring-anvaya-light/50 dark:focus:border-anvaya-light text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors resize-none"
                  placeholder="How does this add value for you?"
                ></textarea>
              </div>

              <!-- Footer / Submit -->
              <div class="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  @click="emit('close')"
                  class="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting || !missingFacility.trim() || !whyImprove.trim()"
                  class="px-5 py-2.5 text-sm font-medium text-white bg-anvaya-blue hover:bg-anvaya-blue/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-md flex items-center justify-center min-w-[120px]"
                >
                  <i v-if="isSubmitting" class="mdi mdi-loading mdi-spin mr-2"></i>
                  <span v-else>Submit Feedback</span>
                </button>
              </div>
            </form>
          </div>
        </template>
      </div>
      </div>
    </div>
  </Transition>
</template>
