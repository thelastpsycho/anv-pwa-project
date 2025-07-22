<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">Daily Activities</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="search"
            v-model="searchQuery"
            placeholder="Search activity..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
          />
        </div>
        <button
          @click="handleAdd"
          class="inline-flex items-center gap-2 px-4 py-2 bg-anvaya-blue text-white text-sm font-medium rounded-lg hover:bg-anvaya-blue/90 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Activity</span>
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <!-- Day Filter -->
      <div class="relative bg-gray-100 p-1 rounded-lg flex items-center mb-6">
        <div
          class="absolute bg-white h-full rounded-md shadow-sm transition-transform duration-300 ease-in-out"
          :style="{ width: `${100 / weekDays.length}%`, transform: `translateX(${selectedDayIndex * 100}%)` }"
        ></div>
        <button
          v-for="day in weekDays"
          :key="day.value"
          @click="selectedDay = day.value"
          class="relative flex-1 px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors duration-300"
          :class="[selectedDay === day.value ? 'text-anvaya-blue' : 'text-gray-500 hover:text-gray-700']"
        >
          {{ day.label }}
        </button>
      </div>

      <!-- Activities List -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="bg-white rounded-xl shadow-md overflow-hidden group transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          <div class="relative">
            <img
              :src="activity.image"
              :alt="activity.title"
              @error="handleImageError"
              class="w-full h-48 object-cover"
            />
            <div
              class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"
            ></div>
            <div class="absolute top-4 right-4 flex gap-2">
              <button
                @click="editActivity(activity)"
                class="p-2 bg-white/80 text-anvaya-blue rounded-lg hover:bg-white transition-colors shadow-sm"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                @click="deleteActivity(activity.id)"
                class="p-2 bg-white/80 text-red-600 rounded-lg hover:bg-white transition-colors shadow-sm"
              >
                <i class="mdi mdi-delete"></i>
              </button>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-lg text-gray-800">{{ activity.title }}</h3>
            <p class="text-gray-600 text-sm mt-1">{{ activity.description }}</p>
            <div class="mt-4 space-y-2">
              <div class="flex items-center text-sm text-gray-500">
                <i class="mdi mdi-clock-outline mr-2 text-anvaya-blue"></i>
                <span>{{ activity.time }} ({{ activity.duration }} minutes)</span>
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <i class="mdi mdi-map-marker-outline mr-2 text-anvaya-blue"></i>
                <span>{{ activity.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit/Add Modal -->
    <EditDataModal
      v-if="editingActivity || showAddModal"
      :is-open="!!editingActivity || showAddModal"
      :title="editingActivity ? 'Edit Activity' : 'Add Activity'"
      collection="activities"
      :document-id="editingActivity?.id"
      :initial-data="editingActivity || defaultActivity"
      :fields="{
        title: { label: 'Title', type: 'text' },
        description: { label: 'Description', type: 'textarea' },
        time: { label: 'Time', type: 'text' },
        duration: { label: 'Duration (minutes)', type: 'number' },
        location: { label: 'Location', type: 'text' },
        image: { label: 'Image URL', type: 'text' },
        dayOfWeek: {
          label: 'Day of Week',
          type: 'select',
          options: weekDays.map(d => d.value)
        }
      }"
      @close="handleModalClose"
      @saved="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import EditDataModal from '@/components/EditDataModal.vue';

const weekDays = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const activities = ref([]);
const selectedDay = ref('monday');
const showAddModal = ref(false);
const editingActivity = ref(null);
const searchQuery = ref('');

const defaultActivity = {
  title: '',
  description: '',
  time: '7:00 AM',
  duration: 60,
  location: '',
  image: '/activities/default.jpg',
  dayOfWeek: 'monday'
};

const filteredActivities = computed(() => {
  const dayFiltered = activities.value.filter(activity => activity.dayOfWeek === selectedDay.value);
  if (!searchQuery.value) {
    return dayFiltered;
  }
  const searchLower = searchQuery.value.toLowerCase();
  return dayFiltered.filter(activity => 
    activity.title.toLowerCase().includes(searchLower) ||
    activity.description.toLowerCase().includes(searchLower)
  );
});

const selectedDayIndex = computed(() => 
  weekDays.findIndex(day => day.value === selectedDay.value)
);

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1520&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

async function loadActivities() {
  try {
    console.log('Loading activities...');
    const querySnapshot = await getDocs(collection(db, 'activities'));
    console.log('Query snapshot:', querySnapshot.docs.length, 'documents');
    activities.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Activities loaded:', activities.value);
  } catch (error) {
    console.error('Error loading activities:', error);
  }
}

async function deleteActivity(id: string) {
  if (confirm('Are you sure you want to delete this activity?')) {
    try {
      await deleteDoc(doc(db, 'activities', id));
      await loadActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  }
}

function editActivity(activity) {
  editingActivity.value = activity;
}

function handleAdd() {
  showAddModal.value = true;
}

function handleModalClose() {
  showAddModal.value = false;
  editingActivity.value = null;
}

async function handleSave(data) {
  try {
    if (editingActivity.value) {
      await updateDoc(doc(db, 'activities', editingActivity.value.id), {
        ...data,
        updatedAt: new Date()
      });
    } else {
      await addDoc(collection(db, 'activities'), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await loadActivities();
    handleModalClose();
  } catch (error) {
    console.error('Error saving activity:', error);
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = FALLBACK_IMAGE;
};

onMounted(() => {
  loadActivities();
});
</script>
