import React from 'react';
import { Wallet, Coins, Link, ArrowRightLeft } from 'lucide-react';

const HowToBuy = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">How to Buy $TULSA</h2>
        <div className="space-y-8">
          {[
            {
              step: "1",
              title: "Create a Wallet",
              description: "Download and install Phantom Wallet or any Solana compatible wallet",
              icon: <Wallet className="h-8 w-8 text-amber-500" />
            },
            {
              step: "2",
              title: "Get SOL",
              description: "Buy SOL from an exchange and send it to your wallet",
              icon: <Coins className="h-8 w-8 text-amber-500" />
            },
            {
              step: "3",
              title: "Connect to DEX",
              description: "Visit our approved DEX and connect your wallet",
              icon: <Link className="h-8 w-8 text-amber-500" />
            },
            {
              step: "4",
              title: "Swap for $TULSA",
              description: "Enter the amount of SOL you want to swap for $TULSA and confirm the transaction",
              icon: <ArrowRightLeft className="h-8 w-8 text-amber-500" />
            }
          ].map((step, index) => (
            <div key={index} className="bg-zinc-800/50 p-6 rounded-xl flex items-start space-x-6">
              <div className="bg-amber-500/20 p-3 rounded-lg">
                {step.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Step {step.step}: {step.title}</h3>
                <p className="text-zinc-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToBuy;