import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Activity } from '@/types/activities';
import type { ChatMessage } from '@/types/chat';

interface MenuItem {
  main_title: string;
  description: string;
  price_1: number;
}

interface MenuResponse {
  status: string;
  data: MenuItem[];
}

// Get current time information
const getCurrentTimeInfo = () => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return { currentDay, currentTime };
};

// Base context for both AIs
export const getBaseContext = () => {
  const { currentDay, currentTime } = getCurrentTimeInfo();
  
  return `You are a helpful hotel information assistant for The Anvaya Beach Resort Bali. Your name is Anv.

Current Time Information:
  - Today is ${currentDay}
  - Current time is ${currentTime}

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
  - if the guest order room service, politely ask them to dial 5 in their room phone and for the menu is available in the room tv

2. Response Rules:
  - Keep responses under 50 words
  - Be direct and specific
  - Use "we" for hotel references
  - Only state facts from provided context
  - No pricing information
  - No speculation
  - if your answer is a list, separate the list with "--", and get the next list in the new line
  - if the question referring to today, please use todays date and time as reference
  - For booking/reservation requests, respond with: "[BOOKING_FORM]" followed by the venue name
  - Example: "[BOOKING_FORM]Kunyit Restaurant" for restaurant bookings

3. Prohibited Topics:
  - Prices and rates
  - Staff information
  - Hotel policies not listed above
  - External services or locations`;
};

// Get dynamic context (activities and FAQs)
export const getDynamicContext = async (messageHistory: ChatMessage[] = []) => {
  // Fetch restaurant menus
  const [kunyitMenu, sandsMenu, beverageMenu] = await Promise.all([
    fetch('https://menu.anvayabali.com/api/v1/kunyit-menus').then(res => res.json()),
    fetch('https://menu.anvayabali.com/api/v1/sands-menus').then(res => res.json()),
    fetch('https://menu.anvayabali.com/api/v1/beverage-menus').then(res => res.json()),
  ]) as [MenuResponse, MenuResponse, MenuResponse];

  // Format menus context
  const menusContext = `
Restaurant Menus:

BEVERAGE MENU:
${beverageMenu.data.map(item => `
Dish: ${item.main_title}
Description: ${item.description}`).join('\n')}

KUNYIT RESTAURANT (Indonesian Cuisine):
${kunyitMenu.data.map(item => `
Dish: ${item.main_title}
Description: ${item.description}`).join('\n')}

SANDS RESTAURANT (International Cuisine):
${sandsMenu.data.map(item => `
Dish: ${item.main_title}
Description: ${item.description}`).join('\n')}`;

  // Get activities data
  const activitiesSnapshot = await getDocs(collection(db, 'activities'));
  const activitiesData = activitiesSnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  })) as Activity[];
  
  // Group activities by day
  const groupedActivities = activitiesData.reduce((acc, activity) => {
    const dayKey = activity.dayOfWeek?.toLowerCase() || 'daily';
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);
  
  // Format activities context
  const activitiesContext = Object.entries(groupedActivities)
    .map(([day, activities]) => `
${day.toUpperCase()}:
${activities.map(activity => `
Activity: ${activity.title}
Time: ${activity.time}
Location: ${activity.location}
Description: ${activity.description}
Duration: ${activity.duration || '1 hour'}`).join('\n')}
`).join('\n\n');

  // Get FAQs
  const faqSnapshot = await getDocs(collection(db, 'faqs'));
  const faqContext = faqSnapshot.docs
    .map(doc => {
      const data = doc.data();
      return `${data.title}:\n${(data.faqs || [])
        .map((faq: { question: string; answer: string }) => 
          `Q: ${faq.question}\nA: ${faq.answer}`
        ).join('\n\n')}`;
    })
    .join('\n\n');

  // Get conversation history
  const conversationContext = messageHistory
    .slice(-10)
    .filter((_, index, array) => array.length - index <= 5)
    .map(msg => `${msg.role === 'user' ? 'Guest' : 'Assistant'}: ${msg.text}`)
    .join('\n\n');

  return {
    activitiesContext,
    faqContext,
    conversationContext,
    menusContext
  };
}; 