import { createPhaseGoals, type GoalSeed } from './createPhaseGoals';

const seeds: GoalSeed[] = [
  {
    goal: 'Merespons ya/tidak dengan yakin',
    situation: 'Saat ditanya hal paling dasar oleh orang sekitar.',
    keySentence: 'Yes, I do.',
    drill:
      'Latih 20 respon cepat yes/no dengan intonasi jelas dan tanpa jeda panjang.',
    domain: 'daily',
    survivalPriority: 'critical',
  },
  {
    goal: 'Menyebut nama diri sendiri',
    situation: 'Saat perkenalan pertama dalam konteks apa pun.',
    keySentence: "My name is Dina.",
    drill: 'Ucapkan nama lengkap 10 kali dengan ritme stabil.',
    domain: 'daily',
    survivalPriority: 'critical',
  },
  {
    goal: 'Mengenali dan mengikuti instruksi satu langkah',
    situation: 'Saat menerima arahan sederhana dari orang lain.',
    keySentence: 'Please sit here.',
    drill:
      'Lakukan role-play 15 instruksi satu langkah: sit, stand, wait, come, go.',
    domain: 'daily',
    survivalPriority: 'critical',
  },
  {
    goal: 'Meminta lawan bicara mengulang',
    situation: 'Saat ucapan lawan bicara terlalu cepat atau tidak jelas.',
    keySentence: 'Could you repeat that, please?',
    drill:
      'Gunakan pola minta ulang pada 10 percakapan pendek sampai terdengar natural.',
    domain: 'daily',
    survivalPriority: 'critical',
  },
  {
    goal: 'Mengeja nama dan nomor',
    situation: 'Saat registrasi atau konfirmasi data.',
    keySentence: 'My name is R-I-N-A.',
    drill:
      'Latih ejaan alfabet + angka telepon secara lisan tanpa melihat catatan.',
    domain: 'daily',
    survivalPriority: 'high',
  },
  {
    goal: 'Menyebut angka dasar',
    situation: 'Saat menyebut jumlah, nomor, atau kode sederhana.',
    keySentence: 'I need two tickets.',
    drill: 'Latih angka 0-100 dengan pola puluhan dan angka campuran.',
    domain: 'daily',
    survivalPriority: 'high',
  },
  {
    goal: 'Menyebut waktu dasar',
    situation: 'Saat menanyakan atau memberi informasi jam.',
    keySentence: "It's seven o'clock.",
    drill: 'Buat 15 contoh waktu harian dan ucapkan dengan format yang konsisten.',
    domain: 'daily',
    survivalPriority: 'high',
  },
  {
    goal: 'Mengungkapkan kebutuhan dasar',
    situation: 'Saat butuh makan, minum, duduk, atau ke toilet.',
    keySentence: 'I need water, please.',
    drill:
      'Latih 8 kalimat kebutuhan dasar yang wajib keluar otomatis saat dibutuhkan.',
    domain: 'daily',
    survivalPriority: 'critical',
  },
  {
    goal: 'Perkenalan satu kalimat',
    situation: 'Saat harus memperkenalkan diri dengan cepat.',
    keySentence: "Hi, I'm Rio from Indonesia.",
    drill:
      'Buat 5 variasi perkenalan satu kalimat untuk situasi formal dan santai.',
    domain: 'daily',
    survivalPriority: 'high',
  },
  {
    goal: 'Menutup percakapan sangat singkat',
    situation: 'Saat harus mengakhiri interaksi dengan sopan.',
    keySentence: 'Thank you. See you.',
    drill: 'Latih 10 closing line sederhana dengan nada sopan.',
    domain: 'daily',
    survivalPriority: 'high',
  },
];

export const PHASE_00_GOALS = createPhaseGoals({
  phaseId: 'phase-00',
  phaseTitle: 'Zero-to-Speech Starter',
  levelBand: 'starter',
  defaultKeySentence2: 'Could you say it slowly, please?',
  defaultKeySentence3: 'Thank you. I understand.',
  seeds,
});
