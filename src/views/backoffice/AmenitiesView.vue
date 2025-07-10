<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">Amenities</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="search"
            placeholder="Search amenity..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
          />
        </div>
        <button
          @click="showAddModal = true"
          class="inline-flex items-center gap-2 px-4 py-2 bg-anvaya-blue text-white text-sm font-medium rounded-lg hover:bg-anvaya-blue/90 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Amenity</span>
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="amenity in amenities"
          :key="amenity.id"
          class="bg-white rounded-xl shadow-md p-6 group transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold text-lg text-gray-800">{{ amenity.title }}</h3>
              <p class="text-gray-600 text-sm mt-1">{{ amenity.description }}</p>
            </div>
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                @click="editAmenity(amenity)"
                class="p-2 bg-gray-100 text-anvaya-blue rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                @click="deleteAmenity(amenity.id)"
                class="p-2 bg-gray-100 text-red-600 rounded-lg hover:bg-gray-200 transition-colors"
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
