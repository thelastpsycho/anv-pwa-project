<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-medium">Trending Content</h2>
        <button
          @click="handleAdd"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-anvaya-blue to-anvaya-blue/90 text-white text-sm font-medium rounded-lg hover:from-anvaya-blue/95 hover:to-anvaya-blue/85 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Content</span>
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="item in trendingItems"
          :key="item.id"
          class="border rounded-lg p-4"
        >
          <div class="flex justify-between items-start">
            <div class="flex gap-4">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 class="font-medium">{{ item.title }}</h3>
                <p class="text-gray-600 text-sm">{{ item.description }}</p>
                <div class="mt-2 space-y-1">
                  <p class="text-xs text-anvaya-blue">
                    <i class="mdi mdi-clock-outline mr-1"></i>
                    {{ item.validUntil }}
                  </p>
                  <p class="text-xs text-anvaya-blue">
                    <i class="mdi mdi-tag-outline mr-1"></i>
                    {{ item.type }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="editItem(item)"
                class="p-2 text-anvaya-blue hover:bg-anvaya-blue/5 rounded-lg"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                @click="deleteItem(item.id)"
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