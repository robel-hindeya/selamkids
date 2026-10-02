'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to update password');
      }

      router.push('/auth/login?reset=success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 night-sky-bg overflow-hidden">
      {/* Starry pattern */}
      <div className="absolute inset-0 stars-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 blur-[130px] rounded-full pointer-events-none" />

      <Card className="relative w-full max-w-md shadow-2xl border-4 border-purple-500/40 bg-[#160b3d]/95 backdrop-blur-xl text-white rounded-4xl">
        <CardHeader className="text-center space-y-3 pt-8 pb-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 shadow-xl shadow-amber-400/30">
            <Shield className="h-8 w-8 text-amber-950" />
          </div>
          <div>
            <CardTitle className="font-display font-black text-3xl tracking-wide text-white drop-shadow">
              Forge New Key
            </CardTitle>
            <CardDescription className="text-purple-200 font-medium text-sm mt-1">
              Set a strong, new password to protect your account
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6 sm:px-8">
            {error && (
              <div className="rounded-2xl border-2 border-rose-500/60 bg-rose-950/80 p-3.5 text-xs font-bold text-rose-200 shadow-inner">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-display font-black uppercase tracking-wider text-purple-200">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex h-12 w-full rounded-2xl border-2 border-purple-800 bg-[#0e0626] px-4 text-sm text-white placeholder:text-purple-400/60 focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 font-medium transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-display font-black uppercase tracking-wider text-purple-200">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="flex h-12 w-full rounded-2xl border-2 border-purple-800 bg-[#0e0626] px-4 text-sm text-white placeholder:text-purple-400/60 focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 font-medium transition-all"
              />
            </div>
          </CardContent>

          <CardFooter className="px-6 sm:px-8 pb-8 pt-2">
            <Button
              type="submit"
              variant="yellow"
              size="lg"
              className="w-full font-black text-base tracking-wide h-13 animate-pulse-glow"
              disabled={loading}
            >
              {loading ? 'Securing Vault...' : 'Save & Return to Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
