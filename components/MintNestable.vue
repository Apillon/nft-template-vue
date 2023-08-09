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

  const status = await childMint(config.public.NFT_ADDRESS, 1);
  if (status) {
    useNuxtApp().$toast.success('Token has been minted');
  } else {
    useNuxtApp().$toast.error('Token could not be minted! All tokens has already been minted.');
  }
  loadingMint.value = false;
}

async function childMintWrapper() {
  loadingNestMint.value = true;

  const status = await childMint(address.value, 1);
  if (status) {
    useNuxtApp().$toast.success('Token has been minted');
  } else {
    useNuxtApp().$toast.error(
      'Token could not be minted! Wrong address or all tokens has already been minted.'
    );
  }

  loadingNestMint.value = false;
}

const handleChange = (event: Event) => {
  address.value = (event.target as HTMLInputElement)?.value || '';
};
</script>
