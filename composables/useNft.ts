import { BigNumber, ethers } from 'ethers';
import nftAbi from '~~/lib/nftAbi';

export default function useNft() {
  const config = useRuntimeConfig();
  const CHAIN_ID = config.public.CHAIN_ID;
  const NFT_ADDRESS = config.public.NFT_ADDRESS;

  const loading = ref<boolean>(false);
  const loadingNfts = ref<boolean>(false);
  const loadingMyNfts = ref<boolean>(false);

  const walletAddress = ref<string>('');
  const currentChain = ref<string>('');
  const collectionInfo = ref<CollectionInfo>();

  const nfts = ref<Nft[]>([]);
  const filterByAddress = ref<boolean>(false);
  const isCollectionNestable = ref<boolean>(false);

  function getProvider(): Provider {
    const { ethereum } = window;
    return new ethers.providers.Web3Provider(ethereum);
  }

  function getNftContract(tokenAddress?: string): Contract {
    const nftContract = new ethers.Contract(tokenAddress || NFT_ADDRESS, nftAbi, getProvider());
    return nftContract;
  }

  async function connectWallet() {
    const { ethereum } = window;
    if (!ethereum) {
      console.error(metamaskNotSupportedMessage());
      useNuxtApp().$toast.error(metamaskNotSupportedMessage());
      return;
    }
    loading.value = true;

    let provider = getProvider();

    currentChain.value = await getCurrentChain();
    if (currentChain.value !== CHAIN_ID) {
      try {
        await switchChain(CHAIN_ID);

        provider = getProvider();
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

    /** Check if collection is Nestable */
    isCollectionNestable.value = await isTokenNestable(getNftContract());

    /** Wallet address */
    await ethereum.request({ method: 'eth_requestAccounts' });
    walletAddress.value = await provider.getSigner().getAddress();

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
    const nftContract = getNftContract();
    return {
      name: await nftContract.name(),
      symbol: await nftContract.symbol(),
      maxSupply: await nftContract.maxSupply(),
      totalSupply: await nftContract.totalSupply(),
      soulbound: await nftContract.isSoulbound(),
      revokable: await nftContract.isRevokable(),
      drop: await nftContract.isDrop(),
      dropStart: await nftContract.dropStart(),
      reserve: await nftContract.reserve(),
      price: BigNumber.from('4'),
      royaltiesFees: BigNumber.from('42'),
      royaltiesAddress: '',
      // price: await nftContract.price(),
      // royaltiesFees: await nftContract.getRoyaltyPercentage(),
      // royaltiesAddress: await nftContract.getRoyaltyRecipient(),
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

    const nftContract = getNftContract();
    const balance = nftContract ? await nftContract.balanceOf(walletAddress.value) : null;

    await fetchNFTs(balance, walletAddress.value);
    loadingMyNfts.value = false;
  }

  async function fetchNFTs(balance: BigNumber | null | undefined, address = '') {
    nfts.value = [];
    const nftContract = getNftContract();
    if (!nftContract || !balance || balance.toNumber() === 0) {
      return;
    }

    for (let i = 0; i < balance.toBigInt(); i++) {
      try {
        const id = address
          ? await nftContract.tokenOfOwnerByIndex(address, i)
          : await nftContract.tokenByIndex(i);
        const url = await nftContract.tokenURI(id.toBigInt());
        const metadata = await fetch(url).then(response => {
          return response.json();
        });
        if (metadata && metadata.name) {
          nfts.value.push({
            key: i,
            id: id.toNumber(),
            ...metadata,
          });
        }
      } catch (e) {
        console.error(e);
        useNuxtApp().$toast.error('Apologies, we were unable to load NFT: ' + (i + 1));
      }
    }
  }

  async function isTokenNestable(contract: any) {
    try {
      return await contract.supportsInterface('0x42b0e56f');
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  return {
    collectionInfo: computed(() => collectionInfo.value),
    filterByAddress: computed(() => filterByAddress.value),
    isCollectionNestable: computed(() => isCollectionNestable.value),
    loading: computed(() => loading.value),
    loadingNfts: computed(() => loadingNfts.value),
    loadingMyNfts: computed(() => loadingMyNfts.value),
    nfts: computed(() => nfts.value),
    walletAddress: computed(() => walletAddress.value),

    connectWallet,
    getProvider,
    getNftContract,
    getCollectionInfo,
    isTokenNestable,
    loadAllNFTs,
    loadMyNFTs,
  };
}
