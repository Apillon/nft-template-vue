import { ethers } from 'ethers';

export default function useNestable() {
  const { state, getNftContract, getProvider, isTokenNestable } = useNft();

  /** Nestable NFT */
  async function childrenOf(parentId: number, tokenAddress?: string): Promise<Child[]> {
    try {
      const nftContract = getNftContract(tokenAddress);
      return await nftContract.connect(getProvider().getSigner()).childrenOf(parentId);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async function pendingChildrenOf(parentId: number, tokenAddress?: string): Promise<Child[]> {
    try {
      console.log(parentId, tokenAddress);
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

      await childNftContract
        .connect(getProvider().getSigner())
        .mint(state.walletAddress, quantity, { value, gasLimit: gasLimit.mul(11).div(10) });

      useNuxtApp().$toast.success('Token is being minted');
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

      await childNftContract
        .connect(getProvider().getSigner())
        .nestMint(nftContract.address, quantity, destinationId, {
          value,
          gasLimit: gasLimit.mul(11).div(10),
        });

      useNuxtApp().$toast.success('Token is being minted');
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
      await nftContract
        .connect(getProvider().getSigner())
        .acceptChild(parentId, childIndex, childAddress, childId);

      useNuxtApp().$toast.success('Token is being accepted');
    } catch (e) {
      console.log(e);
      transactionError('Token could not be accepted!', e);
    }
  }

  async function rejectAllChildren(parentId: number, maxRejections: number) {
    try {
      const nftContract = getNftContract();
      await nftContract
        .connect(getProvider().getSigner())
        .rejectAllChildren(parentId, maxRejections);

      useNuxtApp().$toast.success('Tokens is being rejected');
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
      await nftContract
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
    } catch (e) {
      console.log(e);
      transactionError('Token could not be transferred!', e);
    }
  }

  return {
    childrenOf,
    pendingChildrenOf,
    childMint,
    childNestMint,
    acceptChild,
    rejectAllChildren,
    nestTransferFrom,
    transferChild,
  };
}
