import type { ChatMessage } from '@/types/chat';
import type { Activity } from '@/types/activities';
import { collection } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { getDocs } from 'firebase/firestore';
import { getBaseContext, getDynamicContext } from './chatContext';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function generateGeminiResponse(
  prompt: string, 
  messageHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const BASE_CONTEXT = getBaseContext();
    const { formattedContext } = await getDynamicContext(messageHistory);
    
    // Log the complete context being sent to Gemini
    console.log('Complete Gemini Context:', {
      baseContext: BASE_CONTEXT,
      dynamicContext: formattedContext,
      userPrompt: prompt,
      fullText: `${BASE_CONTEXT}\n\n${formattedContext}\n\nUser message: ${prompt}\n\nRemember to stay within the defined scope and guidelines.`
    });
    
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${BASE_CONTEXT}\n\n${formattedContext}\n\nUser message: ${prompt}\n\nRemember to stay within the defined scope and guidelines.`
          }]
        }],
        // Configuration for response generation:
        // temperature: Controls randomness (0.2 = more focused/deterministic)
        // topP: Nucleus sampling parameter (0.9 = good balance of creativity/coherence) 
        // topK: Limits vocabulary to top K tokens (50 = focused but varied word choice)
        generationConfig: {
          temperature: 0.3,
          topP: 0.6,
          topK: 50
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get response from Gemini');
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
} 