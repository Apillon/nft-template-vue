<template>
  <div class="mt-4">
    <div class="amount">
      <label htmlFor="amount">Number of tokens (1-5):</label>
      <input v-model="amount" type="number" min="1" max="5" @change="handleChange" />
    </div>
    <Btn class="mt-2 inline-block w-fit min-w-[120px]" :loading="loading" @click="mint">Mint</Btn>
  </div>
</template>

<script lang="ts" setup>
import { createPublicClient, http } from 'viem';
const props = defineProps({
  price: { type: String, default: '0' },
});
const txWait = useTxWait();
const { $toast } = useNuxtApp();
const { addNftId, addtMyNftIDs, fetchNft } = useNft();
const { mintToken, getBalance, getTotalSupply } = useContract();
const { network } = useWalletConnect();
const publicClient = createPublicClient({ chain: network.value, transport: http() });

const loading = ref<boolean>(false);
const amount = ref<number>(1);

async function mint() {
  if (!checkInputAmount(amount.value)) {
    $toast('Wrong amount, please enter number between 1 and 5.', { type: 'warning' });
    return;
  }

  loading.value = true;
  try {
    const tx = await mintToken(BigInt(props.price), amount.value);
    if (!tx) {
      $toast('Mint failed, please try again!', { type: 'error' });
      return;
    }

    $toast('NFT minting has started', { type: 'info' });
    txWait.hash.value = tx;
    const receipt = await Promise.race([
      txWait.wait(),
      publicClient.waitForTransactionReceipt({ hash: tx }),
    ]);
    $toast('NFT has been successfully minted', { type: 'success' });

    const logs = receipt?.logs || receipt.data?.logs;
    if (logs && logs[0].topics[3]) {
      const nftId = Number(logs[0].topics[3]);

      setTimeout(() => onNftMinted(nftId), 1000);
    } else {
      $toast('Mint failed, please check status of transaction on contract!', { type: 'error' });
    }
  } catch (e) {
    console.error(e);
    transactionError('Unsuccessful mint', e);
  }

  setTimeout(() => {
    loading.value = false;
  }, 300);
}

async function onNftMinted(nftId: number) {
  addtMyNftIDs(nftId);
  getBalance();
  getTotalSupply();
  const metadata = await fetchNft(nftId);
  if (metadata) {
    addNftId(nftId, metadata);
  }
}

const handleChange = (event: Event) => {
  amount.value = Number((event.target as HTMLInputElement)?.value) || 1;
};
</script>
