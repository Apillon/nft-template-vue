<template>
  <div v-if="provider">
    <div v-if="!state.nftAddress || !state.walletAddress" class="box collection br text-center">
      <div class="btn-connect-wrapper">
        <Btn id="btnConnect" :loading="state.loading" @click="connectWalletWrapper">
          <template v-if="state.walletAddress && state.walletAddress.length > 0">
            <NuxtIcon name="wallet" class="icon-auto" />
            <span class="address">{{ state.walletAddress.slice(0, 11) }}</span>
          </template>
          <template v-else> Connect wallet </template>
        </Btn>
      </div>
    </div>

    <template v-else-if="state.nft?.id">
      <div class="absolute">
        <Btn @click="router.push('/')">&#8656; Go back</Btn>
      </div>

      <div class="nestable-nft">
        <NftCard :nft="state.nft" :is-nestable="state.isCollectionNestable" pending-children />
      </div>

      <template v-if="state.isCollectionNestable">
        <NftChildren :parent-id="state.nft.id" />

        <div class="nesting flex">
          <NftNesting :nft-id="nftId" />

          <div>
            <div class="box collection br text-center">
              <CollectionInfo
                v-if="state.collectionInfo && provider"
                :collection="state.collectionInfo"
                :provider="provider"
                :address="state.walletAddress"
                :nft-id="nftId"
              />
            </div>
          </div>
        </div>

        <NftTransfer :nft-id="nftId" />
      </template>
    </template>
  </div>
  <div v-else class="relative">
    <div class="btn-connect-wrapper">
      <h2 class="error">{{ metamaskNotSupportedMessage() }}</h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { providers } from 'ethers';
import { toast } from 'vue3-toastify';

const { params } = useRoute();
const router = useRouter();
const { state, getProvider, connectWallet, loadNFT, loadMyNFTs, resetNft } = useNft();

const nftId = ref<number>(params?.id ? parseInt(`${params?.id}`) : 0);
const provider = ref<providers.Web3Provider>();

const nftExists = computed(() => state.nft && state.nft.name);

onMounted(async () => {
  resetNft();

  const { ethereum } = window;
  if (ethereum) {
    provider.value = getProvider();

    if (state.collectionInfo) {
      await loadNFT(nftId.value);
      await loadMyNFTs();

      validateNft();
    }
  }
});

async function connectWalletWrapper() {
  await connectWallet(nftId.value);
  validateNft();
}
function validateNft() {
  if (!nftExists.value) {
    router.push('/');
    setTimeout(() => {
      toast('Token is being minted', { type: 'warning' });
    }, 100);
  } else if (!state.myNFTs.includes(state.nft.id)) {
    router.push('/');
    setTimeout(() => {
      toast('You are not owner of this NFT.', { type: 'warning' });
    }, 100);
  }
}
</script>
