<template>
  <div
    class="faq p-4"
    :class="[
      'opacity-0 translate-y-5 transition-all duration-600 ease-out',
      isLoaded ? 'opacity-100 translate-y-0' : '',
    ]"
  >
    <PageHeader title="Information" />

    <!-- Search Bar -->
    <div class="mb-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search information..."
          class="w-full px-4 py-2.5 pl-10 bg-white rounded-xl border border-anvaya-gray/10 focus:outline-none focus:border-anvaya-blue/30 text-xs"
        />
        <i
          class="mdi mdi-magnify absolute left-3.5 top-2.5 text-anvaya-blue/60 text-base"
        ></i>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="mb-6">
      <div class="flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="category in faqCategories"
          :key="category.id"
          @click="scrollToCategory(category.id)"
          class="px-3 py-1.5 bg-white rounded-lg border border-anvaya-gray/10 text-xs text-anvaya-blue/80 whitespace-nowrap hover:bg-anvaya-blue/5 transition-colors"
        >
          {{ category.title }}
        </button>
      </div>
    </div>

    <!-- FAQ Categories -->
    <div class="space-y-6">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        :id="`category-${category.id}`"
        class="scroll-mt-4"
      >
        <h2
          class="text-base font-medium text-anvaya-blue mb-3 flex items-center gap-2"
        >
          <i class="mdi mdi-information-outline text-lg"></i>
          {{ category.title }}
        </h2>
        <div class="space-y-2">
          <div
            v-for="faq in category.faqs"
            :key="faq.id"
            class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <button
              class="w-full p-3 text-left flex justify-between items-start gap-4"
              @click="toggleFAQ(faq)"
            >
              <span class="text-sm font-medium text-anvaya-blue">{{
                faq.question
              }}</span>
              <i
                :class="[
                  'mdi text-lg flex-shrink-0 mt-0.5 transition-transform duration-300',
                  faq.isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down',
                  'text-anvaya-blue/60',
                ]"
              ></i>
            </button>
            <div
              v-show="faq.isOpen"
              class="px-3 pb-3 text-gray-600 border-t border-anvaya-gray/10 text-xs"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results Message -->
    <div
      v-if="searchQuery && !hasResults"
      class="text-center py-6 text-gray-500 text-sm"
    >
      No results found for "{{ searchQuery }}"
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import { ref, computed, onMounted } from "vue";
import { faqCategories as faqData } from "@/data/faqs";
import type { FAQ } from "@/data/faqs";

const faqCategories = ref(faqData);
const searchQuery = ref("");
const isLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});

const filteredCategories = computed(() => {
  if (!searchQuery.value) return faqCategories.value;

  const query = searchQuery.value.toLowerCase();
  return faqCategories.value
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      ),
    }))
    .filter((category) => category.faqs.length > 0);
});

const hasResults = computed(() => {
  return filteredCategories.value.some((category) => category.faqs.length > 0);
});

const toggleFAQ = (faq: FAQ) => {
  faq.isOpen = !faq.isOpen;
};

const scrollToCategory = (categoryId: number) => {
  const element = document.getElementById(`category-${categoryId}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<style scoped>
.scroll-mt-4 {
  scroll-margin-top: 1rem;
}
</style>
