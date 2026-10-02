'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Trophy,
  BookOpen,
  Award,
  PenTool,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MagazineIssue, MagazinePage } from './magazine-data';

interface MagazineReaderModalProps {
  magazine: MagazineIssue | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimOrbs?: (amount: number) => void;
  onWriteStory?: () => void;
}

export function MagazineReaderModal({
  magazine,
  isOpen,
  onClose,
  onClaimOrbs,
  onWriteStory,
}: MagazineReaderModalProps) {
  const [currentPageIndex, setCurrentPageIndex] = React.useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = React.useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = React.useState<boolean>(false);
  const [orbsClaimed, setOrbsClaimed] = React.useState<boolean>(false);
  const [liked, setLiked] = React.useState<boolean>(false);

  // Reset state when magazine changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentPageIndex(0);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
      setOrbsClaimed(false);
      setLiked(false);
    }
  }, [isOpen, magazine?.id]);

  if (!isOpen || !magazine) return null;

  const totalPages = magazine.pages.length;
  const currentPage: MagazinePage = magazine.pages[currentPageIndex];

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handleQuizAnswer = (index: number) => {
    if (quizSubmitted) return;
    setSelectedQuizOption(index);
    setQuizSubmitted(true);
  };

  const handleClaim = () => {
    if (orbsClaimed) return;
    setOrbsClaimed(true);
    if (onClaimOrbs) {
      onClaimOrbs(50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md transition-all animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#140c36] border-4 border-amber-400/80 rounded-3xl sm:rounded-4xl shadow-2xl shadow-purple-900/60 overflow-hidden text-white">
        
        {/* Header Ribbon */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-900 border-b-2 border-amber-400/40">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-md shadow-amber-400/30">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-amber-300 text-sm sm:text-base tracking-wide uppercase">
                  Night Zoo Magazine • Issue #{magazine.issueNumber}
                </span>
                <Badge variant="magic" className="text-[10px] px-2 py-0.5 uppercase tracking-widest hidden sm:inline-flex">
                  {magazine.editionName}
                </Badge>
              </div>
              <p className="text-[11px] text-purple-200 font-medium line-clamp-1">
                {magazine.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-xl border transition-all ${
                liked
                  ? 'bg-rose-500 border-rose-400 text-white scale-110 shadow-lg shadow-rose-500/40'
                  : 'bg-purple-950/60 border-purple-700/60 text-purple-200 hover:text-white'
              }`}
              title="Like this Issue"
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-purple-950/80 border border-purple-700/60 hover:bg-rose-600 hover:border-rose-500 text-white transition-all"
              title="Close Reader"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Reader Body / Content Area */}
        <div className="relative flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-[#160a3a] via-[#10072d] to-[#0a041f]">
          {/* Subtle star particles background */}
          <div className="absolute inset-0 stars-pattern opacity-30 pointer-events-none" />

          {/* PAGE 1: COVER VIEW */}
          {currentPage.type === 'cover' && (
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8 max-w-3xl mx-auto py-2">
              <div className="relative w-64 sm:w-80 h-96 sm:h-[420px] rounded-3xl p-1 bg-gradient-to-b from-amber-300 via-purple-400 to-amber-400 shadow-2xl shadow-purple-950/80 shrink-0 transform hover:scale-[1.02] transition-transform">
                <div className={`relative w-full h-full rounded-[22px] overflow-hidden bg-gradient-to-br ${magazine.gradient} p-5 flex flex-col justify-between border-2 border-yellow-200/50`}>
                  {/* Top Masthead */}
                  <div className="text-center space-y-1">
                    <span className="font-display font-black text-2xl sm:text-3xl text-yellow-300 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      NIGHT ZOOKEEPER
                    </span>
                    <div className="text-[10px] uppercase font-black tracking-widest text-white/90 bg-slate-950/60 py-0.5 px-3 rounded-full inline-block">
                      OFFICIAL KIDS EDITION • #{magazine.issueNumber}
                    </div>
                  </div>

                  {/* Character Illustration */}
                  <div className="relative flex-1 flex items-center justify-center py-2">
                    <div className="relative w-44 h-44 sm:w-48 sm:h-48">
                      <Image
                        src={magazine.characterMain.src}
                        alt={magazine.characterMain.alt}
                        fill
                        className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] animate-float"
                      />
                    </div>
                    {/* Secondary character sticker */}
                    <div className="absolute -bottom-2 -right-1 w-20 h-20">
                      <Image
                        src={magazine.characterSecondary.src}
                        alt={magazine.characterSecondary.alt}
                        fill
                        className="object-contain drop-shadow-md"
                      />
                    </div>
                  </div>

                  {/* Bottom Headline */}
                  <div className="space-y-1.5 bg-slate-950/80 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
                    <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest block">
                      ★ COVER STORY ★
                    </span>
                    <h3 className="font-display font-black text-sm sm:text-base text-white leading-tight">
                      {magazine.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Cover Details & Quick Index */}
              <div className="space-y-5 text-left flex-1">
                <div className="space-y-2">
                  <Badge variant="amber" className="text-xs font-black px-3 py-1">
                    {magazine.badge.text}
                  </Badge>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-white drop-shadow">
                    {magazine.title}
                  </h2>
                  <p className="text-purple-200 text-sm leading-relaxed">
                    {currentPage.content}
                  </p>
                </div>

                <div className="space-y-2.5 bg-purple-950/50 border border-purple-800/60 rounded-2xl p-4">
                  <span className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    What&apos;s Inside this Issue:
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-purple-100">
                    {magazine.headlines.map((headline, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-black">✦</span>
                        <span>{headline}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    onClick={handleNext}
                    className="btn-3d btn-3d-yellow gap-2 font-display font-black text-sm px-6 py-5 rounded-2xl"
                  >
                    Open Page 2: Creature Spotlight
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2: CREATURE SPOTLIGHT */}
          {currentPage.type === 'creature' && (
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <Badge variant="magic" className="text-xs font-bold px-3 py-1">
                  PAGE 2 OF {totalPages} • CREATURE OF THE MONTH
                </Badge>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-amber-300">
                  {currentPage.title}
                </h2>
                <p className="text-sm text-purple-200">
                  {currentPage.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-purple-950/60 border-2 border-purple-700/60 rounded-3xl p-6 backdrop-blur-sm">
                {/* Character preview */}
                <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-900/60 to-slate-950/80 rounded-2xl border border-purple-600/40 text-center">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                    <Image
                      src={currentPage.characterImage || magazine.characterMain.src}
                      alt="Creature"
                      fill
                      className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] animate-float"
                    />
                  </div>
                  <h4 className="font-display font-black text-xl text-yellow-300 mt-2">
                    {currentPage.creatureStats?.name}
                  </h4>
                  <span className="text-xs text-purple-300 font-bold uppercase tracking-widest">
                    {currentPage.creatureStats?.species}
                  </span>
                </div>

                {/* Stats & Lore */}
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
                        <span className="text-cyan-300">Flight & Agility</span>
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

                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-purple-800/80 space-y-1.5 text-xs text-purple-200">
                    <div>
                      <strong className="text-amber-300">Special Power: </strong>
                      <span>{currentPage.creatureStats?.specialPower}</span>
                    </div>
                    <div>
                      <strong className="text-yellow-300">Favorite Treat: </strong>
                      <span>{currentPage.creatureStats?.favoriteSnack}</span>
                    </div>
                    <div>
                      <strong className="text-emerald-300">Author: </strong>
                      <span>{currentPage.creatureStats?.author} (Age {currentPage.creatureStats?.authorAge})</span>
                    </div>
                  </div>

                  <p className="text-xs text-purple-200 italic leading-relaxed">
                    &ldquo;{currentPage.content}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 3: FEATURED STORY */}
          {currentPage.type === 'story' && (
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <Badge variant="amber" className="text-xs font-bold px-3 py-1">
                  PAGE 3 OF {totalPages} • FEATURED YOUNG AUTHOR
                </Badge>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-yellow-300">
                  {currentPage.title}
                </h2>
                <p className="text-xs text-purple-300 font-bold">
                  {currentPage.subtitle}
                </p>
              </div>

              <div className="bg-gradient-to-b from-purple-950/80 to-[#1e1346] border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-6 relative overflow-hidden">
                <div className="flex items-center gap-4 border-b border-purple-800/80 pb-4">
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
                    <h4 className="font-display font-black text-base text-white">
                      Story by {magazine.authorSpotlight.name} (Age {magazine.authorSpotlight.age})
                    </h4>
                    <span className="text-xs text-amber-300 font-bold">
                      📍 {magazine.authorSpotlight.location} • 🏆 Gold Quill Winner
                    </span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-purple-100 font-serif text-sm sm:text-base leading-relaxed whitespace-pre-line bg-purple-950/40 p-5 rounded-2xl border border-purple-800/40">
                  {currentPage.content}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-purple-300">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span>Selected from over 1,500 kid submissions this month!</span>
                  </div>
                  {onWriteStory && (
                    <Button
                      onClick={() => {
                        onClose();
                        onWriteStory();
                      }}
                      className="btn-3d btn-3d-purple gap-2 text-xs font-display font-black"
                    >
                      <PenTool className="h-3.5 w-3.5 text-yellow-300" />
                      Write My Story to Get Featured
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PAGE 4: PUZZLE & CLAIM 50 ORBS */}
          {currentPage.type === 'puzzle' && (
            <div className="relative z-10 max-w-3xl mx-auto space-y-6 text-center">
              <div className="space-y-2">
                <Badge variant="magic" className="text-xs font-bold px-3 py-1">
                  PAGE 4 OF {totalPages} • WORD LAB & REWARDS
                </Badge>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-amber-300">
                  {currentPage.title}
                </h2>
                <p className="text-sm text-purple-200">
                  {currentPage.subtitle}
                </p>
              </div>

              <div className="bg-gradient-to-b from-[#22104f] to-[#140a33] border-3 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                  <span className="font-display font-black text-lg text-white">
                    {currentPage.puzzleQuestion}
                  </span>
                </div>

                {/* Multiple choice options */}
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
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={quizSubmitted}
                        className={`p-4 rounded-2xl border-2 font-display font-bold text-sm transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {quizSubmitted && isCorrect && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback & Claim Button */}
                {quizSubmitted && (
                  <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-3 animate-in zoom-in-95">
                    <p className="text-xs sm:text-sm font-bold text-amber-300">
                      🎉 Brilliant Explorer! You found the rich vocabulary choice!
                    </p>

                    <Button
                      onClick={handleClaim}
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

        {/* Footer Navigation Bar */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-[#0f0728] border-t-2 border-purple-900/80">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentPageIndex === 0}
            className="text-purple-300 hover:text-white disabled:opacity-30 gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Page
          </Button>

          {/* Page Indicators */}
          <div className="flex items-center gap-2">
            {magazine.pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPageIndex(idx)}
                className={`h-3 rounded-full transition-all ${
                  idx === currentPageIndex
                    ? 'w-7 bg-amber-400 shadow-md shadow-amber-400/50'
                    : 'w-3 bg-purple-800 hover:bg-purple-600'
                }`}
                title={`Go to Page ${idx + 1}`}
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
            Next Page
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}
