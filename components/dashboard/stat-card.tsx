import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  variant?: 'default' | 'magic' | 'emerald' | 'amber';
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = 'default',
}: StatCardProps) {
  const iconBgClasses = {
    default: 'bg-purple-100 text-purple-700 shadow-md shadow-purple-200/50',
    magic: 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-500/30',
    emerald: 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/30',
    amber: 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 shadow-md shadow-amber-400/30',
  };

  return (
    <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-200 border-2 border-slate-100 dark:border-purple-900/60 dark:bg-[#12092e] rounded-3xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-display font-black uppercase tracking-wider text-slate-500 dark:text-purple-300/80">
              {title}
            </p>
            <h4 className="mt-2 text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
              {value}
            </h4>
            {description && (
              <p className="mt-1 text-xs text-slate-500 dark:text-purple-300/70 font-medium">{description}</p>
            )}
            {trend && (
              <div className="mt-2 flex items-center gap-1 text-xs font-bold">
                <span className={trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                  {trend.positive ? '↑' : '↓'} {trend.value}
                </span>
                <span className="text-slate-400 dark:text-purple-400/70 font-normal">vs last month</span>
              </div>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-2xl transition-transform hover:scale-110',
                iconBgClasses[variant]
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
