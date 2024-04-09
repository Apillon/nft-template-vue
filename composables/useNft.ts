import { BigNumber, ethers } from 'ethers';
import nftAbi from '~~/lib/nftAbi';

const config = useRuntimeConfig();

const state = reactive<StateInterface>({
  chainId: config.public.CHAIN_ID,
  nftAddress: config.public.CONTRACT_ADDRESS,
  currentChain: '',
  collectionInfo: null,
  myNftIDs: [],
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
  let provider: any = null;
  let getNftsInterval: any = null;
  let getMyNftsInterval: any = null;

  const contracts: Record<string, any> = {};

  onUnmounted(() => {
    clearInterval(getNftsInterval);
    clearInterval(getMyNftsInterval);
  });

  function getProvider(): Provider {
    if (!provider) {
      const { ethereum } = window;
      provider = new ethers.providers.Web3Provider(ethereum);
    }
    return provider;
  }

  function getNftContract(contractAddress?: string): Contract {
    const address = contractAddress || state.nftAddress;

    if (!Object.keys(contracts).includes(address)) {
      contracts[address] = new ethers.Contract(address, nftAbi, getProvider());
    }
    return contracts[address];
  }

  async function connectWallet(nftId?: number) {
    const { ethereum } = window;
    if (!ethereum) {
      console.error(metamaskNotSupportedMessage());
      useNuxtApp().$toast.error(metamaskNotSupportedMessage());
      return;
    }
    state.loading = true;

    provider = getProvider();

    state.currentChain = await getCurrentChain();
    if (state.currentChain !== state.chainId) {
      provider = null;
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

    await getMyNftIDs();
    await getNfts();

    if (nftId) {
      getNft(nftId);
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
  async function getCollectionTotalSupply(): Promise<BigNumber> {
    const nftContract = getNftContract();
    return await nftContract.totalSupply();
  }

  async function getNfts() {
    state.loadingNfts = true;
    state.filterByAddress = false;

    if (state.collectionInfo) {
      state.nfts = await fetchNFTs(state.collectionInfo.totalSupply);
    }
    state.loadingNfts = false;
  }

  function getNft(nftId: number) {
    state.nft = state.nfts.find(item => item.id === nftId);
  }

  async function fetchNFTs(balance: BigNumber | null | undefined): Promise<Nft[]> {
    const nfts = [] as Nft[];
    const nftContract = getNftContract();

    if (!nftContract || !balance || balance.toNumber() === 0) {
      return nfts;
    }

    try {
      const promises: Promise<any>[] = [];

      for (let i = 0; i < balance.toBigInt(); i++) {
        const id = await nftContract.tokenByIndex(i);

        promises.push(
          new Promise<void>(resolve => {
            fetchNftById(nftContract, id.toNumber()).then(metadata => {
              if (metadata && metadata.name) {
                nfts.push(metadata);
              }
              resolve();
            });
          })
        );
      }
      await Promise.all(promises);
    } catch (e) {
      console.error(e);
      useNuxtApp().$toast.error('Apologies, we were unable to load NFTs metadata.');
    }
    return nfts;
  }

  async function fetchNftById(contract: any, id: number): Promise<Nft | null> {
    try {
      const url = await contract.tokenURI(id);
      const metadata = await fetch(url).then(response => {
        return response.json();
      });
      if (metadata && metadata.name) {
        return {
          id,
          key: id,
          ...metadata,
        };
      }
    } catch (e) {
      console.error(e);
      useNuxtApp().$toast.error('Apologies, we were unable to load NFTs metadata.');
    }
    return null;
  }

  async function pollingNfts() {
    const totalSupply = await getCollectionTotalSupply();
    state.collectionInfo = await getCollectionInfo();
    state.nfts = await fetchNFTs(totalSupply);
    await getMyNftIDs();
  }

  async function pollingMyNftIDs() {
    const totalSupply = await getCollectionTotalSupply();
    state.collectionInfo = await getCollectionInfo();
    state.nfts = await fetchNFTs(totalSupply);
    await getMyNftIDs();
  }

  async function checkCollectionType(contract: any) {
    state.isCollectionNestable = await isTokenNestable(getNftContract());
  }

  async function isTokenNestable(contract: any) {
    try {
      return await contract.supportsInterface('0x42b0e56f');
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async function getMyNftIDs(contractAddress?: string) {
    state.myNftIDs = await fetchMyNftIDs(contractAddress);
  }
  async function fetchMyNftIDs(contractAddress?: string): Promise<Array<number>> {
    const nftIDs = [];
    try {
      const contract = getNftContract(contractAddress);
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

  function showNfts() {
    state.filterByAddress = false;
  }
  function showMyNfts() {
    state.filterByAddress = true;
  }

  function resetNft() {
    state.nft = {} as Nft;
  }

  return {
    state: readonly(state),
    connectWallet,
    checkCollectionType,
    getProvider,
    getNftContract,
    getCollectionInfo,
    isTokenNestable,
    getMyNftIDs,
    getNft,
    getNfts,
    pollingNfts,
    pollingMyNftIDs,
    resetNft,
    showNfts,
    showMyNfts,
  };
}
