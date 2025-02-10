<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-medium">Dining Venues</h2>
        <button
          @click="handleAdd"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-anvaya-blue to-anvaya-blue/90 text-white text-sm font-medium rounded-lg hover:from-anvaya-blue/95 hover:to-anvaya-blue/85 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Venue</span>
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="venue in venues"
          :key="venue.id"
          class="border rounded-lg p-4"
        >
          <div class="flex justify-between items-start">
            <div class="flex gap-4">
              <img
                :src="venue.image"
                :alt="venue.name"
                class="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 class="font-medium">{{ venue.name }}</h3>
                <p class="text-gray-600 text-sm">{{ venue.description }}</p>
                <div class="mt-2 space-y-1">
                  <p class="text-xs text-anvaya-blue">
                    <i class="mdi mdi-clock-outline mr-1"></i>
                    {{ venue.hours }}
                  </p>
                  <p class="text-xs text-anvaya-blue">
                    <i class="mdi mdi-silverware mr-1"></i>
                    {{ venue.cuisine }}
                  </p>
                  <p class="text-xs text-anvaya-blue">
                    <i class="mdi mdi-book-open-page-variant mr-1"></i>
                    <a 
                      v-if="venue.menuLink" 
                      :href="venue.menuLink" 
                      target="_blank"
                      class="hover:underline"
                    >
                      View Menu
                    </a>
                    <span v-else class="text-gray-400">No menu available</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="editVenue(venue)"
                class="p-2 text-anvaya-blue hover:bg-anvaya-blue/5 rounded-lg"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                @click="deleteVenue(venue.id)"
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
      v-if="showAddModal || editingVenue"
      :is-open="showAddModal || !!editingVenue"
      title="Dining Venue"
      collection="dining"
      :document-id="editingVenue?.id"
      :initial-data="
        editingVenue || {
          name: '',
          description: '',
          hours: '',
          cuisine: '',
          image: '',
          menuLink: '',
        }
      "
      :fields="{
        name: { label: 'Name', type: 'text' },
        description: { label: 'Description', type: 'textarea' },
        hours: { label: 'Operating Hours', type: 'text' },
        cuisine: { label: 'Cuisine Type', type: 'text' },
        image: { label: 'Image URL', type: 'text' },
        menuLink: { label: 'Menu Link', type: 'text' },
      }"
      @close="handleModalClose"
      @saved="loadVenues"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { DiningVenue } from "@/types/dining";
import EditDataModal from "@/components/EditDataModal.vue";

const venues = ref<DiningVenue[]>([]);
const showAddModal = ref(false);
const editingVenue = ref<DiningVenue | null>(null);

async function loadVenues() {
  try {
    const querySnapshot = await getDocs(collection(db, "dining"));
    venues.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as DiningVenue[];
  } catch (error) {
    console.error("Error loading venues:", error);
  }
}

async function deleteVenue(id: string) {
  if (confirm("Are you sure you want to delete this venue?")) {
    try {
      await deleteDoc(doc(db, "dining", id));
      await loadVenues();
    } catch (error) {
      console.error("Error deleting venue:", error);
    }
  }
}

function editVenue(venue: DiningVenue) {
  showAddModal.value = false;
  editingVenue.value = venue;
}

function handleAdd() {
  showAddModal.value = true;
}

function handleModalClose() {
  showAddModal.value = false;
  editingVenue.value = null;
}

onMounted(() => {
  loadVenues();
});
</script>
