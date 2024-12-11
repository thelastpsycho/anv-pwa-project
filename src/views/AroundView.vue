<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/PageHeader.vue";

const isLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});

const attractions = [
  {
    id: 1,
    title: "Kuta Beach",
    description:
      "Famous beach known for its surfing, sunsets, and vibrant atmosphere. Just steps away from the hotel.",
    distance: "5 minutes walk",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Kuta-Beach.jpg",
    category: "Beach",
  },
  {
    id: 2,
    title: "Beachwalk Shopping Center",
    description:
      "Modern shopping mall with international brands, dining options, and entertainment facilities.",
    distance: "10 minutes walk",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Beachwalk.jpg",
    category: "Shopping",
  },
  {
    id: 3,
    title: "Waterbom Bali",
    description:
      "Asia's #1 waterpark featuring exciting slides and attractions for all ages.",
    distance: "15 minutes walk",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Waterbom.jpg",
    category: "Entertainment",
  },
  {
    id: 4,
    title: "Discovery Shopping Mall",
    description:
      "Beachfront shopping center with local and international retailers.",
    distance: "15 minutes walk",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Discovery-Mall.jpg",
    category: "Shopping",
  },
  {
    id: 5,
    title: "Kuta Art Market",
    description:
      "Traditional market selling local crafts, souvenirs, and textiles.",
    distance: "20 minutes walk",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Kuta-Art-Market.jpg",
    category: "Shopping",
  },
];
</script>

<template>
  <div class="around px-4 pb-4">
    <PageHeader title="Around Us" />

    <div
      :class="[
        'opacity-0 translate-y-5 transition-all duration-600 ease-out',
        isLoaded ? 'opacity-100 translate-y-0' : '',
      ]"
    >
      <div class="grid gap-6">
        <div
          v-for="attraction in attractions"
          :key="attraction.id"
          class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-anvaya-gray/10 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
        >
          <div class="relative h-48">
            <img
              :src="attraction.image"
              :alt="attraction.title"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
            ></div>
            <div class="absolute top-4 right-4">
              <span
                class="px-2 py-1 bg-anvaya-blue/90 text-white text-xs rounded-full"
              >
                {{ attraction.category }}
              </span>
            </div>
          </div>

          <div class="p-6">
            <h3
              class="text-xl font-medium text-anvaya-blue dark:text-anvaya-light mb-2"
            >
              {{ attraction.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ attraction.description }}
            </p>
            <div
              class="flex items-center text-sm text-anvaya-blue/80 dark:text-anvaya-light/80"
            >
              <i class="mdi mdi-walk mr-2"></i>
              <span>{{ attraction.distance }}</span>
            </div>
            <button
              class="w-full mt-4 py-2.5 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-lg hover:bg-anvaya-blue/20 dark:hover:bg-anvaya-light/20 transition-colors font-medium"
            >
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
