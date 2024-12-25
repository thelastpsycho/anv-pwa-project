<script setup lang="ts">
import { ref, computed } from "vue";
import { useReservationStore } from "@/stores/reservation";
import { useAuthStore } from "@/stores/auth";
import { sendWhatsAppMessage } from "@/utils/whatsapp";
import type { TableReservation, ValidationErrors } from "@/types/dining";

const props = defineProps<{
  venueId: string;
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
  name: authStore.user?.displayName || "",
  email: "",
  phone: "",
  specialRequests: "",
});

const errors = ref<ValidationErrors>({});
const isSubmitting = ref(false);
const touched = ref<Set<string>>(new Set());

const availableTimes = [
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

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
  // Check if any field has an error
  return !fields.some((field) => errors.value[field]);
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
    try {
      await sendWhatsAppMessage({
        venueName: props.venueName,
        date: reservation.value.date || "",
        time: reservation.value.time || "",
        guests: reservation.value.guests || 0,
        name: reservation.value.name || "",
        email: reservation.value.email || "",
        phone: reservation.value.phone || "",
        specialRequests: reservation.value.specialRequests,
      });

      setTimeout(() => {
        emit("success");
        emit("close");
      }, 500);
    } catch (error) {
      alert("Failed to open WhatsApp. Please try again.");
      console.error("WhatsApp error:", error);
    }
  }

  isSubmitting.value = false;
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
    <div class="min-h-screen px-4 py-4 flex items-center justify-center">
      <div class="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm shadow-lg">
        <!-- Header -->
        <div class="p-4 pb-3 border-b dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            Table Reservation
          </h3>
        </div>

        <!-- Form -->
        <div class="p-4 space-y-3">
          <div class="grid grid-cols-2 gap-4">
            <!-- Date & Time -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                v-model="reservation.date"
                class="w-full px-2 py-1.5 text-sm rounded-lg border"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <input
                type="time"
                v-model="reservation.time"
                class="w-full px-2 py-1.5 text-sm rounded-lg border"
              />
            </div>
          </div>

          <!-- Guests -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Number of Guests
            </label>
            <input
              type="number"
              v-model="reservation.guests"
              class="w-full px-2 py-1.5 text-sm rounded-lg border"
            />
          </div>

          <!-- Special Requests -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Special Requests (Optional)
            </label>
            <textarea
              v-model="reservation.specialRequests"
              class="w-full px-2 py-1.5 text-sm rounded-lg border h-16 resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 pt-3 border-t dark:border-gray-700 flex justify-end gap-2">
          <button
            @click="$emit('close')"
            class="px-3 py-1.5 text-xs rounded-lg border hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            class="px-3 py-1.5 text-xs bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90"
          >
            Confirm Reservation
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
