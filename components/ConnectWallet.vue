<template>
  <div v-if="connected" v-bind="$attrs" class="flex items-center justify-end gap-2">
    <strong v-if="walletAddress"> ({{ shortHash(walletAddress) }}) </strong>
    <Btn type="secondary" :loading="loading" @click="disconnect()"> Disconnect </Btn>
  </div>
  <Btn v-else v-bind="$attrs" :loading="loading" round @click="openModal"> Connect wallet </Btn>

  <EmbeddedWallet
    v-if="!!config.public.EMBEDDED_WALLET_CLIENT && !!network"
    :client-id="config.public.EMBEDDED_WALLET_CLIENT"
    passkey-auth-mode="popup"
    :default-network-id="network.id"
    :networks="networks"
  />

  <Modal
    :show="modalWalletVisible"
    @close="() => (modalWalletVisible = false)"
    @update:show="modalWalletVisible = false"
  >
    <FormWallet>
      <Btn
        v-if="!!config.public.EMBEDDED_WALLET_CLIENT"
        type="secondary"
        size="large"
        @click="openWallet"
      >
        <span class="mr-1">▶◀</span> Apillon Embedded Wallet
      </Btn>
    </FormWallet>
  </Modal>
</template>

<script lang="ts" setup>
import { EmbeddedWallet, useWallet } from '@apillon/wallet-vue';
import { useAccount, useAccountEffect, useChains } from '@wagmi/vue';

const config = useRuntimeConfig();
const chains = useChains();
const { wallet } = useWallet();
const { isConnected } = useAccount();
const { loading, modalWalletVisible, network, connected, walletAddress, disconnectWallet } = useWalletConnect();

useAccountEffect({
  onConnect: () => closeWallet(),
  onDisconnect: () => closeWallet(),
});

const networks = chains.value.map(chain => ({
  name: chain.name,
  id: chain.id,
  rpcUrl: chain.rpcUrls.default.http[0],
  explorerUrl: chain.blockExplorers?.default?.url,
}));

function openModal() {
  modalWalletVisible.value = false;
  setTimeout(() => {
    modalWalletVisible.value = true;
  }, 1);
}

function openWallet() {
  if (wallet.value) {
    wallet.value.events.emit('open', true);
    modalWalletVisible.value = false;
  }
}
function closeWallet() {
  if (wallet.value) {
    wallet.value.events.emit('open', false);
  }
  modalWalletVisible.value = false;
}
function disconnect() {
  if (isConnected.value) {
    disconnectWallet();
  } else if (wallet.value) {
    wallet.value.events.emit('open', true);
  }
}
</script>
