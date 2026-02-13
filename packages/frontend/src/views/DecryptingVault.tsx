import React, { useState, useEffect } from 'react';
import { Lock, Unlock, LockOpen, Quote, Download, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

type DecryptStatus = 'IDLE' | 'DECRYPTING' | 'REVEALED';

export const DecryptingVault: React.FC = () => {
  const [status, setStatus] = useState<DecryptStatus>('IDLE');
  const [progress, setProgress] = useState(0);

  // Handle Decryption Animation
  useEffect(() => {
    if (status === 'DECRYPTING') {
      const duration = 4000; // 4 seconds
      const intervalTime = 40;
      const steps = duration / intervalTime;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const newProgress = Math.min(100, (currentStep / steps) * 100);
        setProgress(newProgress);

        if (currentStep >= steps) {
          clearInterval(timer);
          setTimeout(() => setStatus('REVEALED'), 500);
        }
      }, intervalTime);

      return () => clearInterval(timer);
    }
  }, [status]);

  // --- VIEW: IDLE (Pending Inheritance) ---
  if (status === 'IDLE') {
    return (
      <div className="min-h-screen bg-background-dark text-white font-sans flex flex-col items-center justify-center p-6 pb-24 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary">Signal Detected</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Vault Discovered</h1>
            <p className="text-white/60">
              A dead man's switch protocol has triggered. <br/>
              Encrypted assets are pending retrieval.
            </p>
          </div>

          <div className="glass-panel p-1 rounded-2xl relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-1000" />
            <div className="bg-surface/80 rounded-xl p-6 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lock size={120} />
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
                     <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                        <span className="font-bold text-lg">D</span>
                     </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Dad's Vault</h3>
                    <div className="text-xs text-slate-400 font-mono mt-1">ID: 0x99a...b1c2</div>
                  </div>
                </div>

                {/* Removed technical details block per request */}
              </div>
            </div>
          </div>

          <button 
            onClick={() => setStatus('DECRYPTING')}
            className="w-full bg-primary text-black font-bold text-lg py-4 rounded-xl border border-primary btn-3d hover:brightness-110 active:brightness-90 flex items-center justify-center gap-3 group transition-all"
          >
            <Unlock size={20} className="group-hover:rotate-12 transition-transform" />
            <span>Initiate Decryption</span>
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW: DECRYPTING (Progress Animation) ---
  if (status === 'DECRYPTING') {
    return (
      <div className="min-h-screen bg-background-dark text-white font-sans flex items-center justify-center overflow-hidden relative selection:bg-primary selection:text-background-dark pb-24">
        
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] opacity-40 mix-blend-screen" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px] opacity-30 mix-blend-screen" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        {/* Code Rain Texture */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex justify-between px-4 text-[10px] md:text-xs font-mono text-primary/40 leading-loose overflow-hidden">
          <div className="flex flex-col gap-2 pt-20">
            <span>0x4a7f...e9</span>
            <span>Decrypt::Init</span>
            <span>Hash: SHA-256</span>
            <span className="opacity-50">Wait...</span>
            <span>0x99b1...c2</span>
          </div>
          <div className="flex flex-col gap-4 pt-40">
            <span>Threshold: 3/5</span>
            <span>Verifying...</span>
            <span>Key_Share_1: OK</span>
            <span>Key_Share_2: OK</span>
          </div>
        </div>

        <main className="relative z-10 w-full max-w-md h-full flex flex-col items-center justify-between p-6">
          
          {/* Header */}
          <div className="w-full flex justify-between items-center pt-2 opacity-60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary/50" />
              <span className="text-xs font-mono tracking-widest uppercase text-white/50">Relic Protocol</span>
            </div>
            <Lock size={16} className="text-white/50" />
          </div>

          {/* Central Viz */}
          <div className="flex-1 flex flex-col items-center justify-center w-full relative py-12">
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Rings */}
              <div className="absolute w-72 h-72 rounded-full border border-primary/20 border-t-primary/60 border-l-transparent animate-spin-slow" />
              <div className="absolute w-56 h-56 rounded-full border border-white/5 border-b-primary/40 border-r-transparent animate-spin-reverse-slow" />
              
              {/* Progress Text in Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <span className="text-5xl font-bold text-white font-mono">{Math.floor(progress)}%</span>
                <span className="text-xs text-primary/60 uppercase tracking-widest mt-2 animate-pulse">Decrypting</span>
              </div>
              
              {/* Glow */}
              <div className="absolute w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-pulse" />
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-1.5 bg-white/10 rounded-full mt-8 overflow-hidden">
              <div 
                className="h-full bg-primary shadow-[0_0_10px_rgba(253,223,73,0.8)] transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="mt-4 flex flex-col items-center gap-2">
               <span className="text-xs font-mono text-slate-400">Reconstructing Private Key...</span>
            </div>
          </div>

          {/* Footer Info */}
          <div className="w-full pb-6 z-20">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface/50 border border-white/5 p-3 rounded-xl backdrop-blur-sm">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Asset ID</div>
                <div className="font-mono text-xs text-white truncate">99a8-x2...b1</div>
              </div>
              <div className="bg-surface/50 border border-white/5 p-3 rounded-xl backdrop-blur-sm">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Security</div>
                <div className="font-mono text-xs text-green-400">Verified</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- VIEW: REVEALED (Vault Unlocked) ---
  return (
    <div className="min-h-screen bg-background-dark text-white font-sans flex justify-center w-full relative overflow-hidden pb-24 animate-in fade-in zoom-in duration-500">
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
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 ring-1 ring-primary/30 shadow-[0_0_20px_rgba(253,223,73,0.15)] animate-[bounce_2s_infinite]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Legacy Decrypted</h1>
            <p className="text-white/50 text-sm">Protocol Verified • {new Date().toLocaleDateString()}</p>
          </div>

          {/* Personal Note Card */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 to-primary/30 rounded-xl blur opacity-30" />
            <div className="relative glass-panel rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <Quote size={14} className="text-white/40" />
                <span className="text-xs font-medium text-white/40 uppercase tracking-wide">Personal Note</span>
              </div>
              <div className="font-mono text-base leading-relaxed text-white/90 min-h-[100px]">
                <p>
                  Morgan, I love you 3000. You are my greatest creation. Keep making me proud. - Dad
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

          {/* Asset Card */}
          <div className="bg-[#353017] border border-[#6a602f] rounded-xl overflow-hidden shadow-lg relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="h-32 w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop')" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#353017] to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <span className="bg-black/40 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded border border-white/10 uppercase font-bold tracking-wider">ETH Transfer</span>
              </div>
            </div>
            <div className="p-5 relative">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="text-primary text-xs font-medium mb-1 flex items-center gap-1">
                    <CheckCircle size={14} />
                    Confirmed
                  </p>
                  <h3 className="text-white text-2xl font-bold tracking-tight">4.208 ETH</h3>
                </div>
                <div className="text-right">
                  <span className="text-white/40 text-xs line-through block decoration-white/30">LOCKED</span>
                  <span className="text-green-400 text-xs font-bold block mt-0.5">UNLOCKED</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 p-3 bg-black/20 rounded-lg border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase tracking-wide mb-0.5">Destination Wallet</span>
                  <span className="text-white/80 font-mono text-sm truncate w-32">Moose</span>
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
                Your inheritance was secured by Relic multi-party computation. No single key holder had access.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};