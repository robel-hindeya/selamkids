'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LogOut,
  Shield,
  Compass,
  Settings,
  Heart,
  Home,
  User as UserIcon,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Dropdown } from '@/components/ui/dropdown';
import { AuthUser } from '@/types/auth';
import { ROLES, UserRole } from '@/backend/constants/roles';
import { cn } from '@/lib/utils';
import { ParentGateButton } from '@/components/navigation/parent-gate-button';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export interface NavbarProps {
  user?: AuthUser | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case ROLES.KID:
        return 'kid';
      case ROLES.FAMILY:
        return 'family';
      case ROLES.TEACHER:
        return 'teacher';
      case ROLES.ADMIN:
        return 'admin';
      case ROLES.SUPERADMIN:
        return 'superadmin';
      default:
        return 'default';
    }
  };

  const dropdownItems = [
    {
      label: 'My Settings',
      icon: <Settings className="h-4 w-4 text-purple-600" />,
      onClick: () =>
        router.push(
          user?.role === 'SUPERADMIN'
            ? '/superadmin/settings'
            : user?.role === 'ADMIN'
            ? '/admin/settings'
            : user?.role === 'KID'
            ? '/users/kids/profile#settings'
            : '/users/settings'
        ),
    },
    {
      label: 'Sign Out',
      icon: <LogOut className="h-4 w-4 text-rose-600" />,
      variant: 'destructive' as const,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      {/* =========================================================================
          DESKTOP NAVBAR (Top Header for Large Screens >= 1024px)
          ========================================================================= */}
      <header className="hidden lg:block sticky top-0 z-50 bg-[#0f0728] border-b-2 border-purple-900/60 shadow-lg shadow-purple-950/40 relative overflow-visible">
        <div className="absolute inset-0 stars-pattern opacity-40 pointer-events-none" />
        <div className="absolute -top-12 left-1/4 w-96 h-20 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative flex h-20 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-400 p-0.5 shadow-md shadow-amber-400/20 group-hover:scale-110 transition-transform duration-200">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#160a3a]">
                <Compass className="h-6 w-6 text-yellow-300" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-2xl tracking-wide text-white drop-shadow-sm">
                  Selam<span className="text-yellow-400">Kids</span>
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-300">
                Night Zookeeper Realm
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center space-x-7 font-display font-bold text-sm tracking-wide text-purple-200">
            <Link
              href="/users/kids"
              className={cn(
                'flex items-center gap-1.5 transition-colors hover:text-yellow-300 hover:-translate-y-0.5 transform',
                pathname === '/users/kids' || pathname === '/users/kids/magazine' ? 'text-yellow-300 font-black' : ''
              )}
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-400" />
              Kids
            </Link>
            <ParentGateButton variant="navbar-desktop" />

            {user && (
              <>
                {(user.role === ROLES.KID || user.role === ROLES.FAMILY || user.role === ROLES.TEACHER) && (
                  <Link
                    href={
                      user.role === ROLES.KID || user.role === ROLES.FAMILY
                        ? '/users/kids'
                        : '/users/teachers'
                    }
                    className="flex items-center gap-1.5 text-yellow-300 font-extrabold bg-purple-900/60 px-3.5 py-1.5 rounded-full border border-purple-700/60 hover:bg-purple-800/80 transition-all shadow-inner hover:-translate-y-0.5"
                  >
                    <Compass className="h-4 w-4 text-yellow-300" />
                    My Portal
                  </Link>
                )}
                {user.role === ROLES.ADMIN && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 text-indigo-300 font-extrabold bg-indigo-950/70 px-3.5 py-1.5 rounded-full border border-indigo-700/60 hover:bg-indigo-900 transition-all hover:-translate-y-0.5"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Console
                  </Link>
                )}
                {user.role === ROLES.SUPERADMIN && (
                  <Link
                    href="/superadmin"
                    className="flex items-center gap-1.5 text-purple-200 font-extrabold bg-purple-950 px-3.5 py-1.5 rounded-full border border-purple-500/80 hover:bg-purple-900 transition-all hover:-translate-y-0.5"
                  >
                    <Shield className="h-4 w-4 text-purple-300" />
                    Root Security
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Right CTA Section */}
          <div className="flex items-center gap-3">
            <ThemeToggle variant="icon" />

            {user ? (
              <div className="flex items-center gap-3">
                <Badge variant={getRoleBadgeVariant(user.role)} className="shadow-sm">
                  {user.role}
                </Badge>

                <Dropdown
                  trigger={
                    <button className="flex items-center gap-2 rounded-full ring-2 ring-yellow-400 p-0.5 focus:outline-none hover:scale-105 transition-transform cursor-pointer">
                      <Avatar
                        fallback={user.fullName || user.email}
                        src={user.avatarUrl}
                        size="sm"
                      />
                    </button>
                  }
                  items={dropdownItems}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button
                    variant="magic"
                    size="sm"
                    className="text-xs h-10 px-5 shadow-sm"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href="/auth/register">
                  <Button
                    variant="yellow"
                    size="default"
                    className="animate-pulse-glow text-xs sm:text-sm font-black tracking-wide"
                  >
                    Start 7 Day Trial
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          RESPONSIVE PHONE & TABLET TOP BAR (< 1024px)
          ========================================================================= */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0f0728] border-b-2 border-purple-900/60 px-4 sm:px-6 h-14 flex items-center justify-between shadow-md">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-purple-900/80 border border-purple-700/60 flex items-center justify-center">
            <Compass className="h-4 w-4 text-yellow-300" />
          </div>
          <span className="font-display font-black text-lg text-white">
            Selam<span className="text-yellow-400">Kids</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle variant="compact" />
          {user ? (
            <Dropdown
              trigger={
                <button className="rounded-full ring-2 ring-yellow-400 p-0.5 focus:outline-none cursor-pointer">
                  <Avatar
                    fallback={user.fullName || user.email}
                    src={user.avatarUrl}
                    size="sm"
                  />
                </button>
              }
              items={dropdownItems}
            />
          ) : (
            <Link href="/auth/login">
              <Button variant="magic" size="sm" className="h-8 px-3.5 text-xs font-black">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* =========================================================================
          RESPONSIVE PHONE & TABLET BOTTOM NAVBAR ("under" navigation < 1024px)
          (Removed "more", "trial", "how it works")
          ========================================================================= */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0f0728]/95 backdrop-blur-xl border-t-2 border-purple-900/70 shadow-2xl px-4 py-1.5 h-16 flex items-center justify-around">
        {/* 1. Home */}
        <Link
          href="/"
          className={cn(
            'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all',
            pathname === '/' ? 'text-yellow-300 font-black scale-105' : 'text-purple-300 hover:text-white'
          )}
        >
          <Home className="h-5 w-5 mb-0.5" />
          <span className="text-[11px] font-display font-bold">Home</span>
        </Link>

        {/* 2. Kids */}
        <Link
          href="/users/kids"
          className={cn(
            'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all',
            pathname === '/users/kids' || pathname === '/users/kids/magazine'
              ? 'text-yellow-300 font-black scale-105'
              : 'text-purple-300 hover:text-white'
          )}
        >
          <BookOpen className="h-5 w-5 mb-0.5" />
          <span className="text-[11px] font-display font-bold">Kids</span>
        </Link>

        {/* 3. Parents (PIN protected) */}
        <ParentGateButton variant="navbar-mobile" />

        {/* 4. Portal (if signed in) or Sign In (if signed out) */}
        {user ? (
          <Link
            href={
              user.role === ROLES.SUPERADMIN
                ? '/superadmin'
                : user.role === ROLES.ADMIN
                ? '/admin'
                : user.role === ROLES.KID || user.role === ROLES.FAMILY
                ? '/users/kids'
                : '/users/teachers'
            }
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-yellow-300 font-black"
          >
            <Compass className="h-5 w-5 mb-0.5" />
            <span className="text-[11px] font-display font-bold">Portal</span>
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-purple-300 hover:text-white"
          >
            <UserIcon className="h-5 w-5 mb-0.5" />
            <span className="text-[11px] font-display font-bold">Sign In</span>
          </Link>
        )}
      </nav>
    </>
  );
}
