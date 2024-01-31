<template>
  <template v-if="stateNestable.pendingChildren.length > 0">
    <div
      v-for="(child, key) in stateNestable.pendingChildren"
      class="pending-child relative"
      :class="{ disabled: key > 0 }"
      @click="acceptChildWrapper(child.contractAddress, child.tokenId)"
    >
      <Spinner v-if="loading && key === 0" :size="14" />
      <span v-else> Accept Child: {{ child.tokenId }} </span>
    </div>
    <div class="pending-child relative" :loading="loading" @click="rejectChildrenWrapper()">
      <Spinner v-if="loadingReject" :size="14" />
      <span v-else-if="stateNestable.pendingChildren.length > 1">Reject Children</span>
      <span v-else>Reject Child</span>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { BigNumber } from 'ethers';

const props = defineProps({
  nftId: { type: Number, default: '' },
});

const { stateNestable, getPendingChildren, acceptChild, rejectAllChildren } = useNestable();

const loading = ref<boolean>(false);
const loadingReject = ref<boolean>(false);

onMounted(async () => {
  if (props.nftId) {
    await getPendingChildren(props.nftId);
  }
});

async function acceptChildWrapper(childAddress: string, childId: BigNumber) {
  loading.value = true;
  await acceptChild(props.nftId, 0, childAddress, childId.toNumber());
  loading.value = false;
}

async function rejectChildrenWrapper() {
  loadingReject.value = true;
  await rejectAllChildren(props.nftId, stateNestable.pendingChildren.length);
  loadingReject.value = false;
}
</script>
