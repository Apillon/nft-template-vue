import { BigNumber, ethers } from 'ethers';
import nftAbi from '~~/lib/nftAbi';

const config = useRuntimeConfig();

const state = reactive<StateInterface>({
  chainId: config.public.CHAIN_ID,
  nftAddress: config.public.CONTRACT_ADDRESS,
  currentChain: '',
  collectionInfo: null,
  myNFTs: [],
  nft: {} as Nft,
  nfts: [] as Nft[],
  filterByAddress: false,
  isCollectionNestable: false,
  loading: false,
  loadingNft: false,
  loadingNfts: false,
  loadingMyNfts: false,
  walletAddress: '',
});

export default function useNft() {
  function getProvider(): Provider {
    const { ethereum } = window;
    return new ethers.providers.Web3Provider(ethereum);
  }

  function getNftContract(tokenAddress?: string): Contract {
    const nftContract = new ethers.Contract(
      tokenAddress || state.nftAddress,
      nftAbi,
      getProvider()
    );
    return nftContract;
  }

  async function connectWallet(nftId?: number) {
    const { ethereum } = window;
    if (!ethereum) {
      console.error(metamaskNotSupportedMessage());
      useNuxtApp().$toast.error(metamaskNotSupportedMessage());
      return;
    }
    state.loading = true;

    let provider = getProvider();

    state.currentChain = await getCurrentChain();
    if (state.currentChain !== state.chainId) {
      try {
        await switchChain(state.chainId);

        provider = getProvider();
        state.currentChain = await getCurrentChain();
      } catch (e) {
        console.error(e);
        useNuxtApp().$toast.error('Error connecting to metamask');

        try {
          await addChain(state.chainId);
        } catch (e) {
          console.error(e);
          useNuxtApp().$toast.error('' + e);
        }
      }
    }
    if (!provider) {
      console.error('Missing provider');
      useNuxtApp().$toast.error('Missing provider');
      state.loading = false;
      return;
    }

    /** Check if collection is Nestable */
    state.isCollectionNestable = await isTokenNestable(getNftContract());

    /** Wallet address */
    await ethereum.request({ method: 'eth_requestAccounts' });
    state.walletAddress = await provider.getSigner().getAddress();

    try {
      state.collectionInfo = await getCollectionInfo();
    } catch (e) {
      console.error(e);
      useNuxtApp().$toast.error('Invalid NFT collection');
      state.loading = false;
      return;
    }

    state.myNFTs = await getMyNftIDs();

    if (nftId) {
      await loadNFT(nftId);
    } else {
      await loadAllNFTs();
    }

    state.loading = false;
  }

  async function getCollectionInfo(): Promise<CollectionInfo> {
    const nftContract = getNftContract();
    return {
      address: nftContract.address,
      name: await nftContract.name(),
      symbol: await nftContract.symbol(),
      maxSupply: await nftContract.maxSupply(),
      totalSupply: await nftContract.totalSupply(),
      soulbound: await nftContract.isSoulbound(),
      revokable: await nftContract.isRevokable(),
      drop: await nftContract.isDrop(),
      dropStart: await nftContract.dropStart(),
      reserve: await nftContract.reserve(),
      price: await nftContract.pricePerMint(),
      royaltiesFees: await nftContract.getRoyaltyPercentage(),
      royaltiesAddress: await nftContract.getRoyaltyRecipient(),
    };
  }

  async function loadAllNFTs() {
    state.loadingNfts = true;
    state.filterByAddress = false;

    if (state.collectionInfo) {
      await fetchNFTs(state.collectionInfo.totalSupply);
    }
    state.loadingNfts = false;
  }

  async function loadMyNFTs() {
    state.loadingMyNfts = true;
    state.filterByAddress = true;

    const nftContract = getNftContract();
    const balance = nftContract ? await nftContract.balanceOf(state.walletAddress) : null;

    await fetchNFTs(balance, state.walletAddress);
    state.loadingMyNfts = false;
  }

  async function loadNFT(id: number) {
    state.loadingNft = true;
    await fetchNFT(id);
    state.loadingNft = false;
  }

  async function fetchNFT(id: number) {
    state.nfts = [];
    const nftContract = getNftContract();

    if (!nftContract || !id) {
      return;
    }

    try {
      const url = await nftContract.tokenURI(id);
      const metadata = await fetch(url).then(response => {
        return response.json();
      });
      if (metadata && metadata.name) {
        state.nft = {
          id,
          key: id,
          ...metadata,
        };
      }
    } catch (e) {
      console.error(e);
      useNuxtApp().$toast.error('Apologies, we were unable to load NFTs metadata.');
    }
  }

  async function fetchNFTs(balance: BigNumber | null | undefined, address = '') {
    state.nfts = [];
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
          state.nfts.push({
            key: i,
            id: id.toNumber(),
            ...metadata,
          });
        }
      } catch (e) {
        console.error(e);
        useNuxtApp().$toast.error('Apologies, we were unable to load NFTs metadata.');
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

  async function getMyNftIDs(tokenAddress?: string): Promise<Array<number>> {
    const nftIDs = [];
    try {
      const contract = getNftContract(tokenAddress);
      const balance = await contract.balanceOf(state.walletAddress);

      for (let i = 0; i < balance.toBigInt(); i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(state.walletAddress, i);
        nftIDs.push(tokenId.toNumber());
      }
    } catch (error) {
      console.log(error);
      transactionError(
        'Token could not be minted! Wrong address or all tokens has already been minted.',
        error
      );
    }
    return nftIDs;
  }

  return {
    state: readonly(state),
    connectWallet,
    getProvider,
    getNftContract,
    getCollectionInfo,
    isTokenNestable,
    loadNFT,
    loadAllNFTs,
    loadMyNFTs,
  };
}
