<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-medium">Daily Activities</h2>
        <button
          @click="handleAdd"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-anvaya-blue to-anvaya-blue/90 text-white text-sm font-medium rounded-lg hover:from-anvaya-blue/95 hover:to-anvaya-blue/85 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Activity</span>
        </button>
      </div>

      <!-- Day Filter -->
      <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          v-for="day in weekDays"
          :key="day.value"
          @click="selectedDay = day.value"
          :class="[
            'px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-colors',
            selectedDay === day.value
              ? 'bg-anvaya-blue text-white'
              : 'bg-anvaya-blue/10 text-anvaya-blue hover:bg-anvaya-blue/20'
          ]"
        >
          {{ day.label }}
        </button>
      </div>

      <!-- Activities List -->
      <div class="space-y-4">
        <div
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="border rounded-lg p-4"
        >
          <div class="flex justify-between items-start">
            <div class="flex gap-4">
              <img
                :src="activity.image"
                :alt="activity.title"
                @error="handleImageError"
                class="w-full h-48 object-cover rounded-t-lg"
              />
              <div>
                <h3 class="font-medium">{{ activity.title }}</h3>
                <p class="text-gray-600 text-sm">{{ activity.description }}</p>
                <div class="mt-2 space-y-1">
                  <p class="text-xs text-anvaya-blue">
                    <i class="mdi mdi-clock-outline mr-1"></i>
                    {{ activity.time }} ({{ activity.duration }} minutes)
                  </p>
                  <p class="text-xs text-anvaya-blue">
                    <i class="mdi mdi-map-marker-outline mr-1"></i>
                    {{ activity.location }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="editActivity(activity)"
                class="p-2 text-anvaya-blue hover:bg-anvaya-blue/5 rounded-lg"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                @click="deleteActivity(activity.id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <i class="mdi mdi-delete"></i>
              </button>
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

const defaultActivity = {
  title: '',
  description: '',
  time: '7:00 AM',
  duration: 60,
  location: '',
  image: '/activities/default.jpg',
  dayOfWeek: 'monday'
};

const filteredActivities = computed(() => 
  activities.value.filter(activity => activity.dayOfWeek === selectedDay.value)
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
