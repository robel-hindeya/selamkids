'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck, Phone, Lock, Eye, EyeOff, Loader2, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

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

export default function ForgotPasswordPage() {
  const [step, setStep] = React.useState<'PHONE' | 'OTP'>('PHONE');
  const [countryCode, setCountryCode] = React.useState('+251');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [otpCode, setOtpCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [receivedOtp, setReceivedOtp] = React.useState<string | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [countdown, setCountdown] = React.useState<number>(0);

  // Countdown timer for OTP resend
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 5) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryCode, phoneNumber: cleanPhone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to send OTP');
      }

      setReceivedOtp(data.data?.otpCode || '123456');
      setStep('OTP');
      setCountdown(45);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password -> Login Again
  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const cleanOtp = otpCode.trim();

    if (!cleanOtp || cleanOtp.length < 4) {
      setError('Please enter the verification code (OTP)');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode,
          phoneNumber: cleanPhone,
          otpCode: cleanOtp,
          password: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to verify OTP and reset password');
      }

      setSuccess(true);
      setTimeout(() => {
        const target = data.data?.redirectTo || '/users/kids';
        window.location.href = target;
      }, 1500);
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
            <ShieldCheck className="h-8 w-8 text-amber-950" />
          </div>
          <div>
            <CardTitle className="font-display font-black text-3xl tracking-wide text-white drop-shadow">
              {step === 'PHONE' ? 'Forgot Password?' : 'Enter OTP & New Password'}
            </CardTitle>
            <CardDescription className="text-purple-200 font-medium text-sm mt-1">
              {step === 'PHONE'
                ? 'Enter your phone number to receive an OTP verification code'
                : `We sent a 6-digit code to ${countryCode} ${phoneNumber}`}
            </CardDescription>
          </div>
        </CardHeader>

        {success ? (
          <CardContent className="space-y-4 px-6 sm:px-8 py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-400/50">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="font-display font-black text-2xl text-white">Password Updated!</h3>
            <p className="text-purple-200 text-sm">
              Logging you into your Selam Kids realm now...
            </p>
          </CardContent>
        ) : step === 'PHONE' ? (
          /* STEP 1: ENTER PHONE AND SEND OTP */
          <form onSubmit={handleSendOtp}>
            <CardContent className="space-y-4 px-6 sm:px-8">
              {error && (
                <div className="rounded-2xl border-2 border-rose-500/60 bg-rose-950/80 p-3.5 text-xs font-bold text-rose-200 shadow-inner">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-display font-black uppercase tracking-wider text-purple-200 mb-1.5">
                  Your Phone Number
                </label>
                <div className="flex gap-2">
                  {/* Country Code */}
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="h-12 w-[110px] rounded-2xl border-2 border-purple-700/80 bg-purple-950/70 px-2.5 text-xs font-black text-white focus:border-yellow-400 focus:outline-none cursor-pointer appearance-none text-center shrink-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.dial} className="bg-[#1b0d47] text-white">
                        {c.flag} {c.dial}
                      </option>
                    ))}
                  </select>

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
                <p className="mt-1.5 text-[11px] text-purple-300 font-medium">
                  We will send a one-time SMS verification code to your phone.
                </p>
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
                      Sending OTP...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send OTP Code
                      <ArrowRight className="h-5 w-5 text-purple-950" />
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2 pb-8 border-t border-purple-800/40 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-300 hover:text-yellow-200 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign In
              </Link>
            </CardFooter>
          </form>
        ) : (
          /* STEP 2: VERIFY OTP AND SET NEW PASSWORD -> LOGIN AGAIN */
          <form onSubmit={handleVerifyAndReset}>
            <CardContent className="space-y-4 px-6 sm:px-8">
              {error && (
                <div className="rounded-2xl border-2 border-rose-500/60 bg-rose-950/80 p-3.5 text-xs font-bold text-rose-200 shadow-inner">
                  {error}
                </div>
              )}

              {/* Simulated SMS Alert Banner */}
              {receivedOtp && (
                <div className="rounded-2xl border-2 border-amber-400/60 bg-amber-400/10 p-3 flex items-center gap-2.5 text-xs font-bold text-yellow-300">
                  <MessageSquare className="h-5 w-5 text-yellow-400 shrink-0" />
                  <div>
                    <span>SMS Sent! Your Verification Code is: </span>
                    <strong className="text-yellow-400 font-black text-sm tracking-wider underline">
                      {receivedOtp}
                    </strong>
                  </div>
                </div>
              )}

              {/* 1. OTP Code Input */}
              <div>
                <label className="block text-xs font-display font-black uppercase tracking-wider text-purple-200 mb-1.5">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="e.g. 582910"
                  className="w-full h-12 rounded-2xl border-2 border-purple-700/80 bg-purple-950/70 text-center font-display font-black text-xl tracking-widest text-yellow-300 placeholder-purple-500 focus:border-yellow-400 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* 2. New Password Input */}
              <div>
                <label className="block text-xs font-display font-black uppercase tracking-wider text-purple-200 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-purple-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              {/* Resend OTP */}
              <div className="flex items-center justify-between text-xs text-purple-300">
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="hover:text-yellow-300 underline font-medium"
                >
                  Change phone number
                </button>
                {countdown > 0 ? (
                  <span>Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-yellow-300 font-bold hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
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
                      Verifying & Logging In...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Verify OTP & Login Again
                      <ArrowRight className="h-5 w-5 text-purple-950" />
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2 pb-8 border-t border-purple-800/40 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-300 hover:text-yellow-200 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign In
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
