<template>
  <div>
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

    <div v-if="state.walletAddress && state.collectionInfo" id="actions">
      <h2 class="text-center">Show NFTs:</h2>
      <div class="actions">
        <Btn id="btnAllNFTs" :loading="state.loadingNfts" @click="loadAllNFTs()"> All nfts </Btn>
        <Btn id="myNFTs" :loading="state.loadingMyNfts" @click="loadMyNFTs()">My nfts</Btn>
      </div>
    </div>

    <div v-if="state.collectionInfo">
      <h2 v-if="state.collectionInfo.totalSupply.toNumber() === 0" class="text-center">
        No NFTs, they must be minted first.
      </h2>
      <h2 v-else-if="state.filterByAddress && !state.nfts" class="text-center">
        You don`t have any NFTs
      </h2>

      <h2 v-else-if="!state.nfts" class="text-center">No NFTs, they must be minted first.</h2>
      <NftGallery
        v-else
        :address="state.walletAddress"
        :nfts="state.nfts"
        :is-nestable="state.isCollectionNestable"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { state, getProvider, connectWallet, loadAllNFTs, loadMyNFTs } = useNft();

const provider = getProvider();
</script>
