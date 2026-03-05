export type SpeakingRoadmapItem = {
  id: string;
  title: string;
  href: string;
  focus: string;
  goalCount: number;
  estimatedDays: number;
};

export const SPEAKING_ROADMAP_ITEMS: ReadonlyArray<SpeakingRoadmapItem> = [
  {
    id: 'cefr-a1-1',
    title: 'Survival Response',
    href: '/skill/speaking?phase=cefr-a1-1',
    focus: 'Respons cepat, minta repeat, dan konfirmasi instruksi dasar.',
    goalCount: 12,
    estimatedDays: 18,
  },
  {
    id: 'cefr-a1-2',
    title: 'Identity and Daily Needs',
    href: '/skill/speaking?phase=cefr-a1-2',
    focus: 'Perkenalan diri, kebutuhan harian, izin, dan janji sederhana.',
    goalCount: 12,
    estimatedDays: 18,
  },
  {
    id: 'cefr-a1-3',
    title: 'Simple Transaction and Direction',
    href: '/skill/speaking?phase=cefr-a1-3',
    focus: 'Transaksi dasar, arah, klarifikasi langkah, dan penutupan interaksi.',
    goalCount: 12,
    estimatedDays: 24,
  },
];

export const SPEAKING_ROADMAP_TOTAL_GOALS = SPEAKING_ROADMAP_ITEMS.reduce(
  (sum, item) => sum + item.goalCount,
  0,
);

export const SPEAKING_ROADMAP_TOTAL_DAYS = SPEAKING_ROADMAP_ITEMS.reduce(
  (sum, item) => sum + item.estimatedDays,
  0,
);
