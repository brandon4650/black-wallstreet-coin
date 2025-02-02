import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios'; // First run: npm install axios

const PriceBanner = () => {
  const [tokenData, setTokenData] = useState({
    price: 0,
    priceChange24h: 0,
    volume24h: 0,
    marketCap: 0
  });

  // Format number function from your bot
  const formatNumber = (num) => {
    if (!num || num === "N/A") return 'N/A';
    
    num = parseFloat(num);
    if (isNaN(num)) return 'N/A';
    
    if (num < 0.00001) return num.toExponential(4);
    if (num < 0.001) return num.toFixed(8);
    if (num < 1) return num.toFixed(6);
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await axios.get(
          'https://api.dexscreener.com/latest/dex/tokens/8TVr3U85V3Uazkxd5DJbmzdUWaxhQdEGNNGJ7eNTpump',
          {
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Accept-Language': 'en-US,en;q=0.9',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Origin': 'https://dexscreener.com',
              'Referer': 'https://dexscreener.com/',
              'Cache-Control': 'no-cache'
            }
          }
        );

        const pairs = response.data.pairs || [];
        if (pairs.length > 0) {
          const mainPair = pairs[0];
          setTokenData({
            price: mainPair.priceUsd,
            priceChange24h: mainPair.priceChange.h24,
            volume24h: mainPair.volume.h24,
            marketCap: mainPair.fdv
          });
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-900/95 backdrop-blur-sm py-2 w-full border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 overflow-hidden">
        <div className="flex items-center space-x-8">
          <div>
            <span className="text-zinc-400 text-sm">Price:</span>
            <span className="ml-2 font-mono text-amber-500">${formatNumber(tokenData.price)}</span>
          </div>
          <div className="flex items-center">
            <span className="text-zinc-400 text-sm">24h:</span>
            <div className={`ml-2 flex items-center ${tokenData.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {tokenData.priceChange24h >= 0 ? 
                <TrendingUp className="h-4 w-4 mr-1" /> : 
                <TrendingDown className="h-4 w-4 mr-1" />
              }
              <span>{tokenData.priceChange24h}%</span>
            </div>
          </div>
          <div>
            <span className="text-zinc-400 text-sm">Market Cap:</span>
            <span className="ml-2 font-mono">${formatNumber(tokenData.marketCap)}</span>
          </div>
          <div>
            <span className="text-zinc-400 text-sm">24h Volume:</span>
            <span className="ml-2 font-mono">${formatNumber(tokenData.volume24h)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBanner;