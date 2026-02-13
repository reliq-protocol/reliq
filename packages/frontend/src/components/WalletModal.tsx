import React from 'react';
import { X, Wallet, Copy, LogOut } from 'lucide-react';
import { useDisconnect, useAccount, useBalance } from 'wagmi';
import { truncateAddress } from '../utils/format';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDisconnect?: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
    isOpen,
    onClose,
    onDisconnect
}) => {
    const { disconnect } = useDisconnect();
    const { address } = useAccount();
    const { data: balance } = useBalance({ address });

    const [copied, setCopied] = React.useState(false);

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 text-left">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative bg-[#1a1810] border border-white/10 w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 space-y-6 animate-in slide-in-from-bottom-10 duration-200 shadow-2xl shadow-black">

                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                        Account Access
                    </h3>
                    <button
                        onClick={onClose}
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
                        <div className="flex-1 min-w-0">
                            <div className="text-white font-mono font-medium text-sm tracking-tight truncate">
                                {truncateAddress(address) || 'Not connected'}
                            </div>
                            <div className="text-xs text-slate-400">
                                {balance ? `${(Number(balance.value) / 1e18).toFixed(4)} ${balance.symbol}` : 'Loading...'}
                            </div>
                        </div>
                        <button
                            onClick={copyAddress}
                            className="text-primary hover:text-white transition-colors flex-shrink-0"
                            title="Copy address"
                        >
                            {copied ? (
                                <Copy size={16} className="text-green-400" />
                            ) : (
                                <Copy size={16} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                    {onDisconnect && (
                        <button
                            onClick={() => {
                                console.log('🔴 WalletModal: Disconnect clicked');
                                disconnect();
                                onClose();
                                onDisconnect();
                            }}
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
                    )}
                </div>

                <div className="text-center pt-2">
                    <p className="text-[10px] text-slate-600">
                        ReliQ Protocol v1.0.4 • Secure Connection
                    </p>
                </div>
            </div>
        </div>
    );
};
