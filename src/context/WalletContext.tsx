import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { WalletState, DEMO_USER_ADDRESS } from '@/types/accountability';

interface WalletContextType {
  wallet: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    network: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // For demo purposes, simulate a successful testnet connection
    setWallet({
      connected: true,
      address: DEMO_USER_ADDRESS,
      network: 'testnet',
    });
    
    setIsConnecting(false);
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      connected: false,
      address: null,
      network: null,
    });
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect, isConnecting }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
