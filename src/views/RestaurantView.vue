<template>
  <div
    class="restaurant p-4"
    :class="[
      'opacity-0 translate-y-5 transition-all duration-600 ease-out',
      isLoaded ? 'opacity-100 translate-y-0' : '',
    ]"
  >
    <PageHeader title="Dining" />

    <div
      v-for="venue in diningVenues"
      :key="venue.id"
      class="mb-8 bg-white rounded-xl overflow-hidden shadow-lg"
    >
      <div class="flex flex-col md:flex-row">
        <div class="md:w-1/2">
          <img
            :src="venue.image"
            :alt="venue.name"
            class="w-full h-64 object-cover"
          />
        </div>
        <div class="md:w-1/2 p-6">
          <img
            v-if="venue.logo"
            :src="logos[venue.name]"
            :alt="`${venue.name} Logo`"
            class="h-12 mb-4"
          />
          <h2 v-else class="text-2xl font-medium text-anvaya-blue mb-2">
            {{ venue.name }}
          </h2>
          <p class="text-gray-600 mb-4">
            {{ venue.description }}
          </p>
          <div class="space-y-2 text-sm text-gray-600">
            <div>
              <i class="mdi mdi-clock-outline mr-1"></i> Open Daily:
              {{ venue.hours }}
            </div>
            <div>
              <i class="mdi mdi-silverware mr-1"></i> {{ venue.cuisine }}
            </div>
            <div v-if="venue.additionalInfo">
              <i class="mdi mdi-information-outline mr-1"></i>
              {{ venue.additionalInfo }}
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <a
              href="#"
              class="flex-1 py-2.5 bg-anvaya-blue/10 text-anvaya-blue rounded-lg hover:bg-anvaya-blue/20 transition-colors font-medium text-center"
            >
              View Menu
            </a>
            <button
              @click="handleReserveClick({ id: venue.id, name: venue.name })"
              class="flex-1 py-2.5 bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90 transition-colors font-medium"
            >
              Reserve Table
            </button>
          </div>
        </div>
      </div>
    </div>

    <TableReservationModal
      v-if="selectedVenue"
      :venue-id="selectedVenue.id"
      :venue-name="selectedVenue.name"
      :is-open="!!selectedVenue"
      @close="selectedVenue = null"
      @success="handleReservationSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import PageHeader from "@/components/PageHeader.vue";
import { diningVenues } from "@/data/dining";
import KunyitLogo from "@/assets/Kunyit Restaurant.svg";
import SandsLogo from "@/assets/Sands Restaurant.svg";
import TableReservationModal from "@/components/TableReservationModal.vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const isLoaded = ref(false);
const selectedVenue = ref<{ id: number; name: string } | null>(null);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});

// Map the logos
const logos: { [key: string]: string } = {
  "Kunyit Restaurant": KunyitLogo,
  "Sands Restaurant": SandsLogo,
};

const handleReserveClick = (venue: { id: number; name: string }) => {
  if (!authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    router.push("/profile");
    return;
  }
  selectedVenue.value = venue;
};

const handleReservationSuccess = () => {
  // Show success message
  alert("Reservation confirmed! Check your email for details.");
  selectedVenue.value = null;
};
</script>
