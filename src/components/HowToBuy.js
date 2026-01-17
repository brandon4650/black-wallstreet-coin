import React from 'react';
import { Wallet, Coins, Link as LinkIcon, ArrowRightLeft, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const HowToBuy = () => {
  const steps = [
    {
      step: "1",
      title: "Create a Wallet",
      description: "Download Phantom Wallet or any Solana compatible wallet from the app store",
      icon: <Wallet className="h-8 w-8" />,
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      step: "2",
      title: "Get SOL",
      description: "Purchase SOL from any major exchange (Coinbase, Binance) and send to your wallet",
      icon: <Coins className="h-8 w-8" />,
      gradient: "from-amber-500 to-orange-600"
    },
    {
      step: "3",
      title: "Connect to DEX",
      description: "Visit pump.fun or Raydium and connect your Phantom wallet",
      icon: <LinkIcon className="h-8 w-8" />,
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      step: "4",
      title: "Swap for $TULSA",
      description: "Enter the SOL amount, paste our CA, and confirm your $TULSA purchase!",
      icon: <ArrowRightLeft className="h-8 w-8" />,
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <section id="howtobuy" className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-black to-zinc-900/50">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold text-amber-400 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Get Started in Minutes
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            How to Buy <span className="shimmer-text">$TULSA</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Join the Black Wall Street movement with these simple steps
          </p>
        </div>
        
        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="group relative"
            >
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-zinc-700 to-transparent z-0 -translate-x-4" />
              )}
              
              <div className="glass rounded-2xl p-6 hover-lift hover-glow-gold transition-all duration-300 border border-transparent hover:border-amber-500/20 relative z-10 h-full">
                {/* Step number badge */}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-sm font-black shadow-lg">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-amber-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {step.description}
                </p>
                
                {/* Check indicator on hover */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src="/images/coin-logo.png" alt="$TULSA" className="w-12 h-12 rounded-full animate-float" />
              <span className="text-4xl font-black gradient-text-gold">$TULSA</span>
            </div>
            <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
              Ready to join the movement? Get your $TULSA tokens now and be part of financial history.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => window.open('https://pump.fun/coin/8TVr3U85V3Uazkxd5DJbmzdUWaxhQdEGNNGJ7eNTpump', '_blank')}
                className="group bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  Buy on Pump.fun
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                onClick={() => window.open('https://raydium.io/swap/', '_blank')}
                className="glass px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all border border-amber-500/30 hover:border-amber-500"
              >
                Buy on Raydium
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToBuy;