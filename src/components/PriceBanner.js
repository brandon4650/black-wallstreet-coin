import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import axios from 'axios';

const PriceBanner = () => {
  const [tokenData, setTokenData] = useState({
    price: 0,
    priceChange24h: 0,
    volume24h: 0,
    marketCap: 0
  });
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching token data:', error);
        setIsLoading(false);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-dark py-1.5 sm:py-2 w-full border-b border-amber-500/10 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-green-500/5 animate-pulse" />
      
      <div className="max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-4 overflow-hidden relative z-10">
        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 overflow-x-auto scrollbar-hide whitespace-nowrap">
          {/* Live indicator */}
          <div className="flex items-center gap-1 text-green-500">
            <Activity className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-medium">LIVE</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-400 text-[10px] sm:text-sm">$TULSA:</span>
            <span className={`font-mono font-semibold text-amber-500 text-[10px] sm:text-sm ${isLoading ? 'animate-pulse' : ''}`}>
              ${formatNumber(tokenData.price)}
            </span>
          </div>
          
          {/* 24h Change */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-400 text-[10px] sm:text-sm">24h:</span>
            <div className={`flex items-center gap-0.5 ${tokenData.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {tokenData.priceChange24h >= 0 ? 
                <TrendingUp className="h-2.5 w-2.5 sm:h-4 sm:w-4" /> : 
                <TrendingDown className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
              }
              <span className="font-semibold text-[10px] sm:text-sm">{tokenData.priceChange24h}%</span>
            </div>
          </div>
          
          {/* Market Cap */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-400 text-[10px] sm:text-sm">MC:</span>
            <span className="font-mono text-zinc-200 text-[10px] sm:text-sm">${formatNumber(tokenData.marketCap)}</span>
          </div>
          
          {/* Volume */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-400 text-[10px] sm:text-sm">Vol:</span>
            <span className="font-mono text-zinc-200 text-[10px] sm:text-sm">${formatNumber(tokenData.volume24h)}</span>
          </div>
        </div>
        
        {/* Buy button for desktop */}
        <a 
          href="https://pump.fun/coin/8TVr3U85V3Uazkxd5DJbmzdUWaxhQdEGNNGJ7eNTpump"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
        >
          Buy Now
        </a>
      </div>
    </div>
  );
};

export default PriceBanner;