<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-medium">Chat Logs</h2>
        <input
          type="search"
          v-model="searchQuery"
          placeholder="Search messages..."
          class="px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-anvaya-blue/30"
        />
      </div>

      <!-- Chat Sessions -->
      <div class="space-y-2">
        <div 
          v-for="session in paginatedSessions" 
          :key="session.id" 
          class="border rounded-lg p-2 text-xs"
        >
          <div class="flex justify-between items-start">
            <div 
              class="cursor-pointer flex items-center gap-3 text-[11px]" 
              @click="toggleSession(session.id)"
            >
              <span class="font-medium text-xs">
                {{ session.roomNumber ? `Room ${session.roomNumber}` : 'Guest User' }}
              </span>
              <span class="text-gray-400">•</span>
              <span class="text-gray-500">
                {{ new Date(session.startedAt).toLocaleString() }}
              </span>
              <span class="text-gray-400">•</span>
              <span class="text-gray-500">
                {{ new Date(session.lastMessageAt).toLocaleString() }}
              </span>
            </div>
            <span 
              :class="[
                'px-2 py-1 text-xs rounded-full',
                session.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              ]"
            >
              {{ session.status }}
            </span>
          </div>

          <!-- Messages -->
          <div v-if="expandedSessions.includes(session.id)" class="space-y-3 mt-4">
            <div 
              v-for="message in session.messages" 
              :key="message.id"
              :class="[
                'p-3 rounded-lg max-w-[80%]',
                message.role === 'user' ? 
                  'ml-auto bg-anvaya-blue text-white' : 
                  'bg-gray-100'
              ]"
            >
              <p class="text-xs" v-html="formatMessage(message.text)"></p>
              <span class="text-[10px] opacity-70 mt-1 block">
                {{ new Date(message.timestamp).toLocaleTimeString() }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4 pt-4 border-t text-xs">
        <span class="text-gray-500">
          Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredSessions.length }}
        </span>
        <div class="flex gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-2 py-1 rounded border disabled:opacity-50"
            :class="currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-50'"
          >
            Previous
          </button>
          <button
            @click="currentPage++"
            :disabled="endIndex >= filteredSessions.length"
            class="px-2 py-1 rounded border disabled:opacity-50"
            :class="endIndex >= filteredSessions.length ? 'text-gray-400' : 'hover:bg-gray-50'"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { ChatSession } from '@/types/chat';

const chatSessions = ref<ChatSession[]>([]);
const searchQuery = ref('');
const expandedSessions = ref<string[]>([]);
const currentPage = ref(1);
const itemsPerPage = 10;

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredSessions.value.length));

const paginatedSessions = computed(() => 
  filteredSessions.value.slice(startIndex.value, endIndex.value)
);

// Reset pagination when search changes
watch(searchQuery, () => {
  currentPage.value = 1;
});

function highlightText(text: string): string {
  if (!searchQuery.value) return text;
  const searchTerm = searchQuery.value.toLowerCase();
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-500/50 rounded px-0.5">$1</mark>');
}

const filteredSessions = computed(() => {
  if (!searchQuery.value) return chatSessions.value;
  
  const search = searchQuery.value.toLowerCase();
  return chatSessions.value.filter(session => {
    // Search in room number
    if (session.roomNumber?.toLowerCase().includes(search)) return true;
    
    // Search in messages
    return session.messages.some(msg => 
      msg.text.toLowerCase().includes(search)
    );
  });
});

function toggleSession(sessionId: string) {
  const index = expandedSessions.value.indexOf(sessionId);
  if (index === -1) {
    expandedSessions.value.push(sessionId);
  } else {
    expandedSessions.value.splice(index, 1);
  }
}

async function loadChatSessions() {
  try {
    const q = query(
      collection(db, 'chatSessions'), 
      orderBy('lastMessageAt', 'desc')
    );
    const snapshot = await getDocs(q);
    chatSessions.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatSession[];
  } catch (error) {
    console.error('Error loading chat sessions:', error);
  }
}

function formatMessage(text: string): string {
  // First handle bullet points
  const withBullets = text.split('\n').map(line => {
    if (line.trim().startsWith('--')) {
      return `<div class="flex items-start gap-2">
        <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-anvaya-blue/60 flex-shrink-0"></span>
        <span>${highlightText(line.trim().substring(2))}</span>
      </div>`;
    }
    return highlightText(line);
  }).join('\n');
  
  // Then handle URLs
  return withBullets.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" class="underline hover:text-anvaya-blue/80 transition-colors">$1</a>'
  );
}

onMounted(() => {
  loadChatSessions();
});
</script> 