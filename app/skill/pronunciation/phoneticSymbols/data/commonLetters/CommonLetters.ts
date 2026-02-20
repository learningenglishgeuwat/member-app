// Common Letters and their IPA pronunciations
// Data for the Book icon popup showing common letter-to-IPA mappings

export interface CommonLetter {
  letter: string;
  ipaSymbol: string;
  description: string;
  examples: string[];
  category: 'vowel' | 'tense_vowel' | 'diphthong' | 'consonant';
  pronunciationTip: string;
  traps?: string[];
}

export interface CommonLettersCategory {
  category: string;
  letters: CommonLetter[];
}

export const commonLettersData: CommonLettersCategory[] = [
  {
    category: 'VOWEL',
    letters: [
      {
        letter: 'u, o, ou',
        ipaSymbol: '/\u028c/',
        description: 'Huruf/pola yang sering menghasilkan bunyi ini:',
        examples: ['u -> cup, luck, bus', 'o -> love, money', 'ou -> country, young'],
        category: 'vowel',
        pronunciationTip: 'Buka rahang sedang, bibir netral. Jangan dibaca seperti /u/ Indonesia.',
        traps: ['Sering salah jadi /u/.']
      },
      {
        letter: 'i, y, ui',
        ipaSymbol: '/\u026a/',
        description: 'Huruf/pola yang sering menghasilkan bunyi ini:',
        examples: ['i -> sit, big, give', 'y -> gym, symbol', 'ui -> build'],
        category: 'vowel',
        pronunciationTip: 'Bunyi pendek dan rileks. Jangan dipanjangkan menjadi /i/.',
        traps: ['Jangan dipanjangkan seperti i panjang.']
      },
      {
        letter: 'oo, u, o',
        ipaSymbol: '/\u028a/',
        description: 'Huruf/pola yang sering menghasilkan bunyi ini:',
        examples: ['oo -> book, good', 'u -> put, full', 'o -> woman'],
        category: 'vowel',
        pronunciationTip: 'Bibir sedikit bulat, durasi pendek. Bedakan dari /u/ yang lebih panjang.',
        traps: ['Sering tertukar dengan /u/.']
      },
      {
        letter: 'e (short), ea, a',
        ipaSymbol: '/\u025b/',
        description: 'Huruf/pola yang sering menghasilkan bunyi ini:',
        examples: ['e -> bed, pen', 'ea -> head, bread', 'a -> many'],
        category: 'vowel',
        pronunciationTip: 'Rahang sedikit lebih terbuka dari /e/. Jangan naik ke /e\u026a/.',
        traps: ['Sering meluncur ke /e\u026a/.']
      },
      {
        letter: 'e (clean), e + consonant',
        ipaSymbol: '/e/',
        description: 'Pada beberapa materi EFL dipakai sebagai e murni:',
        examples: ['e -> get (versi pendek-e)', 'e -> set', 'e -> very (pelafalan hati-hati)'],
        category: 'vowel',
        pronunciationTip: 'Anggap ini e tunggal (tanpa glide). Tetap satu bunyi, jangan jadi /e\u026a/.',
        traps: ['Jangan otomatis dijadikan diftong /e\u026a/.']
      },
      {
        letter: 'a, e, o, u (unstressed)',
        ipaSymbol: '/\u0259/',
        description: 'Bunyi lemah yang sangat sering muncul:',
        examples: ['a -> about, ago', 'e -> problem, open', 'o -> police', 'u -> support'],
        category: 'vowel',
        pronunciationTip: 'Bunyi ringan/tak bertekanan. Lidah dan rahang rileks.',
        traps: ['Jangan diberi tekanan kuat.']
      },
      {
        letter: 'er, ir, ur, or (AmE)',
        ipaSymbol: '/\u025a/',
        description: 'Pola umum untuk r-colored schwa:',
        examples: ['er -> teacher', 'ir -> bird', 'ur -> turn', 'or -> word'],
        category: 'vowel',
        pronunciationTip: 'Gabungkan schwa dengan warna /r/ Amerika (tanpa trill).',
        traps: ['Jangan dibaca er keras ala Indonesia.']
      }
    ]
  },
  {
    category: 'TENSE VOWEL',
    letters: [
      {
        letter: 'a+r, o (AmE), au',
        ipaSymbol: '/\u0251/',
        description: 'Huruf/pola umum:',
        examples: ['a+r -> car, start', 'o (AmE) -> hot, not', 'au -> laugh'],
        category: 'tense_vowel',
        pronunciationTip: 'Rahang terbuka lebar, bibir netral. Jangan dibulatkan.'
      },
      {
        letter: 'ee, ea, i, y',
        ipaSymbol: '/i/',
        description: 'Huruf/pola umum:',
        examples: ['ee -> see', 'ea -> eat', 'i -> machine', 'y -> city'],
        category: 'tense_vowel',
        pronunciationTip: 'Lidah depan tinggi, bunyi lebih tegang dan cenderung panjang.'
      },
      {
        letter: 'oo, u+e, ew',
        ipaSymbol: '/u/',
        description: 'Huruf/pola umum:',
        examples: ['oo -> food', 'u+e -> rule', 'ew -> new'],
        category: 'tense_vowel',
        pronunciationTip: 'Bibir bulat rapat, durasi lebih panjang daripada /\u028a/.'
      },
      {
        letter: 'a',
        ipaSymbol: '/\u00e6/',
        description: 'Huruf/pola umum:',
        examples: ['a -> cat, man, black'],
        category: 'tense_vowel',
        pronunciationTip: 'Rahang turun cukup lebar. Jangan dipersempit jadi /e/.',
        traps: ['Sering salah jadi /e/.']
      },
      {
        letter: 'o+r, a+ll, au, aw',
        ipaSymbol: '/\u0254/',
        description: 'Huruf/pola umum:',
        examples: ['o+r -> for, more', 'a+ll -> call, wall', 'au/aw -> cause, saw'],
        category: 'tense_vowel',
        pronunciationTip: 'Bibir bulat ringan, posisi lidah belakang-menengah.'
      }
    ]
  },
  {
    category: 'DIPHTHONG',
    letters: [
      {
        letter: 'i+e, igh, y',
        ipaSymbol: '/a\u026a/',
        description: 'Pola umum:',
        examples: ['i+e -> time', 'igh -> light', 'y -> my'],
        category: 'diphthong',
        pronunciationTip: 'Mulai dari /a/ lalu meluncur ke /\u026a/ tanpa jeda.'
      },
      {
        letter: 'a+e, ai, ay, ei',
        ipaSymbol: '/e\u026a/',
        description: 'Pola umum:',
        examples: ['a+e -> name', 'ai/ay -> rain, day', 'ei -> eight'],
        category: 'diphthong',
        pronunciationTip: 'Mulai dari /e/, geser ke /\u026a/ secara halus.'
      },
      {
        letter: 'oi, oy',
        ipaSymbol: '/\u0254\u026a/',
        description: 'Pola umum:',
        examples: ['oi/oy -> coin, boy'],
        category: 'diphthong',
        pronunciationTip: 'Mulai dari /\u0254/ lalu luncur ke /\u026a/.'
      },
      {
        letter: 'ear, ere (variasi)',
        ipaSymbol: '/\u026a\u0259/',
        description: 'Pola umum:',
        examples: ['ear -> ear, here', 'ere -> fierce (variasi kamus)'],
        category: 'diphthong',
        pronunciationTip: 'Mulai /\u026a/ lalu relaks ke schwa /\u0259/.'
      },
      {
        letter: 'air, are, ear',
        ipaSymbol: '/e\u0259/',
        description: 'Pola umum:',
        examples: ['air -> air', 'are -> care', 'ear -> bear'],
        category: 'diphthong',
        pronunciationTip: 'Mulai /e/, akhir bunyi dibuat lebih netral /\u0259/.'
      },
      {
        letter: 'ure, our (sebagian kata)',
        ipaSymbol: '/\u028a\u0259/',
        description: 'Pola umum:',
        examples: ['ure -> pure', 'our -> tour (variasi)'],
        category: 'diphthong',
        pronunciationTip: 'Mulai dari /\u028a/, lalu netralkan ke /\u0259/.'
      },
      {
        letter: 'o+e, oa, ow',
        ipaSymbol: '/o\u028a/',
        description: 'Pola umum:',
        examples: ['o+e -> home', 'oa -> road', 'ow -> slow'],
        category: 'diphthong',
        pronunciationTip: 'Mulai /o/ lalu geser ke /\u028a/ (bibir tetap bulat).'
      },
      {
        letter: 'ou, ow',
        ipaSymbol: '/a\u028a/',
        description: 'Pola umum:',
        examples: ['ou -> out', 'ow -> now'],
        category: 'diphthong',
        pronunciationTip: 'Mulai /a/ lalu luncur ke /\u028a/ dalam satu napas.'
      }
    ]
  },
  {
    category: 'CONSONANT',
    letters: [
      {
        letter: 'p, pp',
        ipaSymbol: '/p/',
        description: 'Pola umum:',
        examples: ['p -> pen', 'pp -> happy'],
        category: 'consonant',
        pronunciationTip: 'Letupan bibir tanpa getaran suara.'
      },
      {
        letter: 'b, bb',
        ipaSymbol: '/b/',
        description: 'Pola umum:',
        examples: ['b -> big', 'bb -> rabbit'],
        category: 'consonant',
        pronunciationTip: 'Letupan bibir dengan getaran suara.'
      },
      {
        letter: 't, tt, ed',
        ipaSymbol: '/t/',
        description: 'Pola umum:',
        examples: ['t -> tea', 'tt -> little', 'ed -> looked'],
        category: 'consonant',
        pronunciationTip: 'Ujung lidah menyentuh gusi atas, tanpa getaran suara.'
      },
      {
        letter: 'd, dd, ed',
        ipaSymbol: '/d/',
        description: 'Pola umum:',
        examples: ['d -> dog', 'dd -> ladder', 'ed -> played'],
        category: 'consonant',
        pronunciationTip: 'Posisi sama seperti /t/ tetapi bersuara (voiced).'
      },
      {
        letter: 'k, c, ck, ch, q(u)',
        ipaSymbol: '/k/',
        description: 'Pola umum:',
        examples: ['k -> key', 'c -> cat', 'ck -> back', 'ch -> chorus', 'qu -> question'],
        category: 'consonant',
        pronunciationTip: 'Letupan dari belakang lidah, tanpa getaran suara.'
      },
      {
        letter: 'g, gg, gh (sebagian)',
        ipaSymbol: '/g/',
        description: 'Pola umum:',
        examples: ['g -> go', 'gg -> bigger', 'gh -> ghost'],
        category: 'consonant',
        pronunciationTip: 'Letupan belakang lidah dengan getaran suara.'
      },
      {
        letter: 'f, ff, ph',
        ipaSymbol: '/f/',
        description: 'Pola umum:',
        examples: ['f -> fan', 'ff -> coffee', 'ph -> phone'],
        category: 'consonant',
        pronunciationTip: 'Gesekan gigi atas dan bibir bawah, tanpa getaran.'
      },
      {
        letter: 'v, ve',
        ipaSymbol: '/v/',
        description: 'Pola umum:',
        examples: ['v -> very', 've -> save'],
        category: 'consonant',
        pronunciationTip: 'Posisi seperti /f/, tetapi harus ada getaran suara.',
        traps: ['Sering salah jadi /f/.']
      },
      {
        letter: 'th',
        ipaSymbol: '/\u03b8/',
        description: 'Pola umum:',
        examples: ['th -> think, math'],
        category: 'consonant',
        pronunciationTip: 'Ujung lidah di antara gigi, udara keluar lembut tanpa suara.',
        traps: ['Jangan dibaca /t/ atau /s/.']
      },
      {
        letter: 'th',
        ipaSymbol: '/\u00f0/',
        description: 'Pola umum:',
        examples: ['th -> this, mother'],
        category: 'consonant',
        pronunciationTip: 'Posisi sama seperti /\u03b8/, tetapi bersuara (voiced).',
        traps: ['Jangan dibaca /d/.']
      },
      {
        letter: 's, c, ss',
        ipaSymbol: '/s/',
        description: 'Pola umum:',
        examples: ['s -> see', 'c -> city', 'ss -> class'],
        category: 'consonant',
        pronunciationTip: 'Desis tajam tanpa getaran suara.'
      },
      {
        letter: 'z, s, zz, x',
        ipaSymbol: '/z/',
        description: 'Pola umum:',
        examples: ['z -> zoo', 's -> rose', 'zz -> buzz', 'x -> exam'],
        category: 'consonant',
        pronunciationTip: 'Desis bersuara. Cek getaran di tenggorokan.'
      },
      {
        letter: 'sh, ti, ci, ch',
        ipaSymbol: '/\u0283/',
        description: 'Pola umum:',
        examples: ['sh -> she', 'ti -> nation', 'ci -> special', 'ch -> machine'],
        category: 'consonant',
        pronunciationTip: 'Desis lebih tebal dari /s/, bibir sedikit membulat.'
      },
      {
        letter: 's, si, ge, z',
        ipaSymbol: '/\u0292/',
        description: 'Pola umum:',
        examples: ['s -> measure', 'si -> vision', 'ge -> beige', 'z -> seizure'],
        category: 'consonant',
        pronunciationTip: 'Mirip /\u0283/ tetapi bersuara (voiced).'
      },
      {
        letter: 'h, wh (sebagian)',
        ipaSymbol: '/h/',
        description: 'Pola umum:',
        examples: ['h -> house', 'wh -> who'],
        category: 'consonant',
        pronunciationTip: 'Hembusan napas halus, tanpa getaran suara.'
      },
      {
        letter: 'ch, tch, t+u',
        ipaSymbol: '/\u02a7/',
        description: 'Pola umum:',
        examples: ['ch -> chair', 'tch -> watch', 't+u -> future'],
        category: 'consonant',
        pronunciationTip: 'Gabungan letup + gesek (tanpa getaran).'
      },
      {
        letter: 'j, g+e/i/y, dge',
        ipaSymbol: '/\u02a4/',
        description: 'Pola umum:',
        examples: ['j -> job', 'g+e -> giant', 'dge -> bridge'],
        category: 'consonant',
        pronunciationTip: 'Mirip /\u02a7/ tetapi bersuara (voiced).'
      },
      {
        letter: 'm, mm',
        ipaSymbol: '/m/',
        description: 'Pola umum:',
        examples: ['m -> map', 'mm -> summer'],
        category: 'consonant',
        pronunciationTip: 'Bibir menutup, suara keluar lewat hidung.'
      },
      {
        letter: 'n, nn, kn (awal kata)',
        ipaSymbol: '/n/',
        description: 'Pola umum:',
        examples: ['n -> name', 'nn -> dinner', 'kn -> know'],
        category: 'consonant',
        pronunciationTip: 'Ujung lidah ke gusi atas, suara hidung.'
      },
      {
        letter: 'ng, n+k, n+g',
        ipaSymbol: '/\u014b/',
        description: 'Pola umum:',
        examples: ['ng -> sing', 'n+k -> think', 'n+g -> longer'],
        category: 'consonant',
        pronunciationTip: 'Belakang lidah naik, suara lewat hidung. Umumnya tidak muncul di awal kata.',
        traps: ['Biasanya tidak dipakai di awal kata bahasa Inggris.']
      },
      {
        letter: 'l, ll',
        ipaSymbol: '/l/',
        description: 'Pola umum:',
        examples: ['l -> light', 'll -> bell'],
        category: 'consonant',
        pronunciationTip: 'Ujung lidah ke gusi atas, udara keluar dari samping lidah.'
      },
      {
        letter: 'r, rr, wr',
        ipaSymbol: '/r/',
        description: 'Pola umum:',
        examples: ['r -> red', 'rr -> carry', 'wr -> write'],
        category: 'consonant',
        pronunciationTip: 'American /r/: lidah mendekat tanpa trill/gulung.',
        traps: ['Jangan pakai r getar ala Indonesia.']
      },
      {
        letter: 'w, wh',
        ipaSymbol: '/w/',
        description: 'Pola umum:',
        examples: ['w -> we', 'wh -> what'],
        category: 'consonant',
        pronunciationTip: 'Bibir membulat di awal, lalu cepat ke vokal berikutnya.'
      },
      {
        letter: 'y, i (semi-vokal)',
        ipaSymbol: '/j/',
        description: 'Pola umum (IPA standar):',
        examples: ['y -> yes', 'i -> onion (bunyi y)'],
        category: 'consonant',
        pronunciationTip: 'Ini notasi IPA standar untuk bunyi y (glide).'
      },
      {
        letter: 'y, i (semi-vokal)',
        ipaSymbol: '/y/',
        description: 'Pola umum (konvensi simbol di aplikasi ini, setara /j/):',
        examples: ['y -> yes', 'i -> onion (bunyi y)'],
        category: 'consonant',
        pronunciationTip: 'Lidah depan naik ke langit-langit keras lalu meluncur cepat.'
      }
    ]
  }
];

// Helper functions to get common letters data
export const getCommonLettersByCategory = (category: string): CommonLetter[] => {
  const categoryData = commonLettersData.find(cat => cat.category === category);
  return categoryData ? categoryData.letters : [];
};

export const getCommonLetterByIPA = (ipaSymbol: string): CommonLetter | undefined => {
  for (const category of commonLettersData) {
    const letter = category.letters.find(l => l.ipaSymbol === ipaSymbol);
    if (letter) return letter;
  }
  return undefined;
};

export const getCommonLetterByLetter = (letter: string): CommonLetter[] => {
  const results: CommonLetter[] = [];
  for (const category of commonLettersData) {
    const letters = category.letters.filter(l => l.letter.toLowerCase() === letter.toLowerCase());
    results.push(...letters);
  }
  return results;
};

export const getAllCommonLetters = (): CommonLetter[] => {
  return commonLettersData.flatMap(category => category.letters);
};

export const getCommonLettersCategories = (): string[] => {
  return commonLettersData.map(category => category.category);
};
