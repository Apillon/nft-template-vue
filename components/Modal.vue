<template>
  <Transition name="fade-in">
    <div
      v-if="modalVisible"
      class="open invisible fixed left-0 top-0 z-[1000] flex h-screen w-screen items-center justify-center opacity-0 transition-all duration-300 ease-in-out"
      :class="{ '!visible opacity-100 delay-0': modalVisible }"
    >
      <div
        class="modal-exit absolute h-full w-full bg-black bg-opacity-50"
        @click="modalVisible = false"
      ></div>
      <div
        class="relative max-h-[90vh] w-full max-w-[90vw] overflow-auto rounded-xl bg-white p-8 lg:max-w-3xl"
      >
        <div class="btn-modal-exit"></div>
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
});

const modalVisible = ref(props.show);

watch(
  () => props.show,
  show => {
    modalVisible.value = show;
  }
);
watch(
  () => modalVisible.value,
  visible => {
    if (visible) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'visible';
    }
  }
);
</script>
