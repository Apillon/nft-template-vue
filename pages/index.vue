<template>
  <div>
    <div class="box collection br text-center">
      <CollectionInfo
        v-if="collectionInfo && provider"
        :collection="collectionInfo"
        :provider="provider"
        :address="walletAddress"
      />

      <div class="btn-connect-wrapper">
        <Btn id="btnConnect" :loading="loading" @click="connectWallet()">
          <template v-if="walletAddress && walletAddress.length > 0">
            <NuxtIcon name="wallet" class="icon-auto" />
            <span class="address">{{ walletAddress.slice(0, 11) }}</span>
          </template>
          <template v-else> Connect wallet </template>
        </Btn>
      </div>
    </div>

    <div v-if="walletAddress && collectionInfo" id="actions">
      <h2 class="text-center">Show NFTs:</h2>
      <div class="actions">
        <Btn id="btnAllNFTs" :loading="loadingNfts" @click="loadAllNFTs()"> All nfts </Btn>
        <Btn id="myNFTs" :loading="loadingMyNfts" @click="loadMyNFTs()">My nfts</Btn>
      </div>
    </div>

    <div v-if="collectionInfo">
      <h2 v-if="collectionInfo.totalSupply.toNumber() === 0" class="text-center">
        No NFTs, they must be minted first.
      </h2>
      <h2 v-else-if="filterByAddress && !nfts" class="text-center">You don`t have any NFTs</h2>

      <h2 v-else-if="!nfts" class="text-center">No NFTs, they must be minted first.</h2>
      <NftGallery
        v-else
        :address="walletAddress"
        :nfts="nfts"
        :is-nestable="isCollectionNestable"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const {
  collectionInfo,
  filterByAddress,
  isCollectionNestable,
  loading,
  loadingNfts,
  loadingMyNfts,
  nfts,
  walletAddress,
  getProvider,
  connectWallet,
  loadAllNFTs,
  loadMyNFTs,
} = useNft();

const provider = getProvider();
</script>
