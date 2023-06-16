<template>
  <div id="collection" class="collection-info">
    <div>
      <b> Name: </b>
      {{ collection.name }}
    </div>
    <div>
      <b> Symbol: </b>
      {{ collection.symbol }}
    </div>
    <div>
      <b> Soulbound: </b>
      {{ collection.soulbound ? 'TRUE' : 'FALSE' }}
    </div>
    <div>
      <b> Supply: </b>
      {{ totalSupply }}/{{ maxSupply }}
    </div>
    <div v-if="collection.drop">
      <div>
        <b> Price: </b>
        {{ price }}
      </div>
      <h3 v-if="totalSupply === maxSupply">Sold out!</h3>

      <div v-else-if="dropStartTimestamp > Date.now()" id="drop" class="drop">
        <div>
          <b> Drop: </b>
          {{ dropStartDate.toDateString() }}{{ ' ' }} {{ dropStartDate.toLocaleTimeString() }}
          {{ days }} <b>d </b> {{ hours }} <b>h </b> {{ minutes }} <b>m </b> {{ seconds }} <b>s </b>
        </div>
      </div>

      <Mint v-else :price="collection.price" :provider="provider" :address="address" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ethers, providers } from 'ethers';

const props = defineProps({
  collection: { type: Object, default: null },
  provider: { type: Object as VuePropType<providers.Web3Provider>, required: true },
  address: { type: String, default: '' },
});

const totalSupply = ref<number>(props.collection.totalSupply.toNumber());
const maxSupply = ref<number>(props.collection.maxSupply.toNumber());
const dropStartDate = ref<Date>(new Date(props.collection.dropStart.toNumber() * 1000));
const dropStartTimestamp = ref<number>(props.collection.dropStart.toNumber() * 1000);
const price = ref<string>(ethers.utils.formatEther(props.collection.price));

const days = ref<number>(0);
const hours = ref<number>(0);
const minutes = ref<number>(0);
const seconds = ref<number>(0);

onMounted(() => {
  loadInfo();
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
