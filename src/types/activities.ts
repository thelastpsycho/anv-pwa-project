export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  location: string;
  weekdays?: string[];
  category: string;
  capacity?: string;
  duration?: string;
  instructor?: string;
  requirements?: string;
  image: string;
  dayOfWeek: string;
}
