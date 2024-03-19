<template>
  <div id="nftTransfer" class="nestable-info nft-transfer">
    <h3>Nesting NFTs from a different smart contract</h3>
    <p>
      To nest NFTs under the #{{ nft?.id }} {{ nft?.name }}, please select the NFTs you want to nest
      as children.
    </p>

    <div class="btn-group">
      <div class="field">
        <label for="address">
          Contract Address:
          <Tooltip
            class="large"
            tooltip-text="Enter child collection address from where you want to transfer NFT."
          />
        </label>
        <input
          id="address"
          v-model="contractAddress"
          type="text"
          @change="handleChangeContractAddress"
        />
      </div>
      <div class="field tokenId">
        <label for="tokenId">
          Token ID:
          <Tooltip
            class="large"
            tooltip-text="With Token ID you choose which token you will transfer."
          />
        </label>
        <input
          v-model="tokenId"
          id="tokenId"
          type="number"
          :min="1"
          :step="1"
          @change="handleChangeTokenId"
        />
      </div>
      <Btn :loading="loading" @click="nestTransferFromWrapper()">
        <span v-if="nft"> Nest selected NFT under `{{ nft.name }}`</span>
        <span v-else> Nest selected NFT</span>
      </Btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toast } from 'vue3-toastify';

const props = defineProps({
  nftId: { type: Number, default: '' },
});

const config = useRuntimeConfig();
const { state } = useNft();
const { stateNestable, getChildren, getPendingChildren, nestTransferFrom } = useNestable();

const loading = ref<boolean>(false);

const contractAddress = ref<string>('');
const tokenId = ref<number>(0);

const nft = computed(() => {
  return state.nfts.find(item => item.id === props.nftId);
});

const handleChangeContractAddress = (event: Event) => {
  contractAddress.value = (event.target as HTMLInputElement)?.value || '';
};
const handleChangeTokenId = (event: Event) => {
  tokenId.value = Number((event.target as HTMLInputElement)?.value) || 0;
};

async function nestTransferFromWrapper() {
  loading.value = true;

  await getChildren(tokenId.value);
  await getPendingChildren(tokenId.value);

  if (stateNestable.children.length > 0) {
    toast('This NFT already has children. Please remove his children or use another NFT.', {
      type: 'warning',
    });
  } else if (stateNestable.pendingChildren.length > 0) {
    toast('This NFT has pending children. Please reject his pending children or use another NFT.', {
      type: 'warning',
    });
  } else if (checkInputToken(tokenId.value)) {
    await nestTransferFrom(
      contractAddress.value,
      state.nftAddress,
      tokenId.value,
      props.nftId,
      '0x'
    );
  }
  loading.value = false;
}
</script>
