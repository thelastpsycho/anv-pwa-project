<template>
  <div class="search-bar">
    <button
      class="relative flex flex-col items-center py-2 text-anvaya-blue/60 dark:text-gray-300 hover:text-anvaya-blue dark:hover:text-white transition-colors"
      :class="{
        '!text-anvaya-blue dark:!text-white': searchStore.showSearchOverlay,
        'search-active': searchStore.showSearchOverlay
      }"
      aria-label="Search"
      @click="openSearch"
    >
      <i class="mdi mdi-magnify text-2xl"></i>
      <span class="text-xs">Search</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '@/stores/search';
import { onMounted } from 'vue';

const searchStore = useSearchStore();

const openSearch = () => {
  console.log('Search button clicked');
  searchStore.setSearchOverlay(true);
};

onMounted(() => {
  console.log('SearchBar component mounted');
  console.log('Search store available:', !!searchStore);
});
</script>

<style scoped>
/* Active state indicator */
.search-bar button::before {
  content: '';
  @apply absolute top-0 left-0 right-0 h-0.5 bg-anvaya-blue transition-all duration-300 opacity-0;
}

.search-bar button.search-active::before {
  @apply opacity-100;
}

/* Responsive styles */
@media (min-width: 768px) {
  .search-bar button {
    @apply min-w-[64px];
  }

  .search-bar button span {
    @apply text-sm;
  }
}

@media (max-width: 360px) {
  .search-bar button span {
    font-size: 0.625rem;
  }
  .search-bar button i {
    font-size: 1.25rem;
  }
  .search-bar button {
    min-width: 56px;
  }
}
</style>