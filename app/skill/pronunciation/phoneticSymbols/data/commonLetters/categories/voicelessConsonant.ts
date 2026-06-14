import type { CommonLetter } from '../types';

export const voicelessConsonantLetters: CommonLetter[] = [
  {
    // Bunyi /p/ - Kelompok Huruf Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'p, pp, -pe, pr-, sp-',
    ipaSymbol: '/p/',
    description: 'Pola umum bunyi /p/:',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'p -> map, open, pen',
      'pp -> apple, happy, support',
      // 2. Imbuhan / Akhiran Kata
      '-pe -> hope, shape, tape',
      'pr- -> present, price, prize',
      'sp- -> space, speak, sport',
    ],
    category: 'consonant_voiceless',
    pronunciationTip: 'Letupan bibir (bilabial stop) tanpa getaran pita suara.',
    traps: ['psychology', 'pneumonia', 'receipt', 'coup', 'raspberry'],
  },
  {
    // Bunyi /t/ - Kelompok Huruf Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'bt, pt, st, t, tt, -ed, -ght, -te, -tte, th-, tr-',
    ipaSymbol: '/t/',
    description: 'Pola umum bunyi /t/:',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'bt -> debt, doubt, subtle',
      'pt -> pterodactyl, ptomaine, receipt',
      'st -> best, fast, stop',
      't -> city, tea, top',
      'tt -> bottle, little, matter',
      // 2. Imbuhan / Akhiran Kata
      '-ed -> looked, watched, worked',
      '-ght -> bright, night, thought',
      '-te -> bite, late, note',
      '-tte -> baguette, cassette, cigarette',
      'th- -> Thames, Thomas, thyme',
      'tr- -> train, tree, try',
    ],
    category: 'consonant_voiceless',
    pronunciationTip: 'Ujung lidah menempel pada alveolar ridge tanpa getaran.',
    traps: ['listen', 'castle', 'whistle', 'often', 'ballet'],
  },
  {
    // Bunyi /k/ - Kelompok Huruf Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'c, cc, ch, cqu, k, qu, sch, -ck, -ke, -lk, -que, -x',
    ipaSymbol: '/k/',
    description: 'Pola paling produktif untuk /k/ (termasuk kata serapan Yunani):',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'c -> cat, class, cold',
      'cc -> account, accurate, soccer',
      'ch -> character, chemistry, chorus',
      'cqu -> acquaint, acquire, acquit',
      'k -> key, kind, skin',
      'qu -> bouquet, conquer, equal',
      'sch -> scheme, scholar, school',
      // 2. Imbuhan / Akhiran Kata
      '-ck -> back, black, clock',
      '-ke -> bike, make, spoke',
      '-lk -> chalk, talk, walk',
      '-que -> antique, technique, unique',
      '-x -> box, fox, six',
    ],
    category: 'consonant_voiceless',
    pronunciationTip: 'Letupan belakang lidah pada langit-langit lunak (velar stop), tanpa getaran.',
    traps: ['know', 'knife', 'knee', 'choir', 'chef'],
  },
  {
    // Bunyi /f/ - Kelompok Huruf Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'f, ff, ph, -fe, -ft, -gh, -lf, -ph',
    ipaSymbol: '/f/',
    description: 'Pola umum bunyi /f/:',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'f -> fan, life, office',
      'ff -> coffee, different, traffic',
      'ph -> phone, photo, phrase',
      // 2. Imbuhan / Akhiran Kata
      '-fe -> knife, life, safe',
      '-ft -> after, gift, left',
      '-gh -> cough, laugh, rough',
      '-lf -> behalf, calf, half',
      '-ph -> graph, paragraph, triumph',
    ],
    category: 'consonant_voiceless',
    pronunciationTip: 'Gesekan gigi depan atas dengan bibir bawah bagian dalam (labiodental fricative), unvoiced.',
    traps: ['of', 'Stephen'],
  },
  {
    // Bunyi /θ/ - Kelompok Huruf Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'th, -th, -th-, -ths, thr-',
    ipaSymbol: '/\u03b8/',
    description: 'Pola utama untuk voiceless th (/θ/):',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'th -> thank, theory, think',
      // 2. Imbuhan / Akhiran Kata
      '-th -> math, path, tooth',
      '-th- -> athlete, method, python',
      '-ths -> months, myths, paths',
      'thr- -> three, throat, throw',
    ],
    category: 'consonant_voiceless',
    pronunciationTip: 'Ujung lidah diletakkan di antara gigi depan (dental fricative), hembuskan udara keluar dengan lembut tanpa suara.',
    traps: ['this', 'that', 'they', 'mother', 'breathe'],
  },
  {
    // Bunyi /s/ - Kelompok Huruf Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'c, cc, s, sc, ss, st, tz, -ce, -cy, -se, -x, ps-',
    ipaSymbol: '/s/',
    description: 'Pola umum bunyi /s/:',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'c -> center, city, face',
      'cc -> accent, accept, success',
      's -> bus, see, sun',
      'sc -> scene, scent, science',
      'ss -> class, lesson, message',
      'st -> castle, listen, whistle',
      'tz -> pretzel, quartz, waltz',
      // 2. Imbuhan / Akhiran Kata
      '-ce -> dance, notice, place',
      '-cy -> fancy, mercy, privacy',
      '-se -> house, loose, mouse',
      '-x -> box, fox, six',
      'ps- -> psychic, pseudo, psychology',
    ],
    category: 'consonant_voiceless',
    pronunciationTip: 'Suara desis tajam (alveolar sibilant) tanpa melibatkan getaran pita suara.',
    traps: ['is', 'has', 'was', 'easy', 'sugar', 'island'],
  },
  {
    // Bunyi /ʃ/ - Kelompok Huruf Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'ch, ci, s, sc, sch, sh, si, ss, ti, xi, -cious, -ocean, -sure, -tian, -tial, -tious',
    ipaSymbol: '/\u0283/',
    description: 'Pola umum bunyi /ʃ/ (termasuk kata serapan Prancis):',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'ch -> brochure, chef, machine',
      'ci -> efficient, social, special',
      's -> insure, sugar, sure',
      'sc -> conscience, conscious, luscious',
      'sch -> schnapps, schnitzel, schwa',
      'sh -> fish, she, shop',
      'si -> expansion, mansion, tension',
      'ss -> mission, passion, pressure',
      'ti -> action, nation, patient',
      'xi -> anxious, noxious, obnoxious',
      // 2. Imbuhan / Akhiran Kata
      '-cious -> conscious, delicious, precious',
      '-ocean -> ocean, oceanic, oceanography',
      '-sure -> fissure, pressure, tonsure',
      '-tian -> Dalmatian, Martian, Venetian',
      '-tial -> essential, partial, potential',
      '-tious -> ambitious, cautious, infectious',
    ],
    category: 'consonant_voiceless',
    pronunciationTip: 'Desis lebih tebal dan dalam daripada /s/. Lidah ditarik sedikit lebih ke belakang (postalveolar) dengan bibir agak membulat.',
    traps: ['chair', 'choose', 'character', 'vision', 'measure'],
  },
  {
    // Bunyi /tʃ/ - Kelompok Huruf Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'c, ch, cz, sti, stion, tch, tu, -teous, -tual, -ture',
    ipaSymbol: '/\u02a7/',
    description: 'Pola umum bunyi /tʃ/:',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'c -> cello, ciao, concerto',
      'ch -> chair, chicken, teach',
      'cz -> Czech, Czechia, Czechoslovakian',
      'sti -> bestial, celestial, Christian',
      'stion -> digestion, question, suggestion',
      'tch -> catch, kitchen, watch',
      'tu -> future, nature, picture',
      // 2. Imbuhan / Akhiran Kata
      '-teous -> righteous',
      '-tual -> actual, mutual, virtual',
      '-ture -> adventure, culture, feature',
    ],
    category: 'consonant_voiceless',
    pronunciationTip: 'Bunyi gabungan (affricate): dimulai dengan menempelkan lidah seperti bunyi /t/, lalu dilepaskan langsung ke posisi desis /ʃ/.',
    traps: ['character', 'chemistry', 'chef', 'machine', 'czar'],
  },
  {
    // Bunyi /h/ - Kelompok Huruf Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'h, wh, h-',
    ipaSymbol: '/h/',
    description: 'Pola umum bunyi /h/:',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'h -> help, history, house',
      'wh -> who, whole, whom',
      // 2. Imbuhan / Akhiran Kata
      'h- -> anyhow, behave, behind',
    ],
    category: 'consonant_voiceless',
    pronunciationTip: 'Hembusan napas murni langsung dari celah pita suara (glottal fricative) tanpa hambatan lidah atau bibir.',
    traps: ['hour', 'honest', 'honor', 'ghost', 'shepherd', 'vehicle', 'exhaust'],
  },
];