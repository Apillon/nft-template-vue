<template>
  <div class="mint">
    <div class="amount">
      <label htmlFor="amount">Number of tokens (1-5):</label>
      <input v-model="amount" type="number" min="1" max="5" @change="handleChange" />
    </div>
    <Btn id="btnMint" class="btn-mint" :loading="loading" @click="mint">Mint</Btn>
  </div>
</template>

<script lang="ts" setup>
import { BigNumber, ethers, providers } from 'ethers';

const props = defineProps({
  provider: { type: Object as VuePropType<providers.Web3Provider>, required: true },
  address: { type: String, default: '' },
  price: { type: BigNumber, default: '' },
});

const config = useRuntimeConfig();
const loading = ref<boolean>(false);
const amount = ref<number>(1);

async function mint() {
  loading.value = true;

  try {
    const nftContract = new ethers.Contract(
      config.public.NFT_ADDRESS,
      nftAbi,
      props.provider
    ).connect(props.provider.getSigner());
    const value = props.price.mul(ethers.BigNumber.from(amount.value));

    const gasLimit = await nftContract
      .connect(props.provider.getSigner())
      .estimateGas.mint(props.address, amount, { value });

    await nftContract.mint(props.address, amount.value, {
      value,
      gasLimit: gasLimit.mul(11).div(10),
    });
  } catch (e) {
    console.error(e);
  }

  setTimeout(() => {
    loading.value = false;
  }, 300);
}

const handleChange = (event: Event) => {
  amount.value = Number((event.target as HTMLInputElement)?.value) || 1;
};
</script>
