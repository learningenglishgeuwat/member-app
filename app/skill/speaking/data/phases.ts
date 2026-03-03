import type { SpeakingGoalPhase } from './types';

export const SPEAKING_PHASES: SpeakingGoalPhase[] = [
  {
    id: 'cefr-a1-1',
    order: 0,
    title: 'Survival Response',
    subtitle: 'Respons paling dasar untuk tetap paham dan tetap aman saat bicara.',
    targetOutput:
      'Mampu merespons instruksi singkat, meminta repeat, dan menutup percakapan dasar dengan jelas.',
    goalCount: 12,
    levelBand: 'starter',
    domains: ['daily', 'public'],
  },
  {
    id: 'cefr-a1-2',
    order: 1,
    title: 'Identity and Daily Needs',
    subtitle: 'Perkenalan diri dan kebutuhan harian dengan pola kalimat siap pakai.',
    targetOutput:
      'Mampu memperkenalkan diri, menyatakan kebutuhan, meminta izin, dan membuat janji sederhana.',
    goalCount: 12,
    levelBand: 'starter',
    domains: ['daily', 'public', 'finance'],
  },
  {
    id: 'cefr-a1-3',
    order: 2,
    title: 'Simple Transaction and Direction',
    subtitle: 'Transaksi sederhana, arah dasar, serta konfirmasi aksi berikutnya.',
    targetOutput:
      'Mampu menyelesaikan percakapan transaksi dasar dan menutup interaksi dengan next step yang jelas.',
    goalCount: 12,
    levelBand: 'basic',
    domains: ['daily', 'public', 'finance', 'emergency'],
  },
];

export const SPEAKING_PHASE_MAP: Record<string, SpeakingGoalPhase> = Object.fromEntries(
  SPEAKING_PHASES.map((phase) => [phase.id, phase]),
);
