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
            <label for="addressNestMint${fieldId}_${id}">Contract Address:</label>
            <input id="addressNestMint${fieldId}_${id}" type="text" />
          </div>
          <button
            id="childNestMint${fieldId}_${id}"
            onclick="childNestMintWrapper(${id}, '${fieldId}_${id}');"
          >
            Nest Mint
          </button>
        </div>
        <div class="btn-group">
          <div class="field">
            <label for="addressTransferFrom${fieldId}_${id}">Contract Address:</label>
            <input id="addressTransferFrom${fieldId}_${id}" type="text" />
          </div>
          <div class="field">
            <label for="tokenTransferFrom${fieldId}_${id}">Token ID:</label>
            <input id="tokenTransferFrom${fieldId}_${id}" type="number" />
          </div>
          <button
            id="nestTransferFrom${fieldId}_${id}"
            onclick="nestTransferFromWrapper(${id}, '${fieldId}_${id}');"
          >
            Nest Transfer From
          </button>
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

const { childrenOf, pendingChildrenOf, acceptChild, rejectAllChildren } = useNestable();

const loadingAccept = ref<boolean>(false);
const loadingReject = ref<boolean>(false);

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
  console.log(props.nft.id, childAddress, childId);

  const status = await acceptChild(props.nft.id, 0, childAddress, childId.toNumber());
  // transactionStatus(status, "Token could not be accepted!", fieldId);

  loadingAccept.value = false;
}

async function rejectAllChildrenWrapper(parentId: number, pendingChildrenNum = 1) {
  loadingReject.value = true;

  const status = await rejectAllChildren(parentId, pendingChildrenNum);
  // transactionStatus(status, "Token could not be rejected!", fieldId);

  loadingReject.value = false;
}
</script>
