<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-anvaya-gray/10 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
  >
    <div class="relative">
      <img :src="image" :alt="title" class="w-full h-64 object-cover" />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
      ></div>
    </div>
    <div class="p-6">
      <h3
        class="text-xl font-medium text-anvaya-blue dark:text-anvaya-light mb-2"
      >
        {{ title }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        {{ description }}
      </p>
      <slot></slot>
    </div>
  </div>
</template>
