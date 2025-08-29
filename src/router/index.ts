import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { useAuthStore } from "@/stores/auth";


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
      meta: { requiresAuth: true },
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
      path: "/terms-and-conditions",
      name: "terms-and-conditions",
      component: () => import("@/views/TermsAndConditionsView.vue"),
      meta: {
        title: "Terms and Conditions",
      },
    },
    {
      path: "/backoffice/login",
      name: "backoffice-login",
      component: () => import("@/views/backoffice/LoginView.vue"),
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
          meta: { requiresAuth: true },
        },
        
        {
          path: "amenities",
          name: "backoffice-amenities",
          component: () => import("@/views/backoffice/AmenitiesView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "migrate",
          name: "backoffice-migrate",
          component: () => import("@/views/backoffice/MigrateView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "activities",
          name: "backoffice-activities",
          component: () => import("@/views/backoffice/ActivitiesView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "attractions",
          name: "backoffice-attractions",
          component: () => import("@/views/backoffice/AttractionsView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "dining",
          name: "backoffice-dining",
          component: () => import("@/views/backoffice/DiningView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "faqs",
          name: "backoffice-faqs",
          component: () => import("@/views/backoffice/FAQsView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "tv-channels",
          name: "backoffice-tv-channels",
          component: () => import("@/views/backoffice/TVChannelsView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "map",
          name: "backoffice-map",
          component: () => import("@/views/backoffice/MapPointsView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "offers",
          name: "backoffice-offers",
          component: () => import("@/views/backoffice/OffersView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "wellness",
          name: "backoffice-wellness",
          component: () => import("@/views/backoffice/WellnessView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "promotions",
          name: "backoffice-promotions",
          component: () => import("@/views/backoffice/PromotionsView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "trending",
          name: "backoffice-trending",
          component: () => import("@/views/backoffice/TrendingView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "chat-logs",
          name: "backoffice-chat-logs",
          component: () => import("@/views/backoffice/ChatLogsView.vue"),
          meta: { requiresAuth: true }
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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  console.log(`[Router Guard] Navigating from: ${from.fullPath}`);
  console.log(`[Router Guard] Navigating to: ${to.fullPath}`);
  console.log(`[Router Guard] Target route meta:`, to.meta);
  console.log(`[Router Guard] Target route query:`, to.query);
  console.log(`[Router Guard] Is authenticated:`, authStore.isAuthenticated);

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    const redirectPath = to.fullPath;
    const targetLoginRoute = to.path.startsWith('/backoffice') ? '/backoffice/login' : '/profile';
    
    console.log(`[Router Guard] Auth required, not authenticated. Redirecting to ${targetLoginRoute} with query:`, { redirect: redirectPath });
    next({ path: targetLoginRoute, query: { redirect: redirectPath } });
  } else {
    console.log(`[Router Guard] Authentication not required or already authenticated. Proceeding.`);
    next();
  }
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
