'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Phone, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '';

  const { login, loading, error: authError } = useAuth();
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone || !password) {
      setLocalError('Please provide both your phone number and password');
      return;
    }

    if (cleanPhone.includes('@')) {
      setLocalError('Email login is disabled. Please log in using your Phone Number.');
      return;
    }

    try {
      await login({ phoneNumber: cleanPhone, password });
      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch {
      // Error handled by hook
    }
  };

  const handleQuickDemo = (phoneVal: string, passVal: string) => {
    setPhoneNumber(phoneVal);
    setPassword(passVal);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 night-sky-bg overflow-hidden">
      {/* Starry pattern */}
      <div className="absolute inset-0 stars-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 blur-[130px] rounded-full pointer-events-none" />

      <Card className="relative w-full max-w-md shadow-2xl border-4 border-purple-500/40 bg-[#160b3d]/95 backdrop-blur-xl text-white rounded-4xl">
        <CardHeader className="text-center space-y-3 pt-8 pb-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 shadow-xl shadow-amber-400/30">
            <Phone className="h-8 w-8 text-amber-950" />
          </div>
          <div>
            <CardTitle className="font-display font-black text-3xl tracking-wide text-white drop-shadow">
              Welcome Back!
            </CardTitle>
            <CardDescription className="text-purple-200 font-medium text-sm mt-1">
              Sign in with your phone number and password
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6 sm:px-8">
            {(localError || authError) && (
              <div className="rounded-2xl border-2 border-rose-500/60 bg-rose-950/80 p-3.5 text-xs font-bold text-rose-200 shadow-inner">
                {localError || authError}
              </div>
            )}

            {/* Phone Number input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-display font-black uppercase tracking-wider text-purple-200">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-purple-400" />
                </div>
                <input
                  type="tel"
                  placeholder="e.g. +251 91 111 1111 or 0911111111"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  autoComplete="tel"
                  className="flex h-12 w-full rounded-2xl border-2 border-purple-800 bg-[#0e0626] pl-10 pr-4 text-sm text-white placeholder:text-purple-400/60 focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 font-medium transition-all"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-display font-black uppercase tracking-wider text-purple-200">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-bold text-yellow-300 hover:text-yellow-200 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-purple-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="flex h-12 w-full rounded-2xl border-2 border-purple-800 bg-[#0e0626] pl-10 pr-10 text-sm text-white placeholder:text-purple-400/60 focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-purple-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 px-6 sm:px-8 pb-8 pt-2">
            <Button
              type="submit"
              variant="yellow"
              size="lg"
              className="w-full h-14 text-base font-black shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In with Phone
                  <ArrowRight className="h-5 w-5 text-purple-950" />
                </span>
              )}
            </Button>

            <div className="text-center text-xs text-purple-300 font-medium pt-2 border-t border-purple-800/40 w-full">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="font-black text-yellow-300 hover:underline"
              >
                Register with Phone &rarr;
              </Link>
            </div>

            {/* Quick Demo Credentials for Fast Testing */}
            <div className="pt-2 w-full">
              <p className="text-[10px] font-black uppercase tracking-wider text-purple-400 text-center mb-2">
                Quick Demo Accounts (Click to Fill):
              </p>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('+251911111111', 'Password123')}
                  className="px-2 py-1.5 rounded-xl bg-purple-950/80 border border-purple-700/60 text-[11px] font-bold text-yellow-300 hover:bg-purple-800/80 transition-all cursor-pointer"
                >
                  Kid (+251 911...)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('+251922222222', 'Password123')}
                  className="px-2 py-1.5 rounded-xl bg-purple-950/80 border border-purple-700/60 text-[11px] font-bold text-pink-300 hover:bg-purple-800/80 transition-all cursor-pointer"
                >
                  Family (+251 922...)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('+251944444444', 'Password123')}
                  className="px-2 py-1.5 rounded-xl bg-purple-950/80 border border-purple-700/60 text-[11px] font-bold text-cyan-300 hover:bg-purple-800/80 transition-all cursor-pointer"
                >
                  Admin (+251 944...)
                </button>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
