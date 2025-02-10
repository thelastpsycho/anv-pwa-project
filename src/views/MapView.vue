<template>
  <div class="map-view pb-12">
    <PageHeader title="Resort Map" />
    <div class="px-4 mb-12">
      <ResortMap />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import ResortMap from "@/components/ResortMap.vue";
</script>
