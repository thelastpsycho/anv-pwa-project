<template>
  <div class="resort-map relative">
    <div id="map" class="h-[70vh] w-full rounded-xl overflow-hidden"></div>

    <!-- Location Button -->
    <button
      class="absolute bottom-4 right-4 z-[400] p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      :class="{ 'text-anvaya-blue': isLocating }"
      @click="centerOnLocation"
    >
      <i class="mdi mdi-crosshairs-gps text-lg"></i>
    </button>

    <!-- Category Filter Overlay -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[400]">
      <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 dark:border-gray-700 p-1.5">
        <div class="flex items-center gap-1">
          <button
            v-for="category in categories"
            :key="category"
            class="p-1.5 rounded-full text-xs whitespace-nowrap flex items-center transition-all duration-200 relative group"
            :class="[
              activeCategories.includes(category)
                ? 'bg-anvaya-blue text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300',
            ]"
            @click="toggleCategory(category)"
          >
            <i :class="[getCategoryIcon(category), 'text-base']"></i>
            <span 
              v-if="getPointCount(category) > 0"
              class="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] rounded-full bg-anvaya-blue text-white"
            >
              {{ getPointCount(category) }}
            </span>
            <!-- Tooltip -->
            <span 
              class="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-900/90 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {{ category.charAt(0).toUpperCase() + category.slice(1) }}
            </span>
          </button>
        </div>
      </div>
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
const locationMarker = ref<L.Marker | null>(null);
const locationCircle = ref<L.Circle | null>(null);
const isLocating = ref(false);
const hasRequestedPermission = ref(false);
const categories = ["dining", "wellness", "facility", "pool", "entrance"];
const activeCategories = ref<string[]>([...categories]);

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
  if (activeCategories.value.includes(category)) {
    activeCategories.value = activeCategories.value.filter(cat => cat !== category);
  } else {
    activeCategories.value = [...activeCategories.value, category];
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

// Add this function to get point count per category
function getPointCount(category: string): number {
  return mapPoints.value.filter(point => point.category === category).length;
}

// Function to handle location
async function centerOnLocation() {
  if (!map.value) return;
  
  isLocating.value = true;
  
  try {
    // Check permission first
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }
    
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
    
    const { latitude, longitude, accuracy } = position.coords;
    
    // Remove existing location markers
    if (locationMarker.value) locationMarker.value.remove();
    if (locationCircle.value) locationCircle.value.remove();
    
    // Add accuracy circle
    locationCircle.value = L.circle([latitude, longitude], {
      radius: accuracy,
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.15,
      weight: 1
    }).addTo(map.value as L.Map);
    
    // Add location marker
    locationMarker.value = L.marker([latitude, longitude], {
      icon: L.divIcon({
        html: '<div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>',
        className: 'location-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })
    }).addTo(map.value as L.Map);
    
    // Center map on location
    map.value.setView([latitude, longitude], 18);
    
  } catch (error) {
    console.error('Location error:', error);
    alert('Unable to get your location. Please check your device settings.');
  } finally {
    isLocating.value = false;
  }
}

// Function to check and request location permission
async function requestLocationPermission(): Promise<boolean> {
  if (!navigator.permissions || !navigator.permissions.query) {
    // Fallback for browsers that don't support permissions API
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false)
      );
    });
  }
  
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    if (result.state === 'granted') return true;
    if (result.state === 'prompt') {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false)
        );
      });
    }
    return false;
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
}

onMounted(async () => {
  // Request location permission on mount for mobile devices
  if (!hasRequestedPermission.value && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    hasRequestedPermission.value = true;
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      centerOnLocation();
    }
  }

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
/* Location marker pulse animation */
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  70% { transform: scale(2); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}

.location-marker::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
}

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
