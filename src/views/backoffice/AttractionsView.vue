<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">Attractions</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="search"
            placeholder="Search attraction..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
          />
        </div>
        <button
          @click="handleAdd"
          class="inline-flex items-center gap-2 px-4 py-2 bg-anvaya-blue text-white text-sm font-medium rounded-lg hover:bg-anvaya-blue/90 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Attraction</span>
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="attraction in attractions"
          :key="attraction.id"
          class="bg-white rounded-xl shadow-md overflow-hidden group transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          <div class="relative">
            <img
              :src="attraction.image"
              :alt="attraction.title"
              class="w-full h-48 object-cover"
            />
            <div
              class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"
            ></div>
            <div class="absolute top-4 right-4 flex gap-2">
              <button
                @click="editAttraction(attraction)"
                class="p-2 bg-white/80 text-anvaya-blue rounded-lg hover:bg-white transition-colors shadow-sm"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                @click="deleteAttraction(attraction.id)"
                class="p-2 bg-white/80 text-red-600 rounded-lg hover:bg-white transition-colors shadow-sm"
              >
                <i class="mdi mdi-delete"></i>
              </button>
            </div>
            <span
              class="absolute bottom-4 left-4 text-xs bg-anvaya-blue text-white px-2 py-1 rounded-full"
            >
              {{ attraction.category }}
            </span>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-lg text-gray-800">{{ attraction.title }}</h3>
            <p class="text-gray-600 text-sm mt-1">{{ attraction.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <EditDataModal
      v-if="editingAttraction || showAddModal"
      :is-open="!!editingAttraction || showAddModal"
      title="Attraction"
      collection="attractions"
      :document-id="editingAttraction?.id"
      :initial-data="editingAttraction || {
        title: '',
        description: '',
        distance: '',
        image: '',
        category: 'Beach'
      }"
      :fields="{
        title: { label: 'Title', type: 'text' },
        description: { label: 'Description', type: 'textarea' },
        distance: { label: 'Distance', type: 'text' },
        image: { label: 'Image URL', type: 'text' },
        category: {
          label: 'Category',
          type: 'select',
          options: ['Beach', 'Shopping', 'Entertainment'],
        },
      }"
      @close="handleModalClose"
      @saved="loadAttractions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Attraction } from "@/types/attractions";
import EditDataModal from "@/components/EditDataModal.vue";

const attractions = ref<Attraction[]>([]);
const showAddModal = ref(false);
const editingAttraction = ref<Attraction | null>(null);

async function loadAttractions() {
  try {
    const querySnapshot = await getDocs(collection(db, "attractions"));
    attractions.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Attraction[];
  } catch (error) {
    console.error("Error loading attractions:", error);
  }
}

async function deleteAttraction(id: string) {
  if (confirm("Are you sure you want to delete this attraction?")) {
    try {
      await deleteDoc(doc(db, "attractions", id));
      await loadAttractions();
    } catch (error) {
      console.error("Error deleting attraction:", error);
    }
  }
}

function editAttraction(attraction: Attraction) {
  editingAttraction.value = attraction;
  showAddModal.value = false;
}

function handleAdd() {
  editingAttraction.value = null;
  showAddModal.value = true;
}

function handleModalClose() {
  showAddModal.value = false;
  editingAttraction.value = null;
}

onMounted(() => {
  loadAttractions();
});
</script>
