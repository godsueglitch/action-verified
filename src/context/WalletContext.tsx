import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { WalletState } from '@/types/accountability';

interface InstalledWallet {
  name: string;
  icon: string;
  version: string;
}

interface WalletContextType {
  wallet: WalletState;
  installedWallets: InstalledWallet[];
  connect: (walletName: string) => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  selectedWalletName: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const WALLET_STORAGE_KEY = 'poa_wallet_connection';

// Simulated wallet data for demo purposes
const AVAILABLE_WALLETS: InstalledWallet[] = [
  { name: 'nami', icon: 'https://raw.githubusercontent.com/nicholaswma/cardano-wallets/main/nami.svg', version: '3.4.0' },
  { name: 'eternl', icon: 'https://raw.githubusercontent.com/nicholaswma/cardano-wallets/main/eternl.svg', version: '1.11.0' },
  { name: 'flint', icon: 'https://raw.githubusercontent.com/nicholaswma/cardano-wallets/main/flint.svg', version: '2.0.0' },
  { name: 'yoroi', icon: 'https://raw.githubusercontent.com/nicholaswma/cardano-wallets/main/yoroi.svg', version: '4.8.0' },
];

// Generate a realistic testnet address
const generateTestnetAddress = () => {
  const chars = 'abcdef0123456789';
  let address = 'addr_test1qz';
  for (let i = 0; i < 54; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    network: null,
  });
  const [installedWallets] = useState<InstalledWallet[]>(AVAILABLE_WALLETS);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWalletName, setSelectedWalletName] = useState<string | null>(null);

  // Load persisted wallet connection on mount
  useEffect(() => {
    const stored = localStorage.getItem(WALLET_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.walletName && parsed.address && parsed.network) {
          setSelectedWalletName(parsed.walletName);
          setWallet({
            connected: true,
            address: parsed.address,
            network: parsed.network,
          });
        }
      } catch (error) {
        console.error('Failed to restore wallet connection:', error);
        localStorage.removeItem(WALLET_STORAGE_KEY);
      }
    }
  }, []);

  const connect = useCallback(async (walletName: string) => {
    setIsConnecting(true);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const address = generateTestnetAddress();
      // Simulate 80% testnet, 20% mainnet for demo
      const network = Math.random() > 0.2 ? 'testnet' : 'mainnet';
      
      setSelectedWalletName(walletName);
      setWallet({
        connected: true,
        address,
        network,
      });

      // Persist connection
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify({
        walletName,
        address,
        network,
      }));
    } catch (error) {
      console.error('Wallet connection error:', error);
      setSelectedWalletName(null);
      setWallet({
        connected: false,
        address: null,
        network: null,
      });
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setSelectedWalletName(null);
    setWallet({
      connected: false,
      address: null,
      network: null,
    });
    localStorage.removeItem(WALLET_STORAGE_KEY);
  }, []);

  return (
    <WalletContext.Provider 
      value={{ 
        wallet, 
        installedWallets, 
        connect, 
        disconnect, 
        isConnecting,
        selectedWalletName 
      }}
    >
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
