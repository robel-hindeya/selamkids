import * as React from 'react';
import { cookies } from 'next/headers';
import { PARENT_PIN_COOKIE } from '@/backend/constants/roles';
import { ParentGateModal } from '@/components/auth/parent-gate-modal';
import { ParentLockExitButton } from '@/components/navigation/parent-gate-button';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default async function FamiliesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isUnlocked = cookieStore.get(PARENT_PIN_COOKIE)?.value === 'true';

  if (!isUnlocked) {
    // If not unlocked, render the full Parent Gate inline lock screen
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-4">
        {/* Friendly banner for kids */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-900/90 to-indigo-950 p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-400 text-purple-950 flex items-center justify-center font-black">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-display font-black text-sm text-yellow-300">
                Night Zoo Kids Realm
              </h4>
              <p className="text-xs text-purple-200">
                Stories, creature training & magazines are in the Kids section!
              </p>
            </div>
          </div>
          <Link
            href="/users/kids"
            className="shrink-0 flex items-center gap-2 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-purple-950 px-4 py-2 text-xs font-black transition-all shadow-md active:scale-95"
          >
            <BookOpen className="h-4 w-4" />
            <span>Go to Kids Portal</span>
          </Link>
        </div>

        {/* The 4-digit PIN Gate Card */}
        <ParentGateModal isInline={true} />
      </div>
    );
  }

  // Parent Dashboard is unlocked!
  return (
    <div className="space-y-6">
      {/* Top Parent Controls Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-[#180a3a] to-purple-900 border-2 border-purple-800/80 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md text-white">
        <div className="flex items-center gap-2.5">
          <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
          <span className="text-xs font-display font-black text-white flex items-center gap-1.5">
            <span>Parent Zone Active</span>
            <span className="text-emerald-400 text-[10px] uppercase tracking-wider font-extrabold bg-emerald-950/80 border border-emerald-500/50 px-2 py-0.5 rounded-full">
              Unlocked
            </span>
          </span>
          <span className="hidden md:inline text-[11px] text-purple-300">
            • Only visible to guardians
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/users/kids"
            className="text-xs font-bold text-yellow-300 hover:underline flex items-center gap-1 px-2.5 py-1"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>View Kids Page</span>
          </Link>
          <ParentLockExitButton />
        </div>
      </div>

      {children}
    </div>
  );
}
