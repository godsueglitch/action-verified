import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Radio } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const { wallet, connect, disconnect, isConnecting } = useWallet();
  const location = useLocation();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
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
                <span className="text-xs font-medium text-success">Testnet</span>
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
            <Button variant="wallet" onClick={connect} disabled={isConnecting}>
              <Wallet className="w-4 h-4" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
