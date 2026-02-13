import React, { useState } from 'react';
import { Wallet, ShieldCheck, ArrowRight } from 'lucide-react';

interface ConnectWalletProps {
  onConnect: () => void;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate network delay
    setTimeout(() => {
      onConnect();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-12 animate-in fade-in zoom-in duration-700">

        {/* Logo / Icon */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-24 h-24 bg-surface/80 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center relative rotate-45 group-hover:rotate-0 transition-all duration-500 ease-out shadow-2xl shadow-black overflow-hidden">
            <img src="/reliq-logo-dark.webp" alt="Relic Logo" className="w-16 h-16 -rotate-45 group-hover:rotate-0 transition-all duration-500 object-contain" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
            Relic
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-[280px] mx-auto">
            Decentralized dead man's switch protocol. <br />
            Secure your digital legacy.
          </p>
        </div>

        {/* Action */}
        <div className="w-full space-y-4">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full h-14 bg-white text-black font-bold text-sm uppercase tracking-widest rounded-full hover:bg-primary transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-white/5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isConnecting ? (
              <>
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet size={18} />
                Connect Wallet
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono">
            <ShieldCheck size={12} />
            <span>End-to-End Encrypted • Non-Custodial</span>
          </div>
        </div>
      </div>
    </div>
  );
};