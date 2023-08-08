<template>
  <div v-if="metadata" class="box">
    <img :src="metadata.image" :alt="metadata.name" />
    <div class="box-content">
      <h3>{{ metadata.name || `#${metadata.id}` }}</h3>
      <p>{{ metadata.description }}</p>
      <div class="btn-group">
        <Btn
          :loading="loadingTransfer"
          @click="transferChildWrapper(childNft.contractAddress, childNft.tokenId)"
        >
          Transfer Token to wallet
        </Btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BigNumber } from 'ethers';

const props = defineProps({
  parentId: { type: Number, default: 0 },
  childNft: { type: Object as VuePropType<Child>, required: true },
});

const { walletAddress, getNftContract } = useNft();
const { transferChild } = useNestable();

const metadata = ref<Nft>({} as Nft);
const loading = ref<boolean>(true);
const loadingTransfer = ref<boolean>(false);

onMounted(async () => {
  const childNftContract = getNftContract(props.childNft.contractAddress);
  const nftUrl = await childNftContract.tokenURI(props.childNft.tokenId.toBigInt());

  const nftData = await fetch(nftUrl).then(response => {
    return response.json();
  });

  metadata.value = {
    id: props.childNft.tokenId.toNumber(),
    key: props.parentId,
    name: nftData.name,
    description: nftData.description,
    image: nftData.image,
  };

  loading.value = false;
});

async function transferChildWrapper(contractAddress: string, childId: BigNumber) {
  loadingTransfer.value = true;

  const status = await transferChild(
    props.parentId,
    walletAddress.value,
    0,
    0,
    contractAddress,
    childId.toNumber(),
    false,
    '0x'
  );
  // transactionStatus('Token could not be transferred! Wrong token address or token ID.');

  loadingTransfer.value = false;
}
</script>
