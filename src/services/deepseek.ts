import type { ChatMessage } from '@/types/chat';
import { getBaseContext, getDynamicContext } from './chatContext';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function generateDeepSeekResponse(
  prompt: string,
  messageHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const BASE_CONTEXT = getBaseContext();
    const { formattedContext } = await getDynamicContext(messageHistory);

    // Format conversation history for DeepSeek
    const conversationHistory = messageHistory
      .slice(-5)
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

    // Log the complete context being sent to DeepSeek
    console.log('Complete DeepSeek Context:', {
      baseContext: BASE_CONTEXT,
      dynamicContext: formattedContext,
      conversationHistory,
      userPrompt: prompt
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: BASE_CONTEXT },
          { role: 'system', content: formattedContext },
          ...conversationHistory,
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 150,
        top_p: 0.6
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from DeepSeek');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
} 