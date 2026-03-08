import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Volume2, VolumeX, Keyboard } from 'lucide-react';
import { motion, AnimatePresence, useAnimationFrame } from 'framer-motion';

// --- EXPLOSION COMPONENT ---
const Explosion = ({ x, y }) => {
  const particles = useMemo(() => 
    [...Array(20)].map((_, i) => ({
      id: i,
      angle: (i / 20) * 360,
      distance: 80 + Math.random() * 120,
      size: 4 + Math.random() * 8,
      duration: 0.6 + Math.random() * 0.4,
      delay: Math.random() * 0.1,
    })), []
  );

  const debris = useMemo(() =>
    [...Array(12)].map((_, i) => ({
      id: i,
      angle: (i / 12) * 360 + Math.random() * 30,
      distance: 100 + Math.random() * 150,
      rotation: Math.random() * 720 - 360,
      size: 6 + Math.random() * 10,
      duration: 0.8 + Math.random() * 0.4,
    })), []
  );

  return (
    <div 
      className="absolute pointer-events-none z-50"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      {/* Central flash */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 3, 4], opacity: [1, 0.8, 0] }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-white via-yellow-400 to-orange-600"
        style={{ 
          background: 'radial-gradient(circle, white 0%, #facc15 30%, #ea580c 60%, transparent 70%)',
          filter: 'blur(4px)'
        }}
      />

      {/* Shockwave rings */}
      {[0, 0.1, 0.2].map((delay, i) => (
        <motion.div
          key={`ring-${i}`}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: [0, 4 + i], opacity: [0.8, 0] }}
          transition={{ duration: 0.6, delay, ease: "easeOut" }}
          className="absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-orange-500"
          style={{ left: '50%', top: '50%' }}
        />
      ))}

      {/* Fire particles */}
      {particles.map((p) => (
        <motion.div
          key={`particle-${p.id}`}
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 1, 
            opacity: 1 
          }}
          animate={{ 
            x: Math.cos(p.angle * Math.PI / 180) * p.distance,
            y: Math.sin(p.angle * Math.PI / 180) * p.distance,
            scale: [1, 1.5, 0],
            opacity: [1, 0.8, 0]
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay,
            ease: "easeOut" 
          }}
          className="absolute rounded-full"
          style={{ 
            width: p.size, 
            height: p.size,
            background: `radial-gradient(circle, #fff 0%, ${p.id % 3 === 0 ? '#facc15' : p.id % 3 === 1 ? '#f97316' : '#ef4444'} 50%, transparent 100%)`,
            boxShadow: `0 0 ${p.size * 2}px ${p.id % 2 === 0 ? '#facc15' : '#ef4444'}`,
            left: '50%',
            top: '50%',
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
          }}
        />
      ))}

      {/* Metal debris */}
      {debris.map((d) => (
        <motion.div
          key={`debris-${d.id}`}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ 
            x: Math.cos(d.angle * Math.PI / 180) * d.distance,
            y: Math.sin(d.angle * Math.PI / 180) * d.distance + 50, // gravity
            rotate: d.rotation,
            opacity: [1, 1, 0]
          }}
          transition={{ duration: d.duration, ease: "easeOut" }}
          className="absolute bg-gradient-to-br from-zinc-400 to-zinc-700"
          style={{ 
            width: d.size, 
            height: d.size * 0.6,
            left: '50%',
            top: '50%',
            borderRadius: 2,
          }}
        />
      ))}

      {/* Smoke clouds */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`smoke-${i}`}
          initial={{ scale: 0, opacity: 0.6, x: 0, y: 0 }}
          animate={{ 
            scale: [0, 2, 3],
            opacity: [0.6, 0.4, 0],
            x: (Math.random() - 0.5) * 100,
            y: -50 - Math.random() * 100
          }}
          transition={{ duration: 1.5, delay: 0.1 + i * 0.05, ease: "easeOut" }}
          className="absolute w-16 h-16 rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(64,64,64,0.8) 0%, transparent 70%)',
            left: '50%',
            top: '50%',
            marginLeft: -32,
            marginTop: -32,
          }}
        />
      ))}
    </div>
  );
};

// --- ASTEROID COMPONENT ---
const Asteroid = ({ startX, startY, endX, endY, duration, onImpact, imageLoaded }) => {
  useEffect(() => {
    const timer = setTimeout(onImpact, duration * 1000);
    return () => clearTimeout(timer);
  }, [duration, onImpact]);

  return (
    <motion.div
      initial={{ x: startX, y: startY, rotate: 0, scale: 0.3, opacity: 0 }}
      animate={{ 
        x: endX, 
        y: endY, 
        rotate: 720,
        scale: [0.3, 1.2, 1],
        opacity: [0, 1, 1]
      }}
      transition={{ 
        duration: duration, 
        ease: "easeIn",
        scale: { duration: duration * 0.5 }
      }}
      className="absolute z-45 pointer-events-none"
      style={{ width: 80, height: 80 }}
    >
      {/* Asteroid image */}
      {imageLoaded ? (
        <img 
          src="/images/assets/golden_asteroid.png" 
          alt="Asteroid" 
          className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(251,146,60,0.7)]"
        />
      ) : (
        <div 
          className="w-full h-full rounded-full"
          style={{ 
            background: 'radial-gradient(circle at 30% 30%, #a8a29e 0%, #78716c 50%, #1c1917 100%)',
            boxShadow: '0 0 30px rgba(251, 146, 60, 0.5)'
          }}
        />
      )}
      
      {/* Fire trail */}
      <motion.div
        animate={{ opacity: [0.8, 0.4, 0.8], scale: [1, 1.2, 1] }}
        transition={{ duration: 0.2, repeat: Infinity }}
        className="absolute -right-8 top-1/2 -translate-y-1/2 w-24 h-10"
        style={{
          background: 'linear-gradient(to left, transparent 0%, #f97316 30%, #facc15 60%, white 100%)',
          filter: 'blur(6px)',
          borderRadius: '50%',
          transformOrigin: 'left center'
        }}
      />
      
      {/* Heat glow */}
      <div 
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, transparent 70%)',
          transform: 'scale(1.8)'
        }}
      />
    </motion.div>
  );
};

// --- MILESTONE BUBBLE COMPONENT ---
const MilestoneBubble = ({ x, y, value, isNew }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute z-20 pointer-events-none"
      style={{ 
        left: x, 
        top: y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Glow ring */}
      <motion.div
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: [1, 2, 2.5], opacity: [0.8, 0.3, 0] }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 rounded-full border-2 border-yellow-400"
        style={{ width: 40, height: 40, marginLeft: -20, marginTop: -20 }}
      />
      
      {/* Main bubble */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ duration: 0.4, ease: "backOut" }}
        className="relative flex items-center justify-center rounded-full shadow-lg"
        style={{
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          background: value >= 10 
            ? 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' 
            : value >= 5 
              ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
              : value >= 2 
                ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                : 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
          boxShadow: value >= 10 
            ? '0 0 20px rgba(168, 85, 247, 0.6)'
            : value >= 5 
              ? '0 0 20px rgba(249, 115, 22, 0.6)'
              : value >= 2 
                ? '0 0 20px rgba(34, 197, 94, 0.6)'
                : '0 0 20px rgba(250, 204, 21, 0.6)'
        }}
      >
        <span className="text-[10px] font-black text-white drop-shadow-md">
          {value}x
        </span>
      </motion.div>
    </motion.div>
  );
};

// --- LIVE WINNINGS FEED COMPONENT ---
const LiveWinningsFeed = ({ feed }) => {
  return (
    <div className="absolute top-4 left-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence initial={false}>
        {feed.map((win) => (
          <motion.div
            key={win.id}
            initial={{ x: -100, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 50, opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            className="flex items-center gap-3 bg-black/60 backdrop-blur-md border border-yellow-500/20 px-4 py-2 rounded-xl shadow-lg"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-[11px] tracking-tight">
                  <span className="text-green-400">+{win.amount.toLocaleString()}</span>
                  <span className="text-yellow-500 ml-1.5">{win.multiplier.toFixed(2)}x</span>
                </span>
              </div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                User: <span className="text-zinc-400 font-mono">{win.wallet}</span>
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- CONFIGURATION ---
const CONFIG = {
  MIN_BET: 100,
  MAX_BET: 50000,
  DEFAULT_BET: 500,
  MAX_PATH_POINTS: 300, // Limit path points for performance
  HOUSE_EDGE: 0.01, // 1% house edge
  MILESTONES: [1.5, 2, 3, 5, 10, 25, 50, 100], // Milestone multipliers to show bubbles
  ASTEROID_WARN_TIME: 0.8, // Seconds before crash to spawn asteroid
};

// --- CUSTOM SVG TERMINAL ICONS ---
const IconZap = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" fillOpacity="0.2"/>
  </svg>
);

const IconShield = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2"/>
    <path d="M9 12l2 2 4-4" strokeWidth="2.5"/>
  </svg>
);

const IconRadio = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <path d="M16.24 7.76a6 6 0 0 1 0 8.48m-8.48 0a6 6 0 0 1 0-8.48m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
  </svg>
);

const IconActivity = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

// --- TOAST NOTIFICATION COMPONENT ---
const Toast = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const bgColor = {
    error: 'bg-red-500/90 border-red-400',
    success: 'bg-green-500/90 border-green-400',
    warning: 'bg-yellow-500/90 border-yellow-400',
    info: 'bg-blue-500/90 border-blue-400',
  }[type] || 'bg-zinc-700/90 border-zinc-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`${bgColor} border px-6 py-3 rounded-2xl text-white font-bold text-sm shadow-2xl backdrop-blur-xl`}
    >
      {message}
    </motion.div>
  );
};

// --- STAR FIELD BACKGROUND ---
const StarField = React.memo(({ speed }) => {
  const farStars = useMemo(() => 
    [...Array(60)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.2,
      size: Math.random() * 1 + 0.5,
      duration: Math.random() * 40 + 30,
    })), []
  );

  const nearStars = useMemo(() => 
    [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.8 + 0.2,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 10,
    })), []
  );

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Galaxy Background Layer */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-10%] z-0"
        style={{
          backgroundImage: 'url(/images/assets/galaxy_bg.gif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px) saturate(1.5)',
        }}
      />

      {/* Far Stars Layer */}
      {farStars.map((star) => (
        <motion.div
          key={`far-${star.id}`}
          initial={{ x: `${star.x}%`, y: `${star.y}%`, opacity: star.opacity }}
          animate={{ y: ["0%", "100%"] }}
          transition={{ 
            duration: star.duration / (speed + 0.05), 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute bg-white rounded-full"
          style={{ width: star.size, height: star.size, opacity: star.opacity }}
        />
      ))}

      {/* Near Stars Layer */}
      {nearStars.map((star) => (
        <motion.div
          key={`near-${star.id}`}
          initial={{ x: `${star.x}%`, y: `${star.y}%`, opacity: star.opacity }}
          animate={{ y: ["0%", "100%"] }}
          transition={{ 
            duration: star.duration / (speed + 0.2), 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute bg-white rounded-full shadow-[0_0_8px_white]"
          style={{ width: star.size, height: star.size }}
        />
      ))}
    </div>
  );
});

StarField.displayName = 'StarField';

// --- TECHNICAL CHART ENGINE ---
const ChartEngine = React.memo(({ 
  pathPoints, 
  gameState, 
  viewLimits, 
  multiplier, 
  rocketPos, 
  stageDimensions,
  imagesLoaded,
  showExplosion,
  explosionPos,
  milestones,
  asteroid,
  asteroidImageLoaded,
  winsFeed
}) => {
  const yTicks = useMemo(() => {
    const ticks = [1, 1.25, 1.5, 2];
    let last = 2;
    while (last < viewLimits.maxM) {
      last = last * 1.5;
      ticks.push(last);
    }
    return ticks.slice(-6).filter(t => t <= viewLimits.maxM);
  }, [viewLimits.maxM]);

  const xTicks = useMemo(() => {
    const ticks = [];
    const step = viewLimits.maxT / 5;
    for (let i = 0; i <= 5; i++) ticks.push(i * step);
    return ticks;
  }, [viewLimits.maxT]);

  const linePath = useMemo(() => {
    if (pathPoints.length < 1 || !stageDimensions.width) return "";
    
    return pathPoints.reduce((acc, p, i) => {
      const x = (p.time / viewLimits.maxT) * stageDimensions.width;
      const y = stageDimensions.height - (((p.mult - 1) / (viewLimits.maxM - 1)) * stageDimensions.height);
      return acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
    }, "");
  }, [pathPoints, viewLimits, stageDimensions]);

  const starSpeed = gameState === 'playing' ? multiplier * 0.05 : 0.01;

  return (
    <div className="relative w-full h-full border border-yellow-500/20 bg-black/40 rounded-lg overflow-hidden group shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]">
      <StarField speed={starSpeed} />
      
      {/* Distant Planet Parallax Layer */}
      <motion.div
        animate={{ 
          x: gameState === 'playing' ? -20 * multiplier : 0,
          y: gameState === 'playing' ? 10 * multiplier : 0,
          rotate: [0, 360]
        }}
        transition={{ 
          x: { duration: 0.5, ease: "linear" },
          y: { duration: 0.5, ease: "linear" },
          rotate: { duration: 300, repeat: Infinity, ease: "linear" }
        }}
        className="absolute right-[10%] top-[15%] w-[150px] md:w-[250px] opacity-40 pointer-events-none z-10"
      >
        <img 
          src="/images/assets/golden_planet.png" 
          alt="" 
          className="w-full h-full object-contain filter blur-[1px] brightness-75"
        />
      </motion.div>

      <div className="absolute inset-0 opacity-[0.08] yellow-graph-grid z-20" />

      {/* Live Winnings Feed */}
      <LiveWinningsFeed feed={winsFeed} />

      {/* Y-Axis */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-0 bottom-0 w-20 border-l border-yellow-500/10 bg-black/60 z-30">
          {yTicks.map((t, i) => {
            // Calculate position based on actual multiplier value (same formula as rocket)
            const yPercent = ((t - 1) / (viewLimits.maxM - 1)) * 100;
            return (
              <div 
                key={i} 
                className="absolute right-0 flex items-center gap-2 group/tick px-4"
                style={{ 
                  bottom: `calc(${yPercent}% + 40px * ${yPercent / 100})`, // Adjust for x-axis height
                  transform: 'translateY(50%)'
                }}
              >
                <div className="w-2 h-[1px] bg-yellow-400 group-hover/tick:w-4 transition-all" />
                <span className="text-yellow-400 font-black text-xs italic tracking-tighter drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                  {t.toFixed(t < 2 ? 2 : t < 10 ? 1 : 0)}x
                </span>
              </div>
            );
          })}
        </div>

        {/* X-Axis */}
        <div className="absolute bottom-0 left-0 right-20 h-10 border-t border-yellow-500/10 bg-black/60 z-30 flex justify-between items-center px-12">
          {xTicks.map((t, i) => (
            <div key={i} className="flex flex-col items-center gap-1 group/tick">
              <div className="w-[1px] h-2 bg-yellow-400 group-hover/tick:h-3 transition-all" />
              <span className="text-yellow-500 font-black text-[9px] tracking-widest opacity-60">
                {t.toFixed(0)}s
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 p-1">
        <defs>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="orbitGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Crosshairs */}
        {gameState === 'playing' && stageDimensions.width > 0 && (
          <g opacity="0.4">
            <line 
              x1="0" 
              y1={rocketPos.y} 
              x2={stageDimensions.width - 80} 
              y2={rocketPos.y} 
              stroke="#facc15" 
              strokeWidth="1" 
              strokeDasharray="6 6" 
            />
            <line 
              x1={rocketPos.x} 
              y1="0" 
              x2={rocketPos.x} 
              y2={stageDimensions.height - 40} 
              stroke="#facc15" 
              strokeWidth="1" 
              strokeDasharray="6 6" 
            />
          </g>
        )}

        {/* Path lines */}
        <motion.path 
          d={linePath} 
          fill="none" 
          stroke="url(#orbitGrad)" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          filter="url(#neonGlow)" 
          opacity="0.3" 
        />
        <motion.path 
          d={linePath} 
          fill="none" 
          stroke="#facc15" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
      </svg>

      {/* Rocket */}
      {(gameState === 'playing' || gameState === 'lobby' || (gameState === 'crashed' && pathPoints.length > 0)) && (
        <motion.div 
          animate={{ 
            x: rocketPos.x - 70,
            y: rocketPos.y - 70,
            rotate: gameState === 'crashed' ? [0, 90, 180] : 15,
            scale: (gameState === 'playing' || gameState === 'lobby') ? 1.4 : 0,
            opacity: (gameState === 'playing' || gameState === 'lobby') ? 1 : 0
          }}
          transition={{ type: "tween", ease: "linear", duration: 0.1 }}
          className="absolute z-40 pointer-events-none"
          style={{ width: 140, height: 140 }}
        >
          {gameState === 'playing' && (
            <div className="absolute top-1/2 left-0 w-56 h-14 bg-gradient-to-l from-yellow-500/50 to-transparent blur-3xl -rotate-[15deg] translate-x-[-90%] animate-pulse" />
          )}
          {imagesLoaded.rocket ? (
            <img 
              src="/images/assets/bws_rocket.png" 
              alt="Rocket" 
              className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(250,204,21,0.7)]" 
              style={{ mixBlendMode: 'screen' }} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🚀</div>
          )}
        </motion.div>
      )}

      {/* Milestone Bubbles on the line */}
      {milestones.map((milestone) => {
        if (!stageDimensions.width || !stageDimensions.height) return null;
        
        const x = (milestone.time / viewLimits.maxT) * stageDimensions.width;
        const y = stageDimensions.height - (((milestone.value - 1) / (viewLimits.maxM - 1)) * stageDimensions.height);
        
        return (
          <MilestoneBubble
            key={milestone.value}
            x={x}
            y={y}
            value={milestone.value}
            isNew={milestone.isNew}
          />
        );
      })}

      {/* Asteroid */}
      <AnimatePresence>
        {asteroid && (
          <Asteroid
            key={asteroid.id}
            startX={asteroid.startX}
            startY={asteroid.startY}
            endX={asteroid.endX}
            endY={asteroid.endY}
            duration={asteroid.duration}
            onImpact={asteroid.onImpact}
            imageLoaded={asteroidImageLoaded}
          />
        )}
      </AnimatePresence>

      {/* Crash Notification */}
      <AnimatePresence>
        {gameState === 'crashed' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-red-600/10 z-40 flex flex-col items-center justify-center backdrop-blur-sm"
          >
            <div className="text-red-500 font-black text-6xl md:text-[14rem] tracking-[0.2em] opacity-10 select-none absolute">
              IMPACT
            </div>
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 10 }}
              className="bg-red-600 text-white font-black px-16 py-4 rounded-full text-3xl tracking-[0.4em] shadow-[0_0_80px_rgba(220,38,38,0.5)] border-4 border-white/20 relative z-10 uppercase"
            >
              Crashed
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explosion Effect */}
      <AnimatePresence>
        {showExplosion && explosionPos && (
          <Explosion x={explosionPos.x} y={explosionPos.y} />
        )}
      </AnimatePresence>
    </div>
  );
});

ChartEngine.displayName = 'ChartEngine';

// --- HISTORY PANEL COMPONENT ---
const HistoryPanel = React.memo(({ history, className = "" }) => (
  <div className={`glass-control border border-white/10 rounded-3xl p-5 flex-1 flex flex-col overflow-hidden ${className}`}>
    <div className="flex items-center gap-2 mb-4 px-1">
      <IconActivity className="w-4 h-4 text-yellow-500/60" />
      <span className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase italic">Sector_Log</span>
    </div>
    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
      {history.map((h, i) => (
        <div 
          key={i} 
          className={`flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-black/40 ${
            h.crashPoint >= 2 ? 'border-yellow-500/20 shadow-[inset_0_0_15px_rgba(250,204,21,0.05)]' : ''
          }`}
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-zinc-600 italic tracking-tighter uppercase whitespace-nowrap overflow-hidden">
              Run_{history.length - i}
            </span>
            {h.result && (
              <span className={`text-[9px] font-bold ${h.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                {h.result === 'win' ? `+${h.profit?.toFixed(0)}` : `-${h.loss?.toFixed(0)}`}
              </span>
            )}
          </div>
          <span className={`text-sm font-black ${h.crashPoint >= 2 ? 'text-yellow-500' : 'text-zinc-400'}`}>
            {h.crashPoint.toFixed(2)}x
          </span>
        </div>
      ))}
    </div>
  </div>
));

HistoryPanel.displayName = 'HistoryPanel';

// --- MAIN COMPONENT ---
const TulsaCrash = () => {
  // Core game state
  const [ticketBalance, setTicketBalance] = useState(10000);
  const [betAmount, setBetAmount] = useState(CONFIG.DEFAULT_BET);
  const [gameState, setGameState] = useState('lobby'); 
  const [multiplier, setMultiplier] = useState(1.00);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [cashedOutAt, setCashedOutAt] = useState(null);
  
  // Auto cash-out
  const [autoCashOut, setAutoCashOut] = useState(1.5); // Default to 1.5x
  const [autoCashOutEnabled, setAutoCashOutEnabled] = useState(false);
  
  // History with more data
  const [history, setHistory] = useState([
    { crashPoint: 1.54, result: null },
    { crashPoint: 12.42, result: null },
    { crashPoint: 1.10, result: null },
    { crashPoint: 2.15, result: null },
    { crashPoint: 3.84, result: null },
    { crashPoint: 1.05, result: null },
  ]);
  
  // Chart state
  const [pathPoints, setPathPoints] = useState([]);
  const [viewLimits, setViewLimits] = useState({ maxT: 8, maxM: 2 });
  const [stageDimensions, setStageDimensions] = useState({ width: 0, height: 0 });
  
  // Explosion state
  const [showExplosion, setShowExplosion] = useState(false);
  const [explosionPos, setExplosionPos] = useState(null);
  
  // Milestone bubbles
  const [milestones, setMilestones] = useState([]);
  
  // Live Winnings Feed
  const [winsFeed, setWinsFeed] = useState([
    { id: 1, wallet: 'Dx3a...9rK2', amount: 1250, multiplier: 1.54 },
    { id: 2, wallet: 'Gv7q...2pM1', amount: 450, multiplier: 2.10 },
  ]);
  
  // Asteroid state
  const [asteroid, setAsteroid] = useState(null);
  const asteroidSpawned = useRef(false);
  
  // UI state
  const [toasts, setToasts] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMobileHistory, setShowMobileHistory] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({ 
    rocket: false, 
    ticket: false, 
    asteroid: false,
    galaxy: false,
    planet: false
  });
  const [screenShake, setScreenShake] = useState(false);
  
  // Game state sync ref for logic-gating
  const gameStateRef = useRef('lobby');
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  
  // Audio Refs
  const soundsRef = useRef({
    launch: null,
    flying: null,
    explosion: null,
    fail: null,
    success: null,
    click: null,
    ping: null
  });

  // Preload Audio
  useEffect(() => {
    soundsRef.current.launch = new Audio('/images/sounds/rocket flying.wav'); // Reuse for launch kick
    soundsRef.current.flying = new Audio('/images/sounds/rocket flying.wav');
    soundsRef.current.explosion = new Audio('/images/sounds/explosion.wav');
    soundsRef.current.fail = new Audio('/images/sounds/fail.wav');
    soundsRef.current.success = new Audio('/images/sounds/sucessful eject.wav');
    soundsRef.current.click = new Audio('/images/sounds/button select.wav');
    soundsRef.current.ping = new Audio('/images/sounds/ping.wav');

    // Configure loop for flying
    if (soundsRef.current.flying) {
      soundsRef.current.flying.loop = true;
    }
  }, []);

  // Refs
  const stageRef = useRef(null);
  const multiplierRef = useRef(1.00);
  const START_TIME = useRef();
  const currentCrashPoint = useRef(0);
  const currentBetRef = useRef(0);
  const hasCashedOutRef = useRef(false); // Ref for animation frame access
  const rocketPosRef = useRef({ x: 0, y: 0 }); // Track rocket position for explosion
  const autoCashOutRef = useRef(0); // Ref for auto cash-out value
  const autoCashOutEnabledRef = useRef(false); // Ref for auto cash-out enabled state

  // Toast helper
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Sound effects (stub - would need actual audio files)
  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    
    try {
      const soundMap = {
        launch: soundsRef.current.flying,
        flying: soundsRef.current.flying,
        crash: soundsRef.current.explosion,
        fail: soundsRef.current.fail,
        cashout: soundsRef.current.success,
        click: soundsRef.current.click,
        ping: soundsRef.current.ping
      };

      const sound = soundMap[type];
      if (!sound) return;

      if (type === 'flying' || type === 'launch') {
        sound.currentTime = 0;
        sound.play().catch(e => console.warn("Audio play blocked:", e));
      } else if (type === 'crash') {
        // Stop flying immediately on crash
        if (soundsRef.current.flying) {
          soundsRef.current.flying.pause();
          soundsRef.current.flying.currentTime = 0;
        }
        sound.currentTime = 0;
        sound.play().catch(e => console.warn("Audio play blocked:", e));
        
        // Play fail sound after explosion (approx duration check)
        setTimeout(() => {
          if (soundsRef.current.fail) {
            soundsRef.current.fail.currentTime = 0;
            soundsRef.current.fail.play().catch(e => console.warn("Audio play blocked:", e));
          }
        }, 1200);
      } else {
        sound.currentTime = 0;
        sound.play().catch(e => console.warn("Audio play blocked:", e));
      }
    } catch (err) {
      console.warn("Audio implementation error:", err);
    }
  }, [soundEnabled]);

  // Preload images
  useEffect(() => {
    const rocketImg = new Image();
    rocketImg.onload = () => setImagesLoaded(prev => ({ ...prev, rocket: true }));
    rocketImg.onerror = () => setImagesLoaded(prev => ({ ...prev, rocket: false }));
    rocketImg.src = '/images/assets/bws_rocket.png';

    const ticketImg = new Image();
    ticketImg.onload = () => setImagesLoaded(prev => ({ ...prev, ticket: true }));
    ticketImg.onerror = () => setImagesLoaded(prev => ({ ...prev, ticket: false }));
    ticketImg.src = '/images/assets/tulsa_ticket.png';

    const asteroidImg = new Image();
    asteroidImg.onload = () => setImagesLoaded(prev => ({ ...prev, asteroid: true }));
    asteroidImg.onerror = () => setImagesLoaded(prev => ({ ...prev, asteroid: false }));
    asteroidImg.src = '/images/assets/golden_asteroid.png';

    const galaxyImg = new Image();
    galaxyImg.onload = () => setImagesLoaded(prev => ({ ...prev, galaxy: true }));
    galaxyImg.src = '/images/assets/galaxy_bg.gif';

    const planetImg = new Image();
    planetImg.onload = () => setImagesLoaded(prev => ({ ...prev, planet: true }));
    planetImg.src = '/images/assets/golden_planet.png';
  }, []);

  // Live Winnings Generator (High Velocity)
  useEffect(() => {
    const wallets = [
      'Hm9x...P3kL', '7a2V...r4Wp', 'Kp5T...m2Nj', 'Gx9B...q4Fs', 
      '3v7D...m9Pl', '9t2R...k6Xs', 'Bc4S...m8Zk', 'Yh5N...r2Vq',
      'Px2M...t9Kw', 'Lk8Q...j4Hf', 'Mn2B...v6Cx', 'Zx9Y...p3Wd',
      'As3F...k9Lm', 'Qw2E...r3Ty', 'Zx7C...v8Bn', 'Pl5O...k1Mj'
    ];

    const generateWin = () => {
      // Significantly higher chance for more "activity"
      const chance = gameState === 'playing' ? 0.85 : 0.45;
      if (Math.random() > chance) return;

      const duration = 1000 + Math.random() * 4000; // 1-5 seconds
      const newWin = {
        id: Math.random().toString(36).substr(2, 9),
        wallet: wallets[Math.floor(Math.random() * wallets.length)],
        amount: Math.floor(Math.random() * 8000) + 100,
        multiplier: 1.1 + (Math.random() * (multiplierRef.current > 1.2 ? multiplierRef.current : 3.0)),
        expiresAt: Date.now() + duration
      };

      setWinsFeed(prev => [newWin, ...prev].slice(0, 15)); // Keep a slightly larger buffer
    };

    // Rapid generation interval
    const interval = setInterval(generateWin, 400 + Math.random() * 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Feed Cleanup Effect
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setWinsFeed(prev => {
        const remaining = prev.filter(win => !win.expiresAt || win.expiresAt > now);
        return remaining.length !== prev.length ? remaining : prev;
      });
    }, 500);
    return () => clearInterval(cleanup);
  }, []);

  // Sync auto cash-out state to refs for animation frame access
  useEffect(() => {
    autoCashOutRef.current = autoCashOut;
    autoCashOutEnabledRef.current = autoCashOutEnabled;
  }, [autoCashOut, autoCashOutEnabled]);

  // Track stage dimensions with ResizeObserver
  useEffect(() => {
    if (!stageRef.current) return;
    
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setStageDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate rocket position using state instead of ref
  const currentRocketPos = useMemo(() => {
    let pos;
    if (!stageDimensions.width || !stageDimensions.height) {
      pos = { x: 70, y: stageDimensions.height || 300 };
    } else if (gameState === 'lobby' || pathPoints.length === 0) {
      // In lobby, position rocket at starting position
      pos = { 
        x: 70, 
        y: stageDimensions.height - 70 
      };
    } else {
      const lastPoint = pathPoints[pathPoints.length - 1];
      pos = {
        x: (lastPoint.time / viewLimits.maxT) * stageDimensions.width,
        y: stageDimensions.height - (((lastPoint.mult - 1) / (viewLimits.maxM - 1)) * stageDimensions.height)
      };
    }
    // Update ref for explosion positioning
    rocketPosRef.current = pos;
    return pos;
  }, [pathPoints, viewLimits, stageDimensions, gameState]);

  // Validate and set bet amount
  const handleBetChange = useCallback((value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setBetAmount(numValue);
  }, []);

  const validateBet = useCallback(() => {
    if (betAmount < CONFIG.MIN_BET) {
      showToast(`Minimum bet is ${CONFIG.MIN_BET}`, 'warning');
      return false;
    }
    if (betAmount > CONFIG.MAX_BET) {
      showToast(`Maximum bet is ${CONFIG.MAX_BET.toLocaleString()}`, 'warning');
      return false;
    }
    if (betAmount > ticketBalance) {
      showToast('Insufficient balance!', 'error');
      return false;
    }
    return true;
  }, [betAmount, ticketBalance, showToast]);

  // Start game
  const startGame = useCallback(() => {
    if (!validateBet()) return;
    
    currentBetRef.current = betAmount;
    setTicketBalance(prev => prev - betAmount);
    setGameState('playing');
    setMultiplier(1.00);
    multiplierRef.current = 1.00;
    setHasCashedOut(false);
    hasCashedOutRef.current = false; // Reset ref
    setCashedOutAt(null);
    setPathPoints([{ time: 0, mult: 1 }]);
    setViewLimits({ maxT: 8, maxM: 2 });
    setShowExplosion(false); // Reset explosion
    setExplosionPos(null);
    setScreenShake(false);
    setMilestones([]); // Reset milestones
    setAsteroid(null); // Reset asteroid
    asteroidSpawned.current = false;
    
    // Calculate crash point with house edge
    currentCrashPoint.current = Math.random() < 0.015 
      ? 1.00 
      : (100 / (1 - Math.random() * (0.99 - CONFIG.HOUSE_EDGE))) / 100;
    
    START_TIME.current = Date.now();
    playSound('launch');
    playSound('click');
  }, [betAmount, validateBet, playSound]);

  // Cash out
  const cashOut = useCallback(() => {
    if (gameState !== 'playing' || hasCashedOut) return;
    
    const currentMult = multiplierRef.current;
    const winnings = currentBetRef.current * currentMult;
    setTicketBalance(prev => prev + winnings);
    setHasCashedOut(true);
    hasCashedOutRef.current = true; // Update ref immediately for animation frame
    setCashedOutAt(currentMult);
    playSound('cashout');
    playSound('click');
    showToast(`Cashed out at ${currentMult.toFixed(2)}x! +${(winnings - currentBetRef.current).toFixed(0)}`, 'success');
  }, [gameState, hasCashedOut, playSound, showToast]);

  // Game animation frame
  useAnimationFrame(() => {
    if (gameState !== 'playing') return;
    
    const elapsed = (Date.now() - START_TIME.current) / 1000;
    const nextMultiplier = Math.pow(Math.E, 0.07 * elapsed);
    
    // Calculate time until crash for asteroid spawning
    const crashTime = Math.log(currentCrashPoint.current) / 0.07;
    const timeUntilCrash = crashTime - elapsed;
    
    // Spawn asteroid when approaching crash
    if (!asteroidSpawned.current && timeUntilCrash <= CONFIG.ASTEROID_WARN_TIME && timeUntilCrash > 0) {
      asteroidSpawned.current = true;
      
      // Calculate where rocket will be at crash
      const crashMult = currentCrashPoint.current;
      const newMaxT = Math.max(8, crashTime * 1.3);
      const newMaxM = Math.max(2, crashMult * 1.4);
      
      const targetX = (crashTime / newMaxT) * stageDimensions.width;
      const targetY = stageDimensions.height - (((crashMult - 1) / (newMaxM - 1)) * stageDimensions.height);
      
      // Random start position from edges
      const side = Math.random() > 0.5 ? 'top' : 'right';
      const startX = side === 'right' ? stageDimensions.width + 100 : Math.random() * stageDimensions.width;
      const startY = side === 'top' ? -100 : Math.random() * stageDimensions.height * 0.5;
      
      setAsteroid({
        id: Date.now(),
        startX,
        startY,
        endX: targetX - 70, // Offset to hit rocket center
        endY: targetY - 70,
        duration: timeUntilCrash,
        onImpact: () => {} // Impact handled by crash detection
      });
    }
    
    // Check for crash
    if (gameStateRef.current === 'playing' && nextMultiplier >= currentCrashPoint.current) {
      // Set state immediately in ref to prevent double trigger
      gameStateRef.current = 'crashed';
      
      // Trigger explosion at rocket position
      setExplosionPos({ ...rocketPosRef.current });
      setShowExplosion(true);
      setScreenShake(true);
      setAsteroid(null); // Clear asteroid
      
      // Clear screen shake after animation
      setTimeout(() => setScreenShake(false), 500);
      
      // Clear explosion after animation completes
      setTimeout(() => setShowExplosion(false), 1500);
      
      setGameState('crashed');
      playSound('crash');
      
      const didCashOut = hasCashedOutRef.current;
      const historyEntry = {
        crashPoint: currentCrashPoint.current,
        result: didCashOut ? 'win' : 'loss',
        profit: didCashOut ? (currentBetRef.current * multiplierRef.current) - currentBetRef.current : 0,
        loss: didCashOut ? 0 : currentBetRef.current,
        cashedAt: didCashOut ? multiplierRef.current : null,
      };
      
      setHistory(prev => [historyEntry, ...prev.slice(0, 19)]);
      
      if (!didCashOut) {
        showToast(`Crashed at ${currentCrashPoint.current.toFixed(2)}x! Lost ${currentBetRef.current}`, 'error');
      }
      return;
    }
    
    // Auto cash-out check - use refs to get current values
    const autoEnabled = autoCashOutEnabledRef.current;
    const autoValue = autoCashOutRef.current;
    
    if (autoEnabled && autoValue >= 1.01 && nextMultiplier >= autoValue && !hasCashedOutRef.current) {
      // Perform cash out inline to avoid stale closure issues
      const currentMult = nextMultiplier;
      const winnings = currentBetRef.current * currentMult;
      setTicketBalance(prev => prev + winnings);
      setHasCashedOut(true);
      hasCashedOutRef.current = true;
      setCashedOutAt(currentMult);
      playSound('cashout');
      showToast(`Auto-ejected at ${currentMult.toFixed(2)}x! +${(winnings - currentBetRef.current).toFixed(0)}`, 'success');
      return;
    }
    
    // Check for new milestones
    CONFIG.MILESTONES.forEach(milestoneValue => {
      if (nextMultiplier >= milestoneValue) {
        setMilestones(prev => {
          if (prev.some(m => m.value === milestoneValue)) return prev;
          playSound('ping');
          return [...prev, { value: milestoneValue, time: elapsed, isNew: true }];
        });
      }
    });
    
    setMultiplier(nextMultiplier);
    multiplierRef.current = nextMultiplier;
    
    // Update view limits
    const newMaxT = Math.max(8, elapsed * 1.3);
    const newMaxM = Math.max(2, nextMultiplier * 1.4);
    setViewLimits({ maxT: newMaxT, maxM: newMaxM });

    // Optimized path points - limit array size
    setPathPoints(prev => {
      const newPoints = [...prev, { time: elapsed, mult: nextMultiplier }];
      if (newPoints.length > CONFIG.MAX_PATH_POINTS) {
        // Sample points to keep the curve smooth while limiting size
        const step = Math.ceil(newPoints.length / CONFIG.MAX_PATH_POINTS);
        return newPoints.filter((_, i) => i % step === 0 || i === newPoints.length - 1);
      }
      return newPoints;
    });
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'playing' && !hasCashedOut) {
          cashOut();
        } else if (gameState !== 'playing') {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, hasCashedOut, cashOut, startGame]);

  return (
    <div className="fixed inset-0 bg-[#030303] text-white font-sans overflow-hidden flex flex-col p-4 md:p-6 lg:p-10">
      
      {/* Toast Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
        <div className="flex flex-col gap-2 p-4 pointer-events-none">
          <AnimatePresence>
            {toasts.map((toast) => (
              <Toast 
                key={toast.id} 
                id={toast.id}
                message={toast.message} 
                type={toast.type} 
                onClose={removeToast} 
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {/* HEADER HUD */}
      <header className="flex items-start justify-between mb-4 md:mb-6">
        <div className="flex flex-col gap-2 md:gap-4">
          <div className="flex gap-2">
            <Link to="/games" onClick={() => playSound('click')} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl glass-control border border-white/10 flex items-center justify-center hover:bg-yellow-400 transition-all shadow-2xl group">
              <ChevronLeft className="w-5 h-5 md:w-7 md:h-7 group-hover:text-black transition-colors" />
            </Link>
            
            {/* Sound Toggle */}
            <button 
              onClick={() => { playSound('click'); setSoundEnabled(!soundEnabled); }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-2xl glass-control border border-white/10 flex items-center justify-center hover:bg-yellow-400 transition-all shadow-2xl group"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 md:w-6 md:h-6 group-hover:text-black transition-colors" />
              ) : (
                <VolumeX className="w-5 h-5 md:w-6 md:h-6 group-hover:text-black transition-colors opacity-50" />
              )}
            </button>

            {/* Mobile History Toggle */}
            <button 
              onClick={() => { playSound('click'); setShowMobileHistory(!showMobileHistory); }}
              className="lg:hidden w-10 h-10 md:w-12 md:h-12 rounded-2xl glass-control border border-white/10 flex items-center justify-center hover:bg-yellow-400 transition-all shadow-2xl group"
            >
              <IconActivity className="w-5 h-5 md:w-6 md:h-6 group-hover:text-black transition-colors" />
            </button>
          </div>
          
          <div className="hidden md:block glass-control border border-white/10 px-5 py-3 rounded-2xl">
            <div className="text-[9px] font-black text-yellow-500/40 tracking-[0.4em] mb-1">DATA_FEED_7G</div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-[10px] font-black text-white/40 tracking-widest uppercase italic">Node_Active</span>
            </div>
          </div>
          
          {/* Keyboard hint */}
          <div className="hidden md:flex items-center gap-2 glass-control border border-white/10 px-4 py-2 rounded-xl opacity-50">
            <Keyboard className="w-3 h-3" />
            <span className="text-[9px] font-bold tracking-wider">SPACE to {gameState === 'playing' ? 'EJECT' : 'LAUNCH'}</span>
          </div>
        </div>

        {/* MULTIPLIER DISPLAY */}
        <div className="flex flex-col items-center">
          <div className={`text-4xl md:text-6xl lg:text-[9rem] font-black tracking-tighter leading-none transition-all duration-300 ${
            gameState === 'crashed' ? 'text-red-500' : hasCashedOut ? 'text-green-400' : 'text-yellow-400'
          } drop-shadow-[0_0_60px_rgba(250,204,21,0.2)]`}>
            {multiplier.toFixed(2)}x
          </div>
          {hasCashedOut && cashedOutAt && (
            <div className="text-[10px] font-black tracking-[0.5em] text-green-400 mt-2 uppercase animate-pulse">
              Secured @ {cashedOutAt.toFixed(2)}x
            </div>
          )}
        </div>

        {/* BALANCE */}
        <div className="flex flex-col items-end gap-3">
          <div className="glass-control border border-white/5 py-3 px-4 md:py-4 md:px-6 rounded-3xl backdrop-blur-3xl shadow-2xl flex items-center gap-3 md:gap-4">
            <div className="text-right">
              <div className="text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-widest">Vault_Balance</div>
              <div className="text-yellow-500 font-black text-xl md:text-2xl tracking-tighter leading-none">
                {ticketBalance.toLocaleString()}
              </div>
            </div>
            {imagesLoaded.ticket ? (
              <img 
                src="/images/assets/tulsa_ticket.png" 
                alt="" 
                className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]" 
              />
            ) : (
              <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-2xl">🎫</div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile History Drawer */}
      <AnimatePresence>
        {showMobileHistory && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden mb-4 max-h-48"
          >
            <HistoryPanel history={history} className="max-h-48" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE LAYOUT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-4 md:gap-8 min-h-0">
        
        {/* HISTORY PANEL - Desktop */}
        <aside className="hidden lg:flex flex-col gap-4 overflow-hidden">
          <HistoryPanel history={history} />
        </aside>

        {/* CHART ARENA */}
        <motion.main 
          ref={stageRef} 
          className="flex-1 min-h-0 flex flex-col"
          animate={screenShake ? {
            x: [0, -10, 10, -10, 10, -5, 5, 0],
            y: [0, -5, 5, -5, 5, -2, 2, 0],
          } : {}}
          transition={{ duration: 0.5 }}
        >
          <ChartEngine 
            pathPoints={pathPoints} 
            gameState={gameState} 
            viewLimits={viewLimits} 
            multiplier={multiplier}
            rocketPos={currentRocketPos}
            stageDimensions={stageDimensions}
            imagesLoaded={imagesLoaded}
            showExplosion={showExplosion}
            explosionPos={explosionPos}
            milestones={milestones}
            asteroid={asteroid}
            asteroidImageLoaded={imagesLoaded.asteroid}
            winsFeed={winsFeed}
          />
        </motion.main>

        {/* BETTING PANEL */}
        <aside className="flex flex-col gap-4 md:gap-6">
          <div className="glass-control border border-white/10 rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 h-full flex flex-col justify-between border-t-yellow-400/20">
            
            <div className="space-y-4 md:space-y-6">
              <div className="text-center pb-4 border-b border-white/5">
                <div className="text-[10px] font-black text-yellow-500/40 tracking-[0.4em] mb-1">STAKING_HUB</div>
                <div className="text-[9px] font-bold text-white/20 tracking-widest uppercase">Encryption_V7</div>
              </div>

              {/* Bet Amount */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black text-zinc-500 px-2 tracking-[0.3em] uppercase">
                  <span>Stake_Val</span>
                  <span className="text-yellow-500/40">{CONFIG.MIN_BET}-{CONFIG.MAX_BET.toLocaleString()}</span>
                </div>
                <input 
                  type="number" 
                  value={betAmount} 
                  onChange={(e) => handleBetChange(e.target.value)} 
                  disabled={gameState === 'playing'} 
                  min={CONFIG.MIN_BET}
                  max={CONFIG.MAX_BET}
                  className="w-full bg-black/80 border border-white/10 rounded-3xl py-6 md:py-8 px-4 font-black text-4xl md:text-6xl text-white outline-none focus:border-yellow-500/50 text-center disabled:opacity-50 shadow-inner" 
                />
                <div className="grid grid-cols-4 gap-2">
                  {[100, 500, 1000, 5000].map(v => (
                    <button 
                      key={v} 
                      onClick={() => { playSound('click'); setBetAmount(v); }} 
                      disabled={gameState === 'playing'} 
                      className="py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black hover:bg-yellow-400 hover:text-black transition-all uppercase disabled:opacity-30"
                    >
                      {v >= 1000 ? `${v/1000}K` : v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Cash-out */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-500 px-2 tracking-[0.3em] uppercase">Auto_Eject</span>
                  <button
                    onClick={() => { playSound('click'); setAutoCashOutEnabled(!autoCashOutEnabled); }}
                    disabled={gameState === 'playing'}
                    className={`w-10 h-5 rounded-full transition-all ${
                      autoCashOutEnabled ? 'bg-yellow-500' : 'bg-zinc-700'
                    } ${gameState === 'playing' ? 'opacity-50' : ''}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      autoCashOutEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <input 
                    type="number" 
                    value={autoCashOut} 
                    onChange={(e) => setAutoCashOut(Math.max(1.01, parseFloat(e.target.value) || 1.5))} 
                    disabled={gameState === 'playing' || !autoCashOutEnabled}
                    placeholder="1.50"
                    step="0.1"
                    min="1.01"
                    className="w-32 bg-black/80 border border-white/10 rounded-2xl py-4 px-4 font-black text-xl text-white outline-none focus:border-yellow-500/50 text-center disabled:opacity-30 shadow-inner" 
                  />
                  <span className="text-lg font-black text-zinc-500">x</span>
                </div>
              </div>
            </div>

            <div className="pt-4 md:pt-6 space-y-4">
              <AnimatePresence mode="wait">
                {gameState === 'playing' ? (
                  <motion.button 
                    key="cashout" 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    onClick={cashOut} 
                    disabled={hasCashedOut} 
                    className={`w-full py-8 md:py-10 rounded-[2rem] md:rounded-[2.5rem] font-black text-2xl md:text-4xl tracking-[0.2em] shadow-2xl transition-all ${
                      hasCashedOut 
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                        : 'bg-gradient-to-br from-green-400 to-emerald-700 text-black hover:-translate-y-2 hover:shadow-green-400/30'
                    }`}
                  >
                    {hasCashedOut ? 'BANKED' : 'EJECT'}
                  </motion.button>
                ) : (
                  <motion.button 
                    key="launch" 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    onClick={startGame} 
                    className="w-full py-8 md:py-10 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 text-black font-black text-2xl md:text-4xl uppercase tracking-[0.2em] shadow-[0_25px_50px_rgba(250,204,21,0.5)] hover:shadow-yellow-400 hover:-translate-y-2 transition-all"
                  >
                    LAUNCH
                  </motion.button>
                )}
              </AnimatePresence>
              
              {gameState === 'playing' && !hasCashedOut && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-green-500 tracking-[0.5em] animate-pulse uppercase">Profit_Proj:</span>
                  <div className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                    {(betAmount * multiplier).toFixed(0)}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 md:mt-8 flex items-center justify-between opacity-30 px-2 transition-opacity">
              <span className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                <IconShield className="w-3 h-3 md:w-3.5 md:h-3.5" /> Secure
              </span>
              <span className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                <IconRadio className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-500" /> Live Feed
              </span>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .yellow-graph-grid {
          background-image: linear-gradient(rgba(250,204,21,0.2) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(250,204,21,0.2) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .glass-control {
          background: rgba(12, 12, 12, 0.8);
          backdrop-filter: blur(40px);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(250, 204, 21, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default TulsaCrash;