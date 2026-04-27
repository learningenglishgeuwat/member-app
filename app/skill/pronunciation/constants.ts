import type { Topic } from './types';

export const TOPICS: Topic[] = [
  {
    id: 'alphabet',
    title: 'Alphabet',
    shortDesc: 'Fondasi Dasar',
    description:
      'Kuasai 26 huruf English alphabet, nama tiap huruf, dan bunyi dasarnya. Ini adalah fondasi utama semua komunikasi.',
    icon: 'A',
    color: 'from-blue-500 to-cyan-500',
    bgImage: 'https://picsum.photos/id/10/1920/1080',
  },
  {
    id: 'phonetic',
    title: 'Phonetic Symbols',
    shortDesc: 'Penguasaan IPA',
    description:
      'Pelajari International Phonetic Alphabet (IPA). Latih membaca pronunciation key dan menghasilkan bunyi dengan lebih tepat.',
    icon: 'IPA',
    color: 'from-purple-500 to-fuchsia-500',
    bgImage: 'https://picsum.photos/id/20/1920/1080',
    cssClass: 'font-extended-linguistic',
  },
  {
    id: 'stressing',
    title: 'Stressing',
    shortDesc: 'Ritme & Tekanan',
    description:
      'English adalah stress-timed language. Pelajari suku kata mana yang perlu ditekan agar terdengar natural dan percaya diri.',
    icon: 'STR',
    color: 'from-yellow-400 to-orange-500',
    bgImage: 'https://picsum.photos/id/30/1920/1080',
  },
  {
    id: 'intonation',
    title: 'Intonation',
    shortDesc: 'Melodi & Makna',
    description:
      'Pelajari pola pitch rising, falling, dan fall-rise untuk menyampaikan makna, emosi, dan intent dengan lebih jelas.',
    icon: '~',
    color: 'from-pink-500 to-rose-600',
    bgImage: 'https://picsum.photos/id/35/1920/1080',
  },
  {
    id: 'final-sound',
    title: 'Final Sound',
    shortDesc: 'Presisi Akhiran',
    description:
      'Bunyi akhir yang jelas sangat penting untuk grammar (past tense -ed, plural -s). Jangan menelan bunyi akhir kata.',
    icon: 'END',
    color: 'from-cyan-400 to-cyan-600',
    bgImage: 'https://picsum.photos/id/40/1920/1080',
  },
  {
    id: 'american-t',
    title: 'American /t/',
    shortDesc: 'Flap & Glottal Stop',
    description:
      "Kuasai pola American /t/: Flap T ditulis /\u027E/ dan terdengar seperti 'd' lembut (butter), bukan /r/. Glottal stop ditulis /\u0294/ saat aliran udara dihentikan sejenak, sering muncul di speech casual (button).",
    icon: '/t/',
    color: 'from-[#002868] to-[#0b4aa6]',
    bgImage: 'https://picsum.photos/id/50/1920/1080',
  },
  {
    id: 'text',
    title: 'TEXT',
    shortDesc: 'Baca & Ucapkan',
    description:
      'Latih pronunciation lewat membaca teks pendek dengan fokus pada rhythm, stress, dan clarity.',
    icon: 'TXT',
    color: 'from-emerald-400 to-green-600',
    bgImage: 'https://picsum.photos/id/70/1920/1080',
  },
  {
    id: 'reading-text',
    title: 'Reading Text',
    shortDesc: 'Reading Practice',
    description:
      'Bacaan pendek untuk melatih flow, clarity, dan konsistensi bunyi saat membaca paragraf utuh.',
    icon: 'READ',
    color: 'from-indigo-400 to-violet-600',
    bgImage: 'https://picsum.photos/id/80/1920/1080',
  },
];

export const LOCKED_TOPIC_IDS: string[] = [];

export const TOPIC_ROUTES: Record<string, string> = {
  alphabet: '/skill/pronunciation/alphabet',
  phonetic: '/skill/pronunciation/phoneticSymbols',
  stressing: '/skill/pronunciation/stressing',
  intonation: '/skill/pronunciation/intonation',
  'final-sound': '/skill/pronunciation/final-sound-new',
  'american-t': '/skill/pronunciation/american-t',
  text: '/skill/pronunciation/text',
  'reading-text': '/skill/pronunciation/reading-text',
};
