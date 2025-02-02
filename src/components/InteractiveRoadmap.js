import React, { useState, useEffect } from 'react';
import { Check, Rocket, Users, BarChart, Globe, Shield, Building2, ArrowDown, Loader2 } from 'lucide-react';

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
      title: "Foundation",
      items: [
        { icon: <Rocket className="h-5 w-5" />, text: "Token Launch", status: STATUS.COMPLETE },
        { icon: <Users className="h-5 w-5" />, text: "Community Building", status: STATUS.COMPLETE },
        { icon: <Globe className="h-5 w-5" />, text: "Social Media Presence", status: 2 }
      ]
    },
    {
      phase: "Phase 2",
      title: "Development",
      items: [
        { icon: <Shield className="h-5 w-5" />, text: "Security Audit", status: 1 },
        { icon: <BarChart className="h-5 w-5" />, text: "DEX Listing", status: 1 },
        { icon: <Building2 className="h-5 w-5" />, text: "Partnership Building", status: 2 }
      ]
    },
    {
        phase: "Phase 3",
        title: "Foundation",
        items: [
          { icon: <Rocket className="h-5 w-5" />, text: "test", status: STATUS.COMPLETE },
          { icon: <Users className="h-5 w-5" />, text: "test2", status: STATUS.COMPLETE },
          { icon: <Globe className="h-5 w-5" />, text: "yea", status: 2 }
        ]
      },
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