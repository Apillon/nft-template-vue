<template>
  <div id="collection" class="collection-info">
    <div>
      <b> Collection address: </b>
      <a
        :href="contractLink(config.public.CONTRACT_ADDRESS, Number(config.public.CHAIN_ID))"
        target="_blank"
      >
        {{ config.public.CONTRACT_ADDRESS }}
        <img :src="LinkSVG" width="10" height="10" />
      </a>
    </div>
    <div>
      <b> Name: </b>
      {{ collection.name }}
    </div>
    <div>
      <b> Symbol: </b>
      {{ collection.symbol }}
    </div>
    <div>
      <b> Revocable: </b>
      {{ collection.revokable ? 'TRUE' : 'FALSE' }}
    </div>
    <div>
      <b> Soulbound: </b>
      {{ collection.soulbound ? 'TRUE' : 'FALSE' }}
    </div>
    <div>
      <b> Supply: </b>
      <template v-if="maxSupply === maxUint256.toString()"> {{ totalSupply }}/&infin; </template>
      <template v-else> {{ totalSupply }}/{{ maxSupply }}</template>
    </div>
    <div v-if="collection.drop" class="mx-auto w-fit max-w-lg">
      <div>
        <b> Price: </b>
        {{ price }}
      </div>

      <h3 v-if="totalSupply === maxSupply">Sold out!</h3>
      <div v-else-if="dropStartTimestamp > Date.now()" class="mx-auto w-fit max-w-lg">
        <div>
          <b> Drop: </b>
          {{ dropStartDate.toDateString() }}{{ ' ' }} {{ dropStartDate.toLocaleTimeString() }}
          {{ days }} <b>d </b> {{ hours }} <b>h </b> {{ minutes }} <b>m </b> {{ seconds }} <b>s </b>
        </div>
      </div>
      <FormMint v-else :price="collection.price.toString()" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatEther, maxUint256 } from 'viem';
import LinkSVG from '~/assets/icons/icon-open.svg';
import { contractLink } from '~/lib/chain';

const props = defineProps({
  collection: { type: Object as PropType<CollectionInfo>, default: null },
});

const config = useRuntimeConfig();
const { getBalance, getMaxSupply, getTotalSupply } = useContract();

const dropStartDate = ref<Date>(new Date(Number(props.collection.dropStart) * 1000));
const dropStartTimestamp = ref<number>(Number(props.collection.dropStart) * 1000);
const price = ref<string>(formatEther(props.collection.price));
const totalSupply = computed<String>(() => props.collection.totalSupply.toString());
const maxSupply = computed<String>(() => props.collection.maxSupply.toString());

const days = ref<number>(0);
const hours = ref<number>(0);
const minutes = ref<number>(0);
const seconds = ref<number>(0);

onMounted(() => {
  loadInfo();
  getBalance();
  getMaxSupply();
  getTotalSupply();
});

function loadInfo() {
  if (props.collection.drop) {
    if (dropStartTimestamp.value > Date.now()) {
      // The data/time we want to countdown to
      countdown(dropStartTimestamp.value);

      // Run myfunc every second
      const myfunc = setInterval(() => {
        countdown(dropStartTimestamp.value);
        // Display the message when countdown is over
        const timeleft = dropStartTimestamp.value - new Date().getTime();
        if (timeleft < 0) {
          clearInterval(myfunc);
        }
      }, 1000);
    }
  }
}

const countdown = (date: number) => {
  const now = new Date().getTime();
  const timeleft = date - now;

  // Calculating the days, hours, minutes and seconds left
  days.value = Math.floor(timeleft / (1000 * 60 * 60 * 24));
  hours.value = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes.value = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
  seconds.value = Math.floor((timeleft % (1000 * 60)) / 1000);
};
</script>
