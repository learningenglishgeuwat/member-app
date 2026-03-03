import type { IntonationSelfStudyStep } from './types';

export const INTONATION_SELF_STUDY_ROADMAP: IntonationSelfStudyStep[] = [
  {
    id: 'step-1',
    title: 'Kenali jatuh vs naik nada',
    focus: 'Bedakan pattern falling dan rising dari kalimat pendek.',
    targetOutput: 'Bisa menyebutkan mana statement turun dan mana question naik pada 10 contoh.',
    durationMinutes: 8,
  },
  {
    id: 'step-2',
    title: 'Bedakan statement vs question',
    focus: 'Latih bentuk grammar question lalu intonation-nya.',
    targetOutput: 'Bisa mengucapkan minimal 8 pasangan statement-question dengan pola nada tepat.',
    durationMinutes: 10,
  },
  {
    id: 'step-3',
    title: 'Latih continuation tone pada list',
    focus: 'Gunakan nada naik ringan pada item non-final dan turun pada item terakhir.',
    targetOutput: 'Bisa membaca 5 list (3 item) tanpa salah penutupan nada.',
    durationMinutes: 8,
  },
  {
    id: 'step-4',
    title: 'Latih intonation untuk niat/emosi',
    focus: 'Bandingkan neutral, polite, firm, dan uncertain.',
    targetOutput: 'Bisa mengucapkan 4 niat berbeda dengan kalimat yang jelas terdengar berbeda.',
    durationMinutes: 10,
  },
  {
    id: 'step-5',
    title: 'Terapkan ke mini-dialogue',
    focus: 'Gabungkan pattern ke dialog A/B agar terdengar natural.',
    targetOutput: 'Bisa menyelesaikan 2 mini-dialogue dengan kontur nada konsisten per line.',
    durationMinutes: 12,
  },
  {
    id: 'step-6',
    title: 'Rekam, evaluasi, dan review harian',
    focus: 'Gunakan rekaman diri untuk cek monotone, ending tone, dan kejelasan niat.',
    targetOutput: 'Bisa membuat 1 rekaman harian 3 menit dengan checklist evaluasi mandiri.',
    durationMinutes: 12,
  },
];

export const INTONATION_SELF_STUDY_STORAGE_KEY = 'intonation_self_study_v1';
