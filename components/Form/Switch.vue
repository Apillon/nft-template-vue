<script lang="ts" setup>
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  textOff: { type: String, default: '' },
  textOn: { type: String, default: '' },
});
const checkbox = ref<boolean>(props.modelValue);

function toggleCheckbox() {
  checkbox.value = !checkbox.value;
  emit('update:modelValue', checkbox.value);
}
function changeCheckbox(newValue: boolean) {
  checkbox.value = newValue;
  emit('update:modelValue', newValue);
}
</script>

<template>
  <label class="flex cursor-pointer items-center gap-2" for="switch">
    <strong v-if="textOff" class="text-sm" @click="changeCheckbox(false)">
      {{ textOff }}
    </strong>

    <span
      class="relative inline-block"
      :class="[
        { 'h-6 w-10': size === 'sm' },
        { 'h-8 w-16': size === 'md' },
        { 'h-10 w-20': size === 'lg' },
      ]"
    >
      <input
        v-bind="$attrs"
        :checked="modelValue"
        type="checkbox"
        class="invisible absolute h-0 w-0"
      />
      <span class="slider" :class="size" @click="toggleCheckbox()"></span>
    </span>

    <strong v-if="textOn" class="text-sm" @click="changeCheckbox(true)">
      {{ textOn }}
    </strong>
  </label>
</template>

<style lang="postcss" scoped>
.slider {
  @apply absolute bottom-0 left-0 right-0 top-0 cursor-pointer rounded-[2rem] bg-grey transition duration-300;
  &:before {
    @apply absolute bottom-1 left-1 h-6 w-6 rounded-full bg-white transition duration-300;
    content: '';
  }
  &.sm:before {
    @apply h-4 w-4;
  }
}
input:checked + .slider {
  @apply bg-secondary;
}
input:focus + .slider {
  @apply shadow-secondary;
}
input:checked + .slider:before {
  @apply left-auto right-1;
}
</style>
