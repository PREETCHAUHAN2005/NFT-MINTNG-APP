import { FormEvent, useMemo, useState } from 'react';
import { MintFormValues, mintSchema, normalizeMintValues } from '../lib/validation';
import { useMint } from '../hooks/useMint';
import { WalletStatus } from './WalletStatus';

const initialValues: MintFormValues = {
  name: '',
  description: '',
  imageUrl: '',
  recipient: '',
};

export const MintForm = () => {
  const [values, setValues] = useState<MintFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof MintFormValues, string>>>({});
  const { mint, status, error, lastResponse, isMinting } = useMint();

  const helperText = useMemo(() => {
    switch (status) {
      case 'signing':
        return 'Please sign the transaction using your wallet.';
      case 'submitting':
        return 'Transaction submitted. Waiting for finality...';
      case 'finalized':
        return 'NFT minted successfully! View it in your wallet.';
      case 'error':
        return error ?? 'Something went wrong.';
      default:
        return 'Fill in the metadata to mint your NFT on Sui.';
    }
  }, [status, error]);

  const handleChange = (field: keyof MintFormValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = mintSchema.safeParse(values);

    if (!parsed.success) {
      const errors: Partial<Record<keyof MintFormValues, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof MintFormValues;
        errors[path] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    try {
      await mint(normalizeMintValues(parsed.data));
      setValues(initialValues);
      setFieldErrors({});
    } catch {
      // errors handled in hook
    }
  };

  return (
    <section id="mint" className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl bg-white p-8 shadow-2xl shadow-slate-200">
      <div>
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-slate-400">Mint Your First Sui NFT</p>
        <p className="mt-1 text-center text-3xl font-semibold text-slate-900">Create, sign, and deploy unique digital collectibles.</p>
      </div>

      <WalletStatus />

      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <FormField label="NFT Name" placeholder="My Awesome NFT" value={values.name} error={fieldErrors.name} onChange={handleChange('name')} required />
        <FormField label="Description" placeholder="A unique NFT on Sui blockchain" value={values.description} error={fieldErrors.description} onChange={handleChange('description')} required rows={4} multiline />
        <FormField label="Image URL" placeholder="https://example.com/image.png" value={values.imageUrl} error={fieldErrors.imageUrl} onChange={handleChange('imageUrl')} required />
        <FormField label="Recipient Address (optional)" placeholder="0x123...abc" value={values.recipient ?? ''} error={fieldErrors.recipient} onChange={handleChange('recipient')} />

        <button
          type="submit"
          disabled={isMinting}
          className="mt-3 rounded-xl bg-slate-900 px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {isMinting ? 'Minting...' : 'Mint NFT'}
        </button>
      </form>

      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-700">Status</p>
        <p className="mt-1 text-sm text-slate-600">{helperText}</p>
        {lastResponse && (
          <p className="mt-2 text-xs font-mono text-slate-500">
            Digest: <span className="break-all">{lastResponse.digest}</span>
          </p>
        )}
      </div>
    </section>
  );
};

interface FormFieldProps {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

const FormField = ({ label, placeholder, value, error, onChange, required, multiline, rows = 3 }: FormFieldProps) => (
  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
    <span>
      {label} {required && <span className="text-rose-500">*</span>}
    </span>
    {multiline ? (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className="rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
      />
    ) : (
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
      />
    )}
    {error && <span className="text-xs text-rose-600">{error}</span>}
  </label>
);

