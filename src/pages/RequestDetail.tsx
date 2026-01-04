import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ExternalLink, 
  Share2, 
  Copy, 
  CheckCircle, 
  Loader2,
  AlertCircle,
  Calendar,
  Users,
  FileText
} from 'lucide-react';
import { useAccountability } from '@/context/AccountabilityContext';
import { useWallet } from '@/context/WalletContext';
import { StatusBadge } from '@/components/StatusBadge';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ActorList } from '@/components/ActorList';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const { getRequest, approveRequest, isLoading } = useAccountability();
  const { wallet, connect, isConnecting } = useWallet();
  const [isApproving, setIsApproving] = useState(false);

  const request = getRequest(id || '');

  if (!request) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Request Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This accountability request doesn't exist or has been removed.
          </p>
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const approvedCount = request.actors.filter((a) => a.hasApproved).length;
  const currentUserActor = request.actors.find((a) => a.address === wallet.address);
  const canApprove = wallet.connected && 
    currentUserActor && 
    !currentUserActor.hasApproved && 
    request.status === 'pending';

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleApprove = async () => {
    if (!wallet.address) return;
    
    setIsApproving(true);
    try {
      await approveRequest(request.id, wallet.address);
      toast.success('Approval recorded on blockchain');
    } catch (err) {
      toast.error('Failed to submit approval');
    }
    setIsApproving(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: request.title,
        text: `Proof of Absence: ${request.title}`,
        url: window.location.href,
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/dashboard">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <StatusBadge status={request.status} size="lg" />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3">{request.title}</h1>
          <p className="text-lg text-muted-foreground">{request.description}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Approvals</span>
            </div>
            <p className="text-2xl font-bold">
              {approvedCount}
              <span className="text-lg text-muted-foreground">/{request.actors.length}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {request.minimumApprovals} required
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Created</span>
            </div>
            <p className="text-sm font-medium">{formatDate(request.createdAt)}</p>
          </div>
          
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Request ID</span>
            </div>
            <p className="text-sm font-mono truncate">{request.id}</p>
          </div>
        </div>

        {/* Countdown or Finalized */}
        <div className="mb-8">
          {request.status === 'pending' ? (
            <div className="p-6 rounded-xl bg-card border border-border">
              <h2 className="text-lg font-semibold mb-4">Time Remaining</h2>
              <CountdownTimer deadline={request.deadline} />
              <p className="text-sm text-muted-foreground mt-4">
                Deadline: {formatDate(request.deadline)}
              </p>
            </div>
          ) : (
            <div className={`p-6 rounded-xl border ${
              request.status === 'fulfilled' 
                ? 'bg-success/5 border-success/20' 
                : 'bg-destructive/5 border-destructive/20'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {request.status === 'fulfilled' ? (
                  <CheckCircle className="w-6 h-6 text-success" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-destructive" />
                )}
                <h2 className="text-xl font-bold">
                  {request.status === 'fulfilled' ? 'Action Completed' : 'Failed Due to Absence'}
                </h2>
              </div>
              <p className="text-muted-foreground mb-4">
                {request.status === 'fulfilled' 
                  ? 'All required approvals were received before the deadline.'
                  : `Only ${approvedCount} of ${request.minimumApprovals} required approvals were received before the deadline expired.`
                }
              </p>
              {request.finalizedAt && (
                <p className="text-sm text-muted-foreground">
                  Finalized: {formatDate(request.finalizedAt)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actors */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Required Actors</h2>
          <ActorList actors={request.actors} />
        </div>

        {/* Approval Action */}
        {request.status === 'pending' && (
          <div className="mb-8 p-6 rounded-xl bg-card border border-border">
            <h2 className="text-lg font-semibold mb-4">Your Action</h2>
            {!wallet.connected ? (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-warning mb-2">Wallet Required</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your Cardano testnet wallet to submit your approval.
                  </p>
                  <Button variant="wallet" onClick={connect} disabled={isConnecting}>
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </Button>
                </div>
              </div>
            ) : canApprove ? (
              <div>
                <p className="text-muted-foreground mb-4">
                  You are listed as a required actor. Submit your approval before the deadline.
                </p>
                <Button 
                  variant="success" 
                  size="lg" 
                  onClick={handleApprove}
                  disabled={isApproving || isLoading}
                >
                  {isApproving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Recording Approval...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Submit Approval
                    </>
                  )}
                </Button>
              </div>
            ) : currentUserActor?.hasApproved ? (
              <div className="flex items-center gap-3 text-success">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">You have already approved this request.</span>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Your wallet is not listed as a required actor for this request.
              </p>
            )}
          </div>
        )}

        {/* Transaction Hash */}
        {request.txHash && (
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="text-lg font-semibold mb-4">Blockchain Record</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
                <p className="font-mono text-sm break-all">{request.txHash}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a 
                  href={`https://preview.cardanoscan.io/transaction/${request.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Cardanoscan (Testnet)
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
