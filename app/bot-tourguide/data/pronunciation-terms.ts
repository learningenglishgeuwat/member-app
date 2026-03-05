export type PronunciationTermSeed = {
  id: string;
  term: string;
  aliases: string[];
  definitionId: string;
  coachingTipId?: string;
  exampleEn?: string;
  exampleTranslationId?: string;
  route?: string;
};

export const PRONUNCIATION_TERM_SEEDS: PronunciationTermSeed[] = [
  {
    id: 'pronunciation',
    term: 'pronunciation',
    aliases: ['pelafalan', 'ucapan english', 'cara baca english'],
    definitionId:
      'cara mengucapkan kata atau kalimat supaya bunyinya jelas, natural, dan mudah dipahami.',
    coachingTipId:
      'Mulai dari bunyi kata kunci dulu, lalu lanjut ke ritme dan intonasi dalam kalimat pendek.',
    route: '/skill/pronunciation',
  },
  {
    id: 'ipa',
    term: 'IPA',
    aliases: ['international phonetic alphabet', 'simbol ipa', 'fonetik'],
    definitionId:
      'sistem simbol bunyi untuk menunjukkan cara baca yang lebih akurat daripada ejaan biasa.',
    coachingTipId: 'Baca IPA sedikit-sedikit: fokuskan 1 simbol, dengar audio, lalu tirukan 3 kali.',
    route: '/skill/pronunciation/phoneticSymbols',
  },
  {
    id: 'phonetic-symbols',
    term: 'phonetic symbols',
    aliases: ['simbol fonetik', 'symbol pronunciation', 'phonetics symbol'],
    definitionId:
      'kumpulan simbol bunyi vokal dan konsonan yang dipakai untuk memetakan pengucapan.',
    coachingTipId: 'Jangan hafal sekaligus. Latih per kelompok: vowels dulu, baru consonants.',
    route: '/skill/pronunciation/phoneticSymbols',
  },
  {
    id: 'vowel',
    term: 'vowel',
    aliases: ['vowels', 'bunyi vokal'],
    definitionId: 'bunyi yang keluar tanpa hambatan utama di aliran udara, seperti /i/ atau /ae/.',
    coachingTipId:
      'Perhatikan posisi rahang dan bibir karena perubahan kecil bisa mengubah arti kata.',
    route: '/skill/pronunciation/phoneticSymbols',
  },
  {
    id: 'consonant',
    term: 'consonant',
    aliases: ['consonants', 'bunyi konsonan'],
    definitionId:
      'bunyi yang terbentuk dengan penutupan atau gesekan di bibir, gigi, lidah, atau tenggorokan.',
    coachingTipId: 'Latih pasangan minimal pair supaya telinga peka ke perbedaan bunyi tipis.',
    route: '/skill/pronunciation/phoneticSymbols',
  },
  {
    id: 'diphthong',
    term: 'diphthong',
    aliases: ['diftong', 'vokal rangkap', 'glide vowel'],
    definitionId:
      'bunyi vokal yang bergerak dari satu posisi ke posisi lain dalam satu suku kata, seperti /eI/.',
    coachingTipId: 'Jaga geraknya halus, jangan dipotong jadi dua vokal terpisah.',
    route: '/skill/pronunciation/phoneticSymbols',
  },
  {
    id: 'schwa',
    term: 'schwa',
    aliases: ['/ə/', 'vokal lemah', 'suara lemah'],
    definitionId:
      'bunyi vokal netral /ə/ yang sering muncul pada suku kata tidak bertekanan di speech natural.',
    coachingTipId:
      'Kalau semua suku kata kamu tekan kuat, ritme kalimat jadi kaku. Schwa membantu kalimat lebih natural.',
    route: '/skill/pronunciation/phoneticSymbols',
  },
  {
    id: 'word-stress',
    term: 'word stress',
    aliases: ['stressing', 'tekanan kata', 'stress kata'],
    definitionId:
      'tekanan utama pada satu suku kata dalam sebuah kata, misalnya RE-cord vs re-CORD.',
    coachingTipId: 'Cek suku kata yang paling kuat lalu tirukan dengan ketukan tangan.',
    route: '/skill/pronunciation/stressing',
  },
  {
    id: 'sentence-stress',
    term: 'sentence stress',
    aliases: ['stress kalimat', 'tekanan kalimat'],
    definitionId:
      'pola kata mana yang diberi tekanan dalam kalimat untuk membawa informasi utama.',
    coachingTipId:
      'Utamakan content words (kata isi) lalu ringankan function words untuk ritme natural.',
    route: '/skill/pronunciation/intonation',
  },
  {
    id: 'intonation',
    term: 'intonation',
    aliases: ['intonasi', 'nada kalimat'],
    definitionId:
      'naik-turun nada suara dalam kalimat yang menunjukkan maksud, sikap, dan jenis pesan.',
    coachingTipId:
      'Rekam pertanyaan dan pernyataanmu, lalu cek apakah pola naik/turunnya sudah konsisten.',
    route: '/skill/pronunciation/intonation',
  },
  {
    id: 'rising-intonation',
    term: 'rising intonation',
    aliases: ['intonasi naik', 'nada naik'],
    definitionId:
      'pola nada yang naik di bagian akhir, sering dipakai untuk yes/no question atau klarifikasi.',
    coachingTipId: 'Naikkan nada di kata akhir, bukan menekan semua kata di kalimat.',
    route: '/skill/pronunciation/intonation',
  },
  {
    id: 'falling-intonation',
    term: 'falling intonation',
    aliases: ['intonasi turun', 'nada turun'],
    definitionId:
      'pola nada yang turun di akhir, umum untuk pernyataan, perintah, dan wh-question.',
    coachingTipId: 'Jatuhkan nada dengan tegas di akhir supaya terdengar selesai dan jelas.',
    route: '/skill/pronunciation/intonation',
  },
  {
    id: 'rhythm',
    term: 'rhythm',
    aliases: ['ritme', 'irama bicara', 'speech rhythm'],
    definitionId:
      'pola ketukan dalam ucapan yang dibentuk oleh stress, weak forms, dan jeda antarchunk.',
    coachingTipId: 'Latih kalimat pendek dengan metronom lambat agar ritme lebih stabil.',
    route: '/skill/pronunciation/text',
  },
  {
    id: 'chunking',
    term: 'chunking',
    aliases: ['thought group', 'frasa ucapan', 'penggalan kalimat'],
    definitionId:
      'cara memecah kalimat panjang menjadi potongan makna pendek agar lebih mudah dipahami.',
    coachingTipId: 'Tambah jeda mikro antar-chunk, jangan berhenti di tengah frasa makna.',
    route: '/skill/pronunciation/intonation',
  },
  {
    id: 'final-sound',
    term: 'final sound',
    aliases: [
      'bunyi akhir',
      'ending sound',
      'final consonant',
      'final sound pronunciation',
      'final sound rules',
    ],
    definitionId:
      'bunyi di akhir kata yang memengaruhi kelancaran dan kejelasan saat kata disambung ke kata berikutnya.',
    coachingTipId:
      'Fokuskan akhir kata dulu sebelum mempercepat tempo supaya kata tidak hilang.',
    route: '/skill/pronunciation/final-sound-new',
  },
  {
    id: 's-es-ending',
    term: 'final sound s/es',
    aliases: [
      's es ending',
      '-s',
      '-es',
      'plural s',
      'third person s',
      's/es',
      'final sound s es',
      'final sound s',
      'final sound es',
    ],
    definitionId:
      'akhiran -s/-es yang dibaca /s/, /z/, atau /Iz/ tergantung bunyi akhir kata dasarnya.',
    coachingTipId: 'Dengar bunyi akhir kata dasar dulu, baru pilih ending sound yang tepat.',
    route: '/skill/pronunciation/final-sound-new/s/es',
  },
  {
    id: 'ed-ending',
    term: 'final sound d/ed',
    aliases: [
      'ed ending',
      '-ed',
      'past ending',
      'd ed ending',
      'd/ed',
      'final sound ed',
      'final sound d ed',
    ],
    definitionId:
      'akhiran -ed pada past tense yang dibaca /t/, /d/, atau /Id/ sesuai bunyi akhir kata kerja dasar.',
    coachingTipId: 'Pisahkan latihan berdasarkan tiga pola bunyi supaya tidak tertukar.',
    route: '/skill/pronunciation/final-sound-new/d/ed',
  },
  {
    id: 'american-t',
    term: 'american t',
    aliases: ['american /t/', 't amerika', 't american', 'american t pattern'],
    definitionId:
      'variasi bunyi /t/ dalam American English, bisa menjadi released t, flap, glottal, atau unreleased.',
    coachingTipId: 'Tentukan dulu posisi /t/ di kata atau batas kata sebelum memutuskan cara bunyinya.',
    route: '/skill/pronunciation/american-t',
  },
  {
    id: 'american-t-beginning',
    term: 'american t beginning',
    aliases: ['t di awal kata', 'beginning t', 'initial t'],
    definitionId:
      'pola /t/ di awal kata yang umumnya terdengar clear atau released supaya bunyinya tetap tegas.',
    coachingTipId:
      'Latih kata pendek satu per satu, pastikan /t/ awal terdengar bersih sebelum lanjut ke frasa.',
    route: '/skill/pronunciation/american-t/beginning/clear-t',
  },
  {
    id: 'american-t-middle',
    term: 'american t middle',
    aliases: ['t di tengah kata', 'middle t'],
    definitionId:
      'pola /t/ di tengah kata yang bisa berubah menjadi flap, glottal, atau bahkan tidak terdengar pada beberapa kata.',
    coachingTipId:
      'Cek lingkungan bunyi sebelum dan sesudah /t/ karena itu penentu utama perubahan bunyinya.',
    route: '/skill/pronunciation/american-t/middle/flap',
  },
  {
    id: 'american-t-ending',
    term: 'american t ending',
    aliases: ['t di akhir kata', 'ending t', 'final t sound'],
    definitionId:
      'pola /t/ di akhir kata yang bisa released atau unreleased tergantung bunyi setelahnya.',
    coachingTipId:
      'Jangan langsung membunyikan /t/ keras setiap saat; sesuaikan dengan kata berikutnya.',
    route: '/skill/pronunciation/american-t/ending/final-t',
  },
  {
    id: 'flap-t',
    term: 'flap t',
    aliases: ['flap', 't flap', '/ɾ/', 't between vowels', 'flap sound'],
    definitionId:
      'bunyi /t/ yang berubah jadi ketukan cepat /ɾ/, biasanya di tengah kata pada speech kasual American English.',
    coachingTipId: 'Jangan letupkan /t/ keras. Sentuh cepat lalu lanjut ke vokal berikutnya.',
    exampleEn: 'water',
    exampleTranslationId: 'contoh kata dengan flap t yang sangat umum.',
    route: '/skill/pronunciation/american-t/middle/flap',
  },
  {
    id: 'glottal-stop',
    term: 'glottal stop',
    aliases: ['glottal', 'glotal', '/ʔ/', 't stop', 'middle glottal'],
    definitionId:
      'hentian suara singkat di tenggorokan /ʔ/ yang kadang menggantikan /t/ pada konteks tertentu.',
    coachingTipId: 'Bayangkan ada jeda mikro sebelum bunyi berikutnya, bukan /t/ letup penuh.',
    route: '/skill/pronunciation/american-t/middle/glottal',
  },
  {
    id: 'unreleased-t',
    term: 'unreleased t',
    aliases: ['t unreleased', '/t̚/', 'final t stop'],
    definitionId:
      'bunyi /t/ yang ditutup tetapi tidak dilepas penuh, sering muncul saat /t/ bertemu konsonan berikutnya.',
    coachingTipId: 'Tahan ujung lidah sejenak lalu langsung pindah ke konsonan berikutnya.',
    route: '/skill/pronunciation/american-t/ending/final-t',
  },
  {
    id: 'clear-t',
    term: 'released t',
    aliases: ['clear t', 't jelas', 't release', 'clear t beginning', 'released t beginning'],
    definitionId:
      'bunyi /t/ yang diucapkan jelas dengan pelepasan udara, biasanya di awal kata atau saat penekanan.',
    coachingTipId: 'Jaga pelepasan singkat dan bersih, jangan berlebihan sampai terdengar tegang.',
    route: '/skill/pronunciation/american-t/beginning/clear-t',
  },
  {
    id: 'released-t-ending',
    term: 'released t ending',
    aliases: ['clear t ending', 'ending clear t', 'final released t', 'released ending'],
    definitionId:
      'pola /t/ akhir kata yang tetap dilepas jelas ketika transisinya cocok, terutama sebelum bunyi vokal.',
    coachingTipId:
      'Latih transisi akhir /t/ ke vokal berikutnya supaya tetap jelas tapi tidak terdengar kaku.',
    route: '/skill/pronunciation/american-t/ending/clear-t-ending',
  },
  {
    id: 'final-t-before-consonant',
    term: 'final t before consonant',
    aliases: ['final t consonant', 't before consonant', 'final t cluster'],
    definitionId:
      'kondisi saat /t/ di akhir kata bertemu konsonan berikutnya, sehingga sering terdengar unreleased.',
    coachingTipId:
      'Tahan penutupan /t/ sebentar lalu pindah cepat ke konsonan selanjutnya tanpa letupan keras.',
    route: '/skill/pronunciation/american-t/ending/final-t',
  },
  {
    id: 'silent-t',
    term: 'silent t',
    aliases: ['t silent', 't tidak dibaca', 'middle silent t'],
    definitionId:
      'huruf t yang tidak terdengar pada beberapa kata tertentu karena konvensi pengucapan.',
    coachingTipId: 'Hafalkan lewat daftar kata umum agar otomatis saat speaking cepat.',
    route: '/skill/pronunciation/american-t/middle/silent-t',
  },
  {
    id: 'minimal-pairs',
    term: 'minimal pairs',
    aliases: ['pasangan minimal', 'minimal pair'],
    definitionId:
      'pasangan kata yang beda satu bunyi saja untuk melatih ketelitian pendengaran dan pengucapan.',
    coachingTipId: 'Latih berpasangan A-B-A-B sambil rekam suara agar selisih bunyinya terdengar jelas.',
    route: '/skill/pronunciation/phoneticSymbols/MinimalPairs',
  },
  {
    id: 'tongue-twister',
    term: 'tongue twister',
    aliases: ['latihan lidah', 'twister pronunciation'],
    definitionId:
      'kalimat latihan dengan pola bunyi berulang untuk melatih artikulasi dan kelincahan bicara.',
    coachingTipId: 'Mulai lambat, utamakan akurasi bunyi, baru naikkan kecepatan.',
    route: '/skill/pronunciation/phoneticSymbols/tongue-twister',
  },
];
