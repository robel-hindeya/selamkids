'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Delete,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowLeft,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ParentGateModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  isInline?: boolean; // When true, rendered as full-page lock card instead of modal overlay
  title?: string;
  description?: string;
  redirectOnSuccess?: string; // e.g. '/users/families'
}

export function ParentGateModal({
  isOpen = true,
  onClose,
  onSuccess,
  isInline = false,
  title,
  description,
  redirectOnSuccess = '/users/families',
}: ParentGateModalProps) {
  const router = useRouter();

  // PIN state
  const [pin, setPin] = React.useState<string>('');
  const [confirmPin, setConfirmPin] = React.useState<string>('');
  const [step, setStep] = React.useState<'verify' | 'setup_first' | 'setup_confirm'>('verify');
  const [_hasPinConfigured, setHasPinConfigured] = React.useState<boolean | null>(null);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [shake, setShake] = React.useState<boolean>(false);
  const [showDigits, setShowDigits] = React.useState<boolean>(false);

  // Check pin status on mount
  React.useEffect(() => {
    let isMounted = true;
    async function checkPinStatus() {
      try {
        const res = await fetch('/api/families/pin');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            const hasPin = Boolean(data.data?.hasPin);
            setHasPinConfigured(hasPin);
            if (!hasPin) {
              setStep('setup_first');
            } else {
              setStep('verify');
            }
          }
        }
      } catch {
        // Fallback: assume hasPin is false if network error, allowing setup
        if (isMounted) {
          setHasPinConfigured(false);
          setStep('setup_first');
        }
      }
    }

    if (isOpen || isInline) {
      checkPinStatus();
      setPin('');
      setConfirmPin('');
      setError(null);
      setSuccessMsg(null);
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, isInline]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  // Handle digit press
  const handleDigitPress = (digit: string) => {
    if (loading || successMsg) return;
    setError(null);

    if (step === 'setup_confirm') {
      if (confirmPin.length < 4) {
        const nextConfirm = confirmPin + digit;
        setConfirmPin(nextConfirm);
        if (nextConfirm.length === 4) {
          handleSetupSubmit(pin, nextConfirm);
        }
      }
    } else {
      if (pin.length < 4) {
        const nextPin = pin + digit;
        setPin(nextPin);
        if (nextPin.length === 4) {
          if (step === 'setup_first') {
            // Advance to confirmation step
            setTimeout(() => {
              setStep('setup_confirm');
              setConfirmPin('');
            }, 150);
          } else {
            handleVerifySubmit(nextPin);
          }
        }
      }
    }
  };

  // Handle backspace
  const handleBackspace = () => {
    if (loading || successMsg) return;
    setError(null);
    if (step === 'setup_confirm') {
      setConfirmPin((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  // Handle clear
  const handleClear = () => {
    if (loading || successMsg) return;
    setError(null);
    if (step === 'setup_confirm') {
      setConfirmPin('');
    } else {
      setPin('');
    }
  };

  // Submit verification to API
  const handleVerifySubmit = async (pinToVerify: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/families/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', pin: pinToVerify }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        triggerShake();
        setError(data.error?.message || 'Incorrect 4-digit PIN. Please try again.');
        setPin('');
        setLoading(false);
        return;
      }

      setSuccessMsg('PIN Verified! Unlocking Parent Hub...');
      setLoading(false);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else if (redirectOnSuccess) {
          router.push(redirectOnSuccess);
          router.refresh();
        }
        if (onClose) onClose();
      }, 500);
    } catch {
      triggerShake();
      setError('Connection error. Please try again.');
      setPin('');
      setLoading(false);
    }
  };

  // Submit new setup PIN to API
  const handleSetupSubmit = async (pinValue: string, confirmValue: string) => {
    if (pinValue !== confirmValue) {
      triggerShake();
      setError('PINs do not match. Please re-enter your 4-digit PIN.');
      setStep('setup_first');
      setPin('');
      setConfirmPin('');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/families/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set', pin: pinValue }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        triggerShake();
        setError(data.error?.message || 'Failed to save PIN.');
        setLoading(false);
        return;
      }

      setSuccessMsg('4-Digit Parent PIN Created & Unlocked!');
      setLoading(false);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else if (redirectOnSuccess) {
          router.push(redirectOnSuccess);
          router.refresh();
        }
        if (onClose) onClose();
      }, 500);
    } catch {
      triggerShake();
      setError('Failed to save PIN. Please try again.');
      setLoading(false);
    }
  };

  // Physical keyboard listeners
  React.useEffect(() => {
    if (!isOpen && !isInline) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Numbers 0-9
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' && onClose && !isInline) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!isOpen && !isInline) return null;

  const currentDisplayPin = step === 'setup_confirm' ? confirmPin : pin;

  const content = (
    <div
      className={cn(
        'relative w-full max-w-md mx-auto rounded-3xl bg-[#140a33] border-2 border-purple-500/40 p-6 sm:p-8 text-white shadow-2xl overflow-hidden backdrop-blur-xl',
        shake && 'animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]'
      )}
    >
      {/* Decorative stars and nebula glow */}
      <div className="absolute inset-0 stars-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />

      {/* Close/Exit to Kids Button */}
      <div className="relative flex items-center justify-between pb-3 border-b border-purple-900/60 mb-5">
        <button
          type="button"
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              router.push('/users/kids');
            }
          }}
          className="flex items-center gap-1.5 text-xs font-black text-purple-300 hover:text-yellow-300 transition-colors bg-purple-900/40 px-3 py-1.5 rounded-full border border-purple-800/60"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kids Area</span>
        </button>

        <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-amber-400" />
          Parental Gate
        </span>

        {onClose && !isInline && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-purple-400 hover:text-white hover:bg-purple-800/50 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Icon & Title Header */}
      <div className="relative text-center space-y-2 mb-6">
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-400 p-0.5 shadow-xl shadow-purple-950/60">
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#160a3a]">
            {successMsg ? (
              <Unlock className="h-8 w-8 text-emerald-400 animate-bounce" />
            ) : step === 'setup_first' || step === 'setup_confirm' ? (
              <KeyRound className="h-8 w-8 text-yellow-300" />
            ) : (
              <Lock className="h-8 w-8 text-yellow-300" />
            )}
          </div>
        </div>

        <div>
          <h3 className="font-display font-black text-2xl tracking-wide text-white">
            {title ||
              (step === 'setup_first'
                ? 'Create Parent 4-Digit PIN'
                : step === 'setup_confirm'
                ? 'Confirm Your 4-Digit PIN'
                : 'Enter Parent 4-Digit PIN')}
          </h3>
          <p className="text-xs text-purple-200/90 font-medium max-w-xs mx-auto mt-1 leading-relaxed">
            {description ||
              (step === 'setup_first'
                ? 'Add a 4-digit password so only parents can access family reports and settings.'
                : step === 'setup_confirm'
                ? 'Re-enter your 4 digits to confirm.'
                : 'Enter your 4-digit parent passcode to access the Parent Dashboard.')}
          </p>
        </div>
      </div>

      {/* Visual 4-Digit Boxes */}
      <div className="relative flex justify-center items-center gap-3.5 my-6">
        {[0, 1, 2, 3].map((index) => {
          const isFilled = currentDisplayPin.length > index;
          const isCurrent = currentDisplayPin.length === index;
          const digitChar = isFilled ? currentDisplayPin[index] : '';

          return (
            <div
              key={index}
              className={cn(
                'flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border-2 text-2xl font-display font-black transition-all duration-200 select-none shadow-inner',
                isFilled
                  ? 'border-yellow-400 bg-purple-950/90 text-yellow-300 shadow-md shadow-yellow-400/20 scale-105'
                  : isCurrent
                  ? 'border-purple-400 bg-purple-900/60 ring-4 ring-purple-400/20 animate-pulse text-transparent'
                  : 'border-purple-800/80 bg-[#0e0626] text-purple-600'
              )}
            >
              {isFilled ? (
                showDigits ? (
                  digitChar
                ) : (
                  <span className="block h-3.5 w-3.5 rounded-full bg-yellow-400 shadow-sm" />
                )
              ) : isCurrent ? (
                <span className="block h-2 w-2 rounded-full bg-purple-400/50" />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Toggle Mask & Error / Success Feedback */}
      <div className="relative flex items-center justify-between px-2 mb-4 min-h-[28px]">
        {error ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 bg-rose-950/70 border border-rose-600/60 px-3 py-1.5 rounded-xl w-full">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span className="truncate">{error}</span>
          </div>
        ) : successMsg ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-600/60 px-3 py-1.5 rounded-xl w-full">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <span className="text-[11px] text-purple-300/70 font-medium">
            {step === 'setup_first'
              ? 'Step 1 of 2: Enter 4 numbers'
              : step === 'setup_confirm'
              ? 'Step 2 of 2: Re-enter same numbers'
              : 'Tap numbers or use keyboard'}
          </span>
        )}

        <button
          type="button"
          onClick={() => setShowDigits(!showDigits)}
          className="ml-auto flex items-center gap-1 text-[11px] font-bold text-purple-300 hover:text-yellow-300 transition-colors p-1"
          title={showDigits ? 'Hide PIN numbers' : 'Show PIN numbers'}
        >
          {showDigits ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          <span>{showDigits ? 'Hide' : 'Reveal'}</span>
        </button>
      </div>

      {/* On-Screen Touch Keypad (0-9, Clear, Backspace) */}
      <div className="relative grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={loading}
            onClick={() => handleDigitPress(digit)}
            className="flex h-13 sm:h-14 items-center justify-center rounded-2xl bg-purple-900/40 border border-purple-700/50 text-xl font-display font-black text-white hover:bg-purple-800/70 hover:border-yellow-400/70 active:scale-95 transition-all shadow-md active:bg-yellow-400 active:text-slate-950 cursor-pointer disabled:opacity-50"
          >
            {digit}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          disabled={loading}
          onClick={handleClear}
          className="flex h-13 sm:h-14 items-center justify-center rounded-2xl bg-purple-950/60 border border-purple-800 text-xs font-display font-bold text-purple-300 hover:text-white hover:bg-purple-900/60 active:scale-95 transition-all cursor-pointer disabled:opacity-50 gap-1"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Clear</span>
        </button>

        {/* Zero */}
        <button
          type="button"
          disabled={loading}
          onClick={() => handleDigitPress('0')}
          className="flex h-13 sm:h-14 items-center justify-center rounded-2xl bg-purple-900/40 border border-purple-700/50 text-xl font-display font-black text-white hover:bg-purple-800/70 hover:border-yellow-400/70 active:scale-95 transition-all shadow-md active:bg-yellow-400 active:text-slate-950 cursor-pointer disabled:opacity-50"
        >
          0
        </button>

        {/* Backspace Button */}
        <button
          type="button"
          disabled={loading}
          onClick={handleBackspace}
          className="flex h-13 sm:h-14 items-center justify-center rounded-2xl bg-purple-950/60 border border-purple-800 text-xs font-display font-bold text-purple-300 hover:text-white hover:bg-purple-900/60 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          aria-label="Backspace"
        >
          <Delete className="h-5 w-5" />
        </button>
      </div>

      {/* Helpful Hint & Fast-fill for quick testing */}
      <div className="relative mt-6 pt-4 border-t border-purple-900/50 text-center space-y-2">
        <div className="flex items-center justify-between text-[11px] text-purple-300/80 font-medium">
          <span>Kids remain on Kids area</span>
          {step === 'verify' && (
            <button
              type="button"
              onClick={() => {
                setStep('setup_first');
                setPin('');
                setConfirmPin('');
                setError(null);
              }}
              className="text-yellow-300 font-bold hover:underline"
            >
              Reset / Change PIN?
            </button>
          )}
        </div>

        {/* Quick Demo Helper */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-[10px] text-purple-400 uppercase tracking-wider font-extrabold">
            Demo Helper:
          </span>
          <button
            type="button"
            onClick={() => {
              if (step === 'setup_first') {
                setPin('1234');
                setStep('setup_confirm');
              } else if (step === 'setup_confirm') {
                setConfirmPin('1234');
                handleSetupSubmit('1234', '1234');
              } else {
                setPin('1234');
                handleVerifySubmit('1234');
              }
            }}
            className="text-[11px] font-bold text-yellow-300 bg-yellow-400/10 hover:bg-yellow-400/20 px-2.5 py-1 rounded-lg border border-yellow-400/30 transition-all flex items-center gap-1"
          >
            Quick PIN (1234)
          </button>
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md">{content}</div>
    </div>
  );
}
