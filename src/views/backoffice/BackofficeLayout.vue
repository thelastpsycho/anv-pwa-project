<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Side Navigation -->
    <aside class="w-64 bg-white shadow h-screen flex flex-col fixed z-40 left-0 top-0 bottom-0 transition-transform duration-200 sm:translate-x-0" :class="{ '-translate-x-full': !sideNavOpen, 'translate-x-0': sideNavOpen }">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 border-b">
          <img
            src="https://www.theanvayabali.com/wp-content/themes/wcl/images/logo-theanvaya.svg"
            alt="The Anvaya Logo"
            class="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            @click="router.push('/')"
          />
        </div>
        
        <!-- Navigation Links -->
        <nav class="flex-1 overflow-y-auto py-4 px-3">
          <div v-for="section in navLinks" :key="section.title" class="mb-4">
            <h3
              v-if="section.title"
              class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              {{ section.title }}
            </h3>
            <div class="mt-2 space-y-1">
              <RouterLink
                v-for="link in section.links"
                :key="link.route"
                :to="{ name: link.route }"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                :class="[
                  route.name === link.route
                    ? 'text-anvaya-blue bg-anvaya-blue/10'
                    : 'text-gray-600 hover:text-anvaya-blue hover:bg-anvaya-blue/5',
                ]"
                @click="sideNavOpen = false"
              >
                <i :class="['mdi', link.icon, 'mr-3 text-lg']"></i>
                <span class="hover:translate-x-0.5 transition-transform duration-200 ease-in-out">{{ link.title }}</span>
              </RouterLink>
            </div>
          </div>
        </nav>
      </div>
      <!-- Mobile close button -->
      <button
        v-if="sideNavOpen"
        class="absolute top-4 right-4 sm:hidden text-gray-500 hover:text-gray-700"
        @click="sideNavOpen = false"
      >
        <i class="mdi mdi-close text-2xl"></i>
      </button>
    </aside>

    <!-- Page Content -->
    <div class="flex-1 ml-0 sm:ml-64 transition-all duration-200 flex flex-col h-full overflow-y-auto">
      <header class="bg-white/60 backdrop-blur-lg sticky top-0 z-30">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <!-- Mobile menu button -->
          <button
            class="sm:hidden text-gray-500 hover:text-gray-700"
            @click="sideNavOpen = !sideNavOpen"
          >
            <i class="mdi mdi-menu text-2xl"></i>
          </button>

          <!-- Welcome message and Search -->
          <div class="flex items-center gap-4">
            <div class="hidden sm:block">
              <h1 class="text-lg font-semibold text-gray-800">
                Welcome back, <span class="text-anvaya-blue">{{ currentUser?.email?.split('@')[0] }}</span>
              </h1>
              <p class="text-xs text-gray-500">Here's what's happening today.</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="relative hidden md:block">
              <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="search"
                placeholder="Search anything..."
                class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
              />
            </div>
            <!-- User Dropdown -->
            <div v-if="currentUser" class="relative">
              <button
                class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                @click="userDropdownOpen = !userDropdownOpen"
              >
                <img
                  src="https://www.gravatar.com/avatar/?d=mp"
                  alt="User Avatar"
                  class="w-8 h-8 rounded-full"
                />
                <span class="font-medium text-gray-700 hidden lg:block">{{ currentUser?.email?.split('@')[0] }}</span>
                <i class="mdi mdi-chevron-down text-gray-500"></i>
              </button>
              <div
                v-if="userDropdownOpen"
                v-click-outside="() => userDropdownOpen = false"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
              >
                <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  {{ currentUser?.email }}
                </div>
                <button
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="handleSignOut"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main class="flex-1 py-6 px-4 sm:px-6 lg:px-8">
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
const userDropdownOpen = ref(false);
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
  {
    title: "",
    links: [
      {
        title: "Dashboard",
        route: "backoffice-dashboard",
        icon: "mdi-view-dashboard-outline",
      },
    ],
  },
  {
    title: "Content Management",
    links: [
      { title: "Dining", route: "backoffice-dining", icon: "mdi-silverware-fork-knife" },
      { title: "Wellness", route: "backoffice-wellness", icon: "mdi-spa-outline" },
      { title: "Activities", route: "backoffice-activities", icon: "mdi-run" },
      { title: "What's On", route: "backoffice-offers", icon: "mdi-calendar-star" },
      { title: "FB Promotions", route: "backoffice-promotions", icon: "mdi-food-takeout-box-outline" },
      { title: "Trending", route: "backoffice-trending", icon: "mdi-chart-line" },
      { title: "Around Us", route: "backoffice-attractions", icon: "mdi-map-marker-radius-outline" },
      { title: "FAQs", route: "backoffice-faqs", icon: "mdi-frequently-asked-questions" },
    ],
  },
  {
    title: "Hotel Services",
    links: [
      { title: "Map Points", route: "backoffice-map", icon: "mdi-map-marker-outline" },
      { title: "TV Channels", route: "backoffice-tv-channels", icon: "mdi-television" },
    ],
  },
  {
    title: "Admin",
    links: [
      ...(isAdmin.value ? [{ title: "Chat Logs", route: "backoffice-chat-logs", icon: "mdi-chat-processing-outline" }] : []),
      // { title: "Migrate", route: "backoffice-migrate", icon: "mdi-database-arrow-up-outline" },
    ],
  },
]);
</script>
