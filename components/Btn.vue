<template>
  <button v-bind="$attrs" @click="onClick">
    <span v-if="loading" :class="$style.btnSpinner">
      <Spinner />
    </span>
    <span :class="[loading ? $style['opacity-0'] : '']">
      <slot />
    </span>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps({
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(['click']);

function onClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault();
    event.stopPropagation();
  } else {
    emit('click', event);
  }
}
</script>

<style lang="postcss" module>
.btnSpinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.opacity-0 {
  opacity: 0;
}
</style>
