<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import PageHeader from "@/components/PageHeader.vue";

const authStore = useAuthStore();
const router = useRouter();
const isLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});

interface ChatOption {
  id: number;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  requiresAuth?: boolean;
}

const chatOptions: ChatOption[] = [
  {
    id: 1,
    title: "WhatsApp",
    description: "Chat with our guest service team",
    icon: "mdi mdi-whatsapp",
    action: () => {
      window.location.href = "https://wa.me/62811389938";
    },
  },
  {
    id: 2,
    title: "Live Chat",
    description: "Chat with our online assistant",
    icon: "mdi mdi-message-text-outline",
    requiresAuth: true,
    action: () => {
      if (!authStore.isAuthenticated) {
        // If not logged in, redirect to login
        router.push("/profile");
        return;
      }

      if (window.Tawk_API) {
        // Set visitor information
        window.Tawk_API.setAttributes(
          {
            name: authStore.user?.name,
            room: authStore.user?.roomNumber,
          },
          (error: any) => {
            if (!error) {
              window.Tawk_API?.maximize();
            }
          }
        );
      }
    },
  },
  {
    id: 3,
    title: "Email",
    description: "Send us an email",
    icon: "mdi mdi-email-outline",
    action: () => {
      window.location.href = "mailto:info@theanvayabali.com";
    },
  },
];

const handleChatOption = (option: ChatOption) => {
  if (option.requiresAuth && !authStore.isAuthenticated) {
    router.push("/profile");
    return;
  }
  option.action();
};
</script>

<template>
  <div
    class="chat min-h-screen bg-white"
    :class="[
      'opacity-0 translate-y-5 transition-all duration-600 ease-out',
      isLoaded ? 'opacity-100 translate-y-0' : '',
    ]"
  >
    <div class="p-4">
      <PageHeader title="Contact Us" />

      <div class="mt-4 space-y-4">
        <div
          v-for="option in chatOptions"
          :key="option.id"
          class="bg-white rounded-xl p-4 shadow-sm border border-anvaya-gray/10 hover:shadow-md transition-all duration-300"
          :class="{
            'opacity-50': option.requiresAuth && !authStore.isAuthenticated,
          }"
          @click="handleChatOption(option)"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-anvaya-blue/5 flex items-center justify-center"
            >
              <i :class="[option.icon, 'text-2xl text-anvaya-blue']"></i>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-anvaya-blue">
                {{ option.title }}
              </h3>
              <p class="text-sm text-gray-600">{{ option.description }}</p>
            </div>
            <div v-if="option.requiresAuth && !authStore.isAuthenticated">
              <i class="mdi mdi-lock-outline text-anvaya-blue/60"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 p-4 bg-anvaya-blue/5 rounded-xl">
        <h4 class="text-sm font-medium text-anvaya-blue mb-2">
          Operating Hours
        </h4>
        <p class="text-sm text-gray-600">
          Our guest service team is available 24/7 to assist you with any
          inquiries.
        </p>
      </div>
    </div>
  </div>
</template>
