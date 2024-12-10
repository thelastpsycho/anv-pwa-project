export interface FAQ {
  id: number;
  question: string;
  answer: string;
  isOpen: boolean;
}

export interface FAQCategory {
  id: number;
  title: string;
  faqs: FAQ[];
}

export const faqCategories: FAQCategory[] = [
  {
    id: 1,
    title: "Check-in & Room Information",
    faqs: [
      {
        id: 1,
        question: "What time is check-in and check-out?",
        answer:
          "Check-in time is 2:00 PM and check-out time is 12:00 PM. Early check-in and late check-out can be arranged based on availability.",
        isOpen: false,
      },
      {
        id: 2,
        question: "Is breakfast included in the room rate?",
        answer:
          "Yes, breakfast is included in most of our room rates. Please check your specific booking for details.",
        isOpen: false,
      },
      {
        id: 3,
        question: "What is your cancellation policy?",
        answer:
          "Our standard cancellation policy allows free cancellation up to 3 days before arrival. Different terms may apply for special rates and peak seasons.",
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
        question: "What dining options are available?",
        answer:
          "We have multiple dining venues including Kunyit Restaurant (Indonesian cuisine), Sands Restaurant (International cuisine), and our Pool Bar for refreshments and light meals.",
        isOpen: false,
      },
      {
        id: 5,
        question: "Is there a spa facility?",
        answer:
          "Yes, our Sakanti Spa offers a range of traditional Balinese treatments and modern therapies. Advance booking is recommended.",
        isOpen: false,
      },
      {
        id: 6,
        question: "Do you have a swimming pool?",
        answer:
          "Yes, we have multiple swimming pools including an infinity pool with ocean views and a family-friendly pool area.",
        isOpen: false,
      },
    ],
  },
];
