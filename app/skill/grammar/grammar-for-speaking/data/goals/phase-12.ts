import { createPhaseGoals, type GoalSeed } from './createPhaseGoals';

const seeds: GoalSeed[] = [
  {
    goal: 'Menentukan BATNA sederhana',
    situation: 'Saat mempersiapkan batas minimum negosiasi.',
    keySentence: 'Our best alternative is to delay the launch by one week.',
    drill: 'Latih menyebut BATNA untuk 5 skenario negosiasi.',
    domain: 'work',
  },
  {
    goal: 'Menyampaikan anchor proposal',
    situation: 'Saat membuka tawaran awal negosiasi.',
    keySentence: 'Our initial proposal is a 12-month contract.',
    drill: 'Praktikkan opening offer dengan angka yang realistis.',
    domain: 'finance',
  },
  {
    goal: 'Membahas trade-off',
    situation: 'Saat menukar syarat untuk hasil lebih seimbang.',
    keySentence: 'If we extend the timeline, we can reduce the cost.',
    drill: 'Latih 8 skenario trade-off waktu, biaya, dan kualitas.',
    domain: 'finance',
  },
  {
    goal: 'Bargain sopan',
    situation: 'Saat meminta penyesuaian nilai kesepakatan.',
    keySentence: 'Could you offer a better rate for annual payment?',
    drill: 'Role-play bargain tanpa nada menekan.',
    domain: 'finance',
  },
  {
    goal: 'Menolak syarat tidak realistis',
    situation: 'Saat permintaan pihak lain melampaui kapasitas.',
    keySentence: "I'm afraid we cannot commit to that timeline.",
    drill: 'Latih penolakan tegas dengan alternatif solusi.',
    domain: 'work',
  },
  {
    goal: 'Framing win-win',
    situation: 'Saat mencari hasil yang menguntungkan kedua pihak.',
    keySentence: 'This approach benefits both teams.',
    drill: 'Buat 6 kalimat framing yang menekankan kepentingan bersama.',
    domain: 'work',
  },
  {
    goal: 'Closing negotiation',
    situation: 'Saat kesepakatan inti sudah tercapai.',
    keySentence: "Great, we have an agreement on the key terms.",
    drill: 'Latih closing statement dengan konfirmasi poin utama.',
    domain: 'work',
  },
  {
    goal: 'Mengunci next step',
    situation: 'Saat setelah sepakat perlu aksi lanjutan jelas.',
    keySentence: "Let's finalize the draft by Friday.",
    drill: 'Tetapkan next step: tugas, waktu, dan penanggung jawab.',
    domain: 'work',
  },
  {
    goal: 'Konfirmasi tertulis hasil negosiasi',
    situation: 'Saat mencegah salah tafsir setelah diskusi.',
    keySentence: 'I will send a written confirmation of the agreed terms.',
    drill: 'Latih verbal recap sebelum kirim ringkasan tertulis.',
    domain: 'legal',
  },
  {
    goal: 'After-negotiation recap',
    situation: 'Saat menutup proses dan merangkum komitmen.',
    keySentence: 'To recap, we agreed on price, scope, and delivery date.',
    drill: 'Ringkas hasil negosiasi dalam 45 detik.',
    domain: 'work',
  },
];

export const PHASE_12_GOALS = createPhaseGoals({
  phaseId: 'phase-12',
  phaseTitle: 'Negotiation & Influence',
  levelBand: 'advanced',
  defaultKeySentence2: 'Could we align on the final terms?',
  defaultKeySentence3: 'Please confirm so we can proceed.',
  seeds,
});
