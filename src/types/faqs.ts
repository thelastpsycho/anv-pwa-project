export interface FAQ {
  id: string;
  question: string;
  answer: string;
  isOpen?: boolean;
  category: string;
}

export interface FAQCategory {
  id: string;
  title: string;
  faqs: FAQ[];
}
