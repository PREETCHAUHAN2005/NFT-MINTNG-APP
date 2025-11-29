import { z } from 'zod';
import type { MintRequest } from '../types/nft';

export const mintSchema = z.object({
  name: z.string().min(3).max(64),
  description: z.string().min(10).max(280),
  imageUrl: z.string().url().max(256),
  recipient: z
    .string()
    .optional()
    .refine(
      (value) => !value || value.startsWith('0x'),
      'Recipient must be a valid Sui address',
    ),
});

export type MintFormValues = z.infer<typeof mintSchema>;

export const normalizeMintValues = (values: MintFormValues): MintRequest => ({
  name: values.name.trim(),
  description: values.description.trim(),
  imageUrl: values.imageUrl.trim(),
  recipient: values.recipient?.trim(),
});

