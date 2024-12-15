import logoKunyit from "../assets/Kunyit Restaurant.svg";
import logoSands from "../assets/Sands Restaurant.svg";
import logoSakanti from "../assets/Sakanti Spa.svg";

export interface MapPoint {
  id: number;
  name: string;
  category: "dining" | "wellness" | "facility" | "pool" | "entrance";
  description: string;
  coordinates: [number, number]; // [latitude, longitude]
  icon: string;
  logo?: string; // Optional logo URL for specific venues
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
    id: 12,
    name: "Main Pool",
    category: "pool",
    description: "Main swimming pool with ocean view",
    coordinates: [-8.73207, 115.164836],
    icon: "mdi mdi-pool",
  },
  {
    id: 13,
    name: "Deluxe Pool",
    category: "pool",
    description: "Exclusive pool area",
    coordinates: [-8.733116, 115.166566],
    icon: "mdi mdi-pool",
  },
  {
    id: 14,
    name: "Main Garden",
    category: "facility",
    description: "Beautiful landscaped garden area",
    coordinates: [-8.732091, 115.165344],
    icon: "mdi mdi-grass",
  },
  {
    id: 15,
    name: "Lobby Lounge",
    category: "facility",
    description: "Comfortable lounge area in the main lobby",
    coordinates: [-8.732198, 115.165671],
    icon: "mdi mdi-sofa",
  },
  {
    id: 16,
    name: "Leisure Deck",
    category: "facility",
    description: "Outdoor relaxation area",
    coordinates: [-8.73171, 115.164216],
    icon: "mdi mdi-umbrella-beach",
  },
  {
    id: 17,
    name: "Sands Pavilion",
    category: "facility",
    description: "Beachfront event venue",
    coordinates: [-8.731946, 115.164301],
    icon: "mdi mdi-gazebo",
  },
  {
    id: 2,
    name: "Activity Pool",
    category: "pool",
    description: "Activity Pool",
    coordinates: [-8.731834, 115.16453],
    icon: "mdi mdi-pool",
  },
  {
    id: 10,
    name: "Pool Bar",
    category: "dining",
    description: "Refreshing drinks and light bites by the pool",
    coordinates: [-8.731667, 115.164482],
    icon: "mdi mdi-glass-cocktail",
  },
  {
    id: 3,
    name: "Sands Restaurant",
    category: "dining",
    description: "Beachfront international dining",
    coordinates: [-8.732191, 115.164329],
    icon: "mdi mdi-silverware",
    logo: logoSands,
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
    logo: logoSakanti,
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
    id: 11,
    name: "Meeting Rooms",
    category: "facility",
    description: "Professional meeting and conference facilities",
    coordinates: [-8.732131, 115.166684],
    icon: "mdi mdi-presentation",
  },
  {
    id: 9,
    name: "Kunyit Restaurant",
    category: "dining",
    description: "Indonesian fine dining restaurant",
    coordinates: [-8.7328, 115.167162],
    icon: "mdi mdi-silverware",
    logo: logoKunyit,
  },
];

export const categoryColors = {
  dining: "#FF5252",
  wellness: "#9C27B0",
  facility: "#2196F3",
  pool: "#00BCD4",
  entrance: "#4CAF50",
};
