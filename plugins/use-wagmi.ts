import { http, createConfig, WagmiPlugin, createStorage } from '@wagmi/vue';
import { type Chain } from '@wagmi/vue/chains';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { metaMask, coinbaseWallet, walletConnect } from '@wagmi/vue/connectors';
import {
  arbitrum,
  arbitrumSepolia,
  astar,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  celo,
  celoAlfajores,
  mainnet,
  moonbaseAlpha,
  moonbeam,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
} from 'viem/chains';

type Transport = { [key: number]: ReturnType<typeof http> };

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();
  const chains: readonly [Chain, ...Chain[]] = [
    arbitrum,
    arbitrumSepolia,
    astar,
    avalanche,
    avalancheFuji,
    base,
    baseSepolia,
    celo,
    celoAlfajores,
    mainnet,
    moonbaseAlpha,
    moonbeam,
    optimism,
    optimismSepolia,
    polygon,
    polygonAmoy,
    sepolia,
  ];
  const transports = chains.reduce((acc: Transport, chain) => {
    acc[chain.id] = http();
    return acc;
  }, {});

  const connectors = [
    metaMask({
      dappMetadata: {
        name: 'Apillon NFT Templlate',
      },
    }),
    coinbaseWallet({
      appName: 'Apillon NFT Templlate',
    }),
  ];
  if (config.public.WALLET_CONNECT_PROJECT) {
    connectors.push(walletConnect({ projectId: config.public.WALLET_CONNECT_PROJECT }));
  }

  const wagmiConfig = createConfig({
    chains,
    connectors,
    multiInjectedProviderDiscovery: false,
    storage: createStorage({ storage: window.sessionStorage }),
    transports,
  });
  nuxtApp.provide('wagmiConfig', wagmiConfig);
  nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiConfig });
  nuxtApp.vueApp.use(VueQueryPlugin);
});
