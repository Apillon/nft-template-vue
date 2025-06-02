<template>
  <div class="flex flex-col overflow-hidden rounded-lg bg-white">
    <div class="relative">
      <img :src="imageLink(nft.image)" class="w-full" :alt="nft.name" />
    </div>
    <div class="px-6 pb-6 pt-4">
      <div class="flex justify-between">
        <h3>{{ nft.name }}</h3>
        <h3 class="nowrap">ID: {{ nft.id }}</h3>
      </div>
      <p>{{ nft.description }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  nft: { type: Object as PropType<Nft>, required: true },
});
</script>
