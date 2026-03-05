import type { CoherenceSectionOverride, ManualRoleplayPair } from './shared';

const dialog = (...lines: string[]) => lines.join('\n');

export const MANUAL_ROLEPLAY_DIALOGS_A1_3: Record<string, ManualRoleplayPair> = {
'cefr-a1-3-g01': [
    dialog(
      'Partner: Welcome. How can I help?',
      'You: Hello, I want to check in.',
      'Partner: May I see your ID card?',
      'You: Here is my ID card.',
      'Partner: Thank you. What is your booking name?',
      'You: My booking name is Rina Putri.',
      'Partner: Thank you. You are checked in.',
      'You: Thank you, what is the next step?',
    ),
    dialog(
      'Partner: I cannot find your booking yet.',
      'You: Could you check my reservation, please?',
      'Partner: Sure, what is your name?',
      'You: My booking name is Rina Putri.',
      'Partner: Found it now.',
      'You: Thank you, what is the next step?',
    ),
  ],
'cefr-a1-3-g02': [
    dialog(
      'Partner: How can I help today?',
      'You: I have a headache.',
      'Partner: Any other symptoms?',
      'You: My throat feels sore.',
      'Partner: Okay, I can suggest medicine.',
      'You: How often should I take it?',
      'Partner: Twice a day after meals.',
      'You: Thanks, I will follow that advice.',
    ),
    dialog(
      'Partner: What do you need?',
      'You: I need some basic medicine.',
      'Partner: For what problem?',
      'You: I have a headache.',
      'Partner: Take this after meals.',
      'You: Thanks, I will follow that advice.',
    ),
  ],
'cefr-a1-3-g03': [
    dialog(
      'Partner: What happened?',
      'You: This is an emergency.',
      'Partner: What do you need?',
      'You: Please call an ambulance.',
      'Partner: Where are you now?',
      'You: We are near the main gate.',
      'Partner: Ambulance is on the way.',
      'You: Thank you, please come quickly.',
    ),
    dialog(
      'Partner: Stay calm and speak slowly.',
      'You: Excuse me, I need help now.',
      'Partner: Tell me your location.',
      'You: We are near the main gate.',
      'Partner: Okay, help is coming.',
      'You: Thank you, please come quickly.',
    ),
  ],
'cefr-a1-3-g04': [
    dialog(
      'Partner: How can I help?',
      'You: I lost my wallet.',
      'Partner: Where did you last see it?',
      'You: I think I left it on the bus.',
      'Partner: Can you describe it?',
      'You: It is black and small.',
      'Partner: We will file a report now.',
      'You: Could you help me report it?',
    ),
    dialog(
      'Partner: What item is missing?',
      'You: I lost my wallet.',
      'Partner: If we find it, how can we contact you?',
      'You: Please call me if you find it.',
      'Partner: Sure, any description?',
      'You: It is black and small.',
    ),
  ],
'cefr-a1-3-g05': [
    dialog(
      'Partner: Where do you want to go?',
      'You: How do I get to the station?',
      'Partner: Go straight for two blocks.',
      'You: Should I go straight first?',
      'Partner: Yes, then turn right at the traffic light.',
      'You: Thanks, I will follow that route.',
    ),
    dialog(
      'Partner: It is about ten minutes away.',
      'You: Do I turn right at the traffic light?',
      'Partner: Yes.',
      'You: Is it far from here?',
      'Partner: Not far, around ten minutes.',
      'You: Thanks, I will follow that route.',
    ),
  ],
'cefr-a1-3-g06': [
    dialog(
      'Partner: First fill this form, then go to counter three.',
      'You: Sorry, can you give me the steps again?',
      'Partner: Sure. Fill this form first.',
      'You: Step one is fill this form, right?',
      'Partner: Correct.',
      'You: After that, I go to counter three?',
      'Partner: Yes.',
      'You: Great, now it is clear.',
    ),
    dialog(
      'Partner: Step one ID check, step two payment.',
      'You: Let me repeat to check.',
      'Partner: Go ahead.',
      'You: Step one is ID check, right?',
      'Partner: Yes.',
      'You: After that, I go to payment counter?',
      'Partner: Correct.',
      'You: Great, now it is clear.',
    ),
  ],
'cefr-a1-3-g07': [
    dialog(
      'Partner: Have you finished the form?',
      'You: I have finished this form.',
      'Partner: Let me check if it is complete.',
      'You: Please check if it is complete.',
      'Partner: It looks good.',
      'You: Do you need any other document?',
      'Partner: No.',
      'You: Thank you, I am ready for the next step.',
    ),
    dialog(
      'Partner: Please confirm your documents.',
      'You: Is everything correct now?',
      'Partner: Yes, everything is correct.',
      'You: Do you need any other document?',
      'Partner: No, that is all.',
      'You: Thank you, I am ready for the next step.',
    ),
  ],
'cefr-a1-3-g08': [
    dialog(
      'Partner: Your total is eighty thousand.',
      'You: Can I pay by card?',
      'Partner: Yes, you can.',
      'You: Is there any extra fee?',
      'Partner: No extra fee.',
      'You: Could I get the receipt, please?',
      'Partner: Sure.',
      'You: Thanks, payment is done.',
    ),
    dialog(
      'Partner: Cash or card?',
      'You: Do you accept cash?',
      'Partner: Yes.',
      'You: Could I get the receipt, please?',
      'Partner: Yes, here it is.',
      'You: Thanks, payment is done.',
    ),
  ],
'cefr-a1-3-g09': [
    dialog(
      'Partner: Here is your bill.',
      'You: Can we split the bill?',
      'Partner: Sure, three ways?',
      'You: I will pay my part.',
      'Partner: Your part is forty thousand.',
      'You: Thanks, that is fair.',
    ),
    dialog(
      'Partner: Total is one hundred twenty thousand.',
      'You: Let me check the total again.',
      'Partner: Yes, please.',
      'You: How much is my share?',
      'Partner: Forty thousand each.',
      'You: Thanks, that is fair.',
    ),
  ],
'cefr-a1-3-g10': [
    dialog(
      'Partner: Please submit your form this week.',
      'You: When is the deadline?',
      'Partner: Friday at 5 PM.',
      'You: Is Friday still okay?',
      'Partner: Yes.',
      'You: Thanks, I will submit on time.',
    ),
    dialog(
      'Partner: Please do not miss it.',
      'You: Could you remind me one day before?',
      'Partner: Sure, I will remind you on Thursday.',
      'You: Let me note the date now.',
      'Partner: Great.',
      'You: Thanks, I will submit on time.',
    ),
  ],
'cefr-a1-3-g11': [
    dialog(
      'Partner: Can you finish this now?',
      'You: Sorry, I cannot do that now.',
      'Partner: When can you do it?',
      'You: I can do it this afternoon.',
      'Partner: That works for me.',
      'You: Thanks for understanding.',
    ),
    dialog(
      'Partner: We need it urgently.',
      'You: If urgent, I can ask my friend.',
      'Partner: That can help.',
      'You: Is that okay with you?',
      'Partner: Yes, please do that.',
      'You: Thanks for understanding.',
    ),
  ],
'cefr-a1-3-g12': [
    dialog(
      'Partner: We are done for today.',
      'You: Thank you for your help today.',
      'Partner: You are welcome.',
      'You: I understand the next step.',
      'Partner: Great.',
      'You: I will come back tomorrow morning.',
      'Partner: Perfect.',
      'You: Have a good day.',
    ),
    dialog(
      'Partner: If anything changes, please tell us.',
      'You: If anything changes, I will call you.',
      'Partner: Thank you.',
      'You: I understand the next step.',
      'Partner: See you tomorrow.',
      'You: Have a good day.',
    ),
  ]
};

export const MANUAL_ROLEPLAY_DIALOGS_ID_A1_3: Record<string, ManualRoleplayPair> = {};

export const SCENARIO_B_MISSION_OVERRIDES_A1_3: Record<string, string> = {};

export const COHERENCE_SECTION_OVERRIDES_A1_3: Record<string, CoherenceSectionOverride> = {
'cefr-a1-3-g01': {
    goalSnapshot:
      'Goal ini melatih kamu melakukan check-in dasar di counter layanan dengan urutan informasi yang jelas. Fokusnya adalah menyampaikan tujuan check-in, menyerahkan data identitas, lalu memastikan langkah berikutnya.',
    whyThisMatters:
      'Di counter layanan, alur yang jelas mempercepat proses dan mengurangi risiko data salah. Dengan kalimat check-in yang tepat, kamu bisa menangani verifikasi awal dengan percaya diri.',
    situationBreakdown: [
      'Open: sampaikan tujuan kedatangan terlebih dulu: "Hello, I want to check in."',
      'Clarify: berikan data inti secara berurutan dengan "Here is my ID card.", "My booking name is Rina Putri.", dan jika perlu "Could you check my reservation, please?"',
      'Close: setelah data valid, tutup dengan pertanyaan lanjutan: "Thank you, what is the next step?"',
    ],
    pronunciationNotes: [
      'Pada frasa "check in", ucapkan jelas dua kata terpisah agar maksud layanan langsung tertangkap.',
      'Pada "ID card", beri jeda ringan antara "ID" dan "card" supaya identitas terdengar rapi.',
      'Pada "reservation", tekan suku kata utama (re-ser-VA-tion) agar kata kunci verifikasi terdengar natural.',
    ],
    commonMistakes: [
      {
        mistake: 'Datang ke counter tanpa menyebut tujuan check-in secara langsung.',
        correction: 'Mulai dengan kalimat inti: "Hello, I want to check in."',
      },
      {
        mistake: 'Memberi nama booking tetapi lupa menunjukkan identitas.',
        correction: 'Sertakan bukti data: "Here is my ID card."',
      },
      {
        mistake: 'Setelah check-in berhasil, tidak menanyakan langkah berikutnya.',
        correction: 'Tutup dengan "Thank you, what is the next step?"',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Standard Counter Check-in',
        partnerRole: 'teman latihan',
        mission:
          'Partner bertugas di counter check-in. Sampaikan tujuan, berikan ID dan nama booking, lalu tutup dengan pertanyaan next step.',
      },
      {
        title: 'Scenario B - Reservation Recheck',
        partnerRole: 'teman latihan',
        mission:
          'Partner belum menemukan data booking pada percobaan pertama. Minta partner cek reservasi ulang, berikan data pendukung, lalu tutup dengan pertanyaan langkah berikutnya.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Welcome. How can I help?',
        'You: Hello, I want to check in.',
        'Partner: Sure. May I see your ID card?',
        'You: Here is my ID card.',
        'Partner: Thank you. What is your booking name?',
        'You: My booking name is Rina Putri.',
        'Partner: Great, your check-in is complete.',
        'You: Thank you, what is the next step?',
      ),
      dialog(
        'Partner: I cannot find your booking yet.',
        'You: Could you check my reservation, please?',
        'Partner: Sure. May I see your ID card first?',
        'You: Here is my ID card. My booking name is Rina Putri.',
        'Partner: Thank you. I found your reservation now.',
        'You: Thank you, what is the next step?',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Selamat datang. Ada yang bisa saya bantu?',
        'Halo, saya ingin check-in.',
        'Baik. Boleh saya lihat kartu identitas Anda?',
        'Ini kartu identitas saya.',
        'Terima kasih. Nama booking Anda siapa?',
        'Nama booking saya Rina Putri.',
        'Bagus, check-in Anda sudah selesai.',
        'Terima kasih, langkah selanjutnya apa?',
      ),
      dialog(
        'Saya belum menemukan data booking Anda.',
        'Bisa cek reservasi saya sekali lagi, tolong?',
        'Tentu. Boleh saya lihat kartu identitas dulu?',
        'Ini kartu identitas saya. Nama booking saya Rina Putri.',
        'Terima kasih. Reservasinya sudah saya temukan.',
        'Terima kasih, langkah selanjutnya apa?',
      ),
    ],
  },
'cefr-a1-3-g02': {
    goalSnapshot:
      'Goal ini melatih kamu menjelaskan keluhan kesehatan ringan dan meminta obat dasar di apotek atau klinik. Fokusnya adalah menyebut gejala utama, meminta obat sederhana, lalu memastikan aturan minum obat.',
    whyThisMatters:
      'Saat tidak enak badan, kamu perlu bicara singkat dan jelas agar petugas memberi bantuan yang tepat. Dengan pola gejala -> kebutuhan obat -> pertanyaan dosis, risiko salah konsumsi obat bisa berkurang.',
    situationBreakdown: [
      'Open: sebut gejala utama dulu, misalnya "I have a headache." atau "My throat feels sore."',
      'Clarify: sampaikan kebutuhan dengan "I need some basic medicine." dan cek aturan pakai: "How often should I take it?"',
      'Close: tutup dengan konfirmasi komitmen mengikuti arahan: "Thanks, I will follow that advice."',
    ],
    pronunciationNotes: [
      'Pada "headache", tekankan suku kata pertama agar gejala terdengar jelas.',
      'Pada "throat", ucapkan bunyi awal /th/ dengan perlahan agar kata tidak terdengar seperti "troat".',
      'Pada kalimat dosis "How often should I take it?", naikkan intonasi di akhir untuk menandai pertanyaan medis.',
    ],
    commonMistakes: [
      {
        mistake: 'Hanya bilang "I am sick" tanpa menyebut gejala spesifik.',
        correction: 'Sebutkan gejala konkret: "I have a headache." atau "My throat feels sore."',
      },
      {
        mistake: 'Meminta obat tanpa menanyakan aturan minum.',
        correction: 'Selalu tanya frekuensi: "How often should I take it?"',
      },
      {
        mistake: 'Tidak menutup dengan konfirmasi bahwa arahan sudah dipahami.',
        correction: 'Gunakan "Thanks, I will follow that advice."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Pharmacy Symptom Explanation',
        partnerRole: 'teman latihan',
        mission:
          'Partner bertugas di apotek. Jelaskan gejala utama, tanyakan frekuensi minum obat, lalu tutup dengan konfirmasi.',
      },
      {
        title: 'Scenario B - Simple Medicine Request',
        partnerRole: 'teman latihan',
        mission:
          'Partner menanyakan kebutuhan obat. Sampaikan kebutuhan obat sederhana, jelaskan gejala, lalu konfirmasi kamu akan mengikuti anjuran.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: How can I help today?',
        'You: I have a headache.',
        'Partner: Any other symptoms?',
        'You: My throat feels sore.',
        'Partner: Okay, I can suggest medicine.',
        'You: How often should I take it?',
        'Partner: Twice a day after meals.',
        'You: Thanks, I will follow that advice.',
      ),
      dialog(
        'Partner: What do you need today?',
        'You: I need some basic medicine.',
        'Partner: What symptoms do you have?',
        'You: I have a headache and my throat feels sore.',
        'Partner: Take one tablet twice a day after meals.',
        'You: Thanks, I will follow that advice.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Ada yang bisa saya bantu hari ini?',
        'Saya sakit kepala.',
        'Ada gejala lain?',
        'Tenggorokan saya terasa sakit.',
        'Baik, saya bisa sarankan obat.',
        'Seberapa sering saya harus minum obat ini?',
        'Dua kali sehari setelah makan.',
        'Terima kasih, saya akan mengikuti anjuran itu.',
      ),
      dialog(
        'Apa yang Anda butuhkan hari ini?',
        'Saya butuh obat sederhana.',
        'Gejalanya apa?',
        'Saya sakit kepala dan tenggorokan saya terasa sakit.',
        'Minum satu tablet dua kali sehari setelah makan.',
        'Terima kasih, saya akan mengikuti anjuran itu.',
      ),
    ],
  },
'cefr-a1-3-g03': {
    goalSnapshot:
      'Goal ini melatih kamu meminta bantuan darurat dengan kalimat singkat, jelas, dan tegas. Fokusnya adalah menyatakan kondisi darurat, meminta tindakan segera, menyebut lokasi, lalu menutup dengan permintaan percepatan.',
    whyThisMatters:
      'Di situasi darurat, kecepatan dan kejelasan bahasa sangat penting. Dengan pesan inti yang pendek dan terstruktur, lawan bicara bisa langsung bertindak tanpa kehilangan waktu.',
    situationBreakdown: [
      'Open: tarik perhatian dengan cepat: "Excuse me, I need help now." atau "This is an emergency."',
      'Clarify: sebut tindakan yang dibutuhkan dan lokasi: "Please call an ambulance." + "We are near the main gate."',
      'Close: tegaskan urgensi dengan penutup: "Thank you, please come quickly."',
    ],
    pronunciationNotes: [
      'Pada kata "emergency", tekan suku kata kedua agar pesan darurat terdengar tegas.',
      'Pada frasa lokasi "main gate", artikulasikan jelas supaya petugas tidak salah titik.',
      'Pada "please come quickly", gunakan tempo tegas namun tetap jelas agar tidak terdengar panik berlebihan.',
    ],
    commonMistakes: [
      {
        mistake: 'Menyebut kondisi darurat tetapi tidak memberi instruksi tindakan.',
        correction: 'Tambahkan aksi langsung: "Please call an ambulance."',
      },
      {
        mistake: 'Meminta bantuan tanpa menyebut lokasi.',
        correction: 'Sebutkan lokasi spesifik: "We are near the main gate."',
      },
      {
        mistake: 'Kalimat terlalu panjang saat panik sehingga pesan inti tidak jelas.',
        correction: 'Gunakan kalimat pendek berurutan sesuai pola emergency.',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Immediate Emergency Call',
        partnerRole: 'teman latihan',
        mission:
          'Partner merespons panggilan bantuan. Nyatakan keadaan darurat, minta panggil ambulans, beri lokasi, lalu tutup dengan permintaan cepat.',
      },
      {
        title: 'Scenario B - Location Clarification Under Pressure',
        partnerRole: 'teman latihan',
        mission:
          'Partner meminta detail saat situasi tegang. Buka dengan minta bantuan segera, tegaskan emergency, sebut lokasi, lalu ulang urgensi bantuan cepat.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: What happened?',
        'You: This is an emergency.',
        'Partner: What do you need right now?',
        'You: Please call an ambulance.',
        'Partner: Where are you now?',
        'You: We are near the main gate.',
        'Partner: Okay, ambulance is on the way.',
        'You: Thank you, please come quickly.',
      ),
      dialog(
        'Partner: Stay calm and tell me what is happening.',
        'You: Excuse me, I need help now.',
        'Partner: Is this an emergency?',
        'You: This is an emergency.',
        'Partner: Please tell me your location.',
        'You: We are near the main gate.',
        'Partner: Help is coming now.',
        'You: Thank you, please come quickly.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Apa yang terjadi?',
        'Ini keadaan darurat.',
        'Apa yang kamu butuhkan sekarang?',
        'Tolong panggil ambulans.',
        'Kamu sekarang di mana?',
        'Kami di dekat gerbang utama.',
        'Baik, ambulans sedang menuju ke sana.',
        'Terima kasih, tolong cepat datang.',
      ),
      dialog(
        'Tetap tenang dan beri tahu saya apa yang terjadi.',
        'Permisi, saya butuh bantuan sekarang.',
        'Apakah ini keadaan darurat?',
        'Ini keadaan darurat.',
        'Tolong sebutkan lokasi kamu.',
        'Kami di dekat gerbang utama.',
        'Bantuan sedang datang sekarang.',
        'Terima kasih, tolong cepat datang.',
      ),
    ],
  },
'cefr-a1-3-g04': {
    goalSnapshot:
      'Goal ini melatih kamu melaporkan barang hilang dengan deskripsi sederhana di tempat umum. Fokusnya adalah menyebut barang hilang, lokasi terakhir, ciri barang, lalu meminta bantuan pelaporan atau kontak balik.',
    whyThisMatters:
      'Saat barang hilang, informasi yang jelas membantu petugas bergerak cepat. Dengan urutan laporan yang rapi, peluang barang ditemukan dan dikembalikan jadi lebih besar.',
    situationBreakdown: [
      'Open: sebutkan barang yang hilang langsung: "I lost my wallet."',
      'Clarify: jelaskan lokasi terakhir dan ciri barang: "I think I left it on the bus." + "It is black and small."',
      'Close: minta bantuan proses lanjut: "Could you help me report it?" dan "Please call me if you find it."',
    ],
    pronunciationNotes: [
      'Pada "wallet", pastikan bunyi akhir /t/ tetap terdengar agar kata tidak kabur.',
      'Pada frasa "left it", ucapkan sambungan dengan jelas supaya lokasi terakhir tidak salah tangkap.',
      'Pada "black and small", beri jeda ringan antara dua ciri agar deskripsi lebih jelas.',
    ],
    commonMistakes: [
      {
        mistake: 'Hanya bilang barang hilang tanpa menyebut lokasi terakhir.',
        correction: 'Tambahkan lokasi: "I think I left it on the bus."',
      },
      {
        mistake: 'Deskripsi barang terlalu umum atau tidak ada ciri fisik.',
        correction: 'Sebutkan minimal dua ciri: "It is black and small."',
      },
      {
        mistake: 'Tidak meminta langkah tindak lanjut setelah melapor.',
        correction: 'Gunakan "Could you help me report it?" dan minta kontak balik jika ditemukan.',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Report Lost Wallet',
        partnerRole: 'teman latihan',
        mission:
          'Partner bertugas di pos layanan. Laporkan dompet hilang, sebut lokasi terakhir dan ciri, lalu minta bantuan pelaporan resmi.',
      },
      {
        title: 'Scenario B - Contact-back Request',
        partnerRole: 'teman latihan',
        mission:
          'Partner menanyakan detail tambahan barang hilang. Ulang informasi inti lalu minta dihubungi jika barang ditemukan.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: How can I help?',
        'You: I lost my wallet.',
        'Partner: Where did you last see it?',
        'You: I think I left it on the bus.',
        'Partner: Can you describe it?',
        'You: It is black and small.',
        'Partner: We can file a report now.',
        'You: Could you help me report it?',
      ),
      dialog(
        'Partner: What item is missing?',
        'You: I lost my wallet.',
        'Partner: Any details?',
        'You: It is black and small.',
        'Partner: Where did you last see it?',
        'You: I think I left it on the bus.',
        'Partner: If we find it, what should we do?',
        'You: Please call me if you find it.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Ada yang bisa saya bantu?',
        'Saya kehilangan dompet saya.',
        'Terakhir kali Anda lihat di mana?',
        'Sepertinya saya meninggalkannya di bus.',
        'Bisa dijelaskan cirinya?',
        'Warnanya hitam dan kecil.',
        'Kami bisa buat laporan sekarang.',
        'Bisa bantu saya melaporkannya?',
      ),
      dialog(
        'Barang apa yang hilang?',
        'Saya kehilangan dompet saya.',
        'Ada detail cirinya?',
        'Warnanya hitam dan kecil.',
        'Terakhir kali Anda lihat di mana?',
        'Sepertinya saya meninggalkannya di bus.',
        'Kalau kami temukan, apa yang harus kami lakukan?',
        'Tolong hubungi saya jika Anda menemukannya.',
      ),
    ],
  },
'cefr-a1-3-g05': {
    goalSnapshot:
      'Goal ini melatih kamu menanyakan arah dengan landmark sederhana saat berada di tempat baru. Fokusnya adalah meminta rute awal, mengonfirmasi titik belok penting, lalu menutup dengan konfirmasi rute.',
    whyThisMatters:
      'Saat tanpa peta digital, pertanyaan arah yang tepat bisa mencegah salah jalan dan menghemat waktu. Dengan pola tanya rute -> cek belokan -> cek jarak, kamu bisa bergerak dengan lebih yakin.',
    situationBreakdown: [
      'Open: mulai dengan pertanyaan tujuan: "How do I get to the station?"',
      'Clarify: cek langkah awal dan titik belok landmark: "Should I go straight first?" dan "Do I turn right at the traffic light?"',
      'Close: pastikan jarak dengan "Is it far from here?" lalu tutup "Thanks, I will follow that route."',
    ],
    pronunciationNotes: [
      'Pada "station", tekan suku kata pertama agar tujuan terdengar jelas.',
      'Pada frasa "turn right", artikulasi /t/ dan /r/ perlu jelas supaya arah tidak tertukar.',
      'Pada "traffic light", ucapkan dua kata terpisah dengan ritme stabil untuk menekankan landmark.',
    ],
    commonMistakes: [
      {
        mistake: 'Menerima instruksi sekali dengar tanpa mengonfirmasi belokan penting.',
        correction: 'Ulang titik kritis dengan pertanyaan: "Do I turn right at the traffic light?"',
      },
      {
        mistake: 'Tidak menanyakan jarak sehingga salah estimasi waktu.',
        correction: 'Tambahkan "Is it far from here?" sebelum berangkat.',
      },
      {
        mistake: 'Menutup percakapan tanpa memastikan kamu paham rute.',
        correction: 'Gunakan penutup konfirmatif: "Thanks, I will follow that route."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Route Start Confirmation',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi rute ke stasiun. Tanyakan cara menuju tujuan, konfirmasi langkah awal, lalu tutup dengan konfirmasi rute.',
      },
      {
        title: 'Scenario B - Landmark and Distance Check',
        partnerRole: 'teman latihan',
        mission:
          'Partner menjelaskan landmark belokan. Konfirmasi belokan di lampu lalu lintas dan cek jarak, lalu tutup dengan keputusan mengikuti rute.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Where do you want to go?',
        'You: How do I get to the station?',
        'Partner: Go straight for two blocks.',
        'You: Should I go straight first?',
        'Partner: Yes, then turn right at the traffic light.',
        'You: Thanks, I will follow that route.',
      ),
      dialog(
        'Partner: It is about ten minutes away.',
        'You: Do I turn right at the traffic light?',
        'Partner: Yes, that is correct.',
        'You: Is it far from here?',
        'Partner: Not far, around ten minutes.',
        'You: Thanks, I will follow that route.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Kamu mau ke mana?',
        'Bagaimana cara saya ke stasiun?',
        'Jalan lurus dua blok.',
        'Jadi saya jalan lurus dulu?',
        'Ya, lalu belok kanan di lampu lalu lintas.',
        'Terima kasih, saya akan ikuti rute itu.',
      ),
      dialog(
        'Jaraknya sekitar sepuluh menit.',
        'Apakah saya belok kanan di lampu lalu lintas?',
        'Ya, itu benar.',
        'Apakah jauh dari sini?',
        'Tidak jauh, sekitar sepuluh menit.',
        'Terima kasih, saya akan ikuti rute itu.',
      ),
    ],
  },
'cefr-a1-3-g06': {
    goalSnapshot:
      'Goal ini melatih kamu mengklarifikasi instruksi berurutan dari petugas agar tidak salah langkah. Fokusnya adalah minta ulang langkah, cek urutan satu per satu, lalu tutup dengan konfirmasi paham.',
    whyThisMatters:
      'Dalam proses layanan, salah satu langkah yang terlewat bisa membuat kamu harus mengulang dari awal. Dengan pola tanya ulang -> cek urutan -> ulang balik, kamu bisa mengeksekusi instruksi dengan lebih akurat.',
    situationBreakdown: [
      'Open: saat instruksi terasa cepat, buka dengan repair phrase: "Sorry, can you give me the steps again?"',
      'Clarify: cek urutan langkah secara spesifik: "Step one is to fill this form, right?" lalu "After that, do I go to counter three?"',
      'Close: ulang balik untuk cek final dengan "Let me repeat to check.", lalu tutup "Great, now it\'s clear."',
    ],
    pronunciationNotes: [
      'Pada frasa "steps again", jaga bunyi akhir /s/ di "steps" tetap terdengar agar bentuk jamaknya jelas.',
      'Pada "counter three", ucapkan /th/ di "three" dengan ujung lidah ringan di antara gigi supaya tidak berubah jadi /t/.',
      'Gunakan intonasi naik pada pertanyaan konfirmasi seperti "right?" dan "counter three?" agar fungsi cek langkah terdengar jelas.',
    ],
    commonMistakes: [
      {
        mistake: 'Menerima instruksi cepat tanpa meminta pengulangan saat belum paham.',
        correction: 'Langsung pakai repair phrase: "Sorry, can you give me the steps again?"',
      },
      {
        mistake: 'Menebak urutan langkah tanpa konfirmasi per langkah.',
        correction:
          'Cek detail langkah dengan pertanyaan spesifik: "Step one is to fill this form, right?" dan "After that, do I go to counter three?"',
      },
      {
        mistake: 'Menutup percakapan tanpa rekap akhir sehingga rawan salah eksekusi.',
        correction: 'Gunakan "Let me repeat to check." sebelum menutup dengan "Great, now it\'s clear."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Form and Counter Flow',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi dua langkah proses layanan. Minta ulang instruksi, konfirmasi step satu, cek step berikutnya, lalu tutup dengan konfirmasi paham.',
      },
      {
        title: 'Scenario B - Multi-step Verification',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi instruksi tiga langkah dengan tempo cepat. Ulang urutan langkah secara terstruktur, klarifikasi step kedua, lalu tutup setelah alur benar-benar jelas.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: First, fill out this form. Then go to counter three.',
        'You: Sorry, can you give me the steps again?',
        'Partner: Sure. Step one is to fill out the form. Step two is to go to counter three.',
        'You: Step one is to fill this form, right?',
        "Partner: Yes, that's right.",
        'You: After that, do I go to counter three?',
        'Partner: Exactly.',
        "You: Great, now it's clear.",
      ),
      dialog(
        'Partner: First fill the form, then go to counter three, and submit the receipt at desk B.',
        'You: Let me repeat to check.',
        'Partner: Sure, go ahead.',
        'You: Step one is to fill this form, right?',
        'Partner: Yes, correct.',
        'You: After that, do I go to counter three?',
        'Partner: Yes. After counter three, submit the receipt at desk B.',
        "You: Great, now it's clear.",
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Pertama, isi formulir ini. Lalu pergi ke loket tiga.',
        'Maaf, bisa ulang langkah-langkahnya?',
        'Tentu. Langkah pertama isi formulir. Langkah kedua ke loket tiga.',
        'Langkah pertama isi formulir ini, benar?',
        'Ya, benar.',
        'Setelah itu, saya ke loket tiga?',
        'Tepat.',
        'Bagus, sekarang jelas.',
      ),
      dialog(
        'Pertama isi formulir, lalu ke loket tiga, lalu serahkan struk di meja B.',
        'Biar saya ulang untuk cek.',
        'Silakan.',
        'Langkah pertama isi formulir ini, benar?',
        'Ya, benar.',
        'Setelah itu, saya ke loket tiga?',
        'Ya. Setelah loket tiga, serahkan struk di meja B.',
        'Bagus, sekarang jelas.',
      ),
    ],
  },
'cefr-a1-3-g07': {
    goalSnapshot:
      'Goal ini melatih kamu mengonfirmasi bahwa tugas administrasi sudah selesai sebelum lanjut ke tahap berikutnya. Fokusnya adalah menyatakan status selesai, minta pengecekan final, lalu pastikan tidak ada dokumen tambahan.',
    whyThisMatters:
      'Di proses layanan, banyak learner berhenti setelah menyerahkan form tanpa validasi akhir. Dengan pola selesai -> cek lengkap -> tanya dokumen tambahan, kamu mengurangi risiko bolak-balik karena berkas kurang.',
    situationBreakdown: [
      'Open: mulai dengan status kerja kamu: "I have finished this form."',
      'Clarify: minta verifikasi langsung dengan "Please check if it is complete." lalu cek status akhir: "Is everything correct now?"',
      'Close: pastikan tidak ada syarat tambahan lewat "Do you need any other document?" lalu tutup "Thank you, I am ready for the next step."',
    ],
    pronunciationNotes: [
      'Pada "finished this form", pastikan bunyi akhir /t/ di "finished" tetap terdengar supaya status selesai jelas.',
      'Pada "complete", tekan suku kata kedua (com-PLETE) agar terdengar natural saat meminta pengecekan.',
      'Pada "the next step", beri tekanan ringan di kata "next" untuk menandai transisi ke tahap lanjutan.',
    ],
    commonMistakes: [
      {
        mistake: 'Langsung menunggu tanpa menyatakan bahwa form sudah selesai.',
        correction: 'Mulai dengan status yang jelas: "I have finished this form."',
      },
      {
        mistake: 'Tidak meminta verifikasi akhir, jadi asumsi sendiri bahwa berkas sudah benar.',
        correction: 'Selalu minta cek: "Please check if it is complete." dan "Is everything correct now?"',
      },
      {
        mistake: 'Lupa menanyakan dokumen tambahan sebelum pindah proses.',
        correction: 'Tanyakan: "Do you need any other document?" lalu tutup dengan kesiapan next step.',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Final Form Check',
        partnerRole: 'teman latihan',
        mission:
          'Partner memeriksa formulir administrasi kamu. Sampaikan form sudah selesai, minta dicek, tanyakan dokumen tambahan, lalu tutup dengan kesiapan lanjut.',
      },
      {
        title: 'Scenario B - Last Validation Before Next Counter',
        partnerRole: 'teman latihan',
        mission:
          'Partner melakukan validasi akhir sebelum kamu pindah loket. Konfirmasi apakah semua sudah benar, cek dokumen tambahan, lalu akhiri dengan kesiapan ke langkah berikutnya.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Can I see your form now?',
        'You: I have finished this form.',
        'Partner: Okay, I will review it now.',
        'You: Please check if it is complete.',
        'Partner: The form is complete. Do you have your ID copy?',
        'You: Do you need any other document?',
        'Partner: No, this is enough.',
        'You: Thank you, I am ready for the next step.',
      ),
      dialog(
        'Partner: I have your form and ID card.',
        'You: Is everything correct now?',
        'Partner: Let me check one more detail.',
        'You: Please check if it is complete.',
        'Partner: Yes, all sections are correct.',
        'You: Do you need any other document?',
        'Partner: No, you can go to the next counter.',
        'You: Thank you, I am ready for the next step.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Boleh saya lihat formulir Anda sekarang?',
        'Saya sudah menyelesaikan formulir ini.',
        'Oke, saya cek dulu sekarang.',
        'Tolong cek apakah ini sudah lengkap.',
        'Formulirnya sudah lengkap. Anda bawa salinan identitas?',
        'Apakah Anda butuh dokumen lain?',
        'Tidak, ini sudah cukup.',
        'Terima kasih, saya siap untuk langkah berikutnya.',
      ),
      dialog(
        'Saya sudah pegang formulir dan kartu identitas Anda.',
        'Apakah semuanya sudah benar sekarang?',
        'Biar saya cek satu detail lagi.',
        'Tolong cek apakah ini sudah lengkap.',
        'Ya, semua bagian sudah benar.',
        'Apakah Anda butuh dokumen lain?',
        'Tidak, Anda bisa ke loket berikutnya.',
        'Terima kasih, saya siap untuk langkah berikutnya.',
      ),
    ],
  },
'cefr-a1-3-g08': {
    goalSnapshot:
      'Goal ini melatih kamu menutup transaksi pembayaran dengan urutan yang jelas. Fokusnya adalah memilih metode bayar, mengecek biaya tambahan, meminta struk, lalu menutup dengan konfirmasi pembayaran selesai.',
    whyThisMatters:
      'Di situasi pembayaran nyata, kamu perlu jelas soal metode bayar dan bukti transaksi. Dengan pola metode -> biaya tambahan -> struk -> penutupan, kamu mengurangi risiko salah bayar atau tidak punya bukti pembayaran.',
    situationBreakdown: [
      'Open: mulai dengan pertanyaan metode pembayaran, misalnya "Can I pay by card?" atau "Do you accept cash?"',
      'Clarify: setelah metode dipilih, cek biaya tambahan dan minta bukti transaksi: "Is there any extra fee?" dan "Could I get the receipt, please?"',
      'Close: tutup transaksi dengan konfirmasi akhir: "Thanks, payment is complete."',
    ],
    pronunciationNotes: [
      'Pada kata "card", bunyi akhir /d/ perlu terdengar supaya kata tidak terdengar seperti "car".',
      'Pada frasa "extra fee", ucapkan jelas dua kata terpisah agar lawan bicara menangkap bahwa kamu menanyakan biaya tambahan.',
      'Pada kata "receipt" (/rɪˈsiːt/), tekan suku kata kedua agar pengucapan lebih natural.',
    ],
    commonMistakes: [
      {
        mistake: 'Membayar tanpa menanyakan metode yang tersedia.',
        correction: 'Mulai dengan pertanyaan langsung: "Can I pay by card?" atau "Do you accept cash?"',
      },
      {
        mistake: 'Tidak mengecek biaya tambahan sebelum membayar.',
        correction: 'Tanyakan lebih dulu: "Is there any extra fee?"',
      },
      {
        mistake: 'Lupa meminta struk sebagai bukti pembayaran.',
        correction: 'Gunakan kalimat tetap: "Could I get the receipt, please?" lalu tutup dengan konfirmasi pembayaran selesai.',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Card Payment at Counter',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi total pembayaran. Tanyakan apakah bisa bayar pakai kartu, cek biaya tambahan, minta struk, lalu tutup dengan konfirmasi selesai.',
      },
      {
        title: 'Scenario B - Cash Payment Confirmation',
        partnerRole: 'teman latihan',
        mission:
          'Partner menawarkan pilihan metode bayar. Konfirmasi penerimaan cash, minta struk, lalu akhiri transaksi dengan penutupan yang jelas.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Your total is eighty thousand rupiah.',
        'You: Can I pay by card?',
        'Partner: Yes, card is okay.',
        'You: Is there any extra fee?',
        'Partner: No, there is no extra fee.',
        'You: Could I get the receipt, please?',
        'Partner: Sure. Here is your receipt.',
        'You: Thanks, payment is complete.',
      ),
      dialog(
        'Partner: Cash or card?',
        'You: Do you accept cash?',
        'Partner: Yes, we do.',
        'You: Could I get the receipt, please?',
        'Partner: Of course. Do you need anything else?',
        'You: No, that is all.',
        'Partner: Your payment is successful.',
        'You: Thanks, payment is complete.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Total Anda delapan puluh ribu rupiah.',
        'Saya bisa bayar pakai kartu?',
        'Ya, bisa pakai kartu.',
        'Ada biaya tambahan?',
        'Tidak, tidak ada biaya tambahan.',
        'Boleh saya minta struknya?',
        'Tentu. Ini struknya.',
        'Terima kasih, pembayarannya sudah selesai.',
      ),
      dialog(
        'Tunai atau kartu?',
        'Apakah Anda menerima tunai?',
        'Ya, kami menerima.',
        'Boleh saya minta struknya?',
        'Tentu. Ada yang lain?',
        'Tidak, itu saja.',
        'Pembayaran Anda berhasil.',
        'Terima kasih, pembayarannya sudah selesai.',
      ),
    ],
  },
'cefr-a1-3-g09': {
    goalSnapshot:
      'Goal ini melatih kamu membagi tagihan dengan jelas saat pembayaran bersama. Fokusnya adalah meminta split bill, menyatakan bagian pembayaranmu, mengecek total, lalu menutup dengan konfirmasi nominal yang adil.',
    whyThisMatters:
      'Dalam situasi makan atau layanan bersama, miskomunikasi soal nominal sering bikin canggung. Dengan pola split request -> cek bagian -> validasi total, kamu bisa menyelesaikan pembayaran dengan rapi dan sopan.',
    situationBreakdown: [
      'Open: mulai dengan permintaan jelas: "Can we split the bill?"',
      'Clarify: nyatakan posisi kamu dan cek nominal: "I will pay my part.", "How much is my share?", lalu "Let me check the total again."',
      'Close: setelah nominal cocok, tutup dengan "Thanks, that sounds fair."',
    ],
    pronunciationNotes: [
      'Pada frasa "split the bill", bunyi akhir /t/ di "split" dan /l/ di "bill" perlu jelas agar maksud pembayaran terpisah tidak kabur.',
      'Pada kata "share", panjangkan vokal /eə/ secukupnya agar terdengar natural saat menanyakan bagian biaya.',
      'Pada "total again", beri jeda ringan antara dua kata untuk menandai kamu sedang verifikasi ulang nominal.',
    ],
    commonMistakes: [
      {
        mistake: 'Langsung bayar tanpa meminta pembagian tagihan secara eksplisit.',
        correction: 'Mulai dengan "Can we split the bill?"',
      },
      {
        mistake: 'Tidak menyebut bahwa kamu bayar bagian sendiri, sehingga partner bingung metode pembagiannya.',
        correction: 'Tegaskan dengan "I will pay my part."',
      },
      {
        mistake: 'Menerima nominal tanpa cek ulang total.',
        correction: 'Gunakan "Let me check the total again." sebelum menutup dengan konfirmasi adil.',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Restaurant Split Bill',
        partnerRole: 'teman latihan',
        mission:
          'Partner membawa tagihan meja. Minta split bill, sebut kamu bayar bagianmu, tanyakan nominal bagianmu, lalu tutup setelah nominal terasa adil.',
      },
      {
        title: 'Scenario B - Recheck Shared Total',
        partnerRole: 'teman latihan',
        mission:
          'Partner menyebut total gabungan. Minta cek ulang total, konfirmasi bagianmu, lalu akhiri dengan penutupan yang sopan dan jelas.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Here is your table bill, one hundred twenty thousand.',
        'You: Can we split the bill?',
        'Partner: Yes, of course. How do you want to split it?',
        'You: I will pay my part.',
        'Partner: Sure. There are three people today.',
        'You: How much is my share?',
        'Partner: Your share is forty thousand.',
        'You: Thanks, that sounds fair.',
      ),
      dialog(
        'Partner: The total is one hundred fifty thousand for two people.',
        'You: Let me check the total again.',
        'Partner: Sure, take your time.',
        'You: I will pay my part.',
        'Partner: Great. It is seventy-five thousand each.',
        'You: How much is my share?',
        'Partner: Seventy-five thousand.',
        'You: Thanks, that sounds fair.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Ini tagihan meja Anda, total seratus dua puluh ribu.',
        'Bisa kita pisah tagihannya?',
        'Ya, tentu. Mau dibagi seperti apa?',
        'Saya akan bayar bagian saya.',
        'Baik. Hari ini ada tiga orang.',
        'Bagian saya berapa?',
        'Bagian Anda empat puluh ribu.',
        'Terima kasih, itu terdengar adil.',
      ),
      dialog(
        'Totalnya seratus lima puluh ribu untuk dua orang.',
        'Biar saya cek totalnya lagi.',
        'Silakan, tidak masalah.',
        'Saya akan bayar bagian saya.',
        'Baik. Jadi masing-masing tujuh puluh lima ribu.',
        'Bagian saya berapa?',
        'Tujuh puluh lima ribu.',
        'Terima kasih, itu terdengar adil.',
      ),
    ],
  },
'cefr-a1-3-g10': {
    goalSnapshot:
      'Goal ini melatih kamu menanyakan tenggat waktu dengan jelas dan memastikan ada pengingat sederhana. Fokusnya adalah mendapatkan tanggal final, mengonfirmasi tanggal yang disepakati, lalu menutup dengan komitmen submit tepat waktu.',
    whyThisMatters:
      'Dalam urusan administrasi, salah satu tanggal bisa menentukan apakah dokumen diterima atau ditolak. Dengan pola tanya deadline -> cek ulang tanggal -> minta reminder, kamu lebih aman dari keterlambatan.',
    situationBreakdown: [
      'Open: mulai dengan pertanyaan utama: "When is the deadline?"',
      'Clarify: konfirmasi apakah tanggal target masih valid: "Is Friday still okay?" lalu minta pengingat: "Could you remind me one day before?"',
      'Close: catat tanggal dengan "Let me note the date now." lalu tutup "Thanks, I will submit on time."',
    ],
    pronunciationNotes: [
      'Pada kata "deadline", tekan suku kata pertama agar kata kunci tenggat terdengar jelas.',
      'Pada frasa "one day before", jaga ritme antar kata supaya durasi pengingat tidak salah tangkap.',
      'Pada "submit on time", bunyi akhir /t/ di "submit" dan "time" perlu jelas untuk menegaskan komitmen ketepatan waktu.',
    ],
    commonMistakes: [
      {
        mistake: 'Hanya menanyakan deadline tanpa mengonfirmasi tanggal yang benar.',
        correction: 'Lanjutkan dengan cek spesifik: "Is Friday still okay?"',
      },
      {
        mistake: 'Tidak meminta pengingat walau tahu mudah lupa tenggat.',
        correction: 'Gunakan kalimat langsung: "Could you remind me one day before?"',
      },
      {
        mistake: 'Percakapan selesai tanpa aksi pencatatan tanggal.',
        correction: 'Tambahkan "Let me note the date now." sebelum penutupan.',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Deadline Confirmation at Office',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi tenggat pengumpulan berkas. Tanyakan deadline, cek apakah Jumat masih valid, lalu tutup dengan komitmen submit tepat waktu.',
      },
      {
        title: 'Scenario B - Reminder Request Before Submission',
        partnerRole: 'teman latihan',
        mission:
          'Partner menekankan agar kamu tidak terlambat. Minta reminder satu hari sebelumnya, catat tanggal, lalu akhiri dengan janji submit on time.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Please submit your form this week.',
        'You: When is the deadline?',
        'Partner: The deadline is Friday at 5 PM.',
        'You: Is Friday still okay?',
        'Partner: Yes, Friday is correct.',
        'You: Let me note the date now.',
        'Partner: Great. Please submit before 5 PM.',
        'You: Thanks, I will submit on time.',
      ),
      dialog(
        'Partner: Please do not miss the submission date.',
        'You: Could you remind me one day before?',
        'Partner: Sure, I can remind you on Thursday morning.',
        'You: Let me note the date now.',
        'Partner: Good idea. The deadline is Friday at 5 PM.',
        'You: Is Friday still okay?',
        'Partner: Yes, that is final.',
        'You: Thanks, I will submit on time.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Tolong kumpulkan formulir Anda minggu ini.',
        'Kapan batas waktunya?',
        'Batas waktunya Jumat jam 5 sore.',
        'Apakah Jumat masih oke?',
        'Ya, Jumat itu benar.',
        'Biar saya catat tanggalnya sekarang.',
        'Bagus. Tolong kumpulkan sebelum jam 5 sore.',
        'Terima kasih, saya akan kumpulkan tepat waktu.',
      ),
      dialog(
        'Tolong jangan sampai lewat tanggal pengumpulan.',
        'Bisa ingatkan saya satu hari sebelumnya?',
        'Tentu, saya bisa ingatkan Kamis pagi.',
        'Biar saya catat tanggalnya sekarang.',
        'Ide bagus. Tenggatnya Jumat jam 5 sore.',
        'Apakah Jumat masih oke?',
        'Ya, itu final.',
        'Terima kasih, saya akan kumpulkan tepat waktu.',
      ),
    ],
  },
'cefr-a1-3-g11': {
    goalSnapshot:
      'Goal ini melatih kamu menolak permintaan secara sopan tanpa memutus hubungan kerja sama. Fokusnya adalah menyatakan belum bisa sekarang, memberi alternatif waktu, lalu mengonfirmasi kesepakatan dengan penutupan yang positif.',
    whyThisMatters:
      'Dalam percakapan kerja atau layanan, menolak secara kasar bisa merusak kerja sama. Dengan pola refuse politely -> offer alternative -> confirm agreement, kamu tetap menjaga relasi sekaligus melindungi kapasitasmu.',
    situationBreakdown: [
      'Open: mulai dengan penolakan sopan: "Sorry, I cannot do that now."',
      'Clarify: langsung beri alternatif realistis: "I can do it this afternoon." atau "If urgent, I can ask my friend." lalu cek penerimaan: "Is that okay with you?"',
      'Close: setelah partner setuju, tutup positif dengan "Thanks for understanding."',
    ],
    pronunciationNotes: [
      'Bedakan jelas "can" dan "cannot" pada kalimat penolakan agar makna tidak terbalik.',
      'Pada "this afternoon", tekan suku kata terakhir pada "afternoon" agar terdengar natural.',
      'Pada "understanding", ucapkan /d/ di tengah kata dengan jelas supaya penutupan terdengar rapi.',
    ],
    commonMistakes: [
      {
        mistake: 'Langsung menolak tanpa memberi opsi pengganti.',
        correction: 'Setelah menolak, selalu beri alternatif: "I can do it this afternoon."',
      },
      {
        mistake: 'Memberi alternatif tetapi tidak mengecek apakah partner setuju.',
        correction: 'Gunakan pertanyaan konfirmasi: "Is that okay with you?"',
      },
      {
        mistake: 'Menutup percakapan tanpa apresiasi setelah partner menyesuaikan.',
        correction: 'Akhiri dengan "Thanks for understanding."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Polite Refusal with New Time',
        partnerRole: 'teman latihan',
        mission:
          'Partner meminta tugas selesai sekarang. Tolak dengan sopan, tawarkan waktu alternatif, konfirmasi apakah waktunya cocok, lalu tutup dengan apresiasi.',
      },
      {
        title: 'Scenario B - Urgent Request with Backup Plan',
        partnerRole: 'teman latihan',
        mission:
          'Partner menyebut tugasnya urgent. Tawarkan bantuan cadangan lewat teman, cek apakah partner setuju, lalu tutup dengan kalimat penutup yang sopan.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Can you finish this now?',
        'You: Sorry, I cannot do that now.',
        'Partner: We need it before lunch.',
        'You: I can do it this afternoon.',
        'Partner: Is 3 PM okay?',
        'You: Is that okay with you?',
        'Partner: Yes, 3 PM works.',
        'You: Thanks for understanding.',
      ),
      dialog(
        'Partner: We need this urgently for the client.',
        'You: If urgent, I can ask my friend.',
        'Partner: Can your friend start now?',
        'You: I can do it this afternoon.',
        'Partner: That can help.',
        'You: Is that okay with you?',
        'Partner: Yes, that is okay.',
        'You: Thanks for understanding.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Bisa selesaikan ini sekarang?',
        'Maaf, saya belum bisa lakukan itu sekarang.',
        'Kami butuh sebelum jam makan siang.',
        'Saya bisa kerjakan sore ini.',
        'Kalau jam 3 siang bagaimana?',
        'Apakah itu oke buat Anda?',
        'Ya, jam 3 cocok.',
        'Terima kasih sudah memahami.',
      ),
      dialog(
        'Kami butuh ini urgent untuk klien.',
        'Kalau urgent, saya bisa minta teman saya bantu.',
        'Temanmu bisa mulai sekarang?',
        'Saya bisa kerjakan sore ini.',
        'Itu bisa membantu.',
        'Apakah itu oke buat Anda?',
        'Ya, itu oke.',
        'Terima kasih sudah memahami.',
      ),
    ],
  },
'cefr-a1-3-g12': {
    goalSnapshot:
      'Goal ini melatih kamu menutup percakapan dengan rapi sambil memastikan tindak lanjut sudah jelas. Fokusnya adalah memberi apresiasi, menyatakan pemahaman next step, dan menutup dengan sopan.',
    whyThisMatters:
      'Penutupan yang jelas mencegah kebingungan setelah percakapan selesai. Dengan pola apresiasi -> konfirmasi langkah berikutnya -> rencana tindak lanjut, kamu terlihat profesional dan mudah diajak kerja sama.',
    situationBreakdown: [
      'Open: mulai dengan apresiasi: "Thank you for your help today."',
      'Clarify: konfirmasi bahwa kamu paham alur lanjutan: "I understand the next step." lalu sebut rencana waktu: "I will come back tomorrow morning."',
      'Close: tambahkan rencana darurat "If anything changes, I will call you." lalu akhiri sopan dengan "Have a good day."',
    ],
    pronunciationNotes: [
      'Pada "tomorrow morning", jaga ritme dua kata agar waktu tindak lanjut terdengar jelas.',
      'Pada frasa "anything changes", artikulasikan bunyi akhir /z/ di "changes" supaya kondisi bersyarat terdengar lengkap.',
      'Pada "Have a good day", gunakan intonasi turun yang hangat sebagai sinyal penutupan percakapan.',
    ],
    commonMistakes: [
      {
        mistake: 'Menutup hanya dengan ucapan terima kasih tanpa menyebut langkah berikutnya.',
        correction: 'Setelah apresiasi, tambah "I understand the next step."',
      },
      {
        mistake: 'Menyebut rencana lanjut tapi tanpa waktu yang jelas.',
        correction: 'Gunakan waktu spesifik: "I will come back tomorrow morning."',
      },
      {
        mistake: 'Tidak menyebut rencana jika ada perubahan.',
        correction: 'Tambah kalimat cadangan: "If anything changes, I will call you."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Closing with Next Visit Plan',
        partnerRole: 'teman latihan',
        mission:
          'Partner menutup layanan hari ini. Sampaikan terima kasih, konfirmasi kamu paham next step, sebut waktu kembali, lalu tutup dengan sopan.',
      },
      {
        title: 'Scenario B - Closing with Contingency Plan',
        partnerRole: 'teman latihan',
        mission:
          'Partner mengingatkan kemungkinan perubahan. Konfirmasi langkah berikutnya, sebut rencana menelepon jika ada perubahan, lalu tutup dengan kalimat penutup yang natural.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: We finished your document update today.',
        'You: Thank you for your help today.',
        'Partner: You are welcome. Please come back tomorrow morning.',
        'You: I understand the next step.',
        'Partner: Great. What time will you come?',
        'You: I will come back tomorrow morning.',
        'Partner: Perfect. See you then.',
        'You: Have a good day.',
      ),
      dialog(
        'Partner: Everything is complete for now.',
        'You: Thank you for your help today.',
        'Partner: If anything changes, please contact us.',
        'You: If anything changes, I will call you.',
        'Partner: Great. Do you understand the next step?',
        'You: I understand the next step.',
        'Partner: Perfect. See you tomorrow morning.',
        'You: Have a good day.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Kami sudah menyelesaikan pembaruan dokumen Anda hari ini.',
        'Terima kasih atas bantuan Anda hari ini.',
        'Sama-sama. Silakan kembali besok pagi.',
        'Saya paham langkah berikutnya.',
        'Bagus. Jam berapa Anda akan datang?',
        'Saya akan kembali besok pagi.',
        'Sempurna. Sampai jumpa.',
        'Semoga harimu menyenangkan.',
      ),
      dialog(
        'Untuk saat ini semuanya sudah selesai.',
        'Terima kasih atas bantuan Anda hari ini.',
        'Kalau ada perubahan, tolong hubungi kami.',
        'Jika ada perubahan, saya akan menelepon Anda.',
        'Bagus. Apakah Anda paham langkah berikutnya?',
        'Saya paham langkah berikutnya.',
        'Sempurna. Sampai besok pagi.',
        'Semoga harimu menyenangkan.',
      ),
    ],
  }
};
