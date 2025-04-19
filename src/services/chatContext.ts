import { collection, getDocs, QuerySnapshot } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Activity } from '@/types/activities';
import type { ChatMessage } from '@/types/chat';
import type { Offer } from '@/types/offers';

interface MenuItem {
  main_title: string;
  description: string;
  price_1: number;
}

interface MenuResponse {
  status: string;
  data: MenuItem[];
}

interface FAQData {
  title: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
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
  
  return `You are a helpful hotel information assistant for The Anvaya Beach Resort Bali. Your name is Anya.

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
  - if the gues t order room service, politely ask them to dial 5 in their room phone and for the menu is available in the room tv
  - if the guest asking about food or restaurant, you must tell them about our restaurant:
    -- Kunyit Restaurant (Indonesian Cuisine)
    -- Sands Restaurant (International Cuisine, by the beach with beach view)
  - if the guest asking about restaurant operating hours:
    -- Kunyit Restaurant: 6:30 AM - 10:30 PM
    -- Sands Restaurant: 11:00 AM - 11:00 PM
  - if the guest asking about restaurant reservation, politely ask them to contact guest service for assistance
  - if the guest asking about guest service, politely tell them to dial "0" from their room phone
  - if you cannot answer the question or if the question is outside the provided topics, politely respond: "I apologize, but for this inquiry, please contact our Guest Service by dialing 0 from your room phone for assistance."

2. Response Rules:
  - Keep responses under 50 words
  - Be direct and specific
  - Use "we" for hotel references
  - Only state facts from provided context
  - No pricing information
  - No speculation
  - if your answer is a list, separate the list with "--", and get the next list in the new line
  - if the question referring to today, please use todays date and time as reference
  
3. Prohibited Topics:
  - Prices and rates
  - Staff information
  - Hotel policies not listed above
  - External services or locations`;
};

// Get dynamic context (activities and FAQs)
export const getDynamicContext = async (messageHistory: ChatMessage[] = []) => {
  try {
    // Fetch all dynamic data in parallel
    const [
      kunyitMenu,
      sandsMenu,
      beverageMenu,
      activitiesSnapshot,
      offersSnapshot,
      faqSnapshot
    ] = await Promise.all([
      fetch('https://menu.anvayabali.com/api/v1/kunyit-menus').then(res => res.json()),
      fetch('https://menu.anvayabali.com/api/v1/sands-menus').then(res => res.json()),
      fetch('https://menu.anvayabali.com/api/v1/beverage-menus').then(res => res.json()),
      getDocs(collection(db, 'activities')),
      getDocs(collection(db, 'offers')),
      getDocs(collection(db, 'faqs'))
    ]);

    // Format all contexts
    const contexts = {
      // Core contexts (used by AI engines)
      activitiesContext: formatActivitiesContext(activitiesSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Activity[]),
      faqContext: formatFAQContext(faqSnapshot),
      conversationContext: formatConversationContext(messageHistory),
      menusContext: formatMenusContext(kunyitMenu, sandsMenu, beverageMenu),
      offersContext: formatOffersContext(offersSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Offer[]),

      // Additional contexts can be added here without modifying AI engines
      // Example: roomContext, spaContext, etc.
    };

    // Format the complete dynamic context string
    const formattedContext = `
Available Activities:
${contexts.activitiesContext}

Restaurant Menus:
${contexts.menusContext}

Current Offers:
${contexts.offersContext}

Frequently Asked Questions:
${contexts.faqContext}

Chat History:
${contexts.conversationContext}
`;

    return {
      // Return both the individual contexts and the formatted string
      ...contexts,
      formattedContext
    };
  } catch (error) {
    console.error('Error fetching dynamic context:', error);
    return {
      activitiesContext: '',
      faqContext: '',
      conversationContext: '',
      menusContext: '',
      offersContext: '',
      formattedContext: ''
    };
  }
};

// Helper functions to format different contexts
const formatMenusContext = (kunyitMenu: MenuResponse, sandsMenu: MenuResponse, beverageMenu: MenuResponse) => `
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

const formatActivitiesContext = (activitiesData: Activity[]) => {
  const groupedActivities = activitiesData.reduce((acc, activity) => {
    const dayKey = activity.dayOfWeek?.toLowerCase() || 'daily';
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return Object.entries(groupedActivities)
    .map(([day, activities]) => `
${day.toUpperCase()}:
${activities.map(activity => `
Activity: ${activity.title}
Time: ${activity.time}
Location: ${activity.location}
Description: ${activity.description}
Duration: ${activity.duration || '1 hour'}`).join('\n')}
`).join('\n\n');
};

const formatOffersContext = (offersData: Offer[]) => {
  const groupedOffers = offersData.reduce((acc, offer) => {
    const categoryKey = offer.category?.toLowerCase() || 'other';
    if (!acc[categoryKey]) acc[categoryKey] = [];
    acc[categoryKey].push(offer);
    return acc;
  }, {} as Record<string, Offer[]>);

  return Object.entries(groupedOffers)
    .map(([category, offers]) => `
${category.toUpperCase()} OFFERS:
${offers.map(offer => `
Offer: ${offer.title}
Description: ${offer.description}
Valid Until: ${offer.date}
${offer.price ? `Price Range: ${offer.price}` : ''}
${offer.details ? `\nDetails:\n${Array.isArray(offer.details) ? offer.details.join('\n') : offer.details}` : ''}`).join('\n')}`).join('\n\n');
};

const formatFAQContext = (faqSnapshot: QuerySnapshot<DocumentData>) => {
  return faqSnapshot.docs
    .map(doc => {
      const data = doc.data() as FAQData;
      return `${data.title}:\n${(data.faqs || [])
        .map((faq: { question: string; answer: string }) => 
          `Q: ${faq.question}\nA: ${faq.answer}`
        ).join('\n\n')}`;
    })
    .join('\n\n');
};

const formatConversationContext = (messageHistory: ChatMessage[]) => {
  return messageHistory
    .slice(-10)
    .filter((_, index, array) => array.length - index <= 5)
    .map(msg => `${msg.role === 'user' ? 'Guest' : 'Assistant'}: ${msg.text}`)
    .join('\n\n');
}; 