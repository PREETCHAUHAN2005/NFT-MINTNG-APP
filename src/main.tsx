import React from 'react';
import ReactDOM from 'react-dom/client';
import { WalletKitProvider } from '@mysten/wallet-kit';
import App from './App';
import './styles/index.css';

const preferredWallets = ['Sui Wallet', 'Suiet'];

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WalletKitProvider preferredWallets={preferredWallets}>
      <App />
    </WalletKitProvider>
  </React.StrictMode>,
);

