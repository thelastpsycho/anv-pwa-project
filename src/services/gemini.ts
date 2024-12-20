import type { ChatMessage } from '@/types/chat';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';


// Base context
const BASE_CONTEXT = `
You are a helpful hotel information assistant for The Anvaya Beach Resort Bali. Your name is Anv. You must:

1. ONLY answer questions based on these specific topics:
  - Resort facilities: pools, spa, fitness center
  - Room types
  - Dining venues: Kunyit Restaurant, Sands Restaurant
  - Sands Restaurant is International restaurant, by the beach with beach view
  - Scheduled activities and current offers
  - Check-in (3:00 PM) and check-out (11:00 PM) times
  - Basic location: Kuta Beach, Bali
  - if the guest asking for late check out or early check in, you must politely ask them to contact guest service because it subject to availability
  - if the guest asking for room upgrade, you must politely ask them to contact guest service because it subject to availability
  - if the guest asking for room service, you must politely ask them to contact guest service because it subject to availability
  - Laundry Service is available. contact guest service for more information.

2. Response Rules:
  - Keep responses under 50 words
  - Be direct and specific
  - Use bullet points for lists
  - Use "we" for hotel references
  - Only state facts from provided context
  - No pricing information
  - No speculation
  - if your answer is a list, starts separate the list with "--"

3. Prohibited Topics:
  - Bookings and reservations
  - Prices and rates
  - Staff information
  - Hotel policies not listed above
  - External services or locations
`;

export async function generateGeminiResponse(
  prompt: string, 
  messageHistory: ChatMessage[] = []
): Promise<string> {
  try {
    // Get last 5 messages for context
    const conversationContext = messageHistory
      .slice(-10)
      .filter((_, index, array) => array.length - index <= 5)
      .map(msg => `${msg.role === 'user' ? 'Guest' : 'Assistant'}: ${msg.text}`)
      .join('\n\n');
    
    // Create dynamic context
    const dynamicContext = `
Chat History:
${conversationContext}
`;

    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${BASE_CONTEXT}\n\n${dynamicContext}\n\nUser message: ${prompt}\n\nRemember to stay within the defined scope and guidelines.`
          }]
        }],
        // Configuration for response generation:
        // temperature: Controls randomness (0.2 = more focused/deterministic)
        // topP: Nucleus sampling parameter (0.9 = good balance of creativity/coherence) 
        // topK: Limits vocabulary to top K tokens (50 = focused but varied word choice)
        generationConfig: {
          temperature: 0.2,
          topP: 0.9,
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