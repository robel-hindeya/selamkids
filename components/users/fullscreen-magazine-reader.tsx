'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Maximize,
  Lock,
  Unlock,
  KeyRound,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trophy,
  BookOpen,
  CheckCircle2,
  X,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MagazineIssue } from './magazine-data';

interface FullscreenMagazineReaderProps {
  magazine: MagazineIssue;
  initialOrbs?: number;
}

export function FullscreenMagazineReader({
  magazine,
  initialOrbs = 75,
}: FullscreenMagazineReaderProps) {
  const router = useRouter();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Reader state
  const [currentPageIndex, setCurrentPageIndex] = React.useState<number>(0);
  const [orbs, setOrbs] = React.useState<number>(initialOrbs);
  const [orbsClaimed, setOrbsClaimed] = React.useState<boolean>(false);
  const [selectedQuizOption, setSelectedQuizOption] = React.useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = React.useState<boolean>(false);

  // Fullscreen & Passcode state
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);
  const [passcodeModalOpen, setPasscodeModalOpen] = React.useState<boolean>(false);
  const [exitPasscodeModalOpen, setExitPasscodeModalOpen] = React.useState<boolean>(false);
  const [enteredPasscode, setEnteredPasscode] = React.useState<string>('');
  const [secretPasscode, setSecretPasscode] = React.useState<string>('1234');
  const [passcodeError, setPasscodeError] = React.useState<string | null>(null);
  const [showHint, setShowHint] = React.useState<boolean>(false);
  const [celebrationMessage, setCelebrationMessage] = React.useState<string | null>(null);

  const totalPages = magazine.pages.length;
  const currentPage = magazine.pages[currentPageIndex];

  // Play subtle sound effects with Web Audio API
  const playSound = (type: 'flip' | 'unlock' | 'error' | 'win') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'flip') {
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'unlock' || type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.1);
        osc.frequency.setValueAtTime(659.25, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // Audio not supported or blocked
    }
  };

  // Sync fullscreen change event
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen && !exitPasscodeModalOpen) {
        // If native fullscreen was dismissed with ESC, trigger password exit modal
        setExitPasscodeModalOpen(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullscreen, exitPasscodeModalOpen]);

  // Page turns
  const handlePrev = () => {
    if (currentPageIndex > 0) {
      playSound('flip');
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      playSound('flip');
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  // Open Add Password dialog before entering fullscreen
  const handleStartFullscreenFlow = () => {
    setEnteredPasscode('');
    setPasscodeError(null);
    setShowHint(false);
    setPasscodeModalOpen(true);
  };

  // Confirm passcode and enter Fullscreen
  const handleConfirmSetPasscode = () => {
    const code = enteredPasscode.trim() || '1234';
    setSecretPasscode(code);
    setPasscodeModalOpen(false);
    setIsFullscreen(true);
    playSound('unlock');

    // Trigger browser fullscreen if possible
    try {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {
          // Native fullscreen failed, fallback to CSS fullscreen
        });
      }
    } catch {
      // Fallback
    }

    setCelebrationMessage(`✨ Fullscreen Mode Locked! Code: "${code}"`);
    setTimeout(() => setCelebrationMessage(null), 3500);
  };

  // Trigger Exit Passcode Prompt
  const handleRequestExit = () => {
    setEnteredPasscode('');
    setPasscodeError(null);
    setShowHint(false);
    setExitPasscodeModalOpen(true);
  };

  // Verify entered passcode on exit
  const handleVerifyExitPasscode = () => {
    if (enteredPasscode.trim().toLowerCase() === secretPasscode.trim().toLowerCase()) {
      playSound('unlock');
      setCelebrationMessage('🎉 Passcode Accepted! Returning to Magazines Lounge...');

      setTimeout(() => {
        if (document.fullscreenElement) {
          try {
            document.exitFullscreen().catch(() => {});
          } catch {
            // Safe fallback
          }
        }
        setIsFullscreen(false);
        setExitPasscodeModalOpen(false);
        router.push('/users/kids');
      }, 900);
    } else {
      playSound('error');
      setPasscodeError(`Incorrect code! Check your secret code.`);
    }
  };

  const handleKeypadPress = (val: string) => {
    if (val === 'back') {
      setEnteredPasscode((prev) => prev.slice(0, -1));
    } else if (val === 'clear') {
      setEnteredPasscode('');
    } else {
      if (enteredPasscode.length < 8) {
        setEnteredPasscode((prev) => prev + val);
      }
    }
    setPasscodeError(null);
  };

  const handleClaimReward = () => {
    if (orbsClaimed) return;
    playSound('win');
    setOrbsClaimed(true);
    setOrbs((prev) => prev + 50);
    setCelebrationMessage('🌟 +50 Glowing Orbs Added to Your Vault!');
    setTimeout(() => setCelebrationMessage(null), 4000);
  };

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-[9999] w-screen h-screen bg-[#0d0624] overflow-y-auto flex flex-col justify-between text-white p-4 sm:p-8'
          : 'relative space-y-6 max-w-5xl mx-auto'
      }`}
    >
      {/* =========================================================================
          TOP ACTION BAR: Breadcrumbs, 1 FULLSCREEN ICON, and Exit Controls
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-purple-950 via-[#1b0d45] to-purple-950 p-4 sm:p-5 rounded-3xl border-2 border-purple-700/60 shadow-xl text-white">
        
        {/* Left: Back / Breadcrumbs */}
        <div className="flex items-center gap-3">
          {!isFullscreen ? (
            <Link
              href="/users/kids"
              className="inline-flex items-center gap-2 text-xs font-bold text-yellow-300 hover:text-white bg-purple-900/80 hover:bg-purple-800 px-4 py-2 rounded-2xl border border-purple-700 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Magazines</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-full text-xs font-black shadow-md">
              <Lock className="h-3.5 w-3.5" />
              <span>FULLSCREEN LOCKED (Code: {secretPasscode})</span>
            </div>
          )}

          <div className="hidden sm:block">
            <span className="font-display font-black text-white text-base">
              Issue #{magazine.issueNumber}: {magazine.title}
            </span>
          </div>
        </div>

        {/* Right: Orbs & THE 1 FULLSCREEN / EXIT ICON */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-400 text-slate-950 px-4 py-2 rounded-full font-display font-black text-xs shadow-md">
            <Trophy className="h-4 w-4 fill-slate-950" />
            <span>{orbs} Orbs</span>
          </div>

          {/* =====================================================================
              THE 1 ICON TO CHANGE TO FULL SCREEN (Non-fullscreen mode)
              ===================================================================== */}
          {!isFullscreen ? (
            <button
              onClick={handleStartFullscreenFlow}
              title="Click this icon to change to Full Screen Reading Mode!"
              className="group btn-3d relative flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 px-5 py-2.5 text-slate-950 font-display font-black text-sm shadow-xl shadow-amber-400/40 border-2 border-yellow-100 hover:scale-105 active:scale-95 transition-all"
            >
              {/* Pulsing ring indicator */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500" />
              </span>

              {/* The 1 Icon */}
              <Maximize className="h-5 w-5 text-slate-950 group-hover:rotate-45 transition-transform duration-200" />
              <span>FULL SCREEN MODE</span>
            </button>
          ) : (
            /* Button in Fullscreen: Write Password then Back to Magazines */
            <button
              onClick={handleRequestExit}
              className="btn-3d flex items-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-500 border-2 border-rose-300 px-5 py-2.5 text-white font-display font-black text-xs sm:text-sm shadow-xl transition-all active:scale-95 animate-pulse"
            >
              <KeyRound className="h-4 w-4" />
              <span>Finish Reading & Exit (Write Passcode)</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Celebration Banner */}
      {celebrationMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[10001] bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-display font-black text-sm sm:text-base px-6 py-3 rounded-full shadow-2xl border-2 border-emerald-300 animate-in zoom-in-95 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-300" />
          <span>{celebrationMessage}</span>
        </div>
      )}

      {/* =========================================================================
          MAGAZINE READER CANVAS (Page Content)
          ========================================================================= */}
      <div className={`relative flex-1 rounded-4xl bg-gradient-to-b from-[#180c42] via-[#120835] to-[#0b0422] border-4 border-amber-400/70 p-4 sm:p-8 shadow-2xl text-white overflow-hidden ${isFullscreen ? 'min-h-[75vh] flex flex-col justify-center' : ''}`}>
        
        {/* Star backdrop */}
        <div className="absolute inset-0 stars-pattern opacity-40 pointer-events-none" />

        {/* ==================== PAGE 1: COVER ==================== */}
        {currentPage.type === 'cover' && (
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 max-w-4xl mx-auto py-4">
            
            {/* Glossy Cover Card */}
            <div className="relative w-72 sm:w-88 h-[460px] sm:h-[500px] rounded-4xl p-1 bg-gradient-to-b from-amber-300 via-purple-400 to-amber-400 shadow-2xl shadow-purple-950/80 shrink-0 transform hover:scale-[1.02] transition-transform">
              <div className={`relative w-full h-full rounded-[28px] overflow-hidden bg-gradient-to-br ${magazine.gradient} p-6 flex flex-col justify-between border-2 border-yellow-200/50`}>
                
                {/* Masthead */}
                <div className="text-center space-y-1">
                  <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-purple-200 border-b border-white/20 pb-1">
                    <span>ISSUE #{magazine.issueNumber}</span>
                    <span>{magazine.releaseDate}</span>
                  </div>
                  <h3 className="font-display font-black text-3xl sm:text-4xl text-yellow-300 tracking-wider drop-shadow-md">
                    NIGHT ZOOKEEPER
                  </h3>
                  <span className="text-[11px] uppercase font-black tracking-widest text-white/90">
                    {magazine.editionName}
                  </span>
                </div>

                {/* Animated Cover Characters */}
                <div className="relative flex-1 flex items-center justify-center py-2">
                  <div className="relative w-52 h-52 sm:w-60 sm:h-60 animate-float">
                    <Image
                      src={magazine.characterMain.src}
                      alt={magazine.characterMain.alt}
                      fill
                      className="object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-1 w-24 h-24">
                    <Image
                      src={magazine.characterSecondary.src}
                      alt={magazine.characterSecondary.alt}
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                </div>

                {/* Bottom Cover Story Box */}
                <div className="space-y-1.5 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
                  <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest block">
                    ★ FEATURE STORY ★
                  </span>
                  <h4 className="font-display font-black text-sm sm:text-base text-white leading-tight">
                    {magazine.title}
                  </h4>
                </div>
              </div>
            </div>

            {/* Right: Overview & Launch to Page 2 */}
            <div className="space-y-5 text-left flex-1">
              <Badge variant="amber" className="text-xs font-black px-3 py-1">
                {magazine.badge.text}
              </Badge>

              <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
                {magazine.title}
              </h2>

              <p className="text-purple-200 text-sm sm:text-base leading-relaxed">
                {currentPage.content}
              </p>

              <div className="bg-purple-950/70 border border-purple-800 rounded-2xl p-4 space-y-2">
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  What You Will Discover Inside:
                </span>
                <ul className="space-y-1.5 text-xs sm:text-sm text-purple-100">
                  {magazine.headlines.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-400 font-black">✦</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Button
                  onClick={handleNext}
                  className="btn-3d btn-3d-yellow gap-2 font-display font-black text-sm px-6 py-5 rounded-2xl"
                >
                  Turn to Page 2: Creature Dossier
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

          </div>
        )}

        {/* ==================== PAGE 2: CREATURE SPOTLIGHT ==================== */}
        {currentPage.type === 'creature' && (
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <Badge variant="magic" className="text-xs font-bold px-3 py-1">
                PAGE 2 OF {totalPages} • OFFICIAL CREATURE DOSSIER
              </Badge>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-amber-300">
                {currentPage.title}
              </h2>
              <p className="text-xs sm:text-sm text-purple-200">
                {currentPage.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-purple-950/70 border-2 border-purple-700/70 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
              <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-900/70 to-slate-950/80 rounded-2xl border border-purple-600/40 text-center">
                <div className="relative w-52 h-52 sm:w-64 sm:h-64 animate-float">
                  <Image
                    src={currentPage.characterImage || magazine.characterMain.src}
                    alt="Creature"
                    fill
                    className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
                  />
                </div>
                <h4 className="font-display font-black text-2xl text-yellow-300 mt-2">
                  {currentPage.creatureStats?.name}
                </h4>
                <span className="text-xs text-purple-300 font-bold uppercase tracking-widest">
                  {currentPage.creatureStats?.species}
                </span>
              </div>

              <div className="space-y-4 flex flex-col justify-center">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-amber-300">Bravery Level</span>
                      <span>{currentPage.creatureStats?.bravery}%</span>
                    </div>
                    <div className="w-full h-3 bg-purple-900 rounded-full overflow-hidden border border-purple-700">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
                        style={{ width: `${currentPage.creatureStats?.bravery}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-pink-300">Magic Word Power</span>
                      <span>{currentPage.creatureStats?.magic}%</span>
                    </div>
                    <div className="w-full h-3 bg-purple-900 rounded-full overflow-hidden border border-purple-700">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-400 rounded-full"
                        style={{ width: `${currentPage.creatureStats?.magic}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-cyan-300">Agility & Speed</span>
                      <span>{currentPage.creatureStats?.speed}%</span>
                    </div>
                    <div className="w-full h-3 bg-purple-900 rounded-full overflow-hidden border border-purple-700">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                        style={{ width: `${currentPage.creatureStats?.speed}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-2xl border border-purple-800 space-y-2 text-xs sm:text-sm text-purple-200">
                  <div>
                    <strong className="text-amber-300">Special Ability: </strong>
                    <span>{currentPage.creatureStats?.specialPower}</span>
                  </div>
                  <div>
                    <strong className="text-yellow-300">Favorite Treat: </strong>
                    <span>{currentPage.creatureStats?.favoriteSnack}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-300">Authored By: </strong>
                    <span>{currentPage.creatureStats?.author} (Age {currentPage.creatureStats?.authorAge})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== PAGE 3: FEATURED STORY ==================== */}
        {currentPage.type === 'story' && (
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <Badge variant="amber" className="text-xs font-bold px-3 py-1">
                PAGE 3 OF {totalPages} • YOUNG AUTHOR SPOTLIGHT
              </Badge>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-yellow-300">
                {currentPage.title}
              </h2>
              <p className="text-xs sm:text-sm text-purple-300">
                {currentPage.subtitle}
              </p>
            </div>

            <div className="bg-gradient-to-b from-purple-950/85 to-[#1c1144] border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-4 border-b border-purple-800 pb-4">
                <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shrink-0">
                  <div className="w-full h-full relative rounded-[14px] overflow-hidden bg-purple-900">
                    <Image
                      src={currentPage.characterImage || magazine.characterSecondary.src}
                      alt="Author Avatar"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-display font-black text-lg text-white">
                    Story by {magazine.authorSpotlight.name} (Age {magazine.authorSpotlight.age})
                  </h4>
                  <span className="text-xs text-amber-300 font-bold">
                    📍 {magazine.authorSpotlight.location} • 🏆 Gold Quill Award Winner
                  </span>
                </div>
              </div>

              <div className="text-purple-100 font-serif text-base sm:text-lg leading-relaxed whitespace-pre-line bg-purple-950/40 p-6 rounded-2xl border border-purple-800/40">
                {currentPage.content}
              </div>
            </div>
          </div>
        )}

        {/* ==================== PAGE 4: PUZZLE & 50 ORBS CLAIM ==================== */}
        {currentPage.type === 'puzzle' && (
          <div className="relative z-10 max-w-3xl mx-auto space-y-6 text-center">
            <div className="space-y-1">
              <Badge variant="magic" className="text-xs font-bold px-3 py-1">
                PAGE 4 OF {totalPages} • WORD CHALLENGE & REWARD
              </Badge>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-amber-300">
                {currentPage.title}
              </h2>
              <p className="text-xs sm:text-sm text-purple-200">
                {currentPage.subtitle}
              </p>
            </div>

            <div className="bg-gradient-to-b from-[#22104f] to-[#140a33] border-3 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                <span className="font-display font-black text-lg sm:text-xl text-white">
                  {currentPage.puzzleQuestion}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {currentPage.puzzleOptions?.map((option, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === currentPage.correctAnswer;
                  let btnStyle = 'bg-purple-950/80 border-purple-700/60 hover:border-amber-400 text-purple-100';

                  if (quizSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-200 scale-102 shadow-lg shadow-emerald-500/30';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!quizSubmitted) {
                          setSelectedQuizOption(idx);
                          setQuizSubmitted(true);
                          playSound(idx === currentPage.correctAnswer ? 'win' : 'error');
                        }
                      }}
                      disabled={quizSubmitted}
                      className={`p-4 rounded-2xl border-2 font-display font-bold text-sm sm:text-base transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {quizSubmitted && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-3 animate-in zoom-in-95">
                  <p className="text-sm font-bold text-amber-300">
                    🎉 Excellent reading, Young Author! You mastered this challenge!
                  </p>

                  <Button
                    onClick={handleClaimReward}
                    disabled={orbsClaimed}
                    className={`btn-3d ${
                      orbsClaimed
                        ? 'bg-emerald-600 border-emerald-500 text-white cursor-default'
                        : 'btn-3d-yellow'
                    } gap-2 font-display font-black text-base px-8 py-6 rounded-2xl shadow-xl`}
                  >
                    <Trophy className="h-5 w-5 text-amber-950" />
                    {orbsClaimed ? '✓ 50 Glowing Orbs Claimed!' : 'Claim +50 Glowing Orbs!'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          PAGE NAVIGATION FOOTER
          ========================================================================= */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 bg-[#120835] rounded-3xl border-2 border-purple-800/80 text-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          disabled={currentPageIndex === 0}
          className="text-purple-300 hover:text-white disabled:opacity-30 gap-1.5"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Previous Page</span>
        </Button>

        {/* Page Dots */}
        <div className="flex items-center gap-2">
          {magazine.pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                playSound('flip');
                setCurrentPageIndex(idx);
              }}
              className={`h-3.5 rounded-full transition-all ${
                idx === currentPageIndex
                  ? 'w-8 bg-amber-400 shadow-lg shadow-amber-400/50'
                  : 'w-3.5 bg-purple-800 hover:bg-purple-600'
              }`}
              title={`Page ${idx + 1}`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={currentPageIndex === totalPages - 1}
          className="text-purple-300 hover:text-white disabled:opacity-30 gap-1.5"
        >
          <span className="hidden sm:inline">Next Page</span>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* =========================================================================
          MODAL 1: ADD PASSWORD (Before entering Fullscreen)
          ========================================================================= */}
      {passcodeModalOpen && (
        <div className="fixed inset-0 z-[10005] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#190d45] border-4 border-amber-400 rounded-4xl p-6 sm:p-8 shadow-2xl text-white text-center space-y-5">
            <button
              onClick={() => setPasscodeModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-purple-900/60 hover:bg-rose-600 text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-400 text-slate-950 shadow-xl shadow-amber-400/30">
              <Lock className="h-8 w-8" />
            </div>

            <div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-yellow-300">
                Set Secret Reading Code
              </h3>
              <p className="text-xs text-purple-200 mt-1">
                Enter your secret password below. When you finish reading, write this code to unlock and exit!
              </p>
            </div>

            {/* Display Box */}
            <div className="bg-slate-950/80 border-2 border-purple-500 rounded-2xl p-4 flex items-center justify-center">
              <span className="font-mono font-black text-2xl tracking-[0.4em] text-yellow-300">
                {enteredPasscode ? enteredPasscode : '1234'}
              </span>
            </div>

            {/* Chunky Keypad for Kids */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeypadPress(key)}
                  className="btn-3d py-3 rounded-2xl bg-purple-900/80 hover:bg-purple-800 border border-purple-600 font-display font-black text-base text-white active:scale-95 shadow-md"
                >
                  {key === 'back' ? '⌫' : key === 'clear' ? 'C' : key}
                </button>
              ))}
            </div>

            <Button
              onClick={handleConfirmSetPasscode}
              className="btn-3d btn-3d-yellow w-full py-6 font-display font-black text-base rounded-2xl shadow-xl gap-2"
            >
              <Maximize className="h-5 w-5" />
              Lock Into Fullscreen Reader 🚀
            </Button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: WRITE PASSWORD THEN BACK TO MAGAZINES PAGE
          ========================================================================= */}
      {exitPasscodeModalOpen && (
        <div className="fixed inset-0 z-[10005] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#190d45] border-4 border-amber-400 rounded-4xl p-6 sm:p-8 shadow-2xl text-white text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-xl shadow-amber-400/30">
              <KeyRound className="h-8 w-8" />
            </div>

            <div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-yellow-300">
                Write Secret Passcode
              </h3>
              <p className="text-xs text-purple-200 mt-1">
                Write your secret code to exit full screen and return to the Magazines Lounge!
              </p>
            </div>

            {/* Display Box */}
            <div className="bg-slate-950/80 border-2 border-purple-500 rounded-2xl p-4 flex items-center justify-center min-h-[58px]">
              <span className="font-mono font-black text-2xl tracking-[0.4em] text-yellow-300">
                {enteredPasscode ? enteredPasscode : '____'}
              </span>
            </div>

            {passcodeError && (
              <p className="text-xs font-bold text-rose-300 animate-wiggle">
                {passcodeError}
              </p>
            )}

            {/* Chunky Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeypadPress(key)}
                  className="btn-3d py-3 rounded-2xl bg-purple-900/80 hover:bg-purple-800 border border-purple-600 font-display font-black text-base text-white active:scale-95 shadow-md"
                >
                  {key === 'back' ? '⌫' : key === 'clear' ? 'C' : key}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleVerifyExitPasscode}
                className="btn-3d btn-3d-yellow w-full py-6 font-display font-black text-base rounded-2xl shadow-xl gap-2"
              >
                <Unlock className="h-5 w-5" />
                Unlock & Back to Magazines Page
              </Button>

              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-purple-300 hover:text-yellow-300 underline flex items-center gap-1"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  {showHint ? `Secret Code: "${secretPasscode}"` : 'Need a hint?'}
                </button>

                <button
                  onClick={() => setExitPasscodeModalOpen(false)}
                  className="text-purple-300 hover:text-white"
                >
                  Keep Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
