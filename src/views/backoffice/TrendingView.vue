<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">Trending Content</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="search"
            placeholder="Search trending..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
          />
        </div>
        <button
          class="inline-flex items-center gap-2 px-4 py-2 bg-anvaya-blue text-white text-sm font-medium rounded-lg hover:bg-anvaya-blue/90 transition-all duration-200 shadow-sm"
          @click="handleAdd"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Content</span>
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in trendingItems"
          :key="item.id"
          class="bg-white rounded-xl shadow-md overflow-hidden group transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
        >
          <div class="relative">
            <img
              :src="item.image"
              :alt="item.title"
              class="w-full h-48 object-cover"
            />
            <div
              class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"
            ></div>
            <div class="absolute top-4 right-4 flex gap-2">
              <button
                class="p-2 bg-white/80 text-anvaya-blue rounded-lg hover:bg-white transition-colors shadow-sm"
                @click="editItem(item)"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                class="p-2 bg-white/80 text-red-600 rounded-lg hover:bg-white transition-colors shadow-sm"
                @click="deleteItem(item.id)"
              >
                <i class="mdi mdi-delete"></i>
              </button>
            </div>
            <span
              class="absolute bottom-4 left-4 text-xs bg-anvaya-blue text-white px-2 py-1 rounded-full"
            >
              {{ item.type }}
            </span>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-lg text-gray-800">{{ item.title }}</h3>
            <p class="text-gray-600 text-sm mt-1">{{ item.description }}</p>
            <div class="mt-4 flex items-center text-sm text-gray-500">
              <i class="mdi mdi-clock-outline mr-2 text-anvaya-blue"></i>
              <span>{{ item.validUntil }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditDataModal
      v-if="showAddModal || editingItem"
      :is-open="showAddModal || !!editingItem"
      :title="editingItem ? 'Edit Content' : 'Add Content'"
      collection="trending"
      :document-id="editingItem?.id"
      :initial-data="editingItem || defaultItem"
      :fields="{
        title: { label: 'Title', type: 'text' },
        description: { label: 'Description', type: 'textarea' },
        image: { label: 'Image URL', type: 'text' },
        validUntil: { label: 'Valid Until', type: 'text' },
        type: { 
          label: 'Type', 
          type: 'select',
          options: ['activity', 'promotion', 'event']
        }
      }"
      @close="handleModalClose"
      @saved="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import EditDataModal from '@/components/EditDataModal.vue';
import type { TrendingItem } from '@/types/trending';

const trendingItems = ref<TrendingItem[]>([]);
const showAddModal = ref(false);
const editingItem = ref<TrendingItem | null>(null);

const defaultItem = {
  title: '',
  description: '',
  image: '',
  validUntil: '',
  type: 'promotion'
};

async function loadTrendingItems() {
  try {
    const querySnapshot = await getDocs(collection(db, 'trending'));
    trendingItems.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TrendingItem[];
  } catch (error) {
    console.error('Error loading trending items:', error);
  }
}

async function deleteItem(id: string) {
  if (confirm('Are you sure you want to delete this item?')) {
    try {
      await deleteDoc(doc(db, 'trending', id));
      await loadTrendingItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
}

function editItem(item: TrendingItem) {
  editingItem.value = item;
}

function handleAdd() {
  showAddModal.value = true;
}

function handleModalClose() {
  showAddModal.value = false;
  editingItem.value = null;
}

async function handleSave() {
  await loadTrendingItems();
  handleModalClose();
}

onMounted(() => {
  loadTrendingItems();
});
</script> 