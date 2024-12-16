import { useAuthStore } from "@/stores/auth";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export async function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  if (authStore.loading) {
    await authStore.init();
  }

  if (!authStore.isAuthenticated) {
    next({ name: "backoffice-login" });
  } else {
    next();
  }
}
