import React, { useState, useEffect, useRef } from 'react';
import { 
    Code, Shield, Globe, Users, Rocket, Lock, BarChart, Search, 
    MessageCircle, TrendingUp, DollarSign, ArrowRightLeft, Coins, 
    RefreshCw, Link, Landmark, PiggyBank, CheckCircle, Building2,
    Target, Check, Wallet, LayoutDashboard, Box,
    Network, Building, Boxes, Loader2, ChevronRight, ChevronLeft,
    Sparkles, Zap, Crown
} from 'lucide-react';

// Status types
const STATUS = {
  COMPLETE: 1,
  IN_PROGRESS: 2,
  PENDING: 0
};

// Roadmap data with detailed items
const roadmapData = [
  {
    phase: "Phase 1",
    title: "Foundation & Launch",
    subtitle: "Building the groundwork",
    icon: <Code className="h-6 w-6" />,
    items: [
      { icon: <Code className="h-5 w-5" />, text: "Smart Contract Development", status: STATUS.COMPLETE },
      { icon: <Shield className="h-5 w-5" />, text: "Contract Audit", status: STATUS.COMPLETE },
      { icon: <Globe className="h-5 w-5" />, text: "Website Launch", status: STATUS.COMPLETE },
      { icon: <Users className="h-5 w-5" />, text: "Community Building", status: STATUS.COMPLETE }
    ]
  },
  {
    phase: "Phase 2",
    title: "Initial Launch & Security",
    subtitle: "Going live on DEX",
    icon: <Rocket className="h-6 w-6" />,
    items: [
      { icon: <Rocket className="h-5 w-5" />, text: "Token Launch on DEX", status: STATUS.COMPLETE },
      { icon: <Lock className="h-5 w-5" />, text: "Liquidity Locking", status: STATUS.COMPLETE },
      { icon: <BarChart className="h-5 w-5" />, text: "DEXScreener Paid", status: STATUS.COMPLETE },
      { icon: <Search className="h-5 w-5" />, text: "DexScreener Listing", status: STATUS.COMPLETE }
    ]
  },
  {
    phase: "Phase 3",
    title: "Marketing & Growth",
    subtitle: "Expanding our reach",
    icon: <TrendingUp className="h-6 w-6" />,
    items: [
      { icon: <MessageCircle className="h-5 w-5" />, text: "Marketing Campaign Launch", status: STATUS.PENDING },
      { icon: <Users className="h-5 w-5" />, text: "Influencer Partnerships", status: STATUS.PENDING },
      { icon: <TrendingUp className="h-5 w-5" />, text: "Trending on DEXTools", status: STATUS.PENDING },
      { icon: <DollarSign className="h-5 w-5" />, text: "DEX Listing Payments", status: STATUS.PENDING }
    ]
  },
  {
    phase: "Phase 4",
    title: "Exchange Integration",
    subtitle: "Multi-platform trading",
    icon: <ArrowRightLeft className="h-6 w-6" />,
    items: [
      { icon: <ArrowRightLeft className="h-5 w-5" />, text: "Raydium Integration", status: STATUS.PENDING },
      { icon: <Coins className="h-5 w-5" />, text: "Jupiter Integration", status: STATUS.PENDING },
      { icon: <RefreshCw className="h-5 w-5" />, text: "Price Bot Implementation", status: STATUS.PENDING },
      { icon: <BarChart className="h-5 w-5" />, text: "Volume Building", status: STATUS.PENDING }
    ]
  },
  {
    phase: "Phase 5",
    title: "Ecosystem Expansion",
    subtitle: "Building utility",
    icon: <Boxes className="h-6 w-6" />,
    items: [
      { icon: <Link className="h-5 w-5" />, text: "Token Bonding", status: STATUS.PENDING },
      { icon: <Landmark className="h-5 w-5" />, text: "Staking Platform Launch", status: STATUS.PENDING },
      { icon: <PiggyBank className="h-5 w-5" />, text: "Reward System Implementation", status: STATUS.PENDING },
      { icon: <CheckCircle className="h-5 w-5" />, text: "Security Upgrades", status: STATUS.PENDING }
    ]
  },
  {
    phase: "Phase 6",
    title: "CEX & Partnerships",
    subtitle: "Major exchange listings",
    icon: <Building2 className="h-6 w-6" />,
    items: [
      { icon: <Building2 className="h-5 w-5" />, text: "CEX Listings", status: STATUS.PENDING },
      { icon: <Users className="h-5 w-5" />, text: "Strategic Partnerships", status: STATUS.PENDING },
      { icon: <Target className="h-5 w-5" />, text: "Market Making Integration", status: STATUS.PENDING },
      { icon: <Shield className="h-5 w-5" />, text: "Additional Audits", status: STATUS.PENDING }
    ]
  },
  {
    phase: "Phase 7",
    title: "Advanced Features",
    subtitle: "Next-level innovation",
    icon: <Zap className="h-6 w-6" />,
    items: [
      { icon: <Wallet className="h-5 w-5" />, text: "Multi-Chain Bridge", status: STATUS.PENDING },
      { icon: <LayoutDashboard className="h-5 w-5" />, text: "Governance Platform", status: STATUS.PENDING },
      { icon: <Box className="h-5 w-5" />, text: "NFT Integration", status: STATUS.PENDING },
      { icon: <BarChart className="h-5 w-5" />, text: "Ecosystem Analytics", status: STATUS.PENDING }
    ]
  },
  {
    phase: "Phase 8",
    title: "Future Development",
    subtitle: "Black Wall Street Vision",
    icon: <Crown className="h-6 w-6" />,
    items: [
      { icon: <Network className="h-5 w-5" />, text: "Cross-Chain Expansion", status: STATUS.PENDING },
      { icon: <Building className="h-5 w-5" />, text: "DAO Implementation", status: STATUS.PENDING },
      { icon: <Boxes className="h-5 w-5" />, text: "DeFi Tools Suite", status: STATUS.PENDING },
      { icon: <Target className="h-5 w-5" />, text: "Real World Integration", status: STATUS.PENDING }
    ]
  }
];

// Calculate phase status
const getPhaseStatus = (items) => {
  const allComplete = items.every(item => item.status === STATUS.COMPLETE);
  const hasInProgress = items.some(item => item.status === STATUS.IN_PROGRESS);
  const hasComplete = items.some(item => item.status === STATUS.COMPLETE);
  
  if (allComplete) return STATUS.COMPLETE;
  if (hasInProgress || (hasComplete && !allComplete)) return STATUS.IN_PROGRESS;
  return STATUS.PENDING;
};

// Milestone Node Component
const MilestoneNode = ({ phase, isActive, status, onClick, index }) => {
  const statusClasses = {
    [STATUS.COMPLETE]: 'milestone-node completed',
    [STATUS.IN_PROGRESS]: 'milestone-node in-progress glow-pulse-amber',
    [STATUS.PENDING]: 'milestone-node pending'
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full
        transition-all duration-300 cursor-pointer z-10 flex-shrink-0
        ${statusClasses[status]}
        ${isActive ? 'ring-4 ring-amber-500/50 scale-110' : 'hover:scale-105'}
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Inner content */}
      <div className="text-white">
        {status === STATUS.COMPLETE ? (
          <Check className="h-5 w-5 sm:h-8 sm:w-8" />
        ) : status === STATUS.IN_PROGRESS ? (
          <Loader2 className="h-5 w-5 sm:h-8 sm:w-8 animate-spin" />
        ) : (
          <span className="text-sm sm:text-lg font-bold">{index + 1}</span>
        )}
      </div>
      
      {/* Phase label below */}
      <span className={`
        absolute -bottom-6 sm:-bottom-8 text-[10px] sm:text-xs font-medium whitespace-nowrap
        ${status === STATUS.COMPLETE ? 'text-green-400' : 
          status === STATUS.IN_PROGRESS ? 'text-amber-400' : 'text-zinc-500'}
      `}>
        {phase}
      </span>

      {/* Celebration burst for completed */}
      {status === STATUS.COMPLETE && (
        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" style={{ animationDuration: '2s' }} />
      )}
    </button>
  );
};

// Phase Detail Card Component
const PhaseDetailCard = ({ data, isVisible }) => {
  const phaseStatus = getPhaseStatus(data.items);
  const completedCount = data.items.filter(item => item.status === STATUS.COMPLETE).length;
  const progress = (completedCount / data.items.length) * 100;

  return (
    <div className={`
      transition-all duration-500 transform
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
    `}>
      <div className="glass rounded-2xl p-6 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`
              p-4 rounded-xl
              ${phaseStatus === STATUS.COMPLETE ? 'bg-green-500/20 text-green-400' :
                phaseStatus === STATUS.IN_PROGRESS ? 'bg-amber-500/20 text-amber-400' :
                'bg-zinc-700/50 text-zinc-400'}
            `}>
              {data.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`
                  text-sm font-medium px-3 py-1 rounded-full
                  ${phaseStatus === STATUS.COMPLETE ? 'bg-green-500/20 text-green-400' :
                    phaseStatus === STATUS.IN_PROGRESS ? 'bg-amber-500/20 text-amber-400' :
                    'bg-zinc-700/50 text-zinc-500'}
                `}>
                  {data.phase}
                </span>
                {phaseStatus === STATUS.COMPLETE && (
                  <Sparkles className="h-5 w-5 text-green-400" />
                )}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">{data.title}</h3>
              <p className="text-zinc-400 mt-1">{data.subtitle}</p>
            </div>
          </div>
          
          {/* Progress indicator - show on mobile inline */}
          <div className="flex md:hidden items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${progress}%`,
                  background: progress === 100 
                    ? 'linear-gradient(90deg, #22c55e, #16a34a)' 
                    : 'linear-gradient(90deg, #f59e0b, #d97706)'
                }}
              />
            </div>
            <span className="text-sm font-bold text-amber-500">{Math.round(progress)}%</span>
          </div>
          
          {/* Progress indicator - desktop */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-3xl font-bold text-amber-500">{Math.round(progress)}%</span>
            <span className="text-sm text-zinc-500">Complete</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-zinc-800 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${progress}%`,
              background: progress === 100 
                ? 'linear-gradient(90deg, #22c55e, #16a34a)' 
                : 'linear-gradient(90deg, #f59e0b, #d97706)'
            }}
          />
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.items.map((item, idx) => (
            <div 
              key={idx}
              className={`
                flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                ${item.status === STATUS.COMPLETE ? 'bg-green-500/10 border border-green-500/20' :
                  item.status === STATUS.IN_PROGRESS ? 'bg-amber-500/10 border border-amber-500/20' :
                  'bg-zinc-800/50 border border-zinc-700/50'}
                hover:scale-[1.02]
              `}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`
                p-2 rounded-lg
                ${item.status === STATUS.COMPLETE ? 'bg-green-500/20 text-green-400' :
                  item.status === STATUS.IN_PROGRESS ? 'bg-amber-500/20 text-amber-400' :
                  'bg-zinc-700/50 text-zinc-500'}
              `}>
                {item.icon}
              </div>
              <span className={`
                font-medium flex-1
                ${item.status === STATUS.COMPLETE ? 'text-green-300' :
                  item.status === STATUS.IN_PROGRESS ? 'text-amber-300' :
                  'text-zinc-400'}
              `}>
                {item.text}
              </span>
              {item.status === STATUS.COMPLETE && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              {item.status === STATUS.IN_PROGRESS && (
                <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Particle component for the timeline
const TimelineParticle = ({ delay }) => (
  <div 
    className="particle-trail"
    style={{ animationDelay: `${delay}s` }}
  />
);

// Main Epic Roadmap Component
const EpicRoadmap = () => {
  const [activePhase, setActivePhase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timelineRef = useRef(null);

  // Calculate overall progress
  const totalItems = roadmapData.reduce((acc, phase) => acc + phase.items.length, 0);
  const completedItems = roadmapData.reduce((acc, phase) => 
    acc + phase.items.filter(item => item.status === STATUS.COMPLETE).length, 0);
  const overallProgress = Math.round((completedItems / totalItems) * 100);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('roadmap');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  // Navigation handlers
  const navigatePrev = () => {
    setActivePhase(prev => Math.max(0, prev - 1));
  };

  const navigateNext = () => {
    setActivePhase(prev => Math.min(roadmapData.length - 1, prev + 1));
  };

  // Scroll timeline to active phase
  useEffect(() => {
    if (timelineRef.current) {
      const node = timelineRef.current.children[activePhase];
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activePhase]);

  return (
    <section id="roadmap" className="py-20 px-4 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="shimmer-text">Project Roadmap</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Our journey to rebuild Black Wall Street in the digital age
          </p>

          {/* Overall Progress Bar */}
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Overall Progress</span>
              <span className="text-lg font-bold text-amber-500">{overallProgress}%</span>
            </div>
            <div className="h-3 bg-zinc-800/80 rounded-full overflow-hidden glass">
              <div 
                className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{ 
                  width: isVisible ? `${overallProgress}%` : '0%',
                  background: 'linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #d97706 100%)'
                }}
              >
                {/* Shimmer effect on progress bar */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
                     style={{ backgroundSize: '200% 100%' }} />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-zinc-500">
              <span>Foundation</span>
              <span>Black Wall Street Vision</span>
            </div>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative mb-12">
          {/* Navigation Arrows */}
          <button 
            onClick={navigatePrev}
            disabled={activePhase === 0}
            className={`
              absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full
              glass transition-all duration-300
              ${activePhase === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-amber-500/20 hover:glow-gold'}
            `}
          >
            <ChevronLeft className="h-6 w-6 text-amber-500" />
          </button>
          
          <button 
            onClick={navigateNext}
            disabled={activePhase === roadmapData.length - 1}
            className={`
              absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full
              glass transition-all duration-300
              ${activePhase === roadmapData.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-amber-500/20 hover:glow-gold'}
            `}
          >
            <ChevronRight className="h-6 w-6 text-amber-500" />
          </button>

          {/* Timeline with milestones - horizontal scroll on all screens */}
          <div className="px-8 sm:px-12 md:px-16 overflow-hidden">
            <div 
              ref={timelineRef}
              className="flex items-center gap-3 sm:gap-4 md:gap-8 py-10 sm:py-12 overflow-x-auto scrollbar-hide pb-8"
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* Connecting Line */}
              <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-1 z-0">
                {/* Background line */}
                <div className="absolute inset-0 bg-zinc-800 rounded-full" />
                {/* Progress line */}
                <div 
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: isVisible ? `${(activePhase / (roadmapData.length - 1)) * 100}%` : '0%',
                    background: 'linear-gradient(90deg, #22c55e, #f59e0b)'
                  }}
                />
                {/* Particle trail */}
                <div className="absolute inset-0 overflow-hidden">
                  <TimelineParticle delay={0} />
                  <TimelineParticle delay={0.8} />
                  <TimelineParticle delay={1.6} />
                  <TimelineParticle delay={2.4} />
                  <TimelineParticle delay={3.2} />
                </div>
              </div>

              {/* Milestone nodes */}
              {roadmapData.map((phase, index) => (
                <MilestoneNode
                  key={index}
                  phase={phase.phase}
                  index={index}
                  isActive={index === activePhase}
                  status={getPhaseStatus(phase.items)}
                  onClick={() => setActivePhase(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Phase Detail Card */}
        <PhaseDetailCard 
          data={roadmapData[activePhase]} 
          isVisible={isVisible}
        />

        {/* Phase navigation dots (mobile) */}
        <div className="flex justify-center gap-2 mt-8 md:hidden">
          {roadmapData.map((_, index) => (
            <button
              key={index}
              onClick={() => setActivePhase(index)}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === activePhase 
                  ? 'w-6 bg-amber-500' 
                  : 'bg-zinc-700 hover:bg-zinc-600'}
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EpicRoadmap;
