export interface TrendingItem {
  id: string;
  title: string;
  description: string;
  image: string;
  validUntil: string;
  type: 'activity' | 'promotion' | 'event';
} 