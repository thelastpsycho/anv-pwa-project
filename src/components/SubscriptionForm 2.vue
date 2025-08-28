<template>
  <div class="p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div id="mc_embed_signup">
        <form
          action="https://anvayabali.us15.list-manage.com/subscribe/post?u=12495703fa3cb1ec5555971b7&amp;id=070125699b&amp;f_id=0041a5e0f0"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          class="validate"
          target="_blank"
          novalidate
        >
          <div id="mc_embed_signup_scroll" class="flex flex-col items-center text-center">
            <h2 class="text-xl font-semibold text-anvaya-blue dark:text-anvaya-light mb-2">
              Join Our Newsletter
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Subscribe to receive our latest news, updates, and special offers directly in your inbox.
            </p>

            <div class="w-full max-w-lg">
              <div class="flex flex-col sm:flex-row gap-2">
                <div class="mc-field-group relative flex-grow">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="mdi mdi-email-outline text-anvaya-blue/60 dark:text-anvaya-light/60 text-xl" aria-hidden="true"></i>
                  </div>
                  <input
                    type="email"
                    name="EMAIL"
                    class="required email w-full pl-10 pr-4 py-3 rounded-lg border border-anvaya-gray/10 dark:border-gray-700 focus:outline-none focus:border-anvaya-blue/30 dark:focus:border-anvaya-light/30 bg-white/50 dark:bg-gray-800/50 text-anvaya-blue dark:text-anvaya-light"
                    id="mce-EMAIL"
                    required
                    placeholder="Your email address"
                    value=""
                  />
                </div>
                <div class="optionalParent">
                  <div class="clear foot">
                    <button
                      type="submit"
                      name="subscribe"
                      id="mc-embedded-subscribe"
                      class="button w-full sm:w-auto py-3 px-6 bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90 transition-colors font-medium flex items-center justify-center"
                    >
                      <span>Subscribe</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mailchimp hidden fields -->
            <div hidden>
              <input type="hidden" name="tags" value="2558060" />
            </div>
            <div id="mce-responses" class="clear foot mt-4 w-full max-w-lg">
              <div class="response text-red-500 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 dark:text-red-400" id="mce-error-response" style="display: none"></div>
              <div class="response text-green-500 p-3 rounded-lg bg-green-50 dark:bg-green-500/10 dark:text-green-400" id="mce-success-response" style="display: none"></div>
            </div>
            <div style="position: absolute; left: -5000px;" aria-hidden="true">
              <input type="text" name="b_12495703fa3cb1ec5555971b7_070125699b" tabindex="-1" value="" />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

declare global {
  interface Window {
    fnames: string[];
    ftypes: string[];
    jQuery: any;
    $mcj: any;
  }
}

onMounted(() => {
  // The external stylesheet is not strictly needed with Tailwind styling,
  // but Mailchimp's validation script might rely on some of its classes.
  // We'll keep it to ensure functionality isn't broken.
  const link = document.createElement('link');
  link.href = '//cdn-images.mailchimp.com/embedcode/classic-061523.css';
  link.rel = 'stylesheet';
  link.type = 'text/css';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
  script.type = 'text/javascript';
  script.onload = () => {
    // Mailchimp validation script loaded
    (function ($: any) {
      window.fnames = new Array();
      window.ftypes = new Array();
      fnames[0] = "EMAIL";
      ftypes[0] = "email";
      fnames[2] = "LNAME";
      ftypes[2] = "text";
      fnames[3] = "ADDRESS";
      ftypes[3] = "address";
      fnames[4] = "PHONE";
      ftypes[4] = "phone";
      fnames[5] = "BIRTHDAY";
      ftypes[5] = "birthday";
      fnames[6] = "COMPANY";
      ftypes[6] = "text";
      fnames[7] = "MMERGE7";
      ftypes[7] = "date";
    })(window.jQuery);
    window.$mcj = window.jQuery.noConflict(true);
  };
  document.head.appendChild(script);
});
</script>

<style scoped>
/* Most styles are now handled by Tailwind CSS utility classes */
#mc_embed_signup {
  background: transparent;
  width: 100%;
}

/* The button color is handled by Tailwind's bg-anvaya-blue class */
.button {
  /* You can add custom base styles for the button if needed, but colors are in the template */
}

/* Making Mailchimp responses more integrated with the design */
#mce-responses .response {
  margin-top: 1rem;
  text-align: left;
  font-weight: 500;
}
</style>