<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">TV Channels</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search channel..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
          />
        </div>
        <button
          @click="openAddModal"
          class="inline-flex items-center gap-2 px-4 py-2 bg-anvaya-blue text-white text-sm font-medium rounded-lg hover:bg-anvaya-blue/90 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Channel</span>
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm text-left text-gray-700">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="px-4 py-3 font-semibold">Channel Number</th>
            <th class="px-4 py-3 font-semibold">Channel Name</th>
            <th class="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="channel in filteredChannels" :key="channel.id" class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3">{{ channel.number }}</td>
            <td class="px-4 py-3">{{ channel.name }}</td>
            <td class="px-4 py-3 text-right">
              <button @click="openEditModal(channel)" class="p-2 text-anvaya-blue hover:bg-anvaya-blue/10 rounded-lg transition-colors">
                <i class="mdi mdi-pencil text-lg"></i>
              </button>
              <button @click="deleteChannel(channel.id)" class="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                <i class="mdi mdi-delete text-lg"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredChannels.length === 0">
            <td colspan="3" class="text-center text-gray-500 py-4">No channels found.</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
    <EditDataModal
      v-if="showModal"
      :is-open="showModal"
      :title="editingChannel ? 'Edit Channel' : 'Add Channel'"
      collection="tvChannels"
      :document-id="editingChannel?.id"
      :initial-data="editingChannel ? { number: editingChannel.number, name: editingChannel.name } : { number: '', name: '' }"
      :fields="{
        number: { label: 'Channel Number', type: 'number' },
        name: { label: 'Channel Name', type: 'text' },
      }"
      @close="closeModal"
      @saved="saveChannel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTvChannelsStore } from '@/stores/tvChannels';
import EditDataModal from '@/components/EditDataModal.vue';
import type { TVChannel } from '@/types/tvChannel';

const store = useTvChannelsStore();
const searchQuery = ref('');
const showModal = ref(false);
const editingChannel = ref<TVChannel | null>(null);

const filteredChannels = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return store.channels;
  return store.channels.filter(
    c => c.name.toLowerCase().includes(query) || c.number.toString().includes(query)
  );
});

function openAddModal() {
  editingChannel.value = null;
  showModal.value = true;
}

function openEditModal(channel: TVChannel) {
  editingChannel.value = { ...channel };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingChannel.value = null;
}

async function saveChannel(data: Record<string, any>) {
  const number = typeof data.number === 'string' ? parseInt(data.number, 10) : data.number;
  const name = data.name;
  if (editingChannel.value) {
    await store.updateChannel(editingChannel.value.id, {
      number,
      name,
    });
  } else {
    await store.addChannel({
      number,
      name,
    });
  }
  closeModal();
}

async function deleteChannel(id: string) {
  if (confirm('Are you sure you want to delete this channel?')) {
    await store.deleteChannel(id);
  }
}

onMounted(() => {
  store.loadChannels();
});
</script> 