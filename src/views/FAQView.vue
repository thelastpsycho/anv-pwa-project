<template>
  <div class="faq p-4">
    <h1 class="text-2xl font-medium text-anvaya-blue mb-6 text-center">
      Frequently Asked Questions
    </h1>

    <div class="space-y-8">
      <div v-for="category in faqList" :key="category.id">
        <h2 class="text-xl font-medium text-anvaya-blue mb-4">
          {{ category.title }}
        </h2>
        <div class="space-y-4">
          <div
            v-for="faq in category.faqs"
            :key="faq.id"
            class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <button
              class="w-full p-4 text-left flex justify-between items-center"
              @click="toggleFAQ(faq)"
            >
              <span class="font-medium text-anvaya-blue">{{
                faq.question
              }}</span>
              <i
                :class="[
                  'mdi',
                  faq.isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down',
                  'text-anvaya-blue',
                ]"
              ></i>
            </button>
            <div v-show="faq.isOpen" class="p-4 pt-0 text-gray-600">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { faqCategories } from "@/data/faqs";

const faqList = ref(faqCategories);

const toggleFAQ = (faq: { isOpen: boolean }) => {
  faq.isOpen = !faq.isOpen;
};
</script>
