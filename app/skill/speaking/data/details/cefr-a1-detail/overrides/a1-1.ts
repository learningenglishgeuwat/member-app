import type { CoherenceSectionOverride, ManualRoleplayPair } from './shared';

const dialog = (...lines: string[]) => lines.join('\n');

export const MANUAL_ROLEPLAY_DIALOGS_A1_1: Record<string, ManualRoleplayPair> = {
'cefr-a1-1-g01': [
    dialog(
      'Partner: Can you send this report now?',
      'You: Yes, I can do that.',
      'Partner: Do you mean right now?',
      'You: Yes, right now.',
      'Partner: Great, please send it.',
      'You: Okay, I will do it now.',
    ),
    dialog(
      'Partner: Can you join the call now?',
      'You: No, I cannot join now.',
      'Partner: Okay. Can you join later today?',
      'You: Could you say that again, please?',
      'Partner: Can you join at 3 PM?',
      'You: Yes, I can join at 3 PM.',
    ),
  ],
'cefr-a1-1-g02': [
    dialog(
      'Partner: The class starts at 8:40 in room 12.',
      'You: Sorry, could you repeat that?',
      'Partner: Sure. Room 12 at 8:40.',
      'You: Please say it one more time.',
      'Partner: Room 12, 8:40 AM.',
      'You: Got it. Thanks.',
    ),
    dialog(
      'Partner: Fill page three, then submit before noon.',
      'You: Could you speak a bit slower?',
      'Partner: Fill page three and submit before noon.',
      'You: I missed the last part.',
      'Partner: Submit before noon.',
      'You: Got it. Thanks.',
    ),
  ],
'cefr-a1-1-g03': [
    dialog(
      'Partner: Please wait at the lobby first.',
      'You: What does this word mean?',
      'Partner: Lobby means the waiting area near the entrance.',
      'You: So I should wait here, right?',
      'Partner: Yes, exactly.',
      'You: Okay, got it.',
    ),
    dialog(
      'Partner: Your account is pending verification.',
      'You: Could you explain it simply?',
      'Partner: We still need to check your documents.',
      'You: Can you give me one example?',
      'Partner: For example, your ID photo.',
      'You: Okay, got it.',
    ),
  ],
'cefr-a1-1-g04': [
    dialog(
      'Partner: May I have your full name?',
      'You: My full name is Rina Putri.',
      'Partner: Could you spell your first name, please?',
      "You: Sure. It's R-I-N-A.",
      'Partner: Let me check: R-I-N-A.',
      "You: Yes, that's correct.",
    ),
    dialog(
      'Partner: I heard Rena. Is that right?',
      "You: Not Rena. It's Rina, R-I-N-A.",
      'Partner: Got it, R-I-N-A. Is that correct?',
      "You: Yes, that's correct. Could you spell your name for me?",
      "Partner: Sure. It's Alex, A-L-E-X.",
      'You: Thanks. Let me check: A-L-E-X, right?',
    ),
  ],
'cefr-a1-1-g05': [
    dialog(
      'Partner: Hi, nice to meet you. Please introduce yourself.',
      "You: Hi, I'm Rina from Bandung.",
      'Partner: Where do you live now?',
      'You: I live in Jakarta now.',
      'Partner: What do you do?',
      "You: I'm a university student.",
    ),
    dialog(
      'Partner: Nice to meet you too.',
      'You: Nice to meet you.',
      'Partner: My name is Alexander, but you can call me Alex.',
      'You: What should I call you?',
      'Partner: Just call me Alex.',
      'You: Great, nice to meet you, Alex.',
    ),
  ],
'cefr-a1-1-g06': [
    dialog(
      'Partner: Hi there.',
      'You: What is your name?',
      'Partner: My name is Alex.',
      'You: Where are you from?',
      'Partner: I am from Singapore.',
      'You: Nice meeting you.',
    ),
    dialog(
      'Partner: My name is John.',
      'You: Sorry, did I say your name right?',
      'Partner: It is John, with an o.',
      'You: How do you spell your name?',
      'Partner: J-O-H-N.',
      'You: Nice meeting you.',
    ),
  ],
'cefr-a1-1-g07': [
    dialog(
      'Partner: Can I have your contact number?',
      'You: My phone number is zero eight one two.',
      'Partner: Please continue.',
      'You: I will say it slowly.',
      'Partner: Okay, I am ready.',
      'You: Please repeat it back to me.',
    ),
    dialog(
      'Partner: I got zero eight one two six one. Right?',
      'You: Did you get all the digits?',
      'Partner: Not all. Please repeat.',
      'You: My phone number is zero eight one two six one three five.',
      'Partner: Zero eight one two six one three five?',
      'You: Thanks, that is correct.',
    ),
  ],
'cefr-a1-1-g08': [
    dialog(
      'Partner: The meeting is on Monday at nine.',
      'You: Is the meeting at nine o\'clock?',
      'Partner: Yes.',
      'You: Is it on Monday?',
      'Partner: Yes, on Monday.',
      'You: Great, see you then.',
    ),
    dialog(
      'Partner: We changed it to Tuesday at ten.',
      'You: Let me repeat: Tuesday at ten.',
      'Partner: Correct.',
      'You: Is that correct?',
      'Partner: Yes, exactly.',
      'You: Great, see you then.',
    ),
  ],
'cefr-a1-1-g09': [
    dialog(
      'Partner: You look confused.',
      'You: Can you help me for a moment?',
      'Partner: Sure. What do you need?',
      'You: I need help with this form.',
      'Partner: Start from your full name here.',
      'You: Thank you for helping me.',
    ),
    dialog(
      'Partner: Please fill section B first.',
      'You: Could you show me where to start?',
      'Partner: Start from this top line.',
      'You: Sorry, I am still confused.',
      'Partner: No problem. I will guide you step by step.',
      'You: Thank you for helping me.',
    ),
  ],
'cefr-a1-1-g10': [
    dialog(
      'Partner: Do you have the document now?',
      'You: Please wait a moment.',
      'Partner: Sure.',
      'You: Give me one minute, please.',
      'Partner: No problem.',
      'You: Thanks for waiting.',
    ),
    dialog(
      'Partner: Can we continue now?',
      'You: I will come back soon.',
      'Partner: Okay, I will wait here.',
      'You: Is it okay if I check first?',
      'Partner: Yes, go ahead.',
      'You: Thanks for waiting.',
    ),
  ],
'cefr-a1-1-g11': [
    dialog(
      'Partner: We are done with your request.',
      'You: Thank you for your time.',
      'Partner: You are welcome.',
      'You: I really appreciate your help.',
      'Partner: Happy to help.',
      'You: Okay, have a good day.',
    ),
    dialog(
      'Partner: Do you need anything else?',
      'You: Is there anything else I should do?',
      'Partner: No, everything is complete.',
      'You: That helps me a lot.',
      'Partner: Great.',
      'You: Okay, have a good day.',
    ),
  ],
'cefr-a1-1-g12': [
    dialog(
      'Partner: This line is wrong.',
      'You: Sorry, I made a mistake.',
      'Partner: Please correct it.',
      'You: Let me fix it now.',
      'Partner: Okay.',
      'You: Thanks for your patience.',
    ),
    dialog(
      'Partner: It is still not correct.',
      'You: I will do it again correctly.',
      'Partner: Can you check once more?',
      'You: Could you check it once more?',
      'Partner: Yes, now it is correct.',
      'You: Thanks for your patience.',
    ),
  ]
};

export const MANUAL_ROLEPLAY_DIALOGS_ID_A1_1: Record<string, ManualRoleplayPair> = {
'cefr-a1-1-g01': [
    dialog(
      'Bisa kirim laporan ini sekarang?',
      'Ya, saya bisa lakukan itu.',
      'Maksudnya sekarang juga?',
      'Ya, sekarang juga.',
      'Baik, tolong kirim.',
      'Oke, saya kerjakan sekarang.',
    ),
    dialog(
      'Bisa ikut panggilan sekarang?',
      'Belum, saya belum bisa ikut sekarang.',
      'Oke. Bisa ikut nanti hari ini?',
      'Bisa ulangi lagi, tolong?',
      'Bisa ikut jam 3 sore?',
      'Ya, saya bisa ikut jam 3 sore.',
    ),
  ],
'cefr-a1-1-g02': [
    dialog(
      'Kelas mulai jam 8:40 di ruang 12.',
      'Maaf, bisa diulang?',
      'Tentu. Ruang 12 jam 8:40.',
      'Tolong ucapkan sekali lagi.',
      'Ruang 12, jam 8:40 pagi.',
      'Oke, saya paham. Terima kasih.',
    ),
    dialog(
      'Isi halaman tiga, lalu kumpulkan sebelum tengah hari.',
      'Bisa bicara sedikit lebih pelan?',
      'Isi halaman tiga dan kumpulkan sebelum tengah hari.',
      'Saya tidak menangkap bagian terakhir.',
      'Kumpulkan sebelum tengah hari.',
      'Oke, saya paham. Terima kasih.',
    ),
  ],
'cefr-a1-1-g03': [
    dialog(
      'Tolong tunggu dulu di lobi.',
      'Apa arti kata ini?',
      'Lobi artinya area tunggu dekat pintu masuk.',
      'Jadi saya harus menunggu di sini, ya?',
      'Ya, tepat.',
      'Oke, saya paham.',
    ),
    dialog(
      'Akun Anda masih menunggu verifikasi.',
      'Bisa jelaskan dengan sederhana?',
      'Kami masih perlu memeriksa dokumen Anda.',
      'Bisa kasih satu contoh?',
      'Contohnya, foto KTP Anda.',
      'Oke, saya paham.',
    ),
  ],
'cefr-a1-1-g04': [
    dialog(
      'Boleh saya minta nama lengkap Anda?',
      'Nama lengkap saya Rina Putri.',
      'Bisa eja nama depannya, tolong?',
      'Tentu. Ejaannya R-I-N-A.',
      'Biar saya cek: R-I-N-A.',
      'Ya, itu benar.',
    ),
    dialog(
      'Saya dengar Rena. Benar begitu?',
      'Bukan Rena. Nama saya Rina, R-I-N-A.',
      'Baik, R-I-N-A. Benar?',
      'Ya, benar. Bisa eja nama Anda untuk saya?',
      'Tentu. Nama saya Alex, ejaannya A-L-E-X.',
      'Terima kasih. Biar saya cek: A-L-E-X, benar?',
    ),
  ],
'cefr-a1-1-g05': [
    dialog(
      'Hai, senang bertemu. Tolong perkenalkan diri.',
      'Hai, saya Rina dari Bandung.',
      'Sekarang kamu tinggal di mana?',
      'Saya tinggal di Jakarta sekarang.',
      'Kamu beraktivitas apa?',
      'Saya mahasiswa.',
    ),
    dialog(
      'Senang bertemu juga.',
      'Senang bertemu denganmu.',
      'Nama saya Alexander, tapi kamu bisa panggil saya Alex.',
      'Saya sebaiknya panggil kamu apa?',
      'Panggil saja Alex.',
      'Baik, senang bertemu denganmu, Alex.',
    ),
  ],
'cefr-a1-1-g06': [
    dialog(
      'Hai.',
      'Siapa nama kamu?',
      'Nama saya Alex.',
      'Kamu dari mana?',
      'Saya dari Singapura.',
      'Senang berkenalan denganmu.',
    ),
    dialog(
      'Nama saya John.',
      'Maaf, apakah saya menyebut nama kamu dengan benar?',
      'John, pakai huruf o.',
      'Nama kamu dieja bagaimana?',
      'J-O-H-N.',
      'Senang berkenalan denganmu.',
    ),
  ],
'cefr-a1-1-g07': [
    dialog(
      'Boleh minta nomor kontak Anda?',
      'Nomor telepon saya nol delapan satu dua.',
      'Silakan lanjutkan.',
      'Saya akan ucapkan pelan-pelan.',
      'Oke, saya siap.',
      'Tolong ulangi kembali ke saya.',
    ),
    dialog(
      'Saya dapat nol delapan satu dua enam satu. Benar?',
      'Apakah semua angkanya sudah masuk?',
      'Belum semua. Tolong ulangi.',
      'Nomor telepon saya nol delapan satu dua enam satu tiga lima.',
      'Nol delapan satu dua enam satu tiga lima?',
      'Terima kasih, itu benar.',
    ),
  ],
'cefr-a1-1-g08': [
    dialog(
      'Rapatnya hari Senin jam sembilan.',
      'Rapatnya jam sembilan?',
      'Ya.',
      'Apakah hari Senin?',
      'Ya, hari Senin.',
      'Baik, sampai ketemu nanti.',
    ),
    dialog(
      'Kami ubah jadi Selasa jam sepuluh.',
      'Biar saya ulang: Selasa jam sepuluh.',
      'Benar.',
      'Apakah itu benar?',
      'Ya, tepat.',
      'Baik, sampai ketemu nanti.',
    ),
  ],
'cefr-a1-1-g09': [
    dialog(
      'Kamu terlihat bingung.',
      'Bisa bantu saya sebentar?',
      'Tentu. Kamu butuh apa?',
      'Saya butuh bantuan untuk formulir ini.',
      'Mulai dari nama lengkap kamu di sini.',
      'Terima kasih sudah membantu saya.',
    ),
    dialog(
      'Tolong isi bagian B dulu.',
      'Bisa tunjukkan mulai dari mana?',
      'Mulai dari baris paling atas ini.',
      'Maaf, saya masih bingung.',
      'Tidak masalah. Saya pandu langkah demi langkah.',
      'Terima kasih sudah membantu saya.',
    ),
  ],
'cefr-a1-1-g10': [
    dialog(
      'Apakah dokumennya sudah ada sekarang?',
      'Tolong tunggu sebentar.',
      'Tentu.',
      'Beri saya satu menit, tolong.',
      'Tidak masalah.',
      'Terima kasih sudah menunggu.',
    ),
    dialog(
      'Bisa kita lanjut sekarang?',
      'Saya akan segera kembali.',
      'Oke, saya tunggu di sini.',
      'Boleh kalau saya cek dulu?',
      'Ya, silakan.',
      'Terima kasih sudah menunggu.',
    ),
  ],
'cefr-a1-1-g11': [
    dialog(
      'Permintaan Anda sudah selesai.',
      'Terima kasih atas waktunya.',
      'Sama-sama.',
      'Saya sangat menghargai bantuan Anda.',
      'Senang bisa membantu.',
      'Oke, semoga harimu menyenangkan.',
    ),
    dialog(
      'Apakah Anda butuh hal lain?',
      'Apakah ada lagi yang perlu saya lakukan?',
      'Tidak, semuanya sudah lengkap.',
      'Itu sangat membantu saya.',
      'Bagus.',
      'Oke, semoga harimu menyenangkan.',
    ),
  ],
'cefr-a1-1-g12': [
    dialog(
      'Baris ini salah.',
      'Maaf, saya membuat kesalahan.',
      'Tolong perbaiki.',
      'Biar saya perbaiki sekarang.',
      'Oke.',
      'Terima kasih atas kesabarannya.',
    ),
    dialog(
      'Ini masih belum benar.',
      'Saya akan kerjakan lagi dengan benar.',
      'Bisa cek sekali lagi?',
      'Bisa cek sekali lagi?',
      'Ya, sekarang sudah benar.',
      'Terima kasih atas kesabarannya.',
    ),
  ]
};

export const SCENARIO_B_MISSION_OVERRIDES_A1_1: Record<string, string> = {
'cefr-a1-1-g04':
    'Partner salah dengar atau salah eja nama. Ulang ejaan nama kamu, konfirmasi hasil ejaan partner, lalu minta ejaan nama partner.'
};

export const COHERENCE_SECTION_OVERRIDES_A1_1: Record<string, CoherenceSectionOverride> = {
'cefr-a1-1-g01': {
    goalSnapshot:
      'Goal ini melatih kamu merespons yes/no dengan cepat lalu mengunci waktu tindakan. Fokusnya adalah keputusan singkat, klarifikasi seperlunya, dan penutupan yang tegas.',
    whyThisMatters:
      'Di situasi instruksi cepat, jawaban yang berputar bikin lawan bicara ragu. Pola yes/no -> clarify -> action time membuat keputusan langsung jelas dan meminimalkan salah paham.',
    situationBreakdown: [
      'Open: jawab keputusan dalam 1 kalimat pertama, misalnya "Yes, I can do that." atau "No, I can\'t do it yet."',
      'Clarify: saat detail belum jelas, pakai "Could you say that again?" lalu pastikan urgensi dengan "Do you need it right now?"',
      'Close: tutup dengan komitmen waktu yang bisa dieksekusi, misalnya "Okay, I\'ll do it now."',
    ],
    pronunciationNotes: [
      'Tekankan kata keputusan di awal kalimat, terutama pada "Yes" dan "No", supaya intent langsung terdengar.',
      'Pada "I can\'t do it yet", bunyi /t/ di "can\'t" perlu jelas agar tidak terdengar seperti "can".',
      'Ucapkan "Could you say that again?" dengan intonasi naik di akhir agar terdengar sebagai permintaan klarifikasi.',
    ],
    commonMistakes: [
      {
        mistake: 'Menjelaskan panjang lebar sebelum menyatakan keputusan.',
        correction: 'Mulai dari jawaban inti dulu: "Yes, I can do that." atau "No, I can\'t do it yet."',
      },
      {
        mistake: 'Tetap menebak saat instruksi belum jelas.',
        correction: 'Gunakan repair phrase langsung: "Could you say that again?"',
      },
      {
        mistake: 'Menutup tanpa kepastian waktu tindakan.',
        correction: 'Kunci penutupan dengan komitmen waktu: "Okay, I\'ll do it now."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Immediate Task',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi tugas singkat. Jawab yes/no dengan cepat, cek urgensi, lalu tutup dengan komitmen waktu tindakan.',
      },
      {
        title: 'Scenario B - Clarify and Commit',
        partnerRole: 'teman latihan',
        mission:
          'Partner menyebut opsi waktu. Minta ulang bila belum jelas, konfirmasi ulang waktu, lalu beri keputusan akhir yang tegas.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Can you send this report?',
        'You: Yes, I can do that.',
        'Partner: Please send it today.',
        'You: Do you need it right now?',
        'Partner: Yes, right now, please.',
        "You: Okay, I'll do it now.",
      ),
      dialog(
        'Partner: Can you join the call now?',
        "You: No, I can't do it yet.",
        'Partner: Can you join at 3 PM?',
        'You: Could you say that again?',
        'Partner: Can you join at 3 PM?',
        'You: Yes, I can do that.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Bisa kirim laporan ini?',
        'Ya, saya bisa lakukan itu.',
        'Tolong kirim hari ini.',
        'Kamu perlu sekarang juga?',
        'Ya, sekarang juga.',
        'Oke, saya kerjakan sekarang.',
      ),
      dialog(
        'Bisa ikut panggilan sekarang?',
        'Belum, saya belum bisa lakukan itu.',
        'Bisa ikut jam 3 sore?',
        'Bisa ucapkan lagi?',
        'Bisa ikut jam 3 sore?',
        'Ya, saya bisa lakukan itu.',
      ),
    ],
  },
'cefr-a1-1-g02': {
    goalSnapshot:
      'Goal ini melatih kamu meminta lawan bicara mengulang ucapan dengan sopan saat kamu tidak menangkap kalimat pertama. Fokusnya adalah repair cepat tanpa panik, lalu menutup dengan konfirmasi bahwa kamu sudah paham.',
    whyThisMatters:
      'Dalam situasi real-time, salah dengar detail kecil bisa bikin kamu salah kelas, salah waktu, atau salah langkah. Pola minta ulang yang sopan membuat percakapan tetap lancar dan akurat.',
    situationBreakdown: [
      'Open: saat tidak dengar jelas, mulai dengan repair phrase langsung seperti "Sorry, could you repeat that?"',
      'Clarify: kalau tempo masih terlalu cepat, pakai "Could you speak a bit slower?" atau jelaskan bagian yang terlewat: "I missed the last part."',
      'Close: setelah detail sudah jelas, tutup dengan konfirmasi singkat: "Got it. Thanks."',
    ],
    pronunciationNotes: [
      'Pada "repeat", tekanan ada di suku kata kedua (re-PEAT) supaya terdengar natural.',
      'Pada "Could you speak a bit slower?", jaga artikulasi kata "bit" tetap jelas agar tidak hilang saat bicara cepat.',
      'Pada "I missed the last part.", bunyi akhir "-st" di "missed" perlu terdengar supaya makna kalimat tetap utuh.',
    ],
    commonMistakes: [
      {
        mistake: 'Memotong dengan kata tunggal seperti "What?" yang terdengar terlalu kasar.',
        correction: 'Gunakan bentuk sopan: "Sorry, could you repeat that?"',
      },
      {
        mistake: 'Hanya bilang "repeat" tanpa menyebut masalah utama (tempo atau bagian mana yang hilang).',
        correction: 'Spesifikkan kebutuhanmu: "Could you speak a bit slower?" atau "I missed the last part."',
      },
      {
        mistake: 'Setelah paham, tidak memberi penutupan sehingga lawan bicara ragu.',
        correction: 'Tutup dengan sinyal pemahaman: "Got it. Thanks."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Class Schedule',
        partnerRole: 'teman latihan',
        mission:
          'Partner menyebut jadwal kelas dengan cepat. Minta ulang, minta tempo lebih pelan, lalu konfirmasi kamu sudah paham.',
      },
      {
        title: 'Scenario B - Instruction Clarification',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi instruksi dua langkah. Minta diulang, klarifikasi bagian terakhir yang terlewat, lalu tutup dengan konfirmasi.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: The class starts at 8:40 in room 12.',
        'You: Sorry, could you repeat that?',
        'Partner: Sure. Room 12 at 8:40.',
        'You: Could you speak a bit slower?',
        'Partner: Room 12, eight forty AM.',
        'You: Got it. Thanks.',
      ),
      dialog(
        'Partner: Fill page three, then submit before noon.',
        'You: Please say it one more time.',
        'Partner: Fill page three, then submit before noon.',
        'You: I missed the last part.',
        'Partner: Submit before noon.',
        'You: Got it. Thanks.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Kelas dimulai jam 8:40 di ruang 12.',
        'Maaf, bisa diulang?',
        'Tentu. Ruang 12 jam 8:40.',
        'Bisa bicara sedikit lebih pelan?',
        'Ruang 12, jam delapan empat puluh pagi.',
        'Oke, saya paham. Terima kasih.',
      ),
      dialog(
        'Isi halaman tiga, lalu kumpulkan sebelum tengah hari.',
        'Tolong ucapkan sekali lagi.',
        'Isi halaman tiga, lalu kumpulkan sebelum tengah hari.',
        'Saya tidak menangkap bagian terakhir.',
        'Kumpulkan sebelum tengah hari.',
        'Oke, saya paham. Terima kasih.',
      ),
    ],
  },
'cefr-a1-1-g03': {
    goalSnapshot:
      'Goal ini melatih kamu meminta penjelasan arti kata atau instruksi yang belum kamu pahami. Fokusnya adalah berhenti menebak, lalu klarifikasi sampai makna dan tindakanmu benar.',
    whyThisMatters:
      'Di percakapan nyata, satu kata yang tidak dipahami bisa membuat kamu salah menunggu, salah isi form, atau salah langkah. Dengan pola tanya arti -> minta penjelasan sederhana -> minta contoh, kamu bisa cepat kembali ke jalur yang benar.',
    situationBreakdown: [
      'Open: saat ada kata tidak familiar, buka dengan pertanyaan langsung: "What does this word mean?"',
      'Clarify: jika penjelasan masih terlalu abstrak, lanjutkan dengan "Could you explain it simply?" dan "Can you give me one example?"',
      'Close: konfirmasi tindakan yang harus kamu lakukan, misalnya "So I should wait here, right?", lalu tutup dengan "Okay, got it."',
    ],
    pronunciationNotes: [
      'Pada "What does this word mean?", tekan kata "word" dan "mean" agar inti pertanyaan terdengar jelas.',
      'Pada kata "example", tekan suku kata tengah (eg-ZAM-ple) supaya pengucapan lebih natural.',
      'Pada "So I should wait here, right?", naikkan intonasi di akhir untuk menandai konfirmasi.',
    ],
    commonMistakes: [
      {
        mistake: 'Langsung bilang "I don\'t understand" tanpa menanyakan bagian spesifik.',
        correction: 'Mulai lebih terarah dengan "What does this word mean?"',
      },
      {
        mistake: 'Menerima penjelasan pertama walau masih bingung.',
        correction: 'Lanjutkan klarifikasi: "Could you explain it simply?" atau "Can you give me one example?"',
      },
      {
        mistake: 'Menutup percakapan tanpa konfirmasi tindakan.',
        correction: 'Pastikan langkahmu benar dengan "So I should wait here, right?" lalu tutup "Okay, got it."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Word Meaning in Service Area',
        partnerRole: 'teman latihan',
        mission:
          'Partner memakai kata yang belum kamu kenal. Tanyakan arti kata, konfirmasi tindakan yang benar, lalu tutup dengan sinyal paham.',
      },
      {
        title: 'Scenario B - Instruction Clarification',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi instruksi dengan istilah baru. Minta penjelasan sederhana, minta satu contoh, lalu akhiri dengan konfirmasi paham.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Please wait at the lobby first.',
        'You: What does this word mean?',
        'Partner: Lobby means the waiting area near the entrance.',
        'You: So I should wait here, right?',
        'Partner: Yes, please wait here until your name is called.',
        'You: Okay, got it.',
      ),
      dialog(
        'Partner: Your account is pending verification.',
        'You: Could you explain it simply?',
        'Partner: It means we still need to check your documents.',
        'You: Can you give me one example?',
        'Partner: Sure. We need to check your ID photo first.',
        'You: Okay, got it.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Tolong tunggu dulu di lobi.',
        'Apa arti kata ini?',
        'Lobi artinya area tunggu dekat pintu masuk.',
        'Jadi saya harus menunggu di sini, ya?',
        'Ya, tolong tunggu di sini sampai nama Anda dipanggil.',
        'Oke, saya paham.',
      ),
      dialog(
        'Akun Anda masih menunggu verifikasi.',
        'Bisa jelaskan dengan sederhana?',
        'Artinya kami masih perlu memeriksa dokumen Anda.',
        'Bisa kasih satu contoh?',
        'Tentu. Kami perlu cek foto KTP Anda dulu.',
        'Oke, saya paham.',
      ),
    ],
  },
'cefr-a1-1-g04': {
    goalSnapshot:
      'Goal ini melatih kamu menyebut nama lengkap dan mengecek ejaan nama secara akurat dalam interaksi formal. Fokusnya adalah sebut nama, spell jelas, lalu konfirmasi ulang supaya tidak salah data.',
    whyThisMatters:
      'Saat registrasi, salah satu huruf nama bisa berdampak ke tiket, dokumen, atau akun layanan. Pola sebut nama -> spell -> verify membuat data lebih aman dan percakapan tetap efisien.',
    situationBreakdown: [
      'Open: mulai dengan menyebut identitas inti secara lengkap, misalnya "My full name is Rina Putri."',
      'Clarify: saat diminta ejaan atau ada salah dengar, jawab dengan spelling jelas: "It\'s spelled R-I-N-A."',
      'Close: verifikasi dua arah dengan "Yes, that\'s correct.", lalu cek balik dengan "Could you spell your name for me?" dan "Let me check the spelling again."',
    ],
    pronunciationNotes: [
      'Saat spelling, beri jeda pendek antar huruf: "R - I - N - A" agar tiap huruf terdengar jelas.',
      'Bedakan bunyi nama "Rina" dan "Rena" dengan vokal /iː/ pada suku kata pertama "Rina".',
      'Pada konfirmasi, tekan kata "correct" di kalimat "Yes, that\'s correct." untuk menandai validasi final.',
    ],
    commonMistakes: [
      {
        mistake: 'Menyebut nama tanpa bentuk lengkap saat konteks formal.',
        correction: 'Gunakan kalimat penuh: "My full name is Rina Putri."',
      },
      {
        mistake: 'Spelling terlalu cepat sehingga huruf terdengar menyatu.',
        correction: 'Ucapkan berjarak: "It\'s spelled R-I-N-A."',
      },
      {
        mistake: 'Menutup tanpa konfirmasi akhir atau tanpa cek balik nama lawan bicara.',
        correction:
          'Tutup dengan "Yes, that\'s correct.", lalu lanjutkan "Could you spell your name for me?" bila perlu verifikasi dua arah.',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Registration Name Check',
        partnerRole: 'teman latihan',
        mission:
          'Partner meminta data nama untuk registrasi. Sebut nama lengkap, spell nama depan, lalu konfirmasi ejaan akhir.',
      },
      {
        title: 'Scenario B - Misheard Name Repair',
        partnerRole: 'teman latihan',
        mission:
          'Partner salah dengar nama kamu. Perbaiki ejaan, konfirmasi hasilnya, lalu minta ejaan nama partner untuk cek dua arah.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: May I have your full name?',
        'You: My full name is Rina Putri.',
        'Partner: Could you spell your first name, please?',
        "You: It's spelled R-I-N-A.",
        'Partner: R-I-N-A. Is that correct?',
        "You: Yes, that's correct.",
      ),
      dialog(
        'Partner: I heard Rena. Is that right?',
        "You: No. It's spelled R-I-N-A.",
        'Partner: Got it, R-I-N-A.',
        'You: Could you spell your name for me?',
        "Partner: Sure. It's Arman, A-R-M-A-N.",
        'You: Let me check the spelling again: A-R-M-A-N.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Boleh saya minta nama lengkap Anda?',
        'Nama lengkap saya Rina Putri.',
        'Bisa eja nama depannya, tolong?',
        'Ejaannya R-I-N-A.',
        'R-I-N-A. Apakah itu benar?',
        'Ya, itu benar.',
      ),
      dialog(
        'Saya dengar Rena. Benar begitu?',
        'Bukan. Ejaannya R-I-N-A.',
        'Baik, R-I-N-A.',
        'Bisa eja nama Anda untuk saya?',
        'Tentu. Nama saya Arman, ejaannya A-R-M-A-N.',
        'Biar saya cek ejaannya lagi: A-R-M-A-N.',
      ),
    ],
  },
'cefr-a1-1-g05': {
    goalSnapshot:
      'Goal ini melatih kamu memperkenalkan diri secara singkat, jelas, dan natural saat bertemu orang baru. Fokusnya adalah menyebut identitas inti, memberi info singkat tentang diri, lalu menjaga percakapan dua arah.',
    whyThisMatters:
      'Di awal perkenalan, kesan pertama dibentuk dari 20-30 detik pertama. Jika kamu bisa memperkenalkan diri dengan struktur sederhana dan ramah, lawan bicara lebih mudah lanjut ngobrol dengan nyaman.',
    situationBreakdown: [
      'Open: mulai dengan kalimat perkenalan utama, misalnya "Hi, I\'m Rina from Bandung."',
      'Clarify: tambahkan info pendukung yang relevan seperti domisili dan aktivitas: "I live in Jakarta now." dan "I\'m a university student."',
      'Close: tutup dengan sopan dan buka ruang dua arah: "Nice to meet you." lalu "What should I call you?"',
    ],
    pronunciationNotes: [
      'Latih kontraksi "I\'m" (/aɪm/) supaya perkenalan terdengar natural, tidak kaku seperti membaca teks.',
      'Pada nama kota seperti "Bandung" dan "Jakarta", jaga artikulasi jelas agar lawan bicara tidak salah dengar asal kamu.',
      'Pada "Nice to meet you.", gunakan intonasi hangat dan ringan supaya terdengar ramah, bukan datar.',
    ],
    commonMistakes: [
      {
        mistake: 'Memberi perkenalan terlalu panjang di kalimat pertama.',
        correction: 'Mulai ringkas dengan "Hi, I\'m Rina from Bandung."',
      },
      {
        mistake: 'Hanya menjawab tentang diri sendiri tanpa memberi ruang lawan bicara.',
        correction: 'Tambahkan pertanyaan balasan: "What should I call you?"',
      },
      {
        mistake: 'Menutup tanpa sapaan sosial sehingga interaksi terasa kaku.',
        correction: 'Gunakan penutup ramah: "Nice to meet you."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - First Meeting Introduction',
        partnerRole: 'teman latihan',
        mission:
          'Partner menyapa di awal pertemuan. Perkenalkan diri secara singkat, sebut domisili, dan jelaskan aktivitas utama kamu.',
      },
      {
        title: 'Scenario B - Name Preference Follow-up',
        partnerRole: 'teman latihan',
        mission:
          'Setelah saling menyapa, tanyakan panggilan yang partner inginkan agar percakapan lanjut lebih natural.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Hi, welcome to the class.',
        "You: Hi, I'm Rina from Bandung.",
        'Partner: Great to meet you. Where do you live now?',
        'You: I live in Jakarta now.',
        'Partner: Nice. What do you do?',
        "You: I'm a university student.",
      ),
      dialog(
        'Partner: Hi, I am Alexander.',
        'You: Nice to meet you.',
        'Partner: You can call me Alex.',
        'You: What should I call you?',
        'Partner: Alex is fine.',
        'You: Nice to meet you, Alex.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Hai, selamat datang di kelas ini.',
        'Hai, saya Rina dari Bandung.',
        'Senang bertemu kamu. Sekarang kamu tinggal di mana?',
        'Saya tinggal di Jakarta sekarang.',
        'Bagus. Kamu beraktivitas apa?',
        'Saya mahasiswa.',
      ),
      dialog(
        'Hai, saya Alexander.',
        'Senang bertemu denganmu.',
        'Kamu bisa panggil saya Alex.',
        'Saya sebaiknya panggil kamu apa?',
        'Alex saja tidak apa-apa.',
        'Senang bertemu denganmu, Alex.',
      ),
    ],
  },
'cefr-a1-1-g06': {
    goalSnapshot:
      'Goal ini melatih kamu menanyakan nama dan asal lawan bicara secara sopan di awal percakapan. Fokusnya adalah membuat small talk dua arah yang jelas, bukan interogasi satu arah.',
    whyThisMatters:
      'Saat bertemu orang baru, pertanyaan dasar yang tepat membantu membangun koneksi cepat. Jika kamu bisa tanya nama, asal, dan mengecek pelafalan nama dengan sopan, percakapan jadi lebih natural dan nyaman.',
    situationBreakdown: [
      'Open: mulai dengan pertanyaan ramah "What\'s your name?"',
      'Clarify: lanjutkan dengan "Where are you from?" lalu cek ejaan bila perlu: "How do you spell your name?"',
      'Close: konfirmasi pelafalan dengan "Did I say your name correctly?" dan tutup dengan "Nice meeting you."',
    ],
    pronunciationNotes: [
      'Pada "What\'s your name?", gabungkan bunyi secara natural (what\'s-your) tanpa kehilangan kejelasan kata "name".',
      'Pada "Where are you from?", beri tekanan ringan di kata "from" agar pertanyaannya terdengar fokus.',
      'Saat mengeja nama, beri jeda antar huruf agar lawan bicara mudah memverifikasi ejaan.',
    ],
    commonMistakes: [
      {
        mistake: 'Menanyakan banyak hal pribadi sebelum perkenalan dasar selesai.',
        correction: 'Ikuti urutan dasar dulu: nama, asal, lalu konfirmasi nama.',
      },
      {
        mistake: 'Tidak mengecek ejaan saat nama terdengar baru atau asing.',
        correction: 'Gunakan kalimat spesifik: "How do you spell your name?"',
      },
      {
        mistake: 'Selesai bertanya tanpa penutupan sopan.',
        correction: 'Tutup dengan kalimat sosial sederhana: "Nice meeting you."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Name and Origin Small Talk',
        partnerRole: 'teman latihan',
        mission:
          'Partner baru kamu temui. Tanyakan nama dan asal secara sopan, lalu tutup dengan ucapan perkenalan yang natural.',
      },
      {
        title: 'Scenario B - Spelling and Name Check',
        partnerRole: 'teman latihan',
        mission:
          'Partner punya nama yang ejaannya perlu diklarifikasi. Minta spelling, cek apakah pelafalanmu sudah benar, lalu tutup percakapan dengan sopan.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Hi there.',
        "You: What's your name?",
        'Partner: My name is Arman.',
        'You: Where are you from?',
        "Partner: I'm from Surabaya.",
        'You: Nice meeting you.',
      ),
      dialog(
        "Partner: Hi, I'm Joaquin.",
        'You: How do you spell your name?',
        'Partner: J-O-A-Q-U-I-N.',
        'You: J-O-A-Q-U-I-N. Did I say your name correctly?',
        "Partner: Yes, that's right.",
        'You: Nice meeting you.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Hai.',
        'Siapa nama kamu?',
        'Nama saya Arman.',
        'Kamu dari mana?',
        'Saya dari Surabaya.',
        'Senang berkenalan denganmu.',
      ),
      dialog(
        'Hai, saya Joaquin.',
        'Nama kamu dieja bagaimana?',
        'J-O-A-Q-U-I-N.',
        'J-O-A-Q-U-I-N. Apakah saya menyebut nama kamu dengan benar?',
        'Ya, sudah benar.',
        'Senang berkenalan denganmu.',
      ),
    ],
  },
'cefr-a1-1-g07': {
    goalSnapshot:
      'Goal ini melatih kamu menyebut nomor telepon secara jelas dan memastikan lawan bicara menangkap semua digit dengan benar. Fokusnya adalah tempo pelafalan angka, read-back, dan verifikasi akhir.',
    whyThisMatters:
      'Dalam konteks layanan publik, salah satu digit bisa membuat follow-up gagal total. Pola sebut nomor -> minta ulang -> cek digit membuat informasi kontak lebih akurat dan aman.',
    situationBreakdown: [
      'Open: saat diminta kontak, mulai dengan "My phone number is zero eight one two." sebagai anchor digit awal.',
      'Clarify: kalau perlu, kontrol tempo dengan "I\'ll say it slowly." lalu minta read-back pakai "Please repeat it back to me."',
      'Close: validasi hasil dengan "Did you get all the digits?" lalu tutup "Great, that\'s correct."',
    ],
    pronunciationNotes: [
      'Pisahkan digit per kelompok kecil agar mudah ditangkap, misalnya "zero eight one two" lalu lanjut kelompok berikutnya.',
      'Pada angka "three" dan "five", jaga artikulasi konsonan akhir agar tidak tertukar saat lingkungan bising.',
      'Saat verifikasi, naikkan intonasi di pertanyaan "Did you get all the digits?" lalu turunkan di konfirmasi akhir.',
    ],
    commonMistakes: [
      {
        mistake: 'Menyebut semua digit terlalu cepat dalam satu napas.',
        correction: 'Gunakan kontrol tempo: "I\'ll say it slowly."',
      },
      {
        mistake: 'Tidak meminta lawan bicara mengulang nomor yang didengar.',
        correction: 'Pakai read-back check: "Please repeat it back to me."',
      },
      {
        mistake: 'Menutup tanpa memastikan semua digit sudah benar.',
        correction: 'Selalu cek akhir: "Did you get all the digits?" lalu "Great, that\'s correct."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Give Contact Number',
        partnerRole: 'teman latihan',
        mission:
          'Partner meminta nomor kontak untuk follow-up. Sebut digit awal, atur tempo bicara, lalu lanjutkan nomor dengan jelas.',
      },
      {
        title: 'Scenario B - Read-back Verification',
        partnerRole: 'teman latihan',
        mission:
          'Partner mengulang nomor yang dia dengar. Minta read-back, cek semua digit, lalu konfirmasi akhir.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Can I have your contact number?',
        'You: My phone number is zero eight one two.',
        'Partner: I only got the first part.',
        "You: I'll say it slowly.",
        'Partner: Okay, go ahead.',
        'You: Zero eight one two six one three five.',
      ),
      dialog(
        'Partner: I heard zero eight one two six one three five.',
        'You: Please repeat it back to me.',
        'Partner: Zero eight one two six one three five.',
        'You: Did you get all the digits?',
        'Partner: Yes, I got all the digits.',
        "You: Great, that's correct.",
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Boleh minta nomor kontak Anda?',
        'Nomor telepon saya nol delapan satu dua.',
        'Saya baru menangkap bagian awal.',
        'Saya akan ucapkan pelan-pelan.',
        'Oke, silakan lanjut.',
        'Nol delapan satu dua enam satu tiga lima.',
      ),
      dialog(
        'Saya dengar nol delapan satu dua enam satu tiga lima.',
        'Tolong ulangi kembali ke saya.',
        'Nol delapan satu dua enam satu tiga lima.',
        'Apakah semua angkanya sudah benar?',
        'Ya, semua angkanya benar.',
        'Bagus, itu benar.',
      ),
    ],
  },
'cefr-a1-1-g08': {
    goalSnapshot:
      'Goal ini melatih kamu mengonfirmasi waktu dan tanggal dengan tepat sebelum janji dikunci. Fokusnya adalah cek jam, cek hari, ulang detail, lalu minta validasi akhir.',
    whyThisMatters:
      'Dalam konteks janji atau meeting, salah satu detail waktu bisa menyebabkan keterlambatan atau no-show. Pola konfirmasi berlapis membuat kedua pihak punya pemahaman jadwal yang sama.',
    situationBreakdown: [
      'Open: cek jam dulu dengan pertanyaan langsung, misalnya "Is the meeting at nine o\'clock?"',
      'Clarify: lanjutkan cek hari dengan "Is it on Monday?" lalu ulang detail inti: "Let me repeat: Monday at nine."',
      'Close: kunci validasi dengan "Is that correct?" dan tutup sopan: "Great, see you then."',
    ],
    pronunciationNotes: [
      'Pada "nine o\'clock", bunyi /n/ di "nine" perlu jelas agar tidak terdengar seperti angka lain saat bicara cepat.',
      'Pada "Monday", tekan suku kata pertama (MON-day) supaya hari terdengar tegas.',
      'Di kalimat ulang "Let me repeat: Monday at nine.", beri jeda pendek setelah "repeat" agar detail jadwal lebih mudah diproses lawan bicara.',
    ],
    commonMistakes: [
      {
        mistake: 'Hanya menanyakan jam tanpa menanyakan hari.',
        correction: 'Tambahkan cek hari secara eksplisit: "Is it on Monday?"',
      },
      {
        mistake: 'Tidak mengulang detail jadwal setelah mendengar jawaban partner.',
        correction: 'Selalu lakukan read-back: "Let me repeat: Monday at nine."',
      },
      {
        mistake: 'Menutup percakapan tanpa validasi akhir.',
        correction: 'Pastikan dulu dengan "Is that correct?" sebelum menutup.',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Appointment Confirmation',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi jadwal meeting. Cek jam, cek hari, lalu tutup setelah detail terkonfirmasi.',
      },
      {
        title: 'Scenario B - Final Schedule Check',
        partnerRole: 'teman latihan',
        mission:
          'Partner menegaskan jadwal final. Ulang detail jadwal, minta konfirmasi akhir, lalu akhiri percakapan dengan sopan.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: The meeting is on Monday at nine.',
        "You: Is the meeting at nine o'clock?",
        'Partner: Yes, at nine.',
        'You: Is it on Monday?',
        'Partner: Yes, on Monday.',
        'You: Great, see you then.',
      ),
      dialog(
        'Partner: Your appointment is Monday at nine.',
        'You: Let me repeat: Monday at nine.',
        'Partner: Yes, that is right.',
        'You: Is that correct?',
        'Partner: Correct.',
        'You: Great, see you then.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Rapatnya hari Senin jam sembilan.',
        'Rapatnya jam sembilan?',
        'Ya, jam sembilan.',
        'Apakah hari Senin?',
        'Ya, hari Senin.',
        'Baik, sampai ketemu nanti.',
      ),
      dialog(
        'Janji Anda hari Senin jam sembilan.',
        'Biar saya ulang: Senin jam sembilan.',
        'Ya, itu benar.',
        'Apakah itu benar?',
        'Benar.',
        'Baik, sampai ketemu nanti.',
      ),
    ],
  },
'cefr-a1-1-g09': {
    goalSnapshot:
      'Goal ini melatih kamu meminta bantuan dasar saat mengerjakan tugas sederhana seperti mengisi formulir. Fokusnya adalah meminta bantuan dengan sopan, minta titik mulai yang jelas, lalu menutup dengan apresiasi.',
    whyThisMatters:
      'Di situasi layanan publik atau administrasi, diam saat bingung sering bikin proses makin lama. Dengan pola minta bantuan yang jelas, kamu bisa tetap mandiri sambil bergerak maju langkah demi langkah.',
    situationBreakdown: [
      'Open: mulai dengan meminta bantuan singkat: "Can you help me for a moment?"',
      'Clarify: jelaskan kebutuhanmu dengan "I need help with this form." lalu minta titik awal: "Could you show me where to start?"',
      'Close: kalau masih bingung, pakai repair "Sorry, I\'m still confused." lalu akhiri dengan "Thank you for helping me."',
    ],
    pronunciationNotes: [
      'Pada "help me", ucapkan konsonan /p/ di "help" dengan jelas agar tidak terdengar kabur.',
      'Pada "form", perpanjang vokal /or/ secukupnya agar kata kunci terdengar tegas.',
      'Pada "Sorry, I\'m still confused.", turunkan tempo sedikit untuk menandai kamu benar-benar butuh klarifikasi.',
    ],
    commonMistakes: [
      {
        mistake: 'Meminta bantuan tanpa menyebut tugas yang sedang dikerjakan.',
        correction: 'Setelah minta bantuan, langsung sebut konteks: "I need help with this form."',
      },
      {
        mistake: 'Hanya bilang "I don\'t understand" tanpa meminta titik awal.',
        correction: 'Minta langkah konkret: "Could you show me where to start?"',
      },
      {
        mistake: 'Tidak memberi penutupan sopan setelah dibantu.',
        correction: 'Tutup dengan apresiasi: "Thank you for helping me."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Ask for Basic Help',
        partnerRole: 'teman latihan',
        mission:
          'Partner melihat kamu kebingungan saat mengisi form. Minta bantuan dengan sopan, jelaskan kebutuhan, lalu tutup dengan terima kasih.',
      },
      {
        title: 'Scenario B - Clarify the Starting Point',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi instruksi awal, tetapi kamu masih bingung. Minta ditunjukkan titik mulai, gunakan repair phrase, lalu tutup dengan apresiasi.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: You look confused. Do you need help?',
        'You: Can you help me for a moment?',
        'Partner: Sure. What do you need?',
        'You: I need help with this form.',
        'Partner: Start with your full name on this line.',
        'You: Thank you for helping me.',
      ),
      dialog(
        'Partner: Please fill section B first.',
        'You: Could you show me where to start?',
        'Partner: Start from the first box in section B.',
        "You: Sorry, I'm still confused.",
        'Partner: No problem. I will show you one example first.',
        'You: Thank you for helping me.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Kamu terlihat bingung. Perlu bantuan?',
        'Bisa bantu saya sebentar?',
        'Tentu. Kamu butuh apa?',
        'Saya butuh bantuan untuk formulir ini.',
        'Mulai dari nama lengkap kamu di baris ini.',
        'Terima kasih sudah membantu saya.',
      ),
      dialog(
        'Tolong isi bagian B dulu.',
        'Bisa tunjukkan saya mulai dari mana?',
        'Mulai dari kotak pertama di bagian B.',
        'Maaf, saya masih bingung.',
        'Tidak masalah. Saya tunjukkan satu contoh dulu.',
        'Terima kasih sudah membantu saya.',
      ),
    ],
  },
'cefr-a1-1-g10': {
    goalSnapshot:
      'Goal ini melatih kamu meminta lawan bicara menunggu dengan sopan saat kamu perlu jeda singkat untuk mengecek informasi. Fokusnya adalah meminta waktu secara jelas, menjaga lawan bicara tetap nyaman, lalu kembali dengan penutupan sopan.',
    whyThisMatters:
      'Dalam interaksi layanan, kamu kadang butuh cek dokumen atau detail sebelum lanjut. Jika kamu bisa meminta jeda dengan bahasa yang tepat, alur percakapan tetap profesional dan tidak terasa menggantung.',
    situationBreakdown: [
      'Open: minta jeda dengan kalimat sederhana seperti "Please wait a moment."',
      'Clarify: sebut durasi atau alasan singkat, misalnya "Give me one minute, please." dan "Is it okay if I check first?"',
      'Close: setelah selesai cek, kembali dengan "I\'ll be back soon." lalu tutup dengan "Thanks for waiting."',
    ],
    pronunciationNotes: [
      'Pada "moment", pastikan suku kata pertama terdengar jelas supaya permintaan terdengar tegas tapi tetap sopan.',
      'Pada "minute", jaga bunyi /n/ di tengah kata agar tidak terdengar seperti kata lain saat bicara cepat.',
      'Pada "Thanks for waiting.", beri intonasi turun yang hangat untuk menandai penutupan yang ramah.',
    ],
    commonMistakes: [
      {
        mistake: 'Minta lawan bicara menunggu tanpa memberi estimasi waktu.',
        correction: 'Tambahkan durasi: "Give me one minute, please."',
      },
      {
        mistake: 'Pergi mengecek informasi tanpa izin atau konfirmasi.',
        correction: 'Gunakan konfirmasi sopan: "Is it okay if I check first?"',
      },
      {
        mistake: 'Kembali tanpa mengucapkan apresiasi kepada lawan bicara.',
        correction: 'Tutup dengan "Thanks for waiting."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Short Waiting Request',
        partnerRole: 'teman latihan',
        mission:
          'Partner meminta dokumen sekarang. Minta jeda singkat dengan sopan, beri estimasi waktu, lalu kembali dengan penutupan yang ramah.',
      },
      {
        title: 'Scenario B - Check Before Continuing',
        partnerRole: 'teman latihan',
        mission:
          'Partner ingin lanjut proses. Minta izin untuk cek info dulu, beri tahu kamu akan segera kembali, lalu tutup dengan terima kasih.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Do you have the document now?',
        'You: Please wait a moment.',
        'Partner: Sure.',
        'You: Give me one minute, please.',
        "Partner: Okay, I'll wait.",
        'You: Thanks for waiting.',
      ),
      dialog(
        'Partner: Can we continue now?',
        'You: Is it okay if I check first?',
        'Partner: Yes, go ahead.',
        "You: I'll be back soon.",
        'Partner: Sure, take your time.',
        'You: Thanks for waiting.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Apakah dokumennya sudah ada sekarang?',
        'Tolong tunggu sebentar.',
        'Tentu.',
        'Beri saya satu menit, ya.',
        'Oke, saya tunggu.',
        'Terima kasih sudah menunggu.',
      ),
      dialog(
        'Bisa kita lanjut sekarang?',
        'Boleh kalau saya cek dulu?',
        'Ya, silakan.',
        'Saya akan segera kembali.',
        'Tentu, tidak masalah.',
        'Terima kasih sudah menunggu.',
      ),
    ],
  },
'cefr-a1-1-g11': {
    goalSnapshot:
      'Goal ini melatih kamu menutup percakapan bantuan dengan ucapan terima kasih yang jelas dan natural. Fokusnya adalah memberi apresiasi, memastikan tidak ada langkah tersisa, lalu menutup interaksi secara sopan.',
    whyThisMatters:
      'Closing yang baik membuat percakapan terasa lengkap dan profesional. Dengan pola terima kasih + konfirmasi akhir, kamu mengurangi risiko ada tugas tertinggal setelah interaksi selesai.',
    situationBreakdown: [
      'Open: mulai penutupan dengan apresiasi langsung, misalnya "Thank you for your time."',
      'Clarify: cek apakah masih ada langkah lanjutan dengan "Is there anything else I should do?"',
      'Close: tutup hangat dengan kombinasi "I really appreciate your help.", "That helps me a lot.", dan "Okay, have a good day."',
    ],
    pronunciationNotes: [
      'Pada "appreciate", tekan suku kata kedua (ap-PRE-ciate) agar terdengar natural.',
      'Pada "anything else", ucapkan tautan antar kata dengan halus supaya tidak terdengar patah-patah.',
      'Pada kalimat penutup "Okay, have a good day.", gunakan intonasi turun yang ramah untuk menandai closing final.',
    ],
    commonMistakes: [
      {
        mistake: 'Menutup percakapan terlalu cepat tanpa ucapan apresiasi.',
        correction: 'Mulai closing dengan "Thank you for your time."',
      },
      {
        mistake: 'Tidak memastikan apakah ada langkah lanjutan.',
        correction: 'Tambahkan pertanyaan cek akhir: "Is there anything else I should do?"',
      },
      {
        mistake: 'Mengucapkan terima kasih sekali lalu langsung pergi, sehingga terasa kaku.',
        correction: 'Gunakan penutup lengkap: apresiasi + "Okay, have a good day."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Service Closing',
        partnerRole: 'teman latihan',
        mission:
          'Partner selesai membantu kamu. Beri ucapan terima kasih yang jelas, sampaikan apresiasi, lalu tutup percakapan dengan sopan.',
      },
      {
        title: 'Scenario B - Final Confirmation Before Closing',
        partnerRole: 'teman latihan',
        mission:
          'Partner menyatakan proses hampir selesai. Cek apakah masih ada hal yang perlu dilakukan, lalu tutup dengan apresiasi dan salam penutup.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: We are done with your request.',
        'You: Thank you for your time.',
        "Partner: You're welcome.",
        'You: I really appreciate your help.',
        'Partner: Happy to help.',
        'You: Okay, have a good day.',
      ),
      dialog(
        'Partner: We are almost done with your request.',
        'You: Is there anything else I should do?',
        "Partner: Please sign this line, and then you're done.",
        'You: That helps me a lot.',
        "Partner: Great, you're all set.",
        'You: Okay, have a good day.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Permintaan Anda sudah selesai.',
        'Terima kasih atas waktunya.',
        'Sama-sama.',
        'Saya sangat menghargai bantuan Anda.',
        'Senang bisa membantu.',
        'Oke, semoga harimu menyenangkan.',
      ),
      dialog(
        'Proses permintaan Anda hampir selesai.',
        'Apakah ada lagi yang perlu saya lakukan?',
        'Tolong tanda tangan di baris ini, lalu selesai.',
        'Itu sangat membantu saya.',
        'Bagus, semua sudah beres.',
        'Oke, semoga harimu menyenangkan.',
      ),
    ],
  },
'cefr-a1-1-g12': {
    goalSnapshot:
      'Goal ini melatih kamu meminta maaf atas kesalahan kecil lalu memperbaikinya langsung tanpa defensif. Fokusnya adalah mengakui error, menunjukkan aksi perbaikan, lalu menutup dengan apresiasi.',
    whyThisMatters:
      'Dalam percakapan kerja atau layanan, kesalahan kecil bisa terjadi kapan saja. Respons cepat dengan pola apology -> repair -> recheck menjaga kepercayaan lawan bicara dan mempercepat recovery.',
    situationBreakdown: [
      'Open: akui kesalahan secara langsung dengan "Sorry, I made a mistake."',
      'Clarify: ambil tindakan perbaikan segera lewat "Let me fix it now." atau "I\'ll do it again correctly."',
      'Close: minta validasi ulang memakai "Could you check it once more?" lalu tutup dengan "Thanks for your patience."',
    ],
    pronunciationNotes: [
      'Pada "mistake", tekan suku kata kedua (mis-TAKE) agar pengucapan terdengar natural.',
      'Pada "fix it", artikulasi /ks/ di akhir "fix" harus jelas supaya tidak terdengar seperti kata lain.',
      'Pada "patience", ucapkan dua suku kata utama (PA-tience) dengan tempo tenang untuk nuansa sopan.',
    ],
    commonMistakes: [
      {
        mistake: 'Langsung membela diri tanpa mengakui kesalahan.',
        correction: 'Mulai dari pengakuan yang jelas: "Sorry, I made a mistake."',
      },
      {
        mistake: 'Meminta maaf tetapi tidak menyatakan aksi perbaikan.',
        correction: 'Tambahkan kalimat tindakan: "Let me fix it now."',
      },
      {
        mistake: 'Setelah memperbaiki, tidak meminta pengecekan ulang.',
        correction: 'Gunakan "Could you check it once more?" sebelum menutup.',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Immediate Correction',
        partnerRole: 'teman latihan',
        mission:
          'Partner menunjukkan ada kesalahan pada hasil kamu. Minta maaf, perbaiki langsung, lalu minta partner cek ulang.',
      },
      {
        title: 'Scenario B - Rework and Recheck',
        partnerRole: 'teman latihan',
        mission:
          'Setelah perbaikan pertama masih salah, lakukan perbaikan kedua dengan tenang, minta recheck, lalu tutup dengan apresiasi.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: This line is wrong.',
        'You: Sorry, I made a mistake.',
        'Partner: Please correct it.',
        'You: Let me fix it now.',
        'Partner: Okay, show me after you revise it.',
        'You: Could you check it once more?',
      ),
      dialog(
        'Partner: It is still not correct.',
        "You: I'll do it again correctly.",
        'Partner: Sure, take your time.',
        'You: Could you check it once more?',
        'Partner: Yes, now it is correct.',
        'You: Thanks for your patience.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Baris ini salah.',
        'Maaf, saya membuat kesalahan.',
        'Tolong perbaiki.',
        'Biar saya perbaiki sekarang.',
        'Oke, tunjukkan setelah kamu revisi.',
        'Bisa cek sekali lagi?',
      ),
      dialog(
        'Ini masih belum benar.',
        'Saya akan kerjakan lagi dengan benar.',
        'Baik, silakan. Tidak usah terburu-buru.',
        'Bisa cek sekali lagi?',
        'Ya, sekarang sudah benar.',
        'Terima kasih atas kesabarannya.',
      ),
    ],
  }
};
