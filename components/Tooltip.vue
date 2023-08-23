<template>
  <span class="tooltip" :tooltip="tooltipText" :position="position">
    <template v-if="$slots.default"><slot /></template>
    <template v-else>
      <img :src="InfoSVG" width="16" height="16" alt="icon info" />
    </template>
  </span>
</template>

<script lang="ts" setup>
import InfoSVG from '~/assets/icons/info.svg';
defineProps({
  tooltipText: { type: String, default: '' },
  position: { type: String, default: 'top' },
});
const $slots = useSlots();
</script>
