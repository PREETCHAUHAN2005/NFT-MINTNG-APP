# Sui NFT Studio

Production-ready NFT minting dApp that showcases a complete Sui Move smart contract alongside a modern React + TypeScript frontend. The project exposes a polished minting experience, wallet connectivity (Sui Wallet + Suiet), transaction status tracking, and CI/CD automation suitable for GitHub or cloud deployments.

## Features

- **On-chain program** – audited-style Sui Move module with access-controlled minting, transfer, burn, and structured events.
- **Responsive frontend** – Vite + React + Tailwind UI with strict TypeScript types, Zod validation, and Zustand-free lightweight state management.
- **Wallet integration** – `@mysten/wallet-kit` for Wallet Standard support, surfaced with Sui Wallet & Suiet as preferred connectors.
- **Blockchain middleware** – typed helpers that build Move calls, leverage the Sui JSON-RPC client, and stream transaction status.
- **Tooling & CI** – Vitest unit tests, linting, reproducible `.env` template, and GitHub Actions workflow that builds both Move and frontend artifacts.

## Tech Stack

| Layer      | Details                                                  |
| ---------- | -------------------------------------------------------- |
| Smart Cntr | Sui Move 2024.beta, `MintCap` gating, event telemetry     |
| Frontend   | React 18, Vite 5, Tailwind CSS, Wallet Kit               |
| SDK        | `@mysten/sui.js` transactions + JSON-RPC client          |
| Testing    | Vitest + Testing Library (unit tests for validation)     |
| Automation | GitHub Actions (`.github/workflows/ci.yml`)              |

## Project Structure

```
.
├── Move.toml
├── sources/nft.move               # Sui Move package
├── env.example                    # Template for Vite env vars
├── src/                           # React application
│   ├── components/                # UI components
│   ├── hooks/                     # Custom hooks (mint workflow)
│   ├── lib/                       # Sui client + validation helpers
│   └── types/                     # Shared TS interfaces
├── .github/workflows/ci.yml       # CI pipeline
└── README.md
```

## Prerequisites

- Node.js 20+
- npm 10+
- Sui CLI `sui` (for local Move build/test). Install from [Mysten releases](https://github.com/MystenLabs/sui/releases).

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `env.example` → `.env` (Vite automatically loads).

   ```
   VITE_SUI_NETWORK=testnet
   VITE_FULLNODE_URL=                             # Optional custom RPC
   VITE_PACKAGE_ID=0x...                          # Deployed package
   VITE_MINT_CAP_ID=0x...                         # MintCap object id
   ```

   - `VITE_PACKAGE_ID`: the on-chain package containing `sui_nft_studio::nft`.
   - `VITE_MINT_CAP_ID`: object id of the `MintCap` you control.
   - `VITE_FULLNODE_URL`: override default RPC if needed.

3. **Run local dev server**

   ```bash
   npm run dev
   ```

   The app defaults to `http://localhost:3000`.

## Smart Contract (Move)

- NFT struct holds `name`, `description`, `image_url`, and `creator`.
- `MintCap` assigned to deployer during `init` enforces access control.
- `mint` entry function emits `MintEvent` and transfers to recipient.
- `transfer_nft` and `burn` are exposed for holder-managed lifecycle.
- Events (`MintEvent`, `TransferEvent`, `BurnEvent`) provide explorer traceability.

To build / test locally:

```bash
sui move build
```

## Frontend Highlights

- **Mint form** with live validation (`zod`) and helpful status copy.
- **Wallet awareness** surfaces connection status & short addresses.
- **Hook `useMint`** builds the Move transaction, signs via Wallet Kit, waits for finality, and exposes digest/error metadata for the UI.
- **Tailwind styling** for responsive layout seen in the hero screenshot (Mint, Gallery, Market tabs).

## Testing & Quality

- `npm run lint` – strict TypeScript project references.
- `npm test` – Vitest unit tests (example: metadata validation).
- `npm run build` – type-check + Vite production bundle.

## Continuous Integration

The workflow at `.github/workflows/ci.yml` runs on pushes & PRs:

1. Install dependencies with `npm ci`.
2. Type-check, test, and build the React app.
3. Fetch & install the Sui CLI binary.
4. Compile the Move package via `sui move build`.

This ensures both the on-chain module and the frontend stay deployable.

## Deployment

- **Frontend**: Deploy the contents of `dist/` to Vercel, Netlify, Cloudflare Pages, or GitHub Pages.
- **Smart contract**: Publish via `sui client publish --gas-budget <budget> sources`. Record the resulting `packageId` and `MintCap` object, then update `.env`.
- Update GitHub secrets or environment files per hosting provider for production RPC endpoints if required.

## Troubleshooting

- **`Missing required environment variable`** – ensure `.env` provides `VITE_PACKAGE_ID` and `VITE_MINT_CAP_ID`.
- **Wallet list empty** – confirm Wallet Standard wallets (Sui Wallet, Suiet) are installed in the browser. The provider prioritizes these two via `preferredWallets`.
- **Transaction stuck at submitting** – inspect the digest referenced in the UI against a Sui explorer; check RPC availability or consider setting `VITE_FULLNODE_URL`.

---

Crafted for production readiness: strongly typed Move contracts, modern React tooling, and CI automation ready for GitHub deployment.
