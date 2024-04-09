<template>
  <div class="mintNestable">
    <div v-if="nftId">
      <div class="field amount">
        <label htmlFor="amount">Number of tokens (1-5):</label>
        <input v-model="amount" type="number" min="1" max="5" @change="handleAmountChange" />
      </div>
      <Btn :loading="loading" @click="childNestMintWrapper()">Mint Child</Btn>
    </div>
    <div v-else-if="address">
      <div class="field amount">
        <label htmlFor="amount">Number of tokens (1-5):</label>
        <input v-model="amount" type="number" min="1" max="5" @change="handleAmountChange" />
      </div>
      <div class="field">
        <label for="address">Child Contract Address:</label>
        <input id="address" v-model="address" type="text" @change="handleAddressChange" />
      </div>
      <Btn :loading="loading" @click="childMintWrapper()">Mint</Btn>
    </div>
    <div v-else>
      <div class="field amount">
        <label htmlFor="amount">Number of tokens (1-5):</label>
        <input v-model="amount" type="number" min="1" max="5" @change="handleAmountChange" />
      </div>
      <Btn :loading="loading" @click="mintWrapper()">Mint</Btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  address: { type: String, default: '' },
  nftId: { type: Number, default: null },
});
const { childMint } = useNestable();
const { childNestMint } = useNestable();

const config = useRuntimeConfig();
const loading = ref<boolean>(false);
const address = ref<string>('');
const amount = ref<number>(1);

async function mintWrapper() {
  loading.value = true;
  await childMint(config.public.CONTRACT_ADDRESS, amount.value);
  loading.value = false;
}

async function childMintWrapper() {
  loading.value = true;
  await childMint(address.value, amount.value);
  loading.value = false;
}

async function childNestMintWrapper() {
  loading.value = true;
  await childNestMint(config.public.CONTRACT_ADDRESS, amount.value, props.nftId);
  loading.value = false;
}

const handleAddressChange = (event: Event) => {
  address.value = (event.target as HTMLInputElement)?.value || '';
};

const handleAmountChange = (event: Event) => {
  amount.value = parseInt((event.target as HTMLInputElement)?.value || '0');
};
</script>
