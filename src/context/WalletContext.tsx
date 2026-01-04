import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { BrowserWallet } from '@meshsdk/core';
import { WalletState } from '@/types/accountability';

interface InstalledWallet {
  name: string;
  icon: string;
  version: string;
}

interface WalletContextType {
  wallet: WalletState;
  browserWallet: BrowserWallet | null;
  installedWallets: InstalledWallet[];
  connect: (walletName: string) => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  selectedWalletName: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    network: null,
  });
  const [browserWallet, setBrowserWallet] = useState<BrowserWallet | null>(null);
  const [installedWallets, setInstalledWallets] = useState<InstalledWallet[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWalletName, setSelectedWalletName] = useState<string | null>(null);

  // Detect installed wallets on mount
  useEffect(() => {
    const detectWallets = async () => {
      try {
        const wallets = await BrowserWallet.getAvailableWallets();
        setInstalledWallets(wallets);
      } catch (error) {
        console.error('Error detecting wallets:', error);
        setInstalledWallets([]);
      }
    };
    detectWallets();
  }, []);

  const connect = useCallback(async (walletName: string) => {
    setIsConnecting(true);
    
    try {
      const enabledWallet = await BrowserWallet.enable(walletName);
      setBrowserWallet(enabledWallet);
      setSelectedWalletName(walletName);
      
      // Get the wallet's address
      const addresses = await enabledWallet.getUsedAddresses();
      const address = addresses[0] || (await enabledWallet.getUnusedAddresses())[0];
      
      // Get network ID (0 = testnet, 1 = mainnet)
      const networkId = await enabledWallet.getNetworkId();
      const network = networkId === 0 ? 'testnet' : 'mainnet';
      
      setWallet({
        connected: true,
        address: address || null,
        network,
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      setBrowserWallet(null);
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
    setBrowserWallet(null);
    setSelectedWalletName(null);
    setWallet({
      connected: false,
      address: null,
      network: null,
    });
  }, []);

  return (
    <WalletContext.Provider 
      value={{ 
        wallet, 
        browserWallet, 
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
