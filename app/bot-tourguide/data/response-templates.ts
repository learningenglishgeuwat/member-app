import type { GuideAnswerIntent } from '../types';

type GuideResponseTemplate = {
  openers: string[];
  closers: string[];
};

export const GUIDE_RESPONSE_TEMPLATES: Record<GuideAnswerIntent, GuideResponseTemplate> = {
  word_explanation: {
    openers: [
      'Kalau kata ini, maknanya begini:',
      'Untuk kata ini, intinya:',
      'Penjelasan naturalnya:',
    ],
    closers: [
      'Kalau mau, saya kasih contoh lain yang lebih situasional.',
      'Bisa saya lanjutkan ke variasi kalimatnya juga.',
      'Kalau perlu, saya tambahkan kata yang mirip artinya.',
    ],
  },
  direct_answer: {
    openers: [
      'Ringkasnya:',
      'Intinya begini:',
      'Jawaban cepatnya:',
      'Secara praktis:',
    ],
    closers: [
      'Kalau mau, saya bisa kasih contoh spesifiknya.',
      'Bisa saya lanjutkan ke contoh pemakaian?',
      'Kalau perlu, saya pecah jadi langkah latihan.',
    ],
  },
  comparison: {
    openers: [
      'Perbedaannya seperti ini:',
      'Supaya jelas, bedanya:',
      'Kalau dibandingkan langsung:',
    ],
    closers: [
      'Kalau mau, saya kasih tabel beda cepatnya.',
      'Saya bisa lanjutkan dengan contoh pasangan minimal.',
      'Kalau perlu, saya buat versi singkat 3 poin.',
    ],
  },
  how_to: {
    openers: [
      'Cara paling praktis:',
      'Langkah cepatnya:',
      'Urutan latihannya:',
    ],
    closers: [
      'Kalau mau, saya buat latihan 2 menit untuk ini.',
      'Bisa saya lanjutkan ke checklist praktiknya.',
      'Kalau perlu, saya sederhanakan jadi 3 langkah inti.',
    ],
  },
  example_request: {
    openers: [
      'Contoh yang relevan:',
      'Berikut contoh yang bisa langsung dipakai:',
      'Kita pakai contoh ini:',
    ],
    closers: [
      'Kalau ingin, saya tambah contoh dengan konteks lain.',
      'Saya bisa lanjutkan dengan versi yang lebih natural.',
      'Bisa saya tambah contoh formal vs santai juga.',
    ],
  },
  clarification: {
    openers: [
      'Supaya tepat, saya perlu konfirmasi:',
      'Biar tidak meleset, pilih dulu ini:',
      'Saya butuh sedikit klarifikasi:',
    ],
    closers: [
      'Pilih salah satu, nanti saya jawab langsung.',
      'Setelah pilih, saya lanjutkan jawaban spesifiknya.',
      'Begitu kamu pilih, saya langsung detailkan.',
    ],
  },
  fallback: {
    openers: [
      'Saya belum menemukan topik persisnya.',
      'Belum ada materi yang cocok secara langsung.',
      'Untuk saat ini, topik itu belum terindeks penuh.',
    ],
    closers: [
      'Coba kirim kata kunci yang lebih spesifik.',
      'Saya bisa arahkan ke materi terdekat dulu.',
      'Saya tetap bisa bantu lewat jalur topik yang paling dekat.',
    ],
  },
};
