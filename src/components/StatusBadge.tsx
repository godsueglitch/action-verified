import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { AccountabilityRequest } from '@/types/accountability';

interface StatusBadgeProps {
  status: AccountabilityRequest['status'];
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (status === 'fulfilled') {
    return (
      <div className={`inline-flex items-center rounded-full bg-success/10 text-success border border-success/20 font-medium ${sizeClasses[size]}`}>
        <CheckCircle className={iconSizes[size]} />
        <span>Action Completed</span>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className={`inline-flex items-center rounded-full bg-destructive/10 text-destructive border border-destructive/20 font-medium ${sizeClasses[size]}`}>
        <XCircle className={iconSizes[size]} />
        <span>Failed Due to Absence</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center rounded-full bg-warning/10 text-warning border border-warning/20 font-medium ${sizeClasses[size]}`}>
      <Clock className={`${iconSizes[size]} status-pulse`} />
      <span>Awaiting Response</span>
    </div>
  );
}
