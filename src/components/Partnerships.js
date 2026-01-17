import React from 'react';
import { ExternalLink } from 'lucide-react';

const PartnerCard = ({ name, logo, link }) => (
  <a 
    href={link} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="group glass rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover-lift hover-glow-gold"
  >
    <div className="relative">
      <img 
        src={logo} 
        alt={name} 
        className="h-16 w-auto transition-all duration-300 group-hover:scale-110" 
      />
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <div className="flex items-center gap-2">
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
      link: "https://solana.com"
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
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Ecosystem <span className="shimmer-text">Partners</span>
        </h2>
        <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
          Integrated with leading platforms in the Solana ecosystem to provide the best experience for our community
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <PartnerCard key={index} {...partner} />
          ))}
        </div>
        
        {/* Decorative element */}
        <div className="mt-12 flex justify-center">
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Partnerships;