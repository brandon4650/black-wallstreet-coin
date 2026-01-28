import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import default styles
import '@solana/wallet-adapter-react-ui/styles.css';

import BlackWallStreetCoin from './components/BlackWallStreetCoin';
import DexChart from './components/DexChart';
import GiveawayPage from './components/GiveawayPage';

function App() {
  const network = WalletAdapterNetwork.Mainnet;
  // Use a more reliable public RPC endpoint with .env fallback
  const endpoint = useMemo(() => process.env.REACT_APP_SOLANA_RPC || "https://solana.publicnode.com", []);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <Routes>
              <Route path="/" element={<BlackWallStreetCoin />} />
              <Route path="/chart" element={<DexChart />} />
              <Route path="/giveaway" element={<GiveawayPage />} />
            </Routes>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
