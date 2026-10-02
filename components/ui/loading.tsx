import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoadingSpinner({
  className,
  size = 'md',
  message,
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 p-8 text-slate-500', className)}>
      <Loader2 className={cn('animate-spin text-night-600', sizeClasses[size])} />
      {message && <p className="text-sm font-medium text-slate-600">{message}</p>}
    </div>
  );
}
