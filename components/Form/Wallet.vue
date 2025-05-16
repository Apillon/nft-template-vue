<script lang="ts" setup>
import type { CreateConnectorFn, Connector } from '@wagmi/vue';
import { useConnect, useAccount } from '@wagmi/vue';

const { isConnecting, isConnected, connector } = useAccount();
const { connect, connectors } = useConnect();
const connectorName = ref('');

function connectWallet(conn: Connector<CreateConnectorFn>) {
  if (isConnected.value && conn.type === connector.value?.type) {
    console.debug('Already connected to this wallet');
  } else {
    connectorName.value = conn.name;
    connect({ connector: conn });
  }
}
</script>

<template>
  <div class="mx-auto my-12 w-full max-w-md text-center md:px-6">
    <h2 class="my-4">Your NFTs, delivered with style</h2>
    <div>Email them. Airdrop them. Share a link. <br />No gas fees. No fuss.</div>

    <hr class="dark:border-bg-lighter my-4 border-grey-transparent" />
    <h4 class="my-4">Connect your wallet to get started:</h4>

    <div class="flex flex-col gap-2">
      <slot />
      <Btn
        v-for="(c, key) in connectors"
        :key="key"
        type="secondary"
        size="large"
        :loading="isConnecting && connectorName === c.name"
        @click="connectWallet(c)"
      >
        <span class="inline-flex items-center gap-2">
          <NuxtIcon :name="`logo/${c.type}`" class="text-xl" filled />
          <span>{{ c.name }}</span>
        </span>
      </Btn>
    </div>
  </div>
</template>
