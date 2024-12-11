<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";

interface Offer {
  id: number;
  category: "staycation" | "dining" | "special";
  title: string;
  description: string;
  price?: string;
  image: string;
  details?: string[];
}

const offers: Offer[] = [
  {
    id: 1,
    category: "staycation",
    title: "STAYCATION OFFER",
    description:
      "Unwind and recharge with our staycation offer: Best rates, breakfast, airport transfer, Wi-Fi, fitness center, pool access, and beach steps away!",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Swimming-Pool.jpg",
    details: [
      "Best rates for your stay",
      "Return airport transfer",
      "Daily breakfast for two",
      "Complimentary Wi-Fi access",
      "Access to fitness center and swimming pool",
    ],
  },
  {
    id: 2,
    category: "staycation",
    title: "ROMANCE EVER AFTER",
    description:
      "Romance Ever After is an assorted mix package of sun, sands and sea. The expansive Suite with private pool, floating breakfast, sunset hi-tea and beach side candlelight romantic dinner all in one romantic getaway.",
    price: "IDR 13.000.000 net/package",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Romantic-Dinner.jpg",
    details: [
      "2 Nights – Accommodation at our spacious Suite with Pool",
      "Daily breakfast with floating breakfast option",
      "Romantic candle light dinner with wine",
      "Sunset hi tea",
      "Special turndown service with flower petals",
      "Bottle of chilled sparkling wine",
      "Return airport transfer",
      "Late Check out till 2 p.m.",
    ],
  },
  {
    id: 3,
    category: "dining",
    title: "PARADISE AT DUSK",
    description:
      "An unmatched fusion of traditional Balinese charm, giving it the ideal setting for memorable holiday celebrations.",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Sakanti_Spa_Bed_21050x700.jpg",
    details: [
      "Merry & Bright: Christmas Eve Dinner (IDR 700,000 net/person)",
      "Christmas by the SANDS (IDR 700,000 net/person)",
      "Tales and Taste of Bali (IDR 1,200,000 net/couple)",
      "New Year's Paradise at Dusk (IDR 1,200,000 net/person)",
    ],
  },
];
</script>

<template>
  <div class="events px-4 pb-4">
    <PageHeader title="What's On" />

    <div class="grid gap-6">
      <div
        v-for="offer in offers"
        :key="offer.id"
        class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-anvaya-gray/10 dark:border-gray-700"
      >
        <div class="relative h-48">
          <img
            :src="offer.image"
            :alt="offer.title"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          ></div>
          <div class="absolute top-4 right-4">
            <span
              class="px-2 py-1 bg-anvaya-blue/90 text-white text-xs rounded-full"
            >
              {{ offer.date }}
            </span>
          </div>
        </div>

        <div class="p-6">
          <h3
            class="text-xl font-medium text-anvaya-blue dark:text-anvaya-light mb-2"
          >
            {{ offer.title }}
          </h3>

          <div
            v-if="offer.price"
            class="text-anvaya-blue dark:text-anvaya-light font-medium mb-4"
          >
            {{ offer.price }}
          </div>

          <div v-if="offer.details" class="space-y-2 mb-6">
            <div
              v-for="(detail, index) in offer.details"
              :key="index"
              class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <i
                class="mdi mdi-check text-anvaya-blue dark:text-anvaya-light mt-0.5"
              ></i>
              <span>{{ detail }}</span>
            </div>
          </div>

          <button
            class="w-full py-2.5 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-lg hover:bg-anvaya-blue/20 dark:hover:bg-anvaya-light/20 transition-colors font-medium"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
