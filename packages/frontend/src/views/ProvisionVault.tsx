import React, { useState } from 'react';
import { ChevronLeft, Wallet, QrCode, Lock, Copy, Loader2, CheckCircle } from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
import { WalletModal } from '../components/WalletModal';
import { UserAvatar } from '../components/UserAvatar';
import { AppView } from '../types';

interface ProvisionVaultProps {
  onDisconnect: () => void;
  onViewChange?: (view: AppView) => void;
}

export const ProvisionVault: React.FC<ProvisionVaultProps> = ({ onDisconnect, onViewChange }) => {
  const [amount, setAmount] = useState<string>('');
  const [condition, setCondition] = useState<string>('');
  const [beneficiaryAddress, setBeneficiaryAddress] = useState<string>('');

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { address } = useAccount();

  // Real USDC contract address
  const usdcAddress = '0xc4083B1E81ceb461Ccef3FDa8A9F24F0d764B6D8';

  const erc20Abi = [
    {
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ name: 'value', type: 'uint256' }],
    },
    {
      name: 'decimals',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: 'value', type: 'uint8' }],
    }
  ] as const;

  const { data: usdcBalance } = useReadContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: !!address,
    }
  });

  const { data: usdcDecimals } = useReadContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: 'decimals',
    query: {
      enabled: !!address,
    }
  });

  const formattedBalance = usdcBalance && usdcDecimals !== undefined
    ? (Number(usdcBalance) / 10 ** Number(usdcDecimals)).toFixed(2)
    : '0.00';

  const handleMax = () => {
    if (usdcBalance) {
      setAmount(formattedBalance);
    }
  };


  const handleProvision = async () => {
    setIsProvisioning(true);

    // 1. Encrypt the "Transfer to Beneficiary" transaction
    console.log("Encrypting Transaction with BITE v2...", { amount });

    // 2. Encrypt the "Condition" via Agent's Public Key
    console.log("Encrypting Condition for Agent Eyes Only...", { condition }); // In real app, this would be encrypted
    await new Promise(r => setTimeout(r, 1000));

    // 3. Submit Conditional Transaction (CTX) to BITE Network
    // This creates the vault AND queues the automated execution
    console.log("Submitting Conditional Transaction to BITE Network...");
    console.log("Condition: 'ReliQ.isUnlocked(vaultId) == true'");
    await new Promise(r => setTimeout(r, 2000));

    setIsProvisioning(false);
    setIsSuccess(true);

    // Reset after success
    setTimeout(() => {
      setIsSuccess(false);
      setAmount('');
      setCondition('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-sans flex flex-col relative overflow-hidden pb-24">
      {/* Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-20%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onDisconnect={onDisconnect}
      />

      {/* Header */}
      <header className="w-full max-w-md mx-auto px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <button
          onClick={() => onViewChange?.(AppView.PULSE)}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-white">Provision New Vault</h1>

        {/* Avatar Button */}
        <UserAvatar onClick={() => setShowWalletModal(true)} size="md" />
      </header>

      <main className="w-full max-w-md mx-auto px-6 space-y-8 mt-2 flex-1 pb-32">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary/80 text-xs font-mono uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Secure Channel Active
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Configure the parameters for your digital inheritance vault. All data is encrypted client-side before transmission.
          </p>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white/90">Beneficiary Wallet</label>
            <button className="flex items-center gap-1 text-[10px] text-primary hover:underline underline-offset-4 opacity-70">
              <Copy size={10} />
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
                value={beneficiaryAddress}
                onChange={(e) => setBeneficiaryAddress(e.target.value)}
                className="bg-transparent border-none text-white font-mono text-sm w-full focus:ring-0 placeholder-white/20 tracking-wide outline-none"
                spellCheck={false}
              />
              <button className="text-primary hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                <QrCode size={20} />
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setBeneficiaryAddress('0x89d042ef4153d9Ce1EB9E1dfD99607801225C595')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 active:bg-primary/20 transition text-xs text-white/70 whitespace-nowrap"
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-orange-500 to-red-500" />
              Morgan
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <label className="text-sm font-medium text-white/90 block">Asset Allocation</label>
          <div className="glass-panel rounded-xl p-5 space-y-6">
            {/* Asset Selector */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/10 overflow-hidden p-2">
                  <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040" alt="USDC" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-white font-medium text-lg">USDC</div>
                  <div className="text-xs text-white/40">SKALE Sandbox</div>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">VOLUME</span>
                <button
                  onClick={handleMax}
                  className="text-xs text-primary font-mono cursor-pointer hover:text-white transition-colors"
                >
                  MAX: {formattedBalance} USDC
                </button>
              </div>
              <div className="flex items-baseline gap-2">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent text-5xl font-bold text-white placeholder-white/10 border-none p-0 focus:ring-0 tracking-tight outline-none w-full"
                />
                <span className="text-white/20 font-bold text-sm tracking-widest pointer-events-none uppercase">USDC</span>
              </div>
              <div className="mt-4 text-xs text-white/30 font-mono">≈ ${Number(amount || 0).toLocaleString()} USD</div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white/90">Unlock Condition (Smart Will)</label>
            <span className="text-[10px] text-primary/80 bg-primary/10 px-2 py-0.5 rounded border border-primary/20 font-mono">BITE ENCRYPTED</span>
          </div>
          <div className="glass-panel rounded-xl p-1 focus-within:border-primary/50 transition-colors relative w-full">
            <textarea
              className="w-full bg-transparent border-none text-white/90 text-sm p-4 focus:ring-0 placeholder-white/20 resize-none leading-relaxed outline-none"
              placeholder="Describe the condition (e.g., 'Morgan must graduate from MIT'). Verified by AI Executor."
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              rows={3}
            />
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed px-1">
            This condition is encrypted on-chain. An AI Agent will verify proof against this condition before decrypting the assets.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white/90">Legacy Message</label>
            <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/5 font-mono">AES-256</span>
          </div>
          <div className="glass-panel rounded-xl p-1 focus-within:border-primary/50 transition-colors relative w-full">
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


        {/* Floating Action Button */}
        <div className="fixed bottom-[80px] left-0 right-0 z-40 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent pointer-events-none">
          <div className="max-w-md mx-auto px-6 pointer-events-auto pb-4">

            <button
              onClick={handleProvision}
              disabled={isProvisioning || isSuccess}
              className={`w-full font-bold text-lg py-4 rounded-lg border btn-3d flex items-center justify-center gap-3 group relative overflow-hidden transition-all
                ${isSuccess
                  ? 'bg-green-500 border-green-400 text-white'
                  : 'bg-primary border-primary text-black hover:brightness-110 active:brightness-90'
                }
                disabled:opacity-80 disabled:cursor-not-allowed`}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

              {isProvisioning ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Encrypting & Staking...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle size={20} />
                  <span>Vault Created!</span>
                </>
              ) : (
                <>
                  <Lock className="text-black/80" size={20} />
                  <span className="tracking-tight">Encrypt & Secure</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main >
    </div >
  );
};