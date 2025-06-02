import { useChainId, useWaitForTransactionReceipt } from '@wagmi/vue';

/**
 * Usage:
 * const txWait = useTxWait();
 * txWait.hash.value = '';
 * await txWait.wait();
 */
export default function useTxWait(networkId?: number) {
  const hash = ref<`0x${string}` | undefined>(undefined);
  const chainId = useChainId();

  const { refetch } = useWaitForTransactionReceipt({ hash, chainId: networkId || chainId.value });

  async function wait() {
    await sleep(50);
    return await refetch();
  }

  return { hash, wait };
}
