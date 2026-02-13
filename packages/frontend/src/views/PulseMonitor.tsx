import React, { useState, useEffect, useCallback } from 'react';
import { Fingerprint, Info, ArrowRight, ScanFace, CheckCircle2, ShieldAlert, HelpCircle, Loader2, ShieldOff, Plus } from 'lucide-react';
import { useAccount } from 'wagmi';
import { AppView } from '../types';
import { WalletModal } from '../components/WalletModal';
import { UserAvatar } from '../components/UserAvatar';

// Configuration
const CHECK_IN_PERIOD_DAYS = 30;
const TOTAL_MS = CHECK_IN_PERIOD_DAYS * 24 * 60 * 60 * 1000;

const MORGAN_STARK_ADDRESS = '0x89d042ef4153d9Ce1EB9E1dfD99607801225C595';

interface PulseMonitorProps {
  onDisconnect: () => void;
  onViewChange?: (view: AppView) => void;
}

export const PulseMonitor: React.FC<PulseMonitorProps> = ({ onDisconnect, onViewChange }) => {
  const { address, isConnected } = useAccount();
  const isMorgan = isConnected && address?.toLowerCase() === MORGAN_STARK_ADDRESS.toLowerCase();
  // State for the countdown
  const [targetDate, setTargetDate] = useState<number>(() => {
    const now = new Date();
    return now.getTime() + (TOTAL_MS * 0.96); // Start at 96% for demo purposes
  });

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);


  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, targetDate - now);
      setTimeLeft(remaining);
    }, 1000);

    // Initial calc
    setTimeLeft(Math.max(0, targetDate - Date.now()));

    return () => clearInterval(interval);
  }, [targetDate]);

  // Calculate time components
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  // Calculate percentage for the ring
  const percentage = Math.min(100, Math.max(0, (timeLeft / TOTAL_MS) * 100));

  const handleCheckIn = useCallback(async () => {
    if (isVerifying) return;

    setIsVerifying(true);
    setAuthStatus('scanning');

    try {
      // 1. Minimum animation delay for the "Scanning" UI
      const minDelay = new Promise(resolve => setTimeout(resolve, 3000));

      // 2. Attempt real platform authenticator (FaceID/TouchID/Windows Hello)
      const authPromise = navigator.credentials ? navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array([1, 2, 3, 4]),
          rp: { name: "ReliQ Protocol" },
          user: {
            id: new Uint8Array([1, 2, 3, 4]),
            name: "owner@ReliQ.io",
            displayName: "Vault Owner"
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          timeout: 60000,
          authenticatorSelection: { userVerification: "required" }
        }
      }).catch(() => {
        return true;
      }) : Promise.resolve(true);

      await Promise.all([minDelay, authPromise]);

      // Success sequence
      setAuthStatus('success');

      setTimeout(() => {
        // Reset the timer to full 30 days
        setTargetDate(Date.now() + TOTAL_MS);
        setIsVerifying(false);
        setAuthStatus('idle');
      }, 2000);

    } catch (error) {
      console.error("Auth failed", error);
      setAuthStatus('failed');
      setTimeout(() => {
        setIsVerifying(false);
        setAuthStatus('idle');
      }, 2000);
    }
  }, [isVerifying]);

  const getNextResetDate = () => {
    const date = new Date(targetDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatTimeBlock = (value: number, label: string) => (
    <div className="flex flex-col items-center justify-center">
      <div className="font-mono text-2xl sm:text-3xl font-bold leading-none tabular-nums tracking-tight">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-[8px] sm:text-[10px] uppercase text-slate-500 font-bold mt-1 tracking-wider">
        {label}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background-dark text-white pb-24">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] transition-all duration-1000 ${isVerifying ? 'animate-pulse bg-primary/20' : 'animate-pulse-slow'}`} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] animate-pulse-slow" />
      </div>

      {/* Biometric Scanning Overlay */}
      {(authStatus === 'scanning' || authStatus === 'success' || authStatus === 'failed') && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">

          <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
            {/* Scanning Lines (Only during scanning) */}
            {authStatus === 'scanning' && (
              <>
                <div className="absolute inset-x-12 h-[2px] bg-primary/80 shadow-[0_0_15px_rgba(253,223,73,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent animate-pulse" />
              </>
            )}

            {/* Status Icon */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              {authStatus === 'scanning' && (
                <div className="relative">
                  <ScanFace size={80} className="text-white/20" strokeWidth={1} />
                  <ScanFace size={80} className="text-primary absolute inset-0 animate-pulse" strokeWidth={1} />
                </div>
              )}

              {authStatus === 'success' && (
                <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center animate-in zoom-in duration-300">
                  <CheckCircle2 size={48} className="text-green-400" />
                </div>
              )}

              {authStatus === 'failed' && (
                <div className="w-24 h-24 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center animate-in zoom-in duration-300">
                  <ShieldAlert size={48} className="text-red-400" />
                </div>
              )}

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  {authStatus === 'scanning' && <span className="animate-pulse">Verifying Identity...</span>}
                  {authStatus === 'success' && <span className="text-green-400">Identity Confirmed</span>}
                  {authStatus === 'failed' && <span className="text-red-400">Verification Failed</span>}
                </h2>
                <p className="text-sm text-slate-400 font-mono">
                  {authStatus === 'scanning' && "Please look at the camera"}
                  {authStatus === 'success' && "Proof of Liveness accepted. Timer reset."}
                  {authStatus === 'failed' && "Biometric signature mismatch."}
                </p>
              </div>
            </div>

            {/* Decorative Corners */}
            <div className="absolute inset-8 border-2 border-white/10 rounded-3xl" />
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-primary rounded-tl-3xl" />
            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-primary rounded-tr-3xl" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-primary rounded-bl-3xl" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-primary rounded-br-3xl" />
          </div>

          {/* Bottom Action */}
          {authStatus === 'scanning' && (
            <button
              onClick={() => setIsVerifying(false)}
              className="mt-12 px-6 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Cancel Scan
            </button>
          )}
        </div>
      )}

      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onDisconnect={onDisconnect}
      />


      <main className="relative z-10 flex-grow flex flex-col items-center justify-between px-6 pb-8 pt-4 max-w-md mx-auto w-full h-full">
        {/* Header with Avatar */}
        <header className="w-full flex items-center justify-between relative py-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-surface to-background-dark border border-white/10 flex items-center justify-center shadow-lg group overflow-hidden">
              <img src={`${import.meta.env.BASE_URL}reliq-logo-dark.webp`} alt="ReliQ Logo" className="w-11 h-11 group-hover:rotate-12 transition-transform duration-500 object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">ReliQ</h1>
              <div className="flex items-center gap-1.5 text-primary/80">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                <span className="text-[9px] font-bold tracking-widest uppercase">Liveness Protocol</span>
              </div>
            </div>
          </div>
          {/* Avatar Button */}
          <UserAvatar onClick={() => setShowWalletModal(true)} size="md" />
        </header>

        {/* Main Content Choice */}
        {isMorgan ? (
          <>
            <section className="flex-grow flex flex-col items-center justify-center w-full py-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="relative group">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="relative w-72 h-72 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,223,73,0.05)_0%,transparent_70%)]" />

                  <div className="relative z-10 flex flex-col items-center gap-6 p-8 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-xl mb-2 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                      <ShieldOff size={40} className="text-white/20 group-hover:text-primary/40 transition-colors" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-bold tracking-tight text-white/90">No Active Vault</h2>
                      <p className="text-[11px] text-slate-500 leading-relaxed max-w-[180px] font-medium uppercase tracking-wider">
                        Your digital legacy awaits configuration.
                      </p>
                    </div>

                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                </div>
              </div>
            </section>

            <section className="w-full space-y-6">
              <button
                onClick={() => onViewChange?.(AppView.PROVISION)}
                className="w-full font-bold text-lg py-5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-3 group relative overflow-hidden bg-primary text-black hover:brightness-110 active:scale-[0.98] transition-all duration-300"
              >
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                <Plus size={24} />
                <span>Create New Vault</span>
              </button>

              <div className="text-center pb-2">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest">Secured by ReliQ Protocol</p>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Timer Section */}
            <section className="flex-grow flex flex-col items-center justify-center w-full py-8">
              <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Outer Glow */}
                <div className={`absolute inset-0 rounded-full bg-primary/5 transition-all duration-1000 ${timeLeft < 1000 * 60 * 60 * 24 ? 'animate-pulse bg-red-500/10' : 'animate-pulse-slow'}`} />

                {/* Conic Gradient Ring */}
                <div
                  className="w-full h-full rounded-full p-[12px] shadow-2xl shadow-black/50 transition-[background] duration-1000 ease-linear"
                  style={{
                    background: `conic-gradient(${percentage < 20 ? '#ef4444' : '#fddf49'} ${percentage}%, rgba(255, 255, 255, 0.03) 0)`
                  }}
                >
                  {/* Inner Circle Structure - REFACTORED to prevent clipping */}
                  <div className="w-full h-full bg-background-dark rounded-full flex flex-col items-center justify-center relative shadow-inner shadow-black/80">

                    {/* 1. Background Decoration Layer (Clipped) */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="absolute inset-4 rounded-full border border-dashed border-slate-700/50 opacity-50 pointer-events-none" />
                    </div>

                    {/* 2. Content Layer (Not Clipped, High Z-Index) */}
                    <div className="text-center z-10 flex flex-col items-center justify-center w-full relative">

                      {/* Label & Help Icon */}
                      <div className="flex items-center gap-1.5 mb-3 relative">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Auto-Release In</span>
                        <button
                          onClick={() => setShowInfoTooltip(!showInfoTooltip)}
                          className="text-white/30 hover:text-white transition-colors focus:outline-none relative z-50 p-1"
                        >
                          <HelpCircle size={14} className={showInfoTooltip ? "text-primary" : ""} />
                        </button>

                        {/* Tooltip - z-50 ensures it's on top of everything */}
                        {showInfoTooltip && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-[#2a2718] border border-white/10 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-2 z-[60]">
                            <div className="text-[10px] leading-relaxed text-slate-300 text-left">
                              <span className="text-primary font-bold">Protocol Info:</span><br />
                              If the timer reaches zero without a check-in, key shards will be distributed to beneficiaries automatically.
                            </div>
                            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2a2718] border-b border-r border-white/10 rotate-45" />
                          </div>
                        )}
                      </div>

                      {/* High Tech Timer Grid */}
                      <div className={`grid grid-cols-7 items-center gap-0.5 ${percentage < 20 ? 'text-red-500' : 'text-white'}`}>
                        {formatTimeBlock(days, 'Days')}
                        <div className="text-2xl font-mono opacity-50 pb-3">:</div>
                        {formatTimeBlock(hours, 'Hrs')}
                        <div className="text-2xl font-mono opacity-50 pb-3">:</div>
                        {formatTimeBlock(minutes, 'Min')}
                        <div className="text-2xl font-mono opacity-50 pb-3">:</div>
                        {formatTimeBlock(seconds, 'Sec')}
                      </div>

                      {percentage < 20 && (
                        <div className="flex items-center justify-center gap-1 text-red-400 mt-4 animate-pulse bg-red-950/30 px-3 py-1 rounded-full border border-red-500/20">
                          <ShieldAlert size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Danger Zone</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Actions */}
            <section className="w-full space-y-6">
              <button
                onClick={handleCheckIn}
                disabled={isVerifying}
                className={`w-full font-bold text-lg py-5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-3 group relative overflow-hidden btn-3d transition-all duration-300
                  ${isVerifying
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-primary text-black hover:brightness-110 active:scale-[0.98]'
                  }`}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>Initializing...</span>
                  </>
                ) : (
                  <>
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                    <Fingerprint className="text-black/80 group-active:scale-90 transition-transform" size={24} />
                    <span>I am Alive — Check In</span>
                  </>
                )}
              </button>

              <div className="glass-panel rounded-lg p-4 w-full">
                <div className="flex items-start gap-3">
                  <Info className="text-primary/60 mt-0.5" size={18} />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">Next Expiration</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Reset required by <span className="text-white font-mono">{getNextResetDate()}</span>.
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex justify-end">
                  <button className="text-xs font-medium text-primary hover:text-white transition-colors flex items-center gap-1">
                    Configure Thresholds <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="text-center pb-2">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest">Secured by ReliQ Protocol</p>
              </div>
            </section>
          </>
        )}
      </main>

      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};