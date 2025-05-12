<template>
  <div :id="'nft_' + nft.id" class="nft">
    <div class="relative">
      <img :src="imageLink(nft.image)" class="nft_img" :alt="nft.name" />
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
      <button
        v-if="state.isCollectionNestable && isMyNFT && nftId !== nft.id && open"
        @click="router.push(`/nft/${nft.id}`)"
      >
        Open NFT
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  nft: { type: Object as PropType<Nft>, required: true },
  open: { type: Boolean, default: true },
  pendingChildren: { type: Boolean, default: false },
});
const { params } = useRoute();
const router = useRouter();
const { state } = useNft();

const nftId = ref<number>(params?.id ? parseInt(`${params?.id}`) : 0);

const isMyNFT = computed(() => {
  return state.myNftIDs.includes(props.nft.id);
});
</script>
