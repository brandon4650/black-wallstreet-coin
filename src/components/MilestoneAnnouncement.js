import React, { useState, useEffect } from 'react';
import { X, Trophy, Sparkles, Rocket, Gift, ChevronRight, TrendingUp } from 'lucide-react';

const MilestoneAnnouncement = ({ marketCap }) => {
  const [isVisible, setIsVisible] = useState(false);

  const milestones = [
    { mc: 1000000, label: "1M", reward: "$10,000", icon: "/images/icon-1m.png" },
    { mc: 10000000, label: "10M", reward: "$50,000", icon: "/images/icon-10m.png" },
    { mc: 100000000, label: "100M", reward: "$200,000", icon: "/images/icon-100m.png" },
    { mc: 1000000000, label: "1B", reward: "$1.11M", icon: "/images/icon-1b.png" },
  ];

  useEffect(() => {
    // Show popup after a short delay on mount - ALWAYS SHOW ON RELOAD
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const currentMc = marketCap || 0;

  const formatCurrency = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(0) + 'K';
    return num.toString();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)] border border-amber-500/20 bg-zinc-900 animate-scale-up">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 text-white">
          <img 
            src="/images/milestone-bg.png" 
            alt="Announcement Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
        </div>

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full glass hover:bg-white/10 transition-colors text-white"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-10">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold text-amber-400 text-sm font-bold mb-4 animate-bounce">
              <img src="/images/icon-tracker.png" alt="Live Tracker" className="h-5 w-5 object-contain" />
              LIVE GIVEAWAY TRACKER
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Community <span className="shimmer-text">GIVEAWAYS</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Current Market Cap:</span>
              <span className="text-amber-500 font-mono font-bold">${formatCurrency(currentMc)}</span>
            </div>
          </div>

          <div className="grid gap-4">
            {milestones.map((item, index) => {
              const progress = Math.min(Math.max((currentMc / item.mc) * 100, 0), 100);
              const isReached = currentMc >= item.mc;
              const remaining = item.mc - currentMc;

              return (
                <div 
                  key={index}
                  className="group relative p-4 sm:p-5 rounded-2xl glass-dark border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-amber-500/5 flex items-center justify-center border border-amber-500/10 group-hover:scale-110 transition-transform">
                        <img 
                          src={item.icon} 
                          alt={`${item.label} milestone`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white leading-none">
                          {item.label} Market Cap
                        </h3>
                        <p className="text-amber-500/70 text-[10px] font-bold mt-1 uppercase tracking-widest">
                          Reward: {item.reward}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-black ${isReached ? 'text-green-500' : 'text-zinc-400'}`}>
                        {progress.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="relative h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${isReached ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {!isReached && (
                    <p className="text-[10px] text-zinc-500 font-medium mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-amber-500/50" />
                      Need <span className="text-amber-500/80 font-bold">${formatCurrency(remaining)} more</span> till giveaway milestone reached!
                    </p>
                  )}
                  {isReached && (
                    <p className="text-[10px] text-green-500 font-bold mt-2 flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      MILESTONE REACHED! GIVEAWAY ACTIVE!
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleClose}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 font-bold text-lg text-white transition-all shadow-lg shadow-amber-900/20 active:scale-95"
          >
            LET'S PUMP!
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneAnnouncement;
