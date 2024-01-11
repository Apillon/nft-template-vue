<template>
  <div>
    <h3>Nesting NFTs from the same smart contract</h3>
    <p>
      To nest NFTs under the #1 Semper Space White black gold, please select the NFTs you want to
      nest as children.
    </p>

    <div class="grid small">
      <div v-for="(nft, key) in nestableNfts" :key="key" class="relative">
        <input
          v-model="tokenId"
          type="radio"
          name="nest"
          class="absolute"
          :id="`nft_${nft.id}`"
          :value="nft.id"
          @change="handleChange"
        />
        <label :for="`nft_${nft.id}`">
          <NftCard :nft="nft" />
        </label>
      </div>
    </div>
    <br />
    <Btn :loading="loading" @click="nestTransferFromWrapper">Nest selected NFT</Btn>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  nftId: { type: Number, default: '' },
});

const config = useRuntimeConfig();
const { state } = useNft();
const { nestTransferFrom } = useNestable();

const loading = ref<boolean>(false);
const tokenId = ref<number>(0);

const nestableNfts = computed(() => {
  return state.nfts.filter(item => item.id !== props.nftId);
});

const handleChange = (event: Event) => {
  tokenId.value = Number((event.target as HTMLInputElement)?.value) || 0;
};

async function nestTransferFromWrapper() {
  loading.value = true;

  if (checkInputToken(tokenId.value)) {
    await nestTransferFrom(
      config.public.CONTRACT_ADDRESS,
      state.nftAddress,
      tokenId.value,
      props.nftId,
      '0x'
    );
  }
  loading.value = false;
}
</script>
