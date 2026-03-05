import type { CoherenceSectionOverride, ManualRoleplayPair } from './shared';

const dialog = (...lines: string[]) => lines.join('\n');

export const MANUAL_ROLEPLAY_DIALOGS_A1_2: Record<string, ManualRoleplayPair> = {
'cefr-a1-2-g01': [
    dialog(
      'Partner: Hello, how can I help?',
      'You: I am hungry.',
      'Partner: We have food at the cafeteria.',
      'You: Is there a place to eat nearby?',
      'Partner: Yes, on the first floor.',
      'You: Thank you, this is enough.',
    ),
    dialog(
      'Partner: Do you need anything now?',
      'You: I need some water.',
      'Partner: Sure, here you are.',
      'You: Could I get food, please?',
      'Partner: Yes, you can order at the counter.',
      'You: Thank you, this is enough.',
    ),
  ],
'cefr-a1-2-g02': [
    dialog(
      'Partner: Welcome. What would you like?',
      'You: I would like fried rice, please.',
      'Partner: Any drink?',
      'You: Can I have iced tea?',
      'Partner: Sure. Anything else?',
      'You: That is all, thank you.',
    ),
    dialog(
      'Partner: Do you want it spicy?',
      'You: No chili, please.',
      'Partner: Okay. Any other request?',
      'You: Is this meal halal?',
      'Partner: Yes, it is halal.',
      'You: That is all, thank you.',
    ),
  ],
'cefr-a1-2-g03': [
    dialog(
      'Partner: Ready to order?',
      'You: I am allergic to peanuts.',
      'Partner: Thanks for telling me.',
      'You: Could you check the ingredients?',
      'Partner: Yes, this dish has no peanuts.',
      'You: Thank you for confirming.',
    ),
    dialog(
      'Partner: This soup has shrimp.',
      'You: Please do not add shrimp.',
      'Partner: Noted.',
      'You: I cannot eat dairy.',
      'Partner: Okay, we can change the menu.',
      'You: Thank you for confirming.',
    ),
  ],
'cefr-a1-2-g04': [
    dialog(
      'Partner: Do you like this bag?',
      'You: How much is this?',
      'Partner: It is fifty thousand.',
      'You: Is this the final price?',
      'Partner: Yes, final price.',
      'You: Okay, I will take it.',
    ),
    dialog(
      'Partner: This one is sixty thousand.',
      'You: Do you have a cheaper one?',
      'Partner: Yes, this one is forty-five thousand.',
      'You: So the total is fifty thousand, right?',
      'Partner: Yes, with tax.',
      'You: Okay, I will take it.',
    ),
  ],
'cefr-a1-2-g05': [
    dialog(
      'Partner: Your total is one hundred thousand.',
      'You: Is there any discount today?',
      'Partner: Yes, ten percent.',
      'You: Does this include tax?',
      'Partner: Yes, already included.',
      'You: Thanks, I will pay now.',
    ),
    dialog(
      'Partner: Are you a student?',
      'You: Can I get a student discount?',
      'Partner: Yes, please show your card.',
      'You: How much do I save?',
      'Partner: You save fifteen thousand.',
      'You: Thanks, I will pay now.',
    ),
  ],
'cefr-a1-2-g06': [
    dialog(
      'Partner: Excuse me.',
      'You: May I sit here?',
      'Partner: Yes, this seat is free.',
      'You: Is this seat free?',
      'Partner: Yes, please go ahead.',
      'You: Thank you, I will be quick.',
    ),
    dialog(
      'Partner: This area is usually restricted.',
      'You: Sorry, is this allowed?',
      'Partner: Yes, for ten minutes.',
      'You: Can I use this room for ten minutes?',
      'Partner: Yes, please finish quickly.',
      'You: Thank you, I will be quick.',
    ),
  ],
'cefr-a1-2-g07': [
    dialog(
      'Partner: Welcome to the mall.',
      'You: Where is the restroom?',
      'Partner: It is on this floor, near the lift.',
      'You: Should I turn left or right?',
      'Partner: Turn right.',
      'You: Thanks, I can find it now.',
    ),
    dialog(
      'Partner: Can I help you?',
      'You: Is it on this floor?',
      'Partner: Yes, it is.',
      'You: Could you point it out, please?',
      'Partner: Sure, right behind that cafe.',
      'You: Thanks, I can find it now.',
    ),
  ],
'cefr-a1-2-g08': [
    dialog(
      'Partner: When do you want to meet?',
      'You: Can we meet tomorrow?',
      'Partner: Yes. What time?',
      'You: Is ten in the morning okay?',
      'Partner: Yes, that works.',
      'You: Great, see you tomorrow.',
    ),
    dialog(
      'Partner: I am free on Tuesday.',
      'You: I am available after lunch.',
      'Partner: Is Tuesday at two okay?',
      'You: Let me confirm: Tuesday at two.',
      'Partner: Yes, correct.',
      'You: Great, see you tomorrow.',
    ),
  ],
'cefr-a1-2-g09': [
    dialog(
      'Partner: Are we still meeting at ten?',
      'You: Sorry, I cannot come at ten.',
      'Partner: No problem. What time works?',
      'You: Could we move it to two o\'clock?',
      'Partner: Yes, two o\'clock is fine.',
      'You: Thanks for adjusting the schedule.',
    ),
    dialog(
      'Partner: Tuesday is full.',
      'You: Is Wednesday possible for you?',
      'Partner: Yes, Wednesday morning.',
      'You: I will be on time.',
      'Partner: Great.',
      'You: Thanks for adjusting the schedule.',
    ),
  ],
'cefr-a1-2-g10': [
    dialog(
      'Partner: Hello.',
      'You: Where can I get a bus ticket?',
      'Partner: At counter three.',
      'You: What time is the next bus?',
      'Partner: At 3:15 PM.',
      'You: Thanks, I will take this bus.',
    ),
    dialog(
      'Partner: Bus 12 is arriving now.',
      'You: Does this bus go to the station?',
      'Partner: Yes, it does.',
      'You: Should I wait here?',
      'Partner: Yes, this is the correct stop.',
      'You: Thanks, I will take this bus.',
    ),
  ],
'cefr-a1-2-g11': [
    dialog(
      'Partner: I dropped my books.',
      'You: Do you need help?',
      'Partner: Yes, please.',
      'You: I can carry that for you.',
      'Partner: Thank you.',
      'You: You are welcome.',
    ),
    dialog(
      'Partner: I cannot complete this form.',
      'You: Can I help you fill this form?',
      'Partner: Yes, please.',
      'You: Is this okay for you?',
      'Partner: Yes, this is perfect.',
      'You: You are welcome.',
    ),
  ],
'cefr-a1-2-g12': [
    dialog(
      'Partner: You seem stuck.',
      'You: Could you open this for me?',
      'Partner: Sure.',
      'You: Can you show me how to do it?',
      'Partner: Yes, watch this step.',
      'You: Thanks, I can do it now.',
    ),
    dialog(
      'Partner: Try it now.',
      'You: I do not know this step yet.',
      'Partner: No problem.',
      'You: Could we do it together once?',
      'Partner: Of course, follow me.',
      'You: Thanks, I can do it now.',
    ),
  ]
};

export const MANUAL_ROLEPLAY_DIALOGS_ID_A1_2: Record<string, ManualRoleplayPair> = {};

export const SCENARIO_B_MISSION_OVERRIDES_A1_2: Record<string, string> = {};

export const COHERENCE_SECTION_OVERRIDES_A1_2: Record<string, CoherenceSectionOverride> = {
'cefr-a1-2-g01': {
    goalSnapshot:
      'Goal ini melatih kamu menyampaikan kebutuhan makan atau minum secara sopan saat berada di tempat umum. Fokusnya adalah menyebut kebutuhan inti, menanyakan opsi terdekat, lalu menutup dengan jelas.',
    whyThisMatters:
      'Di situasi sehari-hari, kamu sering perlu bantuan cepat saat lapar atau haus. Jika kamu bisa meminta makan/minum dengan kalimat ringkas dan sopan, kebutuhanmu lebih cepat terpenuhi dan percakapan tetap nyaman.',
    situationBreakdown: [
      'Open: sampaikan kebutuhan utama dulu, misalnya "I am hungry." atau "I need some water."',
      'Clarify: lanjutkan dengan permintaan atau pertanyaan spesifik seperti "Could I get food, please?" dan "Is there a place to eat nearby?"',
      'Close: setelah kebutuhanmu terjawab, tutup dengan kalimat penutup sopan: "Thank you, this is enough."',
    ],
    pronunciationNotes: [
      'Pada "hungry", tekan suku kata pertama (HUN-gry) agar terdengar natural.',
      'Pada "water", bunyi /t/ bisa terdengar flap dalam American English, jadi fokus pada kelancaran ritme, bukan menekan /t/ berlebihan.',
      'Pada "Could I get food, please?", jaga intonasi sopan dan sedikit naik di akhir agar terdengar sebagai request, bukan perintah.',
    ],
    commonMistakes: [
      {
        mistake: 'Langsung meminta menu panjang sebelum menyebut kebutuhan dasar.',
        correction: 'Mulai dari kebutuhan inti dulu: "I am hungry." atau "I need some water."',
      },
      {
        mistake: 'Meminta bantuan tanpa menyebut konteks tempat makan.',
        correction: 'Tambahkan pertanyaan lokasi: "Is there a place to eat nearby?"',
      },
      {
        mistake: 'Percakapan selesai tanpa penutup sopan.',
        correction: 'Akhiri dengan "Thank you, this is enough."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Ask for Food Place',
        partnerRole: 'teman latihan',
        mission:
          'Partner menawarkan bantuan umum. Sampaikan kamu lapar, tanyakan tempat makan terdekat, lalu tutup dengan penutup sopan.',
      },
      {
        title: 'Scenario B - Ask for Water and Food',
        partnerRole: 'teman latihan',
        mission:
          'Partner menanyakan kebutuhan kamu. Minta air, lanjut minta makanan dengan sopan, lalu tutup percakapan dengan jelas.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Hello, how can I help?',
        'You: I am hungry.',
        'Partner: There is a cafeteria on the first floor.',
        'You: Is there a place to eat nearby?',
        'Partner: Yes, the cafeteria is nearby.',
        'You: Thank you, this is enough.',
      ),
      dialog(
        'Partner: Do you need anything now?',
        'You: I need some water.',
        'Partner: Sure, here you are.',
        'You: Could I get food, please?',
        'Partner: Yes, you can order at the counter.',
        'You: Thank you, this is enough.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Halo, ada yang bisa saya bantu?',
        'Saya lapar.',
        'Ada kantin di lantai satu.',
        'Apakah ada tempat makan di dekat sini?',
        'Ya, kantinnya dekat.',
        'Terima kasih, ini sudah cukup.',
      ),
      dialog(
        'Apakah kamu butuh sesuatu sekarang?',
        'Saya butuh air minum.',
        'Tentu, ini airnya.',
        'Boleh minta makanan juga?',
        'Ya, kamu bisa pesan di konter.',
        'Terima kasih, ini sudah cukup.',
      ),
    ],
  },
'cefr-a1-2-g02': {
    goalSnapshot:
      'Goal ini melatih kamu memesan makanan dan minuman sederhana dengan jelas di warung, kantin, atau restoran kasual. Fokusnya adalah menyebut pesanan inti, menambahkan preferensi, lalu menutup order dengan rapi.',
    whyThisMatters:
      'Saat order makanan, kejelasan ucapan menentukan apakah pesananmu tepat atau salah. Dengan pola menu -> minuman -> preferensi -> cek kebutuhan khusus, kamu bisa mengurangi salah order.',
    situationBreakdown: [
      'Open: mulai dengan menu utama menggunakan "I would like fried rice, please."',
      'Clarify: lanjutkan minuman dan preferensi rasa dengan "Can I have iced tea?" dan "No chili, please."',
      'Close: jika perlu, cek kebutuhan khusus seperti "Is this meal halal?" lalu tutup dengan "That is all, thank you."',
    ],
    pronunciationNotes: [
      'Pada "fried rice", jaga bunyi akhir /d/ di "fried" agar tidak terdengar seperti "fry rice".',
      'Pada "iced tea", ucapkan /t/ di "tea" jelas supaya minuman yang diminta tidak ambigu.',
      'Pada "halal", ucapkan dua suku kata dengan jelas agar pertanyaan terdengar sopan dan spesifik.',
    ],
    commonMistakes: [
      {
        mistake: 'Menyebut banyak item sekaligus tanpa urutan yang jelas.',
        correction: 'Gunakan urutan sederhana: menu dulu, lalu minuman.',
      },
      {
        mistake: 'Lupa menyebut preferensi penting seperti tingkat pedas.',
        correction: 'Tambahkan kalimat spesifik: "No chili, please."',
      },
      {
        mistake: 'Menutup order tanpa cek kebutuhan penting (misalnya halal).',
        correction: 'Tanyakan dulu "Is this meal halal?" sebelum closing.',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Basic Food Order',
        partnerRole: 'teman latihan',
        mission:
          'Partner menerima pesananmu. Sebut menu utama, minuman, lalu tutup order dengan kalimat penutup yang sopan.',
      },
      {
        title: 'Scenario B - Preference and Halal Check',
        partnerRole: 'teman latihan',
        mission:
          'Partner menanyakan detail pesanan. Sampaikan preferensi no chili, cek halal, lalu akhiri order dengan jelas.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Welcome. What would you like to order?',
        'You: I would like fried rice, please.',
        'Partner: Sure. Any drink?',
        'You: Can I have iced tea?',
        'Partner: Anything else?',
        'You: That is all, thank you.',
      ),
      dialog(
        'Partner: Do you want it spicy?',
        'You: No chili, please.',
        'Partner: Noted. Any other request?',
        'You: Is this meal halal?',
        'Partner: Yes, it is halal.',
        'You: That is all, thank you.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Selamat datang. Mau pesan apa?',
        'Saya mau nasi goreng, tolong.',
        'Baik. Minumnya apa?',
        'Boleh minta es teh?',
        'Ada tambahan lain?',
        'Sudah itu saja, terima kasih.',
      ),
      dialog(
        'Mau pedas?',
        'Tidak pedas, ya.',
        'Baik. Ada permintaan lain?',
        'Apakah makanan ini halal?',
        'Ya, ini halal.',
        'Sudah itu saja, terima kasih.',
      ),
    ],
  },
'cefr-a1-2-g03': {
    goalSnapshot:
      'Goal ini melatih kamu menyampaikan alergi makanan sederhana agar pesanan tetap aman. Fokusnya adalah menyebut alergi secara langsung, menyatakan bahan yang harus dihindari, lalu meminta verifikasi bahan.',
    whyThisMatters:
      'Salah paham soal alergi bisa berdampak serius. Dengan kalimat yang jelas dan langsung, kamu bisa mencegah risiko dan memastikan makanan yang kamu terima sesuai kebutuhan kesehatan.',
    situationBreakdown: [
      'Open: sebut kondisi alergi dulu, misalnya "I am allergic to peanuts."',
      'Clarify: nyatakan larangan bahan spesifik seperti "Please do not add shrimp." dan "I cannot eat dairy."',
      'Close: minta verifikasi dengan "Could you check the ingredients?" lalu tutup dengan "Thank you for confirming."',
    ],
    pronunciationNotes: [
      'Pada "allergic", tekan suku kata tengah (a-LER-gic) agar terdengar natural.',
      'Pada "ingredients", artikulasikan suku kata awal dengan jelas supaya permintaan cek bahan terdengar tegas.',
      'Pada "dairy", jaga vokal pertama tetap jelas agar tidak tertukar dengan kata lain.',
    ],
    commonMistakes: [
      {
        mistake: 'Menyebut alergi secara samar tanpa menyebut bahan spesifik.',
        correction: 'Sebutkan langsung bahan pemicu: "I am allergic to peanuts."',
      },
      {
        mistake: 'Tidak menyatakan larangan bahan saat memesan.',
        correction: 'Gunakan kalimat larangan tegas namun sopan: "Please do not add shrimp."',
      },
      {
        mistake: 'Percaya langsung tanpa meminta cek komposisi.',
        correction: 'Selalu tambahkan "Could you check the ingredients?"',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Allergy Disclosure at Order',
        partnerRole: 'teman latihan',
        mission:
          'Partner menerima pesananmu. Sampaikan alergi kacang, minta cek bahan, lalu tutup setelah partner konfirmasi aman.',
      },
      {
        title: 'Scenario B - Ingredient Restriction Clarification',
        partnerRole: 'teman latihan',
        mission:
          'Partner menyebut menu yang mengandung bahan tertentu. Sampaikan larangan shrimp dan dairy, minta opsi aman, lalu tutup dengan konfirmasi.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Ready to order?',
        'You: I am allergic to peanuts.',
        'Partner: Thanks for telling me.',
        'You: Could you check the ingredients?',
        'Partner: Yes, this dish has no peanuts.',
        'You: Thank you for confirming.',
      ),
      dialog(
        'Partner: This soup usually has shrimp and milk.',
        'You: Please do not add shrimp.',
        'Partner: Noted. Anything else?',
        'You: I cannot eat dairy.',
        'Partner: Okay, we can make a dairy-free version.',
        'You: Thank you for confirming.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Siap pesan?',
        'Saya alergi kacang.',
        'Terima kasih sudah memberi tahu.',
        'Bisa cek bahan-bahannya?',
        'Ya, menu ini tidak mengandung kacang.',
        'Terima kasih sudah konfirmasi.',
      ),
      dialog(
        'Sup ini biasanya pakai udang dan susu.',
        'Tolong jangan tambahkan udang.',
        'Baik. Ada lagi?',
        'Saya tidak bisa makan produk susu.',
        'Oke, kami bisa buat versi tanpa susu.',
        'Terima kasih sudah konfirmasi.',
      ),
    ],
  },
'cefr-a1-2-g04': {
    goalSnapshot:
      'Goal ini melatih kamu menanyakan harga barang sebelum memutuskan pembelian. Fokusnya adalah cek harga awal, cek harga final, minta opsi lebih murah, lalu konfirmasi total sebelum membeli.',
    whyThisMatters:
      'Dalam situasi belanja, keputusan cepat tanpa konfirmasi harga bisa bikin salah budget. Dengan pola tanya harga yang terstruktur, kamu bisa membandingkan opsi dan membeli dengan yakin.',
    situationBreakdown: [
      'Open: mulai dengan pertanyaan harga dasar: "How much is this?"',
      'Clarify: cek kepastian biaya lewat "Is this the final price?" lalu minta opsi lain: "Do you have a cheaper one?"',
      'Close: konfirmasi total pembayaran dengan "So the total is fifty thousand, right?" lalu putuskan: "Okay, I will take it."',
    ],
    pronunciationNotes: [
      'Pada "How much is this?", tekan kata "much" agar fokus pertanyaan harga terdengar jelas.',
      'Pada "cheaper", pastikan bunyi /ch/ di awal kata jelas agar tidak terdengar seperti "deeper".',
      'Pada angka "fifty thousand", artikulasikan kedua angka dengan tempo stabil agar tidak salah tangkap.',
    ],
    commonMistakes: [
      {
        mistake: 'Langsung setuju beli tanpa cek apakah harga masih bisa berubah.',
        correction: 'Pastikan dulu: "Is this the final price?"',
      },
      {
        mistake: 'Tidak menanyakan alternatif saat harga di atas budget.',
        correction: 'Tanyakan opsi: "Do you have a cheaper one?"',
      },
      {
        mistake: 'Tidak mengonfirmasi total akhir sebelum bayar.',
        correction: 'Gunakan read-back harga: "So the total is fifty thousand, right?"',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Price Check Before Buying',
        partnerRole: 'teman latihan',
        mission:
          'Partner menawarkan barang. Tanyakan harga, cek apakah final, lalu ambil keputusan beli dengan jelas.',
      },
      {
        title: 'Scenario B - Compare and Confirm Total',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi opsi harga berbeda. Minta opsi lebih murah, konfirmasi total akhir, lalu tutup dengan keputusan beli.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Do you like this bag?',
        'You: How much is this?',
        'Partner: It is fifty thousand.',
        'You: Is this the final price?',
        'Partner: Yes, final price.',
        'You: Okay, I will take it.',
      ),
      dialog(
        'Partner: This one is sixty thousand.',
        'You: Do you have a cheaper one?',
        'Partner: Yes, this one is fifty thousand.',
        'You: So the total is fifty thousand, right?',
        'Partner: Yes, that is correct.',
        'You: Okay, I will take it.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Kamu suka tas ini?',
        'Berapa harga ini?',
        'Harganya lima puluh ribu.',
        'Apakah ini harga final?',
        'Ya, harga final.',
        'Oke, saya ambil.',
      ),
      dialog(
        'Yang ini enam puluh ribu.',
        'Ada yang lebih murah?',
        'Ada, yang ini lima puluh ribu.',
        'Jadi totalnya lima puluh ribu, benar?',
        'Ya, itu benar.',
        'Oke, saya ambil.',
      ),
    ],
  },
'cefr-a1-2-g05': {
    goalSnapshot:
      'Goal ini melatih kamu menanyakan promo atau diskon yang berlaku sebelum menyelesaikan pembayaran. Fokusnya adalah cek diskon, cek komponen harga, lalu putuskan bayar dengan jelas.',
    whyThisMatters:
      'Dalam transaksi sederhana, banyak learner lupa menanyakan promo dan akhirnya membayar lebih mahal. Dengan pertanyaan yang tepat, kamu bisa tahu potongan harga dan total biaya sebenarnya.',
    situationBreakdown: [
      'Open: buka dengan pertanyaan promo umum: "Is there any discount today?"',
      'Clarify: lanjutkan detail potongan dengan "Can I get a student discount?", "Does this include tax?", dan "How much do I save?"',
      'Close: setelah jelas totalnya, tutup dengan keputusan pembayaran: "Thanks, I will pay now."',
    ],
    pronunciationNotes: [
      'Pada "discount", tekan suku kata kedua (dis-COUNT) agar terdengar natural.',
      'Pada "include tax", ucapkan /d/ akhir "include" dengan ringan agar transisi ke "tax" tetap jelas.',
      'Pada "How much do I save?", beri tekanan ringan pada kata "save" untuk menegaskan tujuan pertanyaan.',
    ],
    commonMistakes: [
      {
        mistake: 'Hanya menanyakan diskon tanpa menanyakan pajak atau biaya tambahan.',
        correction: 'Tambahkan pertanyaan: "Does this include tax?"',
      },
      {
        mistake: 'Menanyakan diskon tetapi tidak mengecek besar penghematannya.',
        correction: 'Minta angka spesifik: "How much do I save?"',
      },
      {
        mistake: 'Menutup transaksi tanpa keputusan akhir yang jelas.',
        correction: 'Gunakan closing tegas: "Thanks, I will pay now."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - General Discount Check',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberikan total belanja. Tanyakan diskon hari ini, cek apakah sudah termasuk pajak, lalu akhiri dengan keputusan bayar.',
      },
      {
        title: 'Scenario B - Student Discount Clarification',
        partnerRole: 'teman latihan',
        mission:
          'Partner menanyakan status pelajar. Minta student discount, tanyakan jumlah penghematan, lalu tutup transaksi dengan jelas.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Your total is one hundred thousand.',
        'You: Is there any discount today?',
        'Partner: Yes, there is a ten percent discount.',
        'You: Does this include tax?',
        'Partner: Yes, tax is already included.',
        'You: Thanks, I will pay now.',
      ),
      dialog(
        'Partner: Are you a student?',
        'You: Can I get a student discount?',
        'Partner: Yes, please show your student card.',
        'You: How much do I save?',
        'Partner: You save fifteen thousand.',
        'You: Thanks, I will pay now.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Totalnya seratus ribu.',
        'Apakah ada diskon hari ini?',
        'Ya, ada diskon sepuluh persen.',
        'Apakah ini sudah termasuk pajak?',
        'Ya, pajaknya sudah termasuk.',
        'Terima kasih, saya bayar sekarang.',
      ),
      dialog(
        'Apakah kamu pelajar?',
        'Bisa dapat diskon pelajar?',
        'Ya, tolong tunjukkan kartu pelajarnya.',
        'Saya hemat berapa?',
        'Kamu hemat lima belas ribu.',
        'Terima kasih, saya bayar sekarang.',
      ),
    ],
  },
'cefr-a1-2-g06': {
    goalSnapshot:
      'Goal ini melatih kamu meminta izin memakai fasilitas umum dengan sopan untuk durasi singkat. Fokusnya adalah menanyakan ketersediaan, memastikan aturan, lalu menutup dengan komitmen waktu yang jelas.',
    whyThisMatters:
      'Di tempat umum, cara meminta izin memengaruhi respons lawan bicara. Dengan kalimat sopan dan jelas, kamu bisa menggunakan fasilitas tanpa menimbulkan salah paham atau konflik kecil.',
    situationBreakdown: [
      'Open: buka dengan pertanyaan izin dasar seperti "May I sit here?" atau "Is this seat free?"',
      'Clarify: jika area punya aturan, konfirmasi dulu dengan "Sorry, is this allowed?" lalu minta durasi spesifik: "Can I use this room for ten minutes?"',
      'Close: setelah izin diberikan, tutup dengan apresiasi dan komitmen: "Thank you, I will be quick."',
    ],
    pronunciationNotes: [
      'Pada "May I sit here?", ucapkan "May I" dengan ritme halus agar terdengar sopan.',
      'Pada "allowed", pastikan bunyi /l/ terdengar jelas supaya pertanyaan tidak terdengar kabur.',
      'Pada "ten minutes", beri tekanan ringan pada angka agar batas waktu terdengar tegas.',
    ],
    commonMistakes: [
      {
        mistake: 'Langsung memakai kursi/ruang tanpa menanyakan izin dulu.',
        correction: 'Mulai dengan pertanyaan izin: "May I sit here?"',
      },
      {
        mistake: 'Tidak menanyakan apakah area tersebut memang boleh dipakai.',
        correction: 'Gunakan kalimat cek aturan: "Sorry, is this allowed?"',
      },
      {
        mistake: 'Setelah diberi izin, tidak memberi penutup sopan atau komitmen durasi.',
        correction: 'Tutup dengan "Thank you, I will be quick."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Seat Permission',
        partnerRole: 'teman latihan',
        mission:
          'Partner berada di area duduk umum. Minta izin duduk, cek kursi kosong, lalu tutup dengan ucapan terima kasih.',
      },
      {
        title: 'Scenario B - Room Use Permission',
        partnerRole: 'teman latihan',
        mission:
          'Partner menjaga area yang ada batas aturan. Tanyakan apakah boleh dipakai, minta izin 10 menit, lalu tutup dengan komitmen cepat selesai.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Excuse me.',
        'You: May I sit here?',
        'Partner: Yes, this seat is free.',
        'You: Is this seat free?',
        'Partner: Yes, please go ahead.',
        'You: Thank you, I will be quick.',
      ),
      dialog(
        'Partner: This area is usually restricted.',
        'You: Sorry, is this allowed?',
        'Partner: Yes, for ten minutes.',
        'You: Can I use this room for ten minutes?',
        'Partner: Yes, please finish quickly.',
        'You: Thank you, I will be quick.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Permisi.',
        'Boleh saya duduk di sini?',
        'Ya, kursi ini kosong.',
        'Apakah kursi ini kosong?',
        'Ya, silakan.',
        'Terima kasih, saya akan cepat.',
      ),
      dialog(
        'Area ini biasanya terbatas.',
        'Maaf, apakah ini diperbolehkan?',
        'Ya, untuk sepuluh menit.',
        'Boleh saya pakai ruangan ini sepuluh menit?',
        'Ya, tolong selesaikan dengan cepat.',
        'Terima kasih, saya akan cepat.',
      ),
    ],
  },
'cefr-a1-2-g07': {
    goalSnapshot:
      'Goal ini melatih kamu menanyakan lokasi toilet atau fasilitas penting lain saat berada di tempat baru. Fokusnya adalah bertanya lokasi inti, menindaklanjuti arah, lalu menutup setelah kamu paham rutenya.',
    whyThisMatters:
      'Saat butuh fasilitas dasar, kejelasan arah itu krusial. Dengan urutan pertanyaan yang tepat, kamu bisa menghindari salah jalan dan bergerak lebih cepat tanpa canggung.',
    situationBreakdown: [
      'Open: mulai dengan pertanyaan lokasi utama: "Where is the restroom?"',
      'Clarify: cek level lokasi dengan "Is it on this floor?" lalu lanjutkan arah detail: "Should I turn left or right?" atau "Could you point it out, please?"',
      'Close: setelah arah jelas, tutup dengan kalimat penutup: "Thanks, I can find it now."',
    ],
    pronunciationNotes: [
      'Pada "restroom", tekan suku kata pertama (REST-room) agar kata kunci fasilitas terdengar jelas.',
      'Pada "left or right", beri jeda ringan di antara dua opsi arah supaya lawan bicara mudah menangkap pertanyaan.',
      'Pada "point it out", sambungkan ritme kata secara natural agar tidak terdengar patah-patah.',
    ],
    commonMistakes: [
      {
        mistake: 'Berhenti setelah pertanyaan pertama tanpa follow-up arah.',
        correction: 'Lanjutkan dengan pertanyaan arah seperti "Should I turn left or right?"',
      },
      {
        mistake: 'Tidak memastikan apakah fasilitas ada di lantai yang sama.',
        correction: 'Tambahkan cek cepat: "Is it on this floor?"',
      },
      {
        mistake: 'Menutup percakapan tanpa memastikan kamu sudah paham lokasi.',
        correction: 'Gunakan penutup konfirmatif: "Thanks, I can find it now."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Restroom Direction in Mall',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi info lokasi restroom di pusat perbelanjaan. Tanyakan lokasi, arah belok, lalu tutup setelah kamu paham.',
      },
      {
        title: 'Scenario B - Confirm Floor and Landmark',
        partnerRole: 'teman latihan',
        mission:
          'Partner menawarkan bantuan arah. Pastikan lokasi di lantai yang sama, minta penunjuk titik, lalu tutup secara sopan.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Welcome to the mall. Can I help you?',
        'You: Where is the restroom?',
        'Partner: It is on this floor, near the elevator.',
        'You: Should I turn left or right?',
        'Partner: Turn right after the information desk.',
        'You: Thanks, I can find it now.',
      ),
      dialog(
        'Partner: Can I help you?',
        'You: Is it on this floor?',
        'Partner: Yes, it is on this floor.',
        'You: Could you point it out, please?',
        'Partner: Sure, it is behind that cafe.',
        'You: Thanks, I can find it now.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Selamat datang di mal. Bisa saya bantu?',
        'Di mana toilet?',
        'Ada di lantai ini, dekat lift.',
        'Saya belok kiri atau kanan?',
        'Belok kanan setelah meja informasi.',
        'Terima kasih, sekarang saya bisa menemukannya.',
      ),
      dialog(
        'Ada yang bisa saya bantu?',
        'Apakah ada di lantai ini?',
        'Ya, ada di lantai ini.',
        'Bisa tunjukkan lokasinya, tolong?',
        'Tentu, ada di belakang kafe itu.',
        'Terima kasih, sekarang saya bisa menemukannya.',
      ),
    ],
  },
'cefr-a1-2-g08': {
    goalSnapshot:
      'Goal ini melatih kamu membuat janji sederhana dengan waktu yang jelas. Fokusnya adalah menawarkan waktu, menegosiasikan slot yang cocok, lalu mengunci jadwal final dengan konfirmasi.',
    whyThisMatters:
      'Banyak salah jadwal terjadi karena waktu tidak dikonfirmasi dengan jelas. Dengan pola usul waktu -> cek kecocokan -> read-back jadwal, kamu bisa memastikan kedua pihak sepakat pada waktu yang sama.',
    situationBreakdown: [
      'Open: ajukan opsi awal dengan "Can we meet tomorrow?"',
      'Clarify: cek kecocokan jam lewat "Is ten in the morning okay?" atau tawarkan alternatif "I am available after lunch."',
      'Close: kunci detail dengan "Let me confirm: Tuesday at ten." lalu tutup "Great, see you tomorrow."',
    ],
    pronunciationNotes: [
      'Pada "tomorrow", tekan suku kata tengah (to-MOR-row) agar terdengar natural.',
      'Pada "available", artikulasikan suku kata awal dan tengah dengan jelas supaya kalimat tidak terdengar terburu-buru.',
      'Pada kalimat konfirmasi waktu, beri jeda setelah "confirm" agar detail hari dan jam mudah ditangkap.',
    ],
    commonMistakes: [
      {
        mistake: 'Menawarkan waktu tanpa memastikan lawan bicara setuju.',
        correction: 'Selalu cek dengan pertanyaan: "Is ten in the morning okay?"',
      },
      {
        mistake: 'Mengubah waktu tetapi tidak menyebutkan slot alternatif jelas.',
        correction: 'Berikan opsi spesifik: "I am available after lunch."',
      },
      {
        mistake: 'Menutup percakapan tanpa konfirmasi jadwal final.',
        correction: 'Gunakan read-back: "Let me confirm: Tuesday at ten."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Set a Meeting Time',
        partnerRole: 'teman latihan',
        mission:
          'Partner siap menentukan janji. Ajukan waktu besok, cek jam yang cocok, lalu tutup setelah sepakat.',
      },
      {
        title: 'Scenario B - Confirm Final Slot',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi opsi hari. Sampaikan ketersediaanmu, konfirmasi slot final hari-jam, lalu tutup percakapan dengan jelas.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: When do you want to meet?',
        'You: Can we meet tomorrow?',
        'Partner: Yes, what time works for you?',
        'You: Is ten in the morning okay?',
        'Partner: Yes, that works.',
        'You: Great, see you tomorrow.',
      ),
      dialog(
        'Partner: I am free on Tuesday.',
        'You: I am available after lunch.',
        'Partner: Is Tuesday at ten okay?',
        'You: Let me confirm: Tuesday at ten.',
        'Partner: Yes, correct.',
        'You: Great, see you tomorrow.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Kapan kamu mau bertemu?',
        'Bisa ketemu besok?',
        'Bisa, jam berapa cocok?',
        'Jam sepuluh pagi cocok?',
        'Ya, cocok.',
        'Baik, sampai ketemu besok.',
      ),
      dialog(
        'Saya kosong hari Selasa.',
        'Saya tersedia setelah makan siang.',
        'Selasa jam sepuluh cocok?',
        'Biar saya konfirmasi: Selasa jam sepuluh.',
        'Ya, benar.',
        'Baik, sampai ketemu besok.',
      ),
    ],
  },
'cefr-a1-2-g09': {
    goalSnapshot:
      'Goal ini melatih kamu meminta reschedule dengan tetap sopan dan jelas saat jadwal awal tidak bisa dipenuhi. Fokusnya adalah menyampaikan kendala, menawarkan waktu baru, lalu mengunci komitmen jadwal pengganti.',
    whyThisMatters:
      'Kemampuan reschedule yang sopan penting untuk menjaga kepercayaan. Dengan pola alasan singkat -> opsi waktu baru -> konfirmasi hadir, kamu bisa mengubah jadwal tanpa membuat percakapan canggung.',
    situationBreakdown: [
      'Open: sampaikan kendala dulu secara langsung: "Sorry, I cannot come at ten."',
      'Clarify: tawarkan waktu alternatif dengan "Could we move it to two o\'clock?" atau cek opsi hari lain: "Is Wednesday possible for you?"',
      'Close: setelah sepakat, tunjukkan komitmen dan apresiasi: "I will be on time." lalu "Thanks for adjusting the schedule."',
    ],
    pronunciationNotes: [
      'Pada "cannot", beri tekanan jelas agar lawan bicara menangkap bahwa kamu tidak bisa hadir pada slot awal.',
      'Pada "two o\'clock", ucapkan angka dan waktu secara stabil supaya tidak tertukar dengan jam lain.',
      'Pada kalimat penutup "Thanks for adjusting the schedule.", gunakan intonasi hangat agar terdengar menghargai.',
    ],
    commonMistakes: [
      {
        mistake: 'Langsung membatalkan tanpa menawarkan waktu pengganti.',
        correction: 'Setelah menyatakan kendala, beri opsi: "Could we move it to two o\'clock?"',
      },
      {
        mistake: 'Mengusulkan hari baru tanpa mengecek ketersediaan lawan bicara.',
        correction: 'Gunakan pertanyaan sopan: "Is Wednesday possible for you?"',
      },
      {
        mistake: 'Setelah jadwal baru disepakati, tidak memberi komitmen hadir.',
        correction: 'Tegaskan dengan "I will be on time." dan tutup dengan apresiasi.',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Same-day Reschedule',
        partnerRole: 'teman latihan',
        mission:
          'Partner menanyakan jadwal awal. Sampaikan kamu tidak bisa hadir, tawarkan jam pengganti, lalu tutup dengan ucapan terima kasih.',
      },
      {
        title: 'Scenario B - Change to Another Day',
        partnerRole: 'teman latihan',
        mission:
          'Partner tidak tersedia di hari awal. Tawarkan hari lain, konfirmasi jadwal baru, lalu tutup dengan komitmen tepat waktu.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Are we still meeting at ten?',
        'You: Sorry, I cannot come at ten.',
        'Partner: No problem. What time works?',
        'You: Could we move it to two o\'clock?',
        'Partner: Yes, two o\'clock is fine.',
        'You: Thanks for adjusting the schedule.',
      ),
      dialog(
        'Partner: Tuesday is full.',
        'You: Is Wednesday possible for you?',
        'Partner: Yes, Wednesday at ten is available.',
        'You: I will be on time.',
        'Partner: Great, see you on Wednesday.',
        'You: Thanks for adjusting the schedule.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Kita masih jadi ketemu jam sepuluh?',
        'Maaf, saya tidak bisa datang jam sepuluh.',
        'Tidak masalah. Jam berapa yang cocok?',
        'Bisa kita geser ke jam dua?',
        'Ya, jam dua cocok.',
        'Terima kasih sudah menyesuaikan jadwal.',
      ),
      dialog(
        'Selasa sudah penuh.',
        'Apakah hari Rabu memungkinkan untuk Anda?',
        'Ya, Rabu jam sepuluh tersedia.',
        'Saya akan datang tepat waktu.',
        'Baik, sampai ketemu hari Rabu.',
        'Terima kasih sudah menyesuaikan jadwal.',
      ),
    ],
  },
'cefr-a1-2-g10': {
    goalSnapshot:
      'Goal ini melatih kamu menanyakan informasi transportasi dasar sebelum berangkat. Fokusnya adalah mencari tiket, mengecek jadwal, memastikan rute bus, lalu mengonfirmasi titik tunggu yang benar.',
    whyThisMatters:
      'Saat bepergian di tempat baru, salah informasi transport bisa bikin terlambat atau salah tujuan. Dengan urutan pertanyaan yang tepat, kamu bisa memilih bus dengan yakin dan lebih efisien.',
    situationBreakdown: [
      'Open: mulai dari kebutuhan inti tiket dengan "Where can I get a bus ticket?"',
      'Clarify: lanjutkan cek jadwal "What time is the next bus?" dan cek rute "Does this bus go to the station?"',
      'Close: pastikan posisi menunggu dengan "Should I wait here?" lalu tutup keputusan: "Thanks, I will take this bus."',
    ],
    pronunciationNotes: [
      'Pada "ticket", ucapkan konsonan akhir dengan jelas agar kata kunci layanan terdengar tegas.',
      'Pada "station", tekan suku kata pertama (STA-tion) supaya tujuan perjalanan tidak rancu.',
      'Pada "Should I wait here?", jaga intonasi naik di akhir untuk menandai pertanyaan konfirmasi.',
    ],
    commonMistakes: [
      {
        mistake: 'Menanyakan jadwal tanpa memastikan bus menuju tujuan yang benar.',
        correction: 'Tambahkan cek rute: "Does this bus go to the station?"',
      },
      {
        mistake: 'Sudah tahu rute tetapi tidak menanyakan titik tunggu yang tepat.',
        correction: 'Pastikan dengan "Should I wait here?"',
      },
      {
        mistake: 'Menutup percakapan tanpa keputusan transport yang jelas.',
        correction: 'Akhiri dengan "Thanks, I will take this bus."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Ticket and Schedule Check',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi informasi loket dan jadwal. Tanyakan tiket, jadwal bus berikutnya, lalu tutup dengan keputusan naik bus.',
      },
      {
        title: 'Scenario B - Route and Stop Confirmation',
        partnerRole: 'teman latihan',
        mission:
          'Partner memberi info bus yang datang. Konfirmasi bus menuju stasiun, cek titik tunggu, lalu tutup dengan keputusan jelas.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: Hello.',
        'You: Where can I get a bus ticket?',
        'Partner: At counter three.',
        'You: What time is the next bus?',
        'Partner: At 3:15 PM.',
        'You: Thanks, I will take this bus.',
      ),
      dialog(
        'Partner: Bus 12 is arriving now.',
        'You: Does this bus go to the station?',
        'Partner: Yes, it does.',
        'You: Should I wait here?',
        'Partner: Yes, this is the correct stop.',
        'You: Thanks, I will take this bus.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Halo.',
        'Di mana saya bisa beli tiket bus?',
        'Di loket tiga.',
        'Jam berapa bus berikutnya?',
        'Jam 3:15 sore.',
        'Terima kasih, saya akan naik bus ini.',
      ),
      dialog(
        'Bus 12 akan datang sekarang.',
        'Apakah bus ini ke stasiun?',
        'Ya, bus ini ke stasiun.',
        'Apakah saya tunggu di sini?',
        'Ya, ini halte yang benar.',
        'Terima kasih, saya akan naik bus ini.',
      ),
    ],
  },
'cefr-a1-2-g11': {
    goalSnapshot:
      'Goal ini melatih kamu menawarkan bantuan sederhana kepada orang lain secara sopan dan praktis. Fokusnya adalah menawarkan bantuan, melakukan aksi bantu, mengecek kenyamanan lawan bicara, lalu menutup dengan ramah.',
    whyThisMatters:
      'Dalam interaksi harian, kemampuan menawarkan bantuan membuat komunikasi terasa hangat dan kolaboratif. Dengan kalimat offer-help yang jelas, kamu bisa membantu tanpa terdengar memaksa.',
    situationBreakdown: [
      'Open: mulai dengan menawarkan bantuan menggunakan "Do you need help?"',
      'Clarify: lanjutkan aksi konkret seperti "I can carry that for you." atau "Can I help you fill this form?" lalu cek kenyamanan: "Is this okay for you?"',
      'Close: setelah bantuan diterima, tutup dengan respons sopan: "You are welcome."',
    ],
    pronunciationNotes: [
      'Pada "help", pastikan bunyi /p/ di akhir tetap terdengar agar kata tidak terdengar kabur.',
      'Pada "carry", tekanan ada di suku kata pertama (CAR-ry) supaya natural.',
      'Pada "welcome", jaga ritme dua suku kata agar penutupan terdengar hangat dan tidak terburu-buru.',
    ],
    commonMistakes: [
      {
        mistake: 'Menawarkan bantuan terlalu langsung tanpa menanyakan kebutuhan orang dulu.',
        correction: 'Mulai dengan pertanyaan sopan: "Do you need help?"',
      },
      {
        mistake: 'Menawarkan bantuan umum tanpa aksi konkret.',
        correction: 'Sebutkan bantuan spesifik: "I can carry that for you."',
      },
      {
        mistake: 'Tidak mengecek apakah bantuan yang diberikan sudah sesuai.',
        correction: 'Tambahkan cek: "Is this okay for you?"',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Offer Physical Help',
        partnerRole: 'teman latihan',
        mission:
          'Partner membawa barang dan terlihat kesulitan. Tawarkan bantuan, lakukan aksi bantu yang jelas, lalu tutup dengan respons ramah.',
      },
      {
        title: 'Scenario B - Offer Form-filling Help',
        partnerRole: 'teman latihan',
        mission:
          'Partner kesulitan mengisi formulir. Tawarkan bantuan isi form, cek apakah cara bantu kamu cocok, lalu tutup dengan sopan.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: I dropped my books.',
        'You: Do you need help?',
        'Partner: Yes, please.',
        'You: I can carry that for you.',
        'Partner: Thank you.',
        'You: You are welcome.',
      ),
      dialog(
        'Partner: I cannot complete this form.',
        'You: Can I help you fill this form?',
        'Partner: Yes, please.',
        'You: Is this okay for you?',
        'Partner: Yes, this is perfect.',
        'You: You are welcome.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Buku saya jatuh.',
        'Kamu butuh bantuan?',
        'Ya, tolong.',
        'Saya bisa bawakan itu untukmu.',
        'Terima kasih.',
        'Sama-sama.',
      ),
      dialog(
        'Saya tidak bisa menyelesaikan formulir ini.',
        'Boleh saya bantu isi formulir ini?',
        'Ya, tolong.',
        'Apakah ini sudah cocok untuk kamu?',
        'Ya, ini pas sekali.',
        'Sama-sama.',
      ),
    ],
  },
'cefr-a1-2-g12': {
    goalSnapshot:
      'Goal ini melatih kamu meminta tolong untuk tugas kecil yang belum kamu kuasai. Fokusnya adalah meminta bantuan spesifik, meminta demonstrasi langkah, lalu menutup dengan konfirmasi bahwa kamu sudah bisa melanjutkan sendiri.',
    whyThisMatters:
      'Dalam tugas harian, meminta bantuan dengan jelas lebih efektif daripada diam saat bingung. Dengan pola request -> show -> try together, kamu bisa belajar cepat tanpa membuat interaksi jadi canggung.',
    situationBreakdown: [
      'Open: mulai dari permintaan bantuan spesifik, misalnya "Could you open this for me?"',
      'Clarify: lanjutkan minta panduan dengan "Can you show me how to do it?" dan jelaskan kendala: "I do not know this step yet."',
      'Close: jika masih ragu, minta praktik bersama: "Could we do it together once?" lalu tutup dengan "Thanks, I can do it now."',
    ],
    pronunciationNotes: [
      'Pada "Could you", ucapkan secara halus agar permintaan terdengar sopan dan natural.',
      'Pada "step yet", pastikan bunyi akhir /t/ di "yet" tetap terdengar agar makna kalimat jelas.',
      'Pada kalimat penutup "Thanks, I can do it now.", turunkan intonasi di akhir untuk menandai kepercayaan diri.',
    ],
    commonMistakes: [
      {
        mistake: 'Meminta bantuan terlalu umum tanpa menyebut aksi yang dibutuhkan.',
        correction: 'Mulai dengan request spesifik: "Could you open this for me?"',
      },
      {
        mistake: 'Sudah dibantu sekali tetapi tidak minta penjelasan langkah kerja.',
        correction: 'Tambahkan: "Can you show me how to do it?"',
      },
      {
        mistake: 'Setelah dibantu, tidak menutup dengan sinyal bahwa kamu sudah paham.',
        correction: 'Tutup dengan "Thanks, I can do it now."',
      },
    ],
    roleplayScenarios: [
      {
        title: 'Scenario A - Ask for Step Demonstration',
        partnerRole: 'teman latihan',
        mission:
          'Partner melihat kamu kesulitan dengan tugas kecil. Minta bantuan spesifik, minta ditunjukkan caranya, lalu tutup saat kamu sudah paham.',
      },
      {
        title: 'Scenario B - Practice Together Once',
        partnerRole: 'teman latihan',
        mission:
          'Partner meminta kamu mencoba sendiri, tapi kamu masih bingung. Jelaskan kendala, minta latihan bersama satu kali, lalu tutup dengan konfirmasi bisa lanjut.',
      },
    ],
    roleplayExamples: [
      dialog(
        'Partner: You seem stuck.',
        'You: Could you open this for me?',
        'Partner: Sure, I can do that.',
        'You: Can you show me how to do it?',
        'Partner: Yes, watch this step.',
        'You: Thanks, I can do it now.',
      ),
      dialog(
        'Partner: Try it now.',
        'You: I do not know this step yet.',
        'Partner: No problem.',
        'You: Could we do it together once?',
        'Partner: Of course, follow me.',
        'You: Thanks, I can do it now.',
      ),
    ],
    roleplayExamplesId: [
      dialog(
        'Kamu terlihat kesulitan.',
        'Bisa tolong bukakan ini untuk saya?',
        'Tentu, bisa saya bantu.',
        'Bisa tunjukkan bagaimana caranya?',
        'Ya, lihat langkah ini.',
        'Terima kasih, sekarang saya sudah bisa.',
      ),
      dialog(
        'Coba sekarang.',
        'Saya belum paham langkah ini.',
        'Tidak masalah.',
        'Boleh kita lakukan bersama sekali?',
        'Tentu, ikuti saya.',
        'Terima kasih, sekarang saya sudah bisa.',
      ),
    ],
  }
};
