<template>
  <div
    class="mb-8 flex flex-row items-center justify-between rounded-xl bg-bgDarker bg-contain bg-center bg-no-repeat px-8 mobile:flex-wrap mobile:justify-center"
    :style="cover ? { backgroundImage: `url(${cover})` } : {}"
  >
    <div class="md:mr-5 md:max-w-md">
      <h1 class="text-white">
        A matter of minutes. And zero developing costs. Want to build your own NFT collection?
      </h1>
      <a
        href="https://apillon.io/"
        class="inline-block text-sm font-bold leading-6 text-yellow transition-all duration-300 ease-in-out hover:bg-yellow hover:text-bgDarker"
        target="_blank"
      >
        Build with Apillon
      </a>
    </div>
    <div class="inline-flex">
      <img v-if="config.public.IMG_LOGO" :src="config.public.IMG_LOGO" height="126" />
      <img v-else :src="HeaderSVG" height="126" />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderSVG from '~/assets/images/header.svg';
const config = useRuntimeConfig();

const cover = ''; // config.public.IMG_COVER;
</script>
