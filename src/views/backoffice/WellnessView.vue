<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-medium">Wellness Services</h2>
        <button
          @click="handleAdd"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-anvaya-blue to-anvaya-blue/90 text-white text-sm font-medium rounded-lg hover:from-anvaya-blue/95 hover:to-anvaya-blue/85 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Service</span>
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="service in wellnessServices"
          :key="service.id"
          class="border rounded-lg p-4"
        >
          <div class="flex justify-between items-start">
            <div class="flex gap-4">
              <img
                :src="service.image"
                :alt="service.title"
                class="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 class="font-medium">{{ service.title }}</h3>
                <p class="text-gray-600 text-sm">{{ service.description }}</p>
                <p class="text-gray-500 text-sm mt-1">
                  {{ service.operatingHours }}
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="editService(service)"
                class="p-1.5 text-gray-500 hover:text-anvaya-blue rounded-lg hover:bg-anvaya-blue/10 transition-colors"
              >
                <i class="mdi mdi-pencil text-lg"></i>
              </button>
              <button
                @click="deleteService(service.id)"
                class="p-1.5 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              >
                <i class="mdi mdi-delete text-lg"></i>
              </button>
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
