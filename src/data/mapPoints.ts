export interface MapPoint {
  id: number;
  name: string;
  category: "dining" | "wellness" | "facility" | "pool" | "entrance";
  description: string;
  coordinates: [number, number]; // [latitude, longitude]
  icon: string;
}

export const resortPoints: MapPoint[] = [
  {
    id: 1,
    name: "Leisure Pool",
    category: "pool",
    description: "Relaxing pool area with sun loungers",
    coordinates: [-8.731696, 115.164298],
    icon: "mdi mdi-pool",
  },
  {
    id: 2,
    name: "Main Pool",
    category: "pool",
    description: "Infinity pool with ocean view",
    coordinates: [-8.731834, 115.16453],
    icon: "mdi mdi-pool",
  },
  {
    id: 3,
    name: "Sands Restaurant",
    category: "dining",
    description: "Beachfront international dining",
    coordinates: [-8.732191, 115.164329],
    icon: "mdi mdi-silverware",
  },
  {
    id: 4,
    name: "Anvaya Beach",
    category: "facility",
    description: "Private beach access",
    coordinates: [-8.731909, 115.163842],
    icon: "mdi mdi-beach",
  },
  {
    id: 5,
    name: "Sakanti Spa",
    category: "wellness",
    description: "Luxury spa and wellness center",
    coordinates: [-8.730943, 115.164526],
    icon: "mdi mdi-spa",
  },
  {
    id: 6,
    name: "Main Lobby",
    category: "entrance",
    description: "Hotel main reception area",
    coordinates: [-8.732319, 115.166009],
    icon: "mdi mdi-door",
  },
  {
    id: 7,
    name: "Main Entrance",
    category: "entrance",
    description: "Hotel main entrance gate",
    coordinates: [-8.732422, 115.167344],
    icon: "mdi mdi-gate",
  },
  {
    id: 8,
    name: "Anvaya Ball Room",
    category: "facility",
    description: "Grand ballroom for events",
    coordinates: [-8.732641, 115.166844],
    icon: "mdi mdi-domain",
  },
  {
    id: 9,
    name: "Kunyit Restaurant",
    category: "dining",
    description: "Indonesian fine dining restaurant",
    coordinates: [-8.7328, 115.167162],
    icon: "mdi mdi-silverware",
  },
];

export const categoryColors = {
  dining: "#FF5252",
  wellness: "#9C27B0",
  facility: "#2196F3",
  pool: "#00BCD4",
  entrance: "#4CAF50",
};
