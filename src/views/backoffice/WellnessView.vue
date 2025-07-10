<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">Wellness Services</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="search"
            placeholder="Search service..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
          />
        </div>
        <button
          @click="handleAdd"
          class="inline-flex items-center gap-2 px-4 py-2 bg-anvaya-blue text-white text-sm font-medium rounded-lg hover:bg-anvaya-blue/90 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Service</span>
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="service in wellnessServices"
          :key="service.id"
          class="bg-white rounded-xl shadow-md overflow-hidden group transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          <div class="relative">
            <img
              :src="service.image"
              :alt="service.title"
              class="w-full h-48 object-cover"
            />
            <div
              class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"
            ></div>
            <div class="absolute top-4 right-4 flex gap-2">
              <button
                @click="editService(service)"
                class="p-2 bg-white/80 text-anvaya-blue rounded-lg hover:bg-white transition-colors shadow-sm"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                @click="deleteService(service.id)"
                class="p-2 bg-white/80 text-red-600 rounded-lg hover:bg-white transition-colors shadow-sm"
              >
                <i class="mdi mdi-delete"></i>
              </button>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-lg text-gray-800">{{ service.title }}</h3>
            <p class="text-gray-600 text-sm mt-1">{{ service.description }}</p>
            <div class="mt-4 flex items-center text-sm text-gray-500">
              <i class="mdi mdi-clock-outline mr-2 text-anvaya-blue"></i>
              <span>{{ service.operatingHours }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditDataModal
      v-if="showAddModal || editingService"
      :isOpen="showAddModal || !!editingService"
      :title="editingService ? 'Edit Service' : 'Add New Service'"
      collection="wellness"
      :document-id="editingService?.id"
      :initialData="editingService || {}"
      :fields="{
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
        operatingHours: { type: 'text', label: 'Operating Hours' },
        image: { type: 'text', label: 'Image URL' },
        hasBooking: { type: 'text', label: 'Has Booking' },
        additionalInfo: { type: 'text', label: 'Additional Info' },
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
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { WellnessService } from "@/types/wellness";
import EditDataModal from "@/components/EditDataModal.vue";

const wellnessServices = ref<WellnessService[]>([]);
const showAddModal = ref(false);
const editingService = ref<WellnessService | null>(null);

async function loadServices() {
  try {
    const querySnapshot = await getDocs(collection(db, "wellness"));
    wellnessServices.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as WellnessService[];
  } catch (error) {
    console.error("Error loading wellness services:", error);
  }
}

function editService(service: WellnessService) {
  editingService.value = service;
}

function handleAdd() {
  showAddModal.value = true;
}

function handleModalClose() {
  showAddModal.value = false;
  editingService.value = null;
}

async function handleSave(data: Partial<WellnessService>) {
  try {
    if (editingService.value) {
      await updateDoc(doc(db, "wellness", editingService.value.id), data);
    } else {
      await addDoc(collection(db, "wellness"), data);
    }
    await loadServices();
    handleModalClose();
  } catch (error) {
    console.error("Error saving wellness service:", error);
  }
}

async function deleteService(id: string) {
  if (confirm("Are you sure you want to delete this service?")) {
    try {
      await deleteDoc(doc(db, "wellness", id));
      await loadServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  }
}

onMounted(() => {
  loadServices();
});
</script>
