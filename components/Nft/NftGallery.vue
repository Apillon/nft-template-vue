<template>
  <div v-if="nfts.length" class="grid grid-cols-nft gap-8">
    <NftCard v-for="(nft, key) in nfts" :key="key" :nft="nft" />
  </div>
  <div v-else-if="address && !loading" class="text-center">
    <p>You don`t have any NFTs</p>
  </div>
  <div v-else-if="!loading" class="text-center">
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
