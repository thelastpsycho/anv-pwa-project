import { defineStore } from 'pinia';
import { ref } from 'vue';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { TVChannel } from '@/types/tvChannel';

export const useTvChannelsStore = defineStore('tvChannels', () => {
  const channels = ref<TVChannel[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadChannels() {
    loading.value = true;
    error.value = null;
    try {
      const querySnapshot = await getDocs(collection(db, 'tvChannels'));
      channels.value = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<TVChannel, 'id'>),
      }));
    } catch (e: any) {
      error.value = e.message || 'Failed to load TV channels';
    } finally {
      loading.value = false;
    }
  }

  async function addChannel(channel: Omit<TVChannel, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'tvChannels'), channel);
      channels.value.push({ ...channel, id: docRef.id });
    } catch (e: any) {
      error.value = e.message || 'Failed to add channel';
    }
  }

  async function updateChannel(id: string, channel: Omit<TVChannel, 'id'>) {
    try {
      await updateDoc(doc(db, 'tvChannels', id), channel);
      const idx = channels.value.findIndex(c => c.id === id);
      if (idx !== -1) channels.value[idx] = { ...channel, id };
    } catch (e: any) {
      error.value = e.message || 'Failed to update channel';
    }
  }

  async function deleteChannel(id: string) {
    try {
      await deleteDoc(doc(db, 'tvChannels', id));
      channels.value = channels.value.filter(c => c.id !== id);
    } catch (e: any) {
      error.value = e.message || 'Failed to delete channel';
    }
  }

  return {
    channels,
    loading,
    error,
    loadChannels,
    addChannel,
    updateChannel,
    deleteChannel,
  };
}); 