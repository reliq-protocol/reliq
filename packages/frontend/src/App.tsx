import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ProvisionVault } from './views/ProvisionVault';
import { PulseMonitor } from './views/PulseMonitor';
import { DecryptingVault } from './views/DecryptingVault';
import { ConnectWallet } from './views/ConnectWallet';
import { AppView, UserRole } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<UserRole | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.PULSE);

  // Initial Logic: If logged in as Tony, show Pulse/Provision. If Morgan, show Decrypt.
  useEffect(() => {
    if (currentUser === 'CREATOR') {
      setCurrentView(AppView.PULSE);
    } else if (currentUser === 'BENEFICIARY') {
      setCurrentView(AppView.DECRYPTING);
    }
  }, [currentUser]);

  // Handle Switching Logic
  const handleSwitchUser = () => {
    setCurrentUser(prev => prev === 'CREATOR' ? 'BENEFICIARY' : 'CREATOR');
  };

  const handleDisconnect = () => {
    setCurrentUser(null);
  };

  const renderView = () => {
    if (!currentUser) return <ConnectWallet onConnect={() => setCurrentUser('CREATOR')} />;

    switch (currentView) {
      case AppView.PROVISION:
        return <ProvisionVault currentUser={currentUser} onSwitchUser={handleSwitchUser} onDisconnect={handleDisconnect} />;
      case AppView.PULSE:
        return <PulseMonitor currentUser={currentUser} onSwitchUser={handleSwitchUser} onDisconnect={handleDisconnect} />;
      case AppView.DECRYPTING:
        // Decrypting view usually doesn't need nav back for Morgan context in this specific flow,
        // but adding switch capability if needed via a back button or if we added a header. 
        // For now, DecryptingVault is immersive. To switch back from here, we might need a hidden trigger 
        // or just rely on the flow completing. 
        // However, based on the prompt, "Only Morgan sees pending inheritance". 
        // Let's assume this view is the end state for her until interaction completes.
        return <DecryptingVault />;
      default:
        return <ProvisionVault currentUser={currentUser} onSwitchUser={handleSwitchUser} onDisconnect={handleDisconnect} />;
    }
  };

  return (
    <div className="bg-background-dark min-h-screen">
      {renderView()}
      
      {/* Navigation is only visible if User is logged in AND User is the Creator (Tony) */}
      {/* Morgan only sees the specific decrypt screen, so no bottom nav for her context based on the "Logic: Only Morgan sees..." prompt interpretation. */}
      {/* OR: If we want Morgan to have nav, we can add it. But usually beneficiaries just get a link. */}
      {/* Let's keep Nav for Tony to switch between Pulse and Provision. */}
      
      {currentUser === 'CREATOR' && (
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
      )}
    </div>
  );
}

export default App;