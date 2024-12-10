<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import SakantiLogo from "@/assets/Sakanti Spa.svg";
</script>

<template>
  <div class="wellness pt-4 px-4 mb-4">
    <PageHeader title="Wellness & Spa" />

    <div class="bg-white rounded-xl overflow-hidden shadow-lg">
      <div class="relative">
        <img
          src="https://www.theanvayabali.com/wp-content/uploads/2023/02/Sakanti_Spa_Bed_21050x700.jpg"
          alt="Sakanti Spa"
          class="w-full h-64 object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
        ></div>
      </div>

      <div class="p-6">
        <img :src="SakantiLogo" alt="Sakanti Spa Logo" class="h-12 mb-4" />

        <div class="space-y-4 text-gray-600">
          <p class="italic text-anvaya-blue">
            "Sakanti is an ancient sanskrit word meaning 'the beautiful sheen of
            a woman's child'"
          </p>

          <p>
            Sakanti Spa offers an oasis of serenity on the Island of the Gods –
            the ultimate barefoot sanctuary for Spa and Beauty rituals on this
            mystical island.
          </p>

          <div class="space-y-2 text-sm">
            <div class="flex items-center text-anvaya-blue">
              <i class="mdi mdi-clock-outline mr-2"></i>
              <span>Operation hours: 9 a.m. to 9 p.m.</span>
            </div>
          </div>

          <button
            class="w-full mt-4 py-2.5 bg-anvaya-blue text-white rounded-lg hover:bg-anvaya-blue/90 transition-colors font-medium"
          >
            Book Treatment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
