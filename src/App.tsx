import { NavBar } from './components/NavBar';
import { MintForm } from './components/MintForm';

const App = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
    <NavBar />
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:px-0">
      <MintForm />
      <section id="instructions" className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-100">
        <h2 className="text-2xl font-semibold text-slate-900">Instructions</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-6 text-slate-600">
          <li>Install Sui Wallet or Suiet extension and fund it on the selected network.</li>
          <li>Connect your wallet using the button in the top-right corner.</li>
          <li>Fill out the NFT metadata, optionally overriding the recipient address.</li>
          <li>Sign the transaction and wait for final confirmation.</li>
          <li>View your newly minted NFT inside your wallet or on a Sui explorer.</li>
        </ol>
      </section>
    </main>
  </div>
);

export default App;

