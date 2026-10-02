'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Phone, User, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

interface CountryCodeItem {
  code: string;
  name: string;
  flag: string;
  dial: string;
}

const COUNTRY_CODES: CountryCodeItem[] = [
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dial: '+251' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dial: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dial: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dial: '+1' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dial: '+971' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dial: '+966' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dial: '+254' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷', dial: '+291' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', dial: '+253' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴', dial: '+252' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', dial: '+249' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', dial: '+256' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dial: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dial: '+33' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dial: '+39' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dial: '+46' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dial: '+47' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dial: '+61' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dial: '+91' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dial: '+27' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dial: '+20' },
];

export default function RegisterPage() {
  const { register, loading, error: authError } = useAuth();

  const [countryCode, setCountryCode] = React.useState('+251');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const [registeredSuccess, setRegisteredSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const cleanUser = username.trim();

    if (!cleanPhone) {
      setLocalError('Please enter your phone number');
      return;
    }

    if (cleanPhone.length < 5) {
      setLocalError('Please enter a valid phone number');
      return;
    }

    if (!cleanUser || cleanUser.length < 2) {
      setLocalError('Username must be at least 2 characters');
      return;
    }

    if (!password || password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register({
        countryCode,
        phoneNumber: cleanPhone,
        username: cleanUser,
        password,
      });
      setRegisteredSuccess(true);
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 night-sky-bg overflow-hidden">
      {/* Starry pattern and ambient floating glow */}
      <div className="absolute inset-0 stars-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none" />

      <Card className="relative w-full max-w-md shadow-2xl border-4 border-purple-500/40 bg-[#160b3d]/95 backdrop-blur-xl text-white rounded-4xl my-6">
        <CardHeader className="text-center space-y-3 pt-8 pb-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-yellow-400 via-amber-300 to-orange-400 text-slate-900 shadow-xl shadow-amber-400/30">
            <Compass className="h-8 w-8 text-amber-950 animate-pulse" />
          </div>
          <div>
            <CardTitle className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white drop-shadow">
              Create Account
            </CardTitle>
            <CardDescription className="text-purple-200 font-medium text-sm mt-1">
              Join Selam Kids with your phone & username
            </CardDescription>
          </div>
        </CardHeader>

        {registeredSuccess ? (
          <CardContent className="space-y-4 px-6 sm:px-8 py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-400/50">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="font-display font-black text-2xl text-white">Account Created!</h3>
            <p className="text-purple-200 text-sm">
              Welcome to Selam Kids, <strong className="text-yellow-300">{username}</strong>! Redirecting you to your adventure...
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-6 sm:px-8">
              {(localError || authError) && (
                <div className="rounded-2xl border-2 border-rose-500/60 bg-rose-950/80 p-3.5 text-xs font-bold text-rose-200 shadow-inner">
                  {localError || authError}
                </div>
              )}

              {/* 1. Country Code and Phone Number */}
              <div>
                <label className="block text-xs font-display font-black uppercase tracking-wider text-purple-200 mb-1.5">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  {/* Country Code Dropdown */}
                  <div className="relative shrink-0">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-12 w-[110px] rounded-2xl border-2 border-purple-700/80 bg-purple-950/70 px-2.5 text-xs font-black text-white focus:border-yellow-400 focus:outline-none cursor-pointer appearance-none text-center"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.dial} className="bg-[#1b0d47] text-white">
                          {c.flag} {c.dial}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phone input */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-purple-400" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="912 345 678"
                      className="w-full h-12 pl-10 pr-3.5 rounded-2xl border-2 border-purple-700/80 bg-purple-950/70 text-sm font-semibold text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-purple-300 font-medium">
                  Select your country code and enter your mobile number.
                </p>
              </div>

              {/* 2. Username */}
              <div>
                <label className="block text-xs font-display font-black uppercase tracking-wider text-purple-200 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-purple-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username (e.g. leo_star)"
                    className="w-full h-12 pl-10 pr-3.5 rounded-2xl border-2 border-purple-700/80 bg-purple-950/70 text-sm font-semibold text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* 3. Password */}
              <div>
                <label className="block text-xs font-display font-black uppercase tracking-wider text-purple-200 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-purple-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full h-12 pl-10 pr-10 rounded-2xl border-2 border-purple-700/80 bg-purple-950/70 text-sm font-semibold text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none transition-colors"
                    required
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

              <div className="pt-2">
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
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Register Now
                      <ArrowRight className="h-5 w-5 text-purple-950" />
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2 pb-8 border-t border-purple-800/40 text-center">
              <div className="text-xs text-purple-300 font-medium">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="font-black text-yellow-300 hover:underline transition-all"
                >
                  Sign In &rarr;
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
