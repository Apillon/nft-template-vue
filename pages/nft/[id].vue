<template>
  <div v-if="provider">
    <div class="box collection br text-center">
      <CollectionInfo
        v-if="state.collectionInfo && provider"
        :collection="state.collectionInfo"
        :provider="provider"
        :address="state.walletAddress"
      />

      <div class="btn-connect-wrapper">
        <Btn id="btnConnect" :loading="state.loading" @click="connectWallet()">
          <template v-if="state.walletAddress && state.walletAddress.length > 0">
            <NuxtIcon name="wallet" class="icon-auto" />
            <span class="address">{{ state.walletAddress.slice(0, 11) }}</span>
          </template>
          <template v-else> Connect wallet </template>
        </Btn>
      </div>
    </div>

    <div
      v-if="state.walletAddress && state.collectionInfo && state.isCollectionNestable"
      id="nestableInfo"
      class="nestable-info"
    >
      <h3>
        The collection you are viewing supports nesting NFTs you own. To setup the nested
        relationship between NFTs, you first have to own them.
      </h3>
      <strong>Instructions:</strong>
      <ol>
        <li>Mint one or multiple NFTs</li>
        <li>Once minted, click on “My NFTs”</li>
        <li>The NFTs you own will be displayed</li>
        <li>Click on the NFT you want to set as a parent</li>
        <li>A window will open, allowing you to link child NFTs to that NFT</li>
      </ol>
    </div>

    <div v-if="state.walletAddress && state.collectionInfo" id="actions">
      <h2 class="text-center">List NFTs:</h2>
      <div class="actions">
        <Btn @click="router.push('/')"> List nfts </Btn>
      </div>
    </div>

    <div v-if="state.collectionInfo">      

    </div>
  </div>
  <div v-else class="relative">
    <div class="btn-connect-wrapper">
      <h2 class="error">{{ metamaskNotSupportedMessage() }}</h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { providers } from 'ethers';

const {params} = useRoute();
const router = useRouter();
const { state, getProvider, connectWallet, loadNFT } = useNft();

const provider = ref<providers.Web3Provider>();

onMounted(() => {
  const { ethereum } = window;
  if (ethereum) {
    provider.value = getProvider();

    const nftId = params?.id ? parseInt(`${params?.id}`) : 0;
    
    // loadNFT(nftId);
  }
});
</script>
