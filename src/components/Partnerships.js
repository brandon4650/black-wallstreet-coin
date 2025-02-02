import React from 'react';

const PartnerCard = ({ name, logo, link }) => (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="bg-zinc-800/50 p-6 rounded-xl flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:bg-zinc-700/50 hover:transform hover:scale-105"
    >
      {/* Remove grayscale class to keep original colors */}
      <img src={logo} alt={name} className="h-16 w-auto transition-all duration-300" />
      <span className="text-sm font-medium text-zinc-300">{name}</span>
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
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">Ecosystem Partners</h2>
        <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
          Integrated with leading platforms in the Solana ecosystem to provide the best experience for our community
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <PartnerCard key={index} {...partner} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partnerships;