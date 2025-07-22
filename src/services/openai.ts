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
    const { formattedContext } = await getDynamicContext(messageHistory);

    // Merge base and dynamic context into a single system prompt
    const systemPrompt = `${BASE_CONTEXT}\n\n${formattedContext}`;

    // Format conversation history for OpenAI
    const conversationHistory = messageHistory
      .slice(-5)
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

    // Simple token estimation: 1 token ≈ 4 characters
    const systemPromptTokens = Math.round(systemPrompt.length / 4);
    const conversationTokens = conversationHistory.reduce((sum, msg) => sum + Math.round(msg.content.length / 4), 0);
    const userPromptTokens = Math.round(prompt.length / 4);
    const totalTokens = systemPromptTokens + conversationTokens + userPromptTokens;

    // Log context only
    console.log('Complete OpenAI Context:', {
      systemPrompt,
      conversationHistory,
      userPrompt: prompt
    });

    // Log token usage separately
    console.log('OpenAI Token Usage:', {
      systemPromptTokens,
      conversationTokens,
      userPromptTokens,
      totalTokens
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
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