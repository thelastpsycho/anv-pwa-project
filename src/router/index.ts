import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/chat",
      name: "chat",
      component: () => import("@/views/ChatView.vue"),
    },
    {
      path: "/map",
      name: "map",
      component: () => import("@/views/MapView.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/views/ProfileView.vue"),
    },
    {
      path: "/restaurant",
      name: "restaurant",
      component: () => import("@/views/RestaurantView.vue"),
    },
    {
      path: "/activities",
      name: "activities",
      component: () => import("@/views/ActivitiesView.vue"),
    },
    {
      path: "/wellness",
      name: "wellness",
      component: () => import("@/views/WellnessView.vue"),
    },
    {
      path: "/faq",
      name: "faq",
      component: () => import("@/views/FAQView.vue"),
    },
    {
      path: "/events",
      name: "events",
      component: () => import("@/views/EventsView.vue"),
    },
    {
      path: "/around",
      name: "around",
      component: () => import("@/views/AroundView.vue"),
    },
  ],
});

export default router;
