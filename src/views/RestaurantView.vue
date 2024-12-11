<template>
  <div class="restaurant px-4 pb-4">
    <PageHeader title="Dining" />

    <!-- FB Promotions Section -->
    <div class="mb-8">
      <h2
        class="text-lg font-medium text-anvaya-blue dark:text-anvaya-light mb-4"
      >
        Special Promotions
      </h2>
      <div class="overflow-x-auto pb-4">
        <div class="flex space-x-4">
          <div
            v-for="promo in fbPromotions"
            :key="promo.id"
            class="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300 cursor-pointer border border-anvaya-gray/10 dark:border-gray-700"
            @click="selectedPromo = promo"
          >
            <div class="relative h-40">
              <img
                :src="promo.image"
                :alt="promo.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
              ></div>
              <div class="absolute top-2 right-2">
                <span
                  class="px-1.5 py-0.5 bg-anvaya-blue/90 text-[10px] rounded-full text-white"
                >
                  {{ promo.validUntil }}
                </span>
              </div>
              <div class="absolute inset-x-0 bottom-0 p-3 text-white">
                <h3 class="font-medium text-[11px] uppercase">
                  {{ promo.title }}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Promotion Details Modal -->
    <div
      v-if="selectedPromo"
      class="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
    >
      <div class="min-h-screen px-4 flex items-center justify-center">
        <div
          class="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-md my-8 border border-anvaya-gray/10 dark:border-gray-700"
          @click.stop
        >
          <div class="relative h-48">
            <img
              :src="selectedPromo.image"
              :alt="selectedPromo.title"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
            ></div>
            <div class="absolute top-3 right-3">
              <button
                @click="selectedPromo = null"
                class="p-1.5 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
              >
                <i class="mdi mdi-close text-lg"></i>
              </button>
            </div>
            <div class="absolute inset-x-0 bottom-0 p-4 text-white">
              <span class="text-sm bg-anvaya-blue/90 px-2 py-1 rounded-full">
                {{ selectedPromo.validUntil }}
              </span>
            </div>
          </div>
          <!-- Modal Content -->
          <div class="p-4">
            <h3
              class="text-xl font-medium text-anvaya-blue dark:text-anvaya-light mb-2"
            >
              {{ selectedPromo.title }}
            </h3>
            <p
              v-if="selectedPromo.price"
              class="text-lg font-medium text-anvaya-blue/80 dark:text-anvaya-light/80 mb-3"
            >
              {{ selectedPromo.price }}
            </p>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ selectedPromo.description }}
            </p>
            <button
              class="w-full py-3 bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90 transition-colors"
              @click="selectedPromo = null"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-for="venue in diningVenues"
      :key="venue.id"
      class="mb-8 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-anvaya-gray/10 dark:border-gray-700"
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
            class="h-12 mb-4 dark:invert"
          />
          <h2
            v-else
            class="text-2xl font-medium text-anvaya-blue dark:text-anvaya-light mb-2"
          >
            {{ venue.name }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ venue.description }}
          </p>
          <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
              class="flex-1 py-2.5 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-lg hover:bg-anvaya-blue/20 dark:hover:bg-anvaya-light/20 transition-colors font-medium text-center"
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
import PageHeader from "@/components/PageHeader.vue";
import TableReservationModal from "@/components/TableReservationModal.vue";
import { diningVenues } from "@/data/dining";
import KunyitLogo from "@/assets/Kunyit Restaurant.svg";
import SandsLogo from "@/assets/Sands Restaurant.svg";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

// Define interface first
interface FBPromotion {
  id: number;
  title: string;
  description: string;
  price?: string;
  image: string;
  validUntil: string;
  fbLink: string;
}

// Then define variables
const router = useRouter();
const authStore = useAuthStore();
const selectedVenue = ref<{ id: number; name: string } | null>(null);
const selectedPromo = ref<FBPromotion | null>(null);

// Define promotions data
const fbPromotions: FBPromotion[] = [
  {
    id: 1,
    title: "GOURMET SAVINGS DEAL",
    description:
      "Up to 20% off for food and beverage. GSD #1 Value IDR 2.000.000 pay IDR 1.700.000, GSD #2 Value IDR 5.000.000 pay IDR 4.000.000",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/01/Sands-Front-1050x700-1.jpg",
    validUntil: "Limited Time Offer",
    fbLink: "https://www.facebook.com/theanvayabali",
  },
  {
    id: 2,
    title: "ROMANCE UNDER THE STARS",
    description:
      "Create lasting memories with your loved one with a memorable dinner catered to your dietary preferences",
    price: "IDR 2.500.000 net/couple",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Romantic-Dinner.jpg",
    validUntil: "Available Daily",
    fbLink: "https://www.facebook.com/theanvayabali",
  },
  {
    id: 3,
    title: "KUTA SOCIETEA",
    description:
      "Savor the finest tea blends and exquisite pastries including Lemon Berries Cake, Delicate Raspberry Éclair, Vanilla Panna Cotta, and Fruit Tartlet",
    price: "IDR 350.000 net/set (for 2 people)",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/01/Kunyit_Resturant_Front1050x700.jpg",
    validUntil: "Available Daily",
    fbLink: "https://www.facebook.com/theanvayabali",
  },
  {
    id: 4,
    title: "MEAT PLATTER",
    description:
      "Premium meat cuts including angus rib eye and lamb chop with four distinct sauces: BBQ, chimichurri, black pepper and kombu butter",
    price: "IDR 999.000 net/portion",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2024/08/Meat-Platter-960x700-1-scaled.jpg",
    validUntil: "Available at Sands Restaurant",
    fbLink: "https://www.facebook.com/theanvayabali",
  },
];

// Debug logs after data is defined
console.log("Dining Venues:", diningVenues);
console.log("FB Promotions:", fbPromotions);

// Map the logos
const logos: { [key: string]: string } = {
  "Kunyit Restaurant": KunyitLogo,
  "Sands Restaurant": SandsLogo,
};

const handleReserveClick = (venue: { id: number; name: string }) => {
  if (!authStore.isAuthenticated) {
    router.push("/profile");
    return;
  }
  selectedVenue.value = venue;
};

const handleReservationSuccess = () => {
  alert("Reservation confirmed! Check your email for details.");
  selectedVenue.value = null;
};
</script>
