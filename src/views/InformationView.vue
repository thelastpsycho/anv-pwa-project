<template>
  <div class="information px-4 pb-12 my-12">
    <PageHeader title="Information" />

    <!-- Tabs -->
    <div class="mb-6">
      <div class="flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors',
            activeTab === tab.id
              ? 'bg-anvaya-blue text-white'
              : 'bg-anvaya-blue/10 text-anvaya-blue hover:bg-anvaya-blue/20'
          ]"
          @click="handleTabClick(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- FAQ Tab Content -->
    <div v-if="activeTab === 'faq'" class="space-y-6">
      <!-- Search Bar -->
      <div class="mb-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search information..."
            class="w-full px-4 py-2.5 pl-10 bg-white dark:bg-gray-800 rounded-xl border border-anvaya-gray/10 dark:border-gray-700 focus:outline-none focus:border-anvaya-blue/30 dark:focus:border-anvaya-light/30 text-sm dark:text-anvaya-light"
          />
          <i class="mdi mdi-magnify absolute left-3.5 top-2.5 text-anvaya-blue/60 dark:text-anvaya-light/60 text-lg"></i>
        </div>
      </div>

      <!-- FAQ List -->
      <div class="space-y-4">
        <div v-if="filteredFAQs.length === 0" class="text-center text-gray-500 dark:text-anvaya-light py-8">
          <p v-if="searchQuery">No FAQs found matching your search.</p>
          <p v-else>Loading FAQs...</p>
        </div>
        <div
          v-for="item in filteredFAQs"
          :key="item.id"
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
        >
          <h3 class="font-medium text-anvaya-blue dark:text-anvaya-light mb-2">
            {{ item.question }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400" v-html="linkify(item.answer)"></p>
          <div class="mt-2 flex items-center gap-2">
            <span class="text-xs px-2 py-0.5 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-full">
              {{ item.category }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- TV Channel List Tab Content -->
    <div v-else-if="activeTab === 'tv'" class="space-y-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-anvaya-gray/10 dark:border-gray-700">
        <h3 class="text-base font-medium text-anvaya-blue dark:text-anvaya-light mb-4">TV Channel List</h3>
        <!-- TV Channel Search Bar -->
        <div class="mb-4">
          <div class="relative">
            <input
              v-model="tvSearchQuery"
              type="text"
              placeholder="Search channel..."
              class="w-full px-4 py-2.5 pl-10 bg-white dark:bg-gray-800 rounded-xl border border-anvaya-gray/10 dark:border-gray-700 focus:outline-none focus:border-anvaya-blue/30 dark:focus:border-anvaya-light/30 text-sm dark:text-anvaya-light"
            />
            <i class="mdi mdi-magnify absolute left-3.5 top-2.5 text-anvaya-blue/60 dark:text-anvaya-light/60 text-lg"></i>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-xs text-left text-anvaya-blue dark:text-anvaya-light">
            <thead>
              <tr class="border-b border-anvaya-gray/10 dark:border-gray-700">
                <th class="px-2 py-1 font-semibold">Channel</th>
                <th class="px-2 py-1 font-semibold">Channel Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="channel in filteredTvChannels" :key="channel.number" class="border-b border-anvaya-gray/10 dark:border-gray-700">
                <td class="px-2 py-1">{{ channel.number }}</td>
                <td class="px-2 py-1">{{ channel.name }}</td>
              </tr>
              <tr v-if="filteredTvChannels.length === 0">
                <td colspan="2" class="text-center text-gray-500 dark:text-anvaya-light py-4">No channels found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Safety and Security Tab Content -->
    <div v-else-if="activeTab === 'safety'" class="space-y-4">
      <!-- Introduction -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-anvaya-gray/10 dark:border-gray-700">
        <h3 class="text-base font-medium text-anvaya-blue dark:text-anvaya-light mb-2">Safety & Precaution</h3>
        <p class="text-xs text-anvaya-blue dark:text-anvaya-light font-light italic">
          We advise keeping in mind these recommendations for the safety and convenience of our guests while staying in the resort.
        </p>
      </div>

      <!-- Emergency Contacts -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-anvaya-gray/10 dark:border-gray-700">
        <h3 class="text-base font-medium text-anvaya-blue dark:text-anvaya-light mb-2">Emergency Contacts</h3>
        <div class="space-y-2 text-xs text-anvaya-blue dark:text-anvaya-light">
          <p class="text-xs">
            <i class="mdi mdi-phone mr-2"></i>
            Reception: 0
          </p>
          <p class="text-xs">
            <i class="mdi mdi-phone mr-2"></i>
            Security: 118
          </p>
          <p class="text-xs">
            <i class="mdi mdi-phone mr-2"></i>
            Medical Emergency: 115
          </p>
        </div>
      </div>

      <!-- Emergency Guidelines -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-anvaya-gray/10 dark:border-gray-700">
        <h3 class="text-base font-medium text-anvaya-blue dark:text-anvaya-light mb-2">Your Guide to Safety</h3>
        <div class="space-y-3 text-xs text-anvaya-blue dark:text-anvaya-light">
          <div>
            <h4 class="font-medium mb-1.5">In Case of Emergency</h4>
            <ul class="custom-list font-light">
              <li>Leave the building by the nearest exit</li>
              <li>Don't use the lift, use the stairway</li>
              <li>Don't bring your personal belongings</li>
              <li>Report to your assembly point as soon as possible</li>
              <li>Don't return to the building until authorized to do so</li>
              <li>Follow the instructions at the assembly point</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium mb-1.5">Natural Disasters</h4>
            <ul class="custom-list font-light">
              <li>During an earthquake, find a safe place and protect your head and neck until the shaking stops</li>
              <li>If a tsunami occurs, immediately move to higher ground or further inland for safety</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Safety Recommendations -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-anvaya-gray/10 dark:border-gray-700">
        <h3 class="text-base font-medium text-anvaya-blue dark:text-anvaya-light mb-2">Safety Recommendations</h3>
        <ul class="text-xs text-anvaya-blue dark:text-anvaya-light font-light custom-list">
          <li>Avoid opening your door before confirming the visitor's identity. Call our front desk by dialling '0' from your room phone if you do not recognize the visitors</li>
          <li>Close the door firmly and place all your valuable items inside the hotel safe deposit box</li>
          <li>To prevent insects and humidity in the room, make sure that your room door, any sliding glass door, and any adjoining room doors are shut</li>
          <li>Please do not hang clothes on the balcony</li>
          <li>Do not invite strangers to your room</li>
          <li>Be aware of potential phone scams and prank calls to room. We never request credit card or personal information over the phone</li>
          <li>When arriving back to our hotel late at night, be cautious, remain in well-lit areas, and utilize the main door</li>
          <li>Take a moment to locate the nearest exit that might be used in an emergency</li>
          <li>Inform our staff member or the hotel operator if you notice any suspicious activity</li>
        </ul>
      </div>
    </div>

    <!-- Things to Know Tab Content -->
    <div v-else-if="activeTab === 'info'" class="space-y-4">
      <!-- Do's Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-anvaya-gray/10 dark:border-gray-700">
        <h3 class="text-base font-medium text-anvaya-blue dark:text-anvaya-light mb-2">Do's</h3>
        <ul class="text-xs text-anvaya-blue dark:text-anvaya-light font-light custom-list">
          <li>Keep noise levels to a minimum, especially during late hours</li>
          <li>Respect the privacy and property of other guests</li>
          <li>Follow any designated smoking areas and policies</li>
          <li>Utilize hotel amenities responsibly</li>
          <li>Notify staff of any maintenance issues or concerns in your room</li>
          <li>Secure your valuables in the provided safety deposit box</li>
          <li>Adhere to check-out times to avoid additional charges</li>
          <li>Enjoy complimentary amenities provided by the hotel</li>
          <li>Use designated areas for parking and storing personal belongings</li>
          <li>Follow any specific guidelines provided by the hotel</li>
        </ul>
      </div>

      <!-- Don'ts Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-anvaya-gray/10 dark:border-gray-700">
        <h3 class="text-base font-medium text-anvaya-blue dark:text-anvaya-light mb-2">Don'ts</h3>
        <ul class="text-xs text-anvaya-blue dark:text-anvaya-light font-light custom-list">
          <li>Smoke in non-designated areas or rooms</li>
          <li>Bring pets into the hotel without prior approval</li>
          <li>Disturb other guests with excessive noise or behavior</li>
          <li>Remove hotel property from the premises</li>
          <li>Leave personal belongings unattended in public areas</li>
          <li>Tamper with fire safety equipment</li>
          <li>Bring outside food or beverages into prohibited areas</li>
          <li>Engage in illegal activities on hotel property</li>
          <li>Damage hotel property or furnishings</li>
          <li>Ignore hotel policies or staff instructions</li>
        </ul>
      </div>

      <!-- Additional Policies -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-anvaya-gray/10 dark:border-gray-700">
        <h3 class="text-base font-medium text-anvaya-blue dark:text-anvaya-light mb-2">Room & Amenities</h3>
        <div class="space-y-3 text-xs text-anvaya-blue dark:text-anvaya-light">
          <div>
            <h4 class="font-medium mb-1.5 text-xs">Room Amenities</h4>
            <p class="italic font-light">All in-room amenities such as Yukata, Bath towel, hairdryer are provided for your comfort. Please do not remove them from the room. Contact Duty Manager (ext. 0) for purchase inquiries.</p>
          </div>
          <div>
            <h4 class="font-medium mb-2">Room Convenience</h4>
            <p class="italic font-light">Please keep your room door and balcony closed to maintain room temperature, minimize mosquitos, and prevent humidity issues.</p>
          </div>
          <div>
            <h4 class="font-medium mb-2">Minibar</h4>
            <p class="italic font-light">Complimentary minibar provided during stay and refilled daily based on consumption.</p>
          </div>
        </div>
      </div>

      <!-- General Rules -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-anvaya-gray/10 dark:border-gray-700">
        <h3 class="text-base font-medium text-anvaya-blue dark:text-anvaya-light mb-2">General Rules</h3>
        <div class="space-y-3 text-xs text-anvaya-blue dark:text-anvaya-light">
          <div>
            <h4 class="font-medium mb-2 text-xs text-anvaya-blue dark:text-anvaya-light">Food and Beverage</h4>
            <p class="italic font-light">Outside food and beverages may not be consumed in public areas (Lobby Lounge, Pool Side, restaurants).</p>
          </div>
          <div>
            <h4 class="font-medium mb-2 text-xs text-anvaya-blue dark:text-anvaya-light">Property Damage</h4>
            <p class="italic font-light">Guests are responsible for covering costs of any damage to hotel property or room inventory.</p>
          </div>
          <div>
            <h4 class="font-medium mb-2 text-xs text-anvaya-blue dark:text-anvaya-light">Prohibited Items</h4>
            <p class="italic font-light">No pungent foods (e.g., durian), hazardous goods, weapons, drugs, or dangerous materials allowed on premises.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import PageHeader from "@/components/PageHeader.vue";
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { FAQCategory, FAQ } from "@/types/faqs";
import { useTvChannelsStore } from '@/stores/tvChannels';

const tabs = [
  { id: 'faq', label: 'FAQ' },
  { id: 'tv', label: 'TV Channel List' },
  { id: 'safety', label: 'Safety & Security' },
  { id: 'info', label: 'Things to Know' },
  { id: 'guide', label: 'Safe Travel Guide' }
];

const activeTab = ref('faq');
const searchQuery = ref("");
const faqs = ref<FAQ[]>([]);
const faqCategories = ref<FAQCategory[]>([]);

const tvChannelsStore = useTvChannelsStore();
const tvSearchQuery = ref("");
const filteredTvChannels = computed(() => {
  const query = tvSearchQuery.value.trim().toLowerCase();
  const sorted = [...tvChannelsStore.channels].sort((a, b) => a.number - b.number);
  if (!query) return sorted;
  return sorted.filter(
    c => c.name.toLowerCase().includes(query) || c.number.toString().includes(query)
  );
});

async function loadFAQs() {
  try {
    const querySnapshot = await getDocs(collection(db, "faqs"));
    faqCategories.value = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      faqs: doc.data().faqs || [],
    })) as unknown as FAQCategory[];
    faqs.value = faqCategories.value.reduce((allFaqs: FAQ[], category) => {
      return [...allFaqs, ...category.faqs];
    }, []);
  } catch (error) {
    console.error("Error loading FAQs:", error);
  }
}

const filteredFAQs = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return faqs.value.filter(
    item => 
      item.question.toLowerCase().includes(query) || 
      item.answer.toLowerCase().includes(query)
  );
});

// Turn plain URLs into clickable links. Keeps original text for non-URLs.
function linkify(text: string): string {
  if (!text) return "";
  const urlRegex = /(https?:\/\/[^\s)]+|www\.[^\s)]+)/gi;
  return text.replace(urlRegex, (match: string) => {
    const hasProtocol = /^https?:\/\//i.test(match);
    const href = hasProtocol ? match : `https://${match}`;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-anvaya-blue underline">${match}</a>`;
  });
}

function handleTabClick(tabId: string) {
  if (tabId === 'guide') {
    window.open('https://anvayabali.com/hotelinformation/buku_saku.html', '_blank');
  } else {
    activeTab.value = tabId;
    if (tabId === 'tv' && tvChannelsStore.channels.length === 0) {
      tvChannelsStore.loadChannels();
    }
  }
}

onMounted(() => {
  loadFAQs();
  if (activeTab.value === 'tv') {
    tvChannelsStore.loadChannels();
  }
});
</script>

<style scoped>
.information {
  min-height: calc(100vh - 64px);
}

.custom-list {
  list-style: none;
  padding-left: 1.25rem;
}

.custom-list li {
  position: relative;
  line-height: 1.75;
}

.custom-list li::before {
  content: "•";
  position: absolute;
  left: -1.25rem;
  color: #89a8b2; /* anvaya-blue */
}
</style>
  