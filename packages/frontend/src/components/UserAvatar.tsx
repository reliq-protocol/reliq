import React from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
    onClick: () => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Standard User Avatar component for UI consistency across all views.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({ onClick, className = "", size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-9 h-9',
        lg: 'w-10 h-10'
    };

    const iconSize = {
        sm: 14,
        md: 16,
        lg: 20
    };

    return (
        <button
            onClick={onClick}
            className={`${sizeClasses[size]} rounded-full bg-surface/50 backdrop-blur-md border border-white/10 p-[1.5px] hover:scale-110 transition-all shadow-xl shadow-black/40 group relative overflow-hidden ${className}`}
        >
            {/* Background Gradient Layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-yellow-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative z-10">
                {/* Colorful Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
                <User className="text-white/80 group-hover:text-white transition-colors" size={iconSize[size]} />
            </div>
        </button>
    );
};
