<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div 
      v-if="!hasConsent" 
      class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 z-50"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-start gap-4">
          <div class="p-2 rounded-full bg-anvaya-blue/10 dark:bg-anvaya-blue/20">
            <i class="mdi mdi-cookie text-anvaya-blue text-xl"></i>
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              We value your privacy
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
            </p>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3">
          <button
            class="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            @click="declineCookies"
          >
            Decline All
          </button>
          <button
            class="px-4 py-2 bg-anvaya-blue text-white text-xs font-medium rounded-lg hover:bg-anvaya-blue/90 transition-colors shadow-sm"
            @click="acceptCookies"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const hasConsent = ref(true);

function acceptCookies() {
  localStorage.setItem('cookie-consent', 'accepted');
  hasConsent.value = true;
}

function declineCookies() {
  localStorage.setItem('cookie-consent', 'declined');
  hasConsent.value = true;
}

onMounted(() => {
  const consent = localStorage.getItem('cookie-consent');
  hasConsent.value = !!consent;
});
</script> 