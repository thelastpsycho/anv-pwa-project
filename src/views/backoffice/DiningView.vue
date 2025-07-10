<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">Dining Venues</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="search"
            placeholder="Search venue..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
          />
        </div>
        <button
          @click="handleAdd"
          class="inline-flex items-center gap-2 px-4 py-2 bg-anvaya-blue text-white text-sm font-medium rounded-lg hover:bg-anvaya-blue/90 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Venue</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
        v-for="venue in venues"
        :key="venue.id"
        class="bg-white rounded-xl shadow-md overflow-hidden group transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
      >
        <div class="relative">
          <img
            :src="venue.image"
            :alt="venue.name"
            class="w-full h-48 object-cover"
          />
          <div
            class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"
          ></div>
          <div class="absolute top-4 right-4 flex gap-2">
            <button
              @click="editVenue(venue)"
              class="p-2 bg-white/80 text-anvaya-blue rounded-lg hover:bg-white transition-colors shadow-sm"
            >
              <i class="mdi mdi-pencil"></i>
            </button>
            <button
              @click="deleteVenue(venue.id)"
              class="p-2 bg-white/80 text-red-600 rounded-lg hover:bg-white transition-colors shadow-sm"
            >
              <i class="mdi mdi-delete"></i>
            </button>
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-lg text-gray-800">{{ venue.name }}</h3>
          <p class="text-gray-600 text-sm mt-1">{{ venue.description }}</p>
          <div class="mt-4 space-y-2">
            <div class="flex items-center text-sm text-gray-500">
              <i class="mdi mdi-clock-outline mr-2 text-anvaya-blue"></i>
              <span>{{ venue.hours }}</span>
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <i class="mdi mdi-silverware mr-2 text-anvaya-blue"></i>
              <span>{{ venue.cuisine }}</span>
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <i class="mdi mdi-book-open-page-variant-outline mr-2 text-anvaya-blue"></i>
              <a 
                v-if="venue.menuLink" 
                :href="venue.menuLink" 
                target="_blank"
                class="hover:underline"
              >
                View Menu
              </a>
              <span v-else class="text-gray-400">No menu available</span>
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
