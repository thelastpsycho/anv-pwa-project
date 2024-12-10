<script setup lang="ts">
import { ref } from "vue";

const faqs = [
  {
    category: "Check-in & Check-out",
    items: [
      {
        question: "What are the check-in/check-out times?",
        answer:
          "Check-in is at 2:00 PM and check-out is at 12:00 PM. Early check-in and late check-out are subject to availability.",
      },
      {
        question: "Can I request early check-in?",
        answer:
          "Early check-in can be arranged based on availability. Please contact our front desk in advance.",
      },
    ],
  },
  {
    category: "Dining",
    items: [
      {
        question: "Is breakfast included?",
        answer:
          "Yes, breakfast is included with your stay and is served at the Main Restaurant from 6:00 AM to 10:30 AM.",
      },
      {
        question: "Do you accommodate dietary restrictions?",
        answer:
          "Yes, we offer vegetarian, vegan, and gluten-free options. Please inform us of any dietary requirements in advance.",
      },
    ],
  },
  {
    category: "Facilities & Services",
    items: [
      {
        question: "Is there WiFi available?",
        answer:
          "Yes, complimentary high-speed WiFi is available throughout the resort.",
      },
      {
        question: "Do you have a spa?",
        answer:
          "Yes, our Sakanti Spa offers a range of treatments. Advance booking is recommended.",
      },
      {
        question: "Is there a fitness center?",
        answer:
          "Yes, our fitness center is open 24/7 and features modern equipment.",
      },
    ],
  },
  {
    category: "Transportation",
    items: [
      {
        question: "Do you provide airport transfers?",
        answer:
          "Yes, we offer airport pickup and drop-off services. Please arrange this with our concierge team.",
      },
      {
        question: "Is parking available?",
        answer: "Yes, we offer free valet parking for all guests.",
      },
    ],
  },
];

const openCategory = ref<number | null>(0);
const openItems = ref<Set<string>>(new Set());

const toggleCategory = (index: number) => {
  openCategory.value = openCategory.value === index ? null : index;
};

const toggleItem = (categoryIndex: number, itemIndex: number) => {
  const key = `${categoryIndex}-${itemIndex}`;
  if (openItems.value.has(key)) {
    openItems.value.delete(key);
  } else {
    openItems.value.add(key);
  }
};

const isItemOpen = (categoryIndex: number, itemIndex: number) => {
  return openItems.value.has(`${categoryIndex}-${itemIndex}`);
};
</script>

<template>
  <div class="bg-white min-h-screen">
    <div class="container max-w-3xl mx-auto px-4 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-medium text-anvaya-blue mb-3">
          Guest Information
        </h1>
        <p class="text-gray-600 text-lg">
          Everything you need to know about your stay at The Anvaya
        </p>
      </div>

      <!-- FAQ Categories -->
      <div class="space-y-4">
        <div
          v-for="(category, index) in faqs"
          :key="index"
          class="bg-white rounded-xl overflow-hidden shadow-sm border border-anvaya-gray/20"
        >
          <!-- Category Header -->
          <button
            class="w-full px-6 py-4 text-left transition-colors hover:bg-anvaya-gray/5"
            :class="{ 'bg-anvaya-gray/5': openCategory === index }"
            @click="toggleCategory(index)"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium text-anvaya-blue">
                {{ category.category }}
              </h2>
              <i
                :class="[
                  'mdi mdi-chevron-down text-xl text-anvaya-blue/60 transition-transform duration-300',
                  openCategory === index ? 'rotate-180' : '',
                ]"
              ></i>
            </div>
          </button>

          <!-- Questions -->
          <div
            v-show="openCategory === index"
            class="divide-y divide-anvaya-gray/10"
          >
            <div
              v-for="(item, itemIndex) in category.items"
              :key="itemIndex"
              class="border-t border-anvaya-gray/10"
            >
              <button
                class="w-full flex items-center justify-between px-6 py-4 hover:bg-anvaya-gray/5 transition-colors"
                @click="toggleItem(index, itemIndex)"
              >
                <span
                  class="font-medium text-left"
                  :class="
                    isItemOpen(index, itemIndex)
                      ? 'text-anvaya-blue'
                      : 'text-gray-700'
                  "
                >
                  {{ item.question }}
                </span>
                <i
                  :class="[
                    'mdi mdi-chevron-down text-anvaya-blue/60 transition-transform duration-300',
                    isItemOpen(index, itemIndex) ? 'rotate-180' : '',
                  ]"
                ></i>
              </button>
              <div
                v-show="isItemOpen(index, itemIndex)"
                class="px-6 py-4 bg-anvaya-gray/5"
              >
                <p class="text-gray-600 leading-relaxed">{{ item.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="mt-12 text-center">
        <p class="text-gray-600 text-lg">
          Still have questions?
          <button class="text-anvaya-blue font-medium hover:underline ml-1">
            Contact Us
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
