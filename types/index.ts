import { BigNumber } from 'ethers';
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

  interface Nft {
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
}
