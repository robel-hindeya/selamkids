import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full font-display font-extrabold tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'btn-3d btn-3d-yellow text-slate-900',
        yellow:
          'btn-3d btn-3d-yellow text-slate-900',
        magic:
          'btn-3d btn-3d-purple text-white',
        emerald:
          'btn-3d btn-3d-green text-white',
        coral:
          'btn-3d btn-3d-coral text-white',
        cyan:
          'btn-3d btn-3d-cyan text-white',
        amber:
          'btn-3d btn-3d-yellow text-slate-900',
        outline:
          'btn-3d btn-3d-white text-slate-800',
        secondary:
          'rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-200 font-bold active:scale-95 transition-transform',
        ghost:
          'rounded-full hover:bg-white/10 text-slate-700 hover:text-night-600 font-bold transition-colors active:scale-95',
        destructive:
          'btn-3d btn-3d-coral text-white',
        link:
          'text-night-600 underline-offset-4 hover:underline font-bold',
      },
      size: {
        default: 'h-11 px-6 py-2 text-sm',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 text-base tracking-wide',
        xl: 'h-16 px-10 text-lg tracking-wider',
        icon: 'h-11 w-11 p-0 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
