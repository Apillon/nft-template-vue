<template>
  <div v-if="children && children.length > 0" class="nft-children">
    <h3>Children</h3>
    <div class="grid small">
      <NftNestedChild
        v-for="(child, key) in children"
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

const { childrenOf } = useNestable();

const children = ref<Child[]>([]);

onMounted(async () => {
  children.value = await childrenOf(props.parentId);
});
</script>
