<template>
    <div v-if="state.collectionLogo || state.collectionCover">
      <div class="collection-header">
        <div v-if="state.collectionLogo" class="logo-container">
          <img :src="state.collectionLogo" alt="Collection Logo" class="collection-logo" />
        </div>
        <h1 class="collection-title">Collection</h1>
      </div>
      <div v-if="state.collectionCover" class="cover-container">
        <img :src="state.collectionCover" alt="Collection Cover" class="collection-cover" />
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  const { state, getCollectionMetadata } = useNft();
  
  onMounted(() => {
    getCollectionMetadata();
  });
  
  </script>