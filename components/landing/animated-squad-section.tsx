'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, ArrowRight, Zap, Check } from 'lucide-react';

interface SquadCharacter {
  id: string;
  name: string;
  movie: string;
  category: 'all' | 'disney' | 'dreamworks' | 'adventure';
  image: string;
  tagline: string;
  quote: string;
  power: string;
  accentColor: string;
  bgGlow: string;
  stats: {
    imagination: number;
    vocabulary: number;
    adventure: number;
  };
}

const SQUAD_CHARACTERS: SquadCharacter[] = [
  {
    id: 'simba',
    name: 'Simba',
    movie: 'The Lion King',
    category: 'disney',
    image: '/images/characters/simba.png',
    tagline: 'The Pride Lands Storyteller',
    quote: 'Remember who you are! Every brave hero starts with a single written word.',
    power: 'Roar of Vivid Adjectives',
    accentColor: 'border-amber-400 bg-amber-500/10 text-amber-700',
    bgGlow: 'from-amber-400/20 to-yellow-500/20',
    stats: { imagination: 96, vocabulary: 94, adventure: 98 },
  },
  {
    id: 'po',
    name: 'Po',
    movie: 'Kung Fu Panda',
    category: 'dreamworks',
    image: '/images/characters/po-panda.png',
    tagline: 'The Legendary Dragon Warrior',
    quote: 'Skadoosh! The only secret to writing greatness is believing in your tale!',
    power: 'Kung Fu Story Pacing',
    accentColor: 'border-yellow-500 bg-yellow-500/10 text-yellow-800',
    bgGlow: 'from-yellow-400/20 to-amber-600/20',
    stats: { imagination: 95, vocabulary: 92, adventure: 99 },
  },
  {
    id: 'toothless',
    name: 'Toothless',
    movie: 'How to Train Your Dragon',
    category: 'dreamworks',
    image: '/images/characters/toothless.png',
    tagline: 'Night Fury Sky Glider',
    quote: 'Plasma Blast! Write without limits and take your readers to unseen heights!',
    power: 'Dragon Flight Metaphors',
    accentColor: 'border-purple-500 bg-purple-500/10 text-purple-700',
    bgGlow: 'from-purple-500/20 to-indigo-600/20',
    stats: { imagination: 99, vocabulary: 90, adventure: 100 },
  },
  {
    id: 'shrek',
    name: 'Shrek',
    movie: 'Shrek',
    category: 'dreamworks',
    image: '/images/characters/shrek.png',
    tagline: 'Swamp Guardian with Depth',
    quote: 'Stories have layers, like onions! The deeper you write, the richer it gets!',
    power: 'Multi-Layered Plot Twists',
    accentColor: 'border-emerald-500 bg-emerald-500/10 text-emerald-800',
    bgGlow: 'from-emerald-400/20 to-teal-600/20',
    stats: { imagination: 92, vocabulary: 93, adventure: 95 },
  },
  {
    id: 'minion',
    name: 'Bob the Minion',
    movie: 'Despicable Me',
    category: 'adventure',
    image: '/images/characters/minion.png',
    tagline: 'Giggling Word Inventor',
    quote: 'Bello! Writing should be fun, energetic, and full of banana-sized surprises!',
    power: 'Laughter-Powered Dialogue',
    accentColor: 'border-yellow-400 bg-yellow-400/10 text-yellow-700',
    bgGlow: 'from-yellow-300/25 to-amber-500/25',
    stats: { imagination: 94, vocabulary: 89, adventure: 97 },
  },
  {
    id: 'stitch',
    name: 'Stitch',
    movie: 'Lilo & Stitch',
    category: 'disney',
    image: '/images/characters/stitch.png',
    tagline: 'Galactic Chaos Maker',
    quote: 'Ih! Ohana means stories connect hearts across whole galaxies!',
    power: 'Cosmic Imagination Blasts',
    accentColor: 'border-sky-500 bg-sky-500/10 text-sky-800',
    bgGlow: 'from-sky-400/20 to-blue-600/20',
    stats: { imagination: 98, vocabulary: 91, adventure: 97 },
  },
  {
    id: 'pikachu',
    name: 'Pikachu',
    movie: 'Detective Pikachu / Pokémon',
    category: 'adventure',
    image: '/images/characters/pikachu.png',
    tagline: 'Electric Detective Mentor',
    quote: 'Pika-Pika! Zap boredom away with thrilling mystery clues and exclamation marks!',
    power: 'Electric Mystery Hooks',
    accentColor: 'border-amber-400 bg-amber-400/10 text-amber-800',
    bgGlow: 'from-yellow-400/25 to-amber-500/25',
    stats: { imagination: 96, vocabulary: 95, adventure: 98 },
  },
  {
    id: 'sonic',
    name: 'Sonic',
    movie: 'Sonic The Hedgehog',
    category: 'adventure',
    image: '/images/characters/sonic.png',
    tagline: 'Supersonic Speed Author',
    quote: 'Gotta go fast! Never let writer’s block catch up with your lightning ideas!',
    power: 'High-Velocity Action Sentences',
    accentColor: 'border-blue-500 bg-blue-500/10 text-blue-800',
    bgGlow: 'from-blue-400/20 to-indigo-600/20',
    stats: { imagination: 93, vocabulary: 90, adventure: 100 },
  },
  {
    id: 'toy-story',
    name: 'Woody & Buzz',
    movie: 'Toy Story',
    category: 'disney',
    image: '/images/characters/toy-story.png',
    tagline: 'Partners in Storytelling',
    quote: 'To infinity and beyond! You have a friend in every chapter you write.',
    power: 'Heroic Dialogue & Friendship',
    accentColor: 'border-indigo-500 bg-indigo-500/10 text-indigo-800',
    bgGlow: 'from-indigo-400/20 to-purple-600/20',
    stats: { imagination: 97, vocabulary: 96, adventure: 99 },
  },
  {
    id: 'scrat',
    name: 'Scrat',
    movie: 'Ice Age',
    category: 'adventure',
    image: '/images/characters/scrat.png',
    tagline: 'Tenacious Acorn Chaser',
    quote: 'Squeeeak! Never give up on your goal, no matter what cliffs you fall from!',
    power: 'Relentless Determination Arc',
    accentColor: 'border-orange-500 bg-orange-500/10 text-orange-800',
    bgGlow: 'from-orange-400/20 to-amber-600/20',
    stats: { imagination: 91, vocabulary: 88, adventure: 99 },
  },
  {
    id: 'nemo',
    name: 'Nemo',
    movie: 'Finding Nemo',
    category: 'disney',
    image: '/images/characters/nemo.png',
    tagline: 'Brave Ocean Explorer',
    quote: 'Just keep writing! Even small fish can explore the biggest oceans.',
    power: 'Deep Sea Sensory Descriptions',
    accentColor: 'border-cyan-500 bg-cyan-500/10 text-cyan-800',
    bgGlow: 'from-cyan-400/20 to-teal-600/20',
    stats: { imagination: 95, vocabulary: 93, adventure: 96 },
  },
  {
    id: 'penguin',
    name: 'Mumble',
    movie: 'Happy Feet',
    category: 'adventure',
    image: '/images/characters/penguin.png',
    tagline: 'Rhythm & Heart Pioneer',
    quote: 'Tap into your own unique beat! The best story is the one only you can tell.',
    power: 'Poetic Rhythm & Flow',
    accentColor: 'border-teal-500 bg-teal-500/10 text-teal-800',
    bgGlow: 'from-teal-400/20 to-emerald-600/20',
    stats: { imagination: 94, vocabulary: 95, adventure: 93 },
  },
];

export function AnimatedSquadSection() {
  const [filter, setFilter] = useState<'all' | 'disney' | 'dreamworks' | 'adventure'>('all');
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const [selectedCompanion, setSelectedCompanion] = useState<SquadCharacter>(SQUAD_CHARACTERS[0]);

  const filtered = filter === 'all'
    ? SQUAD_CHARACTERS
    : SQUAD_CHARACTERS.filter((c) => c.category === filter);

  return (
    <section className="w-full bg-gradient-to-b from-[#0b0621] via-[#150d3d] to-[#0b0621] py-24 text-white relative overflow-hidden border-y-4 border-purple-900/60">
      {/* Background starlight */}
      <div className="absolute inset-0 stars-pattern opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="amber" className="mb-3 text-xs uppercase tracking-wider font-black px-4 py-1">
            Famous Movie Animation Characters
          </Badge>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Meet Your Animated Writing Mentors
          </h2>
          <p className="mt-4 text-base sm:text-xl text-purple-200 font-medium">
            Hover your cursor over any movie character to hear their writing advice, unlock their superpowers, and choose your favorite story companion!
          </p>

          {/* Studio Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { id: 'all', label: 'All 12 Movie Characters' },
              { id: 'disney', label: 'Disney & Pixar' },
              { id: 'dreamworks', label: 'DreamWorks' },
              { id: 'adventure', label: 'Action & Adventure' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as typeof filter)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-yellow-400 text-purple-950 shadow-lg shadow-yellow-400/30 scale-105'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/80 border border-purple-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Active Companion Banner */}
        <div className="mb-12 rounded-3xl border-2 border-yellow-400/60 bg-gradient-to-r from-purple-950/90 via-purple-900/80 to-purple-950/90 p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl bg-gradient-to-tr from-yellow-400/20 to-purple-400/20 p-2 border-2 border-yellow-400/50 shadow-inner flex items-center justify-center">
                <Image
                  src={selectedCompanion.image}
                  alt={selectedCompanion.name}
                  fill
                  sizes="120px"
                  className="object-contain drop-shadow-[0_8px_20px_rgba(251,191,36,0.6)] animate-wiggle"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-yellow-300 uppercase tracking-wider">
                    Current Featured Companion
                  </span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                  {selectedCompanion.name}{' '}
                  <span className="text-sm font-bold text-purple-300">({selectedCompanion.movie})</span>
                </h3>
                <p className="text-sm text-yellow-100 font-extrabold mt-1">
                  &ldquo;{selectedCompanion.quote}&rdquo;
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-black text-purple-200">
                  <span className="bg-purple-900/90 px-2.5 py-1 rounded-full border border-purple-700">
                    ⚡ {selectedCompanion.power}
                  </span>
                  <span className="bg-purple-900/90 px-2.5 py-1 rounded-full border border-purple-700">
                    🌟 Imagination {selectedCompanion.stats.imagination}%
                  </span>
                  <span className="bg-purple-900/90 px-2.5 py-1 rounded-full border border-purple-700">
                    📖 Vocab Boost {selectedCompanion.stats.vocabulary}%
                  </span>
                </div>
              </div>
            </div>

            <Link href="/auth/register">
              <Button
                variant="yellow"
                size="lg"
                className="font-black text-sm px-6 h-12 shadow-xl whitespace-nowrap shrink-0"
              >
                Write with {selectedCompanion.name} Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 12 Character Interactive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((char) => {
            const isHovered = hoveredChar === char.id;
            const isSelected = selectedCompanion.id === char.id;

            return (
              <Card
                key={char.id}
                onMouseEnter={() => setHoveredChar(char.id)}
                onMouseLeave={() => setHoveredChar(null)}
                onClick={() => setSelectedCompanion(char)}
                className={`relative rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-visible group ${
                  isSelected
                    ? 'border-yellow-400 bg-purple-950 shadow-xl shadow-yellow-400/20'
                    : 'border-purple-800/60 bg-[#160d3d]/90 hover:border-yellow-400/80 hover:bg-[#1f1254] hover:-translate-y-2'
                }`}
              >
                {/* Floating Glow Behind Character */}
                <div
                  className={`absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-tr ${char.bgGlow} rounded-full blur-2xl transition-opacity duration-300 pointer-events-none ${
                    isHovered ? 'opacity-100 scale-125' : 'opacity-40'
                  }`}
                />

                <CardContent className="p-5 text-center relative z-10 flex flex-col items-center">
                  {/* Speech Bubble on Cursor Hover */}
                  <div
                    className={`absolute -top-14 left-1/2 -translate-x-1/2 w-60 z-30 transition-all duration-300 pointer-events-none ${
                      isHovered
                        ? 'opacity-100 scale-100 -translate-y-1'
                        : 'opacity-0 scale-90 translate-y-2'
                    }`}
                  >
                    <div className="bg-white text-slate-900 rounded-2xl p-2.5 shadow-2xl border-2 border-yellow-400 text-left relative">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-purple-700 uppercase">
                        <MessageCircle className="h-3 w-3 text-yellow-500 fill-yellow-400" />
                        <span>{char.name} Says:</span>
                      </div>
                      <p className="text-[11px] font-extrabold text-slate-800 leading-snug mt-0.5 line-clamp-2">
                        &ldquo;{char.quote}&rdquo;
                      </p>
                      {/* Triangle Pointer */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-yellow-400" />
                    </div>
                  </div>

                  {/* Character PNG with Hover Zoom & Tilt */}
                  <div
                    className={`relative w-36 h-36 sm:w-40 sm:h-40 my-2 transition-transform duration-300 ease-out ${
                      isHovered ? 'scale-115 -rotate-2 -translate-y-2' : 'group-hover:scale-105'
                    }`}
                  >
                    <Image
                      src={char.image}
                      alt={`${char.name} character cutout`}
                      fill
                      sizes="180px"
                      className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
                    />
                  </div>

                  {/* Title & Franchise */}
                  <div className="w-full mt-2">
                    <span className="text-[10px] uppercase font-black tracking-wider text-yellow-400 block">
                      {char.movie}
                    </span>
                    <h4 className="font-display font-black text-xl text-white mt-0.5 flex items-center justify-center gap-1.5">
                      {char.name}
                      {isSelected && (
                        <Check className="h-4 w-4 text-yellow-400 inline" />
                      )}
                    </h4>
                    <p className="text-xs text-purple-300 font-bold mt-0.5">
                      {char.tagline}
                    </p>
                  </div>

                  {/* Power Badge */}
                  <div className="mt-3 w-full">
                    <div className="rounded-xl bg-purple-900/60 border border-purple-700/60 p-2 text-left space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-black">
                        <span className="text-yellow-300 flex items-center gap-1">
                          <Zap className="h-3 w-3" /> {char.power}
                        </span>
                        <span className="text-purple-300">{char.stats.adventure}%</span>
                      </div>
                      <div className="w-full bg-purple-950 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${char.stats.adventure}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interactive Button */}
                  <div className="mt-3 w-full">
                    <button
                      type="button"
                      className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-yellow-400 text-purple-950 shadow-md font-black'
                          : 'bg-purple-800/50 hover:bg-yellow-400 hover:text-purple-950 text-purple-200'
                      }`}
                    >
                      {isSelected ? 'Selected Companion' : `Pick ${char.name}`}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Squad Callout */}
        <div className="mt-14 text-center">
          <p className="text-sm font-bold text-purple-300">
            Every young writer gets to unlock and write alongside their favorite animated movie friends.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button variant="yellow" size="lg" className="font-black text-sm px-8">
                Create Free Account & Choose Your Mentor &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
