import React from 'react';
import { Building2 } from 'lucide-react';

const DexChart = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-zinc-900/90 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center">
              <Building2 className="h-8 w-8 text-amber-500" />
              <span className="ml-2 text-xl font-bold">Black WallStreet Coin</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Chart Content */}
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Live Chart</h1>
          <div className="aspect-[16/9] w-full">
            <iframe
              src="https://dexscreener.com/solana/8TVr3U85V3Uazkxd5DJbmzdUWaxhQdEGNNGJ7eNTpump?embed=1&theme=dark"
              className="w-full h-full rounded-lg"
              title="DEXScreener Chart"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-900 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-amber-500" />
            <span className="ml-2 text-lg font-bold">Black WallStreet Coin</span>
          </div>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://x.com/tulsabws?s=21&t=O1kPMRtIBO1KZa0XZZiSsg" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">Twitter/X</a>
            <a href="https://t.co/J9bOqE3Z8w" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">Telegram</a>
          </div>
          <p className="text-zinc-400">© 2025 Black WallStreet Coin ($TULSA). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DexChart;
