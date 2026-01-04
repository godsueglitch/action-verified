import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { Actor } from '@/types/accountability';
import { useWallet } from '@/context/WalletContext';

interface ActorListProps {
  actors: Actor[];
  showFullAddress?: boolean;
}

export function ActorList({ actors, showFullAddress = false }: ActorListProps) {
  const { wallet } = useWallet();

  const truncateAddress = (address: string) => {
    if (showFullAddress) return address;
    return `${address.slice(0, 12)}...${address.slice(-8)}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-3">
      {actors.map((actor, index) => {
        const isCurrentUser = wallet.address === actor.address;
        
        return (
          <div
            key={actor.address}
            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
              actor.hasApproved
                ? 'bg-success/5 border-success/20'
                : 'bg-card border-border hover:border-border/80'
            } ${isCurrentUser ? 'ring-2 ring-primary/30' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                actor.hasApproved ? 'bg-success/10' : 'bg-muted'
              }`}>
                {actor.hasApproved ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <User className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {actor.label && (
                    <span className="font-medium text-foreground">{actor.label}</span>
                  )}
                  {isCurrentUser && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                      You
                    </span>
                  )}
                </div>
                <p className="text-sm font-mono text-muted-foreground">
                  {truncateAddress(actor.address)}
                </p>
              </div>
            </div>
            <div className="text-right">
              {actor.hasApproved ? (
                <div>
                  <p className="text-sm font-medium text-success">Approved</p>
                  {actor.approvedAt && (
                    <p className="text-xs text-muted-foreground">
                      {formatDate(actor.approvedAt)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 status-pulse" />
                  <span className="text-sm">No Response</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
