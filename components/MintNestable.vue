<template>
  <div class="mintNestable">
    <div>
      <strong>Mint this collection</strong>
      <Btn :loading="loadingMint" @click="mintWrapper()">Mint</Btn>
    </div>
    <br />
    <div>
      <strong>Or mint another nestable collection</strong>
    </div>
    <br />
    <div class="field">
      <label for="address">Contract Address:</label>
      <input id="address" v-model="address" type="text" @change="handleChange" />
    </div>
    <Btn :loading="loadingNestMint" @click="childMintWrapper()">Mint</Btn>
  </div>
</template>

<script lang="ts" setup>
const { childMint } = useNestable();

const config = useRuntimeConfig();
const loadingMint = ref<boolean>(false);
const loadingNestMint = ref<boolean>(false);
const address = ref<string>('');

async function mintWrapper() {
  loadingMint.value = true;

  await childMint(config.public.NFT_ADDRESS, 1);

  loadingMint.value = false;
}

async function childMintWrapper() {
  loadingNestMint.value = true;

  await childMint(address.value, 1);

  loadingNestMint.value = false;
}

const handleChange = (event: Event) => {
  address.value = (event.target as HTMLInputElement)?.value || '';
};
</script>
