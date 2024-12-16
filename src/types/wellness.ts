export interface WellnessService {
  id: string;
  title: string;
  description: string;
  operatingHours: string;
  image: string;
  hasBooking: boolean;
  additionalInfo?: string[];
}
