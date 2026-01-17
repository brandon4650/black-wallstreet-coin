import React from 'react';
import { ExternalLink, Star } from 'lucide-react';

const PartnerCard = ({ name, logo, link, featured }) => (
  <a 
    href={link} 
    target="_blank" 
    rel="noopener noreferrer" 
    className={`group glass rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover-lift border border-transparent hover:border-amber-500/20 relative overflow-hidden ${
      featured ? 'lg:col-span-1 bg-gradient-to-br from-amber-500/10 to-transparent' : ''
    }`}
  >
    {/* Featured badge */}
    {featured && (
      <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs flex items-center gap-1">
        <Star className="h-3 w-3" /> Featured
      </div>
    )}
    
    {/* Logo container */}
    <div className="relative p-4">
      <img 
        src={logo} 
        alt={name} 
        className="h-12 w-auto transition-all duration-300 group-hover:scale-110 filter brightness-90 group-hover:brightness-100" 
      />
      {/* Glow effect */}
      <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    
    {/* Name and link */}
    <div className="flex items-center gap-2 text-center">
      <span className="text-sm font-medium text-zinc-300 group-hover:text-amber-400 transition-colors">
        {name}
      </span>
      <ExternalLink className="h-3 w-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </a>
);

const Partnerships = () => {
  const partners = [
    {
      name: "Solana",
      logo: "/images/partners/solana.png",
      link: "https://solana.com",
      featured: true
    },
    {
      name: "DexScreener",
      logo: "/images/partners/dexscreener.png",
      link: "https://dexscreener.com"
    },
    {
      name: "PumpFun",
      logo: "/images/partners/pumpfun.png",
      link: "https://pump.fun/board"
    },
    {
      name: "Raydium",
      logo: "/images/partners/raydium.png",
      link: "https://raydium.io/swap/"
    },
    {
      name: "Jupiter",
      logo: "/images/partners/jupiter.png",
      link: "https://jup.ag"
    }
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-gold text-amber-400 text-sm font-medium mb-4">
            Powered By
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ecosystem <span className="shimmer-text">Partners</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Integrated with leading platforms in the Solana ecosystem for the best trading experience
          </p>
        </div>
        
        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <PartnerCard key={index} {...partner} />
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center">
          {[
            { value: '100%', label: 'Decentralized' },
            { value: '24/7', label: 'Trading' },
            { value: 'Instant', label: 'Swaps' },
            { value: 'Low', label: 'Fees' }
          ].map((item, i) => (
            <div key={i} className="px-6">
              <p className="text-2xl font-bold gradient-text-gold mb-1">{item.value}</p>
              <p className="text-sm text-zinc-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partnerships;