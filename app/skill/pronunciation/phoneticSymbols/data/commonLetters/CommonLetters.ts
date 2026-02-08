// Common Letters and their IPA pronunciations
// Data for the Book icon popup showing common letter-to-IPA mappings
// Based on Tipshuruf.md reference

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
        ipaSymbol: '/ʌ/',
        description: 'Sering muncul dari huruf:',
        examples: ['u → cup, luck, bus', 'o → love, money', 'ou → country, young'],
        category: 'vowel',
        pronunciationTip: 'Jebakan: Jangan dibaca u Indonesia. Ini bunyi "a samar".',
        traps: ['Jangan dibaca u Indonesia. Ini bunyi "a samar".']
      },
      {
        letter: 'i, y, ui',
        ipaSymbol: '/ɪ/',
        description: 'Sering muncul dari huruf:',
        examples: ['i → sit, big, give', 'y → gym, symbol', 'ui → build'],
        category: 'vowel',
        pronunciationTip: 'Jebakan: Jangan dipanjangkan jadi i.',
        traps: ['Jangan dipanjangkan jadi i.']
      },
      {
        letter: 'oo, u, o',
        ipaSymbol: '/ʊ/',
        description: 'Sering muncul dari huruf:',
        examples: ['oo → book, good', 'u → put, full', 'o → woman'],
        category: 'vowel',
        pronunciationTip: 'Jebakan: Penutur Indonesia hampir selalu salah → jadi u panjang.',
        traps: ['Penutur Indonesia hampir selalu salah → jadi u panjang.']
      },
      {
        letter: 'e, ea, a',
        ipaSymbol: '/ɛ/',
        description: 'Sering muncul dari huruf:',
        examples: ['e → bed, pen', 'ea → head, bread', 'a → many'],
        category: 'vowel',
        pronunciationTip: 'Jebakan: Jangan naik ke eɪ.',
        traps: ['Jangan naik ke eɪ.']
      },
      {
        letter: 'a, e, o, u',
        ipaSymbol: '/ə/',
        description: 'Sering muncul dari huruf:',
        examples: ['a → about, ago', 'e → problem, open', 'o → police', 'u → support'],
        category: 'vowel',
        pronunciationTip: 'Jebakan: Ini bunyi paling sering, tapi paling diabaikan.',
        traps: ['Ini bunyi paling sering, tapi paling diabaikan.']
      },
      {
        letter: 'er, ir, ur',
        ipaSymbol: '/ɚ/',
        description: 'Sering muncul dari huruf:',
        examples: ['er / ir / ur → teacher, bird, turn'],
        category: 'vowel',
        pronunciationTip: 'Jebakan: Bukan er keras, tapi ə + r.',
        traps: ['Bukan er keras, tapi ə + r.']
      }
    ]
  },
  {
    category: 'TENSE VOWEL',
    letters: [
      {
        letter: 'a+r, o, au',
        ipaSymbol: '/ɑ/',
        description: 'Sering muncul dari huruf:',
        examples: ['a + r → car, start', 'o (AmE) → hot, not', 'au → laugh'],
        category: 'tense_vowel',
        pronunciationTip: ''
      },
      {
        letter: 'ee, ea, i, y',
        ipaSymbol: '/i/',
        description: 'Sering muncul dari huruf:',
        examples: ['ee → see', 'ea → eat', 'i → machine', 'y → city'],
        category: 'tense_vowel',
        pronunciationTip: ''
      },
      {
        letter: 'oo, u+e, ew',
        ipaSymbol: '/u/',
        description: 'Sering muncul dari huruf:',
        examples: ['oo → food', 'u + e → rule', 'ew → new'],
        category: 'tense_vowel',
        pronunciationTip: ''
      },
      {
        letter: 'a, ai',
        ipaSymbol: '/æ/',
        description: 'Sering muncul dari huruf:',
        examples: ['a → cat, man', 'ai → plaid'],
        category: 'tense_vowel',
        pronunciationTip: 'Jebakan: Ini bukan e, rahang harus turun.',
        traps: ['Ini bukan e, rahang harus turun.']
      },
      {
        letter: 'o+r, a+ll, au',
        ipaSymbol: '/ɔ/',
        description: 'Sering muncul dari huruf:',
        examples: ['o + r → for, more', 'a + ll → call, wall', 'au → cause'],
        category: 'tense_vowel',
        pronunciationTip: ''
      }
    ]
  },
  {
    category: 'DIPHTHONG',
    letters: [
      {
        letter: 'i+e, igh, y',
        ipaSymbol: '/aɪ/',
        description: 'Huruf umum:',
        examples: ['i + e → time', 'igh → light', 'y → my'],
        category: 'diphthong',
        pronunciationTip: ''
      },
      {
        letter: 'a+e, ai/ay, ei',
        ipaSymbol: '/eɪ/',
        description: 'Huruf umum:',
        examples: ['a + e → name', 'ai / ay → rain, day', 'ei → eight'],
        category: 'diphthong',
        pronunciationTip: ''
      },
      {
        letter: 'oi/oy',
        ipaSymbol: '/ɔɪ/',
        description: 'Huruf umum:',
        examples: ['oi / oy → coin, boy'],
        category: 'diphthong',
        pronunciationTip: ''
      },
      {
        letter: 'ear',
        ipaSymbol: '/ɪə/',
        description: 'Huruf umum:',
        examples: ['ear → ear, here'],
        category: 'diphthong',
        pronunciationTip: ''
      },
      {
        letter: 'air, are, ear',
        ipaSymbol: '/eə/',
        description: 'Huruf umum:',
        examples: ['air → air', 'are → care', 'ear → bear'],
        category: 'diphthong',
        pronunciationTip: ''
      },
      {
        letter: 'ure',
        ipaSymbol: '/ʊə/',
        description: 'Huruf umum:',
        examples: ['ure → pure, tour'],
        category: 'diphthong',
        pronunciationTip: ''
      },
      {
        letter: 'o+e, oa, ow',
        ipaSymbol: '/oʊ/',
        description: 'Huruf umum:',
        examples: ['o + e → home', 'oa → road', 'ow → slow'],
        category: 'diphthong',
        pronunciationTip: ''
      },
      {
        letter: 'ou, ow',
        ipaSymbol: '/aʊ/',
        description: 'Huruf umum:',
        examples: ['ou → out', 'ow → now'],
        category: 'diphthong',
        pronunciationTip: ''
      }
    ]
  },
  {
    category: 'CONSONANT',
    letters: [
      {
        letter: 'th',
        ipaSymbol: '/θ/',
        description: '',
        examples: ['th → think'],
        category: 'consonant',
        pronunciationTip: '(Jangan jadi t)',
        traps: ['Jangan jadi t']
      },
      {
        letter: 'th',
        ipaSymbol: '/ð/',
        description: '',
        examples: ['th → this'],
        category: 'consonant',
        pronunciationTip: '(Jangan jadi d)',
        traps: ['Jangan jadi d']
      },
      {
        letter: 'sh, ti/ci, ch',
        ipaSymbol: '/ʃ/',
        description: '',
        examples: ['sh → she', 'ti / ci → nation, special', 'ch → machine'],
        category: 'consonant',
        pronunciationTip: ''
      },
      {
        letter: 'ch, t+u',
        ipaSymbol: '/ʧ/',
        description: '',
        examples: ['ch → chair', 't + u → future'],
        category: 'consonant',
        pronunciationTip: ''
      },
      {
        letter: 'si, s',
        ipaSymbol: '/ʒ/',
        description: '',
        examples: ['si → vision', 's → measure'],
        category: 'consonant',
        pronunciationTip: ''
      },
      {
        letter: 'j, g+e/i/y, dg',
        ipaSymbol: '/ʤ/',
        description: '',
        examples: ['j → job', 'g + e/i/y → giant', 'dg → bridge'],
        category: 'consonant',
        pronunciationTip: ''
      },
      {
        letter: 'ng, n+k/g',
        ipaSymbol: '/ŋ/',
        description: '',
        examples: ['ng → sing', 'n + k/g → think'],
        category: 'consonant',
        pronunciationTip: 'Aturan keras: ❌ tidak pernah di awal kata.',
        traps: ['tidak pernah di awal kata.']
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
