<template>
  <div class="resort-map">
    <div id="map" class="h-[70vh] w-full rounded-xl overflow-hidden"></div>

    <!-- Category Filter -->
    <div class="flex gap-2 mt-4 overflow-x-auto pb-2">
      <button
        v-for="category in categories"
        :key="category"
        @click="toggleCategory(category)"
        class="px-3 py-1.5 rounded-lg text-xs whitespace-nowrap flex items-center gap-1"
        :class="[
          activeCategories.includes(category)
            ? 'bg-anvaya-blue text-white'
            : 'bg-anvaya-blue/10 text-anvaya-blue',
        ]"
      >
        <i :class="getCategoryIcon(category)"></i>
        {{ category.charAt(0).toUpperCase() + category.slice(1) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import L from "leaflet";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { MapPoint } from "@/types/map";
import logoKunyit from "@/assets/Kunyit Restaurant.svg";
import logoSands from "@/assets/Sands Restaurant.svg";
import logoSakanti from "@/assets/Sakanti Spa.svg";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

const map = ref<L.Map | null>(null);
const markers = ref<L.Marker[]>([]);
const mapPoints = ref<MapPoint[]>([]);
const categories = ["dining", "wellness", "facility", "pool", "entrance"];
const activeCategories = ref(categories);

const categoryColors: Record<string, string> = {
  dining: "#4CAF50",
  wellness: "#2196F3",
  facility: "#9C27B0",
  pool: "#00BCD4",
  entrance: "#FF9800",
};

const venueLogos = {
  "Kunyit Restaurant": logoKunyit,
  "Sands Restaurant": logoSands,
  "Sakanti Spa": logoSakanti,
} as const;

async function loadMapPoints() {
  try {
    const querySnapshot = await getDocs(collection(db, "mapPoints"));
    mapPoints.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as MapPoint[];
    updateMarkers();
  } catch (error) {
    console.error("Error loading map points:", error);
  }
}

const toggleCategory = (category: string) => {
  const index = activeCategories.value.indexOf(category);
  if (index === -1) {
    activeCategories.value.push(category);
  } else {
    activeCategories.value.splice(index, 1);
  }
  updateMarkers();
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "dining":
      return "mdi mdi-silverware";
    case "wellness":
      return "mdi mdi-spa";
    case "facility":
      return "mdi mdi-domain";
    case "pool":
      return "mdi mdi-pool";
    case "entrance":
      return "mdi mdi-door";
    default:
      return "mdi mdi-map-marker";
  }
};

type VenueName = keyof typeof venueLogos;

const createCustomIcon = (point: MapPoint) => {
  return L.divIcon({
    html: `
      <div class="flex flex-col items-center">
        <span class="text-[10px] bg-white/90 px-1 py-0.5 rounded-full shadow-sm mb-0.5 whitespace-nowrap">
          ${point.name}
        </span>
        <div class="custom-marker" style="color: ${categoryColors[point.category]}">
          ${
            venueLogos[point.name as VenueName]
              ? `<img src="${venueLogos[point.name as VenueName]}" alt="" class="w-4 h-4 dark:invert">`
              : `<i class="${point.icon}"></i>`
          }
        </div>
      </div>
    `,
    className: "custom-marker-container",
    iconSize: [100, 40],
    iconAnchor: [50, 40],
    popupAnchor: [0, -30],
  });
};

const updateMarkers = () => {
  // Clear existing markers
  markers.value.forEach((marker) => marker.remove());
  markers.value = [];

  // Add new markers based on active categories
  mapPoints.value
    .filter((point) => activeCategories.value.includes(point.category))
    .forEach((point) => {
      const marker = L.marker(point.coordinates as [number, number], {
        icon: createCustomIcon(point),
      })
        .bindPopup(
          `
          <div class="p-2">
            <h3 class="font-medium">${point.name}</h3>
            <p class="text-sm">${point.description}</p>
          </div>
        `
        )
        .addTo(map.value as L.Map);

      markers.value.push(marker);
    });
};

// Parse KML coordinates
const parseKMLCoordinates = async () => {
  try {
    const response = await fetch("/anv-boundary.kml");
    const kmlText = await response.text();
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlText, "text/xml");
    const coordinates = kmlDoc.querySelector("coordinates")?.textContent || "";

    return coordinates
      .trim()
      .split(" ")
      .map((coord) => {
        const [lng, lat] = coord.split(",");
        return [parseFloat(lat), parseFloat(lng)];
      });
  } catch (error) {
    console.error("Error parsing KML:", error);
    return [];
  }
};

onMounted(async () => {
  // Get coordinates from KML
  const anvayaBounds = await parseKMLCoordinates();

  // Initialize map
  map.value = L.map("map", {
    maxBounds: L.latLngBounds([
      [-8.7335, 115.1635],
      [-8.7305, 115.168],
    ]),
    maxZoom: 20,
    minZoom: 16,
    dragging: true,
    zoomControl: true,
    scrollWheelZoom: true,
  }).setView([-8.732075, 115.165436], 18);

  // Define base layers
  const baseLayers = {
    "Street View": L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      {
        maxZoom: 20,
        subdomains: "abcd",
      }
    ),
    "Satellite View": L.tileLayer(
      "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      {
        maxZoom: 20,
      }
    ),
  };

  // Add default layer
  baseLayers["Satellite View"].addTo(map.value as L.Map);

  // Add layer control
  L.control.layers(baseLayers).addTo(map.value as L.Map);

  // Add Anvaya boundary polygon
  L.polygon(anvayaBounds as L.LatLngTuple[], {
    color: "#89a8b2", // Anvaya blue color
    weight: 2,
    fillColor: "#89a8b2",
    fillOpacity: 0.1,
  }).addTo(map.value as L.Map);

  // Create outer bounds for masking
  const outerBounds = [
    [-8.735, 115.162],
    [-8.735, 115.17],
    [-8.729, 115.17],
    [-8.729, 115.162],
    [-8.735, 115.162], // Close the polygon
  ];

  // Add mask for outside area
  L.polygon([outerBounds, anvayaBounds] as L.LatLngExpression[][], {
    color: "white",
    fillColor: "white",
    fillOpacity: 0.8,
    stroke: false,
  }).addTo(map.value as L.Map);

  // Add initial markers
  await loadMapPoints();
});
</script>

<style>
/* Hide leaflet attribution */
.leaflet-control-attribution {
  display: none;
}

.custom-marker-container {
  background: none;
  border: none;
}

.custom-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.custom-marker i {
  font-size: 18px;
}
</style>
