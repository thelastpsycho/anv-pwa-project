import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Activity } from '@/types/activities';
import type { Offer } from '@/types/offers';
import type { TrendingItem } from '@/types/trending';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Function to fetch data from Firebase
async function getContextData() {
  try {
    // Fetch activities
    const activitiesSnap = await getDocs(collection(db, 'activities'));
    const activities = activitiesSnap.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as Activity[];

    // Fetch offers
    const offersSnap = await getDocs(collection(db, 'offers'));
    const offers = offersSnap.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as Offer[];

    // Fetch trending
    const trendingSnap = await getDocs(collection(db, 'trending'));
    const trending = trendingSnap.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as TrendingItem[];

    return { activities, offers, trending };
  } catch (error) {
    console.error('Error fetching context data:', error);
    return { activities: [], offers: [], trending: [] };
  }
}

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
  - if your answer is a list, starts with --

3. Prohibited Topics:
  - Bookings and reservations
  - Prices and rates
  - Staff information
  - Hotel policies not listed above
  - External services or locations
`;

export async function generateGeminiResponse(prompt: string): Promise<string> {
  try {
    // Get dynamic context data
    const contextData = await getContextData();
    
    // Create dynamic context
    const dynamicContext = `
Current Activities:
${contextData.activities.map(a => `- ${a.title}: ${a.description}`).join('\n')}

Current Offers:
${contextData.offers.map(o => `- ${o.title}: ${o.description}`).join('\n')}

Trending Now:
${contextData.trending.map(t => `- ${t.title}: ${t.description}`).join('\n')}
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