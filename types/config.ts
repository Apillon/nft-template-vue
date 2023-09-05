import type { PublicRuntimeConfig } from '@nuxt/schema';

export enum AppEnv {
  PROD = 'production',
  DEV = 'development',
}

declare global {
  interface ConfigInterface extends PublicRuntimeConfig {
    CHAIN_ID: String;
    CONTRACT_ADDRESS: String;
  }
}
