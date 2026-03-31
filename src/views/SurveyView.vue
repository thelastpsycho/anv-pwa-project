<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const missingFacility = ref("");
const whyImprove = ref("");
const isSubmitting = ref(false);
const showThankYou = ref(false);

const handleSubmit = async () => {
  if (!missingFacility.value.trim() || !whyImprove.value.trim()) return;

  isSubmitting.value = true;

  try {
    await fetch("https://workflow.anvayabali.com/webhook/75295790-e259-46c2-8ee5-dd9abd61a6c6", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mainQuestion: missingFacility.value.trim(),
        followUp: whyImprove.value.trim(),
        timestamp: new Date().toISOString()
      })
    });

    // Reset form after submission
    missingFacility.value = "";
    whyImprove.value = "";

    // Show thank you message
    showThankYou.value = true;

    // Navigate back to home after showing thank you
    setTimeout(() => {
      router.push({ name: "home" });
    }, 4000);
  } catch (error) {
    console.error("Error submitting guest feedback:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="mb-6 flex items-center gap-2 text-anvaya-blue dark:text-anvaya-light hover:underline"
      >
        <i class="mdi mdi-arrow-left"></i>
        <span>Back</span>
      </button>

      <!-- Thank You State -->
      <div v-if="showThankYou" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
        <div class="mb-6 flex justify-center">
          <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <i class="mdi mdi-check-circle text-5xl text-green-500 dark:text-green-400"></i>
          </div>
        </div>
        <h2 class="text-3xl font-semibold text-anvaya-blue dark:text-anvaya-light mb-3">
          Thank You!
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">
          Your feedback helps us improve your experience.
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-500">
          Redirecting you back to the home page...
        </p>
      </div>

      <!-- Survey Form -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-anvaya-blue to-anvaya-blue/80 dark:from-anvaya-light dark:to-anvaya-light/80 px-6 py-8">
          <div class="flex items-center gap-4 mb-3">
            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i class="mdi mdi-comment-text-outline text-2xl text-white"></i>
            </div>
            <div>
              <h1 class="text-2xl font-semibold text-white">
                We Value Your Feedback
              </h1>
              <p class="text-sm text-white/80 mt-1">
                Help us elevate your experience
              </p>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="p-6 md:p-8">
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Question 1 -->
            <div class="space-y-3">
              <label for="missingFacility" class="flex items-start gap-2 text-base font-medium text-gray-700 dark:text-gray-200">
                <span class="flex-shrink-0 w-6 h-6 bg-anvaya-blue dark:bg-anvaya-light text-white rounded-full flex items-center justify-center text-sm">1</span>
                <span class="flex-1">What facility or experience do you feel is missing at our hotel?</span>
                <span class="text-red-500">*</span>
              </label>
              <textarea
                id="missingFacility"
                v-model="missingFacility"
                rows="4"
                required
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-anvaya-blue/50 focus:border-anvaya-blue dark:focus:ring-anvaya-light/50 dark:focus:border-anvaya-light text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors resize-none"
                placeholder="Share your thoughts here..."
              ></textarea>
            </div>

            <!-- Question 2 -->
            <div class="space-y-3">
              <label for="whyImprove" class="flex items-start gap-2 text-base font-medium text-gray-700 dark:text-gray-200">
                <span class="flex-shrink-0 w-6 h-6 bg-anvaya-blue dark:bg-anvaya-light text-white rounded-full flex items-center justify-center text-sm">2</span>
                <span class="flex-1">Why would this improve your stay?</span>
                <span class="text-red-500">*</span>
              </label>
              <textarea
                id="whyImprove"
                v-model="whyImprove"
                rows="4"
                required
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-anvaya-blue/50 focus:border-anvaya-blue dark:focus:ring-anvaya-light/50 dark:focus:border-anvaya-light text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors resize-none"
                placeholder="How does this add value for you?"
              ></textarea>
            </div>

            <!-- Submit Section -->
            <div class="pt-6 flex flex-col sm:flex-row gap-3 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="goBack"
                class="px-6 py-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || !missingFacility.trim() || !whyImprove.trim()"
                class="flex-1 px-6 py-3 text-base font-medium text-white bg-anvaya-blue hover:bg-anvaya-blue/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-md flex items-center justify-center"
              >
                <i v-if="isSubmitting" class="mdi mdi-loading mdi-spin mr-2"></i>
                <span v-else class="flex items-center gap-2">
                  <i class="mdi mdi-send"></i>
                  Submit Feedback
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Info Box -->
      <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
        <div class="flex items-start gap-3">
          <i class="mdi mdi-information-outline text-anvaya-blue dark:text-anvaya-light text-xl flex-shrink-0 mt-0.5"></i>
          <div>
            <h3 class="text-sm font-medium text-anvaya-blue dark:text-anvaya-light mb-1">
              Your Privacy Matters
            </h3>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Your feedback is submitted securely and will be used to improve our services. We appreciate you taking the time to share your thoughts with us.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
