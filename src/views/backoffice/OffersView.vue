<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-medium">Offers</h2>
        <button
          @click="handleAdd"
          class="px-4 py-2 bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90"
        >
          Add Offer
        </button>
      </div>

      <div class="space-y-4">
        <draggable
          v-model="offers"
          item-key="id"
          @end="handleDragEnd"
          handle=".drag-handle"
        >
          <template #item="{ element: offer }">
            <div
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-start">
                <div class="flex gap-4">
                  <img
                    :src="offer.image"
                    :alt="offer.title"
                    class="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 class="font-medium">{{ offer.title }}</h3>
                    <p class="text-gray-600 text-sm">{{ offer.description }}</p>
                    <div class="mt-2 space-y-1">
                      <span
                        class="text-xs bg-anvaya-blue/10 text-anvaya-blue px-2 py-1 rounded-full"
                      >
                        {{ offer.category }}
                      </span>
                      <p class="text-xs text-anvaya-blue mt-1">
                        <i class="mdi mdi-calendar mr-1"></i>
                        {{ offer.date }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    class="p-2 text-gray-400 hover:text-gray-600 cursor-move drag-handle"
                  >
                    <i class="mdi mdi-drag-vertical"></i>
                  </button>
                  <button
                    @click="editOffer(offer)"
                    class="p-2 text-anvaya-blue hover:bg-anvaya-blue/5 rounded-lg"
                  >
                    <i class="mdi mdi-pencil"></i>
                  </button>
                  <button
                    @click="deleteOffer(offer.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <i class="mdi mdi-delete"></i>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
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
