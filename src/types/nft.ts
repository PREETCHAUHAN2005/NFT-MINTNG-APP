export interface MintRequest {
  name: string;
  description: string;
  imageUrl: string;
  recipient?: string;
}

export interface MintResponse {
  digest: string;
  confirmedLocalExecution: boolean;
}

