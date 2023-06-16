<template>
  <div>
    <div class="box collection br text-center">
      <CollectionInfo
        v-if="collectionInfo && provider"
        :collection="collectionInfo"
        :provider="provider"
        :address="address"
      />

      <div class="btn-connect-wrapper">
        <Btn id="btnConnect" :loading="loading" @click="connectWallet()">
          <template v-if="address && address.length > 0">
            <NuxtIcon name="wallet" class="icon-auto" />
            <span class="address">{{ address.slice(0, 11) }}</span>
          </template>
          <template v-else> Connect wallet </template>
        </Btn>
      </div>
    </div>

    <div v-if="address && collectionInfo" id="actions">
      <h2 class="text-center">Show NFTs:</h2>
      <div class="actions">
        <Btn id="btnAllNFTs" :loading="loadingNfts" @click="loadAllNFTs()">All nfts</Btn>
        <Btn id="myNFTs" :loading="loadingMyNfts" @click="loadMyNFTs()">My nfts</Btn>
      </div>
    </div>

    <div v-if="collectionInfo">
      <h2 v-if="collectionInfo.totalSupply.toNumber() === 0" class="text-center">
        No NFTs, they must be minted first.
      </h2>
      <h2 v-else-if="filterByAddress && !nfts" class="text-center">You don`t have any NFTs</h2>

      <h2 v-else-if="!nfts" class="text-center">No NFTs, they must be minted first.</h2>
      <NftGallery v-else :address="address" :nfts="nfts" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BigNumber, ethers } from 'ethers';

const config = useRuntimeConfig();
const CHAIN_ID = config.public.CHAIN_ID;
const NFT_ADDRESS = config.public.NFT_ADDRESS;

let provider: any = null;
let contract: any = null;
const address = ref<string>('');

const loading = ref<boolean>(false);
const loadingNfts = ref<boolean>(false);
const loadingMyNfts = ref<boolean>(false);

const currentChain = ref<string>('');
const collectionInfo = ref<CollectionInfo>();
const nfts = ref<Nft[]>([]);
const filterByAddress = ref<boolean>(false);

function initProvider() {
  const { ethereum } = window;
  provider = new ethers.providers.Web3Provider(ethereum);
  contract = new ethers.Contract(NFT_ADDRESS, nftAbi, provider);
}

async function connectWallet() {
  const { ethereum } = window;
  if (!ethereum) {
    console.error(metamaskNotSupportedMessage());
    useNuxtApp().$toast.error(metamaskNotSupportedMessage());
    return;
  }
  loading.value = true;

  initProvider();

  currentChain.value = await getCurrentChain();
  if (currentChain.value !== CHAIN_ID) {
    try {
      await switchChain(CHAIN_ID);

      initProvider();
      currentChain.value = await getCurrentChain();
    } catch (e) {
      console.error(e);
      useNuxtApp().$toast.error('Error connecting to metamask');

      try {
        await addChain(CHAIN_ID);
      } catch (e) {
        console.error(e);
        useNuxtApp().$toast.error('' + e);
      }
    }
  }
  if (!provider) {
    console.error('Missing provider');
    useNuxtApp().$toast.error('Missing provider');
    loading.value = false;
    return;
  }

  await ethereum.request({
    method: 'eth_requestAccounts',
  });

  address.value = await provider.getSigner().getAddress();

  try {
    collectionInfo.value = await getCollectionInfo();
  } catch (e) {
    console.error(e);
    useNuxtApp().$toast.error('Invalid NFT collection');
    loading.value = false;
    return;
  }

  await loadAllNFTs();
  loading.value = false;
}

async function getCollectionInfo(): Promise<CollectionInfo> {
  if (!provider || !contract) return {} as CollectionInfo;
  return {
    name: await contract.name(),
    symbol: await contract.symbol(),
    maxSupply: await contract.maxSupply(),
    totalSupply: await contract.totalSupply(),
    soulbound: await contract.isSoulbound(),
    revokable: await contract.isRevokable(),
    drop: await contract.isDrop(),
    dropStart: await contract.dropStart(),
    reserve: await contract.reserve(),
    price: await contract.price(),
    royaltiesFees: await contract.royaltiesFees(),
    royaltiesAddress: await contract.royaltiesAddress(),
  };
}

async function loadAllNFTs() {
  loadingNfts.value = true;
  filterByAddress.value = false;

  if (collectionInfo.value) {
    await fetchNFTs(collectionInfo.value.totalSupply);
  }
  loadingNfts.value = false;
}

async function loadMyNFTs() {
  loadingMyNfts.value = true;
  filterByAddress.value = true;

  const balance = contract ? await contract.balanceOf(address.value) : null;

  await fetchNFTs(balance, address.value);
  loadingMyNfts.value = false;
}

async function fetchNFTs(balance: BigNumber | null | undefined, address = '') {
  nfts.value = [];
  if (!contract || !balance || balance.toNumber() === 0) {
    return;
  }

  for (let i = 0; i < balance.toBigInt(); i++) {
    try {
      const id = address
        ? await contract.tokenOfOwnerByIndex(address, i)
        : await contract.tokenByIndex(i);
      const url = await contract.tokenURI(id.toBigInt());
      const metadata = await fetch(url).then(response => {
        return response.json();
      });
      nfts.value.push({ id: i, ...metadata });
    } catch (e) {
      console.error(e);
      useNuxtApp().$toast.error('Apologies, we were unable to load NFT: ' + (i + 1));
    }
  }
}
</script>
