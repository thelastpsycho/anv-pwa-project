import { defineStore } from "pinia";
import type { TableReservation } from "@/types/dining";

export const useReservationStore = defineStore("reservation", {
  state: () => ({
    reservations: [] as TableReservation[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async createReservation(reservation: TableReservation) {
      this.isLoading = true;
      this.error = null;

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Store in local state
        this.reservations.push({
          ...reservation,
          id: Date.now().toString(),
          status: "confirmed",
          createdAt: new Date().toISOString(),
        });

        console.log("Reservation created:", reservation);
        return true;
      } catch (err) {
        this.error = "Failed to create reservation";
        return false;
      } finally {
        this.isLoading = false;
      }
    },
  },

  getters: {
    getReservations: (state) => state.reservations,
  },
});
