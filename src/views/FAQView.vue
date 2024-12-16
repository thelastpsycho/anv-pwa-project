<template>
  <div class="faq px-4 pb-12 my-12">
    <PageHeader title="Information" />

    <!-- Search Bar -->
    <div class="mb-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search information..."
          class="w-full px-4 py-2.5 pl-10 bg-white dark:bg-gray-800 rounded-xl border border-anvaya-gray/10 dark:border-gray-700 focus:outline-none focus:border-anvaya-blue/30 dark:focus:border-anvaya-light/30 text-xs text-anvaya-blue dark:text-anvaya-light"
        />
        <i
          class="mdi mdi-magnify absolute left-3.5 top-2.5 text-anvaya-blue/60 dark:text-anvaya-light/60 text-base"
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
          class="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-anvaya-gray/10 dark:border-gray-700 text-xs text-anvaya-blue/80 dark:text-anvaya-light/80 whitespace-nowrap hover:bg-anvaya-blue/5 dark:hover:bg-anvaya-light/5 transition-colors"
        >
          {{ category.title }}
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        :id="`category-${category.id}`"
        class="scroll-mt-4"
      >
        <div
          class="p-4 flex items-center justify-between cursor-pointer"
          @click="toggleCategory(category.id)"
        >
          <h2 class="text-base text-anvaya-blue dark:text-anvaya-light">
            {{ category.title }}
          </h2>
          <i
            :class="[
              'mdi text-lg text-anvaya-blue dark:text-anvaya-light transition-transform',
              expandedCategories.includes(category.id)
                ? 'mdi-chevron-up'
                : 'mdi-chevron-down',
            ]"
          ></i>
        </div>

        <div
          v-show="expandedCategories.includes(category.id)"
          class="border-t border-anvaya-gray/10 dark:border-gray-700"
        >
          <div
            v-for="faq in category.faqs"
            :key="faq.id"
            class="p-3 space-y-1.5 border-b last:border-b-0 border-anvaya-gray/10 dark:border-gray-700"
            @click="toggleFAQ(faq)"
            style="cursor: pointer"
          >
            <h3
              class="text-sm text-anvaya-blue dark:text-anvaya-light flex justify-between items-center"
            >
              {{ faq.question }}
              <i
                :class="[
                  'mdi text-base transition-transform',
                  faq.isOpen ? 'mdi-minus' : 'mdi-plus',
                ]"
              ></i>
            </h3>
            <p
              v-show="faq.isOpen"
              class="text-xs text-gray-600 dark:text-gray-400 mt-1.5"
            >
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results Message -->
    <div
      v-if="searchQuery && !hasResults"
      class="text-center py-6 text-gray-500 dark:text-gray-400 text-sm"
    >
      No results found for "{{ searchQuery }}"
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import { ref, computed, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { FAQCategory, FAQ } from "@/types/faqs";

const searchQuery = ref("");
const isLoaded = ref(false);
const expandedCategories = ref<string[]>([]);
const faqCategories = ref<FAQCategory[]>([]);

async function loadFAQs() {
  try {
    const querySnapshot = await getDocs(collection(db, "faqs"));
    faqCategories.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as FAQCategory[];
  } catch (error) {
    console.error("Error loading FAQs:", error);
  }
}

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
  loadFAQs();
});

const toggleCategory = (categoryId: string) => {
  const index = expandedCategories.value.indexOf(categoryId);
  if (index === -1) {
    expandedCategories.value.push(categoryId);
  } else {
    expandedCategories.value.splice(index, 1);
  }
};

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

const scrollToCategory = (categoryId: string) => {
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
