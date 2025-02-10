<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-medium">Amenities</h2>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90"
        >
          Add Amenity
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="amenity in amenities"
          :key="amenity.id"
          class="border rounded-lg p-4"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium">{{ amenity.title }}</h3>
              <p class="text-gray-600 text-sm">{{ amenity.description }}</p>
            </div>
            <div class="flex gap-2">
              <button
                @click="editAmenity(amenity)"
                class="p-2 text-anvaya-blue hover:bg-anvaya-blue/5 rounded-lg"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                @click="deleteAmenity(amenity.id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <i class="mdi mdi-delete"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Amenity } from "@/data/amenities";

const amenities = ref<Amenity[]>([]);
const showAddModal = ref(false);

async function loadAmenities() {
  try {
    const querySnapshot = await getDocs(collection(db, "amenities"));
    amenities.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Amenity[];
  } catch (error) {
    console.error("Error loading amenities:", error);
  }
}

async function deleteAmenity(id: string) {
  if (confirm("Are you sure you want to delete this amenity?")) {
    try {
      await deleteDoc(doc(db, "amenities", id));
      await loadAmenities();
    } catch (error) {
      console.error("Error deleting amenity:", error);
    }
  }
}

function editAmenity(amenity: Amenity) {
  // TODO: Implement edit functionality
  console.log("Edit amenity:", amenity);
}

onMounted(() => {
  loadAmenities();
});
</script>
