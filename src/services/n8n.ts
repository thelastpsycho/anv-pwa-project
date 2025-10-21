import { useAuthStore } from '@/stores/auth';
import type { ChatMessage } from '@/types/chat';

interface N8NWebhookPayload {
  sessionId: string;
  message: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    text: string;
  }>;
  userInfo: {
    roomNumber?: string | null;
    timestamp: number;
  };
}

interface N8NWebhookResponse {
  response?: string;
  output?: string;
  error?: string;
}

export async function generateN8nResponse(
  message: string,
  messages: ChatMessage[],
  sessionId: string
): Promise<string> {
  const authStore = useAuthStore();

  const payload: N8NWebhookPayload = {
    sessionId,
    message,
    conversationHistory: messages.slice(-10).map(msg => ({
      role: msg.role,
      text: msg.text
    })),
    userInfo: {
      roomNumber: authStore.profileUser?.roomNumber || null,
      timestamp: Date.now()
    }
  };

  try {
    const response = await fetch('https://workflow.anvayabali.com/webhook/25941c13-543f-4b38-bd28-cf6e9289368d', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: N8NWebhookResponse = await response.json();

    console.log('n8n webhook response:', data);

    if (data.error) {
      throw new Error(data.error);
    }

    // Handle both 'response' and 'output' field formats
    const result = data.response || data.output;

    if (!result) {
      console.error('n8n webhook returned empty response:', data);
      throw new Error('Empty response from n8n webhook');
    }

    return result;
  } catch (error) {
    console.error('n8n webhook error:', error);
    throw error;
  }
}