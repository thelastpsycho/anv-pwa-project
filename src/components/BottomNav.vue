<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 bg-white border-t border-anvaya-gray/10 px-2 py-1"
  >
    <div class="flex items-center">
      <div class="w-[30%] pl-4">
        <img
          src="https://www.theanvayabali.com/wp-content/themes/wcl/images/logo-theanvaya.svg"
          alt="Anvaya Logo"
          class="h-6"
        />
      </div>
      <div class="w-[70%] flex justify-around">
        <router-link
          to="/"
          class="relative flex flex-col items-center py-2 text-anvaya-blue/60 hover:text-anvaya-blue transition-colors"
          :class="{ '!text-anvaya-blue': route.path === '/' }"
        >
          <i class="mdi mdi-home-outline text-2xl"></i>
          <span class="text-xs mt-0.5">Home</span>
          <div
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-anvaya-blue rounded-full transition-all"
            :class="
              route.path === '/' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            "
          ></div>
        </router-link>

        <a
          href="https://wa.me/62811389938"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center py-2 text-anvaya-blue/60 hover:text-anvaya-blue transition-colors"
        >
          <i class="mdi mdi-whatsapp text-2xl"></i>
          <span class="text-xs mt-0.5">Chat</span>
        </a>

        <router-link
          to="/profile"
          class="relative flex flex-col items-center py-2 text-anvaya-blue/60 hover:text-anvaya-blue transition-colors"
          :class="{ '!text-anvaya-blue': route.path === '/profile' }"
        >
          <i class="mdi mdi-account-outline text-2xl"></i>
          <span class="text-xs mt-0.5">Profile</span>
          <div
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-anvaya-blue rounded-full transition-all"
            :class="
              route.path === '/profile'
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-0'
            "
          ></div>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style>
@media (max-width: 360px) {
  .text-xs {
    font-size: 0.625rem;
  }
  .text-2xl {
    font-size: 1.25rem;
  }
  .min-w-\[64px\] {
    min-width: 56px;
  }
}
</style>
