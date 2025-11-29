import { useWalletKit } from '@mysten/wallet-kit';
import classNames from 'classnames';

export const WalletStatus = () => {
  const { currentAccount, isConnecting } = useWalletKit();

  const statusText = (() => {
    if (isConnecting) return 'Connecting wallet...';
    if (currentAccount?.address) return `Connected: ${shortenAddress(currentAccount.address)}`;
    return 'Wallet not connected';
  })();

  return (
    <div
      className={classNames('rounded-lg border px-4 py-2 text-sm font-medium', {
        'border-emerald-200 bg-emerald-50 text-emerald-900': currentAccount?.address,
        'border-amber-200 bg-amber-50 text-amber-900': isConnecting,
        'border-slate-200 bg-white text-slate-600': !currentAccount?.address && !isConnecting,
      })}
    >
      {statusText}
    </div>
  );
};

const shortenAddress = (value: string) => `${value.slice(0, 6)}...${value.slice(-4)}`;

