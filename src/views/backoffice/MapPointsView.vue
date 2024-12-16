<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-medium">Map Points</h2>
        <button
          @click="handleAdd"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-anvaya-blue to-anvaya-blue/90 text-white text-sm font-medium rounded-lg hover:from-anvaya-blue/95 hover:to-anvaya-blue/85 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Point</span>
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="point in mapPoints"
          :key="point.id"
          class="border rounded-lg p-4"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium">{{ point.name }}</h3>
              <p class="text-gray-600 text-sm">{{ point.description }}</p>
              <div class="mt-2 space-y-1">
                <span
                  class="text-xs bg-anvaya-blue/10 text-anvaya-blue px-2 py-1 rounded-full"
                >
                  {{ point.category }}
                </span>
                <p class="text-xs text-anvaya-blue mt-1">
                  <i class="mdi mdi-map-marker mr-1"></i>
                  {{ point.coordinates.join(", ") }}
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="editPoint(point)"
                class="p-2 text-anvaya-blue hover:bg-anvaya-blue/5 rounded-lg"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                @click="deletePoint(point.id)"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { MapPoint } from "@/types/map";
import EditDataModal from "@/components/EditDataModal.vue";

const mapPoints = ref<MapPoint[]>([]);
const showAddModal = ref(false);
const editingPoint = ref<MapPoint | null>(null);

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
  if (confirm("Are you sure you want to delete this point?")) {
    try {
      await deleteDoc(doc(db, "mapPoints", id));
      await loadMapPoints();
    } catch (error) {
      console.error("Error deleting point:", error);
    }
  }
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
