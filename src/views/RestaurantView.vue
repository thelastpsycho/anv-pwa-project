<script setup lang="ts">
const restaurants = [
  {
    id: 1,
    name: "Sands Restaurant",
    description: "Beachfront dining with panoramic ocean views",
    openHours: "11:00 AM - 11:00 PM",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/01/Sands-Front-1050x700-1.jpg",
    cuisine: "International",
    priceRange: "IDR 200,000 - 800,000",
    highlights: [
      "Fresh seafood selection",
      "Romantic sunset dining",
      "Extensive wine list",
      "Outdoor seating available",
    ],
  },
  {
    id: 2,
    name: "Kunyit Restaurant",
    description: "Authentic Indonesian fine dining",
    openHours: "12:00 PM - 10:00 PM",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/01/Kunyit_Resturant_Front1050x700.jpg",
    cuisine: "Indonesian",
    priceRange: "IDR 150,000 - 500,000",
    highlights: [
      "Traditional recipes",
      "Local ingredients",
      "Cultural ambiance",
      "Private dining rooms",
    ],
  },
  {
    id: 3,
    name: "Pool Bar",
    description: "Casual poolside refreshments",
    openHours: "10:00 AM - 7:00 PM",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Cocktail-2-1050x700-1.jpg",
    cuisine: "Light Bites & Cocktails",
    priceRange: "IDR 80,000 - 250,000",
    highlights: [
      "Signature cocktails",
      "Light snacks",
      "Infinity pool views",
      "Sunset happy hour",
    ],
  },
  {
    id: 4,
    name: "Room Service",
    description: "Comfort and convenience in your room",
    openHours: "24 Hours",
    image:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1050&h=700&fit=crop",
    cuisine: "International & Local",
    priceRange: "IDR 100,000 - 400,000",
    highlights: [
      "24/7 availability",
      "Extensive menu selection",
      "Breakfast in bed",
      "Special dietary options",
    ],
  },
];
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-3xl font-medium text-anvaya-blue mb-3">
          Dining Experiences
        </h1>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover culinary excellence at The Anvaya, where each venue offers a
          unique dining experience crafted to delight your senses
        </p>
      </div>

      <!-- Restaurant Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="restaurant in restaurants"
          :key="restaurant.id"
          class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <!-- Image Container -->
          <div class="relative h-64 overflow-hidden">
            <img
              :src="restaurant.image"
              :alt="restaurant.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
            ></div>
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <h2 class="text-2xl font-medium text-white mb-1">
                {{ restaurant.name }}
              </h2>
              <p class="text-white/90">{{ restaurant.description }}</p>
            </div>
          </div>

          <!-- Details -->
          <div class="p-6 space-y-4">
            <!-- Basic Info -->
            <div class="flex items-center justify-between text-sm">
              <span class="text-anvaya-blue font-medium">{{
                restaurant.cuisine
              }}</span>
              <span class="text-gray-600">{{ restaurant.openHours }}</span>
            </div>

            <!-- Price Range -->
            <div class="text-sm text-gray-600">
              <span class="font-medium">Price Range:</span>
              {{ restaurant.priceRange }}
            </div>

            <!-- Highlights -->
            <div class="pt-4 border-t border-anvaya-gray/10">
              <h3 class="text-sm font-medium text-gray-700 mb-3">Highlights</h3>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="highlight in restaurant.highlights"
                  :key="highlight"
                  class="flex items-center text-sm text-gray-600"
                >
                  <i class="mdi mdi-check text-anvaya-blue mr-2"></i>
                  <span>{{ highlight }}</span>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <button
              class="mt-6 w-full bg-anvaya-blue/10 hover:bg-anvaya-blue/20 text-anvaya-blue py-3 rounded-lg font-medium transition-colors"
            >
              Make a Reservation
            </button>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="mt-16 text-center">
        <p class="text-gray-600">
          For special arrangements or private dining inquiries,
          <button class="text-anvaya-blue font-medium hover:underline">
            contact our dining concierge
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
