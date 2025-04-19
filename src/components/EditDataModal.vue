<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-hidden"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col"
    >
      <div class="p-4 border-b dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">
            {{ isEdit ? "Edit" : "Add" }} {{ title }}
          </h3>
          <button
            @click="$emit('close')"
            class="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
          >
            <i class="mdi mdi-close"></i>
          </button>
        </div>
      </div>

      <div class="p-4 overflow-y-auto flex-1">
        <form @submit.prevent="handleSubmit" class="space-y-3">
          <div v-for="(field, key) in fields" :key="key">
            <label
              class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
            >
              {{ field.label }}
            </label>

            <input
              v-if="field.type === 'text' || field.type === 'number'"
              v-model="formData[key]"
              :type="field.type"
              class="w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-1 focus:ring-anvaya-blue dark:bg-gray-700 dark:border-gray-600"
            />

            <textarea
              v-else-if="field.type === 'textarea'"
              v-model="formData[key]"
              rows="2"
              class="w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-1 focus:ring-anvaya-blue dark:bg-gray-700 dark:border-gray-600"
            ></textarea>

            <select
              v-else-if="field.type === 'select'"
              v-model="formData[key]"
              class="w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-1 focus:ring-anvaya-blue dark:bg-gray-700 dark:border-gray-600"
            >
              <option v-for="opt in field.options" :key="opt" :value="opt">
                {{ opt }}
              </option>
            </select>

            <textarea
              v-else-if="field.type === 'array'"
              v-model="formData[key]"
              rows="4"
              :placeholder="field.placeholder || 'Enter each item on a new line'"
              class="w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-1 focus:ring-anvaya-blue dark:bg-gray-700 dark:border-gray-600"
              @input="handleArrayInput($event, key)"
            ></textarea>
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="$emit('close')"
              class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-3 py-1.5 text-sm bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90"
              :disabled="loading"
            >
              {{ loading ? "Saving..." : "Save" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { collection } from "firebase/firestore";

const props = defineProps<{
  isOpen: boolean;
  title: string;
  collection: string;
  documentId?: string;
  initialData: Record<string, any>;
  fields: Record<
    string,
    {
      label: string;
      type: "text" | "textarea" | "number" | "select" | "array";
      options?: string[];
      placeholder?: string;
    }
  >;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved", data: Record<string, any>): void;
}>();

const loading = ref(false);
const formData = ref<Record<string, any>>({});
const isEdit = computed(() => !!props.documentId);

async function handleSubmit() {
  loading.value = true;
  try {
    const cleanData = Object.entries(formData.value).reduce(
      (acc, [key, value]) => {
        if (key === "id") return acc;

        if (key === "coordinates" && typeof value === "string") {
          acc[key] = value.split(",").map(Number);
        } else if (value === "true" || value === "false") {
          acc[key] = value === "true";
        } else if (props.fields[key]?.type === "array") {
          // Handle array type fields
          acc[key] = typeof value === "string" 
            ? value.split('\n').filter(item => item.trim() !== '')
            : value;
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    if (isEdit.value) {
      await updateDoc(doc(db, props.collection, props.documentId!), cleanData);
    } else {
      await addDoc(collection(db, props.collection), cleanData);
    }
    emit("saved", cleanData);
    emit("close");
  } catch (error) {
    console.error("Error saving document:", error);
    alert("Failed to save changes");
  } finally {
    loading.value = false;
  }
}

function handleArrayInput(event: Event, key: string) {
  const textarea = event.target as HTMLTextAreaElement;
  // Split by newlines and filter out empty lines
  const array = textarea.value.split('\n').filter(item => item.trim() !== '');
  formData.value[key] = array;
}

onMounted(() => {
  formData.value = Object.entries(props.initialData).reduce(
    (acc, [key, value]) => {
      if (typeof value === "boolean") {
        acc[key] = value.toString();
      } else if (key === "coordinates" && Array.isArray(value)) {
        acc[key] = value.join(",");
      } else if (Array.isArray(value)) {
        // Join array values with newlines for the textarea
        acc[key] = value.join('\n');
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, any>
  );
});
</script>
