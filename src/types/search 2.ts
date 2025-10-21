export interface SearchItem {
  id: string;
  type: SearchItemType;
  title: string;
  description: string;
  category: string;
  tags: string[];
  searchableText: string;
  route: string;
  imageUrl?: string;
  priority: number;
  metadata: Record<string, any>;
  relevanceScore?: number;
}

export type SearchItemType =
  | 'dining'
  | 'activity'
  | 'wellness'
  | 'amenity'
  | 'attraction'
  | 'faq'
  | 'promotion'
  | 'map'
  | 'event';

export interface SearchFilters {
  types?: SearchItemType[];
  categories?: string[];
  date?: Date;
  priceRange?: [number, number];
}

export interface SearchState {
  query: string;
  results: SearchItem[];
  recentSearches: string[];
  isSearching: boolean;
  showSearchOverlay: boolean;
  selectedFilters: SearchFilters;
  searchHistory: string[];
  searchIndex: SearchItem[];
}

export interface SearchSuggestion {
  text: string;
  type: 'recent' | 'suggestion' | 'category';
  category?: string;
  item?: SearchItem;
}

export interface SearchAnalytics {
  query: string;
  resultCount: number;
  selectedResult?: SearchItem;
  timestamp: Date;
  sessionId: string;
}