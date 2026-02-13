import React from 'react';
import { Wallet, ShieldCheck, ArrowRight, CheckCircle2, LogOut, Copy } from 'lucide-react';
import { useConnect, useAccount, useDisconnect, useBalance } from 'wagmi';
import { truncateAddress } from '../utils/format';

export const ConnectWallet: React.FC = () => {
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  const [copied, setCopied] = React.useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // If connected, show account info
  if (isConnected && address) {
    return (
      <div className="min-h-screen bg-background-dark text-white font-sans flex flex-col relative overflow-hidden pb-24">
        <div className="flex-grow flex flex-col items-center justify-center p-6 pb-24 relative">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-500">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                <CheckCircle2 size={64} className="relative text-green-500" />
              </div>
            </div>

            {/* Card */}
            <div className="bg-surface/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-4 shadow-2xl">
              <h2 className="text-xl font-bold text-center">Wallet Connected</h2>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider">Address</label>
                <div className="flex items-center gap-2 bg-background-dark/50 rounded-lg p-3">
                  <span className="flex-1 font-mono text-sm break-all">{truncateAddress(address)}</span>
                  <button
                    onClick={copyAddress}
                    className="p-2 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                    title="Copy address"
                  >
                    {copied ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} className="text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Balance */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider">Balance</label>
                <div className="bg-background-dark/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-primary">
                    {balance ? `${(Number(balance.value) / 1e18).toFixed(4)} ${balance.symbol}` : '0.00'}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => disconnect()}
                  className="w-full h-12 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show connect options
  return (
    <div className="min-h-screen bg-background-dark text-white font-sans flex flex-col relative overflow-hidden pb-24">
      <div className="flex-grow flex flex-col items-center justify-center p-6 relative">
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
            <div className="w-40 h-40 bg-surface/80 backdrop-blur-md rounded-3xl border border-white/10 flex items-center justify-center relative rotate-45 group-hover:rotate-0 transition-all duration-700 ease-out shadow-2xl shadow-black overflow-hidden">
              <img src={`${import.meta.env.BASE_URL}reliq-logo-dark.webp`} alt="ReliQ Logo" className="w-28 h-28 -rotate-45 group-hover:rotate-0 transition-all duration-700 object-contain" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              ReliQ
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed whitespace-nowrap mx-auto">
              The decentralized protocol for your digital legacy.
            </p>
          </div>

          {/* Wallet Options - Single unified button */}
          <div className="w-full space-y-4">
            <button
              onClick={() => {
                const connector = connectors[0];
                if (connector) {
                  connect({ connector });
                }
              }}
              disabled={!connectors || connectors.length === 0}
              className="w-full h-14 bg-white text-black font-bold text-sm uppercase tracking-widest rounded-full hover:bg-primary transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-white/5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Wallet size={18} />
              Connect Wallet
              <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono">
              <ShieldCheck size={12} />
              <span>Supported by BITE v2 protocol</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};