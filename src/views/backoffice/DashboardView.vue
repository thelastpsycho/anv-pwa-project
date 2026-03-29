<template>
  <div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(stat, index) in stats"
        :key="stat.title"
        class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6"
        :class="stat.bgColor"
      >
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center text-white"
          :class="stat.iconBg"
        >
          <i :class="['mdi', stat.icon, 'text-2xl']"></i>
        </div>
        <div>
          <p class="text-3xl font-semibold text-gray-800">{{ stat.value }}</p>
          <h3 class="text-sm font-medium text-gray-500">{{ stat.title }}</h3>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900">Recent Activity</h2>
      </div>
      <div class="border-t border-gray-100">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="p-6 flex items-center justify-between hover:bg-gray-50"
        >
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="activity.iconBg"
            >
              <i :class="[activity.icon, activity.iconColor, 'text-lg']"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-900">
                {{ activity.title }}
              </p>
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
          <button
            class="text-sm text-anvaya-blue hover:text-anvaya-blue/80"
            @click="viewDetails(activity)"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
    
    <!-- Global Settings -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-lg font-medium text-gray-900">App Settings</h2>
        <p class="text-sm text-gray-500 mt-1">Manage global application features</p>
      </div>
      <div class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-900">Guest Feedback Popup</h3>
            <p class="text-sm text-gray-500">Show the feedback questionnaire on the home screen</p>
          </div>
          <button
            @click="() => { isFeedbackModalEnabled = !isFeedbackModalEnabled; toggleFeedbackModal(); }"
            :disabled="isSavingSettings"
            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-anvaya-blue focus:ring-offset-2 disabled:opacity-50"
            :class="[isFeedbackModalEnabled ? 'bg-anvaya-blue' : 'bg-gray-200']"
            role="switch"
            :aria-checked="isFeedbackModalEnabled"
          >
            <span
              aria-hidden="true"
              class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="[isFeedbackModalEnabled ? 'translate-x-5' : 'translate-x-0']"
            ></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { collection, getCountFromServer, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const isFeedbackModalEnabled = ref(true);
const isSavingSettings = ref(false);

async function loadSettings() {
  try {
    const settingsDoc = await getDoc(doc(db, "settings", "general"));
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      if (typeof data.enableFeedbackModal !== "undefined") {
        isFeedbackModalEnabled.value = data.enableFeedbackModal;
      }
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }
}

async function toggleFeedbackModal() {
  isSavingSettings.value = true;
  try {
    await setDoc(doc(db, "settings", "general"), {
      enableFeedbackModal: isFeedbackModalEnabled.value
    }, { merge: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    // Revert on error
    isFeedbackModalEnabled.value = !isFeedbackModalEnabled.value;
  } finally {
    isSavingSettings.value = false;
  }
}

const amenitiesCount = ref(0);
const activitiesCount = ref(0);
const mapPointsCount = ref(0);
const faqsCount = ref(0);
const offersCount = ref(0);

async function getCounts() {
  try {
    const [amenitiesSnap, activitiesSnap, mapPointsSnap, faqsSnap, offersSnap] =
      await Promise.all([
        getCountFromServer(collection(db, "amenities")),
        getCountFromServer(collection(db, "activities")),
        getCountFromServer(collection(db, "mapPoints")),
        getCountFromServer(collection(db, "faqs")),
        getCountFromServer(collection(db, "offers")),
      ]);

    amenitiesCount.value = amenitiesSnap.data().count;
    activitiesCount.value = activitiesSnap.data().count;
    mapPointsCount.value = mapPointsSnap.data().count;
    faqsCount.value = faqsSnap.data().count;
    offersCount.value = offersSnap.data().count;
  } catch (error) {
    console.error("Error getting counts:", error);
  }
}

onMounted(() => {
  getCounts();
  loadSettings();
});

const stats = computed(() => [
  {
    title: "Total Amenities",
    value: amenitiesCount.value,
    icon: "mdi-spa",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-500",
  },
  {
    title: "Active Offers",
    value: offersCount.value,
    icon: "mdi-tag",
    bgColor: "bg-green-50",
    iconBg: "bg-green-500",
  },
  {
    title: "Map Points",
    value: mapPointsCount.value,
    icon: "mdi-map-marker",
    bgColor: "bg-yellow-50",
    iconBg: "bg-yellow-500",
  },
  {
    title: "FAQs",
    value: faqsCount.value,
    icon: "mdi-frequently-asked-questions",
    bgColor: "bg-indigo-50",
    iconBg: "bg-indigo-500",
  },
]);

const recentActivity = [
  {
    id: 1,
    title: "New offer added: Weekend Getaway Package",
    time: "2 hours ago",
    icon: "mdi mdi-tag-plus",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 2,
    title: "Map point updated: Main Pool",
    time: "5 hours ago",
    icon: "mdi mdi-map-marker",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  // Add more activities
];

function viewDetails(activity: any) {
  console.log("View details:", activity);
}
</script>
