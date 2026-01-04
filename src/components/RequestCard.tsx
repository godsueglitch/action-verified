import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar } from 'lucide-react';
import { AccountabilityRequest } from '@/types/accountability';
import { StatusBadge } from './StatusBadge';
import { CountdownTimer } from './CountdownTimer';

interface RequestCardProps {
  request: AccountabilityRequest;
}

export function RequestCard({ request }: RequestCardProps) {
  const approvedCount = request.actors.filter((a) => a.hasApproved).length;
  const totalActors = request.actors.length;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Link
      to={`/request/${request.id}`}
      className="block group"
    >
      <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300 card-glow hover:shadow-lg">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {request.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {request.description}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <StatusBadge status={request.status} size="sm" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            <Users className="w-3.5 h-3.5" />
            <span>{approvedCount}/{totalActors} approved</span>
          </div>
        </div>

        {request.status === 'pending' ? (
          <CountdownTimer deadline={request.deadline} />
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {request.status === 'fulfilled' ? 'Completed' : 'Expired'}: {formatDate(request.finalizedAt || request.deadline)}
            </span>
          </div>
        )}

        {request.txHash && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">TX:</span>{' '}
              <span className="font-mono">{request.txHash.slice(0, 16)}...{request.txHash.slice(-8)}</span>
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
