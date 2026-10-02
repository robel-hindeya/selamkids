'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PARENT_PIN_COOKIE } from '@/backend/constants/roles';
import { ParentGateModal } from '@/components/auth/parent-gate-modal';
import { Lock, BookOpen, User } from 'lucide-react';

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  requiresPin?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  variant?: 'default' | 'lock-exit' | 'pin-protected';
}

export interface SidebarProps {
  title?: string;
  subtitle?: string;
  items: SidebarItem[];
  footer?: React.ReactNode;
}

export function Sidebar({ title, subtitle, items, footer }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [pinModalOpen, setPinModalOpen] = React.useState(false);
  const [pendingHref, setPendingHref] = React.useState<string>('/users/families');

  const handleItemClick = (e: React.MouseEvent, item: SidebarItem) => {
    if (item.onClick) {
      item.onClick(e);
      return;
    }

    if (item.requiresPin) {
      e.preventDefault();
      const isUnlocked = typeof document !== 'undefined' && document.cookie.includes(`${PARENT_PIN_COOKIE}=true`);
      if (isUnlocked) {
        router.push(item.href);
      } else {
        setPendingHref(item.href);
        setPinModalOpen(true);
      }
    }
  };

  // When in kids area (/users/kids), completely hide any parent dashboard items so kids see ONLY kids!
  const isKidsArea = pathname.startsWith('/users/kids');
  const displayTitle = isKidsArea ? undefined : title;
  const displaySubtitle = isKidsArea ? undefined : subtitle;
  const displayItems: SidebarItem[] = isKidsArea
    ? [
        { label: 'Night Zoo Magazine', href: '/users/kids', icon: <BookOpen className="h-4 w-4 text-amber-400" /> },
        { label: 'Profile', href: '/users/kids/profile', icon: <User className="h-4 w-4 text-cyan-400" /> },
      ]
    : items.filter((item) => !item.requiresPin || !pathname.startsWith('/users/kids'));

  return (
    <>
      <aside className="w-64 shrink-0 border-r-2 border-slate-200/80 bg-white dark:bg-[#0c0522] dark:border-purple-900/40 md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:self-start flex flex-col justify-between p-4 shadow-sm transition-colors md:overflow-y-auto z-30">
        <div>
          {!isKidsArea && (displayTitle || displaySubtitle) && (
            <div className="px-3 py-3 mb-3 bg-purple-50/70 dark:bg-purple-950/60 rounded-2xl border border-purple-100/80 dark:border-purple-800/60">
              {displayTitle && (
                <h2 className="text-[11px] font-display font-black uppercase tracking-wider text-purple-500 dark:text-purple-300">
                  {displayTitle}
                </h2>
              )}
              {displaySubtitle && (
                <p className="font-display text-sm font-black text-slate-900 dark:text-white truncate mt-0.5">
                  {displaySubtitle}
                </p>
              )}
            </div>
          )}

          <nav className="space-y-1.5">
            {displayItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' &&
                  item.href !== '/superadmin' &&
                  item.href !== '/users' &&
                  item.href !== '/users/kids' &&
                  item.href !== '/users/families' &&
                  pathname.startsWith(item.href));

              if (item.requiresPin || item.onClick) {
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={(e) => handleItemClick(e, item)}
                    className={cn(
                      'w-full flex items-center justify-between rounded-2xl px-3.5 py-3 text-xs transition-all group text-left cursor-pointer',
                      item.variant === 'lock-exit'
                        ? 'text-rose-600 bg-rose-50/60 hover:bg-rose-100 border border-rose-200/80 font-black dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-300'
                        : isActive
                        ? 'bg-purple-600 text-white font-black shadow-md shadow-purple-600/25 scale-[1.02]'
                        : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900 font-bold dark:text-purple-200/70 dark:hover:bg-purple-900/40 dark:hover:text-yellow-300'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive ? 'text-yellow-300' : 'text-slate-400 group-hover:text-purple-600 dark:text-purple-400 dark:group-hover:text-yellow-300'
                        )}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.requiresPin && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60 px-2 py-0.5 text-[10px] font-black dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700/60">
                        <Lock className="h-2.5 w-2.5 text-amber-700 dark:text-amber-400" />
                        <span>PIN</span>
                      </span>
                    )}

                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-black',
                          isActive
                            ? 'bg-yellow-400 text-slate-950 shadow-sm'
                            : 'bg-slate-100 text-slate-600 dark:bg-purple-900/60 dark:text-purple-200'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between rounded-2xl px-3.5 py-3 text-xs transition-all group',
                    isActive
                      ? 'bg-purple-600 text-white font-black shadow-md shadow-purple-600/25 scale-[1.02]'
                      : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900 font-bold dark:text-purple-200/70 dark:hover:bg-purple-900/40 dark:hover:text-yellow-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-yellow-300' : 'text-slate-400 group-hover:text-purple-600 dark:text-purple-400 dark:group-hover:text-yellow-300'
                      )}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-black',
                        isActive
                          ? 'bg-yellow-400 text-slate-950 shadow-sm'
                          : 'bg-slate-100 text-slate-600 dark:bg-purple-900/60 dark:text-purple-200'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {footer && <div className="border-t-2 border-slate-100 dark:border-purple-900/40 pt-4 mt-6">{footer}</div>}
      </aside>

      {pinModalOpen && (
        <ParentGateModal
          isOpen={pinModalOpen}
          onClose={() => setPinModalOpen(false)}
          onSuccess={() => {
            setPinModalOpen(false);
            router.push(pendingHref);
          }}
          redirectOnSuccess={pendingHref}
        />
      )}
    </>
  );
}
