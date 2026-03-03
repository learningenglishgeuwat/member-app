import { createPhaseGoals, type GoalSeed } from './createPhaseGoals';

const seeds: GoalSeed[] = [
  {
    goal: 'Membuka small talk dengan natural',
    situation: 'Saat bertemu orang baru dalam suasana santai.',
    keySentence: "How's your day going so far?",
    drill: 'Mulai 5 percakapan ringan dengan topik netral berbeda.',
    domain: 'daily',
    survivalPriority: 'high',
  },
  {
    goal: 'Menceritakan rutinitas harian',
    situation: 'Saat berbagi kebiasaan sehari-hari.',
    keySentence: 'I usually start my day at six.',
    drill: 'Ceritakan rutinitas pagi sampai malam dalam 8 kalimat.',
    domain: 'daily',
  },
  {
    goal: 'Menyatakan preferensi pribadi',
    situation: 'Saat membahas makanan, hiburan, atau gaya hidup.',
    keySentence: 'I prefer tea over coffee.',
    drill: 'Latih pernyataan preferensi untuk 10 topik populer.',
    domain: 'daily',
  },
  {
    goal: 'Mengundang orang lain',
    situation: 'Saat mengajak teman untuk kegiatan bersama.',
    keySentence: 'Would you like to join us for dinner?',
    drill: 'Praktikkan ajakan dengan waktu dan tempat yang jelas.',
    domain: 'daily',
  },
  {
    goal: 'Menyusun janji pertemuan',
    situation: 'Saat mengatur jadwal ketemu.',
    keySentence: "Let's meet at 7 p.m. near the station.",
    drill: 'Buat 6 skenario janji dengan detail waktu dan lokasi.',
    domain: 'daily',
  },
  {
    goal: 'Meminta klarifikasi informasi',
    situation: 'Saat lawan bicara kurang jelas.',
    keySentence: 'Do you mean we should submit it today?',
    drill: 'Lakukan drill klarifikasi tiga langkah: ulang, parafrase, konfirmasi.',
    domain: 'daily',
    survivalPriority: 'critical',
  },
  {
    goal: 'Menyampaikan opini ringan',
    situation: 'Saat diskusi santai mengenai ide atau pilihan.',
    keySentence: 'I think this option is simpler.',
    drill: 'Berikan opini singkat untuk 8 topik sehari-hari.',
    domain: 'daily',
  },
  {
    goal: 'Menolak ajakan dengan sopan',
    situation: 'Saat tidak bisa menerima undangan.',
    keySentence: "I'd love to, but I already have plans.",
    drill: 'Latih 5 kalimat penolakan sopan + alternatif jadwal.',
    domain: 'daily',
  },
  {
    goal: 'Melakukan transisi topik',
    situation: 'Saat ingin pindah pembahasan tanpa terasa kaku.',
    keySentence: 'By the way, have you seen the new update?',
    drill:
      'Buat 10 transisi topik dari topik pribadi ke topik umum secara halus.',
    domain: 'daily',
  },
  {
    goal: 'Menutup percakapan natural',
    situation: 'Saat ingin mengakhiri obrolan dengan sopan.',
    keySentence: 'It was nice talking to you.',
    drill: 'Latih closing line singkat dengan intonasi ramah.',
    domain: 'daily',
    survivalPriority: 'high',
  },
  {
    goal: 'Melakukan follow-up chat',
    situation: 'Saat perlu menindaklanjuti percakapan sebelumnya.',
    keySentence: "Just checking in about yesterday's plan.",
    drill: 'Kirim 6 follow-up line yang singkat dan jelas.',
    domain: 'daily',
  },
  {
    goal: 'Menyampaikan terima kasih yang tepat',
    situation: 'Saat menerima bantuan kecil hingga besar.',
    keySentence: 'Thanks a lot for your help today.',
    drill:
      'Latih 10 ekspresi terima kasih dengan tingkat formalitas berbeda.',
    domain: 'daily',
  },
  {
    goal: 'Menyampaikan permintaan maaf ringan',
    situation: 'Saat terlambat, lupa, atau salah paham kecil.',
    keySentence: "Sorry, I'm running a bit late.",
    drill: 'Praktikkan pola maaf: apology + reason + next action.',
    domain: 'daily',
  },
  {
    goal: 'Memberi pujian secara tulus',
    situation: 'Saat menghargai hasil kerja atau penampilan orang lain.',
    keySentence: 'You did a great job on that presentation.',
    drill: 'Latih pujian yang spesifik untuk 8 konteks berbeda.',
    domain: 'daily',
  },
  {
    goal: 'Merespons pujian dengan sopan',
    situation: 'Saat menerima apresiasi dari orang lain.',
    keySentence: 'Thank you, I appreciate that.',
    drill: 'Latih 5 respon pujian singkat tanpa terdengar canggung.',
    domain: 'daily',
  },
];

export const PHASE_02_GOALS = createPhaseGoals({
  phaseId: 'phase-02',
  phaseTitle: 'Daily Interaction Fundamentals',
  levelBand: 'basic',
  defaultKeySentence2: 'That makes sense to me.',
  defaultKeySentence3: 'Let me know what you think.',
  seeds,
});
