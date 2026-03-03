import type { SpeakingGoalPhase } from './types';

export const SPEAKING_PHASES: SpeakingGoalPhase[] = [
  {
    id: 'phase-00',
    order: 0,
    title: 'Phase 0 - Zero-to-Speech Starter',
    subtitle: 'Mulai dari nol total: respon dasar, identitas, kebutuhan inti.',
    targetOutput:
      'Mampu memberi respon inti untuk bertahan dalam percakapan pertama.',
    levelBand: 'starter',
    domains: ['daily'],
    goalCount: 10,
  },
  {
    id: 'phase-01',
    order: 1,
    title: 'Phase 1 - Daily Survival Core',
    subtitle: 'Transaksi dan mobilitas dasar di kehidupan sehari-hari.',
    targetOutput:
      'Mampu menangani kebutuhan harian paling umum secara mandiri.',
    levelBand: 'basic',
    domains: ['daily', 'public'],
    goalCount: 15,
  },
  {
    id: 'phase-02',
    order: 2,
    title: 'Phase 2 - Daily Interaction Fundamentals',
    subtitle: 'Membangun percakapan sosial yang natural dan sopan.',
    targetOutput: 'Mampu menjaga percakapan ringan tanpa cepat buntu.',
    levelBand: 'basic',
    domains: ['daily'],
    goalCount: 15,
  },
  {
    id: 'phase-03',
    order: 3,
    title: 'Phase 3 - Community & Public Services',
    subtitle: 'Interaksi dengan layanan publik, administrasi, dan prosedur.',
    targetOutput:
      'Mampu mengurus kebutuhan publik dengan komunikasi jelas dan efisien.',
    levelBand: 'functional',
    domains: ['public', 'daily', 'finance'],
    goalCount: 15,
  },
  {
    id: 'phase-04',
    order: 4,
    title: 'Phase 4 - Health & Safety',
    subtitle: 'Komunikasi darurat, medis, dan keamanan.',
    targetOutput:
      'Mampu menjelaskan kondisi kritis dan meminta bantuan tepat waktu.',
    levelBand: 'functional',
    domains: ['emergency', 'public'],
    goalCount: 15,
  },
  {
    id: 'phase-05',
    order: 5,
    title: 'Phase 5 - Home & Life Management',
    subtitle: 'Komunikasi urusan rumah, layanan, dan manajemen hidup.',
    targetOutput:
      'Mampu mengelola kebutuhan rumah tangga dan layanan harian secara lisan.',
    levelBand: 'functional',
    domains: ['daily', 'public', 'finance'],
    goalCount: 15,
  },
  {
    id: 'phase-06',
    order: 6,
    title: 'Phase 6 - Digital Communication',
    subtitle: 'Speaking dalam konteks online dan kolaborasi digital.',
    targetOutput:
      'Mampu menyampaikan instruksi dan klarifikasi efektif di kanal digital.',
    levelBand: 'functional',
    domains: ['daily', 'work'],
    goalCount: 15,
  },
  {
    id: 'phase-07',
    order: 7,
    title: 'Phase 7 - Work Basics',
    subtitle: 'Fondasi speaking profesional dalam alur kerja harian.',
    targetOutput:
      'Mampu menjalankan komunikasi kerja inti dengan format profesional.',
    levelBand: 'intermediate',
    domains: ['work'],
    goalCount: 20,
  },
  {
    id: 'phase-08',
    order: 8,
    title: 'Phase 8 - Work Interaction',
    subtitle: 'Diskusi tim, meeting, dan koordinasi lintas fungsi.',
    targetOutput:
      'Mampu berinteraksi aktif dalam forum kerja dan pengambilan keputusan.',
    levelBand: 'intermediate',
    domains: ['work'],
    goalCount: 15,
  },
  {
    id: 'phase-09',
    order: 9,
    title: 'Phase 9 - Client & Service Communication',
    subtitle: 'Komunikasi eksternal dengan klien dan pengguna layanan.',
    targetOutput:
      'Mampu menangani komunikasi klien dari discovery hingga follow-up.',
    levelBand: 'upper-intermediate',
    domains: ['work', 'finance'],
    goalCount: 15,
  },
  {
    id: 'phase-10',
    order: 10,
    title: 'Phase 10 - Problem Solving & Conflict',
    subtitle: 'Penyelesaian masalah dan konflik secara terstruktur.',
    targetOutput:
      'Mampu memimpin percakapan resolusi masalah sampai tindak lanjut.',
    levelBand: 'upper-intermediate',
    domains: ['work', 'emergency'],
    goalCount: 15,
  },
  {
    id: 'phase-11',
    order: 11,
    title: 'Phase 11 - Presentation & Reporting',
    subtitle: 'Presentasi, reporting, dan komunikasi berbasis insight.',
    targetOutput:
      'Mampu menyampaikan pesan kompleks secara ringkas, persuasif, dan jelas.',
    levelBand: 'advanced',
    domains: ['work'],
    goalCount: 15,
  },
  {
    id: 'phase-12',
    order: 12,
    title: 'Phase 12 - Negotiation & Influence',
    subtitle: 'Negosiasi hasil, kompromi, dan framing win-win.',
    targetOutput:
      'Mampu bernegosiasi secara profesional dan mengunci keputusan aksi.',
    levelBand: 'advanced',
    domains: ['work', 'finance'],
    goalCount: 10,
  },
  {
    id: 'phase-13',
    order: 13,
    title: 'Phase 13 - Legal, Compliance, Finance Professional',
    subtitle: 'Komunikasi formal level tinggi: legal, compliance, finansial.',
    targetOutput:
      'Mampu memahami dan mengomunikasikan isu legal-finance secara presisi.',
    levelBand: 'professional',
    domains: ['legal', 'finance', 'work'],
    goalCount: 10,
  },
];

export const PHASE_LOOKUP = Object.fromEntries(
  SPEAKING_PHASES.map((phase) => [phase.id, phase]),
) as Record<(typeof SPEAKING_PHASES)[number]['id'], (typeof SPEAKING_PHASES)[number]>;
