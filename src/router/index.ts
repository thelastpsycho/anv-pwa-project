import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { requireAuth } from "./guards";

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
      path: "/live-chat",
      name: "live-chat",
      component: () => import("@/views/LiveChatView.vue"),
      beforeEnter: requireAuth,
    },
    {
      path: "/map",
      name: "map",
      component: () => import("@/views/MapView.vue"),
      meta: {
        title: "Resort Map",
      },
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
      path: "/information",
      name: "information",
      component: () => import("@/views/InformationView.vue"),
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
    {
      path: "/backoffice",
      component: () => import("@/views/backoffice/BackofficeLayout.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: "",
          name: "backoffice-dashboard",
          component: () => import("@/views/backoffice/DashboardView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "login",
          name: "backoffice-login",
          component: () => import("@/views/backoffice/LoginView.vue"),
        },
        {
          path: "amenities",
          name: "backoffice-amenities",
          component: () => import("@/views/backoffice/AmenitiesView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "migrate",
          name: "backoffice-migrate",
          component: () => import("@/views/backoffice/MigrateView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "activities",
          name: "backoffice-activities",
          component: () => import("@/views/backoffice/ActivitiesView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "attractions",
          name: "backoffice-attractions",
          component: () => import("@/views/backoffice/AttractionsView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "dining",
          name: "backoffice-dining",
          component: () => import("@/views/backoffice/DiningView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "faqs",
          name: "backoffice-faqs",
          component: () => import("@/views/backoffice/FAQsView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "tv-channels",
          name: "backoffice-tv-channels",
          component: () => import("@/views/backoffice/TVChannelsView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "map",
          name: "backoffice-map",
          component: () => import("@/views/backoffice/MapPointsView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "offers",
          name: "backoffice-offers",
          component: () => import("@/views/backoffice/OffersView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "wellness",
          name: "backoffice-wellness",
          component: () => import("@/views/backoffice/WellnessView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "promotions",
          name: "backoffice-promotions",
          component: () => import("@/views/backoffice/PromotionsView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "trending",
          name: "backoffice-trending",
          component: () => import("@/views/backoffice/TrendingView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "chat-logs",
          name: "backoffice-chat-logs",
          component: () => import("@/views/backoffice/ChatLogsView.vue")
        },
        // Add more routes for other data management
      ],
    },
    {
      path: "/backend",
      redirect: "/backoffice",
    },
  ],
});

// Add this page tracking
router.beforeEach((to) => {
  // Set page title if exists
  if (to.meta.title) {
    document.title = `${to.meta.title} - The Anvaya`;
  }
});

router.afterEach((to, from) => {
  if (import.meta.env.PROD && window.gtag) {
    // Import the new tracking function
    import('@/utils/analytics').then(({ trackPageView }) => {
      trackPageView(
        to.meta.title ? `${to.meta.title} - The Anvaya` : 'The Anvaya',
        to.fullPath
      );
    }).catch(() => {
      // Fallback to original tracking if import fails
      window.gtag('event', 'page_view', {
        page_title: to.meta.title || 'The Anvaya',
        page_path: to.fullPath,
        page_location: window.location.href,
        from_path: from.fullPath
      });
    });
  }
});

export default router;
