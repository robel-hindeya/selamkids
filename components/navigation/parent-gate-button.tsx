'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Heart, Lock, ArrowRight } from 'lucide-react';
import { ParentGateModal } from '@/components/auth/parent-gate-modal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PARENT_PIN_COOKIE } from '@/backend/constants/roles';

export interface ParentGateButtonProps {
  variant?: 'navbar-desktop' | 'navbar-mobile' | 'sidebar' | 'kid-page-card' | 'badge';
  className?: string;
  label?: string;
  showIcon?: boolean;
}

export function ParentGateButton({
  variant = 'navbar-desktop',
  className,
  label = 'Parents',
  showIcon = true,
}: ParentGateButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if unlocked cookie is present
    const isUnlocked = typeof document !== 'undefined' && document.cookie.includes(`${PARENT_PIN_COOKIE}=true`);

    if (isUnlocked) {
      router.push('/users/families');
    } else {
      setModalOpen(true);
    }
  };

  const handleUnlockSuccess = () => {
    setModalOpen(false);
    router.push('/users/families');
  };

  const isCurrentActive = pathname.startsWith('/users/families');

  return (
    <>
      {variant === 'navbar-desktop' && (
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            'flex items-center gap-1.5 transition-all hover:text-yellow-300 hover:-translate-y-0.5 transform cursor-pointer text-sm font-display font-bold',
            isCurrentActive ? 'text-yellow-300 font-black' : 'text-purple-200',
            className
          )}
        >
          {showIcon && <Heart className="h-3.5 w-3.5 text-pink-400" />}
          <span>{label}</span>
          <span className="flex items-center justify-center h-4 w-4 rounded-full bg-purple-900/80 border border-purple-700/60 ml-0.5">
            <Lock className="h-2.5 w-2.5 text-yellow-400" />
          </span>
        </button>
      )}

      {variant === 'navbar-mobile' && (
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer',
            isCurrentActive ? 'text-yellow-300 font-black scale-105' : 'text-purple-300 hover:text-white',
            className
          )}
        >
          <div className="relative">
            <Heart className="h-5 w-5 mb-0.5 text-pink-400" />
            <Lock className="h-2.5 w-2.5 text-yellow-300 absolute -top-1 -right-2" />
          </div>
          <span className="text-[11px] font-display font-bold">{label}</span>
        </button>
      )}

      {variant === 'sidebar' && (
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            'w-full flex items-center justify-between rounded-2xl px-3.5 py-3 text-xs transition-all group text-left cursor-pointer',
            isCurrentActive
              ? 'bg-purple-600 text-white font-black shadow-md shadow-purple-600/25 scale-[1.02]'
              : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900 font-bold',
            className
          )}
        >
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 shrink-0 text-pink-500 group-hover:text-purple-600">
              <Heart className="h-4 w-4" />
            </span>
            <span>{label}</span>
          </div>
          <span className="rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-black flex items-center gap-1 border border-amber-300/60">
            <Lock className="h-2.5 w-2.5 text-amber-700" />
            <span>PIN</span>
          </span>
        </button>
      )}

      {variant === 'kid-page-card' && (
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            'flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-900/90 to-indigo-900/90 hover:from-purple-800 hover:to-indigo-800 text-white px-4 py-2.5 shadow-lg border-2 border-purple-500/40 hover:border-yellow-400 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer text-xs font-black',
            className
          )}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-yellow-400 text-purple-950 font-black">
            <Lock className="h-3.5 w-3.5" />
          </div>
          <div className="text-left">
            <span className="block text-[11px] uppercase tracking-wider text-yellow-300 font-black">
              Parent Gate
            </span>
            <span className="block text-xs font-bold text-purple-100">
              Parent Dashboard
            </span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 ml-1 text-purple-300" />
        </button>
      )}

      {modalOpen && (
        <ParentGateModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleUnlockSuccess}
          redirectOnSuccess="/users/families"
        />
      )}
    </>
  );
}

export function ParentLockExitButton({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  const [locking, setLocking] = React.useState(false);

  const handleLockAndExit = async () => {
    setLocking(true);
    try {
      await fetch('/api/families/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'lock' }),
      });
    } catch {
      // Continue anyway
    }
    // Delete cookie on client as well
    if (typeof document !== 'undefined') {
      document.cookie = `${PARENT_PIN_COOKIE}=; path=/; max-age=0`;
    }
    router.push('/users/kids');
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleLockAndExit}
      disabled={locking}
      className={cn(
        'font-black text-xs gap-1.5 border-rose-300 text-rose-700 bg-rose-50/80 hover:bg-rose-100 hover:text-rose-900 shadow-sm cursor-pointer',
        className
      )}
    >
      <Lock className="h-3.5 w-3.5 text-rose-600" />
      <span>{locking ? 'Locking...' : 'Exit to Kids Mode (✕)'}</span>
    </Button>
  );
}
