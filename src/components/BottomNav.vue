<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentRoute = ref(router.currentRoute.value.name);

const navItems = [
  { name: "home", icon: "mdi mdi-home-variant", label: "Home" },
  { name: "restaurant", icon: "mdi mdi-silverware", label: "Dining" },
  { name: "activities", icon: "mdi mdi-beach", label: "Activities" },
  { name: "faq", icon: "mdi mdi-information", label: "Info" },
];

const navigate = (routeName: string) => {
  router.push({ name: routeName });
  currentRoute.value = routeName;
};
</script>

<template>
  <nav
    class="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg shadow-anvaya-blue/10 border border-anvaya-light/20"
  >
    <div class="flex items-center justify-around p-2">
      <button
        v-for="item in navItems"
        :key="item.name"
        :class="[
          'relative flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-300',
          'hover:bg-anvaya-gray/10',
          currentRoute === item.name
            ? 'text-anvaya-blue bg-anvaya-gray/10'
            : 'text-anvaya-blue/60',
        ]"
        @click="navigate(item.name)"
      >
        <div
          :class="[
            'absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-anvaya-blue/20 to-transparent',
            'opacity-0 transition-opacity duration-300',
            currentRoute === item.name ? 'opacity-100' : '',
          ]"
        />
        <span
          :class="[
            'text-xl transition-all duration-300',
            currentRoute === item.name ? 'scale-110 mb-1' : 'mb-0.5',
          ]"
        >
          <i :class="item.icon"></i>
        </span>
        <span
          :class="[
            'text-[10px] font-medium tracking-wider uppercase transition-all duration-300',
            currentRoute === item.name ? 'opacity-100' : 'opacity-70',
          ]"
        >
          {{ item.label }}
        </span>
        <div
          :class="[
            'absolute -bottom-px left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full bg-anvaya-blue',
            'opacity-0 scale-x-0 transition-all duration-300',
            currentRoute === item.name ? 'opacity-100 scale-x-100' : '',
          ]"
        />
      </button>
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
