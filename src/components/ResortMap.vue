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
import { resortPoints, categoryColors } from "@/data/mapPoints";
import type { MapPoint } from "@/data/mapPoints";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

const map = ref<L.Map | null>(null);
const markers = ref<L.Marker[]>([]);
const categories = ["dining", "wellness", "facility", "pool", "entrance"];
const activeCategories = ref(categories);

// Define Anvaya boundaries
const anvayaBounds = [
  [-8.732452, 115.167452],
  [-8.73216, 115.167242],
  [-8.732022, 115.166931],
  [-8.731884, 115.166545],
  [-8.731927, 115.166486],
  [-8.732181, 115.166373],
  [-8.732054, 115.166046],
  [-8.731826, 115.166094],
  [-8.731577, 115.165182],
  [-8.731709, 115.165097],
  [-8.731678, 115.164914],
  [-8.731487, 115.164576],
  [-8.73075, 115.164791],
  [-8.730622, 115.16448],
  [-8.731153, 115.163798],
  [-8.73172, 115.163262],
  [-8.732176, 115.163906],
  [-8.732537, 115.164764],
  [-8.732685, 115.165644],
  [-8.732621, 115.165966],
  [-8.732515, 115.16633],
  [-8.732887, 115.166363],
  [-8.732897, 115.166663],
  [-8.733035, 115.167253],
  [-8.732526, 115.16735],
  [-8.732452, 115.167452],
];

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

const createCustomIcon = (point: MapPoint) => {
  return L.divIcon({
    html: `<div class="custom-marker" style="color: ${categoryColors[point.category]}">
             <i class="${point.icon}"></i>
           </div>`,
    className: "custom-marker-container",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const updateMarkers = () => {
  // Clear existing markers
  markers.value.forEach((marker) => marker.remove());
  markers.value = [];

  // Add new markers based on active categories
  resortPoints
    .filter((point) => activeCategories.value.includes(point.category))
    .forEach((point) => {
      const marker = L.marker(point.coordinates, {
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

onMounted(() => {
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

  // Track current location marker and circle
  let currentLocationMarker: L.Marker | null = null;
  let currentLocationCircle: L.Circle | null = null;

  // Function to update location marker
  const updateLocationMarker = (position: L.LatLng, accuracy: number) => {
    // Remove existing markers
    if (currentLocationMarker) {
      map.value?.removeLayer(currentLocationMarker);
    }
    if (currentLocationCircle) {
      map.value?.removeLayer(currentLocationCircle);
    }

    // Add new marker
    currentLocationMarker = L.marker(position, {
      icon: L.divIcon({
        html: `
          <div class="flex flex-col items-center">
            <i class="mdi mdi-crosshairs-gps text-blue-500 text-xl"></i>
            <span class="text-xs bg-white px-1.5 py-0.5 rounded-full shadow-sm mt-1">You are here</span>
          </div>
        `,
        className: "location-marker",
        iconSize: [80, 45],
        iconAnchor: [40, 22],
      }),
    }).addTo(map.value as L.Map);

    // Add accuracy circle
    currentLocationCircle = L.circle(position, {
      radius: accuracy,
      weight: 1,
      color: "#4299e1",
      fillColor: "#4299e1",
      fillOpacity: 0.1,
    }).addTo(map.value as L.Map);
  };

  // Add custom location control
  try {
    const locationButton = new L.Control({ position: "topleft" });
    locationButton.onAdd = () => {
      const div = L.DomUtil.create("div", "leaflet-bar");
      div.innerHTML = `
        <button 
          class="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50"
          title="Show my location"
        >
          <i class="mdi mdi-crosshairs-gps text-anvaya-blue text-xl"></i>
        </button>
      `;

      div.onclick = () => {
        map.value?.locate({
          setView: true,
          maxZoom: 18,
          enableHighAccuracy: true,
          watch: true, // Continuously watch position
        });
      };
      return div;
    };
    locationButton.addTo(map.value as L.Map);

    // Handle location found
    map.value.on("locationfound", (e) => {
      updateLocationMarker(e.latlng, e.accuracy);
    });

    // Handle location error
    map.value.on("locationerror", (e) => {
      console.error("Location error:", e.message);
      alert("Please enable location access in your device settings");
    });

    // Start watching location immediately
    map.value.locate({
      setView: true,
      maxZoom: 18,
      enableHighAccuracy: true,
      watch: true,
    });
  } catch (error) {
    console.error("Error initializing location control:", error);
  }

  // Add initial markers
  updateMarkers();
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

.location-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
