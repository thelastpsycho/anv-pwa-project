<template>
  <div class="w-full my-8 py-8">
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-anvaya-gray/10 dark:border-gray-700 transition-all duration-300 overflow-hidden">
      <div class="p-4">
        <div class="flex flex-col items-start text-left">
          <!-- Title and Description -->
          <h2 class="text-lg font-medium text-anvaya-blue dark:text-anvaya-light mb-1 tracking-tight">
            Stay Connected
          </h2>
          <p class="text-gray-500 dark:text-gray-400 mb-3 text-sm leading-relaxed">
            Join our newsletter for exclusive updates, special offers, and insights from The Anvaya Bali.
          </p>

          <!-- Input Group -->
          <div class="w-full">
            <!-- Response Messages -->
            <div v-if="message.text" class="w-full mb-2">
              <div
                :class="[
                  'text-xs font-medium transition-all duration-200',
                  message.type === 'success'
                    ? 'text-green-600/80 dark:text-green-500/80'
                    : 'text-red-500/80 dark:text-red-400/80',
                ]"
              >
                {{ message.text }}
              </div>
            </div>

            <form @submit.prevent="handleSubmit" class="w-full">
              <label for="email-input" class="sr-only">Email Address</label>
              <div class="relative flex w-full">
                <input
                  id="email-input"
                  ref="emailInput"
                  v-model="email"
                  type="email"
                  :disabled="isSubmitting"
                  :class="[
                    'w-full px-4 py-2.5 rounded-xl border transition-all duration-200',
                    'focus:outline-none focus:ring-2',
                    isSubmitting
                      ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 cursor-not-allowed'
                      : 'border-anvaya-gray/50 dark:border-gray-600 focus:ring-anvaya-blue/50 dark:focus:ring-anvaya-light/50 bg-white/50 dark:bg-gray-700/50',
                    'text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500',
                  ]"
                  required
                  placeholder="Enter your email address"
                  @input="clearMessage"
                />
                <button
                  type="submit"
                  :disabled="isSubmitting || !email.trim()"
                  :class="[
                    'absolute right-1 top-1 bottom-1 py-2 px-5 text-white rounded-xl transition-all duration-200 font-medium text-sm',
                    isSubmitting || !email.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-anvaya-blue hover:bg-anvaya-blue/90 focus:outline-none focus:ring-2 focus:ring-anvaya-blue',
                  ]"
                >
                  <span v-if="!isSubmitting">Subscribe</span>
                  <span v-else class="flex items-center gap-2">
                    <i class="mdi mdi-loading mdi-spin"></i>
                    Subscribing...
                  </span>
                </button>
              </div>
            </form>
          </div>

          <!-- Terms and Conditions Agreement -->
          <div class="w-full mt-1">
            <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              By clicking "Subscribe", you agree to the
              <router-link
                to="/terms-and-conditions"
                class="text-anvaya-blue dark:text-anvaya-light hover:underline font-medium"
                target="_blank"
              >
                Terms and Conditions
              </router-link>
              and consent to receive marketing communications from The Anvaya Bali.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { submitEmailToInsider, isValidEmail } from '@/services/insiderOne';

const email = ref('');
const isSubmitting = ref(false);
const message = ref<{ type: 'success' | 'error'; text: string }>({ type: 'success', text: '' });

const handleSubmit = async () => {
  // Clear previous message
  message.value = { type: 'success', text: '' };

  // Validate email
  const trimmedEmail = email.value.trim();
  if (!trimmedEmail) {
    message.value = { type: 'error', text: 'Please enter your email address.' };
    return;
  }

  if (!isValidEmail(trimmedEmail)) {
    message.value = { type: 'error', text: 'Please enter a valid email address.' };
    return;
  }

  // Submit to Insider One
  isSubmitting.value = true;
  try {
    const result = await submitEmailToInsider(trimmedEmail);
    message.value = { type: result.success ? 'success' : 'error', text: result.message };

    // Clear email on success
    if (result.success) {
      email.value = '';
    }
  } catch (error) {
    message.value = {
      type: 'error',
      text: 'An unexpected error occurred. Please try again.',
    };
    console.error('Subscription error:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const clearMessage = () => {
  if (message.value.text) {
    message.value = { type: 'success', text: '' };
  }
};
</script>
