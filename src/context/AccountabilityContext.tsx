import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { AccountabilityRequest, Actor, DEMO_ADDRESSES, DEMO_USER_ADDRESS } from '@/types/accountability';

interface AccountabilityContextType {
  requests: AccountabilityRequest[];
  createRequest: (request: Omit<AccountabilityRequest, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  approveRequest: (requestId: string, actorAddress: string) => Promise<void>;
  getRequest: (id: string) => AccountabilityRequest | undefined;
  loadDemoScenario: () => void;
  isLoading: boolean;
}

const AccountabilityContext = createContext<AccountabilityContextType | undefined>(undefined);

function generateId(): string {
  return 'poa_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateTxHash(): string {
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function AccountabilityProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<AccountabilityRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check for expired requests and update their status
  useEffect(() => {
    const interval = setInterval(() => {
      setRequests((prev) =>
        prev.map((req) => {
          if (req.status === 'pending' && new Date() > req.deadline) {
            const approvalCount = req.actors.filter((a) => a.hasApproved).length;
            const newStatus = approvalCount >= req.minimumApprovals ? 'fulfilled' : 'failed';
            return {
              ...req,
              status: newStatus,
              finalizedAt: new Date(),
              txHash: generateTxHash(),
            };
          }
          return req;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const createRequest = useCallback(
    async (request: Omit<AccountabilityRequest, 'id' | 'createdAt' | 'status'>): Promise<string> => {
      setIsLoading(true);
      
      // Simulate blockchain transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const id = generateId();
      const newRequest: AccountabilityRequest = {
        ...request,
        id,
        createdAt: new Date(),
        status: 'pending',
      };
      
      setRequests((prev) => [...prev, newRequest]);
      setIsLoading(false);
      
      return id;
    },
    []
  );

  const approveRequest = useCallback(
    async (requestId: string, actorAddress: string): Promise<void> => {
      setIsLoading(true);
      
      // Simulate blockchain transaction delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setRequests((prev) =>
        prev.map((req) => {
          if (req.id === requestId && req.status === 'pending') {
            const updatedActors = req.actors.map((actor) =>
              actor.address === actorAddress
                ? { ...actor, hasApproved: true, approvedAt: new Date() }
                : actor
            );
            
            const approvalCount = updatedActors.filter((a) => a.hasApproved).length;
            const allApproved = approvalCount >= req.minimumApprovals;
            
            return {
              ...req,
              actors: updatedActors,
              status: allApproved ? 'fulfilled' : 'pending',
              txHash: allApproved ? generateTxHash() : req.txHash,
              finalizedAt: allApproved ? new Date() : req.finalizedAt,
            };
          }
          return req;
        })
      );
      
      setIsLoading(false);
    },
    []
  );

  const getRequest = useCallback(
    (id: string): AccountabilityRequest | undefined => {
      return requests.find((req) => req.id === id);
    },
    [requests]
  );

  const loadDemoScenario = useCallback(() => {
    const now = new Date();
    
    // Demo request 1: Pending with partial approval (deadline in 2 minutes)
    const demoRequest1: AccountabilityRequest = {
      id: 'poa_demo_pending',
      title: 'Approve Youth Development Fund Disbursement',
      description: 'Emergency allocation of $15,000 for community youth center renovation. Requires approval from all 3 treasury signatories before funds can be released.',
      actors: [
        { address: DEMO_ADDRESSES[0], label: 'Treasury Lead', hasApproved: true, approvedAt: new Date(now.getTime() - 3600000) },
        { address: DEMO_ADDRESSES[1], label: 'Finance Officer', hasApproved: false },
        { address: DEMO_USER_ADDRESS, label: 'Board Member (You)', hasApproved: false },
      ],
      deadline: new Date(now.getTime() + 120000), // 2 minutes from now
      minimumApprovals: 3,
      createdAt: new Date(now.getTime() - 86400000), // 1 day ago
      createdBy: DEMO_ADDRESSES[0],
      status: 'pending',
    };

    // Demo request 2: Failed due to absence
    const demoRequest2: AccountabilityRequest = {
      id: 'poa_demo_failed',
      title: 'Ratify Q3 Financial Audit Report',
      description: 'Annual audit requires sign-off from compliance committee. Deadline was missed due to absent signatories.',
      actors: [
        { address: DEMO_ADDRESSES[0], label: 'Compliance Chair', hasApproved: true, approvedAt: new Date(now.getTime() - 172800000) },
        { address: DEMO_ADDRESSES[1], label: 'External Auditor', hasApproved: false },
        { address: DEMO_ADDRESSES[2], label: 'Board Secretary', hasApproved: false },
      ],
      deadline: new Date(now.getTime() - 3600000), // 1 hour ago (expired)
      minimumApprovals: 3,
      createdAt: new Date(now.getTime() - 604800000), // 7 days ago
      createdBy: DEMO_ADDRESSES[0],
      status: 'failed',
      txHash: generateTxHash(),
      finalizedAt: new Date(now.getTime() - 3600000),
    };

    // Demo request 3: Fulfilled
    const demoRequest3: AccountabilityRequest = {
      id: 'poa_demo_fulfilled',
      title: 'Approve Community Garden Expansion',
      description: 'All required stakeholders approved the allocation of city land for community garden expansion project.',
      actors: [
        { address: DEMO_ADDRESSES[0], label: 'City Council Rep', hasApproved: true, approvedAt: new Date(now.getTime() - 259200000) },
        { address: DEMO_ADDRESSES[1], label: 'Parks Director', hasApproved: true, approvedAt: new Date(now.getTime() - 172800000) },
        { address: DEMO_ADDRESSES[2], label: 'Community Lead', hasApproved: true, approvedAt: new Date(now.getTime() - 86400000) },
      ],
      deadline: new Date(now.getTime() - 43200000), // 12 hours ago
      minimumApprovals: 2,
      createdAt: new Date(now.getTime() - 604800000),
      createdBy: DEMO_ADDRESSES[2],
      status: 'fulfilled',
      txHash: generateTxHash(),
      finalizedAt: new Date(now.getTime() - 86400000),
    };

    setRequests([demoRequest1, demoRequest2, demoRequest3]);
  }, []);

  return (
    <AccountabilityContext.Provider
      value={{ requests, createRequest, approveRequest, getRequest, loadDemoScenario, isLoading }}
    >
      {children}
    </AccountabilityContext.Provider>
  );
}

export function useAccountability() {
  const context = useContext(AccountabilityContext);
  if (context === undefined) {
    throw new Error('useAccountability must be used within an AccountabilityProvider');
  }
  return context;
}
