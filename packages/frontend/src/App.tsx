import { useState, useEffect } from 'react';
import { WagmiProvider, useAccount } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi';
import { Navigation } from './components/Navigation';
import { ProvisionVault } from './views/ProvisionVault';
import { PulseMonitor } from './views/PulseMonitor';
import { DecryptingVault } from './views/DecryptingVault';
import { ConnectWallet } from './views/ConnectWallet';
import { AppView } from './types';

const queryClient = new QueryClient();

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.PULSE);
  const { isConnected } = useAccount();

  // Reset view when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setCurrentView(AppView.PULSE);
    }
  }, [isConnected]);

  const handleDisconnect = () => {
    setCurrentView(AppView.PULSE);
  };

  const renderView = () => {
    // Show connect wallet if not connected
    if (!isConnected) {
      return <ConnectWallet />;
    }

    // User is connected, show the app
    switch (currentView) {
      case AppView.PROVISION:
        return <ProvisionVault onDisconnect={handleDisconnect} />;
      case AppView.PULSE:
        return <PulseMonitor onDisconnect={handleDisconnect} onViewChange={setCurrentView} />;
      case AppView.DECRYPTING:
        return <DecryptingVault onDisconnect={handleDisconnect} />;
      default:
        return <ProvisionVault onDisconnect={handleDisconnect} />;
    }
  };

  return (
    <div className="bg-background-dark min-h-screen">
      {renderView()}

      {isConnected && (
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
      )}
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;