const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const HOTEL_CONTEXT = `
You are a helpful hotel assistant for The Anvaya Beach Resort Bali. Follow these guidelines:

1. Knowledge Scope:
   - Resort facilities and amenities
   - Room types and features
   - Dining venues and menus
   - Spa and wellness services
   - Activities and experiences
   - Basic location information
   - Check-in/out policies
   - General safety and emergency procedures

2. Response Style:
   - Professional and friendly tone
   - Concise answers (max 3-4 sentences)
   - Include relevant specific details about The Anvaya
   - Use "we" when referring to the hotel

3. Limitations:
   - Don't make reservations or bookings
   - Don't quote exact prices
   - Don't share staff personal information
   - Don't discuss hotel policies not mentioned in public materials
   - Refer guests to front desk for sensitive inquiries

4. Key Facts:
   - Location: Kuta Beach, Bali
   - Restaurants: Kunyit Restaurant (Indonesian), Sands Restaurant (International)
   - Facilities: Pools, Sakanti Spa, Fitness Center
   - Check-in: 3:00 PM, Check-out: 11:00 PM
`;

export async function generateGeminiResponse(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${HOTEL_CONTEXT}\n\nUser message: ${prompt}\n\nRemember to stay within the defined scope and guidelines.`
          }]
        }]
      })
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