<template>
  <div class="activities p-4">
    <PageHeader title="Activities & Experiences" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <img
          :src="activity.image"
          :alt="activity.name"
          class="w-full h-64 object-cover"
        />
        <div class="p-6">
          <h2 class="text-xl font-medium text-anvaya-blue mb-2">
            {{ activity.name }}
          </h2>
          <p class="text-gray-600 mb-4">{{ activity.description }}</p>
          <div class="flex flex-col space-y-2 text-sm">
            <div class="text-gray-600">
              <i class="mdi mdi-clock-outline mr-1"></i>{{ activity.time }}
            </div>
            <div class="text-gray-600">
              <i class="mdi mdi-map-marker-outline mr-1"></i
              >{{ activity.location }}
            </div>
            <div class="text-anvaya-blue font-medium">
              <i class="mdi mdi-currency-usd mr-1"></i>{{ activity.price }}
            </div>
          </div>
          <button
            class="mt-4 w-full py-2 bg-anvaya-blue/10 text-anvaya-blue rounded-lg hover:bg-anvaya-blue/20 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";

const activities = [
  {
    id: 1,
    name: "Cycling Tour",
    time: "07:00 AM - 09:00 AM",
    description:
      "Explore the scenic beauty of Bali on our guided cycling tour through traditional villages, rice paddies, and coastal paths.",
    image:
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1470&auto=format&fit=crop",
    price: "IDR 350,000/person",
    location: "Hotel Lobby",
  },
  {
    id: 2,
    name: "Cooking Class",
    time: "10:00 AM - 12:30 PM",
    description:
      "Learn the art of Balinese cuisine with our expert chefs. Includes market visit, cooking session, and lunch with your creations.",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1470&auto=format&fit=crop",
    price: "IDR 850,000/person",
    location: "Kunyit Restaurant",
  },
  {
    id: 3,
    name: "Water Aerobics",
    time: "09:00 AM - 10:00 AM",
    description:
      "Join our energetic water aerobics session for a fun and effective low-impact workout in our infinity pool.",
    image:
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1470&auto=format&fit=crop",
    price: "Complimentary",
    location: "Main Pool",
  },
  {
    id: 4,
    name: "Chess Master",
    time: "02:00 PM - 04:00 PM",
    description:
      "Challenge yourself with a game of chess in our elegant lobby lounge. Available for all skill levels.",
    image:
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1471&auto=format&fit=crop",
    price: "Complimentary",
    location: "Lobby Lounge",
  },
  {
    id: 5,
    name: "Water Volleyball",
    time: "03:00 PM - 04:00 PM",
    description:
      "Enjoy a friendly game of water volleyball in our pool. Perfect for family fun or meeting other guests.",
    image:
      "https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=1470&auto=format&fit=crop",
    price: "Complimentary",
    location: "Beach Pool",
  },
];
</script>

<style scoped>
.activities {
  min-height: calc(100vh - 64px); /* Adjust based on your navbar height */
}
</style>
