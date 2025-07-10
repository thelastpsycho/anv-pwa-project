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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/config/firebase";

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
