import type { PublicRuntimeConfig } from '@nuxt/schema';

export enum AppEnv {
  PROD = 'production',
  DEV = 'development',
}

declare global {
  interface ConfigInterface extends PublicRuntimeConfig {
    CHAIN_ID: number;
    CONTRACT_ADDRESS: string;
    IMG_LOGO: string;
    IMG_COVER: string;
  }
}
