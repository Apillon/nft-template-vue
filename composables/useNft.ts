import { useAccount, useWallet } from '@apillon/wallet-vue';
import { useConnectorClient } from '@wagmi/vue';
import { type Address } from 'viem';

const state = reactive<StateInterface>({
  myNftIDs: [],
  nfts: [] as Nft[],
  filterByAddress: false,
  loading: false,
  loadingNfts: false,
  loadingMyNfts: false,
});

export default function useNft() {
  const config = useRuntimeConfig();
  const { $toast } = useNuxtApp();
  const { wallet } = useWallet();
  const { info } = useAccount();
  const { data: walletClient, refetch } = useConnectorClient();
  const { ensureCorrectNetwork } = useWalletConnect();
  const {
    collectionInfo,
    getBalance,
    getTokenOfOwner,
    getTokenByIndex,
    getTokenUri,
    getTotalSupply,
  } = useContract();

  const contractAddress = config.public.CONTRACT_ADDRESS as Address;

  async function getNfts() {
    state.loadingNfts = true;
    state.filterByAddress = false;

    await getTotalSupply();
    if (collectionInfo.totalSupply) {
      await fetchNFTs(collectionInfo.totalSupply);
    }
    state.loadingNfts = false;
  }

  async function fetchNFTs(balance: BigInt | null | undefined) {
    const nfts: Record<number, Nft> = {};

    if (Number(balance) === 0) {
      return nfts;
    }

    try {
      const promises: Promise<any>[] = [];

      for (let i = 0; i < Number(balance); i++) {
        const id = await getTokenByIndex(i);

        promises.push(fetchNft(Number(id)));
      }
      await Promise.all(promises);
    } catch (e) {
      console.error(e);
      $toast.error('Apologies, we were unable to load NFTs metadata.');
    }
    return nfts;
  }

  async function fetchNft(id: number): Promise<Nft | null> {
    if (id in state.nfts) return state.nfts[id];

    try {
      const url = await getTokenUri(Number(id));
      const metadata = await fetch(url).then(response => {
        return response.json();
      });
      if (metadata && metadata.name) {
        state.nfts[id] = {
          id,
          ...metadata,
        };
        return state.nfts[id];
      }
    } catch (e) {
      console.error(e);
      $toast.error('Apologies, we were unable to load NFTs metadata.');
    }
    return null;
  }

  function addtMyNftIDs(tokenId: string | number) {
    state.myNftIDs.push(Number(tokenId));
  }

  async function getMyNftIDs() {
    state.myNftIDs = await fetchMyNftIDs();
  }
  async function fetchMyNftIDs(): Promise<number[]> {
    const nftIDs = [];
    try {
      const balance = await getBalance();

      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await getTokenOfOwner(i);
        nftIDs.push(Number(tokenId));
      }
    } catch (e) {
      console.error(e);
      transactionError(
        'Token could not be minted! Wrong address or all tokens has already been minted.',
        e
      );
    }
    return nftIDs;
  }

  async function addNftId(nftId: string | number, metadata: Metadata) {
    await ensureCorrectNetwork();
    let success: any = false;
    const image = metadata?.image || '';

    try {
      if (wallet.value && info.activeWallet?.address) {
        success = wallet.value?.events.emit('addTokenNft', {
          address: contractAddress,
          tokenId: Number(nftId),
          imageUrl: image,
          name: metadata.name || '',
        });
      } else {
        if (!walletClient.value) {
          await refetch();
          await sleep(200);
        }
        // Use the Ethereum provider to watch the NFT asset
        success = await walletClient.value?.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC721',
            options: {
              address: contractAddress,
              tokenId: nftId.toString(),
              image,
            },
          },
        });
      }
    } catch (e) {
      console.error('Error importing NFT:', e);
    }
    success
      ? $toast.success('NFT successfully imported into the wallet!')
      : $toast.error('Failed to import NFT into the wallet.');
  }

  function showNfts() {
    state.filterByAddress = false;
  }
  function showMyNfts() {
    state.filterByAddress = true;
  }

  return {
    state: readonly(state),
    addNftId,
    addtMyNftIDs,
    fetchNft,
    getMyNftIDs,
    getNfts,
    showNfts,
    showMyNfts,
  };
}
