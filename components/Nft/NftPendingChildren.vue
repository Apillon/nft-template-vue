<template>
  <div
    v-for="child in pendingChildren"
    class="pending-child"
    :loading="loading"
    @click="acceptChildWrapper(child.contractAddress, child.tokenId)"
  >
    Accept Child: {{ child.tokenId }}
  </div>
</template>

<script lang="ts" setup>
import { BigNumber } from 'ethers';

const props = defineProps({
  nftId: { type: Number, default: '' },
});

const { pendingChildrenOf, acceptChild } = useNestable();

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
</script>
