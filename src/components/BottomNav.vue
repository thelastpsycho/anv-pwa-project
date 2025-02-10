<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-anvaya-gray/10 dark:border-gray-800 px-2 py-1"
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
          class="relative flex flex-col items-center py-2 text-anvaya-blue/60 dark:text-anvaya-light/60 hover:text-anvaya-blue dark:hover:text-anvaya-light transition-colors"
          :class="{
            '!text-anvaya-blue dark:!text-anvaya-light': route.path === '/',
          }"
        >
          <div
            class="absolute top-0 left-0 right-0 h-0.5 bg-anvaya-blue transition-all duration-300"
            :class="[route.path === '/' ? 'opacity-100' : 'opacity-0']"
          ></div>
          <i class="mdi mdi-home-outline text-2xl"></i>
          <span class="text-xs">Home</span>
        </router-link>

        <router-link
          to="/chat"
          class="relative flex flex-col items-center py-2 text-anvaya-blue/60 dark:text-anvaya-light/60 hover:text-anvaya-blue dark:hover:text-anvaya-light transition-colors"
          :class="{
            '!text-anvaya-blue dark:!text-anvaya-light': route.path === '/chat',
          }"
        >
          <div
            class="absolute top-0 left-0 right-0 h-0.5 bg-anvaya-blue transition-all duration-300"
            :class="[route.path === '/chat' ? 'opacity-100' : 'opacity-0']"
          ></div>
          <i class="mdi mdi-chat-outline text-2xl"></i>
          <span class="text-xs">Chat</span>
        </router-link>

        <router-link
          to="/map"
          class="relative flex flex-col items-center py-2 text-anvaya-blue/60 dark:text-anvaya-light/60 hover:text-anvaya-blue dark:hover:text-anvaya-light transition-colors"
          :class="{
            '!text-anvaya-blue dark:!text-anvaya-light': route.path === '/map',
          }"
        >
          <div
            class="absolute top-0 left-0 right-0 h-0.5 bg-anvaya-blue transition-all duration-300"
            :class="[route.path === '/map' ? 'opacity-100' : 'opacity-0']"
          ></div>
          <i class="mdi mdi-map text-2xl"></i>
          <span class="text-xs">Map</span>
        </router-link>

        <router-link
          to="/profile"
          class="relative flex flex-col items-center py-2 text-anvaya-blue/60 dark:text-anvaya-light/60 hover:text-anvaya-blue dark:hover:text-anvaya-light transition-colors"
          :class="{
            '!text-anvaya-blue dark:!text-anvaya-light':
              route.path === '/profile',
          }"
        >
          <div
            class="absolute top-0 left-0 right-0 h-0.5 bg-anvaya-blue transition-all duration-300"
            :class="[route.path === '/profile' ? 'opacity-100' : 'opacity-0']"
          ></div>
          <i class="mdi mdi-account-outline text-2xl"></i>
          <span class="text-xs">Profile</span>
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
