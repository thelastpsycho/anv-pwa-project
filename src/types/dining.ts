export interface DiningVenue {
  id: string;
  name: string;
  description: string;
  image: string;
  hours: string;
  dress: string;
  cuisine: string;
  capacity: string;
  additionalInfo?: string;
  logo?: string;
}

export interface TableReservation {
  venueId: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface ValidationErrors {
  date?: string;
  time?: string;
  guests?: string;
  name?: string;
  email?: string;
  phone?: string;
}
