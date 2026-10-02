import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-display font-black tracking-wide transition-all shadow-sm',
  {
    variants: {
      variant: {
        default: 'bg-purple-100 text-purple-900 border-2 border-purple-300',
        secondary: 'bg-slate-100 text-slate-700 border-2 border-slate-300',
        success: 'bg-emerald-100 text-emerald-900 border-2 border-emerald-300',
        emerald: 'bg-emerald-100 text-emerald-900 border-2 border-emerald-300',
        warning: 'bg-amber-100 text-amber-900 border-2 border-amber-300',
        amber: 'bg-amber-100 text-amber-900 border-2 border-amber-300',
        cyan: 'bg-cyan-100 text-cyan-900 border-2 border-cyan-300',
        destructive: 'bg-rose-100 text-rose-900 border-2 border-rose-300',
        magic:
          'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-2 border-purple-400 shadow-purple-500/30',
        kid: 'bg-pink-100 text-pink-900 border-2 border-pink-300',
        family: 'bg-cyan-100 text-cyan-900 border-2 border-cyan-300',
        teacher: 'bg-emerald-100 text-emerald-900 border-2 border-emerald-300',
        admin: 'bg-indigo-100 text-indigo-900 border-2 border-indigo-300',
        superadmin: 'bg-[#160a3a] text-amber-300 border-2 border-amber-400 font-extrabold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
