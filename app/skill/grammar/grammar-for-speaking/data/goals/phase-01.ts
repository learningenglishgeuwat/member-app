import { createPhaseGoals, type GoalSeed } from './createPhaseGoals';

const seeds: GoalSeed[] = [
  {
    goal: 'Memesan makanan dengan sopan',
    situation: 'Saat di restoran, warung, atau food court.',
    keySentence: "I'd like a bowl of chicken soup, please.",
    drill:
      'Role-play 5 pesanan berbeda: menu utama, minuman, dan permintaan tambahan.',
    domain: 'daily',
    survivalPriority: 'critical',
  },
  {
    goal: 'Menanyakan harga barang',
    situation: 'Saat berbelanja kebutuhan harian.',
    keySentence: 'How much is this item?',
    drill: 'Latih dialog harga untuk 10 barang dengan nominal berbeda.',
    domain: 'daily',
    survivalPriority: 'critical',
  },
  {
    goal: 'Meminta arah jalan',
    situation: 'Saat mencari lokasi tujuan di area baru.',
    keySentence: 'Excuse me, how do I get to the bus stop?',
    drill: 'Gunakan peta dan latih tanya arah ke 5 lokasi publik.',
    domain: 'public',
    survivalPriority: 'critical',
  },
  {
    goal: 'Berkomunikasi saat naik transport',
    situation: 'Saat di taksi, bus, atau kereta.',
    keySentence: 'Please stop near the station.',
    drill: 'Simulasikan percakapan naik transport dari awal hingga turun.',
    domain: 'public',
    survivalPriority: 'critical',
  },
  {
    goal: 'Menanyakan jadwal layanan',
    situation: 'Saat perlu tahu jam operasional atau keberangkatan.',
    keySentence: 'What time is the next departure?',
    drill: 'Buat 10 pertanyaan jadwal untuk konteks transport dan layanan umum.',
    domain: 'public',
    survivalPriority: 'high',
  },
  {
    goal: 'Melakukan booking sederhana',
    situation: 'Saat memesan meja, kursi, atau janji dasar.',
    keySentence: "I'd like to make a reservation for two.",
    drill: 'Praktikkan booking dengan variasi jumlah orang dan waktu.',
    domain: 'daily',
    survivalPriority: 'high',
  },
  {
    goal: 'Check-in layanan',
    situation: 'Saat datang ke hotel, klinik, atau kantor layanan.',
    keySentence: 'I have a booking under my name.',
    drill:
      'Latih check-in flow: sebut nama, tunjukkan data, dan konfirmasi jadwal.',
    domain: 'public',
    survivalPriority: 'high',
  },
  {
    goal: 'Check-out layanan',
    situation: 'Saat menyelesaikan penggunaan layanan.',
    keySentence: "I'd like to check out now.",
    drill: 'Simulasikan check-out dengan pertanyaan biaya dan bukti pembayaran.',
    domain: 'public',
    survivalPriority: 'high',
  },
  {
    goal: 'Menanyakan lokasi fasilitas',
    situation: 'Saat butuh toilet, ATM, lift, atau loket bantuan.',
    keySentence: 'Where is the nearest restroom?',
    drill:
      'Praktikkan 12 pertanyaan lokasi fasilitas dengan jawaban arah singkat.',
    domain: 'public',
    survivalPriority: 'critical',
  },
  {
    goal: 'Menyebut kebutuhan mendesak',
    situation: 'Saat butuh pertolongan cepat di ruang publik.',
    keySentence: 'I need help right now.',
    drill:
      'Latih kalimat bantuan mendesak dengan volume, intonasi, dan kejelasan.',
    domain: 'emergency',
    survivalPriority: 'critical',
  },
  {
    goal: 'Meminta bantuan publik',
    situation: 'Saat membutuhkan bantuan petugas informasi.',
    keySentence: 'Could you help me find this address?',
    drill:
      'Role-play meminta bantuan petugas dengan data alamat dan tujuan berbeda.',
    domain: 'public',
    survivalPriority: 'high',
  },
  {
    goal: 'Menanyakan metode pembayaran',
    situation: 'Saat transaksi di toko atau loket.',
    keySentence: 'Can I pay by card or QR code?',
    drill: 'Latih 10 kalimat pembayaran tunai dan non-tunai.',
    domain: 'finance',
    survivalPriority: 'high',
  },
  {
    goal: 'Memastikan ketersediaan barang',
    situation: 'Saat stok produk belum terlihat di rak.',
    keySentence: 'Do you have this in stock?',
    drill:
      'Buat dialog cek stok dengan variasi warna, ukuran, dan jumlah barang.',
    domain: 'daily',
    survivalPriority: 'high',
  },
  {
    goal: 'Mengonfirmasi alamat tujuan',
    situation: 'Saat pesan antar atau booking transport.',
    keySentence: 'Please confirm this delivery address.',
    drill: 'Latih konfirmasi alamat lengkap dengan ejaan jalan dan nomor.',
    domain: 'public',
    survivalPriority: 'high',
  },
  {
    goal: 'Menangani perubahan rencana harian',
    situation: 'Saat jadwal tiba-tiba berubah.',
    keySentence: 'Can we move it to tomorrow morning?',
    drill:
      'Praktikkan 8 skenario perubahan jadwal dengan alasan singkat yang sopan.',
    domain: 'daily',
    survivalPriority: 'high',
  },
];

export const PHASE_01_GOALS = createPhaseGoals({
  phaseId: 'phase-01',
  phaseTitle: 'Daily Survival Core',
  levelBand: 'basic',
  defaultKeySentence2: 'Could you help me with the next step?',
  defaultKeySentence3: 'Please confirm the details for me.',
  seeds,
});
