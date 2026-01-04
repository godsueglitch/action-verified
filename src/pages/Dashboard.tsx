import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Radio, AlertCircle, PlayCircle } from 'lucide-react';
import { useAccountability } from '@/context/AccountabilityContext';
import { useWallet } from '@/context/WalletContext';
import { RequestCard } from '@/components/RequestCard';

export default function Dashboard() {
  const { requests, loadDemoScenario } = useAccountability();
  const { wallet, connect, isConnecting } = useWallet();

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const completedRequests = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Accountability Dashboard</h1>
            <p className="text-muted-foreground">
              Track and manage accountability requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            {requests.length === 0 && (
              <Button variant="outline" onClick={loadDemoScenario}>
                <PlayCircle className="w-4 h-4" />
                Load Demo
              </Button>
            )}
            <Button variant="hero" asChild>
              <Link to="/create">
                <Plus className="w-4 h-4" />
                New Request
              </Link>
            </Button>
          </div>
        </div>

        {/* Wallet Warning */}
        {!wallet.connected && (
          <div className="mb-8 p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-warning mb-1">Read-Only Mode</p>
              <p className="text-sm text-muted-foreground mb-3">
                Connect your Cardano testnet wallet to create requests and submit approvals.
              </p>
              <Button variant="wallet" size="sm" onClick={connect} disabled={isConnecting}>
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Radio className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Accountability Requests</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first accountability request or load a demo scenario to see how Proof of Absence works.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={loadDemoScenario}>
                <PlayCircle className="w-4 h-4" />
                Load Demo Scenario
              </Button>
              <Button variant="hero" asChild>
                <Link to="/create">
                  <Plus className="w-4 h-4" />
                  Create Request
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-warning status-pulse" />
              <h2 className="text-xl font-semibold">Awaiting Response</h2>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-warning/10 text-warning border border-warning/20">
                {pendingRequests.length}
              </span>
            </div>
            <div className="grid gap-4">
              {pendingRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Requests */}
        {completedRequests.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-semibold">Finalized Records</h2>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                {completedRequests.length}
              </span>
            </div>
            <div className="grid gap-4">
              {completedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
