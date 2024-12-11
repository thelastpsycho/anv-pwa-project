<script setup lang="ts">
import { ref, computed } from "vue";
import { useReservationStore } from "@/stores/reservation";
import { useAuthStore } from "@/stores/auth";
import type { TableReservation, ValidationErrors } from "@/types/dining";

const props = defineProps<{
  venueId: number;
  venueName: string;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const reservationStore = useReservationStore();
const authStore = useAuthStore();

const reservation = ref<Partial<TableReservation>>({
  venueId: props.venueId,
  date: "",
  time: "",
  guests: 2,
  name: authStore.user?.name || "",
  email: "",
  phone: "",
  specialRequests: "",
});

const errors = ref<ValidationErrors>({});
const isSubmitting = ref(false);
const touched = ref<Set<string>>(new Set());

// Validate each field when it changes
const validateField = (field: keyof ValidationErrors) => {
  touched.value.add(field);
  errors.value[field] = "";

  switch (field) {
    case "date":
      const selectedDate = new Date(reservation.value.date || "");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!reservation.value.date) {
        errors.value.date = "Date is required";
      } else if (selectedDate < today) {
        errors.value.date = "Date cannot be in the past";
      }
      break;

    case "time":
      if (!reservation.value.time) {
        errors.value.time = "Time is required";
      } else {
        const [hours] = reservation.value.time.split(":");
        if (parseInt(hours) < 11 || parseInt(hours) >= 22) {
          errors.value.time = "Reservations available between 11:00 - 22:00";
        }
      }
      break;

    case "guests":
      if (!reservation.value.guests) {
        errors.value.guests = "Number of guests is required";
      } else if (reservation.value.guests < 1) {
        errors.value.guests = "Minimum 1 guest";
      } else if (reservation.value.guests > 20) {
        errors.value.guests = "Maximum 20 guests";
      }
      break;

    case "name":
      if (!reservation.value.name?.trim()) {
        errors.value.name = "Name is required";
      }
      break;

    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!reservation.value.email?.trim()) {
        errors.value.email = "Email is required";
      } else if (!emailRegex.test(reservation.value.email)) {
        errors.value.email = "Invalid email format";
      }
      break;

    case "phone":
      const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
      if (!reservation.value.phone?.trim()) {
        errors.value.phone = "Phone number is required";
      } else if (!phoneRegex.test(reservation.value.phone)) {
        errors.value.phone = "Invalid phone number format";
      }
      break;
  }
};

// Validate all fields before submission
const validateAll = () => {
  const fields: (keyof ValidationErrors)[] = [
    "date",
    "time",
    "guests",
    "name",
    "email",
    "phone",
  ];
  fields.forEach((field) => validateField(field));
  return Object.keys(errors.value).length === 0;
};

// Check if a field is valid or untouched
const isFieldValid = (field: keyof ValidationErrors) => {
  return !errors.value[field] || !touched.value.has(field);
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  if (!validateAll()) {
    return;
  }

  isSubmitting.value = true;
  const success = await reservationStore.createReservation(
    reservation.value as TableReservation
  );

  if (success) {
    emit("success");
    emit("close");
  }

  isSubmitting.value = false;
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
  >
    <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
      <div class="p-6">
        <h3
          class="text-xl font-medium text-anvaya-blue dark:text-anvaya-light mb-6"
        >
          Reserve Table at {{ venueName }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <label
              class="text-sm font-medium text-anvaya-blue dark:text-anvaya-light"
            >
              Date
            </label>
            <input
              v-model="reservation.date"
              type="date"
              class="w-full px-4 py-2.5 rounded-lg border border-anvaya-gray/10 dark:border-gray-700 focus:outline-none focus:border-anvaya-blue/30 dark:focus:border-anvaya-light/30 bg-white dark:bg-gray-800 text-anvaya-blue dark:text-anvaya-light"
            />
          </div>

          <div class="space-y-2">
            <label
              class="text-sm font-medium text-anvaya-blue dark:text-anvaya-light"
            >
              Time
            </label>
            <select
              v-model="reservation.time"
              class="w-full px-4 py-2.5 rounded-lg border border-anvaya-gray/10 dark:border-gray-700 focus:outline-none focus:border-anvaya-blue/30 dark:focus:border-anvaya-light/30 bg-white dark:bg-gray-800 text-anvaya-blue dark:text-anvaya-light"
            >
              <option value="">Select time</option>
              <option v-for="time in availableTimes" :key="time" :value="time">
                {{ time }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label
              class="text-sm font-medium text-anvaya-blue dark:text-anvaya-light"
            >
              Number of Guests
            </label>
            <input
              v-model="reservation.guests"
              type="number"
              min="1"
              max="10"
              class="w-full px-4 py-2.5 rounded-lg border border-anvaya-gray/10 dark:border-gray-700 focus:outline-none focus:border-anvaya-blue/30 dark:focus:border-anvaya-light/30 bg-white dark:bg-gray-800 text-anvaya-blue dark:text-anvaya-light"
            />
          </div>

          <div class="space-y-2">
            <label
              class="text-sm font-medium text-anvaya-blue dark:text-anvaya-light"
            >
              Special Requests
            </label>
            <textarea
              v-model="reservation.specialRequests"
              rows="3"
              class="w-full px-4 py-2.5 rounded-lg border border-anvaya-gray/10 dark:border-gray-700 focus:outline-none focus:border-anvaya-blue/30 dark:focus:border-anvaya-light/30 bg-white dark:bg-gray-800 text-anvaya-blue dark:text-anvaya-light"
            ></textarea>
          </div>

          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 py-2.5 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-lg hover:bg-anvaya-blue/20 dark:hover:bg-anvaya-light/20 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 py-2.5 bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90 transition-colors font-medium"
            >
              Reserve
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
