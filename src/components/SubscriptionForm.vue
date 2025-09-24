<template>
  <div class="w-full my-8 py-8">
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-anvaya-gray/10 dark:border-gray-700 transition-all duration-300 overflow-hidden">
      <div class="p-4">
        <div id="mc_embed_signup">
          <form
            id="mc-embedded-subscribe-form"
            action="https://anvayabali.us15.list-manage.com/subscribe/post?u=12495703fa3cb1ec5555971b7&id=070125699b&f_id=0041a5e0f0"
            method="post"
            name="mc-embedded-subscribe-form"
            class="validate"
            target="_blank"
            novalidate
          >
            <div id="mc_embed_signup_scroll" class="flex flex-col items-start text-left">
              <!-- Title and Description -->
              <h2 class="text-lg font-medium text-anvaya-blue dark:text-anvaya-light mb-1 tracking-tight">
                Stay Connected
              </h2>
              <p class="text-gray-500 dark:text-gray-400 mb-3 text-sm leading-relaxed">
                Join our newsletter for exclusive updates, special offers, and insights from The Anvaya Bali.
              </p>

              <!-- Input Group -->
              <div class="w-full">
                <div id="mce-responses" class="w-full mb-2">
                  <div id="mce-error-response" class="response text-red-500/80 dark:text-red-400/80 text-xs" style="display: none"></div>
                  <div id="mce-success-response" class="response text-green-600/80 dark:text-green-500/80 text-xs" style="display: none"></div>
                </div>
                <div class="mc-field-group">
                  <label for="mce-EMAIL" class="sr-only">Email Address</label>
                  <div class="relative flex w-full">
                    <input
                      id="mce-EMAIL"
                      type="email"
                      name="EMAIL"
                      class="required email w-full px-4 py-2.5 rounded-xl border border-anvaya-gray/50 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-anvaya-blue/50 dark:focus:ring-anvaya-light/50 bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                      required
                      placeholder="Enter your email address"
                      value=""
                    />
                    <button
                      id="mc-embedded-subscribe"
                      type="submit"
                      name="subscribe"
                      class="absolute right-1 top-1 bottom-1 py-2 px-5 bg-anvaya-blue text-white rounded-xl hover:bg-anvaya-blue/90 focus:outline-none focus:ring-2 focus:ring-anvaya-blue transition-all duration-200 font-medium text-sm"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
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

              <!-- Mailchimp hidden fields -->
              <div hidden>
                <input type="hidden" name="tags" value="2558060" />
              </div>
              <div style="position: absolute; left: -5000px;" aria-hidden="true">
                <input type="text" name="b_12495703fa3cb1ec5555971b7_070125699b" tabindex="-1" value="" />
              </div>
            </div>
          </form>
        </div>
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
  // Load jQuery first
  const jQueryScript = document.createElement('script');
  jQueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
  jQueryScript.type = 'text/javascript';
  jQueryScript.async = true;
  jQueryScript.onerror = () => {
    console.error('Failed to load jQuery');
    const errorResponse = document.getElementById('mce-error-response');
    if (errorResponse) {
      errorResponse.style.display = 'block';
      errorResponse.textContent = 'Failed to load subscription form. Please try again later.';
    }
  };

  // Load Mailchimp script after jQuery
  jQueryScript.onload = () => {
    const mailchimpScript = document.createElement('script');
    mailchimpScript.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
    mailchimpScript.type = 'text/javascript';
    mailchimpScript.async = true;
    mailchimpScript.onerror = () => {
      console.error('Failed to load Mailchimp validation script');
      const errorResponse = document.getElementById('mce-error-response');
      if (errorResponse) {
        errorResponse.style.display = 'block';
        errorResponse.textContent = 'Failed to load subscription form. Please try again later.';
      }
    };
    mailchimpScript.onload = () => {
      (function ($: any) {
        window.fnames = [];
        window.ftypes = [];
        window.fnames[0] = 'EMAIL';
        window.ftypes[0] = 'email';
      })(window.jQuery);
      window.$mcj = window.jQuery.noConflict(true);
    };
    document.head.appendChild(mailchimpScript);
  };

  document.head.appendChild(jQueryScript);
});
</script>

<style scoped>
#mc_embed_signup {
  background: transparent;
  width: 100%;
}

#mce-responses .response {
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
}

#mc_embed_signup form {
  padding: 0 !important;
}
</style>