import type { Topic } from './types';

export const TOPICS: Topic[] = [
  {
    id: 'alphabet',
    title: 'Alphabet',
    shortDesc: 'The Foundation',
    description: 'Master 26 letters of English alphabet, their names, and basic sounds. The building blocks of all communication.',
    icon: 'A',
    color: 'from-blue-500 to-cyan-500',
    bgImage: 'https://picsum.photos/id/10/1920/1080' // Nature/Tree (Growth)
  },
  {
    id: 'phonetic',
    title: 'Phonetic Symbols',
    shortDesc: 'IPA Mastery',
    description: 'Dive into International Phonetic Alphabet (IPA). Learn to read pronunciation keys and produce exact sounds.',
    icon: 'æ',
    color: 'from-purple-500 to-fuchsia-500',
    bgImage: 'https://picsum.photos/id/20/1920/1080', // Abstract/Tools
    cssClass: 'font-extended-linguistic'
  },
  {
    id: 'stressing',
    title: 'Stressing',
    shortDesc: 'Rhythm & Beat',
    description: 'English is a stress-timed language. Learn which syllables to emphasize to sound natural and confident.',
    icon: '⚡',
    color: 'from-yellow-400 to-orange-500',
    bgImage: 'https://picsum.photos/id/30/1920/1080' // Light/Energy
  },
  {
    id: 'final-sound',
    title: 'Final Sound',
    shortDesc: 'Ending Precision',
    description: 'Clear endings are crucial for grammar (past tense -ed, plurals -s). Don\'t swallow your words!',
    icon: 'END',
    color: 'from-red-500 to-rose-600',
    bgImage: 'https://picsum.photos/id/40/1920/1080' // Detail/Macro
  },
  {
    id: 'american-t',
    title: 'American /t/',
    shortDesc: 'Flap & Glottal',
    description: 'Unlock secrets of American accent. Master Flap T (butter) and Glottal Stop (button).',
    icon: '/t/',
    color: 'from-emerald-400 to-green-600',
    bgImage: 'https://picsum.photos/id/50/1920/1080' // City/Urban
  },
  {
    id: 'connected',
    title: 'Connected Speech',
    shortDesc: 'Flow & Link',
    description: 'Learn how native speakers link words together. Catenation, intrusion, and elision for smooth fluency.',
    icon: '∞',
    color: 'from-indigo-400 to-violet-600',
    bgImage: 'https://picsum.photos/id/60/1920/1080' // Flowing water/Abstract
  }
];
