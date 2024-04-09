<template>
  <div v-if="stateNestable.children.length > 0" class="nft-children">
    <h3>Children</h3>
    <div class="grid small">
      <NftNestedChild
        v-for="(child, key) in stateNestable.children"
        :key="key"
        :parent-id="parentId"
        :child-nft="child"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  parentId: { type: Number, default: 0 },
});

const { stateNestable, getChildren } = useNestable();

onMounted(async () => {
  await getChildren(props.parentId);
});
</script>
