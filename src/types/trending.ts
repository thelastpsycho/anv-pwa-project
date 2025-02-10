export interface TrendingItem {
  id: string;
  title: string;
  description: string;
  category: string;
  link?: string;
  image: string;
  status: string;
  priority: number;
  createdAt: number | string;
  validUntil?: string;
  type: 'activity' | 'event' | 'promotion';
} 