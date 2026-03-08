import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Rocket, Coins, ShieldCheck, ChevronRight, Wallet, History, Info } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const GamesHub = () => {
  const { publicKey, connected } = useWallet();
  const [ticketBalance, setTicketBalance] = useState(0); // This will sync with your script later

  const games = [
    {
      id: 'crash',
      title: 'Tulsa Crash',
      description: 'Ride the Tulsa Rocket to the moon. Eject before it crashes to multiply your tickets!',
      image: '/images/assets/bws_rocket.png',
      minBet: '100 TICK',
      status: 'Live',
      tag: 'Trending',
      route: '/games/crash'
    },
    {
      id: 'dice',
      title: 'BWS High-Low',
      description: 'Predict the next Tulsa price movement. Simple, fast, and provably fair.',
      icon: <Coins className="w-12 h-12 text-amber-500" />,
      minBet: '50 TICK',
      status: 'Coming Soon',
      tag: 'New',
      route: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Trophy className="text-black w-6 h-6" />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase italic">BWS <span className="text-amber-500">GAMES</span></span>
          </Link>

          <div className="flex items-center gap-6">
            {connected && (
              <div className="hidden md:flex items-center gap-4 bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-2xl">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Your Balance</span>
                  <span className="text-amber-500 font-bold">{ticketBalance.toLocaleString()} TICK</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <img src="/images/assets/tulsa_ticket.png" alt="Ticket" className="w-6 h-6 object-contain" />
                </div>
              </div>
            )}
            <WalletMultiButton className="premium-wallet-button" />
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-[0.2em] mb-6">
            <ShieldCheck className="w-3 h-3" />
            Provably Fair Ecosystem
          </div>
          <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tighter leading-none">
            WELCOME TO THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 animate-shimmer">ARENA.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
            The ultimate high-stakes playground for the Tulsa community. Use your $TULSA tickets to climb the leaderboard and cash out real $TULSA coin.
          </p>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {games.map((game) => (
            <Link 
              key={game.id} 
              to={game.route}
              className={`group relative h-[400px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-zinc-900/20 hover:border-amber-500/30 transition-all duration-700 ${game.status === 'Coming Soon' ? 'opacity-80 grayscale cursor-not-allowed' : 'hover:scale-[1.02]'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              
              {game.image ? (
                <img src={game.image} alt={game.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/40">
                  {game.icon}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-10 z-20 flex justify-between items-end">
                <div className="space-y-4 max-w-[70%]">
                  <div className="flex items-center gap-3">
                    <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">{game.tag}</span>
                    <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{game.status}</span>
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight group-hover:text-amber-500 transition-colors">{game.title}</h3>
                  <p className="text-zinc-400 text-sm line-clamp-2">{game.description}</p>
                </div>
                
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-500">
                  <ChevronRight className="w-6 h-6 text-white group-hover:text-black transition-colors" />
                </div>
              </div>

              {/* Min Bet Badge */}
              <div className="absolute top-8 right-8 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                <span className="text-[10px] font-black text-zinc-500 uppercase">Min Bet</span>
                <span className="text-xs font-bold text-amber-500 tracking-tighter">{game.minBet}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Weekly Payouts', value: '$12,450+', icon: <Rocket className="w-5 h-5" /> },
            { label: 'Active Players', value: '1,284', icon: <Users className="w-5 h-5" /> },
            { label: 'Treasury Backing', value: '100% USDC', icon: <ShieldCheck className="w-5 h-5" /> }
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</span>
                <span className="text-2xl font-black tracking-tight">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-4">
            <span>Provably Fair</span>
            <div className="w-1 h-1 bg-zinc-700 rounded-full" />
            <span>Regulated Treasury</span>
            <div className="w-1 h-1 bg-zinc-700 rounded-full" />
            <span>Anti-Bot Shield Engaged</span>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors uppercase tracking-widest">
              <History className="w-3 h-3" /> Game History
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors uppercase tracking-widest">
              <Info className="w-3 h-3" /> Fair Play Info
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Lucide replacement for Users
const Users = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default GamesHub;
