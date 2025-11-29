import { ConnectButton } from '@mysten/wallet-kit';
import { useMemo } from 'react';

const links = [
  { label: 'Mint', href: '#mint' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Market', href: '#market' },
];

export const NavBar = () => {
  const networkLabel = useMemo(() => (import.meta.env.VITE_SUI_NETWORK ?? 'testnet').toUpperCase(), []);

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">Sui NFT Studio</div>
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">{networkLabel}</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
          {links.map((item) => (
            <a key={item.label} href={item.href} className="hover:text-slate-900">
              {item.label}
            </a>
          ))}
        </nav>
        <ConnectButton />
      </div>
    </header>
  );
};

