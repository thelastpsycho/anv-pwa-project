import type { ChatMessage } from '@/types/chat';
import type { Activity } from '@/types/activities';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { getBaseContext, getDynamicContext } from './chatContext';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

export async function generateOpenAIResponse(
  prompt: string,
  messageHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const BASE_CONTEXT = getBaseContext();
    const { activitiesContext, faqContext, conversationContext } = await getDynamicContext(messageHistory);

    const conversationHistory = messageHistory
      .slice(-5)
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

    const dynamicContext = `
Available Activities:
${activitiesContext}

Frequently Asked Questions:
${faqContext}

Chat History:
${conversationContext}
`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: BASE_CONTEXT },
          { role: 'system', content: `Available Activities:\n${activitiesContext}` },
          { role: 'system', content: `FAQs:\n${faqContext}` },
          ...conversationHistory,
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 150,
        top_p: 0.6
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
} 