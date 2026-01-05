import { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Wallet, LogOut, Radio, AlertCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const { wallet, connect, disconnect, isConnecting, installedWallets, selectedWalletName } = useWallet();
  const location = useLocation();
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Listen for custom event to open wallet dialog from other components
  useEffect(() => {
    const handleOpenWalletDialog = () => {
      setConnectionError(null);
      setShowWalletDialog(true);
    };
    window.addEventListener('open-wallet-dialog', handleOpenWalletDialog);
    return () => window.removeEventListener('open-wallet-dialog', handleOpenWalletDialog);
  }, []);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const handleConnect = async (walletName: string) => {
    setConnectionError(null);
    try {
      await connect(walletName);
      setShowWalletDialog(false);
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  };

  const openWalletDialog = () => {
    setConnectionError(null);
    setShowWalletDialog(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Radio className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Proof of Absence</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm transition-colors ${location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className={`text-sm transition-colors ${location.pathname === '/dashboard' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/create" 
              className={`text-sm transition-colors ${location.pathname === '/create' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Create Request
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {wallet.connected ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-success/10 border border-success/20">
                  <div className="w-2 h-2 rounded-full bg-success status-pulse" />
                  <span className="text-xs font-medium text-success">
                    {wallet.network === 'testnet' ? 'Testnet' : 'Mainnet'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-border">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-mono text-foreground">
                    {truncateAddress(wallet.address!)}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={disconnect}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button variant="wallet" onClick={openWalletDialog} disabled={isConnecting}>
                <Wallet className="w-4 h-4" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </div>
      </header>

      <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Select a Cardano wallet to connect. Make sure you're on the testnet network.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {connectionError && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{connectionError}</span>
              </div>
            )}

            {installedWallets.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Wallet className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">No wallets detected</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Install a Cardano wallet extension like Nami, Eternl, or Flint to continue.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <a 
                    href="https://namiwallet.io/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Nami
                  </a>
                  <span className="text-muted-foreground">•</span>
                  <a 
                    href="https://eternl.io/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Eternl
                  </a>
                  <span className="text-muted-foreground">•</span>
                  <a 
                    href="https://flint-wallet.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Flint
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {installedWallets.map((w) => (
                  <button
                    key={w.name}
                    onClick={() => handleConnect(w.name)}
                    disabled={isConnecting}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <img 
                      src={w.icon} 
                      alt={w.name} 
                      className="w-8 h-8 rounded-md"
                    />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground capitalize">{w.name}</p>
                      <p className="text-xs text-muted-foreground">v{w.version}</p>
                    </div>
                    {isConnecting && selectedWalletName === w.name && (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
