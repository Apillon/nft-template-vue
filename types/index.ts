import { BigNumber, ethers } from 'ethers';
import { PropType } from 'nuxt/dist/app/compat/capi';

export {};

declare global {
  type VuePropType<T> = PropType<T>;

  /**
   * Window
   */
  interface Window {
    ethereum: any;
  }
  interface NftResponse {
    name: string;
    description: string;
    image: string;
  }
  interface Nft {
    id: number;
    key: number;
    name: string;
    description: string;
    image: string;
  }
  interface CollectionInfo {
    drop: Boolean;
    dropStart: BigNumber;
    maxSupply: BigNumber;
    name: String;
    price: BigNumber;
    reserve: BigNumber;
    revokable: Boolean;
    royaltiesFees: BigNumber;
    royaltiesAddress: String;
    soulbound: Boolean;
    symbol: String;
    totalSupply: BigNumber;
  }
  interface Child {
    contractAddress: string;
    tokenId: BigNumber;
  }

  /** State */
  type Provider = ethers.providers.Web3Provider;
  type Contract = ethers.Contract;
  interface StateInterface {
    provider: Provider | null;
    nftContract: Contract | null;
  }
}
