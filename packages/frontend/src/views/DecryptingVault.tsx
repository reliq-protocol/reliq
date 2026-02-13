import React, { useState, useEffect } from 'react';
import { Lock, Unlock, LockOpen, Quote, Download, CheckCircle, ExternalLink, ShieldCheck, Upload, FileText, CreditCard, Brain, Loader2, X, ShieldOff, Ghost } from 'lucide-react';
import { WalletModal } from '../components/WalletModal';
import { UserAvatar } from '../components/UserAvatar';
import { BrowserProvider } from 'ethers';
import { useWalletClient, useAccount, useSwitchChain } from 'wagmi';
import { skaleChaosSepolia } from '../wagmi';
import { truncateAddress } from '../utils/format';

interface DecryptingVaultProps {
  onDisconnect?: () => void;
}

type DecryptStatus = 'IDLE' | 'VERIFYING' | 'DECRYPTING' | 'REVEALED';

const MORGAN_STARK_ADDRESS = '0x89d042ef4153d9Ce1EB9E1dfD99607801225C595';

export const DecryptingVault: React.FC<DecryptingVaultProps> = ({ onDisconnect }) => {
  const [status, setStatus] = useState<DecryptStatus>('IDLE');
  const [progress, setProgress] = useState(0);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [verificationStep, setVerificationStep] = useState<'idle' | 'payment' | 'analyzing' | 'approved'>('idle');
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Get connected wallet from wagmi
  const { data: walletClient } = useWalletClient();
  const { address, isConnected, chain, connector } = useAccount();
  const { switchChain } = useSwitchChain();

  const handleUseDefaultProof = async () => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}mit_diploma.webp`);
      const blob = await response.blob();
      const file = new File([blob], "mit_diploma.webp", { type: "image/webp" });
      setProofFile(file);
    } catch (e) {
      console.error("Failed to load default proof", e);
    }
  };

  const handleClaim = async () => {
    if (!proofFile) return;

    // Check if wallet is connected
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    // Ensure we are on the right chain
    if (chain?.id !== skaleChaosSepolia.id) {
      if (window.confirm(`Please switch to ${skaleChaosSepolia.name} to proceed with verification.`)) {
        switchChain({ chainId: skaleChaosSepolia.id });
      }
      return;
    }

    let activeWalletClient = walletClient;

    // Fallback if useWalletClient results are not yet available but user is connected
    if (!activeWalletClient && connector) {
      try {
        await connector.getProvider();
        console.log("Fallback provider available from connector");
      } catch (e) {
        console.error("Failed to get provider from connector", e);
      }
    }

    if (!activeWalletClient && !connector) {
      alert('Wallet connection is not ready. Please try reconnecting your wallet.');
      return;
    }

    setStatus('VERIFYING');
    setVerificationStep('payment');

    try {
      // 1. Create ethers signer
      // If we don't have walletClient, we try window.ethereum or connector provider
      const rawProvider = activeWalletClient || (await connector?.getProvider());

      if (!rawProvider) {
        throw new Error("No wallet provider found. Please make sure your wallet is unlocked.");
      }

      const provider = new BrowserProvider(rawProvider as any);
      await provider.getSigner();

      // 2. Setup x402 payment wrapper with connected wallet
      // const paymentFetch = wrapFetchWithPayment(fetch, signer as any);

      setVerificationStep('analyzing');

      // --- MOCK VERIFICATION FOR DEMO ---
      // We skip the actual fetch to Agent API to avoid "Failed to fetch" if backend is down
      console.log("Mocking Verification step for demo reliability...");
      await new Promise(r => setTimeout(r, 2000)); // Simulate analysis time

      setVerificationStep('approved');

      // 3. Trigger Decryption
      setTimeout(() => {
        setStatus('DECRYPTING');
      }, 1500);

      /* 
      // Original logic for real backend integration:
      const agentUrl = import.meta.env.VITE_AGENT_URL || 'http://localhost:3002';
      const response = await paymentFetch(`${agentUrl}/api/verify-paid`, { ... });
      ...
      */

    } catch (error: any) {
      console.error("Verification error:", error);
      alert("Verification failed: " + (error.message || "Unknown error"));
      setStatus('IDLE');
    }
  };

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

  // Check if current user is Morgan Stark
  const isMorganStark = address?.toLowerCase() === MORGAN_STARK_ADDRESS.toLowerCase();

  // --- VIEW: EMPTY STATE (Not Morgan Stark) ---
  if (isConnected && !isMorganStark && status === 'IDLE') {
    return (
      <div className="min-h-screen bg-background-dark text-white font-sans flex flex-col items-center justify-center p-6 pb-24 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-20" />

        <WalletModal
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          onDisconnect={onDisconnect}
        />

        <div className="w-full max-w-md mx-auto space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="w-6" /> {/* Placeholder for alignment */}
            <UserAvatar onClick={() => setShowWalletModal(true)} size="lg" />
          </div>

          <div className="text-center space-y-8 mt-12">
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse-slow" />
              <div className="relative z-10 w-20 h-20 bg-surface/40 backdrop-blur-xl border border-white/5 rounded-full flex items-center justify-center shadow-2xl">
                <ShieldOff size={40} className="text-slate-500" strokeWidth={1.5} />
              </div>
              <Ghost size={24} className="absolute -top-1 -right-1 text-slate-600 animate-bounce transition-all duration-1000" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-white leading-tight">
                No Heritage Found
              </h1>
              <p className="text-lg text-slate-400 font-medium leading-relaxed">
                Your wallet <span className="text-white font-mono">{truncateAddress(address)}</span> is not registered as a beneficiary for any active vaults.
              </p>
            </div>

            <div className="pt-4">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-500 text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-slate-700" />
                Wait for Secure Release Signal
              </div>
            </div>

            <p className="text-xs text-slate-600 font-mono italic max-w-xs mx-auto">
              ReliQ Protocol only reveals inheritances when liveness conditions are triggered.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: IDLE (Pending Inheritance - Only for Morgan Stark) ---
  if (status === 'IDLE') {
    return (
      <div className="min-h-screen bg-background-dark text-white font-sans flex flex-col items-center justify-center p-6 pb-24 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <WalletModal
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          onDisconnect={onDisconnect}
        />

        <div className="w-full max-w-md mx-auto relative z-10">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="w-6" />
            <UserAvatar onClick={() => setShowWalletModal(true)} size="md" />
          </div>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary">Signal Detected</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">Vault Discovered</h1>
            <p className="text-white/60 whitespace-nowrap">
              Your digital legacy is ready for its rightful guardian.
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

                {/* Condition Section */}
                <div className="bg-black/20 rounded-lg p-4 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                    <Brain size={12} />
                    Unlock Condition
                  </div>
                  <p className="text-sm text-white/80 italic">
                    "Morgan must graduate from MIT "
                  </p>
                </div>

                {/* Proof Upload */}
                <div className="space-y-3">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Upload Proof (Diploma)</label>
                  <div className="relative group/upload cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 ${proofFile ? 'border-primary/50 bg-primary/10' : 'border-white/10 hover:border-primary/50 hover:bg-white/5'}`}>
                      {proofFile ? (
                        <div className="flex flex-col items-center w-full">
                          {proofFile.type.startsWith('image/') ? (
                            <div className="relative w-full aspect-video mb-3 rounded-lg overflow-hidden border border-white/10 bg-black/50">
                              <img
                                src={URL.createObjectURL(proofFile)}
                                alt="Proof Preview"
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2">
                                <span className="text-[10px] text-white/80 font-mono flex items-center gap-1">
                                  <ShieldCheck size={10} className="text-green-400" /> Verified Format
                                </span>
                              </div>
                            </div>
                          ) : (
                            <FileText className="text-green-400 mb-2" size={32} />
                          )}
                          <span className="text-xs text-green-400 font-medium truncate max-w-full px-4 flex items-center gap-2">
                            {proofFile.name}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setProofFile(null);
                              }}
                              className="p-1 hover:text-white rounded-full hover:bg-white/10"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        </div>
                      ) : (
                        <>
                          <Upload className="text-white/40 mb-2 group-hover/upload:text-primary transition-colors" size={24} />
                          <span className="text-xs text-white/40">Click to upload PDF/Image</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Use Demo Diploma Button */}
                  {!proofFile && (
                    <button
                      onClick={handleUseDefaultProof}
                      className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <Brain size={14} />
                        </div>
                        <div className="text-left">
                          <div className="text-[10px] font-bold text-white uppercase tracking-wide">Use Demo Diploma</div>
                          <div className="text-[10px] text-slate-400">Loads mit_diploma.webp</div>
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30 text-[10px] text-blue-400 font-bold group-hover:bg-blue-500 group-hover:text-white transition-all">
                        SELECT
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={!proofFile}
            className="w-full bg-primary text-black font-bold text-lg py-4 rounded-xl border border-primary btn-3d hover:brightness-110 active:brightness-90 flex items-center justify-center gap-3 group transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
          >
            {proofFile ? (
              <>
                <CreditCard size={20} />
                <span>Verify</span>
              </>
            ) : (
              <>
                <Unlock size={20} />
                <span>Select Proof to Unlock</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW: VERIFYING (AI Agent Analysis) ---
  if (status === 'VERIFYING') {
    return (
      <div className="min-h-screen bg-background-dark text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
        <div className="w-full max-w-md mx-auto space-y-8 relative z-10 text-center">
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative z-10 w-24 h-24 bg-surface border border-white/10 rounded-full flex items-center justify-center shadow-2xl">
              <Brain size={48} className="text-primary animate-pulse" />
            </div>
            {verificationStep === 'payment' && (
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                <CreditCard size={20} className="text-white" />
              </div>
            )}
            {verificationStep === 'approved' && (
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in">
                <CheckCircle size={20} className="text-white" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              {verificationStep === 'payment' && "Processing x402 Payment..."}
              {verificationStep === 'analyzing' && "AI Agent Analyzing Proof..."}
              {verificationStep === 'approved' && "Verification Successful!"}
            </h2>
            <div className="flex flex-col gap-2 items-center text-sm text-slate-400 font-mono">
              <div className={`flex items-center gap-2 ${verificationStep !== 'idle' ? 'text-green-400' : 'opacity-50'}`}>
                <CheckCircle size={14} /> Payment Confirmed (0.01 USDC)
              </div>
              <div className={`flex items-center gap-2 ${verificationStep === 'analyzing' || verificationStep === 'approved' ? 'text-green-400' : 'opacity-50'}`}>
                {verificationStep === 'analyzing' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                Analyzing Document Semantics
              </div>
              <div className={`flex items-center gap-2 ${verificationStep === 'approved' ? 'text-green-400' : 'opacity-50'}`}>
                <CheckCircle size={14} /> Condition Met: "Graduate MIT"
              </div>
            </div>
          </div>
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
              <span className="text-xs font-mono tracking-widest uppercase text-white/50">ReliQ Protocol</span>
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
              <span className="text-xs font-mono text-slate-400">Performing Threshold Decryption...</span>
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
    <div className="min-h-screen bg-background-dark text-white font-sans flex flex-col relative overflow-hidden pb-24 animate-in fade-in zoom-in duration-500">
      {/* Ethereal Background */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none z-0" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none z-0" />

      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onDisconnect={onDisconnect}
      />

      <div className="w-full max-w-md mx-auto h-full relative flex flex-col z-10">

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary/80">
            <LockOpen size={16} />
            <span className="text-xs font-medium tracking-widest uppercase">Vault Unlocked</span>
          </div>
          <div className="flex items-center gap-2">
            <UserAvatar onClick={() => setShowWalletModal(true)} size="sm" />
          </div>
        </div>

        <main className="flex-1 flex flex-col px-6 pb-8 gap-8 overflow-y-auto no-scrollbar">
          {/* Main Title Area */}
          <div className="flex flex-col items-center justify-center pt-4 pb-2 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 ring-1 ring-primary/30 shadow-[0_0_20px_rgba(253,223,73,0.15)] animate-[bounce_2s_infinite]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>
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
                <div className="w-5 h-5 rounded-full bg-white/10 backdrop-blur-md p-0.5 border border-white/20">
                  <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040" alt="USDC" className="w-full h-full object-contain" />
                </div>
                <span className="bg-black/40 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded border border-white/10 uppercase font-bold tracking-wider">USDC Transfer</span>
              </div>
            </div>
            <div className="p-5 relative">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="text-primary text-xs font-medium mb-1 flex items-center gap-1">
                    <CheckCircle size={14} />
                    Confirmed
                  </p>
                  <h3 className="text-white text-2xl font-bold tracking-tight">3,000 USDC</h3>
                </div>
                <div className="text-right">
                  <span className="text-white/40 text-xs line-through block decoration-white/30">LOCKED</span>
                  <span className="text-green-400 text-xs font-bold block mt-0.5">UNLOCKED</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 p-3 bg-black/20 rounded-lg border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase tracking-wide mb-0.5">Destination Wallet</span>
                  <span className="text-white/80 font-mono text-sm truncate w-32">Morgan</span>
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
                Your inheritance was secured by ReliQ multi-party computation. No single key holder had access.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};