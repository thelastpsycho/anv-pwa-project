export interface TableReservation {
  venueId: number;
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
  id?: string;
  status?: string;
  createdAt?: string;
}

export interface ValidationErrors {
  date?: string;
  time?: string;
  guests?: string;
  name?: string;
  email?: string;
  phone?: string;
}
