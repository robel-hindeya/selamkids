'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Trophy,
  ArrowRight,
  Volume2,
  VolumeX,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WordBubble {
  id: number;
  word: string;
  color: string;
  borderColor: string;
  x: number; // percentage
  y: number; // percentage
  size: number;
  popped: boolean;
}

const INITIAL_BUBBLES: WordBubble[] = [
  { id: 1, word: 'SPARKLE!', color: 'from-amber-400 to-yellow-300', borderColor: 'border-yellow-200', x: 12, y: 18, size: 76, popped: false },
  { id: 2, word: 'ROAR!', color: 'from-rose-500 to-amber-500', borderColor: 'border-rose-300', x: 82, y: 22, size: 70, popped: false },
  { id: 3, word: 'KAPOW!', color: 'from-cyan-400 to-blue-500', borderColor: 'border-cyan-200', x: 25, y: 68, size: 74, popped: false },
  { id: 4, word: 'GIGANTIC', color: 'from-emerald-400 to-teal-500', borderColor: 'border-emerald-200', x: 74, y: 72, size: 80, popped: false },
  { id: 5, word: 'WHISPER', color: 'from-purple-500 to-pink-500', borderColor: 'border-pink-300', x: 48, y: 12, size: 72, popped: false },
  { id: 6, word: 'MAGICAL', color: 'from-fuchsia-500 to-purple-600', borderColor: 'border-fuchsia-300', x: 50, y: 80, size: 78, popped: false },
];

const FUN_WORDS = [
  'THUNDER!', 'GLOWING', 'BRAVE', 'COSMIC', 'ZOOM!', 'FEARLESS', 'DAZZLING', 'MYSTERY', 'SPLASH!', 'NIGHTFALL'
];

interface CreatureInteraction {
  id: string;
  name: string;
  characterImg: string;
  characterAlt: string;
  quote: string;
  sound: 'giggle' | 'spark' | 'roar' | 'whoosh' | 'boing';
  shapeStyle: string;
  animationClass: string;
}

export function WonderZoneSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<WordBubble[]>(INITIAL_BUBBLES);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [orbsFound, setOrbsFound] = useState<number>(0);
  const [pokedCreature, setPokedCreature] = useState<string | null>(null);
  const [creatureSpeech, setCreatureSpeech] = useState<{ id: string; text: string } | null>(null);
  const [chestOpen, setChestOpen] = useState<boolean>(false);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  // Subtle web audio sound effects for interactive kid delight
  const playKidSound = (type: 'pop' | 'spark' | 'chest' | 'boing' | 'giggle') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'pop') {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'spark') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.setValueAtTime(900, now + 0.05);
        osc.frequency.setValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'boing') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.linearRampToValueAtTime(500, now + 0.12);
        osc.frequency.linearRampToValueAtTime(320, now + 0.22);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'chest' || type === 'giggle') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.1);
        osc.frequency.setValueAtTime(659.25, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch {
      // Audio not supported or blocked by browser policy
    }
  };

  // Pop a bubble word
  const handlePopBubble = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    playKidSound('pop');
    setOrbsFound((prev) => prev + 10);

    // Spawn floating star particle at click coordinates
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const newParticle = { id: Date.now(), x: clickX, y: clickY, text: '+10 ⭐' };
      setFloatingParticles((prev) => [...prev, newParticle]);
      setTimeout(() => {
        setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 1500);
    }

    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    // Respawn with a new word after 1.8 seconds
    setTimeout(() => {
      const randomWord = FUN_WORDS[Math.floor(Math.random() * FUN_WORDS.length)];
      setBubbles((prev) =>
        prev.map((b) => (b.id === id ? { ...b, word: randomWord, popped: false } : b))
      );
    }, 1800);
  };

  // Click on a creature
  const handlePokeCreature = (creature: CreatureInteraction, e: React.MouseEvent) => {
    e.stopPropagation();
    playKidSound(creature.sound === 'spark' ? 'spark' : 'boing');
    setPokedCreature(creature.id);
    setCreatureSpeech({ id: creature.id, text: creature.quote });
    setOrbsFound((prev) => prev + 5);

    // Spawn particle
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const newParticle = { id: Date.now(), x: clickX, y: clickY, text: '✨ +5 Orbs!' };
      setFloatingParticles((prev) => [...prev, newParticle]);
      setTimeout(() => {
        setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 1500);
    }

    setTimeout(() => setPokedCreature(null), 800);
    setTimeout(() => setCreatureSpeech(null), 3800);
  };

  // Open Mystery Treasure Chest
  const handleOpenChest = () => {
    if (chestOpen) return;
    playKidSound('chest');
    setChestOpen(true);
    setOrbsFound((prev) => prev + 25);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#10072d] text-white py-16 sm:py-24 border-b-4 border-purple-900/60 select-none"
    >
      {/* Background Starry Nebula */}
      <div className="absolute inset-0 stars-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-pink-600/25 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/15 blur-[160px] rounded-full pointer-events-none" />

      {/* Floating coordinates particles */}
      {floatingParticles.map((p) => (
        <div
          key={p.id}
          style={{ left: p.x, top: p.y }}
          className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 font-display font-black text-sm text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-out fade-out slide-out-to-top-8 duration-1000"
        >
          {p.text}
        </div>
      ))}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            HEADER: KID WONDERLAND & SCOREBOARD
            ========================================================================= */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10">
          <div className="text-center md:text-left space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-800 to-indigo-900 px-4 py-1.5 border-2 border-purple-400/50 shadow-md">
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
              <span className="font-display font-black text-xs uppercase tracking-wider text-yellow-300">
                The Living Creature Playground
              </span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                TOUCH & PLAY
              </span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              Where Words Take <span className="text-yellow-300 underline decoration-pink-500 decoration-wavy decoration-3">Wild Shapes</span>!
            </h2>
            <p className="text-purple-200 text-sm sm:text-base font-medium">
              Poke the animated companions, pop the floating vocabulary bubbles, and tap the mystery chest to collect hidden glowing orbs!
            </p>
          </div>

          {/* Kid Interactive Scoreboard & Sound Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-950/80 border-2 border-amber-400/70 px-5 py-3 shadow-xl">
              <Trophy className="h-5 w-5 text-amber-400 fill-amber-400 animate-bounce" />
              <div>
                <span className="text-[10px] font-bold text-purple-300 uppercase block">Playground Orbs</span>
                <span className="font-display font-black text-xl text-yellow-300 leading-none">
                  {orbsFound} Collected
                </span>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Playground Sounds' : 'Turn On Sounds'}
              className="p-3.5 rounded-2xl bg-purple-950/90 border-2 border-purple-700 hover:border-yellow-400 text-purple-200 hover:text-white transition-all shadow-md active:scale-95"
            >
              {soundEnabled ? <Volume2 className="h-5 w-5 text-yellow-300" /> : <VolumeX className="h-5 w-5 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* =========================================================================
            THE PLAYGROUND: UNDEFINED MORPHING SHAPES WITH ANIMATED CHARACTERS
            ========================================================================= */}
        <div className="relative min-h-[580px] sm:min-h-[620px] w-full rounded-4xl bg-gradient-to-b from-[#180a3a]/80 via-[#130730]/90 to-[#0c0422]/95 border-4 border-purple-700/60 p-4 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
          
          {/* Subtle grid runes and cosmic sparkles inside */}
          <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

          {/* ---------------------------------------------------------------------
              POPPING FLOATING WORD BUBBLES (Interactive kid delight!)
              --------------------------------------------------------------------- */}
          {bubbles.map((b) => (
            <div
              key={b.id}
              onClick={(e) => handlePopBubble(b.id, e)}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
              }}
              className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                b.popped ? 'scale-0 opacity-0' : 'animate-bubble-float hover:scale-125'
              }`}
            >
              <div
                className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${b.color} border-2 ${b.borderColor} shadow-lg shadow-yellow-400/30 p-2 text-center text-slate-950 font-display font-black text-xs sm:text-sm drop-shadow select-none group`}
                style={{ width: `${b.size}px`, height: `${b.size}px` }}
              >
                {/* Bubble glossy highlight */}
                <div className="absolute top-1.5 left-2 w-3.5 h-2 bg-white/70 rounded-full rotate-[-30deg] pointer-events-none" />
                <span className="leading-tight px-1 group-hover:scale-110 transition-transform">
                  {b.word}
                </span>
                <span className="absolute -bottom-2 -right-1 text-[9px] bg-slate-950 text-yellow-300 px-1.5 py-0.5 rounded-full font-mono font-bold shadow">
                  +10⭐
                </span>
              </div>
            </div>
          ))}

          {/* ---------------------------------------------------------------------
              UNDEFINED MORPHING SHAPE 1: STITCH ON THE PURPLE-PINK COSMIC BLOB
              --------------------------------------------------------------------- */}
          <div className="absolute top-8 left-4 sm:left-12 z-20">
            {/* The undefined morphing blob */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 bg-gradient-to-tr from-purple-700/60 via-pink-600/40 to-indigo-600/50 backdrop-blur-md border-3 border-pink-400/50 shadow-2xl shadow-purple-900/60 animate-blob-morph-1 flex items-center justify-center">
              
              {/* Stitch character peeking over blob */}
              <div
                onClick={(e) =>
                  handlePokeCreature(
                    {
                      id: 'stitch',
                      name: 'Stitch',
                      characterImg: '/images/characters/stitch.png',
                      characterAlt: 'Stitch',
                      quote: 'Ih! Blue mischief monster ready to write wild space adventures! 🚀',
                      sound: 'giggle',
                      shapeStyle: '',
                      animationClass: '',
                    },
                    e
                  )
                }
                className={`group relative w-36 h-36 sm:w-44 sm:h-44 cursor-pointer transition-transform duration-200 ${
                  pokedCreature === 'stitch' ? 'scale-125 -rotate-12 animate-wiggle' : 'animate-float hover:scale-110'
                }`}
              >
                <Image
                  src="/images/characters/stitch.png"
                  alt="Stitch"
                  fill
                  className="object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)]"
                />

                {/* Character Speech Popover */}
                {creatureSpeech?.id === 'stitch' && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 bg-purple-950 border-2 border-yellow-400 text-yellow-300 font-display font-black text-xs p-2.5 rounded-2xl shadow-2xl z-40 animate-in zoom-in-90">
                    {creatureSpeech.text}
                  </div>
                )}

                {/* Interactive Poke Tooltip */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-pink-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow pointer-events-none">
                  Tap Stitch! 🐾
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------------
              UNDEFINED MORPHING SHAPE 2: PIKACHU ON THE NEON YELLOW STAR LAGOON
              --------------------------------------------------------------------- */}
          <div className="absolute top-10 right-4 sm:right-16 z-20">
            {/* The undefined morphing blob */}
            <div className="relative w-56 h-56 sm:w-68 sm:h-68 bg-gradient-to-bl from-yellow-500/40 via-amber-600/30 to-purple-800/40 backdrop-blur-md border-3 border-yellow-300/60 shadow-2xl shadow-yellow-500/30 animate-blob-morph-2 flex items-center justify-center">
              
              {/* Pikachu Character */}
              <div
                onClick={(e) =>
                  handlePokeCreature(
                    {
                      id: 'pikachu',
                      name: 'Pikachu',
                      characterImg: '/images/characters/pikachu.png',
                      characterAlt: 'Pikachu',
                      quote: 'Pika-pi! Electrifying verbs make every reader jump with joy! ⚡',
                      sound: 'spark',
                      shapeStyle: '',
                      animationClass: '',
                    },
                    e
                  )
                }
                className={`group relative w-36 h-36 sm:w-44 sm:h-44 cursor-pointer transition-transform duration-200 ${
                  pokedCreature === 'pikachu' ? 'scale-125 rotate-12 animate-wiggle' : 'animate-float hover:scale-110'
                }`}
              >
                <Image
                  src="/images/characters/pikachu.png"
                  alt="Pikachu"
                  fill
                  className="object-contain drop-shadow-[0_12px_20px_rgba(255,204,0,0.6)]"
                />

                {/* Character Speech */}
                {creatureSpeech?.id === 'pikachu' && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 bg-slate-950 border-2 border-yellow-400 text-yellow-300 font-display font-black text-xs p-2.5 rounded-2xl shadow-2xl z-40 animate-in zoom-in-90">
                    {creatureSpeech.text}
                  </div>
                )}

                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow pointer-events-none">
                  Spark Pikachu! ⚡
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------------
              CENTERPIECE: TOOTHLESS THE FLYING NIGHT DRAGON SOARING OVER THE VOID
              --------------------------------------------------------------------- */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center">
            
            {/* Morphing Starlight Nebula Halo */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-r from-purple-900/40 via-cyan-900/30 to-purple-950/50 backdrop-blur-md rounded-[50%_50%_40%_60%/40%_60%_50%_50%] border-2 border-purple-500/40 shadow-inner flex items-center justify-center">
              
              {/* Toothless Flying */}
              <div
                onClick={(e) =>
                  handlePokeCreature(
                    {
                      id: 'toothless',
                      name: 'Toothless',
                      characterImg: '/images/characters/toothless.png',
                      characterAlt: 'Toothless',
                      quote: 'Rrrr! Spread your wings and soar into uncharted fantasy worlds! 🐉',
                      sound: 'spark',
                      shapeStyle: '',
                      animationClass: '',
                    },
                    e
                  )
                }
                className={`group relative w-48 h-48 sm:w-60 sm:h-60 cursor-pointer transition-transform duration-300 ${
                  pokedCreature === 'toothless' ? 'scale-120 animate-wiggle' : 'animate-float hover:scale-115'
                }`}
              >
                <Image
                  src="/images/characters/toothless.png"
                  alt="Toothless"
                  fill
                  className="object-contain drop-shadow-[0_16px_28px_rgba(147,51,234,0.7)]"
                />

                {/* Speech */}
                {creatureSpeech?.id === 'toothless' && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-52 bg-purple-950 border-2 border-cyan-400 text-cyan-200 font-display font-black text-xs p-2.5 rounded-2xl shadow-2xl z-40 animate-in zoom-in-90">
                    {creatureSpeech.text}
                  </div>
                )}

                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-purple-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow pointer-events-none">
                  Pet Toothless! 🐾
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------------
              UNDEFINED MORPHING SHAPE 3: MINION ON THE BOUNCY CYAN CORAL BLOB
              --------------------------------------------------------------------- */}
          <div className="absolute bottom-6 left-6 sm:left-24 z-20">
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 bg-gradient-to-tr from-cyan-600/40 via-blue-500/30 to-purple-700/40 backdrop-blur-md border-3 border-cyan-300/50 shadow-2xl animate-blob-morph-2 flex items-center justify-center">
              
              {/* Minion */}
              <div
                onClick={(e) =>
                  handlePokeCreature(
                    {
                      id: 'minion',
                      name: 'Minion Bob',
                      characterImg: '/images/characters/minion.png',
                      characterAlt: 'Minion',
                      quote: 'Bello! Banana! Writing stories is more fun than stealing the moon! 🍌',
                      sound: 'giggle',
                      shapeStyle: '',
                      animationClass: '',
                    },
                    e
                  )
                }
                className={`group relative w-36 h-36 sm:w-40 sm:h-40 cursor-pointer transition-transform duration-200 ${
                  pokedCreature === 'minion' ? 'scale-125 -rotate-12 animate-wiggle' : 'animate-float hover:scale-110'
                }`}
              >
                <Image
                  src="/images/characters/minion.png"
                  alt="Minion"
                  fill
                  className="object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.6)]"
                />

                {creatureSpeech?.id === 'minion' && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 bg-slate-950 border-2 border-yellow-300 text-yellow-300 font-display font-black text-xs p-2.5 rounded-2xl shadow-2xl z-40 animate-in zoom-in-90">
                    {creatureSpeech.text}
                  </div>
                )}

                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-cyan-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow pointer-events-none">
                  Tickle Minion! 🍌
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------------
              UNDEFINED MORPHING SHAPE 4: SCRAT CHASING HIS GLOWING ACORN
              --------------------------------------------------------------------- */}
          <div className="absolute bottom-6 right-6 sm:right-24 z-20">
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 bg-gradient-to-tl from-amber-600/40 via-orange-500/30 to-purple-800/40 backdrop-blur-md border-3 border-amber-300/60 shadow-2xl animate-blob-morph-1 flex items-center justify-center">
              
              {/* Scrat */}
              <div
                onClick={(e) =>
                  handlePokeCreature(
                    {
                      id: 'scrat',
                      name: 'Scrat',
                      characterImg: '/images/characters/scrat.png',
                      characterAlt: 'Scrat',
                      quote: 'Squeak! Hold onto your best ideas like a golden cosmic acorn! 🌰',
                      sound: 'boing',
                      shapeStyle: '',
                      animationClass: '',
                    },
                    e
                  )
                }
                className={`group relative w-36 h-36 sm:w-40 sm:h-40 cursor-pointer transition-transform duration-200 ${
                  pokedCreature === 'scrat' ? 'scale-125 rotate-12 animate-wiggle' : 'animate-float hover:scale-110'
                }`}
              >
                <Image
                  src="/images/characters/scrat.png"
                  alt="Scrat"
                  fill
                  className="object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.6)]"
                />

                {creatureSpeech?.id === 'scrat' && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 bg-slate-950 border-2 border-orange-400 text-amber-300 font-display font-black text-xs p-2.5 rounded-2xl shadow-2xl z-40 animate-in zoom-in-90">
                    {creatureSpeech.text}
                  </div>
                )}

                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow pointer-events-none">
                  Help Scrat! 🌰
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------------
              INTERACTIVE MYSTERY TREASURE CHEST (Center bottom secret reward!)
              --------------------------------------------------------------------- */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30">
            <button
              onClick={handleOpenChest}
              className={`btn-3d group relative flex flex-col items-center justify-center p-3 rounded-3xl transition-all duration-300 ${
                chestOpen
                  ? 'bg-amber-500/20 border-2 border-yellow-300 scale-105'
                  : 'bg-purple-950/80 hover:bg-purple-900 border-2 border-amber-400 animate-bounce'
              }`}
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl filter drop-shadow">
                  {chestOpen ? '💎' : '🎁'}
                </span>
              </div>
              <span className="text-[11px] font-display font-black text-yellow-300 tracking-wider">
                {chestOpen ? '✨ SECRET UNLOCKED! (+25⭐)' : 'TAP TO OPEN MYSTERY CHEST!'}
              </span>
            </button>
          </div>

        </div>

        {/* =========================================================================
            BOTTOM STRIP: KID INVITATION CTA
            ========================================================================= */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-purple-950/80 via-[#1c0d45] to-purple-950/80 border-2 border-amber-400/50 shadow-xl">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-md shrink-0">
              <Star className="h-6 w-6 fill-slate-950" />
            </div>
            <div>
              <h4 className="font-display font-black text-white text-base">
                Ready to create your own animated character and write legendary tales?
              </h4>
              <p className="text-xs text-purple-200 font-medium">
                Choose your companion beast, level up vocabulary, and battle the shadow Grims!
              </p>
            </div>
          </div>

          <Link href="/auth/register?role=KID">
            <Button className="btn-3d btn-3d-yellow shrink-0 gap-2 font-display font-black text-sm px-6 py-4 rounded-2xl">
              Start Free Young Author Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
