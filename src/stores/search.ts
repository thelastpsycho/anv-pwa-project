import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SearchItem, SearchFilters, SearchState, SearchSuggestion } from '@/types/search';

export const useSearchStore = defineStore('search', () => {
  // State
  const query = ref('');
  const results = ref<SearchItem[]>([]);
  const recentSearches = ref<string[]>([]);
  const isSearching = ref(false);
  const showSearchOverlay = ref(false);
  const selectedFilters = ref<SearchFilters>({});
  const searchHistory = ref<string[]>([]);
  const searchIndex = ref<SearchItem[]>([]);

  // Computed
  const hasResults = computed(() => results.value.length > 0);
  const isSearchActive = computed(() => query.value.length > 0);
  const filteredResults = computed(() => {
    let filtered = results.value;

    // Apply type filters
    if (selectedFilters.value.types && selectedFilters.value.types.length > 0) {
      filtered = filtered.filter(item => selectedFilters.value.types!.includes(item.type));
    }

    // Apply category filters
    if (selectedFilters.value.categories && selectedFilters.value.categories.length > 0) {
      filtered = filtered.filter(item =>
        selectedFilters.value.categories!.some(category =>
          item.category.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    return filtered;
  });

  const suggestions = computed<SearchSuggestion[]>(() => {
    const suggestions: SearchSuggestion[] = [];

    // Recent searches
    recentSearches.value.slice(0, 5).forEach(search => {
      suggestions.push({
        text: search,
        type: 'recent'
      });
    });

    // Category suggestions based on current query
    if (query.value.length > 0) {
      const categories = [...new Set(searchIndex.value.map(item => item.category))];
      const matchingCategories = categories.filter(category =>
        category.toLowerCase().includes(query.value.toLowerCase())
      );

      matchingCategories.slice(0, 3).forEach(category => {
        suggestions.push({
          text: category,
          type: 'category',
          category
        });
      });
    }

    return suggestions;
  });

  // Actions
  const setSearchQuery = (newQuery: string) => {
    query.value = newQuery;
  };

  const setSearchResults = (newResults: SearchItem[]) => {
    results.value = newResults;
  };

  const addToRecentSearches = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    // Remove if already exists
    const index = recentSearches.value.indexOf(searchTerm);
    if (index > -1) {
      recentSearches.value.splice(index, 1);
    }

    // Add to beginning
    recentSearches.value.unshift(searchTerm);

    // Keep only last 10
    if (recentSearches.value.length > 10) {
      recentSearches.value = recentSearches.value.slice(0, 10);
    }

    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
  };

  const clearRecentSearches = () => {
    recentSearches.value = [];
    localStorage.removeItem('recentSearches');
  };

  const setSearchOverlay = (show: boolean) => {
    showSearchOverlay.value = show;
    if (!show) {
      query.value = '';
      results.value = [];
    }
  };

  const updateFilters = (filters: Partial<SearchFilters>) => {
    selectedFilters.value = { ...selectedFilters.value, ...filters };
  };

  const clearFilters = () => {
    selectedFilters.value = {};
  };

  const initializeSearchIndex = (index: SearchItem[]) => {
    searchIndex.value = index;
  };

  const loadRecentSearches = () => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        recentSearches.value = JSON.parse(saved);
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      results.value = [];
      return;
    }

    isSearching.value = true;
    query.value = searchQuery;

    try {
      // Simple search implementation - can be enhanced with fuzzy search
      const normalizedQuery = searchQuery.toLowerCase().trim();
      const searchResults = searchIndex.value.filter(item => {
        const searchableText = `${item.title} ${item.description} ${item.tags.join(' ')} ${item.category}`.toLowerCase();
        return searchableText.includes(normalizedQuery);
      });

      // Sort by relevance (simple implementation)
      searchResults.sort((a, b) => {
        const aScore = calculateRelevanceScore(a, normalizedQuery);
        const bScore = calculateRelevanceScore(b, normalizedQuery);
        return bScore - aScore;
      });

      results.value = searchResults;

      // Add to recent searches
      addToRecentSearches(searchQuery);
    } catch (error) {
      console.error('Search error:', error);
      results.value = [];
    } finally {
      isSearching.value = false;
    }
  };

  const calculateRelevanceScore = (item: SearchItem, query: string): number => {
    let score = 0;
    const normalizedQuery = query.toLowerCase();

    // Title matches are worth more
    if (item.title.toLowerCase().includes(normalizedQuery)) {
      score += 10;
    }

    // Category matches
    if (item.category.toLowerCase().includes(normalizedQuery)) {
      score += 5;
    }

    // Tag matches
    item.tags.forEach(tag => {
      if (tag.toLowerCase().includes(normalizedQuery)) {
        score += 3;
      }
    });

    // Description matches
    if (item.description.toLowerCase().includes(normalizedQuery)) {
      score += 1;
    }

    // Priority boost
    score += item.priority;

    return score;
  };

  const getByCategory = (category: string) => {
    return searchIndex.value.filter(item =>
      item.category.toLowerCase().includes(category.toLowerCase())
    );
  };

  const getByType = (type: string) => {
    return searchIndex.value.filter(item => item.type === type);
  };

  // Initialize on store creation
  loadRecentSearches();

  return {
    // State
    query,
    results,
    recentSearches,
    isSearching,
    showSearchOverlay,
    selectedFilters,
    searchHistory,
    searchIndex,

    // Computed
    hasResults,
    isSearchActive,
    filteredResults,
    suggestions,

    // Actions
    setSearchQuery,
    setSearchResults,
    addToRecentSearches,
    clearRecentSearches,
    setSearchOverlay,
    updateFilters,
    clearFilters,
    initializeSearchIndex,
    performSearch,
    getByCategory,
    getByType,
  };
});