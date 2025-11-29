import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import type { MintRequest } from '../types/nft';

const rpcNetwork = (import.meta.env.VITE_SUI_NETWORK ?? 'testnet') as 'mainnet' | 'testnet' | 'devnet';

const RPC_URLS: Record<string, string> = {
  mainnet: getFullnodeUrl('mainnet'),
  testnet: getFullnodeUrl('testnet'),
  devnet: getFullnodeUrl('devnet'),
};

const customFullnodeUrl = import.meta.env.VITE_FULLNODE_URL;
const resolvedUrl = customFullnodeUrl && customFullnodeUrl.length > 0 ? customFullnodeUrl : RPC_URLS[rpcNetwork] ?? getFullnodeUrl('testnet');

export const suiClient = new SuiClient({ url: resolvedUrl });

const getRequiredEnv = (key: string) => {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const PACKAGE_ID = getRequiredEnv('VITE_PACKAGE_ID');
const MINT_CAP_ID = getRequiredEnv('VITE_MINT_CAP_ID');

export interface MintTransactionConfig extends MintRequest {
  recipient: string;
}

export const buildMintTransaction = ({ name, description, imageUrl, recipient }: MintTransactionConfig) => {
  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${PACKAGE_ID}::nft::mint`,
    arguments: [
      tx.object(MINT_CAP_ID),
      tx.pure.string(name),
      tx.pure.string(description),
      tx.pure.string(imageUrl),
      tx.pure.address(recipient),
    ],
  });
  return tx;
};

