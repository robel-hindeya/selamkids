'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface HeroCharacter {
  id: string;
  name: string;
  movie: string;
  image: string;
  quote: string;
  power: string;
  positionClass: string;
  bubbleClass: string;
  sizeClass: string;
  glowColor: string;
  animationDelay: string;
}

const HERO_CHARACTERS: HeroCharacter[] = [
  {
    id: 'simba',
    name: 'Simba',
    movie: 'The Lion King',
    image: '/images/characters/simba.png',
    quote: 'Hakuna Matata! Let’s write a wild safari adventure!',
    power: 'Roar of Vocabulary',
    positionClass: 'top-6 left-3 sm:left-6 lg:left-10',
    bubbleClass: 'top-full left-0 sm:left-4 mt-2',
    sizeClass: 'w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40',
    glowColor: 'drop-shadow-[0_12px_28px_rgba(251,191,36,0.55)]',
    animationDelay: '0s',
  },
  {
    id: 'toothless',
    name: 'Toothless',
    movie: 'How to Train Your Dragon',
    image: '/images/characters/toothless.png',
    quote: 'Plasma Blast! Time to soar into mythical fantasy worlds!',
    power: 'Dragon Fire Creativity',
    positionClass: 'top-4 right-1/4 sm:right-1/3 -translate-y-2 hidden lg:block',
    bubbleClass: 'top-full left-1/2 -translate-x-1/2 mt-2',
    sizeClass: 'w-32 h-28 lg:w-44 lg:h-36',
    glowColor: 'drop-shadow-[0_12px_28px_rgba(147,51,234,0.6)]',
    animationDelay: '1.2s',
  },
  {
    id: 'po',
    name: 'Po the Dragon Warrior',
    movie: 'Kung Fu Panda',
    image: '/images/characters/po-panda.png',
    quote: 'Skadoosh! There is no secret ingredient—it is YOUR imagination!',
    power: 'Kung Fu Story Pacing',
    positionClass: 'top-6 right-3 sm:right-6 lg:right-12',
    bubbleClass: 'top-full right-0 sm:right-4 mt-2',
    sizeClass: 'w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40',
    glowColor: 'drop-shadow-[0_12px_28px_rgba(245,158,11,0.55)]',
    animationDelay: '0.8s',
  },
  {
    id: 'stitch',
    name: 'Stitch',
    movie: 'Lilo & Stitch',
    image: '/images/characters/stitch.png',
    quote: 'Ih! Ohana means family, and family means great adventures together!',
    power: 'Galactic Imagination',
    positionClass: 'bottom-8 left-4 sm:left-10 lg:left-20 hidden md:block',
    bubbleClass: 'bottom-full left-0 mb-2',
    sizeClass: 'w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32',
    glowColor: 'drop-shadow-[0_12px_28px_rgba(59,130,246,0.6)]',
    animationDelay: '1.6s',
  },
  {
    id: 'minion',
    name: 'Bob the Minion',
    movie: 'Despicable Me',
    image: '/images/characters/minion.png',
    quote: 'Bello! Banana power + awesome grammar = UNSTOPPABLE story!',
    power: 'Wacky Humor & Energy',
    positionClass: 'bottom-10 right-4 sm:right-10 lg:right-24 hidden md:block',
    bubbleClass: 'bottom-full right-0 mb-2',
    sizeClass: 'w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32',
    glowColor: 'drop-shadow-[0_12px_28px_rgba(234,179,8,0.65)]',
    animationDelay: '0.5s',
  },
];

export function InteractiveHeroCharacters() {
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const [clickedChar, setClickedChar] = useState<string | null>(null);

  const handleCharClick = (id: string) => {
    setClickedChar(id);
    setTimeout(() => setClickedChar(null), 1200);
  };

  return (
    <>
      {HERO_CHARACTERS.map((char) => {
        const isHovered = hoveredChar === char.id;
        const isClicked = clickedChar === char.id;

        return (
          <div
            key={char.id}
            className={`absolute select-none z-20 transition-all duration-300 ${char.positionClass}`}
            style={{ animationDelay: char.animationDelay }}
            onMouseEnter={() => setHoveredChar(char.id)}
            onMouseLeave={() => setHoveredChar(null)}
            onClick={() => handleCharClick(char.id)}
          >
            {/* Interactive Character Wrapper */}
            <div
              className={`relative cursor-pointer transition-all duration-300 ease-out transform ${
                isHovered
                  ? 'scale-115 -translate-y-2 rotate-2'
                  : 'animate-float hover:scale-105'
              } ${isClicked ? 'animate-wiggle scale-125' : ''}`}
            >
              {/* Glow Aura when Hovered */}
              <div
                className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 ${
                  isHovered ? 'opacity-80 scale-125' : 'opacity-0'
                } bg-gradient-to-tr from-yellow-400 via-pink-400 to-cyan-400 -z-10`}
              />

              {/* Character Image */}
              <div className={`${char.sizeClass} relative`}>
                <Image
                  src={char.image}
                  alt={`${char.name} from ${char.movie}`}
                  fill
                  sizes="(max-width: 768px) 120px, 180px"
                  className={`object-contain transition-all duration-300 ${char.glowColor}`}
                  priority
                />
              </div>

              {/* Interactive Speech Bubble that appears on Cursor Hover */}
              <div
                className={`absolute ${char.bubbleClass} z-30 transition-all duration-300 pointer-events-none w-56 sm:w-64 ${
                  isHovered || isClicked
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-90 translate-y-2'
                }`}
              >
                <div className="bg-white/95 text-slate-900 rounded-2xl p-3 sm:p-4 shadow-2xl border-2 border-yellow-400 backdrop-blur-md relative">
                  {/* Bubble Pointer Arrow */}
                  <div className="text-[10px] uppercase font-black tracking-wider text-purple-700 flex items-center justify-between mb-1">
                    <span>{char.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold">{char.movie}</span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-800 leading-snug">
                    &ldquo;{char.quote}&rdquo;
                  </p>
                  <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-amber-600">
                    <span>Power: {char.power}</span>
                    <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                      Ready!
                    </span>
                  </div>
                </div>
              </div>

              {/* Small "Hover Me" badge pulse when not hovered */}
              {!isHovered && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-purple-900/80 backdrop-blur-xs text-[9px] font-black text-yellow-300 px-2 py-0.5 rounded-full border border-purple-500/40 opacity-0 sm:opacity-85 pointer-events-none shadow-sm transition-opacity">
                  {char.name}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
