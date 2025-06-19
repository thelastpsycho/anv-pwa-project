<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-medium">TV Channels</h2>
        <button
          @click="openAddModal"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-anvaya-blue to-anvaya-blue/90 text-white text-sm font-medium rounded-lg hover:from-anvaya-blue/95 hover:to-anvaya-blue/85"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Channel</span>
        </button>
      </div>
      <div class="mb-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search channel..."
            class="w-full px-4 py-2.5 pl-10 bg-white rounded-xl border border-anvaya-gray/10 focus:outline-none focus:border-anvaya-blue/30 text-sm"
          />
          <i class="mdi mdi-magnify absolute left-3.5 top-2.5 text-anvaya-blue/60 text-lg"></i>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-xs text-left text-anvaya-blue">
          <thead>
            <tr class="border-b border-anvaya-gray/10">
              <th class="px-2 py-1 font-semibold">Channel</th>
              <th class="px-2 py-1 font-semibold">Channel Name</th>
              <th class="px-2 py-1 font-semibold w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="channel in filteredChannels" :key="channel.id" class="border-b border-anvaya-gray/10">
              <td class="px-2 py-1">{{ channel.number }}</td>
              <td class="px-2 py-1">{{ channel.name }}</td>
              <td class="px-2 py-1">
                <button @click="openEditModal(channel)" class="p-1.5 text-anvaya-blue hover:bg-anvaya-blue/5 rounded-lg">
                  <i class="mdi mdi-pencil text-sm"></i>
                </button>
                <button @click="deleteChannel(channel.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                  <i class="mdi mdi-delete text-sm"></i>
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