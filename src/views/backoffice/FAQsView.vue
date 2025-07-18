<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">Frequently Asked Questions</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="search"
            v-model="searchQuery"
            placeholder="Search FAQ..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-colors text-sm"
          />
        </div>
        <button
          @click="handleAdd"
          class="inline-flex items-center gap-2 px-4 py-2 bg-anvaya-blue text-white text-sm font-medium rounded-lg hover:bg-anvaya-blue/90 transition-all duration-200 shadow-sm"
        >
          <i class="mdi mdi-plus text-lg"></i>
          <span>Add Category</span>
        </button>
      </div>
    </div>

    <div class="space-y-4">
        <div
        v-for="category in filteredFaqCategories"
        :key="category.id"
        class="bg-white rounded-xl shadow-md"
      >
        <div class="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-semibold text-lg text-gray-800">{{ category.title }}</h3>
          <div class="flex gap-2">
            <button
              @click="() => handleAddFAQ(category.id)"
              class="p-2 bg-gray-100 text-anvaya-blue rounded-lg hover:bg-gray-200 transition-colors"
            >
              <i class="mdi mdi-plus"></i>
            </button>
            <button
              @click="editCategory(category)"
              class="p-2 bg-gray-100 text-anvaya-blue rounded-lg hover:bg-gray-200 transition-colors"
            >
              <i class="mdi mdi-pencil"></i>
            </button>
            <button
              @click="deleteCategory(category.id)"
              class="p-2 bg-gray-100 text-red-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <i class="mdi mdi-delete"></i>
            </button>
          </div>
        </div>

        <div class="divide-y divide-gray-100">
          <div
            v-for="faq in category.faqs"
            :key="faq.id"
            class="p-4 group"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium text-gray-800">{{ faq.question }}</p>
                <p class="text-gray-600 text-sm mt-1">{{ faq.answer }}</p>
              </div>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  @click="editFAQ(category.id, faq)"
                  class="p-1.5 bg-gray-100 text-anvaya-blue rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <i class="mdi mdi-pencil text-sm"></i>
                </button>
                <button
                  @click="deleteFAQ(category.id, faq.id)"
                  class="p-1.5 bg-gray-100 text-red-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <i class="mdi mdi-delete text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditDataModal
      v-if="editingCategory || showAddModal"
      :is-open="!!editingCategory || showAddModal"
      :title="editingCategory ? 'Edit Category' : 'Add Category'"
      collection="faqs"
      :document-id="editingCategory?.id"
      :initial-data="
        editingCategory || {
          title: '',
          faqs: [],
        }
      "
      :fields="{
        title: { label: 'Category Title', type: 'text' },
      }"
      @close="closeModal"
      @saved="loadFAQs"
    />

    <EditDataModal
      v-if="editingFAQ"
      :is-open="!!editingFAQ"
      title="FAQ"
      collection="faqs"
      :document-id="currentCategoryId"
      :initial-data="{
        question: editingFAQ?.question || '',
        answer: editingFAQ?.answer || '',
      }"
      :fields="{
        question: { label: 'Question', type: 'text' },
        answer: { label: 'Answer', type: 'textarea' },
      }"
      @close="closeEditFAQ"
      @saved="(data) => handleFAQSaved(data)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { FAQCategory, FAQ } from "@/types/faqs";
import EditDataModal from "@/components/EditDataModal.vue";

const faqCategories = ref<FAQCategory[]>([]);
const showAddModal = ref(false);
const editingCategory = ref<FAQCategory | null>(null);
const editingFAQ = ref<FAQ | null>(null);
const currentCategoryId = ref<string>("");
const searchQuery = ref("");

const filteredFaqCategories = computed(() => {
  if (!searchQuery.value) {
    return faqCategories.value;
  }
  const searchLower = searchQuery.value.toLowerCase();
  return faqCategories.value
    .map((category) => {
      const filteredFaqs = category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchLower) ||
          faq.answer.toLowerCase().includes(searchLower)
      );
      return { ...category, faqs: filteredFaqs };
    })
    .filter((category) => category.faqs.length > 0 || category.title.toLowerCase().includes(searchLower));
});

async function loadFAQs() {
  try {
    const querySnapshot = await getDocs(collection(db, "faqs"));
    faqCategories.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      faqs: doc.data().faqs || [],
    })) as unknown as FAQCategory[];
  } catch (error) {
    console.error("Error loading FAQs:", error);
  }
}

async function deleteCategory(id: string) {
  if (
    confirm("Are you sure you want to delete this category and all its FAQs?")
  ) {
    try {
      await deleteDoc(doc(db, "faqs", id));
      await loadFAQs();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }
}

async function deleteFAQ(categoryId: string, faqId: string) {
  if (confirm("Are you sure you want to delete this FAQ?")) {
    try {
      const category = faqCategories.value.find((c) => c.id === categoryId);
      if (!category) return;

      const updatedFaqs = category.faqs.filter((f) => f.id !== faqId);
      await updateDoc(doc(db, "faqs", categoryId), {
        faqs: updatedFaqs,
      });
      await loadFAQs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  }
}

function editCategory(category: FAQCategory) {
  showAddModal.value = false;
  editingCategory.value = category;
}

function editFAQ(categoryId: string, faq: FAQ) {
  currentCategoryId.value = categoryId;
  editingFAQ.value = faq;
}

function handleAdd() {
  editingCategory.value = null;
  showAddModal.value = true;
}

function handleAddFAQ(categoryId: string) {
  currentCategoryId.value = categoryId;
  editingFAQ.value = {
    id: Date.now().toString(),
    question: "",
    answer: "",
    category: categoryId
  };
}

async function handleFAQSaved(formData: Record<string, any>) {
  try {
    const category = faqCategories.value.find(
      (c) => c.id === currentCategoryId.value
    );
    if (!category) return;

    const faqs = [...category.faqs];
    const newFaq = {
      id: editingFAQ.value?.id || Date.now().toString(),
      question: formData.question,
      answer: formData.answer,
      category: currentCategoryId.value
    };

    const faqIndex = faqs.findIndex((f) => f.id === newFaq.id);

    if (faqIndex >= 0) {
      faqs[faqIndex] = newFaq;
    } else {
      faqs.push(newFaq);
    }

    await updateDoc(doc(db, "faqs", currentCategoryId.value), { faqs });
    await loadFAQs();
    closeEditFAQ();
  } catch (error) {
    console.error("Error saving FAQ:", error);
  }
}

function closeModal() {
  showAddModal.value = false;
  editingCategory.value = null;
}

function closeEditFAQ() {
  editingFAQ.value = null;
  currentCategoryId.value = "";
}

onMounted(() => {
  loadFAQs();
});
</script>
