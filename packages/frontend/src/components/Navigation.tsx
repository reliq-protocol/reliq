import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, Timer, Lock } from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: AppView.PROVISION, label: 'Provision', icon: LayoutDashboard },
    { id: AppView.PULSE, label: 'Switch', icon: Timer },
    { id: AppView.DECRYPTING, label: 'Decrypt', icon: Lock },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-lg border-t border-white/5 pb-safe">
      <div className="flex justify-around items-center px-4 py-3 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              currentView === item.id 
                ? 'text-primary' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <item.icon size={20} strokeWidth={currentView === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-wide uppercase">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};