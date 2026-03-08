import React, { useState, useEffect } from 'react';
import { X, Trophy, Sparkles, Rocket, Gift, ChevronRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MilestoneAnnouncement = ({ marketCap }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [officialWinners, setOfficialWinners] = useState({});
  const [isSyncing, setIsSyncing] = useState(true);
  const [lockedMilestones, setLockedMilestones] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('bws_locked_milestones') || '[]');
      // Seed 1M as already reached if not present
      if (!stored.includes('1M')) {
        stored.push('1M');
        localStorage.setItem('bws_locked_milestones', JSON.stringify(stored));
      }
      return stored;
    } catch (e) {
      return ['1M'];
    }
  });

  // Archive Sync Logic
  useEffect(() => {
    const runSync = async () => {
      try {
        const parts = ["QUtmeWNieEZvN1dpV1FIRTd4Q182WVNJNFNweVBT", "Mkp3eTR2N1NCOWZ2TVNmSGJSUnB4WTAtVWhOWlZIVVNnNktlMWtHMExG"];
        const SID = atob(parts[0]) + atob(parts[1]);
        const SCRIPT_URL = `https://script.google.com/macros/s/${SID}/exec`;
        const target = `https://corsproxy.io/?${encodeURIComponent(SCRIPT_URL + '?t=' + Date.now())}`;
        
        const res = await fetch(target);
        if (res.ok) {
          const data = await res.json();
          const raw = Array.isArray(data) ? data.flat(Infinity) : [];
          const winners = {};
          
          raw.forEach(entry => {
            const str = String(entry || "").trim();
            if (str.startsWith("OFFICIAL_WINNER_")) {
              const p = str.replace("OFFICIAL_WINNER_", "").split(":");
              if (p.length >= 2) {
                const m = p[0];
                const addr = p[1].split(/\s+/)[0];
                if (!winners[m]) winners[m] = [];
                winners[m].push(addr);
              }
            }
          });
          setOfficialWinners(winners);
        }
      } catch (e) {
        console.error("Archive Sync Error:", e);
      } finally {
        setIsSyncing(false);
      }
    };
    runSync();
  }, []);

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

  useEffect(() => {
    // Check for new milestones to lock
    const currentMc = marketCap || 0;
    const newlyLocked = [...lockedMilestones];
    let changed = false;

    milestones.forEach(m => {
      if (currentMc >= m.mc && !newlyLocked.includes(m.label)) {
        newlyLocked.push(m.label);
        changed = true;
      }
    });

    if (changed) {
      setLockedMilestones(newlyLocked);
      localStorage.setItem('bws_locked_milestones', JSON.stringify(newlyLocked));
    }
  }, [marketCap, lockedMilestones]);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto sm:overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)] border border-amber-500/20 bg-zinc-900 animate-scale-up">
        
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
        <div className="relative z-10 p-5 sm:p-10">
          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-gold text-amber-400 text-[10px] sm:text-sm font-bold mb-3 sm:mb-4 animate-bounce">
              <img src="/images/icon-tracker.png" alt="Live Tracker" className="h-4 w-4 sm:h-5 sm:w-5 object-contain" />
              LIVE GIVEAWAY TRACKER
            </div>
            <h2 className="text-2xl sm:text-5xl font-black text-white leading-tight">
              Community <span className="shimmer-text">GIVEAWAYS</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1 sm:mt-2">
              <span className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Current Market Cap:</span>
              <span className="text-amber-500 font-mono font-bold text-sm sm:text-base">${formatCurrency(currentMc)}</span>
            </div>
          </div>

          <div className="grid gap-2 sm:gap-4">
            {milestones.map((item, index) => {
              const liveProgress = Math.min(Math.max((currentMc / item.mc) * 100, 0), 100);
              const isLocked = lockedMilestones.includes(item.label);
              const isReached = currentMc >= item.mc || isLocked;
              const progress = isReached ? 100 : liveProgress;
              const remaining = item.mc - currentMc;

              return (
                <div 
                  key={index}
                  className={`group relative p-3 sm:p-5 rounded-2xl glass-dark border transition-all duration-300 overflow-hidden ${isReached ? 'border-green-500/30' : 'border-amber-500/10 hover:border-amber-500/30'}`}
                >
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-amber-500/5 flex items-center justify-center border border-amber-500/10 group-hover:scale-110 transition-transform">
                        <img 
                          src={item.icon} 
                          alt={`${item.label} milestone`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white leading-none">
                          {item.label} Market Cap
                        </h3>
                        <p className="text-amber-500/70 text-[9px] sm:text-[10px] font-bold mt-1 uppercase tracking-widest">
                          Reward: {item.reward}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      {isReached ? (
                        <div className="flex items-center gap-2">
                          {officialWinners[item.label] ? (
                             <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg">
                               <span className="text-green-500 text-[9px] font-black tracking-widest uppercase">COMPLETE</span>
                             </div>
                          ) : (
                            <Link 
                              to="/giveaway" 
                              className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-[10px] sm:text-xs font-black hover:bg-amber-500/30 transition-all border border-amber-500/30 animate-pulse"
                            >
                              ENTER GIVEAWAY
                            </Link>
                          )}
                          <div className="relative animate-wiggle flex items-center justify-center">
                            <span className="shimmer-text text-2xl font-black drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] select-none">
                              ✔
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm font-black text-zinc-400">
                          {progress.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="relative h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${isReached ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'}`}
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
                    <div className="mt-3 space-y-2">
                       <p className={`text-[10px] font-bold flex items-center gap-1 ${officialWinners[item.label] ? 'text-green-500/70' : 'text-green-500'}`}>
                        {officialWinners[item.label] ? (
                          <>
                            <Trophy className="h-3 w-3" />
                            GIVEAWAY COMPLETE - WINNER ANNOUNCED!
                          </>
                        ) : (
                          <>
                            <Trophy className="h-3 w-3" />
                            MILESTONE REACHED! GIVEAWAY ACTIVE!
                          </>
                        )}
                      </p>

                      {officialWinners[item.label] && (
                        <div className="flex flex-col gap-2">
                          {officialWinners[item.label].map((addr, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-black/40 border border-amber-500/20 rounded-xl px-4 py-2.5 animate-scale-up backdrop-blur-sm">
                               <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                                   <Gift className="h-4 w-4 text-amber-500" />
                                 </div>
                                 <div className="flex flex-col">
                                   <span className="text-[9px] font-black text-amber-500/60 uppercase tracking-widest">
                                     {officialWinners[item.label].length > 1 ? `WINNER #${idx + 1}` : 'Official Selection'}:
                                   </span>
                                   <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">
                                     {addr.slice(0, 8)}...{addr.slice(-8)}
                                   </span>
                                 </div>
                               </div>
                               <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black text-green-500 uppercase bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">VERIFIED</span>
                               </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleClose}
            className="w-full mt-4 sm:mt-6 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 font-bold text-base sm:text-lg text-white transition-all shadow-lg shadow-amber-900/20 active:scale-95"
          >
            LET'S PUMP!
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneAnnouncement;
