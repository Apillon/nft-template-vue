<template>
  <div>
    <div
      class="relative flex flex-col justify-between gap-4 overflow-hidden rounded-xl bg-white p-8 text-center mobile:pt-14"
    >
      <CollectionInfo v-if="collectionInfo.name" :collection="collectionInfo" />

      <div class="absolute right-[10px] top-[10px] flex flex-col items-end">
        <ConnectWallet class="w-fit min-w-[134px]" />
      </div>
    </div>

    <div v-if="walletAddress && collectionInfo.name">
      <h2 class="text-center">Show:</h2>
      <div class="mx-auto mb-6 flex max-w-lg justify-center gap-x-2 gap-y-4">
        <FormSwitch v-model="myNfts" size="sm" text-off="All NFTs" text-on="My NFTs" />
      </div>
    </div>

    <div v-if="collectionInfo.name && connected">
      <h2 v-if="Number(collectionInfo.totalSupply) === 0" class="text-center">
        No NFTs, they must be minted first.
      </h2>
      <h2 v-else-if="state.filterByAddress && !nfts" class="text-center">
        You don`t have any NFTs
      </h2>

      <h2 v-else-if="!nfts" class="text-center">No NFTs, they must be minted first.</h2>
      <NftGallery
        v-else
        :address="walletAddress"
        :nfts="nfts"
        :loading="state.loadingNfts || state.loadingMyNfts"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { collectionInfo, getCollectionInfo } = useContract();
const { connected, walletAddress } = useWalletConnect();
const { state, getNfts, showNfts, showMyNfts } = useNft();

const myNfts = ref(false);

const nfts = computed(() => {
  if (!state.filterByAddress) {
    return Object.values(state.nfts).map(item => item);
  }
  return Object.values(state.nfts).filter(item => state.myNftIDs.includes(item.id));
});

onMounted(async () => {
  await getCollectionInfo();
});

watch(
  () => connected.value,
  connected => {
    if (connected) {
      getNfts();
      getCollectionInfo();
    }
  },
  { immediate: true }
);

watch(
  () => myNfts.value,
  my => {
    if (my) {
      showMyNfts();
    } else {
      showNfts();
    }
  },
  { immediate: true }
);
</script>
