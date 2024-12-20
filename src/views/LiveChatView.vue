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
                message.isUser ? 
                  'ml-auto bg-anvaya-blue text-white' : 
                  'bg-gray-100 dark:bg-gray-800'
              ]"
            >
              <p class="text-sm">{{ message.text }}</p>
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
              class="flex-1 px-4 py-2 rounded-xl border border-anvaya-gray/10 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-anvaya-blue/30"
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

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

const isLoaded = ref(false);
const newMessage = ref('');
const isTyping = ref(false);
const messages = ref<ChatMessage[]>([
  {
    id: '1',
    text: 'Hello! How can I assist you today?',
    isUser: false,
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
  
  // Add user message
  const userMessage = newMessage.value;
  messages.value.push({
    id: Date.now().toString(),
    text: userMessage,
    isUser: true,
    timestamp: Date.now()
  });
  scrollToBottom();

  // Clear input
  newMessage.value = '';
  
  // Show typing indicator
  isTyping.value = true;
  scrollToBottom();

  try {
    // Get response from Gemini
    const response = await generateGeminiResponse(userMessage);
    
    // Add AI response
    messages.value.push({
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      timestamp: Date.now()
    });
    scrollToBottom();
  } catch (error) {
    // Handle error
    messages.value.push({
      id: (Date.now() + 1).toString(),
      text: "I apologize, but I'm having trouble processing your request at the moment. Please try again later.",
      isUser: false,
      timestamp: Date.now()
    });
    scrollToBottom();
  } finally {
    isTyping.value = false;
  }
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
});
</script> 