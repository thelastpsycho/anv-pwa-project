<template>
  <div class="activities p-4">
    <PageHeader title="Activities & Experiences" />

    <!-- Day Selector -->
    <div class="mb-6">
      <div class="flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="day in weekDays"
          :key="day.value"
          @click="selectedDay = day.value"
          :class="[
            'px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-colors',
            selectedDay === day.value
              ? 'bg-anvaya-blue text-white'
              : 'bg-anvaya-blue/10 text-anvaya-blue hover:bg-anvaya-blue/20'
          ]"
        >
          {{ day.label }}
        </button>
      </div>
    </div>

    <!-- Time Period Filter -->
    <div class="mb-6 flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="period in timePeriods"
        :key="period.value"
        @click="selectedPeriod = period.value"
        :class="[
          'px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap transition-colors flex-1',
          selectedPeriod === period.value
            ? 'bg-anvaya-blue text-white'
            : 'bg-anvaya-blue/10 text-anvaya-blue hover:bg-anvaya-blue/20'
        ]"
      >
        {{ period.label }}
      </button>
    </div>

    <!-- Activities Grid -->
    <div class="grid gap-6 pb-12 mb-12">
      <div
        v-for="activity in filteredActivities"
        :key="activity.id"
        class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-anvaya-gray/10 dark:border-gray-700"
      >
        <div class="relative h-40">
          <img
            :src="activity.image"
            :alt="activity.title"
            @error="handleImageError"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-4 left-4 right-4">
            <div class="text-white text-sm font-medium px-3 py-1 bg-anvaya-blue/80 rounded-lg inline-block">
              {{ activity.time }}
            </div>
          </div>
        </div>

        <div class="p-4">
          <h3 class="text-lg font-medium text-anvaya-blue dark:text-anvaya-light mb-1">
            {{ activity.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-3 text-sm line-clamp-2">
            {{ activity.description }}
          </p>

          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm text-anvaya-blue/80 dark:text-anvaya-light/80">
              <i class="mdi mdi-clock-outline"></i>
              <span class="text-xs">{{ activity.duration }} minutes</span>
            </div>

            <div class="flex items-center gap-2 text-sm text-anvaya-blue/80 dark:text-anvaya-light/80">
              <i class="mdi mdi-map-marker-outline"></i>
              <span class="text-xs">{{ activity.location }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import { ref, computed, onMounted } from "vue";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Activity } from '@/types/activities';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1520&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const weekDays = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const timePeriods = [
  { value: 'all', label: 'All Times' },
  { value: 'morning', label: 'Morning (7AM - 10AM)' },
  { value: 'midday', label: 'Midday (11AM - 1PM)' },
  { value: 'afternoon', label: 'Afternoon (2PM - 5PM)' },
];

// Get current day of week
const getCurrentDay = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = new Date().getDay();
  return days[dayIndex];
};

const selectedDay = ref(getCurrentDay());
const selectedPeriod = ref('all');

const activities = ref<Activity[]>([]);

async function loadActivities() {
  try {
    const querySnapshot = await getDocs(collection(db, 'activities'));
    activities.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Activity[];
  } catch (error) {
    console.error('Error loading activities:', error);
  }
}

onMounted(() => {
  loadActivities();
});

const filteredActivities = computed(() => {
  console.log('Selected day:', selectedDay.value);
  console.log('Selected period:', selectedPeriod.value);
  
  const dayActivities = activities.value.filter(
    activity => activity.dayOfWeek === selectedDay.value
  );
  console.log('Activities for day:', dayActivities);
  
  const filtered = selectedPeriod.value === 'all' ? dayActivities : dayActivities.filter(activity => {
    const hour = parseInt(activity.time.split(' ')[0]);
    console.log('Filtering activity:', activity.title, 'at hour:', hour);
    
    return (
      (selectedPeriod.value === 'morning' && hour >= 7 && hour <= 10) ||
      (selectedPeriod.value === 'midday' && hour >= 11 && hour <= 13) ||
      (selectedPeriod.value === 'afternoon' && hour >= 14 && hour <= 17)
    );
  });
  
  // Sort by time
  return filtered.sort((a, b) => {
    const timeA = new Date(`2000/01/01 ${a.time}`).getTime();
    const timeB = new Date(`2000/01/01 ${b.time}`).getTime();
    return timeA - timeB;
  });
});

function bookActivity(activity: any) {
  // Implement booking logic
  console.log('Joining activity:', activity);
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = FALLBACK_IMAGE;
};
</script>

<style scoped>
.activities {
  min-height: calc(100vh - 64px);
}
</style>
