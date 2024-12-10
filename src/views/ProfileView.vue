<template>
  <div
    class="profile min-h-screen bg-white"
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
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="relative">
              <div class="relative">
                <i
                  class="mdi mdi-door-closed absolute left-3 top-2.5 text-anvaya-blue/60 text-xl"
                ></i>
                <input
                  v-model="roomNumber"
                  type="text"
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-anvaya-gray/10 focus:outline-none focus:border-anvaya-blue/30 bg-white/50"
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
                  class="w-full pl-10 pr-12 py-2.5 rounded-lg border border-anvaya-gray/10 focus:outline-none focus:border-anvaya-blue/30 bg-white/50"
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
              class="w-full py-3 bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90 transition-colors font-medium flex items-center justify-center gap-2"
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
          class="bg-white rounded-xl p-6 shadow-sm border border-anvaya-gray/10"
        >
          <div class="text-center mb-6">
            <div
              class="w-20 h-20 rounded-full bg-anvaya-blue/5 flex items-center justify-center mx-auto mb-4"
            >
              <i class="mdi mdi-account text-4xl text-anvaya-blue"></i>
            </div>
            <h3 class="text-xl font-medium text-anvaya-blue">
              {{ authStore.user?.name }}
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              Room {{ authStore.user?.roomNumber }}
            </p>
          </div>

          <div class="space-y-3">
            <button
              @click="handleLogout"
              class="w-full py-3 bg-anvaya-blue/10 text-anvaya-blue rounded-lg hover:bg-anvaya-blue/20 transition-colors font-medium flex items-center justify-center gap-2"
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

const authStore = useAuthStore();
const roomNumber = ref("");
const password = ref("");
const error = ref("");
const showPassword = ref(false);
const isLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});

const handleLogin = () => {
  if (!roomNumber.value || !password.value) {
    error.value = "Please fill in all fields";
    return;
  }

  const success = authStore.login(roomNumber.value, password.value);
  if (!success) {
    error.value = "Invalid room number or password";
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
</script>
