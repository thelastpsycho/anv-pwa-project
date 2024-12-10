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
      path: "/details/:id",
      name: "details",
      component: () => import("@/views/DetailsView.vue"),
      props: true,
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
      path: "/faq",
      name: "faq",
      component: () => import("@/views/FAQView.vue"),
    },
  ],
});

export default router;
