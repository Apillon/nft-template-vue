import type { Config } from '@wagmi/vue';
import type { Address } from 'viem';
import { signMessage } from '@wagmi/vue/actions';
import { useAccount as useAccountEW, useWallet } from '@apillon/wallet-vue';
import { useAccount, useChainId, useChains, useDisconnect, useSwitchChain } from '@wagmi/vue';

export default function useWalletConnect() {
  const config = useRuntimeConfig();

  /** Apillon Embedded wallet */
  const { info } = useAccountEW();
  const { signMessage: signEW, wallet } = useWallet();

  /** Wagmi */
  const chains = useChains();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { $wagmiConfig } = useNuxtApp();

  const loading = ref<boolean>(false);
  const modalWalletVisible = ref<boolean>(false);

  const network = computed(() => chains.value.find(c => c.id === config.public.CHAIN_ID));
  const connected = computed(() => isConnected.value || !!info.activeWallet?.address);
  const walletAddress = computed<Address>(() =>
    isConnected.value ? (address.value as Address) : (info.activeWallet?.address as Address)
  );

  const sign = async (message: string) => {
    return isConnected.value
      ? await signMessage($wagmiConfig as Config, { message })
      : await signEW(message);
  };

  async function ensureCorrectNetwork() {
    if (chainId?.value !== config.public.CHAIN_ID) {
      await switchChain({ chainId: config.public.CHAIN_ID });
    }
    return true;
  }

  function disconnectWallet() {
    if (isConnected.value) {
      disconnect();
    } else if (wallet.value && info.activeWallet?.address) {
      wallet.value?.events.emit('disconnect');
    }
  }

  async function initEmbeddedWallet() {
    await sleep();

    if (wallet.value && config.public.EMBEDDED_WALLET_CLIENT) {
      // wallet.value?.events.on('connect', () => {});
      // wallet.value?.events.on('accountsChanged', async (accounts: Events['accountsChanged']) => {});
      // wallet.value?.events.on('dataUpdated', ({ name, newValue }) => {});
      // wallet.value?.events.on('disconnect', () => {
      //   disconnectWallet();
      // });
    }
  }

  return {
    connected,
    loading,
    modalWalletVisible,
    network,
    walletAddress,
    disconnectWallet,
    ensureCorrectNetwork,
    initEmbeddedWallet,
    sign,
  };
}
