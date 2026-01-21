import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import axios from 'axios';

const PriceBanner = () => {
  const [tokenData, setTokenData] = useState({
    price: 0,
    priceChange24h: 0,
    priceChange1h: 0,
    priceChange5m: 0,
    volume24h: 0,
    marketCap: 0,
    liquidity: 0,
    buys24h: 0,
    sells24h: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef(null);

  // Calculate dynamic milestone based on 100K increments
  const getDynamicMilestone = (mc) => {
    if (!mc || mc < 100000) return null;
    
    // Floor to nearest 100K
    const milestoneValue = Math.floor(mc / 100000) * 100000;
    
    // Format the label
    if (milestoneValue >= 1000000) {
      return `${(milestoneValue / 1000000).toFixed(milestoneValue % 1000000 === 0 ? 0 : 1)}M`;
    }
    return `${milestoneValue / 1000}K`;
  };

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

  const formatPercent = (num) => {
    if (num === null || num === undefined) return '0';
    return parseFloat(num).toFixed(2);
  };

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await axios.get(
          'https://api.dexscreener.com/latest/dex/tokens/8TVr3U85V3Uazkxd5DJbmzdUWaxhQdEGNNGJ7eNTpump'
        );

        const pairs = response.data.pairs || [];
        if (pairs.length > 0) {
          const mainPair = pairs[0];
          setTokenData({
            price: mainPair.priceUsd,
            priceChange24h: mainPair.priceChange?.h24 || 0,
            priceChange1h: mainPair.priceChange?.h1 || 0,
            priceChange5m: mainPair.priceChange?.m5 || 0,
            volume24h: mainPair.volume?.h24 || 0,
            marketCap: mainPair.fdv || mainPair.marketCap || 0,
            liquidity: mainPair.liquidity?.usd || 0,
            buys24h: mainPair.txns?.h24?.buys || 0,
            sells24h: mainPair.txns?.h24?.sells || 0
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

  // Ticker content - will be duplicated for seamless loop
  const TickerContent = () => (
    <>
      {/* LIVE indicator */}
      <div className="flex items-center gap-1.5 text-green-500 px-4">
        <Activity className="h-3 w-3 animate-pulse" />
        <span className="text-xs font-bold tracking-wider">LIVE</span>
      </div>

      <span className="text-zinc-600">|</span>

      {/* Price */}
      <div className="flex items-center gap-1.5 px-3">
        <span className="text-zinc-500 text-xs">$TULSA</span>
        <span className={`font-mono font-bold text-amber-500 text-sm ${isLoading ? 'animate-pulse' : ''}`}>
          ${formatNumber(tokenData.price)}
        </span>
      </div>

      <span className="text-zinc-600">|</span>

      {/* 24h Change */}
      <div className="flex items-center gap-1.5 px-3">
        <span className="text-zinc-500 text-xs">24h</span>
        <div className={`flex items-center gap-0.5 ${tokenData.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {tokenData.priceChange24h >= 0 ? 
            <TrendingUp className="h-3 w-3" /> : 
            <TrendingDown className="h-3 w-3" />
          }
          <span className="font-bold text-xs">{formatPercent(tokenData.priceChange24h)}%</span>
        </div>
      </div>

      <span className="text-zinc-600">|</span>

      {/* 1h Change */}
      <div className="flex items-center gap-1.5 px-3">
        <span className="text-zinc-500 text-xs">1h</span>
        <span className={`font-bold text-xs ${tokenData.priceChange1h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {tokenData.priceChange1h >= 0 ? '+' : ''}{formatPercent(tokenData.priceChange1h)}%
        </span>
      </div>

      <span className="text-zinc-600">|</span>

      {/* Market Cap */}
      <div className="flex items-center gap-1.5 px-3">
        <span className="text-zinc-500 text-xs">MCap</span>
        <span className="font-mono text-zinc-200 text-xs font-semibold">${formatNumber(tokenData.marketCap)}</span>
      </div>

      <span className="text-zinc-600">|</span>

      {/* Liquidity */}
      <div className="flex items-center gap-1.5 px-3">
        <span className="text-zinc-500 text-xs">Liq</span>
        <span className="font-mono text-zinc-200 text-xs">${formatNumber(tokenData.liquidity)}</span>
      </div>

      <span className="text-zinc-600">|</span>

      {/* Volume */}
      <div className="flex items-center gap-1.5 px-3">
        <span className="text-zinc-500 text-xs">Vol</span>
        <span className="font-mono text-zinc-200 text-xs">${formatNumber(tokenData.volume24h)}</span>
      </div>

      <span className="text-zinc-600">|</span>

      {/* Buys / Sells */}
      <div className="flex items-center gap-1.5 px-3">
        <span className="text-zinc-500 text-xs">Txns</span>
        <span className="text-green-500 text-xs font-semibold">{tokenData.buys24h}B</span>
        <span className="text-zinc-600">/</span>
        <span className="text-red-500 text-xs font-semibold">{tokenData.sells24h}S</span>
      </div>

      {/* Milestone Celebration - dynamic based on MCap */}
      {getDynamicMilestone(tokenData.marketCap) && (
        <>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-2 px-4">
            <span className="text-green-400 font-bold text-sm animate-bounce">^</span>
            <span className="text-amber-400 font-bold text-xs tracking-wide">
              $TULSA HIT ${getDynamicMilestone(tokenData.marketCap)}+ MCAP
            </span>
            <span className="text-green-400 font-bold text-sm animate-bounce">^</span>
          </div>
        </>
      )}

      <span className="text-zinc-600 px-4">•</span>
    </>
  );

  return (
    <div 
      className="glass-dark py-2 w-full border-b border-amber-500/10 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-green-500/5" />
      
      {/* Marquee Container */}
      <div className="relative overflow-hidden">
        <div 
          ref={marqueeRef}
          className={`flex items-center whitespace-nowrap ${isPaused ? '' : 'animate-marquee'}`}
          style={{ width: 'max-content' }}
        >
          {/* Duplicate content for seamless loop */}
          <div className="flex items-center">
            <TickerContent />
          </div>
          <div className="flex items-center">
            <TickerContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBanner;