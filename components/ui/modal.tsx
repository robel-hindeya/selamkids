'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full overflow-hidden rounded-2xl bg-white dark:bg-[#12092e] dark:border-2 dark:border-purple-800/80 shadow-2xl transition-all',
          widthClasses[maxWidth]
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-900/60 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
            {description && <p className="text-xs text-slate-500 dark:text-purple-300/70">{description}</p>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:text-purple-300 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5 text-slate-900 dark:text-slate-100">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-purple-900/60 bg-slate-50/50 dark:bg-purple-950/40 px-6 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
