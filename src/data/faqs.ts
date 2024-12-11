interface FAQ {
  id: number;
  question: string;
  answer: string;
  isOpen: boolean;
}

interface FAQCategory {
  id: number;
  title: string;
  faqs: FAQ[];
}

export const faqCategories: FAQCategory[] = [
  {
    id: 1,
    title: "General Information",
    faqs: [
      {
        id: 1,
        question: "What are the check-in and check-out times?",
        answer:
          "Check-in time is 2:00 PM and check-out time is 12:00 PM. Early check-in and late check-out are subject to availability.",
        isOpen: false,
      },
      {
        id: 2,
        question: "Is breakfast included in the room rate?",
        answer:
          "Yes, daily breakfast is included for all room bookings at our main restaurant.",
        isOpen: false,
      },
      {
        id: 3,
        question: "Do you provide airport transfers?",
        answer:
          "Yes, we offer airport transfers for an additional fee. Please contact our concierge to arrange.",
        isOpen: false,
      },
    ],
  },
  {
    id: 2,
    title: "Facilities & Services",
    faqs: [
      {
        id: 4,
        question: "What are the pool operating hours?",
        answer: "Our pools are open from 7:00 AM to 7:00 PM daily.",
        isOpen: false,
      },
      {
        id: 5,
        question: "Is there a fitness center?",
        answer:
          "Yes, our fitness center is open 24/7 and is complimentary for hotel guests.",
        isOpen: false,
      },
      {
        id: 6,
        question: "Do you offer spa services?",
        answer:
          "Yes, our Sakanti Spa offers a range of treatments from 9:00 AM to 9:00 PM daily.",
        isOpen: false,
      },
    ],
  },
  {
    id: 3,
    title: "Dining",
    faqs: [
      {
        id: 7,
        question: "What dining options are available?",
        answer:
          "We offer multiple dining venues including our main restaurant, beach bar, and poolside dining.",
        isOpen: false,
      },
      {
        id: 8,
        question: "Do you accommodate dietary restrictions?",
        answer:
          "Yes, we cater to various dietary requirements. Please inform our staff in advance.",
        isOpen: false,
      },
    ],
  },
  {
    id: 4,
    title: "Activities & Events",
    faqs: [
      {
        id: 9,
        question: "What activities are available at the resort?",
        answer:
          "We offer yoga classes, cooking classes, cycling tours, and various water sports activities.",
        isOpen: false,
      },
      {
        id: 10,
        question: "Can you arrange local tours?",
        answer:
          "Yes, our concierge can arrange various local tours and experiences.",
        isOpen: false,
      },
    ],
  },
];

export type { FAQ, FAQCategory };
