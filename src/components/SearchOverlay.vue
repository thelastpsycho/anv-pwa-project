<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="searchStore.showSearchOverlay" class="search-overlay">
        <div class="search-overlay__backdrop" @click="closeSearch"></div>

        <div class="search-overlay__content">
          <div class="search-overlay__header">
            <div class="search-input__container">
              <i class="mdi mdi-magnify search-input__icon"></i>
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                placeholder="Search restaurants, activities, wellness..."
                class="search-input"
                @input="handleSearchInput"
                @keydown.down="navigateResults('down')"
                @keydown.up="navigateResults('up')"
                @keydown.enter="handleEnter"
                @keydown.escape="closeSearch"
              />
              <button v-if="searchQuery" class="search-input__clear" @click="clearSearch">
                <i class="mdi mdi-close"></i>
              </button>
            </div>
            <button class="search-overlay__close" @click="closeSearch">
              <i class="mdi mdi-close"></i>
            </button>
          </div>

          <!-- Search Suggestions -->
          <div v-if="showSuggestions && searchQuery" class="search-suggestions">
            <div class="search-suggestions__section">
              <h3 class="search-suggestions__title">Suggestions</h3>
              <div
                v-for="(suggestion, index) in searchStore.suggestions"
                :key="index"
                class="search-suggestion"
                :class="{ 'search-suggestion--selected': selectedSuggestionIndex === index }"
                @click="selectSuggestion(suggestion)"
                @mouseenter="selectedSuggestionIndex = index"
              >
                <i
                  :class="[
                    'search-suggestion__icon',
                    suggestion.type === 'recent' ? 'mdi mdi-history' : 'mdi mdi-tag'
                  ]"
                ></i>
                <span class="search-suggestion__text">{{ suggestion.text }}</span>
              </div>
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="searchStore.hasResults && !showSuggestions" class="search-results">
            <!-- Recent Searches -->
            <div v-if="!searchQuery && searchStore.recentSearches.length > 0" class="search-results__section">
              <div class="search-results__header">
                <h3 class="search-results__title">Recent Searches</h3>
                <button class="search-results__clear" @click="searchStore.clearRecentSearches">
                  Clear
                </button>
              </div>
              <div class="recent-searches">
                <span
                  v-for="(search, index) in searchStore.recentSearches"
                  :key="index"
                  class="recent-search"
                  @click="selectRecentSearch(search)"
                >
                  {{ search }}
                </span>
              </div>
            </div>

            <!-- Filtered Results -->
            <div v-if="searchQuery && searchStore.filteredResults.length > 0">
              <div class="search-results__header">
                <h3 class="search-results__title">
                  {{ searchStore.filteredResults.length }} Results
                </h3>
                <button class="search-results__filter" @click="toggleFilters">
                  <i class="mdi mdi-filter-variant"></i>
                  Filters
                </button>
              </div>

              <!-- Results by Category -->
              <div v-for="category in groupedResults" :key="category.name" class="search-results__category">
                <h4 class="search-results__category-title">{{ category.name }}</h4>
                <div class="search-results__items">
                  <div
                    v-for="item in category.items"
                    :key="item.id"
                    class="search-result-item"
                    :class="{ 'search-result-item--selected': selectedResultIndex === getItemIndex(item) }"
                    @click="selectResult(item)"
                    @mouseenter="selectedResultIndex = getItemIndex(item)"
                  >
                    <img
                      v-if="item.imageUrl"
                      :src="item.imageUrl"
                      :alt="item.title"
                      class="search-result-item__image"
                    />
                    <div v-else class="search-result-item__placeholder">
                      <i :class="getItemIcon(item.type)"></i>
                    </div>
                    <div class="search-result-item__content">
                      <h5 class="search-result-item__title">{{ item.title }}</h5>
                      <p class="search-result-item__description">{{ item.description }}</p>
                      <div class="search-result-item__meta">
                        <span class="search-result-item__category">{{ item.category }}</span>
                        <span v-if="item.metadata.time" class="search-result-item__time">
                          <i class="mdi mdi-clock-outline"></i>
                          {{ item.metadata.time }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div v-if="searchQuery && !searchStore.hasResults && !searchStore.isSearching" class="search-no-results">
            <i class="mdi mdi-magnify search-no-results__icon"></i>
            <h3 class="search-no-results__title">No results found</h3>
            <p class="search-no-results__text">
              Try searching for "restaurant", "spa", "activity", or "map"
            </p>
          </div>

          <!-- Loading State -->
          <div v-if="searchStore.isSearching" class="search-loading">
            <div class="search-loading__spinner"></div>
            <p class="search-loading__text">Searching...</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchStore } from '@/stores/search';
import type { SearchItem, SearchSuggestion } from '@/types/search';

const router = useRouter();
const searchStore = useSearchStore();

const searchQuery = ref('');
const searchInput = ref<HTMLInputElement>();
const selectedSuggestionIndex = ref(-1);
const selectedResultIndex = ref(-1);
const showSuggestions = ref(false);
const debounceTimeout = ref<number | undefined>();

const groupedResults = computed(() => {
  const results = searchStore.filteredResults;
  const groups = results.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  return Object.entries(groups).map(([name, items]) => ({
    name,
    items
  }));
});

const closeSearch = () => {
  searchStore.setSearchOverlay(false);
  searchQuery.value = '';
  selectedSuggestionIndex.value = -1;
  selectedResultIndex.value = -1;
  showSuggestions.value = false;
};

const clearSearch = () => {
  searchQuery.value = '';
  searchStore.setSearchQuery('');
  searchStore.setSearchResults([]);
  selectedSuggestionIndex.value = -1;
  selectedResultIndex.value = -1;
  showSuggestions.value = false;
  nextTick(() => {
    searchInput.value?.focus();
  });
};

const handleSearchInput = () => {
  clearTimeout(debounceTimeout.value);

  searchStore.setSearchQuery(searchQuery.value);

  if (searchQuery.value.length > 0) {
    showSuggestions.value = true;
    selectedSuggestionIndex.value = -1;

    debounceTimeout.value = window.setTimeout(() => {
      performSearch();
    }, 300);
  } else {
    showSuggestions.value = false;
    searchStore.setSearchResults([]);
  }
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) return;

  await searchStore.performSearch(searchQuery.value);
  showSuggestions.value = false;
  selectedResultIndex.value = -1;
};

const selectSuggestion = (suggestion: SearchSuggestion) => {
  searchQuery.value = suggestion.text;
  performSearch();
};

const selectRecentSearch = (search: string) => {
  searchQuery.value = search;
  performSearch();
};

const selectResult = (item: SearchItem) => {
  searchStore.addToRecentSearches(item.title);
  closeSearch();
  router.push(item.route);
};

const navigateResults = (direction: 'up' | 'down') => {
  if (showSuggestions.value) {
    const suggestions = searchStore.suggestions;
    if (direction === 'down') {
      selectedSuggestionIndex.value = Math.min(
        selectedSuggestionIndex.value + 1,
        suggestions.length - 1
      );
    } else {
      selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, -1);
    }
  } else {
    const results = searchStore.filteredResults;
    if (direction === 'down') {
      selectedResultIndex.value = Math.min(
        selectedResultIndex.value + 1,
        results.length - 1
      );
    } else {
      selectedResultIndex.value = Math.max(selectedResultIndex.value - 1, -1);
    }
  }
};

const handleEnter = () => {
  if (showSuggestions.value && selectedSuggestionIndex.value >= 0) {
    const suggestion = searchStore.suggestions[selectedSuggestionIndex.value];
    selectSuggestion(suggestion);
  } else if (!showSuggestions.value && selectedResultIndex.value >= 0) {
    const result = searchStore.filteredResults[selectedResultIndex.value];
    selectResult(result);
  } else if (searchQuery.value) {
    performSearch();
  }
};

const getItemIndex = (item: SearchItem) => {
  return searchStore.filteredResults.findIndex(r => r.id === item.id);
};

const getItemIcon = (type: string) => {
  const icons = {
    dining: 'mdi mdi-silverware-fork-knife',
    activity: 'mdi mdi-run',
    wellness: 'mdi mdi-spa',
    amenity: 'mdi mdi-home-outline',
    attraction: 'mdi mdi-map-marker',
    faq: 'mdi mdi-help-circle',
    promotion: 'mdi mdi-tag-outline',
    map: 'mdi mdi-map',
    event: 'mdi mdi-calendar'
  };
  return icons[type as keyof typeof icons] || 'mdi mdi-help-circle';
};

const toggleFilters = () => {
  // Filter functionality can be implemented later
  console.log('Toggle filters');
};

// Focus input when overlay opens
watch(() => searchStore.showSearchOverlay, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      searchInput.value?.focus();
    });
  }
});

// Clear debounce timeout on unmount
onUnmounted(() => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }
});
</script>

<style scoped>
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.search-overlay__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.search-overlay__content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  max-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
}

.search-overlay__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.search-input__container {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  gap: 0.5rem;
}

.search-input__icon {
  color: #6b7280;
  font-size: 1.25rem;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 1rem;
  color: #1f2937;
}

.search-input__clear {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.search-input__clear:hover {
  background: #e5e7eb;
}

.search-overlay__close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-size: 1.5rem;
}

.search-overlay__close:hover {
  background: #f3f4f6;
}

.search-suggestions {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.search-suggestions__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.search-suggestion {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-suggestion:hover {
  background: #f3f4f6;
}

.search-suggestion--selected {
  background: #e5e7eb;
}

.search-suggestion__icon {
  color: #6b7280;
  font-size: 1.125rem;
}

.search-suggestion__text {
  color: #1f2937;
  font-weight: 500;
}

.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.search-results__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.search-results__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.search-results__clear,
.search-results__filter {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.search-results__clear:hover,
.search-results__filter:hover {
  background: #f3f4f6;
}

.search-results__category {
  margin-bottom: 1.5rem;
}

.search-results__category-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.search-results__items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search-result-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.search-result-item:hover {
  background: #f9fafb;
  border-color: #e5e7eb;
}

.search-result-item--selected {
  background: #eff6ff;
  border-color: #3b82f6;
}

.search-result-item__image,
.search-result-item__placeholder {
  width: 3rem;
  height: 3rem;
  border-radius: 0.375rem;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.search-result-item__image {
  object-fit: cover;
}

.search-result-item__placeholder i {
  font-size: 1.5rem;
  color: #9ca3af;
}

.search-result-item__content {
  flex: 1;
  min-width: 0;
}

.search-result-item__title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-result-item__description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-result-item__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.search-result-item__category {
  background: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.search-result-item__time {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.recent-searches {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.recent-search {
  background: #f3f4f6;
  color: #4b5563;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recent-search:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.search-no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.search-no-results__icon {
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.search-no-results__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.search-no-results__text {
  color: #6b7280;
  font-size: 0.875rem;
}

.search-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}

.search-loading__spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.search-loading__text {
  color: #6b7280;
  font-size: 0.875rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.overlay-enter-active .search-overlay__content,
.overlay-leave-active .search-overlay__content {
  transition: transform 0.3s ease;
}

.overlay-enter-from .search-overlay__content,
.overlay-leave-to .search-overlay__content {
  transform: translateY(-100%);
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .search-overlay__content {
    background: #1f2937;
  }

  .search-input__container {
    background: #374151;
  }

  .search-input {
    color: #f9fafb;
  }

  .search-input__icon,
  .search-input__clear,
  .search-overlay__close {
    color: #9ca3af;
  }

  .search-input__clear:hover,
  .search-overlay__close:hover {
    background: #4b5563;
  }

  .search-overlay__header {
    border-bottom-color: #374151;
  }

  .search-suggestions__title {
    color: #9ca3af;
  }

  .search-suggestion:hover {
    background: #374151;
  }

  .search-suggestion--selected {
    background: #4b5563;
  }

  .search-suggestion__text {
    color: #f9fafb;
  }

  .search-results__title {
    color: #f9fafb;
  }

  .search-results__clear,
  .search-results__filter {
    color: #9ca3af;
  }

  .search-results__clear:hover,
  .search-results__filter:hover {
    background: #374151;
  }

  .search-results__category-title {
    color: #e5e7eb;
  }

  .search-result-item:hover {
    background: #374151;
    border-color: #4b5563;
  }

  .search-result-item--selected {
    background: #1e3a8a;
    border-color: #3b82f6;
  }

  .search-result-item__placeholder {
    background: #374151;
  }

  .search-result-item__placeholder i {
    color: #6b7280;
  }

  .search-result-item__title {
    color: #f9fafb;
  }

  .search-result-item__description {
    color: #9ca3af;
  }

  .search-result-item__category {
    background: #374151;
    color: #d1d5db;
  }

  .recent-search {
    background: #374151;
    color: #d1d5db;
  }

  .recent-search:hover {
    background: #4b5563;
    color: #f9fafb;
  }

  .search-no-results__icon {
    color: #4b5563;
  }

  .search-no-results__title {
    color: #f9fafb;
  }

  .search-no-results__text {
    color: #9ca3af;
  }

  .search-loading__text {
    color: #9ca3af;
  }
}
</style>