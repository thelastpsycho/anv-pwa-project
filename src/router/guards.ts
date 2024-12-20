import { useAuthStore } from "@/stores/auth";
import type { NavigationGuard } from "vue-router";

export const requireAuth: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();
  const isLiveChat = to.name === 'live-chat';
  const isBackoffice = to.path.startsWith('/backoffice');

  if (!authStore.isAuthenticated) {
    if (isLiveChat) {
      next('/profile');
      return;
    }
    if (isBackoffice) {
      next('/backoffice/login');
      return;
    }
  }
  next();
};
