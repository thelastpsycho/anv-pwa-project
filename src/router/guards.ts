import { useAuthStore } from "@/stores/auth";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export async function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  if (to.name === "backoffice-login") {
    next();
    return;
  }

  if (authStore.loading) {
    await authStore.init();
  }

  if (!authStore.isAuthenticated) {
    localStorage.setItem("intendedRoute", to.fullPath);
    next({ name: "backoffice-login" });
  } else {
    next();
  }
}
