import { toast } from 'vue3-toastify';

export function sleep(timeMs = 1000) {
  return new Promise(resolve => setTimeout(resolve, timeMs));
}

export function numToBigInt(input: number) {
  return BigInt(input * 10 ** 18);
}
export function bigIntToNum(input: bigint | string | number) {
  return Number(BigInt(input) / 10n ** 18n);
}

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

    if (errorMsg.includes('insufficient funds')) {
      toast('Wallet account does not have enough funds.', { type: 'info' });
      return;
    } else if (errorMsg.includes('rejected') || errorMsg.includes('denied')) {
      toast('Transaction has been rejected', { type: 'info' });
      return;
    } else if (errorMsg.includes('OutOfFund') || errorMsg.includes('account balance too low')) {
      toast('Your account balance is too low', { type: 'warning' });
      return;
    } else if (errorMsg.includes('transfer caller is not owner nor approved')) {
      toast('Wallet has not been approved to use this functionality.', { type: 'warning' });
      return;
    } else if (errorMsg.includes('Purchase would exceed max supply')) {
      toast('Tokens depleted. You have requested too many or there is no more supply.', {
        type: 'warning',
      });
      return;
    } else if (errorMsg.includes('Suggested NFT is not owned by the selected account')) {
      toast(
        'Suggested NFT is not owned by the selected account, please try again with other wallet.',
        { type: 'warning' }
      );
      return;
    } else if (errorMsg.includes('valid recovery code')) {
      toast('Problem with embedded wallet', { type: 'warning' });
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

export function shortHash(val: string) {
  if (!val || val.length <= 10) {
    return val;
  }
  return `${val.slice(0, 6)}...${val.slice(-4)}`;
}
