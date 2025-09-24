<template>
  <div class="min-h-screen bg-gradient-to-br from-anvaya-light/10 via-white to-anvaya-blue/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-anvaya-blue dark:text-anvaya-light mb-4">
          Terms and Conditions
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Last updated: {{ new Date().toLocaleDateString() }}
        </p>
      </div>

      <!-- Content -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-anvaya-gray/10 dark:border-gray-700 p-8">
        <div class="prose prose-gray dark:prose-invert max-w-none">
          
          <!-- Newsletter Subscription Terms -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-anvaya-blue dark:text-anvaya-light mb-4">
              1. Newsletter Subscription Terms
            </h2>
            <div class="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                By subscribing to The Anvaya Bali newsletter, you agree to receive periodic emails containing:
              </p>
              <ul class="list-disc pl-6 space-y-2">
                <li>Exclusive updates about our resort and services</li>
                <li>Special offers and promotional content</li>
                <li>Insights and information about The Anvaya Bali</li>
                <li>Event announcements and seasonal promotions</li>
              </ul>
              <p>
                <strong>Consent:</strong> By providing your email address and clicking "Subscribe", you explicitly consent to receive marketing communications from The Anvaya Bali.
              </p>
              <p>
                <strong>Unsubscribe:</strong> You may unsubscribe from our newsletter at any time by clicking the unsubscribe link in any email or contacting us directly.
              </p>
            </div>
          </section>

          <!-- Data Collection and Privacy -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-anvaya-blue dark:text-anvaya-light mb-4">
              2. Data Collection and Privacy
            </h2>
            <div class="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Information We Collect:</strong> We collect your email address and may track email engagement metrics to improve our services.
              </p>
              <p>
                <strong>Data Usage:</strong> Your information is used solely for sending newsletter communications and improving our services. We do not sell, trade, or otherwise transfer your personal information to third parties.
              </p>
              <p>
                <strong>Data Security:</strong> We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p>
                <strong>Data Retention:</strong> We retain your email address for as long as you remain subscribed to our newsletter. Upon unsubscribe, we will delete your information within 30 days.
              </p>
            </div>
          </section>

          <!-- General Terms -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-anvaya-blue dark:text-anvaya-light mb-4">
              3. General Terms of Service
            </h2>
            <div class="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Acceptance:</strong> By using our services, you agree to be bound by these terms and conditions.
              </p>
              <p>
                <strong>Modifications:</strong> We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of any changes.
              </p>
              <p>
                <strong>Limitation of Liability:</strong> The Anvaya Bali shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
              </p>
              <p>
                <strong>Governing Law:</strong> These terms are governed by the laws of Indonesia and any disputes shall be resolved in the courts of Bali, Indonesia.
              </p>
            </div>
          </section>

          <!-- Contact Information -->
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-anvaya-blue dark:text-anvaya-light mb-4">
              4. Contact Information
            </h2>
            <div class="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                For questions about these terms and conditions or to unsubscribe from our newsletter, please contact us:
              </p>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p><strong>Email:</strong> info@theanvayabali.com</p>
              </div>
            </div>
          </section>

          <!-- Acknowledgment -->
          <section class="bg-anvaya-blue/5 dark:bg-anvaya-light/5 rounded-lg p-6 border border-anvaya-blue/20 dark:border-anvaya-light/20">
            <h3 class="text-lg font-semibold text-anvaya-blue dark:text-anvaya-light mb-3">
              Acknowledgment
            </h3>
            <p class="text-gray-700 dark:text-gray-300">
              By subscribing to our newsletter, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. If you do not agree to these terms, please do not subscribe to our newsletter.
            </p>
          </section>

        </div>
      </div>

      <!-- Back Button -->
      <div class="text-center mt-8">
        <button 
          class="inline-flex items-center px-6 py-3 bg-anvaya-blue text-white rounded-xl hover:bg-anvaya-blue/90 focus:outline-none focus:ring-2 focus:ring-anvaya-blue transition-all duration-200 font-medium" 
          @click="$router.go(-1)"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this static page
</script>

<style scoped>
.prose {
  line-height: 1.7;
}

.prose h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul {
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.5rem;
}
</style>
