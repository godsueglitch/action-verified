import { useWallet } from '@/context/WalletContext';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function NetworkWarningBanner() {
  const { wallet } = useWallet();
  const [dismissed, setDismissed] = useState(false);

  if (!wallet.connected || wallet.network !== 'mainnet' || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-destructive/95 backdrop-blur-sm border-b border-destructive-foreground/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive-foreground flex-shrink-0" />
          <div className="text-sm text-destructive-foreground">
            <span className="font-semibold">Warning: Mainnet Connected</span>
            <span className="hidden sm:inline ml-2">
              — This application is designed for Cardano Testnet. Please switch to a testnet wallet to avoid accidental transactions.
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDismissed(true)}
          className="text-destructive-foreground hover:bg-destructive-foreground/10 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
