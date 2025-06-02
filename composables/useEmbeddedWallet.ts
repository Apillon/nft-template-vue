import { useAccount, useContract, useWallet } from '@apillon/wallet-vue';
import { encodeFunctionData, type Address } from 'viem';
import { moonbaseAlpha } from 'viem/chains';

export default function useEmbeddedWallet() {
  const config = useRuntimeConfig();
  const { info } = useAccount();
  const { wallet } = useWallet();
  const { network } = useWalletConnect();

  const contractAddress = config.public.CONTRACT_ADDRESS as Address;

  const { read } = useContract({
    abi: nftAbi,
    address: contractAddress,
    chainId: Number(network.value?.id || moonbaseAlpha.id),
    broadcast: true,
  });

  // contract read
  async function getContractBalance() {
    return await read('balanceOf', [info.activeWallet?.address]);
  }

  // contract write
  async function mintEW(args: Array<any>, value: bigint, gasLimit: bigint) {
    const chainId = Number(network.value?.id || moonbaseAlpha.id);

    // Not working
    // await write('mint', args, 'Mint');

    // Working
    const signedTx = await wallet.value?.signPlainTransaction({
      mustConfirm: true,
      tx: {
        to: contractAddress,
        data: encodeFunctionData({ abi: nftAbi, functionName: 'mint', args }),
        gasLimit,
        value,
        chainId,
      },
    });

    if (signedTx?.signedTxData) {
      const tx = await wallet.value?.broadcastTransaction(signedTx.signedTxData, chainId);
      return tx?.txHash;
    }
    return null;
  }

  return { getContractBalance, mintEW };
}
