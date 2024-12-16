<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-medium">Offers</h2>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90"
        >
          Add Offer
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="offer in offers"
          :key="offer.id"
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
      </div>
    </div>
    <EditDataModal
      v-if="editingOffer"
      :is-open="!!editingOffer"
      title="Offer"
      collection="offers"
      :document-id="editingOffer.id.toString()"
      :initial-data="editingOffer"
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
        details: { label: 'Details', type: 'textarea' },
      }"
      @close="editingOffer = null"
      @saved="loadOffers"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Offer } from "@/types/offers";
import EditDataModal from "@/components/EditDataModal.vue";

const offers = ref<Offer[]>([]);
const showAddModal = ref(false);
const editingOffer = ref<Offer | null>(null);

async function loadOffers() {
  try {
    const querySnapshot = await getDocs(collection(db, "offers"));
    offers.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as Offer[];
  } catch (error) {
    console.error("Error loading offers:", error);
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

onMounted(() => {
  loadOffers();
});
</script>
