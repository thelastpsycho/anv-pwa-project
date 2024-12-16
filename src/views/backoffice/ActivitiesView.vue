<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-medium">Activities</h2>
        <button
          @click="handleAdd"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-anvaya-blue to-anvaya-blue/90 text-white text-sm font-medium rounded-lg hover:from-anvaya-blue/95 hover:to-anvaya-blue/85 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Activity</span>
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="border rounded-lg p-4"
        >
          <div class="flex justify-between items-start">
            <div class="flex gap-4">
              <img
                :src="activity.image"
                :alt="activity.title"
                class="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 class="font-medium">{{ activity.title }}</h3>
                <p class="text-gray-600 text-sm">{{ activity.description }}</p>
                <div class="mt-2 space-y-1">
                  <p class="text-xs text-anvaya-blue">
                    <i class="mdi mdi-clock-outline mr-1"></i>
                    {{ activity.duration }}
                  </p>
                  <p class="text-xs text-anvaya-blue">
                    <i class="mdi mdi-account-group mr-1"></i>
                    {{ activity.groupSize }}
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

    <EditDataModal
      v-if="showAddModal || editingActivity"
      :is-open="showAddModal || !!editingActivity"
      :title="editingActivity ? 'Edit Activity' : 'Add Activity'"
      collection="activities"
      :document-id="editingActivity?.id"
      :initial-data="
        editingActivity || {
          title: '',
          description: '',
          duration: '',
          groupSize: '',
          image: '',
        }
      "
      :fields="{
        title: { label: 'Title', type: 'text' },
        description: { label: 'Description', type: 'textarea' },
        duration: { label: 'Duration', type: 'text' },
        groupSize: { label: 'Group Size', type: 'text' },
        image: { label: 'Image URL', type: 'text' },
      }"
      @close="handleModalClose"
      @saved="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Activity } from "@/types/activities";
import EditDataModal from "@/components/EditDataModal.vue";

const activities = ref<Activity[]>([]);
const showAddModal = ref(false);
const editingActivity = ref<Activity | null>(null);

function handleModalClose() {
  showAddModal.value = false;
  editingActivity.value = null;
}

async function handleSave(data: Partial<Activity>) {
  try {
    if (editingActivity.value) {
      await updateDoc(doc(db, "activities", editingActivity.value.id), data);
    } else {
      await addDoc(collection(db, "activities"), data);
    }
    await loadActivities();
    handleModalClose();
  } catch (error) {
    console.error("Error saving activity:", error);
  }
}

async function loadActivities() {
  try {
    const querySnapshot = await getDocs(collection(db, "activities"));
    activities.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as Activity[];
  } catch (error) {
    console.error("Error loading activities:", error);
  }
}

async function deleteActivity(id: string) {
  if (confirm("Are you sure you want to delete this activity?")) {
    try {
      await deleteDoc(doc(db, "activities", id));
      await loadActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  }
}

function editActivity(activity: Activity) {
  showAddModal.value = false;
  editingActivity.value = activity;
}

function handleAdd() {
  editingActivity.value = null;
  showAddModal.value = true;
}

onMounted(() => {
  loadActivities();
});
</script>
