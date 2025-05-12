import { toast } from 'vue3-toastify';

function browserName() {
  const userAgent = navigator.userAgent;
  let browserName = '';

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = 'chrome';
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = 'firefox';
  } else if (userAgent.match(/safari/i)) {
    browserName = 'safari';
  } else if (userAgent.match(/opr\//i)) {
    browserName = 'opera';
  } else if (userAgent.match(/edg/i)) {
    browserName = 'edge';
  } else if (userAgent.match(/brave/i)) {
    browserName = 'brave';
  } else {
    browserName = 'No browser detection';
  }
  return browserName;
}
function browserSupportsMetaMask() {
  return ['chrome', 'firefox', 'brave', 'edge', 'opera'].includes(browserName());
}
export const metamaskNotSupportedMessage = () => {
  return browserSupportsMetaMask()
    ? 'You need MetaMask extension to connect wallet!'
    : 'Your browser does not support MetaMask, please use another browser!';
};

export const addChain = async (chainId: string) => {
  const { ethereum } = window;

  if (chainId === '0x507') {
    // moonbase
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId,
          rpcUrls: ['https://rpc.api.moonbase.moonbeam.network/'],
          chainName: 'Moonbase',
          nativeCurrency: {
            name: 'DEV',
            symbol: 'DEV',
            decimals: 18,
          },
          blockExplorerUrls: ['https://moonbase.moonscan.io/'],
        },
      ],
    });
  } else if (chainId === '0x504') {
    // moonbeam
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId,
          rpcUrls: ['https://rpc.api.moonbeam.network/'],
          chainName: 'Moonbeam',
          nativeCurrency: {
            name: 'GLMR',
            symbol: 'GLMR',
            decimals: 18,
          },
          blockExplorerUrls: ['https://moonscan.io/'],
        },
      ],
    });
  } else if (chainId === '0x250') {
    // moonbeam
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId,
          rpcUrls: ['https://evm.astar.network/'],
          chainName: 'Astar',
          nativeCurrency: {
            name: 'ASTR',
            symbol: 'ASTR',
            decimals: 18,
          },
          blockExplorerUrls: ['https://blockscout.com/astar'],
        },
      ],
    });
  } else {
    throw new Error('Wrong CHAIN_ID');
  }
};

export const getCurrentChain = async (): Promise<string> => {
  const { ethereum } = window;
  return await ethereum.request({ method: 'eth_chainId' });
};
export const switchChain = async (chainId: string) => {
  const { ethereum } = window;
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId }], // chainId must be in HEX with 0x in front
  });
};

export function checkInputAddress(address?: string) {
  if (!address) {
    useNuxtApp().$toast.warning('Enter contract address!');
    return false;
  }
  return true;
}
export function checkInputAmount(amount?: number | string) {
  if (amount && Number(amount) > 0 && Number(amount) <= 5) {
    return true;
  }
  useNuxtApp().$toast.warning('Enter valid amount (number from 1 to 5)!');
  return false;
}
export function checkInputToken(token?: number | string) {
  if (token && Number(token) >= 0) {
    return true;
  }
  useNuxtApp().$toast.warning('Please select NFT');
  return false;
}

export function transactionError(msg: string, error: any) {
  if (error) {
    const errorMsg =
      typeof error === 'string'
        ? error
        : typeof error === 'object' && error?.data?.message
          ? error.data.message
          : typeof error === 'object' && error?.message
            ? error.message
            : JSON.stringify(error);

    if (errorMsg.includes('rejected') || errorMsg.includes('denied')) {
      toast('Transaction has been rejected', { type: 'info' });
      return;
    } else if (errorMsg.includes('OutOfFund')) {
      toast('Your account balance is too low', { type: 'warning' });
      return;
    } else if (errorMsg.includes('account balance too low')) {
      toast('Your account balance is too low', { type: 'warning' });
      return;
    } else if (error?.message.includes('transaction')) {
      toast('Transaction failed', { type: 'warning' });
      return;
    }
  }
  toast(msg, { type: 'error' });
}

export function imageLink(imageUrl: string) {
  return imageUrl.startsWith('ipfs://')
    ? imageUrl.replace('ipfs://', 'https://w3s.link/ipfs/')
    : imageUrl;
}
