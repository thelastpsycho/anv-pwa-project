<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import { offers } from "@/data/offers";
</script>

<template>
  <div class="events px-4 pb-12 mb-12 mt-4">
    <PageHeader title="What's On" />

    <div class="grid gap-6">
      <div
        v-for="offer in offers"
        :key="offer.id"
        class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-anvaya-gray/10 dark:border-gray-700"
      >
        <div class="relative h-48">
          <img
            :src="offer.image"
            :alt="offer.title"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          ></div>
          <div class="absolute top-4 right-4">
            <span
              class="px-2 py-1 bg-anvaya-blue/90 text-white text-xs rounded-full"
            >
              {{ offer.date }}
            </span>
          </div>
        </div>

        <div class="p-6">
          <h3
            class="text-xl font-medium text-anvaya-blue dark:text-anvaya-light mb-2"
          >
            {{ offer.title }}
          </h3>

          <div
            v-if="offer.price"
            class="text-anvaya-blue dark:text-anvaya-light font-medium mb-4"
          >
            {{ offer.price }}
          </div>

          <div v-if="offer.details" class="space-y-2 mb-6">
            <div
              v-for="(detail, index) in offer.details"
              :key="index"
              class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <i
                class="mdi mdi-check text-anvaya-blue dark:text-anvaya-light mt-0.5"
              ></i>
              <span>{{ detail }}</span>
            </div>
          </div>

          <button
            class="w-full py-2.5 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-lg hover:bg-anvaya-blue/20 dark:hover:bg-anvaya-light/20 transition-colors font-medium"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
