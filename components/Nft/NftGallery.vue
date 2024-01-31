<template>
  <div v-if="nfts.length" class="grid">
    <NftCard v-for="(nft, key) in nfts" :key="key" :nft="nft" />
  </div>
  <div v-else-if="address && !loading" class="loading_box">
    <p>You don`t have any NFTs</p>
  </div>
  <div v-else-if="!loading" class="loading_box">
    <p>No NFTs, they must be minted first.</p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  address: { type: String, default: '' },
  nfts: { type: Array<Nft>, required: true },
  loading: { type: Boolean, default: false },
});
</script>
