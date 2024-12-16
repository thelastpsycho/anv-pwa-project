export interface FAQ {
  id: string;
  question: string;
  answer: string;
  isOpen?: boolean;
}

export interface FAQCategory {
  id: string;
  title: string;
  faqs: FAQ[];
}
