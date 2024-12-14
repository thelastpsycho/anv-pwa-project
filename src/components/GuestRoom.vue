<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-anvaya-gray/10 dark:border-gray-700"
  >
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-medium text-anvaya-blue dark:text-anvaya-light">
          Room {{ roomNumber }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Welcome back, {{ guestName }}
        </p>
      </div>
      <button
        @click="handleLogout"
        class="p-2 rounded-lg hover:bg-anvaya-blue/5 dark:hover:bg-anvaya-light/5 text-anvaya-blue dark:text-anvaya-light"
      >
        <i class="mdi mdi-logout text-xl"></i>
      </button>
    </div>

    <div class="space-y-4">
      <div
        class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
      >
        <i class="mdi mdi-calendar text-anvaya-blue dark:text-anvaya-light"></i>
        <span>Check-in: {{ checkIn }}</span>
      </div>
      <div
        class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
      >
        <i
          class="mdi mdi-calendar-check text-anvaya-blue dark:text-anvaya-light"
        ></i>
        <span>Check-out: {{ checkOut }}</span>
      </div>
      <div
        class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
      >
        <i
          class="mdi mdi-account-group text-anvaya-blue dark:text-anvaya-light"
        ></i>
        <span>{{ adults }} Adults, {{ children }} Children</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  roomNumber: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "logout"): void;
}>();

const handleLogout = () => {
  emit("logout");
};
</script>
