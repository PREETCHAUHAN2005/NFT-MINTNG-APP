import { useCallback, useState } from 'react';
import { useWalletKit } from '@mysten/wallet-kit';
import { buildMintTransaction, suiClient } from '../lib/suiClient';
import type { MintFormValues } from '../lib/validation';
import type { MintResponse } from '../types/nft';

export type MintStatus = 'idle' | 'signing' | 'submitting' | 'finalized' | 'error';

export const useMint = () => {
  const { currentAccount, signAndExecuteTransactionBlock } = useWalletKit();
  const [status, setStatus] = useState<MintStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<MintResponse | null>(null);

  const mint = useCallback(
    async (values: MintFormValues) => {
      if (!currentAccount?.address) {
        throw new Error('Connect your Sui wallet to continue.');
      }

      setStatus('signing');
      setError(null);

      const tx = buildMintTransaction({
        name: values.name,
        description: values.description,
        imageUrl: values.imageUrl,
        recipient: values.recipient ?? currentAccount.address,
      });

      try {
        const execution = await signAndExecuteTransactionBlock({
          transactionBlock: tx as unknown as Parameters<typeof signAndExecuteTransactionBlock>[0]['transactionBlock'],
          options: { showEffects: true },
        });
        setStatus('submitting');

        const finalized = await suiClient.waitForTransactionBlock({
          digest: execution.digest,
          options: { showEffects: true },
        });

        const response: MintResponse = {
          digest: execution.digest,
          confirmedLocalExecution: finalized.confirmedLocalExecution ?? false,
        };

        setLastResponse(response);
        setStatus('finalized');
        return response;
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Mint failed');
        setStatus('error');
        throw err;
      }
    },
    [currentAccount?.address, signAndExecuteTransactionBlock],
  );

  return {
    mint,
    status,
    error,
    lastResponse,
    isMinting: status === 'signing' || status === 'submitting',
  };
};

