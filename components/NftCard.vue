<template>
  <div :id="'nft_' + id" class="nft">
    <img :src="nft.image" class="nft_img" :alt="nft.name" />
    <div class="nft_content">
      <h3>{{ nft.name || `#${id}` }}</h3>
      <p>{{ nft.description }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  id: { type: Number, default: 0 },
  nft: { type: Object as VuePropType<Nft>, required: true },
});
</script>
