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
      const nftContract = getNftContract(tokenAddress);
      return await nftContract.connect(getProvider().getSigner()).pendingChildrenOf(parentId);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  /** Transactions */
  async function childMint(tokenAddress: string, quantity: number): Promise<boolean> {
    const childNftContract = getNftContract(tokenAddress);
    const isNestable = await isTokenNestable(childNftContract);
    if (!isNestable) {
      console.error('Child token is not nestable');
      return false;
    }
    const price = await getNftContract().pricePerMint();
    const value = price.mul(ethers.BigNumber.from(quantity));
    try {
      await childNftContract
        .connect(getProvider().getSigner())
        .mint(state.walletAddress, quantity, { value });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async function childNestMint(
    tokenAddress: string,
    quantity: number,
    destinationId: number
  ): Promise<boolean> {
    const childNftContract = getNftContract(tokenAddress);
    const isNestable = await isTokenNestable(childNftContract);
    if (!isNestable) {
      console.error('Child token is not nestable');
      return false;
    }
    const nftContract = getNftContract();
    const price = await nftContract.pricePerMint();
    const value = price.mul(ethers.BigNumber.from(quantity));
    try {
      await childNftContract
        .connect(getProvider().getSigner())
        .nestMint(nftContract.address, quantity, destinationId, { value });
      return true;
    } catch (e) {
      console.log(e);
    }
    return false;
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
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async function rejectAllChildren(parentId: number, maxRejections: number) {
    try {
      const nftContract = getNftContract();
      await nftContract
        .connect(getProvider().getSigner())
        .rejectAllChildren(parentId, maxRejections);
      return true;
    } catch (e) {
      console.log(e);
      return false;
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
        .nestTransferFrom(walletAddress, toAddress, tokenId, destinationId, data);
      return true;
    } catch (e) {
      console.log(e);
      return false;
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
      return true;
    } catch (e) {
      console.log(e);
      return false;
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
