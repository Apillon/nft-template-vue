import { useAccount } from '@apillon/wallet-vue';
import { useConnectorClient } from '@wagmi/vue';
import { createPublicClient, getContract, http, type Address } from 'viem';

const collectionInfo = reactive<CollectionInfo>({
  balance: 0n,
  drop: null,
  dropStart: 0,
  autoIncrement: null,
  maxSupply: 0n,
  name: '',
  price: 0n,
  reserve: 0n,
  revokable: null,
  soulbound: null,
  symbol: '',
  totalSupply: 0n,
});
const contract = ref();

export default function useContract() {
  const config = useRuntimeConfig();
  const { info } = useAccount();
  const { data: walletClient } = useConnectorClient();
  const { getContractBalance, mintEW } = useEmbeddedWallet();
  const { network, walletAddress, ensureCorrectNetwork } = useWalletConnect();
  const publicClient = createPublicClient({ chain: network.value, transport: http() });

  const contractAddress = config.public.CONTRACT_ADDRESS as Address;

  async function initContract(write = false) {
    if (contract.value && (!write || contract.value.write)) return;

    await ensureCorrectNetwork();
    contract.value = getContract({
      address: contractAddress,
      abi: nftAbi,
      client: {
        public: publicClient,
        wallet: walletClient.value,
      },
    });
  }

  /**
   * Read contract
   */
  async function getBalance(force = false): Promise<number> {
    if ((!collectionInfo.balance || force) && walletAddress.value) {
      await initContract();
      if (info.activeWallet?.address) {
        collectionInfo.balance = await getContractBalance();
      } else {
        collectionInfo.balance = await contract.value.read.balanceOf([walletAddress.value]);
      }
    }
    return Number(collectionInfo.balance);
  }
  async function getDrop(): Promise<boolean> {
    if (collectionInfo.drop === null) {
      await initContract();
      collectionInfo.drop = await contract.value.read.isDrop([]);
    }
    return !!collectionInfo.drop;
  }
  async function getDropStart(): Promise<number> {
    if (!collectionInfo.dropStart) {
      await initContract();
      collectionInfo.dropStart = await contract.value.read.dropStart([]);
    }
    return collectionInfo.dropStart;
  }
  async function isAutoIncrement(): Promise<boolean> {
    if (collectionInfo.autoIncrement === null) {
      await initContract();
      collectionInfo.autoIncrement = await contract.value.read.isAutoIncrement([]);
    }
    return collectionInfo.autoIncrement || true;
  }
  async function getMaxSupply(): Promise<number> {
    if (collectionInfo.maxSupply === 0n) {
      await initContract();
      collectionInfo.maxSupply = await contract.value.read.maxSupply([]);
    }
    return Number(collectionInfo.maxSupply);
  }
  async function getName(): Promise<string> {
    if (!collectionInfo.name) {
      await initContract();
      collectionInfo.name = await contract.value.read.name([]);
    }
    return collectionInfo.name;
  }

  async function getPrice(): Promise<number> {
    if (collectionInfo.price === 0n) {
      await initContract();
      collectionInfo.price = await contract.value.read.pricePerMint([]);
    }
    return Number(collectionInfo.price);
  }
  async function getReserve(): Promise<number> {
    if (collectionInfo.reserve === 0n) {
      await initContract();
      collectionInfo.reserve = await contract.value.read.reserve([]);
    }
    return Number(collectionInfo.reserve);
  }
  async function getRevokable(): Promise<boolean> {
    if (collectionInfo.revokable === null) {
      await initContract();
      collectionInfo.revokable = await contract.value.read.isRevokable([]);
    }
    return !!collectionInfo.revokable;
  }
  async function getSoulbound(): Promise<boolean> {
    if (collectionInfo.soulbound === null) {
      await initContract();
      collectionInfo.soulbound = await contract.value.read.isSoulbound([]);
    }
    return !!collectionInfo.soulbound;
  }
  async function getSymbol(): Promise<string> {
    if (!collectionInfo.symbol) {
      await initContract();
      collectionInfo.symbol = await contract.value.read.symbol([]);
    }
    return collectionInfo.symbol;
  }
  async function getTotalSupply(force = false): Promise<number> {
    if (force || collectionInfo.totalSupply === 0n) {
      await initContract();
      collectionInfo.totalSupply = await contract.value.read.totalSupply([]);
    }
    return Number(collectionInfo.totalSupply);
  }
  async function getTokenByIndex(index: number) {
    await initContract();
    return await contract.value.read.tokenByIndex([index]);
  }
  async function getTokenOfOwner(index: number) {
    await initContract();
    return await contract.value.read.tokenOfOwnerByIndex([walletAddress.value, index]);
  }
  async function getTokenUri(id: number): Promise<string> {
    await initContract();
    return await contract.value.read.tokenURI([id]);
  }

  /**
   * Write contract
   */

  async function mintToken(price: bigint, amount = 1): Promise<Address | void> {
    const value = price * BigInt(amount);
    const args = [walletAddress.value, amount];

    const gas = await publicClient.estimateContractGas({
      address: contractAddress,
      abi: nftAbi,
      functionName: 'mint',
      args,
      account: walletAddress.value,
      value,
    });
    const gasLimit = (gas * 110n) / 100n;

    if (info.activeWallet?.address) {
      return await mintEW(args, value, gasLimit);
    }
    await initContract(true);
    return await contract.value.write.mint(args, { value }, { gasLimit });
  }

  /**
   * Actions
   */
  async function getCollectionInfo(): Promise<CollectionInfo> {
    await Promise.all([
      getBalance(),
      getDrop(),
      getDropStart(),
      isAutoIncrement(),
      getMaxSupply(),
      getName(),
      getPrice(),
      getReserve(),
      getRevokable(),
      getSoulbound(),
      getSymbol(),
      getTotalSupply(),
    ]);
    return collectionInfo;
  }

  return {
    collectionInfo: readonly(collectionInfo),
    getCollectionInfo,
    getBalance,
    getMaxSupply,
    getTokenByIndex,
    getTokenOfOwner,
    getTokenUri,
    getTotalSupply,
    mintToken,
  };
}
