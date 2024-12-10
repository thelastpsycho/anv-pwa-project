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
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
      <!-- Header -->
      <div class="bg-anvaya-blue/5 px-6 py-4 border-b border-anvaya-gray/10">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-medium text-anvaya-blue">
              Table Reservation
            </h2>
            <p class="text-sm text-gray-600 mt-1">{{ venueName }}</p>
          </div>
          <button
            @click="emit('close')"
            class="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <i class="mdi mdi-close text-xl text-gray-500"></i>
          </button>
        </div>
      </div>

      <!-- Form -->
      <div class="p-4 sm:p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Date & Time Section -->
          <div class="bg-anvaya-blue/5 p-3 sm:p-4 rounded-xl space-y-4">
            <h3 class="font-medium text-anvaya-blue flex items-center gap-2">
              <i class="mdi mdi-calendar-clock text-xl"></i>
              Schedule
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  v-model="reservation.date"
                  @blur="validateField('date')"
                  required
                  :class="[
                    'w-full h-11 rounded-lg border bg-white/80 focus:outline-none focus:ring-1',
                    isFieldValid('date')
                      ? 'border-gray-300 focus:border-anvaya-blue focus:ring-anvaya-blue'
                      : 'border-red-300 focus:border-red-500 focus:ring-red-500',
                  ]"
                />
                <p
                  v-if="!isFieldValid('date')"
                  class="mt-1 text-xs text-red-500"
                >
                  {{ errors.date }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  v-model="reservation.time"
                  @blur="validateField('time')"
                  required
                  :class="[
                    'w-full h-11 rounded-lg border bg-white/80 focus:outline-none focus:ring-1',
                    isFieldValid('time')
                      ? 'border-gray-300 focus:border-anvaya-blue focus:ring-anvaya-blue'
                      : 'border-red-300 focus:border-red-500 focus:ring-red-500',
                  ]"
                />
                <p
                  v-if="!isFieldValid('time')"
                  class="mt-1 text-xs text-red-500"
                >
                  {{ errors.time }}
                </p>
              </div>
            </div>
          </div>

          <!-- Guest Details Section -->
          <div class="bg-anvaya-blue/5 p-3 sm:p-4 rounded-xl space-y-4">
            <h3 class="font-medium text-anvaya-blue flex items-center gap-2">
              <i class="mdi mdi-account-group text-xl"></i>
              Guest Details
            </h3>
            <div class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">
                    Number of Guests
                  </label>
                  <div class="relative">
                    <i
                      class="mdi mdi-account-multiple absolute left-3 top-3 text-anvaya-blue/60"
                    ></i>
                    <input
                      type="number"
                      v-model="reservation.guests"
                      @blur="validateField('guests')"
                      min="1"
                      max="20"
                      required
                      :class="[
                        'w-full h-11 rounded-lg border bg-white/80 pl-10 focus:outline-none focus:ring-1',
                        isFieldValid('guests')
                          ? 'border-gray-300 focus:border-anvaya-blue focus:ring-anvaya-blue'
                          : 'border-red-300 focus:border-red-500 focus:ring-red-500',
                      ]"
                    />
                  </div>
                  <p
                    v-if="!isFieldValid('guests')"
                    class="mt-1 text-xs text-red-500"
                  >
                    {{ errors.guests }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  <div class="relative">
                    <i
                      class="mdi mdi-account absolute left-3 top-3 text-anvaya-blue/60"
                    ></i>
                    <input
                      type="text"
                      v-model="reservation.name"
                      @blur="validateField('name')"
                      required
                      :class="[
                        'w-full h-11 rounded-lg border bg-white/80 pl-10 focus:outline-none focus:ring-1',
                        isFieldValid('name')
                          ? 'border-gray-300 focus:border-anvaya-blue focus:ring-anvaya-blue'
                          : 'border-red-300 focus:border-red-500 focus:ring-red-500',
                      ]"
                    />
                  </div>
                  <p
                    v-if="!isFieldValid('name')"
                    class="mt-1 text-xs text-red-500"
                  >
                    {{ errors.name }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <div class="relative">
                    <i
                      class="mdi mdi-email absolute left-3 top-3 text-anvaya-blue/60"
                    ></i>
                    <input
                      type="email"
                      v-model="reservation.email"
                      @blur="validateField('email')"
                      required
                      placeholder="your@email.com"
                      :class="[
                        'w-full h-11 rounded-lg border bg-white/80 pl-10 focus:outline-none focus:ring-1',
                        isFieldValid('email')
                          ? 'border-gray-300 focus:border-anvaya-blue focus:ring-anvaya-blue'
                          : 'border-red-300 focus:border-red-500 focus:ring-red-500',
                      ]"
                    />
                  </div>
                  <p
                    v-if="!isFieldValid('email')"
                    class="mt-1 text-xs text-red-500"
                  >
                    {{ errors.email }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">
                    Phone
                  </label>
                  <div class="relative">
                    <i
                      class="mdi mdi-phone absolute left-3 top-3 text-anvaya-blue/60"
                    ></i>
                    <input
                      type="tel"
                      v-model="reservation.phone"
                      @blur="validateField('phone')"
                      required
                      placeholder="+62812345678"
                      :class="[
                        'w-full h-11 rounded-lg border bg-white/80 pl-10 focus:outline-none focus:ring-1',
                        isFieldValid('phone')
                          ? 'border-gray-300 focus:border-anvaya-blue focus:ring-anvaya-blue'
                          : 'border-red-300 focus:border-red-500 focus:ring-red-500',
                      ]"
                    />
                  </div>
                  <p
                    v-if="!isFieldValid('phone')"
                    class="mt-1 text-xs text-red-500"
                  >
                    {{ errors.phone }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Special Requests -->
          <div class="bg-anvaya-blue/5 p-3 sm:p-4 rounded-xl space-y-4">
            <h3 class="font-medium text-anvaya-blue flex items-center gap-2">
              <i class="mdi mdi-note-text text-xl"></i>
              Additional Requests
            </h3>
            <textarea
              v-model="reservation.specialRequests"
              rows="3"
              placeholder="Any special requests or preferences..."
              class="w-full rounded-lg border-gray-300 bg-white/80 focus:border-anvaya-blue focus:ring-anvaya-blue focus:outline-none focus:ring-1 p-3"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full h-12 bg-anvaya-blue text-white rounded-xl hover:bg-anvaya-blue/90 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <i class="mdi mdi-check-circle"></i>
            {{ isSubmitting ? "Processing..." : "Confirm Reservation" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
