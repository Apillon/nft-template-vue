<template>
  <div v-if="loading" class="relative">
    <Spinner />
  </div>
  <div v-else-if="metadata && metadata.name" class="box nft">
    <img :src="imageLink(metadata.image)" :alt="metadata.name" />
    <div class="box-content">
      <h3>#{{ metadata.id }} {{ metadata.name }}</h3>
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
  childNft: { type: Object as PropType<Child>, required: true },
});

const { state, getNftContract } = useNft();
const { transferChild } = useNestable();

const metadata = ref<Nft>({} as Nft);
const loading = ref<boolean>(true);
const loadingTransfer = ref<boolean>(false);

onMounted(async () => {
  try {
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
  } catch (error) {}
  loading.value = false;
});

async function transferChildWrapper(contractAddress: string, childId: BigNumber) {
  loadingTransfer.value = true;

  await transferChild(
    props.parentId,
    state.walletAddress,
    0,
    0,
    contractAddress,
    childId.toNumber(),
    false,
    '0x'
  );
  loadingTransfer.value = false;
}
</script>
