<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";

interface Location {
  id: number;
  name: string;
  type: string;
  distance: string;
  timeByVehicle: string;
  description: string;
  image: string;
  directions?: string;
}

const locations: Location[] = [
  {
    id: 1,
    name: "Ngurah Rai Airport",
    type: "Transportation",
    distance: "4.5 km",
    timeByVehicle: "15 minutes",
    description:
      "Bali's main international airport with direct flights to major cities across Asia and Australia.",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/ngurah-rai.jpg",
    directions:
      "Take Jl. Bypass Ngurah Rai towards Kuta, turn right at Jl. Kartika Plaza",
  },
  {
    id: 2,
    name: "Waterbom Bali",
    type: "Entertainment",
    distance: "1.2 km",
    timeByVehicle: "5 minutes",
    description:
      "Asia's #1 waterpark featuring world-class slides and attractions.",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/waterbom.jpg",
    directions: "Head north on Jl. Kartika Plaza",
  },
  {
    id: 3,
    name: "Beachwalk Shopping Center",
    type: "Shopping",
    distance: "2.5 km",
    timeByVehicle: "10 minutes",
    description:
      "Modern shopping mall with international brands, dining, and entertainment options.",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/beachwalk.jpg",
    directions: "Follow Jl. Kartika Plaza north to Kuta Beach",
  },
  {
    id: 4,
    name: "Kuta Beach",
    type: "Beach",
    distance: "0.1 km",
    timeByVehicle: "2 minutes walk",
    description: "Famous beach known for its sunset views and surfing spots.",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/kuta-beach.jpg",
  },
  {
    id: 5,
    name: "Discovery Shopping Mall",
    type: "Shopping",
    distance: "0.8 km",
    timeByVehicle: "3 minutes",
    description:
      "Beachfront mall featuring retail shops, restaurants, and entertainment.",
    image:
      "https://www.theanvayabali.com/wp-content/uploads/2023/02/discovery-mall.jpg",
  },
];
</script>

<template>
  <div class="around pt-4 px-4 mb-4">
    <PageHeader title="Around Us" />

    <div class="space-y-6">
      <div
        v-for="location in locations"
        :key="location.id"
        class="bg-white rounded-xl overflow-hidden shadow-lg"
      >
        <div class="relative h-48">
          <img
            :src="location.image"
            :alt="location.name"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          ></div>
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <span
              class="px-2 py-1 bg-anvaya-blue/90 text-white text-xs rounded-full"
            >
              {{ location.type }}
            </span>
          </div>
        </div>

        <div class="p-6">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-medium text-anvaya-blue">
              {{ location.name }}
            </h3>
            <div class="flex flex-col items-end">
              <span class="text-sm font-medium text-anvaya-blue">{{
                location.distance
              }}</span>
              <span class="text-xs text-gray-500">{{
                location.timeByVehicle
              }}</span>
            </div>
          </div>

          <p class="text-sm text-gray-600 mb-4">{{ location.description }}</p>

          <div
            v-if="location.directions"
            class="flex items-start gap-2 text-sm text-gray-600 bg-anvaya-blue/5 p-3 rounded-lg"
          >
            <i class="mdi mdi-directions text-anvaya-blue mt-0.5"></i>
            <p>{{ location.directions }}</p>
          </div>

          <a
            :href="`https://www.google.com/maps/dir/The+Anvaya+Beach+Resort+Bali/${encodeURIComponent(location.name)}+Bali`"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 w-full py-2.5 bg-anvaya-blue/10 text-anvaya-blue rounded-lg hover:bg-anvaya-blue/20 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <i class="mdi mdi-map-marker"></i>
            Get Directions
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
