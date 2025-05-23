<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <nav class="bg-white shadow">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <!-- Left side -->
          <div class="flex">
            <div class="flex flex-shrink-0 items-center">
              <img
                @click="router.push('/')"
                src="https://www.theanvayabali.com/wp-content/themes/wcl/images/logo-theanvaya.svg"
                alt="The Anvaya Logo"
                class="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
            </div>
            <!-- Navigation Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-4">
              <RouterLink
                v-for="link in navLinks"
                :key="link.route"
                :to="{ name: link.route }"
                class="inline-flex items-center px-3 py-2 text-sm font-medium"
                :class="[
                  route.name === link.route
                    ? 'text-anvaya-blue border-b-2 border-anvaya-blue'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                {{ link.title }}
              </RouterLink>
            </div>
          </div>

          <!-- Right side -->
          <div v-if="currentUser" class="flex items-center">
            <div class="flex flex-col items-end mr-4">
              <span class="text-xs text-gray-500">Logged in as</span>
              <span class="text-sm text-gray-700 font-medium">{{ currentUser?.email }}</span>
            </div>
            <button
              @click="handleSignOut"
              class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center sm:hidden">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="text-gray-500 hover:text-gray-700"
            >
              <i class="mdi mdi-menu text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="sm:hidden">
        <div class="space-y-1 px-4 pb-3 pt-2">
          <RouterLink
            v-for="link in navLinks"
            :key="link.route"
            :to="{ name: link.route }"
            class="block px-3 py-2 text-base font-medium"
            :class="[
              route.name === link.route
                ? 'text-anvaya-blue'
                : 'text-gray-500 hover:text-gray-700',
            ]"
            @click="mobileMenuOpen = false"
          >
            {{ link.title }}
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="py-6 px-4 sm:px-6 lg:px-8">
      <RouterView />
    </main>
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
const mobileMenuOpen = ref(false);
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
  { title: "Trending", route: "backoffice-trending" },
  { title: "Around us", route: "backoffice-attractions" },
  
  ...(isAdmin.value ? [{ title: "Chat Logs", route: "backoffice-chat-logs" }] : []),
]);
</script>
