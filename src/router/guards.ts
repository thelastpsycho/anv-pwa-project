import { useAuthStore } from "@/stores/auth";
import type { NavigationGuard } from "vue-router";

export const requireAuth: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    next('/backoffice/login');
    return;
  }
  next();
};
