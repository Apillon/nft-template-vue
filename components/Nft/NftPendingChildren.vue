<template>
  <template v-if="pendingChildren && pendingChildren.length > 0">
    <div
      v-for="child in pendingChildren"
      class="pending-child"
      :loading="loading"
      @click="acceptChildWrapper(child.contractAddress, child.tokenId)"
    >
      Accept Child: {{ child.tokenId }}
    </div>
    <div class="pending-child" :loading="loading" @click="rejectChildrenWrapper()">
      <span v-if="pendingChildren.length > 1">Reject Children</span>
      <span v-else>Reject Child</span>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { BigNumber } from 'ethers';

const props = defineProps({
  nftId: { type: Number, default: '' },
});

const { pendingChildrenOf, acceptChild, rejectAllChildren } = useNestable();

const loading = ref<boolean>(false);

// check if nestable NFT has any children or pending children
const pendingChildren = ref<Child[]>([]);

onMounted(async () => {
  if (props.nftId) {
    pendingChildren.value = await pendingChildrenOf(props.nftId);
  }
});

async function acceptChildWrapper(childAddress: string, childId: BigNumber) {
  loading.value = true;
  await acceptChild(props.nftId, 0, childAddress, childId.toNumber());
  loading.value = false;
}

async function rejectChildrenWrapper() {
  loading.value = true;
  await rejectAllChildren(props.nftId, pendingChildren.value.length);
  loading.value = false;
}
</script>
