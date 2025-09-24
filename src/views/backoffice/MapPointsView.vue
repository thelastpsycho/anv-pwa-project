<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">Map Points</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search map point..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
          />
        </div>
        <button
          class="inline-flex items-center gap-2 px-4 py-2 bg-anvaya-blue text-white text-sm font-medium rounded-lg hover:bg-anvaya-blue/90 transition-all duration-200 shadow-sm"
          @click="handleAdd"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Point</span>
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="point in filteredMapPoints"
          :key="point.id"
          class="bg-white rounded-xl shadow-md p-3 flex flex-col group transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          <div class="flex justify-between items-center mb-2">
            <div
              v-if="point.icon"
              class="w-8 h-8 rounded-full bg-anvaya-blue/10 text-anvaya-blue flex items-center justify-center text-lg"
            >
              <i :class="['mdi', point.icon]"></i>
            </div>
            <span
              class="text-xs bg-anvaya-blue text-white px-2 py-0.5 rounded-full font-medium"
            >
              {{ point.category }}
            </span>
          </div>
          <h3 class="font-semibold text-base text-gray-800 mb-0.5">{{ point.name }}</h3>
          <p class="text-gray-600 text-xs flex-1">{{ point.description }}</p>
          <div class="mt-2 flex items-center text-xs text-gray-500">
            <i class="mdi mdi-map-marker mr-1.5 text-anvaya-blue"></i>
            <span>{{ point.coordinates.join(", ") }}</span>
          </div>
          <div class="flex gap-1.5 mt-2 pt-2 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              class="flex-1 py-1 bg-anvaya-blue/10 text-anvaya-blue rounded-lg hover:bg-anvaya-blue/20 transition-colors text-xs font-medium"
              @click="editPoint(point)"
            >
              <i class="mdi mdi-pencil mr-1"></i> Edit
            </button>
            <button
              class="flex-1 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-xs font-medium"
              @click="deletePoint(point.id)"
            >
              <i class="mdi mdi-delete mr-1"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <EditDataModal
      v-if="editingPoint || showAddModal"
      :is-open="!!editingPoint || showAddModal"
      title="Map Point"
      collection="mapPoints"
      :document-id="editingPoint?.id"
      :initial-data="
        editingPoint || {
          name: '',
          description: '',
          category: 'facility',
          coordinates: '',
          icon: '',
          logo: '',
        }
      "
      :fields="{
        name: { label: 'Name', type: 'text' },
        description: { label: 'Description', type: 'textarea' },
        category: {
          label: 'Category',
          type: 'select',
          options: ['dining', 'wellness', 'facility', 'pool', 'entrance'],
        },
        coordinates: { label: 'Coordinates (lat,lng)', type: 'text' },
        icon: { label: 'Icon', type: 'text' },
        logo: { label: 'Logo', type: 'text' },
      }"
      @close="closeModal"
      @saved="loadMapPoints"
    />

    <ConfirmModal
      :is-open="showConfirmModal"
      title="Confirm Deletion"
      message="Are you sure you want to delete this map point? This action cannot be undone."
      confirm-text="Delete"
      @confirm="handleConfirmDelete"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { MapPoint } from "@/types/map";
import EditDataModal from "@/components/EditDataModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

const mapPoints = ref<MapPoint[]>([]);
const showAddModal = ref(false);
const editingPoint = ref<MapPoint | null>(null);
const searchQuery = ref('');
const showConfirmModal = ref(false);
const pointToDeleteId = ref<string | null>(null);

const filteredMapPoints = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return mapPoints.value.filter(
    (point) =>
      point.name.toLowerCase().includes(query) ||
      point.description.toLowerCase().includes(query) ||
      point.category.toLowerCase().includes(query)
  );
});

async function loadMapPoints() {
  try {
    const querySnapshot = await getDocs(collection(db, "mapPoints"));
    mapPoints.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as MapPoint[];
  } catch (error) {
    console.error("Error loading map points:", error);
  }
}

async function deletePoint(id: string) {
  pointToDeleteId.value = id;
  showConfirmModal.value = true;
  console.log("Opening confirm modal:", showConfirmModal.value);
}

async function handleConfirmDelete() {
  if (pointToDeleteId.value) {
    try {
      await deleteDoc(doc(db, "mapPoints", pointToDeleteId.value));
      await loadMapPoints();
    } catch (error) {
      console.error("Error deleting point:", error);
    } finally {
      closeConfirmModal();
    }
  }
}

function closeConfirmModal() {
  showConfirmModal.value = false;
  pointToDeleteId.value = null;
}

function editPoint(point: MapPoint) {
  showAddModal.value = false;
  editingPoint.value = point;
}

function handleAdd() {
  editingPoint.value = null;
  showAddModal.value = true;
}

function closeModal() {
  showAddModal.value = false;
  editingPoint.value = null;
}

onMounted(() => {
  loadMapPoints();
});
</script>
