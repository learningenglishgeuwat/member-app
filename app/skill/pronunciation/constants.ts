import type { Topic } from './types';

export const TOPICS: Topic[] = [
  {
    id: 'alphabet',
    title: 'Alphabet',
    shortDesc: 'Fondasi Dasar',
    description:
      'Kuasai 26 huruf English alphabet, nama tiap huruf, dan bunyi dasarnya. Ini adalah fondasi utama semua komunikasi.',
    icon: 'A',
    color: 'from-blue-700 to-blue-500',
    bgImage: 'https://picsum.photos/id/10/1920/1080',
  },
  {
    id: 'phonetic',
    title: 'Phonetic Symbols',
    shortDesc: 'Penguasaan IPA',
    description:
      'Pelajari International Phonetic Alphabet (IPA). Latih membaca pronunciation key dan menghasilkan bunyi dengan lebih tepat.',
    icon: 'IPA',
    color: 'from-purple-600 to-fuchsia-500',
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
    color: 'from-lime-400 to-green-500',
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
    id: 'linking-word',
    title: 'Linking Word',
    shortDesc: 'Connected Speech',
    description:
      'Latih linking sound antar kata agar spoken English terdengar lebih natural: liaison, reduction, dan perubahan bunyi saat kata disambung.',
    icon: 'LW',
    color: 'from-cyan-500 to-cyan-400',
    bgImage: 'https://picsum.photos/id/55/1920/1080',
  },
  {
    id: 'contraction',
    title: 'Contraction',
    shortDesc: 'Short Forms',
    description:
      "Pelajari contraction dalam spoken English: I'm, you're, I'll, can't, gonna, dan bentuk pendek lain yang membuat ucapan terdengar lebih natural.",
    icon: "'",
    color: 'from-teal-400 to-cyan-500',
    bgImage: 'https://picsum.photos/id/60/1920/1080',
  },
  {
    id: 'text',
    title: 'TEXT',
    shortDesc: 'Baca & Ucapkan',
    description:
      'Latih pronunciation lewat membaca teks pendek dengan fokus pada rhythm, stress, dan clarity.',
    icon: 'TXT',
    color: 'from-slate-500 to-gray-400',
    bgImage: 'https://picsum.photos/id/70/1920/1080',
  },
  {
    id: 'reading-text',
    title: 'Reading Text',
    shortDesc: 'Reading Practice',
    description:
      'Bacaan pendek untuk melatih flow, clarity, dan konsistensi bunyi saat membaca paragraf utuh.',
    icon: 'READ',
    color: 'from-[#1E293B] to-slate-700',
    bgImage: 'https://picsum.photos/id/80/1920/1080',
  },
  {
    id: 'tongue-twister',
    title: 'Tongue Twister',
    shortDesc: 'Latihan Artikulasi',
    description:
      'Latih kecepatan dan ketepatan artikulasi dengan tongue twisters. Tingkatkan muscle memory untuk bunyi-bunyi sulit dan kombinasi konsonan yang challenging.',
    icon: 'TT',
    color: 'from-fuchsia-500 to-pink-500',
    bgImage: 'https://picsum.photos/id/90/1920/1080',
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
  'linking-word': '/skill/pronunciation/linking-word',
  contraction: '/skill/pronunciation/contraction',
  text: '/skill/pronunciation/text',
  'reading-text': '/skill/pronunciation/reading-text',
  'tongue-twister': '/skill/pronunciation/phoneticSymbols/tongue-twister',
};
