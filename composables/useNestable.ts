import { ethers } from 'ethers';

const stateNestable = reactive({
  loadingChildren: false,
  loadingPendingChildren: false,
  children: [] as Child[],
  pendingChildren: [] as Child[],
});

export default function useNestable() {
  const {
    state,
    getNftContract,
    getProvider,
    isTokenNestable,
    pollingNfts,
    pollingMyNftIDs,
    getMyNftIDs,
  } = useNft();

  let getChildrenInterval: any = null;
  let getPendingChildrenInterval: any = null;

  onUnmounted(() => {
    clearInterval(getChildrenInterval);
    clearInterval(getPendingChildrenInterval);
  });

  async function getChildren(parentId: number, tokenAddress?: string) {
    stateNestable.loadingChildren = true;
    stateNestable.children = await fetchChildren(parentId, tokenAddress);
    stateNestable.loadingChildren = false;
  }

  async function getPendingChildren(parentId: number, tokenAddress?: string) {
    stateNestable.loadingPendingChildren = true;
    stateNestable.pendingChildren = await fetchPendingChildren(parentId, tokenAddress);
    stateNestable.loadingPendingChildren = false;
  }

  async function fetchChildren(parentId: number, tokenAddress?: string): Promise<Child[]> {
    try {
      const nftContract = getNftContract(tokenAddress);
      return await nftContract.connect(getProvider().getSigner()).childrenOf(parentId);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async function fetchPendingChildren(parentId: number, tokenAddress?: string): Promise<Child[]> {
    try {
      const nftContract = getNftContract(tokenAddress);
      return await nftContract.connect(getProvider().getSigner()).pendingChildrenOf(parentId);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  /** Transactions */
  async function childMint(tokenAddress: string, quantity: number) {
    const childNftContract = getNftContract(tokenAddress);
    const isNestable = await isTokenNestable(childNftContract);
    if (!isNestable) {
      useNuxtApp().$toast.warning('Child token is not nestable');
      return;
    }
    const price = await getNftContract().pricePerMint();
    const value = price.mul(ethers.BigNumber.from(quantity));
    try {
      const gasLimit = await childNftContract
        .connect(getProvider().getSigner())
        .estimateGas.mint(state.walletAddress, quantity, { value });

      const tx = await childNftContract
        .connect(getProvider().getSigner())
        .mint(state.walletAddress, quantity, { value, gasLimit: gasLimit.mul(11).div(10) });

      useNuxtApp().$toast.success('Token is being minted');

      await tx.wait();

      /** Refresh NFTs */
      pollingNfts();
    } catch (e) {
      console.log(e);
      transactionError(
        'Token could not be minted! Wrong address or all tokens has already been minted.',
        e
      );
    }
  }

  async function childNestMint(tokenAddress: string, quantity: number, destinationId: number) {
    if (!checkInputAddress(tokenAddress)) {
      console.log('Missing input data');
      return;
    }
    const childNftContract = getNftContract(tokenAddress);
    const isNestable = await isTokenNestable(childNftContract);
    if (!isNestable) {
      console.error('Child token is not nestable');
      return;
    }
    const nftContract = getNftContract();
    const price = await childNftContract.pricePerMint();
    const value = price.mul(ethers.BigNumber.from(quantity));
    try {
      const gasLimit = await childNftContract
        .connect(getProvider().getSigner())
        .estimateGas.nestMint(nftContract.address, quantity, destinationId, { value });

      const tx = await childNftContract
        .connect(getProvider().getSigner())
        .nestMint(nftContract.address, quantity, destinationId, {
          value,
          gasLimit: gasLimit.mul(11).div(10),
        });

      useNuxtApp().$toast.success('Token is being minted');

      await tx.wait();

      /** Refresh NFTs */
      pollingNfts();
      await getPendingChildren(destinationId);
    } catch (e) {
      console.log(e);
      transactionError(
        'Token could not be minted! Wrong address or all tokens has already been minted.',
        e
      );
    }
  }

  async function acceptChild(
    parentId: number,
    childIndex: number,
    childAddress: string,
    childId: number
  ) {
    try {
      const nftContract = getNftContract();
      const tx = await nftContract
        .connect(getProvider().getSigner())
        .acceptChild(parentId, childIndex, childAddress, childId);

      useNuxtApp().$toast.success('Token is being accepted');

      await tx.wait();

      /** Refresh MY NFTs */
      await getMyNftIDs();
      await getChildren(parentId);
      await getPendingChildren(parentId);
    } catch (e) {
      console.log(e);
      transactionError('Token could not be accepted!', e);
    }
  }

  async function rejectAllChildren(parentId: number, maxRejections: number) {
    try {
      const nftContract = getNftContract();

      const tx = await nftContract
        .connect(getProvider().getSigner())
        .rejectAllChildren(parentId, maxRejections);

      useNuxtApp().$toast.success('Tokens is being rejected');

      await tx.wait();

      /** Refresh NFTs */
      await getPendingChildren(parentId);
    } catch (e) {
      console.log(e);
      transactionError('Tokens could not be rejected!', e);
    }
  }

  async function nestTransferFrom(
    tokenAddress: string,
    toAddress: string,
    tokenId: number,
    destinationId: number,
    data: any
  ) {
    const childNftContract = getNftContract(tokenAddress);
    const isNestable = await isTokenNestable(childNftContract);
    if (!isNestable) {
      console.error('Child token is not nestable');
      return false;
    }

    try {
      await childNftContract
        .connect(getProvider().getSigner())
        .nestTransferFrom(state.walletAddress, toAddress, tokenId, destinationId, data);

      useNuxtApp().$toast.success('Token is being transferred');

      /** Refresh MY NFTs */
      pollingMyNftIDs();
    } catch (e) {
      console.log(e);
      transactionError('Token could not be transferred! Wrong token address or token ID.', e);
    }
  }

  async function transferChild(
    tokenId: number,
    toAddress: string,
    destinationId: number,
    childIndex: number,
    childAddress: string,
    childId: number,
    isPending: boolean,
    data: any
  ) {
    try {
      const nftContract = getNftContract();
      const tx = await nftContract
        .connect(getProvider().getSigner())
        .transferChild(
          tokenId,
          toAddress,
          destinationId,
          childIndex,
          childAddress,
          childId,
          isPending,
          data
        );

      useNuxtApp().$toast.success('Child is being transferred');

      await tx.wait();

      /** Refresh NFTs */
      pollingMyNftIDs();
      await getChildren(tokenId);
    } catch (e) {
      console.log(e);
      transactionError('Token could not be transferred!', e);
    }
  }

  return {
    stateNestable: readonly(stateNestable),

    acceptChild,
    childMint,
    childNestMint,
    fetchChildren,
    fetchPendingChildren,
    getChildren,
    getPendingChildren,
    nestTransferFrom,
    rejectAllChildren,
    transferChild,
  };
}
