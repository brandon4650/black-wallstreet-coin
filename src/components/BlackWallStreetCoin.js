import React, { useState } from 'react';
import { Building2, ChevronDown, ArrowRight, BarChart, Shield, Users, Globe } from 'lucide-react';

const BlackWallStreetCoin = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false);

return (
<div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
  {/* Navigation */}
  <nav className="fixed w-full bg-zinc-900/90 backdrop-blur-sm z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-amber-500" />
          <span className="ml-2 text-xl font-bold">Black WallStreet Coin</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="flex items-center space-x-8">
            <a href="#mission" className="hover:text-amber-500 transition-colors">Mission</a>
            <a href="#features" className="hover:text-amber-500 transition-colors">Features</a>
            <a href="#tokenomics" className="hover:text-amber-500 transition-colors">Tokenomics</a>
            <a href="#vision" className="hover:text-amber-500 transition-colors">Vision</a>
            <button className="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded-full font-medium transition-colors">
              Join the Movement
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={()=> setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-zinc-800"
            >
            <ChevronDown className={`h-6 w-6 transition-transform ${isMenuOpen ? 'rotate-180' : '' }`} />
          </button>
        </div>
      </div>
    </div>

    {/* Mobile Navigation */}
    {isMenuOpen && (
    <div className="md:hidden bg-zinc-800">
      <div className="px-2 pt-2 pb-3 space-y-1">
        <a href="#mission" className="block px-3 py-2 hover:bg-zinc-700 rounded-md">Mission</a>
        <a href="#features" className="block px-3 py-2 hover:bg-zinc-700 rounded-md">Features</a>
        <a href="#tokenomics" className="block px-3 py-2 hover:bg-zinc-700 rounded-md">Tokenomics</a>
        <a href="#vision" className="block px-3 py-2 hover:bg-zinc-700 rounded-md">Vision</a>
        <button
          className="w-full text-center bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded-full font-medium transition-colors">
          Join the Movement
        </button>
      </div>
    </div>
    )}
  </nav>

  {/* Hero Section */}
  <section className="pt-32 pb-20 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-5xl md:text-6xl font-bold mb-6">
        Rebuilding Black Wall Street in the <span className="text-amber-500">Digital Age</span>
      </h1>
      <p className="text-xl text-zinc-300 mb-8">
        A groundbreaking cryptocurrency that honors the legacy of Black Wall Street while creating new paths to
        financial freedom and community prosperity.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <button
          className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 px-8 py-3 rounded-full font-medium text-lg transition-colors flex items-center justify-center">
          Buy $TULSA
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
        <button
          className="w-full sm:w-auto border border-amber-500 hover:bg-amber-500/10 px-8 py-3 rounded-full font-medium text-lg transition-colors">
          Learn Our History
        </button>
      </div>
      <div className="max-w-lg mx-auto bg-zinc-800/50 rounded-xl p-6">
        <div className="flex flex-col gap-2">
          <p className="text-amber-500 font-medium">Contract Address (CA):</p>
          <div className="relative">
            <div className="bg-zinc-900/50 p-4 rounded-lg flex justify-between items-center">
              <span className="text-zinc-300 font-mono">WILL BE POSTED SOON</span>
              <button onClick={()=> {
                navigator.clipboard.writeText("WILL BE POSTED SOON");
                const button = document.getElementById('copyButton');
                button.textContent = 'Copied!';
                setTimeout(() => {
                button.textContent = 'Copy';
                }, 2000);
                }}
                id="copyButton"
                className="ml-4 px-3 py-1 bg-amber-600 hover:bg-amber-700 rounded-md text-sm font-medium
                transition-colors"
                >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* Mission Section */}
  <section id="mission" className="py-20 px-4 bg-zinc-800/50">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-zinc-300 mb-6">
            The Black WallStreet Coin ($TULSA) is more than a cryptocurrency—it's a movement to rebuild and empower
            Black communities globally through blockchain technology.
          </p>
          <p className="text-lg text-zinc-300">
            We're creating a decentralized financial ecosystem that mirrors the strength and unity of the original Black
            Wall Street, fostering financial independence and generational wealth.
          </p>
        </div>
        <div className="bg-zinc-700/30 p-8 rounded-xl">
          <h3 className="text-2xl font-semibold mb-6 text-amber-500">Building for the Future</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center mt-1 mr-3">
                <span className="text-amber-500">1</span>
              </div>
              <p>First crypto bank focused on Black community empowerment</p>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center mt-1 mr-3">
                <span className="text-amber-500">2</span>
              </div>
              <p>Blockchain innovation driving financial inclusion</p>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center mt-1 mr-3">
                <span className="text-amber-500">3</span>
              </div>
              <p>Community-driven governance and development</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  {/* Features Section */}
  <section id="features" className="py-20 px-4">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">Building Economic Power</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
        { icon:
        <BarChart className="h-8 w-8" />, title: "Financial Innovation", description: "Advanced DeFi protocols designed
        for community wealth building" },
        { icon:
        <Shield className="h-8 w-8" />, title: "Secure Infrastructure", description: "Enterprise-grade security
        protecting community assets" },
        { icon:
        <Users className="h-8 w-8" />, title: "Community First", description: "Governance system ensuring community
        voice and participation" },
        { icon:
        <Globe className="h-8 w-8" />, title: "Global Impact", description: "Connecting and empowering Black communities
        worldwide" }
        ].map((feature, index) => (
        <div key={index} className="bg-zinc-800 p-6 rounded-xl hover:bg-zinc-700 transition-colors">
          <div className="text-amber-500 mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-zinc-300">{feature.description}</p>
        </div>
        ))}
      </div>
    </div>
  </section>

  {/* Tokenomics Section */}
  <section id="tokenomics" className="py-20 px-4 bg-zinc-800/50">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">$TULSA Tokenomics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
        { title: "Community Allocation", value: "40%", description: "Reserved for community development and initiatives"
        },
        { title: "Development Fund", value: "30%", description: "Dedicated to platform development and expansion" },
        { title: "Public Sale", value: "30%", description: "Available for public participation and liquidity" }
        ].map((stat, index) => (
        <div key={index} className="bg-zinc-800 p-8 rounded-xl text-center">
          <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
          <p className="text-3xl font-bold text-amber-500 mb-2">{stat.value}</p>
          <p className="text-zinc-300">{stat.description}</p>
        </div>
        ))}
      </div>
    </div>
  </section>

  {/* Vision Section */}
  <section id="vision" className="py-20 px-4">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">Our Vision for the Future</h2>
      <div className="space-y-8">
        {[
        { phase: "Phase 1", title: "Foundation Building", items: ["Platform Launch", "Community Building", "Educational
        Initiatives"] },
        { phase: "Phase 2", title: "Financial Infrastructure", items: ["DeFi Services Launch", "Community Banking",
        "Business Funding"] },
        { phase: "Phase 3", title: "Global Expansion", items: ["International Partnerships", "Economic Zones", "Wealth
        Building Programs"] }
        ].map((phase, index) => (
        <div key={index} className="bg-zinc-800 p-6 rounded-xl">
          <div className="flex items-center mb-4">
            <div className="bg-amber-500 text-sm font-medium px-3 py-1 rounded-full">{phase.phase}</div>
            <h3 className="text-xl font-semibold ml-4">{phase.title}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {phase.items.map((item, itemIndex) => (
            <div key={itemIndex} className="bg-zinc-700/50 p-4 rounded-lg">{item}</div>
            ))}
          </div>
        </div>
        ))}
      </div>
    </div>
  </section>

  {/* Footer */}
  <footer className="bg-zinc-900 py-12 px-4">
    <div className="max-w-7xl mx-auto text-center">
      <div className="flex items-center justify-center mb-8">
        <Building2 className="h-8 w-8 text-amber-500" />
        <span className="ml-2 text-xl font-bold">Black WallStreet Coin</span>
      </div>
      <div className="flex justify-center space-x-6 mb-8">
        <a href="#" className="hover:text-amber-500 transition-colors">Twitter</a>
        <a href="#" className="hover:text-amber-500 transition-colors">Telegram</a>
        <a href="#" className="hover:text-amber-500 transition-colors">Discord</a>
        <a href="#" className="hover:text-amber-500 transition-colors">Medium</a>
      </div>
      <p className="text-zinc-400">© 2025 Black WallStreet Coin ($TULSA). All rights reserved.</p>
    </div>
  </footer>
</div>
);
};

export default BlackWallStreetCoin;
