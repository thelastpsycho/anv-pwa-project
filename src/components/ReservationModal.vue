<script setup lang="ts">
import { ref } from "vue";
import { useReservationStore } from "@/stores/reservation";
import type { TableReservation } from "@/types/dining";

const props = defineProps<{
  venueId: number;
  venueName: string;
}>();

const reservationStore = useReservationStore();

const reservation = ref<TableReservation>({
  venueId: props.venueId,
  date: "",
  time: "",
  guests: 2,
  name: "",
  email: "",
  phone: "",
  specialRequests: "",
});

const isSubmitting = ref(false);
const errorMessage = ref("");

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

async function handleSubmit() {
  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const success = await reservationStore.createReservation(reservation.value);
    if (success) {
      // Show success message
      reservationStore.isReservationModalOpen = false;
    } else {
      errorMessage.value =
        reservationStore.error || "Failed to create reservation";
    }
  } catch (error) {
    errorMessage.value = "An error occurred. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-xl w-full max-w-md">
      <div class="p-6">
        <h2 class="text-xl font-medium text-anvaya-blue mb-6">
          Reserve a Table at {{ venueName }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Date</label>
              <input
                v-model="reservation.date"
                type="date"
                required
                class="w-full px-3 py-2 rounded-lg border"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Time</label>
              <select
                v-model="reservation.time"
                required
                class="w-full px-3 py-2 rounded-lg border"
              >
                <option
                  v-for="time in availableTimes"
                  :key="time"
                  :value="time"
                >
                  {{ time }}
                </option>
              </select>
            </div>
          </div>

          <!-- Other form fields -->

          <div class="flex gap-3 mt-6">
            <button
              type="button"
              class="flex-1 py-2.5 bg-anvaya-blue/10 text-anvaya-blue rounded-lg"
              @click="reservationStore.isReservationModalOpen = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 py-2.5 bg-anvaya-blue text-white rounded-lg"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Submitting..." : "Confirm Reservation" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
