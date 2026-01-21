
import React, { useState, useEffect, useRef } from 'react';
import { Building2, ChevronDown, ArrowRight, BarChart, Shield, Users, Globe, Check, Sparkles, ExternalLink, Copy, Star, Zap, TrendingUp, Rocket, Twitter } from 'lucide-react';
import axios from 'axios';
import ParticleBackground from './ParticleBackground';
import HowToBuy from './HowToBuy';
import PriceBanner from './PriceBanner';
import EpicRoadmap from './EpicRoadmap';
import Partnerships from './Partnerships';
import BackgroundMusic from './BackgroundMusic';
import MilestoneAnnouncement from './MilestoneAnnouncement';

const BlackWallStreetCoin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  
  const [tokenData, setTokenData] = useState({
    price: 0,
    priceChange24h: 0,
    priceChange1h: 0,
    priceChange5m: 0,
    volume24h: 0,
    marketCap: 0,
    liquidity: 0,
    buys24h: 0,
    sells24h: 0
  });

  // Token data fetching logic
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await axios.get(
          'https://api.dexscreener.com/latest/dex/tokens/8TVr3U85V3Uazkxd5DJbmzdUWaxhQdEGNNGJ7eNTpump'
        );

        const pairs = response.data.pairs || [];
        if (pairs.length > 0) {
          const mainPair = pairs[0];
          setTokenData({
            price: mainPair.priceUsd,
            priceChange24h: mainPair.priceChange?.h24 || 0,
            priceChange1h: mainPair.priceChange?.h1 || 0,
            priceChange5m: mainPair.priceChange?.m5 || 0,
            volume24h: mainPair.volume?.h24 || 0,
            marketCap: mainPair.fdv || mainPair.marketCap || 0,
            liquidity: mainPair.liquidity?.usd || 0,
            buys24h: mainPair.txns?.h24?.buys || 0,
            sells24h: mainPair.txns?.h24?.sells || 0
          });
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("8TVr3U85V3Uazkxd5DJbmzdUWaxhQdEGNNGJ7eNTpump");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden w-full max-w-full">
      <ParticleBackground />
      <PriceBanner tokenData={tokenData} />
      <BackgroundMusic />
      <MilestoneAnnouncement marketCap={tokenData.marketCap} />
      
      {/* Premium Navigation */}
      <nav className="fixed w-full z-50 transition-all duration-300" style={{
        background: scrollY > 50 ? 'rgba(0,0,0,0.9)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid rgba(245,158,11,0.1)' : 'none'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <img 
                  src="/images/coin-logo.png" 
                  alt="$TULSA Coin" 
                  className="h-12 w-12 rounded-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-amber-500/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="text-xl font-bold gradient-text-gold">Black WallStreet</span>
                <span className="text-xs text-amber-500 block">$TULSA</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {['Mission', 'Features', 'Tokenomics', 'Roadmap'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="relative text-zinc-300 hover:text-white transition-colors group py-2"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-300 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              <a 
                href="/chart" 
                className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
              >
                Live Chart <TrendingUp className="h-4 w-4" />
              </a>
              <button
                onClick={() => window.open('https://t.co/J9bOqE3Z8w', '_blank')}
                className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Join Movement
                  <Rocket className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg glass"
              >
                <ChevronDown className={`h-6 w-6 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden glass-dark border-t border-amber-500/10">
            <div className="px-4 py-4 space-y-2">
              {['Mission', 'Features', 'Tokenomics', 'Roadmap'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="block px-4 py-3 text-zinc-300 hover:text-white hover:bg-amber-500/10 rounded-lg transition-colors"
                >
                  {item}
                </a>
              ))}
              <a href="/chart" className="block px-4 py-3 text-amber-400 hover:bg-amber-500/10 rounded-lg">
                Live Chart
              </a>
              <button
                onClick={() => window.open('https://t.co/J9bOqE3Z8w', '_blank')}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-3 rounded-full font-semibold mt-2"
              >
                Join the Movement
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* EPIC HERO SECTION */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: 'url(/images/hero-bg.png)',
              transform: `translateY(${scrollY * 0.3}px)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50" />
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-500/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-center">
          {/* Left Side - Text */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass-gold mb-4 sm:mb-6">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-xs sm:text-sm text-amber-400">Honoring History • Building the Future</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight">
              <span className="block text-white">Rebuilding</span>
              <span className="block shimmer-text">Black Wall Street</span>
              <span className="block text-zinc-400 text-lg sm:text-2xl md:text-3xl lg:text-4xl font-normal mt-2">
                in the Digital Age
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-zinc-400 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 px-2 sm:px-0">
              A groundbreaking cryptocurrency honoring the legacy of Tulsa's historic Greenwood District, 
              creating new paths to financial freedom and community prosperity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8 w-full">
              <button
                onClick={() => window.open('https://pump.fun/coin/8TVr3U85V3Uazkxd5DJbmzdUWaxhQdEGNNGJ7eNTpump', '_blank')}
                className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.6)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Buy $TULSA <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                onClick={() => window.open('https://www.okhistory.org/publications/enc/entry?entry=TU013', '_blank')}
                className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-lg border-2 border-amber-500/50 hover:border-amber-500 hover:bg-amber-500/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Our History <ExternalLink className="h-4 w-4" />
              </button>
            </div>

            {/* Contract Address */}
            <div className="w-full flex justify-center lg:justify-start">
              <div className="glass rounded-2xl p-4 max-w-lg w-full sm:w-auto">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-amber-500 font-medium mb-1">Contract Address (CA)</p>
                  <p className="text-sm font-mono text-zinc-300 truncate">
                    8TVr3U85V3Uazkxd5DJbmzdUWaxhQdEGNNGJ7eNTpump
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    copied 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                  }`}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            </div>
          </div>

          {/* Right Side - 3D Coin (Visible on all screens) */}
          <div className="flex items-center justify-center relative order-first lg:order-last mb-6 lg:mb-0">
            <div className="relative">
              {/* Glow effect behind coin */}
              <div className="absolute inset-0 bg-amber-500/20 blur-[60px] sm:blur-[100px] rounded-full scale-125 sm:scale-150" />
              
              {/* Main coin image - smaller on mobile */}
              <img 
                src="/images/coin-3d.png" 
                alt="$TULSA 3D Coin" 
                className="relative z-10 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[450px] lg:h-[450px] object-contain animate-float"
                style={{ animationDuration: '4s' }}
              />
              
              {/* Orbiting elements - hidden on small mobile */}
              <div className="hidden sm:block absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-amber-500/50" />
        </div>
      </section>

      {/* DEX PAID Badge - Below scroll indicator */}
      <div className="relative z-10 flex justify-center py-4 sm:py-0 sm:-mt-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
          <Check className="h-5 w-5 text-green-500" />
          <span className="text-green-400 font-semibold">DEX PAID</span>
          <Sparkles className="h-4 w-4 text-green-500 animate-pulse" />
        </div>
      </div>

      {/* Stats Bar */}
      <section className="relative z-10 mt-4 sm:mt-4 mb-12 sm:mb-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 border border-amber-500/10">
            {[
              { label: 'Community', value: '10K+', icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" /> },
              { label: 'Holders', value: '5K+', icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5" /> },
              { label: 'Market Cap', value: '$500K', icon: <BarChart className="h-4 w-4 sm:h-5 sm:w-5" /> },
              { label: 'Phase', value: '2/8', icon: <Rocket className="h-4 w-4 sm:h-5 sm:w-5" /> }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500/10 text-amber-500 mb-1 sm:mb-2">
                  {stat.icon}
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 bg-gradient-to-b from-black to-zinc-900/50">
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">The Legacy Lives On</h3>
          <p className="text-zinc-500">Honoring the spirit of Greenwood</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 h-60 mx-4 rounded-2xl overflow-hidden group relative"
              >
                <img
                  src={`/images/image${index + 1}.png`}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
            {[...Array(10)].map((_, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex-shrink-0 w-80 h-60 mx-4 rounded-2xl overflow-hidden group relative"
              >
                <img
                  src={`/images/image${index + 1}.png`}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowToBuy />
      <Partnerships />

      {/* Mission Section */}
      <section id="mission" className="py-24 px-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 rounded-full glass-gold text-amber-400 text-sm font-medium mb-6">
                Our Mission
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Empowering <span className="shimmer-text">Black Communities</span> Through Blockchain
              </h2>
              <p className="text-lg text-zinc-400 mb-6">
                The Black WallStreet Coin ($TULSA) is more than a cryptocurrency—it's a movement to rebuild 
                and empower Black communities globally through blockchain technology.
              </p>
              <p className="text-lg text-zinc-400 mb-8">
                We're creating a decentralized financial ecosystem that mirrors the strength and unity of 
                the original Black Wall Street, fostering financial independence and generational wealth.
              </p>
              
              {/* Mission points */}
              <div className="space-y-4">
                {[
                  { num: '01', text: 'First crypto bank focused on Black community empowerment' },
                  { num: '02', text: 'Blockchain innovation driving financial inclusion' },
                  { num: '03', text: 'Community-driven governance and development' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform">
                      {item.num}
                    </span>
                    <p className="text-zinc-300 pt-2">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right side - coin display */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/10 blur-[80px] rounded-full" />
                <img 
                  src="/images/coin-logo.png" 
                  alt="$TULSA" 
                  className="relative z-10 w-80 h-80 object-contain animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 px-4 bg-gradient-to-b from-zinc-900/50 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-3 sm:px-4 py-2 rounded-full glass-gold text-amber-400 text-xs sm:text-sm font-medium mb-4">
              Why $TULSA
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
              Building <span className="gradient-text-gold">Economic Power</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Innovative solutions designed for community wealth building and financial freedom
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { 
                icon: <BarChart className="h-6 w-6 sm:h-8 sm:w-8" />, 
                title: "Financial Innovation", 
                description: "Advanced DeFi protocols designed for community wealth building",
                color: "from-amber-500 to-orange-600"
              },
              { 
                icon: <Shield className="h-6 w-6 sm:h-8 sm:w-8" />, 
                title: "Secure Infrastructure", 
                description: "Enterprise-grade security protecting community assets",
                color: "from-green-500 to-emerald-600"
              },
              { 
                icon: <Users className="h-6 w-6 sm:h-8 sm:w-8" />, 
                title: "Community First", 
                description: "Governance system ensuring community voice and participation",
                color: "from-blue-500 to-cyan-600"
              },
              { 
                icon: <Globe className="h-6 w-6 sm:h-8 sm:w-8" />, 
                title: "Global Impact", 
                description: "Connecting and empowering Black communities worldwide",
                color: "from-purple-500 to-pink-600"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group glass rounded-xl sm:rounded-2xl p-4 sm:p-6 hover-lift hover-glow-gold transition-all duration-300 border border-transparent hover:border-amber-500/20"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">{feature.title}</h3>
                <p className="text-zinc-400 text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="py-16 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-3 sm:px-4 py-2 rounded-full glass-gold text-amber-400 text-xs sm:text-sm font-medium mb-4">
              Token Distribution
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="shimmer-text">$TULSA</span> Tokenomics
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Built for long-term sustainability and community growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              { title: "Community Allocation", value: "40%", description: "Reserved for community development and initiatives", color: "from-green-500 to-emerald-600", icon: <Users /> },
              { title: "Development Fund", value: "30%", description: "Dedicated to platform development and expansion", color: "from-amber-500 to-orange-600", icon: <Zap /> },
              { title: "Public Sale", value: "30%", description: "Available for public participation and liquidity", color: "from-blue-500 to-indigo-600", icon: <Globe /> }
            ].map((stat, index) => (
              <div key={index} className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center hover-lift hover-glow-gold group border border-transparent hover:border-amber-500/20">
                <div className={`w-14 h-14 sm:w-20 sm:h-20 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <h3 className="text-sm sm:text-lg font-semibold mb-2 text-zinc-300">{stat.title}</h3>
                <p className={`text-4xl sm:text-5xl md:text-6xl font-black mb-2 sm:mb-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
                <p className="text-zinc-400 text-sm sm:text-base">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EpicRoadmap />

      {/* Footer */}
      <footer className="bg-black border-t border-zinc-800 py-10 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* CTA Section */}
          <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-10 sm:mb-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10" />
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Join the <span className="shimmer-text">Movement</span>
              </h3>
              <p className="text-zinc-400 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
                Be part of history as we rebuild Black Wall Street in the digital age
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => window.open('https://pump.fun/coin/8TVr3U85V3Uazkxd5DJbmzdUWaxhQdEGNNGJ7eNTpump', '_blank')}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all"
                >
                  Buy $TULSA
                </button>
                <button
                  onClick={() => window.open('https://t.co/J9bOqE3Z8w', '_blank')}
                  className="w-full sm:w-auto glass px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Join Telegram <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer content */}
          <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:justify-between">
            <div className="flex items-center gap-3">
              <img src="/images/coin-logo.png" alt="$TULSA" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full" />
              <div>
                <span className="text-lg sm:text-xl font-bold gradient-text-gold">Black WallStreet Coin</span>
                <p className="text-xs sm:text-sm text-zinc-500">$TULSA</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
              <a 
                href="https://x.com/tulsabws?s=21&t=O1kPMRtIBO1KZa0XZZiSsg" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center hover:bg-amber-500/20 transition-colors"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              </a>
              <a 
                href="https://t.co/J9bOqE3Z8w" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center hover:bg-amber-500/20 transition-colors"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </a>
            </div>
            
            <p className="text-zinc-500 text-xs sm:text-sm text-center">
              © 2025 Black WallStreet Coin ($TULSA). All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlackWallStreetCoin;
