<template>
  <div 
    class="chat min-h-screen bg-white dark:bg-gray-900"
    :class="[
      'opacity-0 translate-y-5 transition-all duration-600 ease-out',
      isLoaded ? 'opacity-100 translate-y-0' : '',
    ]"
  >
    <div class="p-4">
      <PageHeader title="Live Chat" />
      
      <div class="mt-4 flex flex-col h-[calc(100vh-200px)]">
        <!-- Chat Messages Container -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto mb-4 space-y-4">
          <div v-for="message in messages" :key="message.id" class="flex gap-3">
            <div 
              :class="[
                'max-w-[80%] rounded-xl p-3',
                message.role === 'user' ? 
                  'ml-auto bg-anvaya-blue text-white' : 
                  'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              ]"
            >
              <p class="text-sm" v-html="formatMessage(message.text)"></p>
              <span class="text-[10px] opacity-70 mt-1 block">
                {{ new Date(message.timestamp).toLocaleTimeString() }}
              </span>
            </div>
          </div>
          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex gap-3">
            <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-anvaya-blue/60 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-anvaya-blue/60 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-anvaya-blue/60 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="border-t dark:border-gray-800 pt-4">
          <form @submit.prevent="sendMessage" class="flex gap-2">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type your message..."
              class="flex-1 px-4 py-2 rounded-xl border border-anvaya-gray/10 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-anvaya-blue/30"
            />
            <button
              type="submit"
              class="px-4 py-2 bg-anvaya-blue text-white rounded-xl hover:bg-anvaya-blue/90 transition-colors"
            >
              <i class="mdi mdi-send"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import { generateGeminiResponse } from '@/services/gemini';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuthStore } from '@/stores/auth';
import type { ChatMessage, ChatSession } from '@/types/chat';

const authStore = useAuthStore();
const sessionId = ref<string>('');

const isLoaded = ref(false);
const newMessage = ref('');
const isTyping = ref(false);
const messages = ref<ChatMessage[]>([
  {
    id: '1',
    text: 'Hello! How can I assist you today?',
    role: 'assistant',
    timestamp: Date.now()
  }
]);

const chatContainer = ref<HTMLElement | null>(null);

let loadTimeout: number;

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}

async function sendMessage() {
  if (!newMessage.value.trim()) return;
  
  const userMessage = {
    id: Date.now().toString(),
    text: newMessage.value,
    role: 'user' as const,
    timestamp: Date.now()
  };

  // Add user message
  messages.value.push(userMessage);
  scrollToBottom();

  // Clear input immediately after sending
  const messageToSend = newMessage.value;
  newMessage.value = '';
  
  // Show typing indicator
  isTyping.value = true;
  scrollToBottom();
  
  try {
    if (!sessionId.value) {
      // Create new chat session
      const sessionRef = await addDoc(collection(db, 'chatSessions'), {
        roomNumber: authStore.profileUser?.roomNumber || null,
        startedAt: Date.now(),
        lastMessageAt: Date.now(),
        messages: [userMessage],
        status: 'active'
      });
      sessionId.value = sessionRef.id;
    }

    // Get response from Gemini
    const response = await generateGeminiResponse(messageToSend, messages.value);
    
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      text: response,
      role: 'assistant' as const,
      timestamp: Date.now()
    };

    // Add AI response
    messages.value.push(aiMessage);

    // Update chat session
    await updateDoc(doc(db, 'chatSessions', sessionId.value), {
      lastMessageAt: Date.now(),
      messages: [...messages.value]
    });

    scrollToBottom();
  } catch (error) {
    console.error('Chat error:', error);
    messages.value.push({
      id: Date.now().toString(),
      text: "I apologize, but our live chat is currently unavailable. Please come back later.",
      role: 'assistant',
      timestamp: Date.now()
    });
    scrollToBottom();
    
    // End the session if Gemini is unavailable
    if (sessionId.value) {
      updateDoc(doc(db, 'chatSessions', sessionId.value), {
        status: 'ended',
        endReason: 'service_unavailable'
      }).catch(console.error);
    }
    
    // Disable input
    isTyping.value = false;
    newMessage.value = '';
    const input = document.querySelector('input');
    if (input) {
      input.disabled = true;
      input.placeholder = 'Chat is currently unavailable';
    }
  } finally {
    isTyping.value = false;
  }
}

function formatMessage(text: string): string {
  // First handle bullet points (lines starting with --)
  const withBullets = text.split('\n').map(line => {
    if (line.trim().startsWith('--')) {
      return `<div class="flex items-start gap-2">
        <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-anvaya-blue/60 flex-shrink-0"></span>
        <span>${line.trim().substring(2)}</span>
      </div>`;
    }
    return line;
  }).join('\n');
  
  // Then handle URLs
  return withBullets.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" class="underline hover:text-anvaya-blue/80 transition-colors">$1</a>'
  );
}

onMounted(() => {
  loadTimeout = setTimeout(() => {
    isLoaded.value = true;
    scrollToBottom();
  }, 100);
});

onUnmounted(() => {
  if (loadTimeout) {
    clearTimeout(loadTimeout);
  }
  // Mark session as ended when leaving
  if (sessionId.value) {
    updateDoc(doc(db, 'chatSessions', sessionId.value), {
      status: 'ended'
    }).catch(console.error);
  }
});
</script> 