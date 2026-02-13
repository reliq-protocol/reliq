import React, { useState } from 'react';
import { ChevronLeft, Wallet, QrCode, ChevronDown, Lock, Copy, User, X, LogOut, ChevronRight, Settings, AlertCircle, ChevronUp } from 'lucide-react';
import { UserRole } from '../types';

interface ProvisionVaultProps {
  currentUser: UserRole;
  onSwitchUser: () => void;
  onDisconnect: () => void;
}

export const ProvisionVault: React.FC<ProvisionVaultProps> = ({ currentUser, onSwitchUser, onDisconnect }) => {
  const [amount, setAmount] = useState<string>('');
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Advanced Settings State
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [expirationDays, setExpirationDays] = useState<number>(30);

  const walletAddress = currentUser === 'CREATOR' ? '0x71C...9A21' : '0xMoose...B404';

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setExpirationDays(isNaN(val) ? 0 : val);
  };

  const isExpirationInvalid = expirationDays < 3;

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden flex flex-col items-center">
      {/* Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-20%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Wallet Management Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowWalletModal(false)} />
          <div className="relative bg-[#1a1810] border border-white/10 w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 space-y-6 animate-in slide-in-from-bottom-10 duration-200 shadow-2xl shadow-black">

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white tracking-tight">Account Access</h3>
              <button
                onClick={() => setShowWalletModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>

            {/* Current Wallet Card */}
            <div className="bg-surface/50 rounded-xl p-4 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Connected Wallet</span>
                <span className="flex items-center gap-1.5 text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                    <Wallet size={18} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-white font-mono font-medium text-lg tracking-tight">{walletAddress}</div>
                  <div className="text-xs text-slate-400">
                    {currentUser === 'CREATOR' ? 'Role: Creator (Tony)' : 'Role: Beneficiary (Morgan)'}
                  </div>
                </div>
                <button className="text-primary hover:text-white transition-colors">
                  <Copy size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  onSwitchUser();
                  setShowWalletModal(false);
                }}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Wallet size={16} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">Change Wallet</div>
                    <div className="text-xs text-slate-400">
                      Switch to {currentUser === 'CREATOR' ? 'Morgan' : 'Tony'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
              </button>

              <button
                onClick={onDisconnect}
                className="w-full flex items-center justify-between p-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                    <LogOut size={16} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-red-400">Disconnect</div>
                    <div className="text-xs text-red-400/60">Sign out of current session</div>
                  </div>
                </div>
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-[10px] text-slate-600">
                Relic Protocol v1.0.4 • Secure Connection
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="w-full max-w-md px-6 py-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-background-dark/50">
        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-white">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-white">Provision New Vault</h1>

        {/* Avatar Button */}
        <button
          onClick={() => setShowWalletModal(true)}
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-yellow-200 p-[1.5px] hover:scale-105 transition-transform shadow-lg shadow-primary/20"
        >
          <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden relative">
            {/* Fallback Avatar / Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80" />
            <User className="relative z-10 text-white/90 w-4 h-4" />
          </div>
        </button>
      </header>

      <main className="w-full max-w-md px-6 space-y-8 mt-2 flex-1">
        {/* Status */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary/80 text-xs font-mono uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Secure Channel Active
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Configure the parameters for your digital inheritance vault. All data is encrypted client-side before transmission.
          </p>
        </div>

        {/* Beneficiary Wallet */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-sm font-medium text-white/90">Beneficiary Wallet</label>
            <button className="flex items-center gap-1 text-xs text-primary hover:underline underline-offset-4">
              <Copy size={12} />
              Paste from clipboard
            </button>
          </div>
          <div className="glass-panel rounded-xl p-1 group focus-within:border-primary/50 transition-colors relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
            <div className="flex items-center gap-2 px-3 py-3">
              <Wallet className="text-white/40" size={20} />
              <input
                type="text"
                placeholder="0x..."
                className="bg-transparent border-none text-white font-mono text-sm w-full focus:ring-0 placeholder-white/20 tracking-wide outline-none"
                spellCheck={false}
              />
              <button className="text-primary hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                <QrCode size={20} />
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-2 overflow-x-auto pb-2 no-scrollbar">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 active:bg-primary/20 transition text-xs text-white/70 whitespace-nowrap">
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-orange-500 to-red-500" />
              Moose
            </button>
          </div>
        </section>

        {/* Asset Allocation */}
        <section className="space-y-4">
          <label className="text-sm font-medium text-white/90">Asset Allocation</label>
          <div className="glass-panel rounded-xl p-5 space-y-6">
            {/* Asset Selector */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                  {/* Ethereum Icon SVG */}
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
                    <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm7.994-15.781L16.498 4 9 16.22l7.498 4.353 7.496-4.354zM24 17.616l-7.502 4.351L9 17.617l7.498 10.378L24 17.616z" fill="#fff" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium">Ethereum</div>
                  <div className="text-xs text-white/40">ERC-20 Network</div>
                </div>
              </div>
              <button className="flex items-center gap-1 text-sm text-white/80 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors">
                Select
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-white/40 font-mono">VOLUME</span>
                <span className="text-xs text-primary font-mono cursor-pointer hover:text-white">MAX: 4.208 ETH</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent text-4xl font-bold text-white placeholder-white/10 border-none p-0 focus:ring-0 tracking-tight outline-none"
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 font-bold text-xl pointer-events-none">ETH</span>
              </div>
              <div className="mt-2 text-xs text-white/30 font-mono">≈ ${(Number(amount || 0) * 2600).toLocaleString()} USD</div>
            </div>
          </div>
        </section>

        {/* Legacy Message */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-white/90">Legacy Message</label>
            <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/5 font-mono">AES-256</span>
          </div>
          <div className="glass-panel rounded-xl p-1 focus-within:border-primary/50 transition-colors relative">
            <textarea
              className="w-full bg-transparent border-none text-white/90 text-sm p-4 focus:ring-0 placeholder-white/20 resize-none leading-relaxed outline-none"
              placeholder="Write a private message to be decrypted only by the beneficiary upon access..."
              defaultValue="Morgan, I love you 3000. You are my greatest creation. Keep making me proud. - Dad"
              rows={4}
            />
            <div className="absolute bottom-3 right-3 text-[10px] text-white/30 font-mono bg-black/20 px-1.5 rounded backdrop-blur-sm">
              83/1000
            </div>
          </div>
        </section>

        {/* Advanced Settings */}
        <section className="glass-panel rounded-xl overflow-hidden transition-all duration-300 mb-8">
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-white/60" />
              <span className="text-sm font-medium text-white/90">Advanced Settings</span>
            </div>
            {isAdvancedOpen ? <ChevronUp size={18} className="text-white/40" /> : <ChevronDown size={18} className="text-white/40" />}
          </button>

          {isAdvancedOpen && (
            <div className="p-4 border-t border-white/5 bg-black/20 space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inactivity Threshold</label>
                  {isExpirationInvalid && (
                    <span className="flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-900/20 px-2 py-0.5 rounded">
                      <AlertCircle size={10} />
                      MIN 3 DAYS
                    </span>
                  )}
                </div>

                <div className={`relative group transition-all duration-300 rounded-lg ${isExpirationInvalid ? 'ring-1 ring-red-500/50' : 'focus-within:ring-1 focus-within:ring-primary/50'}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-white/20 font-mono text-sm">DAYS:</span>
                  </div>
                  <input
                    type="number"
                    value={expirationDays}
                    onChange={handleExpirationChange}
                    className="block w-full pl-14 pr-3 py-3 bg-black/20 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-white/20 transition-all placeholder-white/20"
                  />
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  The Pulse Monitor protocol will require a check-in within this period. Failure to check in will trigger key shard release.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Floating Action Button */}
        <div className="fixed bottom-[80px] left-0 right-0 p-6 z-40 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              disabled={isExpirationInvalid}
              className="w-full bg-primary text-black font-bold text-lg py-4 rounded-lg border border-primary btn-3d hover:brightness-110 active:brightness-90 flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
              <Lock className="text-black/80" size={20} />
              <span className="tracking-tight">Encrypt & Secure</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};