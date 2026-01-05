import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { WalletState } from '@/types/accountability';

interface InstalledWallet {
  name: string;
  icon: string;
  version: string;
  apiVersion: string;
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

// Known wallet icons as fallbacks
const WALLET_ICONS: Record<string, string> = {
  nami: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjMzQ5RUE0Ii8+PHBhdGggZD0iTTEyIDI4VjEyTDI4IDI4VjEyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==',
  eternl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjMUE0NEI4Ii8+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIvPjwvc3ZnPg==',
  flint: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjRkY2QjAwIi8+PHBhdGggZD0iTTE1IDI1VjE1SDI1TDE1IDI1WiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
  yoroi: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjMTczNTU1Ii8+PHBhdGggZD0iTTIwIDEyTDI4IDI4SDEyTDIwIDEyWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
  lace: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjN0IzRkU0Ii8+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iOCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
  gerowallet: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjMjIyIi8+PHRleHQgeD0iMjAiIHk9IjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCI+RzwvdGV4dD48L3N2Zz4=',
  typhon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjMkQzNzQ4Ii8+PHBhdGggZD0iTTIwIDEwTDMwIDMwSDEwTDIwIDEwWiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
};

// CIP-30 compliant wallet detection
function detectCIP30Wallets(): InstalledWallet[] {
  const wallets: InstalledWallet[] = [];
  
  if (typeof window === 'undefined' || !window.cardano) {
    return wallets;
  }

  const cardano = window.cardano as Record<string, {
    name?: string;
    icon?: string;
    apiVersion?: string;
    enable?: () => Promise<unknown>;
  }>;

  // Known CIP-30 wallet keys
  const knownWallets = ['nami', 'eternl', 'flint', 'yoroi', 'lace', 'gerowallet', 'typhon', 'nufi', 'begin'];
  
  for (const key of knownWallets) {
    const walletApi = cardano[key];
    if (walletApi && typeof walletApi.enable === 'function') {
      wallets.push({
        name: key,
        icon: walletApi.icon || WALLET_ICONS[key] || WALLET_ICONS.nami,
        version: '1.0.0',
        apiVersion: walletApi.apiVersion || '1.0.0',
      });
    }
  }

  return wallets;
}

// Convert hex to bech32 address (simplified)
function hexToAddress(hex: string): string {
  // For display purposes, we'll show truncated hex if conversion fails
  // Real apps should use proper bech32 encoding
  if (hex.startsWith('addr')) return hex;
  return `addr_test1${hex.slice(0, 50)}`;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    network: null,
  });
  const [installedWallets, setInstalledWallets] = useState<InstalledWallet[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWalletName, setSelectedWalletName] = useState<string | null>(null);

  // Detect installed wallets on mount
  useEffect(() => {
    const detectWallets = () => {
      // Wait for window.cardano to be available
      const checkWallets = () => {
        const detected = detectCIP30Wallets();
        setInstalledWallets(detected);
        
        // Try to restore previous connection
        const stored = localStorage.getItem(WALLET_STORAGE_KEY);
        if (stored && detected.length > 0) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.walletName && detected.find(w => w.name === parsed.walletName)) {
              // Auto-reconnect to previously connected wallet
              connect(parsed.walletName).catch(console.error);
            }
          } catch (error) {
            console.error('Failed to restore wallet connection:', error);
            localStorage.removeItem(WALLET_STORAGE_KEY);
          }
        }
      };

      // Check immediately and after a delay (wallets may inject late)
      checkWallets();
      setTimeout(checkWallets, 1000);
      setTimeout(checkWallets, 3000);
    };

    detectWallets();
  }, []);

  const connect = useCallback(async (walletName: string) => {
    setIsConnecting(true);
    
    try {
      const cardano = window.cardano as Record<string, {
        enable: () => Promise<{
          getNetworkId: () => Promise<number>;
          getUsedAddresses: () => Promise<string[]>;
          getUnusedAddresses: () => Promise<string[]>;
        }>;
      }>;

      if (!cardano || !cardano[walletName]) {
        throw new Error(`Wallet ${walletName} not found`);
      }

      // Enable the wallet (triggers user approval popup)
      const api = await cardano[walletName].enable();
      
      // Get network ID (0 = testnet, 1 = mainnet)
      const networkId = await api.getNetworkId();
      const network = networkId === 0 ? 'testnet' : 'mainnet';
      
      // Get addresses
      const usedAddresses = await api.getUsedAddresses();
      const unusedAddresses = await api.getUnusedAddresses();
      const hexAddress = usedAddresses[0] || unusedAddresses[0];
      
      if (!hexAddress) {
        throw new Error('No address found in wallet');
      }

      const address = hexToAddress(hexAddress);
      
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

// Add type declaration for window.cardano
declare global {
  interface Window {
    cardano?: Record<string, unknown>;
  }
}
