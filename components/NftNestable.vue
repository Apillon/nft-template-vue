<template>
  <div class="parent-token">
    <div :id="'nft_' + nft.id" class="nft">
      <img :src="nft.image" class="nft_img" :alt="nft.name" />
      <div class="nft_content">
        <h3>{{ nft.name || `#${nft.id}` }}</h3>
        <p>{{ nft.description }}</p>
        <button v-if="isNestable" @click="showModalNft()">Open NFT</button>
      </div>
    </div>
  </div>
  <div class="nested-tokens">
    <div class="nestable">
      <div class="nestable-actions">
        <div v-if="hasPendingChildren" class="btn-group">
          <div v-if="pendingChild" class="child-pending">
            <div>
              Address: <small>{{ pendingChild.contractAddress }}</small>
            </div>
            <div>
              Id: <strong>{{ pendingChild.tokenId }}</strong>
            </div>
          </div>
          <div v-if="pendingChild" class="actions">
            <Btn
              :loading="loadingAccept"
              @click="acceptChildWrapper(pendingChild.contractAddress, pendingChild.tokenId)"
            >
              Accept Child
            </Btn>
            <Btn
              :loading="loadingReject"
              @click="rejectAllChildrenWrapper(nft.id, pendingChildren.length)"
            >
              Reject All Children
            </Btn>
          </div>
        </div>
        <div class="btn-group">
          <div class="field">
            <label :for="`addressNestMint$_${nft.id}`">Contract Address:</label>
            <input
              :id="`addressNestMint_${nft.id}`"
              v-model="addressNestMint"
              type="text"
              @change="handleChangeNestMint"
            />
          </div>
          <Btn :loading="loadingNestMint" @click="childNestMintWrapper()"> Nest Mint </Btn>
        </div>
        <div class="btn-group">
          <div class="field">
            <label :for="`addressTransferFrom_${nft.id}`">Contract Address:</label>
            <input
              :id="`addressTransferFrom_${nft.id}`"
              v-model="addressTransferFrom"
              type="text"
              @change="handleChangeTransferFrom"
            />
          </div>
          <div class="field">
            <label :for="`tokenTransferFrom_${nft.id}`">Token ID:</label>
            <input
              :id="`tokenTransferFrom_${nft.id}`"
              v-model="tokenTransferFrom"
              type="number"
              :min="1"
              :step="1"
              @change="handleChangeTokenTransferFrom"
            />
          </div>
          <Btn :loading="loadingTransferFrom" @click="nestTransferFromWrapper()">
            Nest Transfer From
          </Btn>
        </div>
      </div>
      <template v-if="hasChildren">
        <p>
          <strong>Nested NFTs:</strong>
        </p>
        <div class="grid">
          <NftNestedChild
            v-for="(child, key) in children"
            :key="key"
            :parent-id="nft.id"
            :child-nft="child"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BigNumber } from 'ethers';

const props = defineProps({
  nft: { type: Object as VuePropType<Nft>, required: true },
});

const { state } = useNft();
const {
  childrenOf,
  pendingChildrenOf,
  acceptChild,
  rejectAllChildren,
  childNestMint,
  nestTransferFrom,
} = useNestable();

const loadingAccept = ref<boolean>(false);
const loadingReject = ref<boolean>(false);
const loadingNestMint = ref<boolean>(false);
const loadingTransferFrom = ref<boolean>(false);

const addressNestMint = ref<string>('');
const addressTransferFrom = ref<string>('');
const tokenTransferFrom = ref<number>(0);

// check if nestable NFT has any children or pending children
const pendingChild = ref<Child>();
const pendingChildren = ref<Child[]>([]);
const children = ref<Child[]>([]);

onMounted(async () => {
  children.value = await childrenOf(props.nft.id);
  pendingChildren.value = await pendingChildrenOf(props.nft.id);

  if (pendingChildren.value && pendingChildren.value.length) {
    pendingChild.value = pendingChildren.value[0];
  }
});

const hasChildren = computed(() => {
  return children.value && children.value.length > 0;
});
const hasPendingChildren = computed(() => {
  return pendingChildren.value && pendingChildren.value.length > 0;
});

async function acceptChildWrapper(childAddress: string, childId: BigNumber) {
  loadingAccept.value = true;

  const status = await acceptChild(props.nft.id, 0, childAddress, childId.toNumber());
  if (status) {
    useNuxtApp().$toast.success('Token has been accepted');
  } else {
    useNuxtApp().$toast.error('Token could not be accepted!');
  }

  loadingAccept.value = false;
}

async function rejectAllChildrenWrapper(parentId: number, pendingChildrenNum = 1) {
  loadingReject.value = true;

  const status = await rejectAllChildren(parentId, pendingChildrenNum);
  if (status) {
    useNuxtApp().$toast.success('Tokens has been rejected');
  } else {
    useNuxtApp().$toast.error('Tokens could not be rejected!');
  }

  loadingReject.value = false;
}

async function childNestMintWrapper() {
  loadingNestMint.value = true;

  const address = addressNestMint.value || state.nftAddress;
  const status = await childNestMint(address, 1, props.nft.id);
  if (status) {
    useNuxtApp().$toast.success('Token has been minted');
  } else {
    useNuxtApp().$toast.error('Token could not be minted! Check contract address.');
  }

  loadingNestMint.value = false;
}

async function nestTransferFromWrapper() {
  loadingTransferFrom.value = true;

  if (checkInputAddress(addressTransferFrom.value) && checkInputToken(tokenTransferFrom.value)) {
    const status = await nestTransferFrom(
      addressTransferFrom.value,
      state.nftAddress,
      tokenTransferFrom.value,
      props.nft.id,
      '0x'
    );
    if (status) {
      useNuxtApp().$toast.success('Token has been transferred');
    } else {
      useNuxtApp().$toast.error('Token could not be transferred! Wrong token address or token ID.');
    }
  }

  loadingTransferFrom.value = false;
}

const handleChangeNestMint = (event: Event) => {
  addressNestMint.value = (event.target as HTMLInputElement)?.value || '';
};
const handleChangeTransferFrom = (event: Event) => {
  addressTransferFrom.value = (event.target as HTMLInputElement)?.value || '';
};
const handleChangeTokenTransferFrom = (event: Event) => {
  tokenTransferFrom.value = Number((event.target as HTMLInputElement)?.value) || 1;
};
</script>
