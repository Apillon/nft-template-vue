import { useAccount, useContract, useWallet } from '@apillon/wallet-vue';
import { encodeFunctionData, type Address } from 'viem';
import { moonbaseAlpha } from 'viem/chains';

export default function useEmbeddedWallet() {
  const config = useRuntimeConfig();
  const { info } = useAccount();
  const { wallet } = useWallet();
  const { network } = useWalletConnect();

  const contractAddress = config.public.CONTRACT_ADDRESS as Address;

  const { read, write } = useContract({
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
  async function mintEW(args: Array<any>, value: bigint) {
    if (!wallet.value?.evm) return null;

    const label = 'Mint';
    const chainId = Number(network.value?.id || moonbaseAlpha.id);

    const signedTx = await wallet.value.evm.signContractWrite({
      contractAbi: nftAbi,
      contractAddress,
      contractFunctionName: 'mint',
      contractFunctionValues: args,
      contractTransactionValue: value,
      chainId,
      label,
      mustConfirm: true,
    });

    // PLAIN TRANSACTION
    // const signedTx = await wallet.value?.evm.signPlainTransaction({
    //   mustConfirm: true,
    //   tx: {
    //     to: contractAddress,
    //     data: encodeFunctionData({ abi: nftAbi, functionName: 'mint', args }),
    //     gasLimit,
    //     value,
    //     chainId,
    //   },
    // });

    if (signedTx) {
      const tx = await wallet.value.evm.broadcastTransaction(
        signedTx.signedTxData,
        signedTx.chainId,
        label
      );
      return tx?.txHash;
    }
    return null;
  }

  return { getContractBalance, mintEW };
}
