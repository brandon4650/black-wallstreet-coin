import React from 'react';
import { Wallet, Coins, Link, ArrowRightLeft, CheckCircle } from 'lucide-react';

const HowToBuy = () => {
  const steps = [
    {
      step: "1",
      title: "Create a Wallet",
      description: "Download and install Phantom Wallet or any Solana compatible wallet",
      icon: <Wallet className="h-8 w-8" />
    },
    {
      step: "2",
      title: "Get SOL",
      description: "Buy SOL from an exchange and send it to your wallet",
      icon: <Coins className="h-8 w-8" />
    },
    {
      step: "3",
      title: "Connect to DEX",
      description: "Visit our approved DEX and connect your wallet",
      icon: <Link className="h-8 w-8" />
    },
    {
      step: "4",
      title: "Swap for $TULSA",
      description: "Enter the amount of SOL you want to swap for $TULSA and confirm the transaction",
      icon: <ArrowRightLeft className="h-8 w-8" />
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          How to Buy <span className="shimmer-text">$TULSA</span>
        </h2>
        <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
          Join the Black Wall Street movement in 4 simple steps
        </p>
        
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="group glass rounded-2xl p-6 flex items-start gap-6 hover-lift hover-glow-gold transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Step number indicator */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-amber-500 to-transparent" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                    Step {step.step}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-white group-hover:text-amber-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-zinc-400">{step.description}</p>
              </div>
              
              {/* Checkmark indicator on hover */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => window.open('https://pump.fun/coin/8TVr3U85V3Uazkxd5DJbmzdUWaxhQdEGNNGJ7eNTpump', '_blank')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover-glow-gold"
          >
            Buy $TULSA Now
            <ArrowRightLeft className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowToBuy;