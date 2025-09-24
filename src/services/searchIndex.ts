import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { SearchItem } from '@/types/search';
import type { DiningVenue } from '@/types/dining';
import type { Activity } from '@/types/activities';
import type { WellnessService } from '@/types/wellness';

// Import other types as needed
// import type { Amenity } from '@/types/amenities';
// import type { Attraction } from '@/types/attractions';
// import type { FAQ } from '@/types/faqs';

export class SearchIndexService {
  private static instance: SearchIndexService;
  private searchIndex: SearchItem[] = [];

  private constructor() {}

  static getInstance(): SearchIndexService {
    if (!SearchIndexService.instance) {
      SearchIndexService.instance = new SearchIndexService();
    }
    return SearchIndexService.instance;
  }

  async buildSearchIndex(): Promise<SearchItem[]> {
    const searchItems: SearchItem[] = [];

    try {
      // Index dining venues
      const diningSnapshot = await getDocs(collection(db, 'dining'));
      diningSnapshot.forEach(doc => {
        const venue = doc.data() as DiningVenue;
        searchItems.push(this.createDiningSearchItem(venue, doc.id));
      });

      // Index activities
      const activitiesSnapshot = await getDocs(collection(db, 'activities'));
      activitiesSnapshot.forEach(doc => {
        const activity = doc.data() as Activity;
        searchItems.push(this.createActivitySearchItem(activity, doc.id));
      });

      // Index wellness services
      const wellnessSnapshot = await getDocs(collection(db, 'wellness'));
      wellnessSnapshot.forEach(doc => {
        const service = doc.data() as WellnessService;
        searchItems.push(this.createWellnessSearchItem(service, doc.id));
      });

      // Add more data sources as needed
      // searchItems.push(...await this.indexAmenities());
      // searchItems.push(...await this.indexAttractions());
      // searchItems.push(...await this.indexFAQs());
      // searchItems.push(...await this.indexPromotions());

      // Add static search items
      searchItems.push(...this.getStaticSearchItems());

      this.searchIndex = searchItems;
      return searchItems;
    } catch (error) {
      console.error('Error building search index:', error);
      return [];
    }
  }

  private createDiningSearchItem(venue: DiningVenue, id: string): SearchItem {
    return {
      id: `dining-${id}`,
      type: 'dining',
      title: venue.name,
      description: venue.description,
      category: venue.cuisine,
      tags: this.extractTags(venue.name + ' ' + venue.description + ' ' + venue.cuisine),
      searchableText: `${venue.name} ${venue.description} ${venue.cuisine} ${venue.hours} ${venue.dress}`,
      route: `/restaurant#${id}`,
      imageUrl: venue.image,
      priority: 8, // High priority for dining
      metadata: {
        hours: venue.hours,
        dress: venue.dress,
        capacity: venue.capacity,
        cuisine: venue.cuisine
      }
    };
  }

  private createActivitySearchItem(activity: Activity, id: string): SearchItem {
    return {
      id: `activity-${id}`,
      type: 'activity',
      title: activity.title,
      description: activity.description,
      category: activity.category,
      tags: this.extractTags(activity.title + ' ' + activity.description + ' ' + activity.category),
      searchableText: `${activity.title} ${activity.description} ${activity.category} ${activity.time} ${activity.location}`,
      route: `/activities#${id}`,
      imageUrl: activity.image,
      priority: 7,
      metadata: {
        time: activity.time,
        location: activity.location,
        duration: activity.duration,
        weekdays: activity.weekdays
      }
    };
  }

  private createWellnessSearchItem(service: WellnessService, id: string): SearchItem {
    return {
      id: `wellness-${id}`,
      type: 'wellness',
      title: service.title,
      description: service.description,
      category: 'Spa & Wellness',
      tags: this.extractTags(service.title + ' ' + service.description),
      searchableText: `${service.title} ${service.description} ${service.operatingHours}`,
      route: `/wellness#${id}`,
      imageUrl: service.image,
      priority: 6,
      metadata: {
        operatingHours: service.operatingHours,
        hasBooking: service.hasBooking
      }
    };
  }

  private getStaticSearchItems(): SearchItem[] {
    return [
      {
        id: 'map-resort',
        type: 'map',
        title: 'Resort Map',
        description: 'Interactive map of the resort with all facilities and locations',
        category: 'Navigation',
        tags: ['map', 'navigation', 'resort', 'facilities'],
        searchableText: 'resort map navigation facilities locations',
        route: '/map',
        priority: 5,
        metadata: {}
      },
      {
        id: 'chat-support',
        type: 'faq',
        title: 'Guest Support',
        description: '24/7 customer support and assistance',
        category: 'Support',
        tags: ['support', 'help', 'chat', 'assistance'],
        searchableText: 'guest support help chat assistance 24/7',
        route: '/chat',
        priority: 4,
        metadata: {}
      },
      {
        id: 'events-calendar',
        type: 'event',
        title: 'Events & Activities',
        description: 'Current and upcoming events at the resort',
        category: 'Entertainment',
        tags: ['events', 'activities', 'entertainment', 'calendar'],
        searchableText: 'events activities entertainment calendar',
        route: '/events',
        priority: 4,
        metadata: {}
      }
    ];
  }

  private extractTags(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter((word, index, self) => self.indexOf(word) === index)
      .slice(0, 10); // Limit to 10 tags per item
  }

  getIndex(): SearchItem[] {
    return this.searchIndex;
  }

  search(query: string, filters?: any): SearchItem[] {
    if (!query.trim()) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    return this.searchIndex.filter(item => {
      // Search in title, description, tags, and searchable text
      const searchableText = `${item.title} ${item.description} ${item.tags.join(' ')} ${item.searchableText}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }

  getSuggestions(query: string, limit: number = 5): string[] {
    if (!query.trim()) {
      return [];
    }

    const normalizedQuery = query.toLowerCase();
    const suggestions = new Set<string>();

    this.searchIndex.forEach(item => {
      // Title suggestions
      if (item.title.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(item.title);
      }

      // Category suggestions
      if (item.category.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(item.category);
      }

      // Tag suggestions
      item.tags.forEach(tag => {
        if (tag.toLowerCase().includes(normalizedQuery)) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }

  async initializeSearchIndex() {
    try {
      const index = await this.buildSearchIndex();
      console.log(`Search index built with ${index.length} items`);
      return index;
    } catch (error) {
      console.error('Failed to initialize search index:', error);
      return [];
    }
  }
}

// Export singleton instance
export const searchIndexService = SearchIndexService.getInstance();