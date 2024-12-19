import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";

const faqData = {
  categories: [
    {
      name: "General",
      faqs: [
        {
          question: "What are the check-in and check-out times?",
          answer: "Check-in time is 2:00 PM and check-out time is 12:00 PM (noon)."
        },
        {
          question: "Is breakfast included in the room rate?",
          answer: "Yes, breakfast is included for all room types at Sands Restaurant from 6:30 AM to 10:30 AM."
        },
        {
          question: "Do you provide airport transfers?",
          answer: "Yes, we provide airport transfers for an additional fee. Please contact our concierge to arrange."
        }
      ]
    },
    {
      name: "Facilities",
      faqs: [
        {
          question: "What are the pool operating hours?",
          answer: "Our pools are open daily from 7:00 AM to 7:00 PM."
        },
        {
          question: "Is there a fitness center?",
          answer: "Yes, our fitness center is open 24/7 for hotel guests."
        },
        {
          question: "Do you have a spa?",
          answer: "Yes, Sakanti Spa offers various treatments from 9:00 AM to 9:00 PM daily."
        }
      ]
    },
    {
      name: "Dining",
      faqs: [
        {
          question: "How many restaurants are there in the resort?",
          answer: "We have 2 main restaurants: Sands Restaurant and Kunyit Restaurant."
        },
        {
          question: "Do I need to make restaurant reservations?",
          answer: "Reservations are recommended, especially for dinner service."
        },
        {
          question: "Do you accommodate dietary restrictions?",
          answer: "Yes, our restaurants can accommodate various dietary requirements with advance notice."
        }
      ]
    },
    {
      name: "Services",
      faqs: [
        {
          question: "Is there room service available?",
          answer: "Yes, 24-hour room service is available."
        },
        {
          question: "Do you provide laundry service?",
          answer: "Yes, laundry and dry-cleaning services are available daily."
        },
        {
          question: "Is there a concierge service?",
          answer: "Yes, our concierge desk is available 24/7 to assist with any requests."
        }
      ]
    }
  ]
};

export async function migrateFAQs() {
  try {
    const faqsRef = collection(db, "faqs");
    
    // Add each category with its FAQs
    const promises = faqData.categories.map(category => 
      addDoc(faqsRef, {
        name: category.name,
        faqs: category.faqs,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    );

    await Promise.all(promises);
    console.log("✅ FAQs migration completed");
    return true;
  } catch (error) {
    console.error("❌ FAQs migration failed:", error);
    throw error;
  }
} 