import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownTimerProps {
  deadline: Date;
  onExpire?: () => void;
}

export function CountdownTimer({ deadline, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = deadline.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        onExpire?.();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [deadline, onExpire]);

  const isUrgent = !timeLeft.expired && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 10;

  if (timeLeft.expired) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <span className="text-sm font-medium text-destructive">Deadline Passed</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${isUrgent ? 'bg-warning/10 border-warning/20' : 'bg-muted/50 border-border'}`}>
      <Clock className={`w-4 h-4 ${isUrgent ? 'text-warning countdown-urgent' : 'text-muted-foreground'}`} />
      <div className="flex items-center gap-2">
        {timeLeft.days > 0 && (
          <div className="text-center">
            <span className={`font-mono text-lg font-semibold ${isUrgent ? 'text-warning' : 'text-foreground'}`}>
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-xs text-muted-foreground ml-1">d</span>
          </div>
        )}
        <div className="text-center">
          <span className={`font-mono text-lg font-semibold ${isUrgent ? 'text-warning' : 'text-foreground'}`}>
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-xs text-muted-foreground ml-1">h</span>
        </div>
        <span className={`text-lg ${isUrgent ? 'text-warning' : 'text-muted-foreground'}`}>:</span>
        <div className="text-center">
          <span className={`font-mono text-lg font-semibold ${isUrgent ? 'text-warning' : 'text-foreground'}`}>
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-xs text-muted-foreground ml-1">m</span>
        </div>
        <span className={`text-lg ${isUrgent ? 'text-warning' : 'text-muted-foreground'}`}>:</span>
        <div className="text-center">
          <span className={`font-mono text-lg font-semibold ${isUrgent ? 'text-warning countdown-urgent' : 'text-foreground'}`}>
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-xs text-muted-foreground ml-1">s</span>
        </div>
      </div>
    </div>
  );
}
