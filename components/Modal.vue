<template>
  <Transition name="fade-in">
    <div v-if="modalVisible" class="modal open">
      <div class="modal-bg modal-exit" @click="modalVisible = false">
        <div class="btn-modal-exit"></div>
      </div>
      <div class="modal-container">
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
