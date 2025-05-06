<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-medium">Attractions</h2>
        <button
          @click="handleAdd"
          class="px-4 py-2 bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90"
        >
          Add Attraction
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="attraction in attractions"
          :key="attraction.id"
          class="border rounded-lg p-4"
        >
          <div class="flex justify-between items-start">
            <div class="flex gap-4">
              <img
                :src="attraction.image"
                :alt="attraction.title"
                class="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 class="font-medium">{{ attraction.title }}</h3>
                <p class="text-gray-600 text-sm">
                  {{ attraction.description }}
                </p>
                <div class="mt-2">
                  <span
                    class="text-xs bg-anvaya-blue/10 text-anvaya-blue px-2 py-1 rounded-full"
                  >
                    {{ attraction.category }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="editAttraction(attraction)"
                class="p-2 text-anvaya-blue hover:bg-anvaya-blue/5 rounded-lg"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                @click="deleteAttraction(attraction.id)"
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
