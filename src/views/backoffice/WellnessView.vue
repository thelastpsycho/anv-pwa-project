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
          v-for="service in services"
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
                <div class="mt-2 space-y-1">
                  <p class="text-xs text-anvaya-blue">
                    <i class="mdi mdi-clock-outline mr-1"></i>
                    {{ service.operatingHours }}
                  </p>
                  <p
                    v-if="service.additionalInfo"
                    class="text-xs text-anvaya-blue italic"
                  >
                    {{ service.additionalInfo[0] }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="editService(service)"
                class="p-2 text-anvaya-blue hover:bg-anvaya-blue/5 rounded-lg"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                @click="deleteService(service.id)"
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
      v-if="showAddModal"
      :is-open="showAddModal"
      title="Wellness Service"
      collection="wellness"
      :initial-data="{
        title: '',
        description: '',
        operatingHours: '',
        image: '',
        hasBooking: 'false',
        additionalInfo: '[]',
      }"
      :fields="{
        title: { label: 'Title', type: 'text' },
        description: { label: 'Description', type: 'textarea' },
        operatingHours: { label: 'Operating Hours', type: 'text' },
        image: { label: 'Image URL', type: 'text' },
        hasBooking: {
          label: 'Has Booking',
          type: 'select',
          options: ['true', 'false'],
        },
        additionalInfo: { label: 'Additional Info', type: 'textarea' },
      }"
      @close="showAddModal = false"
      @saved="loadServices"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { WellnessService } from "@/types/wellness";
import EditDataModal from "@/components/EditDataModal.vue";

const services = ref<WellnessService[]>([]);
const showAddModal = ref(false);
const editingService = ref<WellnessService | null>(null);

async function loadServices() {
  try {
    const querySnapshot = await getDocs(collection(db, "wellness"));
    services.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as WellnessService[];
  } catch (error) {
    console.error("Error loading services:", error);
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

function editService(service: WellnessService) {
  editingService.value = service;
}

function handleAdd() {
  showAddModal.value = true;
}

onMounted(() => {
  loadServices();
});
</script>
