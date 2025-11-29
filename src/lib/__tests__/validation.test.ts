import { describe, expect, it } from 'vitest';
import { mintSchema, normalizeMintValues } from '../validation';

describe('mintSchema', () => {
  it('accepts valid input', () => {
    const data = {
      name: 'My NFT',
      description: 'An awesome NFT on Sui blockchain',
      imageUrl: 'https://example.com/nft.png',
      recipient: '0x1234',
    };
    expect(() => mintSchema.parse(data)).not.toThrow();
  });

  it('rejects malformed urls', () => {
    const invalid = {
      name: 'Bad NFT',
      description: 'Still ok description',
      imageUrl: 'not-a-url',
    };
    expect(() => mintSchema.parse(invalid)).toThrow();
  });
});

describe('normalizeMintValues', () => {
  it('trims whitespace', () => {
    const normalized = normalizeMintValues({
      name: '  Foo  ',
      description: '  Something here  ',
      imageUrl: '  https://example.com/img.png  ',
      recipient: '  0xaaaa ',
    });

    expect(normalized).toEqual({
      name: 'Foo',
      description: 'Something here',
      imageUrl: 'https://example.com/img.png',
      recipient: '0xaaaa',
    });
  });
});

