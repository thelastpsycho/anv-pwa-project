<template>
  <div
    class="profile min-h-screen bg-white dark:bg-gray-900"
    :class="[
      'opacity-0 translate-y-5 transition-all duration-600 ease-out',
      isLoaded ? 'opacity-100 translate-y-0' : '',
    ]"
  >
    <div class="p-4">
      <PageHeader title="Guest Login" />

      <div v-if="!authStore.isAuthenticated" class="mt-8">
        <!-- Login Form -->
        <div class="max-w-sm mx-auto">
          <form class="space-y-4" @submit.prevent="handleLogin">
            <div class="relative">
              <div class="relative">
                <i
                  class="mdi mdi-door-closed absolute left-3 top-2.5 text-anvaya-blue/60 dark:text-anvaya-light/60 text-xl"
                ></i>
                <input
                  v-model="roomNumber"
                  type="text"
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-anvaya-gray/10 dark:border-gray-700 focus:outline-none focus:border-anvaya-blue/30 dark:focus:border-anvaya-light/30 bg-white/50 dark:bg-gray-800/50 text-anvaya-blue dark:text-anvaya-light"
                  placeholder="Enter room number"
                />
              </div>
            </div>

            <div class="relative">
              <div class="relative">
                <i
                  class="mdi mdi-lock-outline absolute left-3 top-2.5 text-anvaya-blue/60 text-xl"
                ></i>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-anvaya-gray/10 dark:border-gray-700 focus:outline-none focus:border-anvaya-blue/30 dark:focus:border-anvaya-light/30 bg-white/50 dark:bg-gray-800/50 text-anvaya-blue dark:text-anvaya-light"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  class="absolute right-3 top-2.5 text-anvaya-blue/60 hover:text-anvaya-blue"
                  @click="togglePassword"
                >
                  <i
                    :class="[
                      'mdi text-xl',
                      showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline',
                    ]"
                  ></i>
                </button>
              </div>
            </div>

            <p
              v-if="error"
              class="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-start gap-2"
            >
              <i class="mdi mdi-alert-circle text-lg mt-0.5"></i>
              <span>{{ error }}</span>
            </p>

            <button
              type="submit"
              class="w-full py-3 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-lg hover:bg-anvaya-blue/20 dark:hover:bg-anvaya-light/20 transition-colors font-medium"
            >
              <i class="mdi mdi-login"></i>
              <span>Login</span>
            </button>
          </form>

          <div class="mt-8 text-center">
            <div
              class="bg-anvaya-blue/5 rounded-xl p-4 flex items-start gap-3 text-left"
            >
              <i
                class="mdi mdi-information text-anvaya-blue text-xl mt-0.5"
              ></i>
              <div>
                <p class="text-sm text-gray-600 leading-relaxed">
                  For assistance with your login credentials, please contact our
                  front desk or dial
                  <span class="text-anvaya-blue font-medium">Extension 0</span>
                  from your room phone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logged In View -->
      <div v-else class="mt-8 max-w-sm mx-auto">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-anvaya-gray/10 dark:border-gray-700"
        >
          <div class="text-center mb-6">
            <div
              class="w-20 h-20 rounded-full bg-anvaya-blue/5 dark:bg-anvaya-light/5 flex items-center justify-center mx-auto mb-4"
            >
              <i
                class="mdi mdi-account text-4xl text-anvaya-blue dark:text-anvaya-light"
              ></i>
            </div>
            <h3
              class="text-xl font-medium text-anvaya-blue dark:text-anvaya-light"
            >
              Room {{ authStore.roomNumber }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ authStore.credentials?.isAdmin ? "Administrator" : "Guest" }}
            </p>
          </div>

          <div class="space-y-3">
            <button
              class="w-full py-3 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-lg hover:bg-anvaya-blue/20 dark:hover:bg-anvaya-light/20 transition-colors font-medium flex items-center justify-center gap-2"
              @click="handleLogout"
            >
              <i class="mdi mdi-logout"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import PageHeader from "@/components/PageHeader.vue";
import { useRouter, useRoute } from "vue-router";

const authStore = useAuthStore();
const roomNumber = ref("");
const password = ref("");
const error = ref("");
const showPassword = ref(false);
const isLoaded = ref(false);
const router = useRouter();
const route = useRoute();

// Capture the redirect path when the component is created
const redirectPath = ref(route.query.redirect as string | undefined);

onMounted(() => {
  // Optional: Log to confirm the path is captured on component mount
  console.log("Login view mounted. Redirect path:", redirectPath.value);
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});

const handleLogin = async () => {
  error.value = "";
  try {
    if (!roomNumber.value || !password.value) {
      error.value = "Please enter both room number and password";
      return;
    }

    const success = await authStore.loginProfile(
      roomNumber.value.trim(),
      password.value
    );
    if (success) {
      handleLoginSuccess();
    }
  } catch (err: any) {
    console.error("Login error:", err);
    error.value = err.message || "Failed to authenticate. Please try again.";
  }
};

const handleLogout = () => {
  authStore.logout();
  roomNumber.value = "";
  password.value = "";
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLoginSuccess = () => {
  // Use the captured redirect path
  if (redirectPath.value) {
    router.push(redirectPath.value);
  } else {
    router.push("/");
  }
};
</script>