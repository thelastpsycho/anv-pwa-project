<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Side Navigation -->
    <aside class="w-64 bg-white shadow h-screen flex flex-col fixed z-40 left-0 top-0 bottom-0 transition-transform duration-200 sm:translate-x-0" :class="{ '-translate-x-full': !sideNavOpen, 'translate-x-0': sideNavOpen }">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 border-b">
          <img
            @click="router.push('/')"
            src="https://www.theanvayabali.com/wp-content/themes/wcl/images/logo-theanvaya.svg"
            alt="The Anvaya Logo"
            class="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>
        <!-- User Info -->
        <div v-if="currentUser" class="flex flex-col items-center py-4 border-b">
          <span class="text-xs text-gray-500">Logged in as</span>
          <span class="text-sm text-gray-700 font-medium">{{ currentUser?.email }}</span>
          <button
            @click="handleSignOut"
            class="mt-2 text-gray-500 hover:text-gray-700 px-3 py-1 text-sm font-medium rounded"
          >
            Sign Out
          </button>
        </div>
        <!-- Navigation Links -->
        <nav class="flex-1 overflow-y-auto py-4">
          <RouterLink
            v-for="link in navLinks"
            :key="link.route"
            :to="{ name: link.route }"
            class="flex items-center px-6 py-2 text-sm font-medium transition-colors"
            :class="[
              route.name === link.route
                ? 'text-anvaya-blue bg-anvaya-blue/10 rounded-lg'
                : 'text-gray-600 hover:text-anvaya-blue hover:bg-anvaya-blue/5 rounded-lg',
            ]"
            @click="sideNavOpen = false"
          >
            {{ link.title }}
          </RouterLink>
        </nav>
      </div>
      <!-- Mobile close button -->
      <button
        class="absolute top-4 right-4 sm:hidden text-gray-500 hover:text-gray-700"
        @click="sideNavOpen = false"
        v-if="sideNavOpen"
      >
        <i class="mdi mdi-close text-2xl"></i>
      </button>
    </aside>

    <!-- Page Content -->
    <div class="flex-1 ml-0 sm:ml-64 transition-all duration-200">
      <!-- Mobile menu button -->
      <div class="sm:hidden flex items-center h-16 px-4 bg-white shadow">
        <button
          @click="sideNavOpen = !sideNavOpen"
          class="text-gray-500 hover:text-gray-700"
        >
          <i class="mdi mdi-menu text-2xl"></i>
        </button>
        <span class="ml-4 text-lg font-semibold text-anvaya-blue">Backoffice</span>
      </div>
      <main class="py-6 px-4 sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { auth } from "@/config/firebase";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const sideNavOpen = ref(false);
const currentUser = ref(auth.currentUser);

const isAdmin = computed(() => {
  return currentUser.value?.email === 'andikrisnatha@gmail.com';
});

// Listen for auth state changes
onMounted(() => {
  auth.onAuthStateChanged((user) => {
    currentUser.value = user;
  });
});

const handleSignOut = async () => {
  await authStore.signOut();
  router.push("/backoffice/login");
};

const navLinks = computed(() => [
  { title: "Dashboard", route: "backoffice-dashboard" },
  // { title: "Migrate", route: "backoffice-migrate" },
  { title: "Dining", route: "backoffice-dining" },
  { title: "Wellness", route: "backoffice-wellness" },
  { title: "Activities", route: "backoffice-activities" },
  { title: "Whats'on", route: "backoffice-offers" },
  { title: "FB Promo", route: "backoffice-promotions" },
  { title: "Map", route: "backoffice-map" },
  { title: "FAQs", route: "backoffice-faqs" },
  { title: "TV Channels", route: "backoffice-tv-channels" },
  { title: "Trending", route: "backoffice-trending" },
  { title: "Around us", route: "backoffice-attractions" },
  
  ...(isAdmin.value ? [{ title: "Chat Logs", route: "backoffice-chat-logs" }] : []),
]);
</script>
