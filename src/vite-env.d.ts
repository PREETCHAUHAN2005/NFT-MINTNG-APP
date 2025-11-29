/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUI_NETWORK?: 'mainnet' | 'testnet' | 'devnet';
  readonly VITE_FULLNODE_URL?: string;
  readonly VITE_PACKAGE_ID?: string;
  readonly VITE_MINT_CAP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

