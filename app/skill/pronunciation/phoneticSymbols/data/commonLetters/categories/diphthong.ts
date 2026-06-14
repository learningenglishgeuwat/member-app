import type { CommonLetter } from '../types';

export const diphthongLetters: CommonLetter[] = [
  {
    // Bunyi /aɪ/ - Huruf & Kombinasi Dasar (Semua A-Z karena tidak ada akhiran bermarkah -)
    letter: 'ei, i, i_e, ie, igh, ire, is, ui, uy, y, ye, yre',
    ipaSymbol: '/a\u026a/',
    description: 'Diftong naik dari /a/ ke /ɪ/ (dengan atau tanpa /r/ setelahnya):',
    examples: [
      'ei -> height, kaleidoscope, sleight',
      'i -> child, find, wild',
      'i_e -> bike, line, time',
      'ie -> lie, pie, tie',
      'igh -> light, night, right',
      'ire -> fire, hire, tire',
      'is -> aisle, island, isle',
      'ui -> disguise, guide, guile',
      'uy -> buy, buyer, guy',
      'y -> fly, my, try',
      'ye -> bye, dye, rye',
      'yre -> lyre, pyre',
    ],
    category: 'diphthong',
    pronunciationTip: 'Mulai dari /a/, lalu luncur halus ke /ɪ/ tanpa jeda. Untuk pola ire/yre: AmE adalah rhotic (bunyi /r/ jelas), BrE non-rhotic (jadi diftong /aɪə/).',
    traps: ['Untuk pola ire/yre: AmE mengucapkan /aɪr/ dengan /r/ jelas, BrE mengucapkan /aɪə/ (centering diphthong tanpa /r/).'],
  },
  {
    // Bunyi /eɪ/ - Kelompok Vokal Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'a, a_e, ai, ai_e, ay, ea, ei, ey, -ay, -et',
    ipaSymbol: '/e\u026a/',
    description: 'Diftong dari /e/ ke /ɪ/:',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'a -> baby, basic, paper',
      'a_e -> game, late, name',
      'ai -> rain, train, wait',
      'ai_e -> gaiter, praise, raise',
      'ay -> crayon, layer, payroll',
      'ea -> break, great, steak',
      'ei -> eight, neighbor, veil',
      'ey -> convey, obey, they',
      // 2. Imbuhan / Akhiran Kata
      '-ay -> day, play, stay',
      '-et -> ballet, bouquet, buffet',
    ],
    category: 'diphthong',
    pronunciationTip: 'Mulai /e/ yang bersih, lalu glide ke /ɪ/.',
  },
  {
    // Bunyi /ɔɪ/ - Kelompok Vokal Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'oi, oy, -oy',
    ipaSymbol: '/\u0254\u026a/',
    description: 'Diftong dari /ɔ/ ke /ɪ/:',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'oi -> choice, coin, join',
      'oy -> loyal, royal, voyage',
      // 2. Imbuhan / Akhiran Kata
      '-oy -> boy, enjoy, toy',
    ],
    category: 'diphthong',
    pronunciationTip: 'Mulai dengan bibir agak bulat, lalu akhiri ke /ɪ/.',
  },
  {
    // Bunyi /ɪr/ atau /ɪə/ - Kelompok Vokal Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'ear, er, ier, -ea, -eer, -ere',
    ipaSymbol: '/\u026ar/ or /\u026a\u0259/',
    description: 'Vokal /ɪ/ + konsonan /r/ (AmE rhotic) atau diftong /ɪə/ (BrE non-rhotic):',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'ear -> beard, clear, ear',
      'er -> criteria, imperial, inferior',
      'ier -> fierce, pier, tier',
      // 2. Imbuhan / Akhiran Kata
      '-ea -> idea',
      '-eer -> beer, career, deer',
      '-ere -> here, severe, sphere',
    ],
    category: 'diphthong',
    pronunciationTip: 'AmE: Vokal /ɪ/ langsung diikuti bunyi /r/ konsonan (/ɪr/). BrE: Diftong /ɪə/ centering diphthong (tanpa /r/).',
    traps: [
      'AmE adalah rhotic (bunyi /r/ jelas), BrE non-rhotic (jadi diftong /ɪə/).',
      'Banyak miskonsepsi bahwa bunyi ini berasal dari akhiran seperti -ial atau -ious, padahal bunyinya melekat pada kombinasi huruf "er" sebelum vokal tersebut.',
    ],
  },
  {
    // Bunyi /ɛr/ atau /eə/ - Kelompok Vokal Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'air, ar, ear, eir, -are, -ere',
    ipaSymbol: '/\u025br/ or /e\u0259/',
    description: 'Vokal /ɛ/ + konsonan /r/ (AmE rhotic) atau diftong /eə/ (BrE non-rhotic):',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'air -> air, chair, fair',
      'ar -> area, canary, parent',
      'ear -> bear, pear, swear',
      'eir -> heir, their, theirs',
      // 2. Imbuhan / Akhiran Kata
      '-are -> care, compare, dare',
      '-ere -> ere, there, where',
    ],
    category: 'diphthong',
    pronunciationTip: 'AmE: Vokal /ɛ/ langsung diikuti bunyi /r/ konsonan (/ɛr/). BrE: Diftong /eə/ centering diphthong (tanpa /r/).',
    traps: ['AmE adalah rhotic (bunyi /r/ jelas), BrE non-rhotic (jadi diftong /eə/).'],
  },
  {
    // Bunyi /ʊr/ atau /ʊə/ - Kelompok Vokal Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'our, ur, -oor, -ure',
    ipaSymbol: '/\u028ar/ or /\u028a\u0259/',
    description: 'Vokal /ʊ/ + konsonan /r/ (AmE rhotic) atau diftong /ʊə/ (BrE non-rhotic):',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'our -> contour, detour, tour',
      'ur -> during, jury, plural',
      // 2. Imbuhan / Akhiran Kata
      '-oor -> boor, moor, poor',
      '-ure -> cure, pure, secure',
    ],
    category: 'diphthong',
    pronunciationTip: 'AmE: Vokal /ʊ/ langsung diikuti bunyi /r/ konsonan (/ʊr/). BrE: Diftong /ʊə/ centering diphthong (tanpa /r/).',
    traps: ['AmE adalah rhotic (bunyi /r/ jelas), BrE non-rhotic (jadi diftong /ʊə/).', 'Banyak penutur AmE modern mengucapkan ini sebagai /ɔr/ (tour → /tɔr/).'],
  },
  {
    // Bunyi /oʊ/ - Kelompok Vokal Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'o, o_e, oa, ou, ow, -oe, -tough, -ow',
    ipaSymbol: '/o\u028a/',
    description: 'Diftong dari /o/ ke /ʊ/ (AmE) atau /ə/ ke /ʊ/ (BrE):',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'o -> focus, go, open',
      'o_e -> home, nose, stone',
      'oa -> boat, coat, road',
      'ou -> boulder, shoulder, soul',
      'ow -> blown, bowl, grown',
      // 2. Imbuhan / Akhiran Kata
      '-oe -> doe, foe, toe',
      '-ough -> although, dough, though',
      '-ow -> grow, slow, snow',
    ],
    category: 'diphthong',
    pronunciationTip: 'AmE: Dimulai dari /o/ dengan bibir agak bulat, glide halus ke /ʊ/ (/oʊ/). BrE: Dimulai dari schwa /ə/, lalu glide ke /ʊ/ (/əʊ/), lebih netral di awal.',
    traps: ['AmE menggunakan /oʊ/ (dimulai dari /o/), BrE menggunakan /əʊ/ (dimulai dari schwa).'],
  },
  {
    // Bunyi /aʊ/ - Kelompok Vokal Dasar (A-Z) lalu Akhiran/Imbuhan (A-Z)
    letter: 'ou, ough, our, owe, -ow, -own',
    ipaSymbol: '/a\u028a/',
    description: 'Diftong dari /a/ ke /ʊ/ (dengan atau tanpa /r/ setelahnya):',
    examples: [
      // 1. Huruf & Kombinasi Dasar
      'ou -> found, house, out',
      'ough -> bough, slough',
      'our -> devour, flour, hour',
      'owe -> towel, trowel, vowel',
      // 2. Imbuhan / Akhiran Kata
      '-ow -> brow, how, now',
      '-own -> brown, clown, town',
    ],
    category: 'diphthong',
    pronunciationTip: 'Mulai /a/ terbuka, lalu glide cepat ke /ʊ/. Untuk pola our: AmE adalah rhotic (bunyi /r/ jelas sebagai /aʊr/), BrE non-rhotic (jadi diftong /aʊə/).',
    traps: ['Untuk pola our: AmE mengucapkan /aʊr/ dengan /r/ jelas, BrE mengucapkan /aʊə/ (centering diphthong tanpa /r/).'],
  },
];