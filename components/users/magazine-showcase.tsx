'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Trophy,
  PenTool,
  Star,
  Award,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MAGAZINES, MagazineIssue } from './magazine-data';

interface MagazineShowcaseProps {
  currentOrbs?: number;
  onOrbsUpdated?: (newOrbs: number) => void;
  onWriteStoryClick?: () => void;
}

export function MagazineShowcase({
  currentOrbs = 75,
  onOrbsUpdated,
  onWriteStoryClick,
}: MagazineShowcaseProps) {
  const router = useRouter();
  const [orbs, setOrbs] = React.useState<number>(currentOrbs);
  const [recentlyClaimed, setRecentlyClaimed] = React.useState<boolean>(false);

  const handleOpenMagazine = (mag: MagazineIssue) => {
    setRecentlyClaimed(true);
    const nextOrbs = orbs + 50;
    setOrbs(nextOrbs);
    onOrbsUpdated?.(nextOrbs);
    // Navigate directly to the dedicated full page as requested
    router.push(`/users/kids/magazine/${mag.id}`);
  };

  // Playful non-ordered overlapping placement for explorer's desk
  const getRotationClass = (index: number) => {
    if (index === 0) return '-rotate-4 md:-rotate-5 translate-y-4 hover:translate-y-0';
    if (index === 1) return 'rotate-2 md:rotate-2 -translate-y-2 md:-translate-y-4 hover:translate-y-0 z-20 scale-102 md:scale-105';
    return 'rotate-4 md:rotate-5 translate-y-2 hover:translate-y-0';
  };

  return (
    <section className="relative space-y-8">
      {/* =========================================================================
          HERO BANNER: SELAM KIDS MAGAZINE HEADQUARTERS
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-[#1b0b42] via-[#2a1363] to-[#0f0729] border-4 border-amber-400/80 p-6 md:p-8 shadow-2xl shadow-purple-950/70 text-white">
        {/* Star background & magical lighting */}
        <div className="absolute inset-0 stars-pattern opacity-40 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-amber-400/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-4 py-1.5 text-slate-950 text-xs font-black shadow-md shadow-amber-400/30">
              <span>OCTOBER EDITION</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight drop-shadow-md">
              Welcome to the <span className="text-yellow-300 underline decoration-amber-400 decoration-wavy decoration-2">Selam Kids</span>!
            </h1>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <div className="flex items-center gap-2 rounded-2xl bg-slate-950/60 border border-purple-700/60 px-4 py-2 text-xs font-bold text-purple-200">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>Read any issue = <strong className="text-yellow-300">+50 Glowing Orbs</strong></span>
              </div>

              {recentlyClaimed && (
                <div className="animate-bounce flex items-center gap-1.5 text-xs font-black text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-500">
                  <Star className="h-4 w-4 fill-emerald-400" />
                  <span>+50 Orbs Added to Your Vault!</span>
                </div>
              )}
            </div>
          </div>

          {/* Simba Mascot Guide */}
          <div className="relative shrink-0 flex items-center gap-3 bg-purple-950/80 border-2 border-amber-400/60 p-4 rounded-3xl backdrop-blur-md max-w-xs shadow-xl">
            <div className="relative w-20 h-20 shrink-0 animate-wiggle">
              <Image
                src="/images/characters/simba.png"
                alt="Simba the Guide"
                fill
                className="object-contain drop-shadow-md"
              />
            </div>
            <div className="space-y-1 text-left">
              <span className="text-[11px] font-black text-yellow-300 uppercase tracking-wider block">
                🦁 Simba&apos;s Tip:
              </span>
              <p className="text-xs text-purple-100 font-medium leading-snug">
                &ldquo;Hover your cursor over any magazine to pull it forward, or tap to read the secret creature pages!&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          THE "NOT ORDERED" 3 MAGAZINES SHOWCASE (Tactile Adventure Desk)
          ========================================================================= */}
      <div className="relative py-8 px-2 sm:px-6">
        {/* Glow behind center magazine */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-amber-400/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Section Header */}
        <div className="text-center space-y-2 mb-8">
          <Badge variant="magic" className="text-xs font-extrabold px-3 py-1 uppercase tracking-wider">
            ★ 3 FEATURED EDITIONS • PICK YOUR ADVENTURE ★
          </Badge>
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">
            Magazines Scattered on the Explorer&apos;s Desk
          </h2>
          <p className="text-slate-600 dark:text-purple-200 text-sm max-w-lg mx-auto font-medium">
            Not lined up in a boring row! These 3 issues are right off the Night Zoo press, waiting for you to flip open.
          </p>
        </div>

        {/* Playful Staggered / "Not Ordered" Desktop & Mobile Layout */}
        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 lg:gap-6 pt-4 pb-8">
          {MAGAZINES.map((magazine, index) => {
            const rotationClass = getRotationClass(index);

            return (
              <div
                key={magazine.id}
                onClick={() => handleOpenMagazine(magazine)}
                className={`group relative cursor-pointer transition-all duration-300 ease-out transform ${rotationClass} hover:rotate-0 hover:scale-105 hover:z-30 hover:-translate-y-4`}
                style={{
                  perspective: '1200px',
                }}
              >
                {/* Physical Magazine Card Body */}
                <div className="relative w-72 sm:w-80 h-[440px] sm:h-[460px] rounded-4xl p-1 bg-gradient-to-b from-amber-300 via-purple-500 to-amber-300 shadow-2xl shadow-purple-950/40 group-hover:shadow-amber-400/40 transition-shadow">
                  
                  {/* Glossy Sheen Overlay */}
                  <div className="absolute inset-0 rounded-4xl bg-gradient-to-tr from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20" />

                  {/* Corner Ribbon / Sticker */}
                  <div className="absolute -top-3 -right-3 z-30 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all">
                    <span className={`px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-lg ${magazine.sticker.bg}`}>
                      {magazine.sticker.text}
                    </span>
                  </div>

                  {/* Top Left Issue Badge */}
                  <div className="absolute -top-3 -left-2 z-30 transform -rotate-6 group-hover:rotate-0 transition-transform">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider shadow-md ${magazine.badge.color}`}>
                      {magazine.badge.text}
                    </span>
                  </div>

                  {/* Inner Magazine Cover */}
                  <div className={`relative w-full h-full rounded-[28px] overflow-hidden bg-gradient-to-br ${magazine.gradient} p-5 flex flex-col justify-between border-2 border-white/25 text-white select-none`}>
                    
                    {/* Masthead */}
                    <div className="text-center space-y-1 relative z-10">
                      <div className="flex items-center justify-between border-b border-white/20 pb-1 text-[9px] uppercase tracking-widest text-purple-200 font-bold">
                        <span>ISSUE #{magazine.issueNumber}</span>
                        <span>{magazine.releaseDate}</span>
                        <span>FREE WITH ORBS</span>
                      </div>

                      <h3 className="font-display font-black text-2xl sm:text-3xl text-yellow-300 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-1">
                        NIGHT ZOOKEEPER
                      </h3>
                      <span className="text-[10px] uppercase font-black tracking-widest text-purple-200">
                        {magazine.editionName}
                      </span>
                    </div>

                    {/* Cover Characters Area */}
                    <div className="relative flex-1 flex items-center justify-center my-1">
                      {/* Main Character */}
                      <div className="relative w-44 h-44 sm:w-48 sm:h-48 group-hover:scale-110 transition-transform duration-300">
                        <Image
                          src={magazine.characterMain.src}
                          alt={magazine.characterMain.alt}
                          fill
                          className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
                        />
                      </div>

                      {/* Secondary Character floating in corner */}
                      <div className="absolute -bottom-2 -right-1 w-20 h-20 group-hover:scale-115 transition-transform duration-300">
                        <Image
                          src={magazine.characterSecondary.src}
                          alt={magazine.characterSecondary.alt}
                          fill
                          className="object-contain drop-shadow-md"
                        />
                      </div>

                      {/* Golden Official Stamp */}
                      {index === 1 && (
                        <div className="absolute top-2 left-1 bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 p-2 rounded-full shadow-lg border-2 border-yellow-100 flex flex-col items-center justify-center w-14 h-14 rotate-[-12deg] group-hover:rotate-0 transition-transform">
                          <Award className="h-4 w-4" />
                          <span className="text-[8px] font-black uppercase text-center leading-tight">
                            #1 GOLD
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Cover Bottom Headlines */}
                    <div className="relative z-10 space-y-2 bg-slate-950/75 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-black text-amber-300 uppercase tracking-widest">
                          ★ COVER FEATURE
                        </span>
                        <span className="text-purple-300 font-bold">
                          By {magazine.authorSpotlight.name}
                        </span>
                      </div>

                      <h4 className="font-display font-black text-sm sm:text-base text-white leading-tight line-clamp-2">
                        {magazine.title}
                      </h4>

                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[10px] text-purple-200 line-clamp-1">
                          ✦ {magazine.headlines[0]}
                        </span>
                      </div>
                    </div>

                    {/* Interactive "TAP TO READ" Hover Pill */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-30">
                      <span className="btn-3d btn-3d-yellow flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display font-black text-slate-950 shadow-xl whitespace-nowrap">
                        <Eye className="h-3.5 w-3.5" />
                        READ ISSUE NOW
                      </span>
                    </div>

                  </div>
                </div>

                {/* Bookmark Ribbon Hanging from Bottom on Issue 3 */}
                {index === 2 && (
                  <div className="absolute -bottom-4 right-10 w-6 h-8 bg-rose-500 rounded-b-md shadow-md transform rotate-6 border border-rose-400 pointer-events-none hidden sm:block" />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Prompt Strip Below the 3 Magazines */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-100 via-amber-50 to-purple-100 dark:from-[#1b0b42] dark:via-[#261358] dark:to-[#170838] border-2 border-purple-200 dark:border-purple-700/60 p-5 rounded-3xl shadow-sm dark:shadow-xl dark:shadow-purple-950/40 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-md shrink-0">
              <PenTool className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-display font-black text-slate-900 dark:text-white text-base">
                Do you want your creature in next month&apos;s Magazine?
              </h4>
              <p className="text-xs text-slate-600 dark:text-purple-200 font-medium">
                Submit an adventure below. Night Zookeeper editors pick 3 new kid authors every month!
              </p>
            </div>
          </div>

          <Button
            onClick={() => {
              if (onWriteStoryClick) {
                onWriteStoryClick();
              } else {
                const el = document.getElementById('story-editor-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-3d btn-3d-yellow shrink-0 gap-2 font-display font-black text-xs px-5 py-3 rounded-2xl"
          >
            Write for Next Issue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
