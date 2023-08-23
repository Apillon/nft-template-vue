<template>
  <div :id="'nft_' + nft.id" class="nft">
    <img :src="nft.image" class="nft_img" :alt="nft.name" />
    <div class="nft_content">
      <h3>{{ nft.name || `#${nft.id}` }}</h3>
      <p>{{ nft.description }}</p>
      <button v-if="isNestable && isMyNFT" @click="showModalNft()">Open NFT</button>
    </div>
  </div>
  <Modal v-if="isNestable && isMyNFT" :show="isModalNftVisible" title="">
    <NftNestable :nft="nft" />
  </Modal>
</template>

<script lang="ts" setup>
const props = defineProps({
  nft: { type: Object as VuePropType<Nft>, required: true },
  isNestable: { type: Boolean, default: false },
});

const { state } = useNft();
const isMyNFT = computed(() => {
  return state.myNFTs.includes(props.nft.id);
});

const isModalNftVisible = ref<boolean>(false);
const showModalNft = () => {
  isModalNftVisible.value = false;
  setTimeout(() => (isModalNftVisible.value = true), 1);
};
</script>
