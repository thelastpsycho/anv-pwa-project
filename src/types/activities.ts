export interface Activity {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  groupSize: string;
  location: string;
  startTime: string;
  endTime: string;
  schedule: Array<{
    date: string;
    slots: Array<{
      startTime: string;
      endTime: string;
      capacity: number;
    }>;
  }>;
}
