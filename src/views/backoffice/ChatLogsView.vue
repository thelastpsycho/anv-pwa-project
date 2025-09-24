<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">Chat Logs & Settings</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search messages..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
          />
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <!-- Tabs -->
      <div class="relative bg-gray-100 p-1 rounded-lg flex items-center mb-6">
        <div
          class="absolute bg-white h-full rounded-md shadow-sm transition-transform duration-300 ease-in-out"
          :style="{ width: `${100 / tabs.length}%`, transform: `translateX(${activeTabIndex * 100}%)` }"
        ></div>
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="relative flex-1 px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors duration-300"
          :class="[activeTab === tab.id ? 'text-anvaya-blue' : 'text-gray-500 hover:text-gray-700']"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
    
    <!-- Chat Logs Tab -->
    <div v-if="activeTab === 'logs'">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-medium">Chat Logs</h2>
        <div class="flex items-center">
          <input
          v-model="searchQuery"
          type="search"
          placeholder="Search messages..."
          class="px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-anvaya-blue/30"
          />
        </div>
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
    :disabled="currentPage === 1"
    class="px-2 py-1 rounded border disabled:opacity-50"
    :class="currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-50'"
    @click="currentPage--"
    >
    Previous
  </button>
  <button
  :disabled="endIndex >= filteredSessions.length"
  class="px-2 py-1 rounded border disabled:opacity-50"
  :class="endIndex >= filteredSessions.length ? 'text-gray-400' : 'hover:bg-gray-50'"
  @click="currentPage++"
  >
  Next
</button>
</div>
</div>
</div>

<!-- Settings Tab -->
<div v-if="activeTab === 'settings'" class="space-y-6">
  <!-- Toggle Cards -->
  <div class="grid grid-cols-2 gap-6">
    <!-- Chat Availability Card -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-700">Chat Availability</h3>
        <button
          class="relative w-11 h-6 flex items-center rounded-full transition-colors duration-300"
          :class="isChatEnabled ? 'bg-green-500/20' : 'bg-gray-200'"
          @click="toggleChatAvailability"
        >
          <span
            class="absolute left-0.5 w-5 h-5 rounded-full transition-all duration-300 shadow-sm"
            :class="[
              isChatEnabled ? 'translate-x-5 bg-green-500' : 'translate-x-0 bg-gray-400'
            ]"
          />
        </button>
      </div>
      <p class="text-sm text-gray-600">
        {{ isChatEnabled ? 'Live chat is currently available to guests' : 'Live chat is currently disabled' }}
      </p>
    </div>
    
    <!-- Chat Logging Card -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-700">Chat Logging</h3>
        <button
          class="relative w-11 h-6 flex items-center rounded-full transition-colors duration-300"
          :class="isLoggingEnabled ? 'bg-green-500/20' : 'bg-gray-200'"
          @click="toggleLogging"
        >
          <span
            class="absolute left-0.5 w-5 h-5 rounded-full transition-all duration-300 shadow-sm"
            :class="[
              isLoggingEnabled ? 'translate-x-5 bg-green-500' : 'translate-x-0 bg-gray-400'
            ]"
          />
        </button>
      </div>
      <p class="text-sm text-gray-600">
        {{ isLoggingEnabled ? 'Chat conversations are being recorded' : 'Chat logging is disabled' }}
      </p>
    </div>
  </div>

  <!-- Export Section -->
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Export Data</h3>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Export all chat logs as JSON</p>
          <p class="text-xs text-gray-500 mt-1">Downloads all chat history in JSON format</p>
        </div>
        <button
          class="px-4 py-2 bg-anvaya-blue text-white text-sm rounded-lg hover:bg-anvaya-blue/90 transition-colors flex items-center gap-2"
          :disabled="isExporting"
          @click="exportChatLogs"
        >
          <i class="mdi mdi-download"></i>
          {{ isExporting ? 'Exporting...' : 'Export JSON' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Cleanup Section -->
  <div>
    <h3 class="text-sm font-medium text-gray-700 mb-4">Log Cleanup</h3>
    <div class="space-y-3">
      <p class="text-sm text-gray-600">Remove old chat logs based on age:</p>
      <div class="flex flex-wrap gap-3">
        <button
        v-for="option in cleanupOptions"
        :key="option.days"
        class="px-4 py-2 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
        @click="confirmCleanup(option.days, option.label)"
        >
        <i class="mdi mdi-delete-clock text-gray-500"></i>
        Older than {{ option.label }}
      </button>
    </div>
  </div>
</div>

<div>
  <h3 class="text-sm font-medium text-gray-700 mb-4">Chat Engine</h3>
  <div class="flex bg-gray-100 rounded-lg p-1 w-fit">
    <select v-model="selectedEngine" @change="updateEngine(selectedEngine)">
      <option value="gemini">Gemini</option>
      <option value="openai">OpenAI</option>
      <option value="deepseek">DeepSeek</option>
    </select>
  </div>
</div>
</div>
</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  getDoc, 
  setDoc, 
  where, 
  deleteDoc,
  Timestamp,
  limit 
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { ChatSession } from '@/types/chat';

const chatSessions = ref<ChatSession[]>([]);
const searchQuery = ref('');
const expandedSessions = ref<string[]>([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const isChatEnabled = ref(true);
const isLoggingEnabled = ref(true);
const selectedEngine = ref('gemini');
const showCleanupMenu = ref(false);
const cleanupOptions = [
{ days: 7, label: '1 week' },
{ days: 30, label: '1 month' },
{ days: 180, label: '6 months' },
{ days: 365, label: '1 year' }
];

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

// Load settings on mount
async function loadSettings() {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'chat'));
    const settings = settingsDoc.data();
    if (settings) {
      isChatEnabled.value = settings.enabled ?? true;
      isLoggingEnabled.value = settings.logging ?? true;
      selectedEngine.value = settings.engine ?? 'gemini';
    }
  } catch (error) {
    console.error('Error loading chat settings:', error);
  }
}

async function toggleChatAvailability() {
  try {
    isChatEnabled.value = !isChatEnabled.value;
    await setDoc(doc(db, 'settings', 'chat'), {
      enabled: isChatEnabled.value,
      logging: isLoggingEnabled.value
    }, { merge: true });
  } catch (error) {
    console.error('Error updating chat availability:', error);
    isChatEnabled.value = !isChatEnabled.value; // Revert on error
  }
}

async function toggleLogging() {
  try {
    isLoggingEnabled.value = !isLoggingEnabled.value;
    await setDoc(doc(db, 'settings', 'chat'), {
      enabled: isChatEnabled.value,
      logging: isLoggingEnabled.value
    }, { merge: true });
  } catch (error) {
    console.error('Error updating logging settings:', error);
    isLoggingEnabled.value = !isLoggingEnabled.value; // Revert on error
  }
}

async function updateAIEngine() {
  try {
    await setDoc(doc(db, 'settings', 'chat'), {
      enabled: isChatEnabled.value,
      logging: isLoggingEnabled.value,
      engine: selectedEngine.value
    }, { merge: true });
  } catch (error) {
    console.error('Error updating AI engine:', error);
    // Revert on error
    const settings = await getDoc(doc(db, 'settings', 'chat'));
    selectedEngine.value = settings.data()?.engine || 'gemini';
  }
}

async function cleanupOldLogs(days: number) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const q = query(
    collection(db, 'chatSessions'),
    where('lastMessageAt', '<=', cutoffDate.getTime())
    );
    
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    
    await Promise.all(deletePromises);
    await loadChatSessions();
    
    console.log(`Cleaned up ${snapshot.docs.length} old chat sessions`);
  } catch (error) {
    console.error('Error cleaning up old logs:', error);
  }
}

function confirmCleanup(days: number, label: string) {
  if (confirm(`Are you sure you want to delete all chat logs older than ${label}? This action cannot be undone.`)) {
    cleanupOldLogs(days);
  }
  showCleanupMenu.value = false;
}

const tabs = [
{ id: 'logs', label: 'Chat Logs' },
{ id: 'settings', label: 'Settings' }
];
const activeTab = ref('logs');
const activeTabIndex = computed(() => 
  tabs.findIndex(tab => tab.id === activeTab.value)
);
const isExporting = ref(false);

interface ChatExportData {
  id: string;
  roomNumber: string | null;
  startedAt: number;
  lastMessageAt: number;
  messages: {
    id: string;
    text: string;
    role: 'user' | 'assistant';
    timestamp: number;
  }[];
  status: 'active' | 'ended';
}

async function exportChatLogs() {
  try {
    isExporting.value = true;
    
    // Get all chat sessions with proper query
    const chatRef = collection(db, "chatSessions");
    const q = query(chatRef, orderBy("lastMessageAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const chatData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatExportData[];
    
    // Create Blob and download
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalChats: chatData.length,
      chats: chatData
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `anvaya-chat-logs-${timestamp}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error exporting chat logs:', error);
    alert('Failed to export chat logs: ' + (error as Error).message);
  } finally {
    isExporting.value = false;
  }
}

async function updateEngine(engine: string) {
  selectedEngine.value = engine;
  await updateAIEngine();
}

onMounted(() => {
  loadChatSessions();
  loadSettings();
});
</script> 