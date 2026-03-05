export type PronunciationRoadmapItem = {
  id: string;
  title: string;
  href: string;
  focus: string;
  estimatedDays: number;
};

export const PRONUNCIATION_ROADMAP_ITEMS: ReadonlyArray<PronunciationRoadmapItem> = [
  {
    id: 'alphabet',
    title: 'Alphabet',
    href: '/skill/pronunciation/alphabet',
    focus: 'Fondasi bunyi huruf dan listening awal.',
    estimatedDays: 4,
  },
  {
    id: 'phonetic-symbols',
    title: 'Phonetic Symbols',
    href: '/skill/pronunciation/phoneticSymbols',
    focus: 'Akurasi bunyi IPA dan pemetaan suara.',
    estimatedDays: 16,
  },
  {
    id: 'stressing',
    title: 'Stressing',
    href: '/skill/pronunciation/stressing',
    focus: 'Tekanan kata agar ucapan lebih natural.',
    estimatedDays: 8,
  },
  {
    id: 'intonation',
    title: 'Intonation',
    href: '/skill/pronunciation/intonation',
    focus: 'Naik turun nada untuk makna dan emosi.',
    estimatedDays: 8,
  },
  {
    id: 'final-sound',
    title: 'Final Sound',
    href: '/skill/pronunciation/final-sound-new',
    focus: 'Akhiran bunyi penting untuk kejelasan.',
    estimatedDays: 7,
  },
  {
    id: 'american-t',
    title: 'American /t/',
    href: '/skill/pronunciation/american-t',
    focus: 'Pola /t/ American untuk connected speech.',
    estimatedDays: 10,
  },
  {
    id: 'text-practice',
    title: 'Text Practice',
    href: '/skill/pronunciation/text',
    focus: 'Integrasi semua pola lewat teks utuh.',
    estimatedDays: 6,
  },
];

export const PRONUNCIATION_ROADMAP_CHECKLIST_ENABLED_IDS = PRONUNCIATION_ROADMAP_ITEMS.filter(
  (item) => item.id !== 'text-practice',
).map((item) => item.id);

export const PRONUNCIATION_ROADMAP_TOTAL_DAYS = PRONUNCIATION_ROADMAP_ITEMS.reduce(
  (sum, item) => sum + item.estimatedDays,
  0,
);
