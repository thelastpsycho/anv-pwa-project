<template>
  <div class="activities p-4">
    <PageHeader title="Activities & Experiences" />

    <div class="grid gap-6 pb-12 mb-12">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-anvaya-gray/10 dark:border-gray-700"
      >
        <div class="relative h-64">
          <img
            :src="activity.image"
            :alt="activity.title"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          ></div>
        </div>

        <div class="p-6">
          <h3
            class="text-xl font-medium text-anvaya-blue dark:text-anvaya-light mb-2"
          >
            {{ activity.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ activity.description }}
          </p>

          <div class="space-y-3">
            <div
              class="flex items-center gap-2 text-sm text-anvaya-blue/80 dark:text-anvaya-light/80"
            >
              <i class="mdi mdi-clock-outline"></i>
              <span>{{ activity.duration }}</span>
            </div>

            <div
              class="flex items-center gap-2 text-sm text-anvaya-blue/80 dark:text-anvaya-light/80"
            >
              <i class="mdi mdi-account-group-outline"></i>
              <span>{{ activity.groupSize }}</span>
            </div>
          </div>

          <button
            class="w-full mt-6 py-2.5 bg-anvaya-blue/10 dark:bg-anvaya-light/10 text-anvaya-blue dark:text-anvaya-light rounded-lg hover:bg-anvaya-blue/20 dark:hover:bg-anvaya-light/20 transition-colors font-medium"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import { activities } from "@/data/activities";
</script>

<style scoped>
.activities {
  min-height: calc(100vh - 64px); /* Adjust based on your navbar height */
}
</style>
