'use client';

import * as React from 'react';
import Image from 'next/image';
import { Check, ChevronDown, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface CreatureCharacter {
  id: string;
  name: string;
  series: string;
  tagline: string;
  imageUrl: string;
}

export const CREATURE_CHARACTERS: CreatureCharacter[] = [
  {
    id: 'Simba',
    name: 'Simba',
    series: 'The Lion King',
    tagline: 'Brave & Roaring King',
    imageUrl: '/images/characters/simba.png',
  },
  {
    id: 'Po',
    name: 'Po Panda',
    series: 'Kung Fu Panda',
    tagline: 'Legendary Dragon Warrior',
    imageUrl: '/images/characters/po-panda.png',
  },
  {
    id: 'Toothless',
    name: 'Toothless',
    series: 'How to Train Your Dragon',
    tagline: 'Mythical Night Fury',
    imageUrl: '/images/characters/toothless.png',
  },
  {
    id: 'Stitch',
    name: 'Stitch',
    series: 'Lilo & Stitch',
    tagline: 'Galactic Wild Adventurer',
    imageUrl: '/images/characters/stitch.png',
  },
  {
    id: 'Minion',
    name: 'Minion',
    series: 'Despicable Me',
    tagline: 'Wacky, Joyful & Mischievous',
    imageUrl: '/images/characters/minion.png',
  },
  {
    id: 'Pikachu',
    name: 'Pikachu',
    series: 'Pokémon',
    tagline: 'Electric Spark of Imagination',
    imageUrl: '/images/characters/pikachu.png',
  },
  {
    id: 'Sonic',
    name: 'Sonic',
    series: 'Sonic the Hedgehog',
    tagline: 'Supersonic Speed & Freedom',
    imageUrl: '/images/characters/sonic.png',
  },
  {
    id: 'Shrek',
    name: 'Shrek',
    series: 'Shrek',
    tagline: 'Big-Hearted Forest Hero',
    imageUrl: '/images/characters/shrek.png',
  },
  {
    id: 'Nemo',
    name: 'Nemo',
    series: 'Finding Nemo',
    tagline: 'Brave Ocean Explorer',
    imageUrl: '/images/characters/nemo.png',
  },
  {
    id: 'Scrat',
    name: 'Scrat',
    series: 'Ice Age',
    tagline: 'Nutty Acorn Hunter',
    imageUrl: '/images/characters/scrat.png',
  },
  {
    id: 'Penguin',
    name: 'Skipper Penguin',
    series: 'Madagascar',
    tagline: 'Secret Agent Tactician',
    imageUrl: '/images/characters/penguin.png',
  },
  {
    id: 'Woody',
    name: 'Woody',
    series: 'Toy Story',
    tagline: 'Loyal Wild West Partner',
    imageUrl: '/images/characters/toy-story.png',
  },
];

interface CreatureCustomizerFormProps {
  initialKid: {
    nickname: string;
    grade_level: string;
    creature_name?: string | null;
    creature_type?: string | null;
    creature_image_url?: string | null;
  };
  updateAction: (formData: FormData) => Promise<void>;
}

export function CreatureCustomizerForm({
  initialKid,
  updateAction,
}: CreatureCustomizerFormProps) {
  // Find initial character based on saved creature_type or creature_image_url
  const defaultChar = React.useMemo(() => {
    if (initialKid.creature_type) {
      const match = CREATURE_CHARACTERS.find(
        (c) =>
          c.id.toLowerCase() === initialKid.creature_type?.toLowerCase() ||
          c.name.toLowerCase().includes(initialKid.creature_type?.toLowerCase() || '')
      );
      if (match) return match;
    }
    if (initialKid.creature_image_url) {
      const matchImg = CREATURE_CHARACTERS.find(
        (c) => c.imageUrl === initialKid.creature_image_url
      );
      if (matchImg) return matchImg;
    }
    return CREATURE_CHARACTERS[0];
  }, [initialKid.creature_type, initialKid.creature_image_url]);

  const [selectedChar, setSelectedChar] = React.useState<CreatureCharacter>(defaultChar);
  const [creatureName, setCreatureName] = React.useState(initialKid.creature_name || 'Brave Maji');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectCharacter = (character: CreatureCharacter) => {
    setSelectedChar(character);
    setIsDropdownOpen(false);
  };

  return (
    <Card
      id="creature-customizer"
      className="shadow-xl border-4 border-purple-200/80 dark:border-purple-800/80 bg-white dark:bg-[#12092e] rounded-4xl overflow-hidden transition-colors"
    >
      {/* Dynamic Header: Instantly shows the selected character */}
      <CardHeader className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 dark:from-[#1b0b42] dark:via-[#261358] dark:to-[#170838] border-b-2 border-purple-100 dark:border-purple-800/60 p-6 sm:p-8 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Live Character Avatar */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-amber-400 text-amber-950 shadow-xl shadow-amber-400/30 overflow-hidden p-2 ring-4 ring-amber-300/60 dark:ring-amber-400/40 transition-transform duration-300 hover:scale-105">
              <Image
                key={selectedChar.id}
                src={selectedChar.imageUrl}
                alt={selectedChar.name}
                width={72}
                height={72}
                className="w-16 h-16 object-contain drop-shadow-md transition-all duration-300 animate-in zoom-in-75"
                priority
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                  {selectedChar.name}
                </CardTitle>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 text-purple-900 dark:bg-purple-900/70 dark:text-purple-200 border border-purple-200 dark:border-purple-700 px-2.5 py-0.5 text-[11px] font-black">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  {selectedChar.series}
                </span>
              </div>
              <p className="text-purple-600 dark:text-purple-300 font-bold text-xs sm:text-sm mt-0.5">
                {selectedChar.tagline}
              </p>
              <CardDescription className="text-slate-500 dark:text-purple-200/70 font-medium text-xs mt-1">
                Your companion journeys with you across every writing quest and battles word monsters.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        <form action={updateAction} className="space-y-6">
          {/* Hidden inputs to pass selected character data */}
          <input type="hidden" name="creatureType" value={selectedChar.id} />
          <input type="hidden" name="creatureImageUrl" value={selectedChar.imageUrl} />

          {/* Row 1: Nickname & Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Your Explorer Nickname"
              name="nickname"
              defaultValue={initialKid.nickname}
              required
            />

            <Input
              label="Grade / Year Group"
              name="gradeLevel"
              defaultValue={initialKid.grade_level}
              required
            />
          </div>

          {/* Row 2: Companion Name & Creature Species Custom Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Companion Creature Name"
              name="creatureName"
              value={creatureName}
              onChange={(e) => setCreatureName(e.target.value)}
              placeholder="e.g. Captain Fluff"
              required
            />

            {/* Custom Dropdown UI for Creature Species */}
            <div className="relative space-y-1.5" ref={dropdownRef}>
              <label className="block text-xs font-display font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
                Creature Species & Character
              </label>

              {/* Dropdown Trigger Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={cn(
                  'w-full flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl border-2 transition-all cursor-pointer shadow-sm text-left',
                  isDropdownOpen
                    ? 'border-purple-500 ring-4 ring-purple-500/20 bg-white dark:bg-[#160a36]'
                    : 'border-slate-200 dark:border-purple-800/80 bg-white dark:bg-[#160a36] hover:border-purple-300 dark:hover:border-purple-700'
                )}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 flex items-center justify-center overflow-hidden p-1">
                    <Image
                      src={selectedChar.imageUrl}
                      alt={selectedChar.name}
                      width={36}
                      height={36}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="min-w-0 truncate">
                    <div className="font-display font-black text-sm text-slate-900 dark:text-white truncate">
                      {selectedChar.name}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-300/80 font-medium truncate">
                      {selectedChar.series} • {selectedChar.tagline}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center pr-1 text-slate-400 dark:text-purple-300">
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 transition-transform duration-200',
                      isDropdownOpen && 'rotate-180 text-purple-600 dark:text-purple-300'
                    )}
                  />
                </div>
              </button>

              {/* Dropdown Menu Popover */}
              {isDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute z-50 left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-3xl border-2 border-purple-200 dark:border-purple-700/80 bg-white/95 dark:bg-[#140833]/95 backdrop-blur-xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-wider text-purple-600 dark:text-purple-300 border-b border-purple-100 dark:border-purple-800/60 mb-1">
                    Choose Your Companion Character:
                  </div>

                  {CREATURE_CHARACTERS.map((char) => {
                    const isSelected = selectedChar.id === char.id;
                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => handleSelectCharacter(char)}
                        role="option"
                        aria-selected={isSelected}
                        className={cn(
                          'w-full flex items-center justify-between gap-3 p-2 rounded-2xl transition-all cursor-pointer text-left',
                          isSelected
                            ? 'bg-purple-100/90 text-purple-950 dark:bg-purple-900/60 dark:text-white font-black border border-purple-300/80 dark:border-purple-700'
                            : 'text-slate-700 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/50'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              'h-10 w-10 shrink-0 rounded-xl flex items-center justify-center p-1 border transition-transform',
                              isSelected
                                ? 'bg-amber-400 border-amber-300 shadow-sm scale-105'
                                : 'bg-slate-100 dark:bg-purple-950/70 border-slate-200 dark:border-purple-800'
                            )}
                          >
                            <Image
                              src={char.imageUrl}
                              alt={char.name}
                              width={36}
                              height={36}
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-display font-black text-sm truncate">
                              {char.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-purple-300/70 font-medium truncate">
                              {char.series} — {char.tagline}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="h-6 w-6 shrink-0 rounded-full bg-purple-600 dark:bg-purple-500 text-white flex items-center justify-center shadow-sm">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick-Pick Character Chips Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-display font-black uppercase tracking-wider text-purple-600 dark:text-purple-300">
                Quick-Pick Character:
              </span>
              <span className="text-[11px] text-slate-400 dark:text-purple-400 font-medium">
                Click any character to switch immediately
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CREATURE_CHARACTERS.map((char) => {
                const isSelected = selectedChar.id === char.id;
                return (
                  <button
                    key={`quick-${char.id}`}
                    type="button"
                    onClick={() => handleSelectCharacter(char)}
                    title={`${char.name} (${char.series})`}
                    className={cn(
                      'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 transition-all cursor-pointer',
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30 scale-105'
                        : 'bg-slate-50 dark:bg-[#160a36] text-slate-700 dark:text-purple-200 border-slate-200 dark:border-purple-800/80 hover:border-purple-300 dark:hover:border-purple-600'
                    )}
                  >
                    <div className="h-6 w-6 shrink-0 overflow-hidden flex items-center justify-center">
                      <Image
                        src={char.imageUrl}
                        alt={char.name}
                        width={24}
                        height={24}
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    <span className="font-display font-black text-xs whitespace-nowrap">
                      {char.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t-2 border-slate-100 dark:border-purple-900/60">
            <Button
              type="submit"
              variant="yellow"
              size="lg"
              className="font-black text-sm gap-2 h-12 px-6"
            >
              <Check className="h-4 w-4 text-purple-900 stroke-[3]" />
              Save Companion Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
