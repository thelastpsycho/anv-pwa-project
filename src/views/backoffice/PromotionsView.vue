<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-medium">F&B Promotions</h2>
        <button
          @click="handleAdd"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-anvaya-blue to-anvaya-blue/90 text-white text-sm font-medium rounded-lg hover:from-anvaya-blue/95 hover:to-anvaya-blue/85 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Promotion</span>
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="promo in promotions"
          :key="promo.id"
          class="border rounded-lg p-4"
        >
          <div class="flex justify-between items-start">
            <div class="flex gap-4">
              <img
                :src="promo.image"
                :alt="promo.title"
                class="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 class="font-medium">{{ promo.title }}</h3>
                <p class="text-gray-600 text-sm">{{ promo.description }}</p>
                <div class="mt-2 space-y-1">
                  <p v-if="promo.price" class="text-xs text-anvaya-blue">
                    <i class="mdi mdi-currency-usd mr-1"></i>
                    {{ promo.price }}
                  </p>
                  <p class="text-xs text-anvaya-blue">
                    <i class="mdi mdi-calendar mr-1"></i>
                    {{ promo.validUntil }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="editPromotion(promo)"
                class="p-2 text-anvaya-blue hover:bg-anvaya-blue/5 rounded-lg"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                @click="deletePromotion(promo.id)"
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
      v-if="showAddModal || editingPromotion"
      :is-open="showAddModal || !!editingPromotion"
      title="F&B Promotion"
      collection="promotions"
      :document-id="editingPromotion?.id"
      :initial-data="
        editingPromotion || {
          title: '',
          description: '',
          price: '',
          image: '',
          validUntil: '',
          fbLink: '',
        }
      "
      :fields="{
        title: { label: 'Title', type: 'text' },
        description: { label: 'Description', type: 'textarea' },
        price: { label: 'Price', type: 'text' },
        image: { label: 'Image URL', type: 'text' },
        validUntil: { label: 'Valid Until', type: 'text' },
        fbLink: { label: 'Facebook Link', type: 'text' },
      }"
      @close="handleModalClose"
      @saved="loadPromotions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { FBPromotion } from "@/types/promotions";
import EditDataModal from "@/components/EditDataModal.vue";

const promotions = ref<FBPromotion[]>([]);
const showAddModal = ref(false);
const editingPromotion = ref<FBPromotion | null>(null);

async function loadPromotions() {
  try {
    const querySnapshot = await getDocs(collection(db, "promotions"));
    promotions.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as FBPromotion[];
  } catch (error) {
    console.error("Error loading promotions:", error);
  }
}

async function deletePromotion(id: string) {
  if (confirm("Are you sure you want to delete this promotion?")) {
    try {
      await deleteDoc(doc(db, "promotions", id));
      await loadPromotions();
    } catch (error) {
      console.error("Error deleting promotion:", error);
    }
  }
}

function editPromotion(promotion: FBPromotion) {
  showAddModal.value = false;
  editingPromotion.value = promotion;
}

function handleAdd() {
  showAddModal.value = true;
}

function handleModalClose() {
  showAddModal.value = false;
  editingPromotion.value = null;
}

onMounted(() => {
  loadPromotions();
});
</script>
