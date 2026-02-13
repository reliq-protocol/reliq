import React from 'react';
import { LockOpen, Download, Quote, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export const VaultUnlocked: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-dark text-white font-sans flex justify-center w-full relative overflow-hidden pb-24">
      {/* Ethereal Background */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none z-0" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none z-0" />

      <div className="w-full max-w-md h-full relative flex flex-col z-10">

        {/* Header */}
        <div className="px-6 pt-12 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary/80">
            <LockOpen size={16} />
            <span className="text-xs font-medium tracking-widest uppercase">Vault Unlocked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-white/60 font-medium">Live</span>
          </div>
        </div>

        <main className="flex-1 flex flex-col px-6 pb-8 gap-8 overflow-y-auto no-scrollbar">
          {/* Main Title Area */}
          <div className="flex flex-col items-center justify-center pt-4 pb-2 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 ring-1 ring-primary/30 shadow-[0_0_20px_rgba(253,223,73,0.15)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Legacy Decrypted</h1>
            <p className="text-white/50 text-sm">Protocol Verified • October 24, 2024</p>
          </div>

          {/* Personal Note Card */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 to-primary/30 rounded-xl blur opacity-30" />
            <div className="relative glass-panel rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <Quote size={14} className="text-white/40" />
                <span className="text-xs font-medium text-white/40 uppercase tracking-wide">Personal Note</span>
              </div>
              <div className="font-mono text-base leading-relaxed text-white/90 min-h-[140px]">
                <span className="block text-lg font-bold mb-3 text-white">To my Morgan,</span>
                <p>
                  This is the time travel GPS. If you find this recording, don't feel bad about this. Part of the journey is the end. Everything is going to work out exactly the way it's supposed to.
                  <br /><br />
                  I love you 3000.
                  <span className="inline-block w-1.5 h-4 bg-primary ml-1 animate-pulse align-middle" />
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="text-xs text-primary hover:text-white transition-colors flex items-center gap-1 font-medium">
                  <Download size={14} />
                  Save Message
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="text-white/30 text-[10px] uppercase tracking-widest">Assets Released</div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Bitcoin Asset Card */}
          <div className="bg-[#353017] border border-[#6a602f] rounded-xl overflow-hidden shadow-lg relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="h-32 w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop')" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#353017] to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <span className="bg-black/40 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded border border-white/10 uppercase font-bold tracking-wider">BTC Transfer</span>
              </div>
            </div>
            <div className="p-5 relative">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="text-primary text-xs font-medium mb-1 flex items-center gap-1">
                    <CheckCircle size={14} />
                    Confirmed
                  </p>
                  <h3 className="text-white text-2xl font-bold tracking-tight">3000.00 BTC</h3>
                </div>
                <div className="text-right">
                  <span className="text-white/40 text-xs line-through block decoration-white/30">LOCKED</span>
                  <span className="text-green-400 text-xs font-bold block mt-0.5">UNLOCKED</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 p-3 bg-black/20 rounded-lg border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase tracking-wide mb-0.5">Destination Wallet</span>
                  <span className="text-white/80 font-mono text-sm truncate w-32">0x1a...S7ark</span>
                </div>
                <button className="bg-primary hover:bg-yellow-400 text-background-dark text-xs font-bold py-2 px-3 rounded flex items-center gap-1 transition-colors">
                  View
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Security Verification */}
          <div className="flex items-start gap-3 p-4 rounded-lg border border-white/5 bg-white/5 backdrop-blur-sm">
            <ShieldCheck className="text-purple-400 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-white text-sm font-semibold leading-tight">Threshold Decryption Verified</h4>
              <p className="text-white/50 text-xs mt-1 leading-normal">
                Your inheritance was secured by StealthVault multi-party computation. No single key holder had access.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
