<template>
  <div :id="'nft_' + nft.id" class="nft">
    <div class="relative">
      <img :src="nft.image" class="nft_img" :alt="nft.name" />
      <div class="absolute tags">
        <Tag v-if="state.isCollectionNestable">Nestable</Tag>
      </div>
      <div class="absolute pending-children">
        <NftPendingChildren v-if="pendingChildren" :nft-id="nft.id" />
      </div>
    </div>
    <div class="nft_content">
      <div class="flex justify-between">
        <h3>{{ nft.name }}</h3>
        <h3 class="nowrap">ID: {{ nft.id }}</h3>
      </div>
      <p>{{ nft.description }}</p>
      <button v-if="isNestable && isMyNFT" @click="showModalNft()">Open NFT</button>
      <button
        v-if="isNestable && isMyNFT && nftId !== nft.id"
        @click="router.push(`/nft/${nft.id}`)"
      >
        Open NFT
      </button>
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
  pendingChildren: { type: Boolean, default: false },
});
const { params } = useRoute();
const router = useRouter();
const { state } = useNft();

const nftId = ref<number>(params?.id ? parseInt(`${params?.id}`) : 0);

const isMyNFT = computed(() => {
  return state.myNFTs.includes(props.nft.id);
});

const isModalNftVisible = ref<boolean>(false);
const showModalNft = () => {
  isModalNftVisible.value = false;
  setTimeout(() => (isModalNftVisible.value = true), 1);
};
</script>
