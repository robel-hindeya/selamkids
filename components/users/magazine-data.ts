export interface MagazinePage {
  pageNumber: number;
  type: 'cover' | 'creature' | 'story' | 'puzzle';
  title: string;
  subtitle?: string;
  content: string;
  characterImage?: string;
  creatureStats?: {
    name: string;
    species: string;
    bravery: number;
    magic: number;
    speed: number;
    specialPower: string;
    favoriteSnack: string;
    author: string;
    authorAge: number;
  };
  puzzleQuestion?: string;
  puzzleOptions?: string[];
  correctAnswer?: number;
  orbsReward?: number;
}

export interface MagazineIssue {
  id: string;
  issueNumber: number;
  title: string;
  theme: string;
  editionName: string;
  releaseDate: string;
  gradient: string;
  borderGradient: string;
  bannerColor: string;
  badge: {
    text: string;
    color: string;
  };
  sticker: {
    text: string;
    bg: string;
  };
  characterMain: {
    src: string;
    alt: string;
    name: string;
  };
  characterSecondary: {
    src: string;
    alt: string;
    name: string;
  };
  headlines: string[];
  authorSpotlight: {
    name: string;
    age: number;
    location: string;
    avatar: string;
  };
  defaultRotation: string;
  defaultTranslateY: string;
  pages: MagazinePage[];
}

export const MAGAZINES: MagazineIssue[] = [
  {
    id: 'issue-44',
    issueNumber: 44,
    title: 'DRAGON SKIES & THE COSMIC PORTAL',
    theme: 'Dragon Galaxies & Astral Beasts',
    editionName: 'Special Starlight Edition',
    releaseDate: 'Autumn 2026',
    gradient: 'from-[#2e0854] via-[#4c1d95] to-[#1e1b4b]',
    borderGradient: 'from-amber-400 via-purple-400 to-cyan-400',
    bannerColor: 'bg-amber-400 text-slate-950',
    badge: {
      text: '★ NEW ISSUE',
      color: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black',
    },
    sticker: {
      text: '+50 ORBS INSIDE!',
      bg: 'bg-rose-500 text-white shadow-rose-500/50',
    },
    characterMain: {
      src: '/images/characters/toothless.png',
      alt: 'Toothless Night Dragon',
      name: 'Shadow Dragon',
    },
    characterSecondary: {
      src: '/images/characters/pikachu.png',
      alt: 'Pikachu Spark Beast',
      name: 'Thunder Sprite',
    },
    headlines: [
      'Top 10 Wildest Creatures Authored by Kids This Month!',
      'The Shadow Beast Riddle: Can Your Adjectives Defeat It?',
      'Exclusive: Inside the Secret Starlight Library',
    ],
    authorSpotlight: {
      name: 'Leo M.',
      age: 9,
      location: 'London, UK',
      avatar: '/images/characters/pikachu.png',
    },
    defaultRotation: '-rotate-4 md:-rotate-5',
    defaultTranslateY: 'translate-y-3 md:translate-y-4',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'DRAGON SKIES & THE COSMIC PORTAL',
        subtitle: 'The Official Night Zookeeper Magazine • Issue #44',
        content: 'Dive into the mysterious northern constellations where Toothless and Thunder Sprite guard the ancient Word Tree from dark shadows.',
        characterImage: '/images/characters/toothless.png',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Creature Spotlight: The Astral Thunder-Dragon',
        subtitle: 'Discovered and authored by Young Author Leo (Age 9)',
        content: 'When the night sky fills with neon aurora clouds, this magnificent dragon glides through the cosmos collecting glowing punctuation marks to light up ancient storybooks.',
        characterImage: '/images/characters/toothless.png',
        creatureStats: {
          name: 'Toothless the Night Fury',
          species: 'Cosmic Sky Serpent',
          bravery: 98,
          magic: 96,
          speed: 99,
          specialPower: 'Plasma Word-Breath (turns dull nouns into vivid magical verbs)',
          favoriteSnack: 'Starfruit Pies & Crispy Lightning Seeds',
          author: 'Leo M.',
          authorAge: 9,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Boy Who Whispered to the Aurora Dragon',
        subtitle: 'Award-winning story from the Summer Creative Contest',
        content: `Once upon a midnight in the Whispering Heights, Maya discovered an emerald scroll wrapped in silver vines. 
        
"Don't read it out loud!" warned Pikachu, sparking with excitement. But Maya was brave. She cleared her throat and pronounced the ancient spell: "VIVIDUS ADJECTIVUS!"

Instantly, the clouds parted, and Toothless descended from the cosmic sky. His wings were woven from purple stardust. "Who dares awaken the Word Dragon?" his deep voice echoed, not with anger, but with pure delight. Together, they flew above Mount Whispers, painting whole galaxies with thrilling metaphors!`,
        characterImage: '/images/characters/pikachu.png',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'The Dragon Word Maze & Orb Claim',
        subtitle: 'Solve the riddle to claim your 50 Glowing Orbs!',
        content: 'Which vivid adjective best describes Toothless soaring through the midnight starry realm?',
        puzzleQuestion: 'Choose the most powerful descriptive word for the Dragon Sky:',
        puzzleOptions: [
          'A) Nice',
          'B) Luminescent & Majestic',
          'C) Okay',
          'D) Normal',
        ],
        correctAnswer: 1,
        orbsReward: 50,
      },
    ],
  },
  {
    id: 'issue-43',
    issueNumber: 43,
    title: 'WHISPERING JUNGLE & STARLIGHT SAFARI',
    theme: 'Safari Magic & Secret Treehouses',
    editionName: 'Golden Best-Seller Issue',
    releaseDate: 'Summer 2026',
    gradient: 'from-[#064e3b] via-[#047857] to-[#0f172a]',
    borderGradient: 'from-yellow-400 via-emerald-300 to-amber-400',
    bannerColor: 'bg-emerald-400 text-slate-950',
    badge: {
      text: '★ MOST POPULAR',
      color: 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-black',
    },
    sticker: {
      text: 'GOLD MEDAL AWARD',
      bg: 'bg-amber-400 text-slate-950 font-black shadow-amber-400/50',
    },
    characterMain: {
      src: '/images/characters/simba.png',
      alt: 'Simba the Brave Lion',
      name: 'Simba Safari King',
    },
    characterSecondary: {
      src: '/images/characters/stitch.png',
      alt: 'Stitch Blue Glider',
      name: 'Stitch Trickster',
    },
    headlines: [
      'Meet Iggy: The Fire-Breathing Giraffe with Polka-Dot Wings!',
      'Hilarious Comic Strip: Stitch vs The Word Gobbler',
      'Kid Author of the Month: Sofia (Age 8) and the Magic Mango',
    ],
    authorSpotlight: {
      name: 'Sofia R.',
      age: 8,
      location: 'Toronto, Canada',
      avatar: '/images/characters/stitch.png',
    },
    defaultRotation: 'rotate-2 md:rotate-3',
    defaultTranslateY: '-translate-y-2 md:-translate-y-3 scale-102 md:scale-105',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'WHISPERING JUNGLE & STARLIGHT SAFARI',
        subtitle: 'The Official Night Zookeeper Magazine • Issue #43',
        content: 'Journey deep into the canopy where Simba and Stitch explore glowing mushroom groves and uncover lost ancient scrolls.',
        characterImage: '/images/characters/simba.png',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Creature Spotlight: Iggy the Solar Lion',
        subtitle: 'Created by Sofia R. (Age 8)',
        content: 'Simba has found a magnificent golden mane that shines like the noon sun even in the darkest corners of the jungle.',
        characterImage: '/images/characters/simba.png',
        creatureStats: {
          name: 'Simba the Sun-Mane Lion',
          species: 'Solar Feline Beast',
          bravery: 100,
          magic: 92,
          speed: 94,
          specialPower: 'Roar of Inspiration (fills young writers with brilliant ideas)',
          favoriteSnack: 'Honey-dipped Safari Watermelons',
          author: 'Sofia R.',
          authorAge: 8,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Mischief in the Baobab Treehouse',
        subtitle: 'A hilarious jungle adventure written by classroom 4B',
        content: `Stitch had one job: keep the ancient ink pot safe until sunrise.
        
"Ih! Naughty ink!" Stitch giggled as the purple ink sprouted four tiny legs and began scampering across the treehouse branches. Simba leapt over the bamboo railings, his golden tail swishing like a banner.

"Stop that ink before it writes silly nonsense on the moon!" Simba yelled playfully. Together they tackled the mischievous puddle just in time to create a shimmering poem on a giant tropical palm leaf!`,
        characterImage: '/images/characters/stitch.png',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'Jungle Word Quest & Orb Reward',
        subtitle: 'Match the wild safari synonym to claim 50 Orbs!',
        content: 'Which word means the same as "ferocious" but sounds like an adventurous wild beast?',
        puzzleQuestion: 'What is a strong synonym for "courageous"?',
        puzzleOptions: [
          'A) Timid',
          'B) Fearless & Valiant',
          'C) Sleepy',
          'D) Quiet',
        ],
        correctAnswer: 1,
        orbsReward: 50,
      },
    ],
  },
  {
    id: 'issue-42',
    issueNumber: 42,
    title: 'OCEAN OF DREAMS & LUMINOUS REEFS',
    theme: 'Deep Sea Mysteries & Coral Kingdoms',
    editionName: 'Collector Marine Edition',
    releaseDate: 'Spring 2026',
    gradient: 'from-[#0c4a6e] via-[#0284c7] to-[#082f49]',
    borderGradient: 'from-cyan-400 via-pink-400 to-amber-300',
    bannerColor: 'bg-cyan-400 text-slate-950',
    badge: {
      text: '★ COLLECTOR’S PICK',
      color: 'bg-gradient-to-r from-cyan-400 to-sky-300 text-slate-950 font-black',
    },
    sticker: {
      text: 'FREE PUZZLE LAB',
      bg: 'bg-purple-600 text-white shadow-purple-600/50',
    },
    characterMain: {
      src: '/images/characters/nemo.png',
      alt: 'Nemo Clownfish Explorer',
      name: 'Nemo Reef Guide',
    },
    characterSecondary: {
      src: '/images/characters/po-panda.png',
      alt: 'Po the Dragon Warrior Panda',
      name: 'Po Panda Master',
    },
    headlines: [
      'The Mystery of the Sunken Coral Library Revealed!',
      'Po Panda’s Kung Fu Word Dojo: Master Complex Sentences!',
      'Poetry Corner: Sparkling Rhymes from the Bioluminescent Abyss',
    ],
    authorSpotlight: {
      name: 'Kai T.',
      age: 10,
      location: 'Sydney, Australia',
      avatar: '/images/characters/nemo.png',
    },
    defaultRotation: 'rotate-4 md:rotate-5',
    defaultTranslateY: 'translate-y-2 md:translate-y-3',
    pages: [
      {
        pageNumber: 1,
        type: 'cover',
        title: 'OCEAN OF DREAMS & LUMINOUS REEFS',
        subtitle: 'The Official Night Zookeeper Magazine • Issue #42',
        content: 'Plunge beneath shimmering waves where Nemo and Po Panda train in the underwater Kung Fu temple to protect the Great Storybook Coral.',
        characterImage: '/images/characters/nemo.png',
      },
      {
        pageNumber: 2,
        type: 'creature',
        title: 'Creature Spotlight: The Aqua Kung-Fu Panda',
        subtitle: 'Invented by Kai T. (Age 10)',
        content: 'Po Panda has mastered the art of swimming through liquid sapphire, using water ripples to spell words in flowing calligraphy.',
        characterImage: '/images/characters/po-panda.png',
        creatureStats: {
          name: 'Po the Coral Guardian',
          species: 'Bioluminescent Giant Panda',
          bravery: 97,
          magic: 94,
          speed: 88,
          specialPower: 'Bubble Blast Metaphor (turns simple thoughts into poetic magic)',
          favoriteSnack: 'Steamed Kelp Dumplings with Sweet Star-Honey',
          author: 'Kai T.',
          authorAge: 10,
        },
      },
      {
        pageNumber: 3,
        type: 'story',
        title: 'The Great Coral Spelling Duel',
        subtitle: 'An underwater mystery written by Kai T.',
        content: `Far below the breaking waves, the Ink Octopus challenged Nemo to a spellbinding riddle contest.
        
"If you cannot spell 'magnificent' backwards, this pearl of wisdom is mine!" gurgled the Octopus. Nemo smiled bravely. He didn't have to do it alone — Po Panda arrived on a manta ray with his bamboo brush! 

With two swishes of water kung fu, Po wrote: "T-N-E-C-I-F-I-N-G-A-M!" The octopus blushed bright purple and handed over the crystal key to the underwater library. The Night Zoo was safe once more!`,
        characterImage: '/images/characters/nemo.png',
      },
      {
        pageNumber: 4,
        type: 'puzzle',
        title: 'Ocean Word Reef & Orb Claim',
        subtitle: 'Decode the oceanic riddle to claim 50 Glowing Orbs!',
        content: 'Which creative simile best paints a picture of a calm luminous reef?',
        puzzleQuestion: 'Pick the richest descriptive simile:',
        puzzleOptions: [
          'A) It was blue like blue stuff',
          'B) The reef glittered like a sunken chest of liquid diamonds',
          'C) Water is wet',
          'D) Fish swam around',
        ],
        correctAnswer: 1,
        orbsReward: 50,
      },
    ],
  },
];

export function getMagazineById(id: string): MagazineIssue | undefined {
  return MAGAZINES.find((m) => m.id === id || String(m.issueNumber) === id);
}

