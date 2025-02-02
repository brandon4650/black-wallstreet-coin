import React, { useState, useEffect } from 'react';
import { 
  Code, Shield, Globe, Users, Rocket, Lock, BarChart, Search, 
  Megaphone, Trending, BadgeDollarSign, ArrowRightLeft, Coins, 
  RefreshCw, Link, Landmark, PiggyBank, ShieldCheck, Building2,
  Handshake, Target, BadgeCheck, Wallet, LayoutDashboard, Box,
  GanttChart, Network, Building, Blocks, Goal
} from 'lucide-react';

// Status types remain the same
const STATUS = {
  COMPLETE: 1,
  IN_PROGRESS: 2,
  PENDING: 0
};

// Modified RoadmapItem to include permanent downward arrow
const RoadmapItem = ({ phase, title, items, phaseStatus, isLastPhase }) => {
  // Calculate if all items are complete
  const allItemsComplete = items.every(item => item.status === STATUS.COMPLETE);
  const hasInProgress = items.some(item => item.status === STATUS.IN_PROGRESS);
  
  // Determine phase status based on items
  const actualPhaseStatus = allItemsComplete ? STATUS.COMPLETE : 
                           hasInProgress ? STATUS.IN_PROGRESS : STATUS.PENDING;

  return (
    <div className="relative">
      <div className={`relative bg-zinc-800/50 p-6 rounded-xl transition-all duration-300 ${
        actualPhaseStatus === STATUS.COMPLETE ? 'border-l-4 border-green-500' : 
        actualPhaseStatus === STATUS.IN_PROGRESS ? 'border-l-4 border-amber-500' : 
        'border-l-4 border-zinc-700'
      }`}>
        <div className="flex items-center mb-4">
          <div className={`${
            actualPhaseStatus === STATUS.COMPLETE ? 'bg-green-500' : 
            actualPhaseStatus === STATUS.IN_PROGRESS ? 'bg-amber-500' : 
            'bg-zinc-700'
          } text-sm font-medium px-3 py-1 rounded-full flex items-center`}>
            {phase}
            {actualPhaseStatus === STATUS.COMPLETE && <Check className="ml-1 h-4 w-4" />}
            {actualPhaseStatus === STATUS.IN_PROGRESS && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
          </div>
          <h3 className="text-xl font-semibold ml-4">{title}</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {items.map((item, itemIndex) => (
            <div key={itemIndex} 
              className={`bg-zinc-700/50 p-4 rounded-lg flex items-center transition-all duration-300 ${
                item.status === STATUS.COMPLETE ? 'border-l-2 border-green-500' : 
                item.status === STATUS.IN_PROGRESS ? 'border-l-2 border-amber-500' : 
                'border-l-2 border-zinc-600'
              }`}>
              <div className="text-amber-500">{item.icon}</div>
              <span className="ml-3">{item.text}</span>
              {item.status === STATUS.COMPLETE && <Check className="ml-auto h-4 w-4 text-green-500" />}
              {item.status === STATUS.IN_PROGRESS && <Loader2 className="ml-auto h-4 w-4 text-amber-500 animate-spin" />}
            </div>
          ))}
        </div>
      </div>

      {/* Downward Arrow - shows unless it's the last phase */}
      {!isLastPhase && (
        <div className="flex justify-center my-4">
          <div className={`transition-colors duration-300 ${
            actualPhaseStatus === STATUS.COMPLETE ? 'text-green-500' :
            actualPhaseStatus === STATUS.IN_PROGRESS ? 'text-amber-500' :
            'text-zinc-700'
          }`}>
            <ArrowDown className="h-8 w-8" />
          </div>
        </div>
      )}
    </div>
  );
};

const InteractiveRoadmap = () => {
  const roadmapData = [
    {
      phase: "Phase 1",
      title: "Foundation & Launch",
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
      items: [
        { icon: <Rocket className="h-5 w-5" />, text: "Token Launch on DEX", status: STATUS.IN_PROGRESS },
        { icon: <Lock className="h-5 w-5" />, text: "Liquidity Locking", status: STATUS.PENDING },
        { icon: <BarChart className="h-5 w-5" />, text: "DEXTools Update", status: STATUS.PENDING },
        { icon: <Search className="h-5 w-5" />, text: "DexScreener Listing", status: STATUS.PENDING }
      ]
    },
    {
      phase: "Phase 3",
      title: "Marketing & Growth",
      items: [
        { icon: <Megaphone className="h-5 w-5" />, text: "Marketing Campaign Launch", status: STATUS.PENDING },
        { icon: <Users className="h-5 w-5" />, text: "Influencer Partnerships", status: STATUS.PENDING },
        { icon: <Trending className="h-5 w-5" />, text: "Trending on DEXTools", status: STATUS.PENDING },
        { icon: <BadgeDollarSign className="h-5 w-5" />, text: "DEX Listing Payments", status: STATUS.PENDING }
      ]
    },
    {
      phase: "Phase 4",
      title: "Exchange Integration",
      items: [
        { icon: <ArrowRightLeft className="h-5 w-5" />, text: "Raydium Integration", status: STATUS.PENDING },
        { icon: <Coins className="h-5 w-5" />, text: "Jupiter Integration", status: STATUS.PENDING },
        { icon: <RefreshCw className="h-5 w-5" />, text: "Price Bot Implementation", status: STATUS.PENDING },
        { icon: <ChartBar className="h-5 w-5" />, text: "Volume Building", status: STATUS.PENDING }
      ]
    },
    {
      phase: "Phase 5",
      title: "Ecosystem Expansion",
      items: [
        { icon: <Link className="h-5 w-5" />, text: "Token Bonding", status: STATUS.PENDING },
        { icon: <Landmark className="h-5 w-5" />, text: "Staking Platform Launch", status: STATUS.PENDING },
        { icon: <PiggyBank className="h-5 w-5" />, text: "Reward System Implementation", status: STATUS.PENDING },
        { icon: <ShieldCheck className="h-5 w-5" />, text: "Security Upgrades", status: STATUS.PENDING }
      ]
    },
    {
      phase: "Phase 6",
      title: "CEX & Partnerships",
      items: [
        { icon: <Building2 className="h-5 w-5" />, text: "CEX Listings", status: STATUS.PENDING },
        { icon: <Handshake className="h-5 w-5" />, text: "Strategic Partnerships", status: STATUS.PENDING },
        { icon: <Target className="h-5 w-5" />, text: "Market Making Integration", status: STATUS.PENDING },
        { icon: <BadgeCheck className="h-5 w-5" />, text: "Additional Audits", status: STATUS.PENDING }
      ]
    },
    {
      phase: "Phase 7",
      title: "Advanced Features",
      items: [
        { icon: <Wallet className="h-5 w-5" />, text: "Multi-Chain Bridge", status: STATUS.PENDING },
        { icon: <LayoutDashboard className="h-5 w-5" />, text: "Governance Platform", status: STATUS.PENDING },
        { icon: <Box className="h-5 w-5" />, text: "NFT Integration", status: STATUS.PENDING },
        { icon: <GanttChart className="h-5 w-5" />, text: "Ecosystem Analytics", status: STATUS.PENDING }
      ]
    },
    {
      phase: "Phase 8",
      title: "Future Development",
      items: [
        { icon: <Network className="h-5 w-5" />, text: "Cross-Chain Expansion", status: STATUS.PENDING },
        { icon: <Building className="h-5 w-5" />, text: "DAO Implementation", status: STATUS.PENDING },
        { icon: <Blocks className="h-5 w-5" />, text: "DeFi Tools Suite", status: STATUS.PENDING },
        { icon: <Goal className="h-5 w-5" />, text: "Real World Integration", status: STATUS.PENDING }
      ]
    }
  ];

  return (
    <section id="roadmap" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Project Roadmap</h2>
        <div className="space-y-2">
          {roadmapData.map((item, index) => (
            <RoadmapItem 
              key={index} 
              {...item} 
              isLastPhase={index === roadmapData.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveRoadmap;
