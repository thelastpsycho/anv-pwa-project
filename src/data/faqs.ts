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
        id: 9,
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
        question: "What are the dining options available?",
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
        id: 8,
        question: "Do you have a swimming pool?",
        answer:
          "Yes, we have multiple swimming pools including an infinity pool with ocean views and a family-friendly pool area.",
        isOpen: false,
      },
    ],
  },
  {
    id: 3,
    title: "Activities & Recreation",
    faqs: [
      {
        id: 7,
        question: "What activities are available at the resort?",
        answer:
          "We offer various activities including cycling tours, cooking classes, water aerobics, chess, and water volleyball. Many activities are complimentary for hotel guests.",
        isOpen: false,
      },
    ],
  },
  {
    id: 4,
    title: "Amenities & Accessibility",
    faqs: [
      {
        id: 6,
        question: "Is Wi-Fi available at the hotel?",
        answer:
          "Yes, we provide complimentary high-speed Wi-Fi access throughout the hotel, including all rooms and public areas.",
        isOpen: false,
      },
      {
        id: 10,
        question: "Is parking available?",
        answer:
          "Yes, we offer complimentary parking for hotel guests. Valet parking service is also available.",
        isOpen: false,
      },
      {
        id: 11,
        question: "Do you have facilities for disabled guests?",
        answer:
          "Yes, we have specially adapted rooms and facilities for disabled guests. Please contact us in advance to arrange suitable accommodations.",
        isOpen: false,
      },
    ],
  },
  {
    id: 5,
    title: "Transportation & Policies",
    faqs: [
      {
        id: 3,
        question: "Do you provide airport transfer?",
        answer:
          "Yes, we provide airport transfer services. Please contact our concierge team to arrange your pickup or drop-off.",
        isOpen: false,
      },
      {
        id: 12,
        question: "Are pets allowed?",
        answer:
          "We welcome service animals, but unfortunately, we cannot accommodate pets. We can recommend nearby pet boarding facilities if needed.",
        isOpen: false,
      },
    ],
  },
];
