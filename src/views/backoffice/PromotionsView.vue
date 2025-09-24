<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">F&B Promotions</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search promotion..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
          />
        </div>
        <button
          class="inline-flex items-center gap-2 px-4 py-2 bg-anvaya-blue text-white text-sm font-medium rounded-lg hover:bg-anvaya-blue/90 transition-all duration-200 shadow-sm"
          @click="handleAdd"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Promotion</span>
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="promo in filteredPromotions"
          :key="promo.id"
          class="bg-white rounded-xl shadow-md overflow-hidden group transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          <div class="relative">
            <img
              :src="promo.image"
              :alt="promo.title"
              class="w-full h-48 object-cover"
            />
            <div
              class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"
            ></div>
            <div class="absolute top-4 right-4 flex gap-2">
              <button
                class="p-2 bg-white/80 text-anvaya-blue rounded-lg hover:bg-white transition-colors shadow-sm"
                @click="editPromotion(promo)"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                class="p-2 bg-white/80 text-red-600 rounded-lg hover:bg-white transition-colors shadow-sm"
                @click="deletePromotion(promo.id)"
              >
                <i class="mdi mdi-delete"></i>
              </button>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-lg text-gray-800">{{ promo.title }}</h3>
            <p class="text-gray-600 text-sm mt-1">{{ promo.description }}</p>
            <div class="mt-4 space-y-2">
              <div v-if="promo.price" class="flex items-center text-sm text-gray-500">
                <i class="mdi mdi-currency-usd mr-2 text-anvaya-blue"></i>
                <span>{{ promo.price }}</span>
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <i class="mdi mdi-calendar mr-2 text-anvaya-blue"></i>
                <span>{{ promo.validUntil }}</span>
              </div>
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
import { ref, onMounted, computed } from "vue";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { FBPromotion } from "@/types/promotions";
import EditDataModal from "@/components/EditDataModal.vue";

const promotions = ref<FBPromotion[]>([]);
const showAddModal = ref(false);
const editingPromotion = ref<FBPromotion | null>(null);
const searchQuery = ref("");

const filteredPromotions = computed(() => {
  if (!searchQuery.value) {
    return promotions.value;
  }
  const searchLower = searchQuery.value.toLowerCase();
  return promotions.value.filter(
    (promo) =>
      promo.title.toLowerCase().includes(searchLower) ||
      promo.description.toLowerCase().includes(searchLower)
  );
});

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
