<script setup lang="ts">
const activities = [
  {
    id: 1,
    name: "Yoga Session",
    time: "7:00 AM",
    location: "Beachfront Yoga Deck",
    duration: "60 min",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Yoga-Class.jpg",
    description: "Start your day with rejuvenating yoga by the beach",
    price: "IDR 250,000/person",
  },
  {
    id: 2,
    name: "Romantic Dinner",
    time: "6:00 PM",
    location: "Private Beach Area",
    duration: "120 min",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Romantic-Dinner.jpg",
    description: "Intimate beachfront dining under the stars",
    price: "IDR 1,500,000/couple",
  },
  {
    id: 3,
    name: "Spa Treatment",
    time: "10:00 AM - 8:00 PM",
    location: "Sakanti Spa",
    duration: "90 min",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Sakanti_Spa_Bed_21050x700.jpg",
    description: "Traditional Balinese massage and treatments",
    price: "From IDR 650,000",
  },
  {
    id: 4,
    name: "Cooking Class",
    time: "11:00 AM",
    location: "Kunyit Restaurant",
    duration: "120 min",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/01/Kunyit_Resturant_Front1050x700.jpg",
    description: "Learn to cook authentic Indonesian dishes",
    price: "IDR 850,000/person",
  },
  {
    id: 5,
    name: "Pool Access",
    time: "7:00 AM - 7:00 PM",
    location: "Main Pool Area",
    duration: "All day",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Swimming-Pool.jpg",
    description: "Infinity pool with ocean views",
    price: "Complimentary for guests",
  },
  {
    id: 6,
    name: "Beach Activities",
    time: "9:00 AM - 5:00 PM",
    location: "Private Beach",
    duration: "Flexible",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/Beach-Club.jpg",
    description: "Surfing, volleyball, and water sports",
    price: "Various rates apply",
  },
];
</script>

<template>
  <div class="p-4 bg-anvaya-cream/20">
    <h1 class="text-2xl font-medium text-anvaya-blue mb-6">
      Activities & Experiences
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <div class="flex flex-col sm:flex-row h-full">
          <div class="sm:w-1/3">
            <img
              :src="activity.image"
              :alt="activity.name"
              class="w-full h-48 sm:h-full object-cover"
            />
          </div>

          <div class="flex-1 p-4">
            <div class="flex items-start justify-between mb-2">
              <h2 class="text-lg font-medium text-anvaya-blue">
                {{ activity.name }}
              </h2>
              <span class="text-sm font-medium text-anvaya-blue/80">{{
                activity.duration
              }}</span>
            </div>

            <p class="text-gray-600 text-sm mb-3">{{ activity.description }}</p>

            <div class="space-y-2">
              <div class="flex items-center text-sm text-gray-600">
                <i class="mdi mdi-clock-outline mr-2"></i>
                {{ activity.time }}
              </div>

              <div class="flex items-center text-sm text-gray-600">
                <i class="mdi mdi-map-marker-outline mr-2"></i>
                {{ activity.location }}
              </div>

              <div
                class="flex items-center text-sm font-medium text-anvaya-blue"
              >
                <i class="mdi mdi-currency-usd mr-2"></i>
                {{ activity.price }}
              </div>
            </div>

            <button
              class="mt-4 px-4 py-2 bg-anvaya-blue/10 hover:bg-anvaya-blue/20 text-anvaya-blue rounded-lg text-sm font-medium transition-colors duration-300"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
