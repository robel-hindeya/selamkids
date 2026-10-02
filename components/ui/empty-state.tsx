import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center transition-all',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 text-night-600 mb-4">
        {icon || <BookOpen className="h-6 w-6 text-purple-600" />}
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="mt-5" size="sm" variant="default">
          {actionText}
        </Button>
      )}
    </div>
  );
}
