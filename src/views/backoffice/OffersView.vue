<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">Offers</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="search"
            placeholder="Search offer..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
          />
        </div>
        <button
          @click="handleAdd"
          class="inline-flex items-center gap-2 px-4 py-2 bg-anvaya-blue text-white text-sm font-medium rounded-lg hover:bg-anvaya-blue/90 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Offer</span>
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <draggable
        v-model="offers"
        item-key="id"
        @end="handleDragEnd"
        handle=".drag-handle"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <template #item="{ element: offer }">
          <div
            class="bg-white rounded-xl shadow-md overflow-hidden group transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
          >
            <div class="relative">
              <img
                :src="offer.image"
                :alt="offer.title"
                class="w-full h-48 object-cover"
              />
              <div
                class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"
              ></div>
              <div class="absolute top-4 right-4 flex gap-2">
                <button
                  class="p-2 bg-white/80 text-gray-600 rounded-lg hover:bg-white transition-colors shadow-sm drag-handle"
                >
                  <i class="mdi mdi-drag-vertical"></i>
                </button>
                <button
                  @click="editOffer(offer)"
                  class="p-2 bg-white/80 text-anvaya-blue rounded-lg hover:bg-white transition-colors shadow-sm"
                >
                  <i class="mdi mdi-pencil"></i>
                </button>
                <button
                  @click="deleteOffer(offer.id)"
                  class="p-2 bg-white/80 text-red-600 rounded-lg hover:bg-white transition-colors shadow-sm"
                >
                  <i class="mdi mdi-delete"></i>
                </button>
              </div>
              <span
                class="absolute bottom-4 left-4 text-xs bg-anvaya-blue text-white px-2 py-1 rounded-full"
              >
                {{ offer.category }}
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-lg text-gray-800">{{ offer.title }}</h3>
              <p class="text-gray-600 text-sm mt-1">{{ offer.description }}</p>
              <div class="mt-4 flex items-center text-sm text-gray-500">
                <i class="mdi mdi-calendar mr-2 text-anvaya-blue"></i>
                <span>{{ offer.date }}</span>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <EditDataModal
      v-if="editingOffer || showAddModal"
      :is-open="!!editingOffer || showAddModal"
      title="Offer"
      collection="offers"
      :document-id="editingOffer?.id?.toString()"
      :initial-data="editingOffer || {
        title: '',
        description: '',
        category: 'staycation',
        price: '',
        image: '',
        date: '',
        details: [],
        sortOrder: offers.length
      }"
      :fields="{
        title: { label: 'Title', type: 'text' },
        description: { label: 'Description', type: 'textarea' },
        category: {
          label: 'Category',
          type: 'select',
          options: ['staycation', 'dining', 'special'],
        },
        price: { label: 'Price', type: 'text' },
        image: { label: 'Image URL', type: 'text' },
        date: { label: 'Date/Validity', type: 'text' },
        details: { 
          label: 'Details', 
          type: 'array',
          placeholder: 'Enter each detail on a new line'
        },
      }"
      @close="handleModalClose"
      @saved="loadOffers"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Offer } from "@/types/offers";
import EditDataModal from "@/components/EditDataModal.vue";
import draggable from 'vuedraggable';

const offers = ref<Offer[]>([]);
const showAddModal = ref(false);
const editingOffer = ref<Offer | null>(null);

async function loadOffers() {
  try {
    const querySnapshot = await getDocs(collection(db, "offers"));
    offers.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        details: Array.isArray(data.details) 
          ? data.details 
          : data.details 
            ? typeof data.details === 'string'
              ? [data.details]
              : data.details.split('').filter(Boolean)
            : [],
        sortOrder: data.sortOrder || 0
      };
    }) as unknown as Offer[];
    // Sort offers by sortOrder
    offers.value.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (error) {
    console.error("Error loading offers:", error);
  }
}

async function handleDragEnd() {
  // Update sortOrder for all offers
  const batch = offers.value.map((offer, index) => {
    return updateDoc(doc(db, "offers", offer.id), {
      sortOrder: index
    });
  });
  
  try {
    await Promise.all(batch);
  } catch (error) {
    console.error("Error updating sort order:", error);
  }
}

async function deleteOffer(id: string) {
  if (confirm("Are you sure you want to delete this offer?")) {
    try {
      await deleteDoc(doc(db, "offers", id));
      await loadOffers();
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  }
}

function editOffer(offer: Offer) {
  editingOffer.value = offer;
}

function handleAdd() {
  editingOffer.value = null;
  showAddModal.value = true;
}

function handleModalClose() {
  showAddModal.value = false;
  editingOffer.value = null;
}

onMounted(() => {
  loadOffers();
});
</script>
