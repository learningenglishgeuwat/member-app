export const COMMON_LETTER_SYMBOL_ALIASES: Record<string, string[]> = {
  e: ['ɛ'],
  'ɛ': ['e'],
  'er': ['ɛr'],
  'ɛr': ['er', 'ɛr'],
  'ɪr': ['ɪr'],
  'ʊr': ['ʊr'],
  'əʊ': ['oʊ'],
  'oʊ': ['əʊ'],
  'tʃ': ['ʧ'],
  'ʧ': ['tʃ'],
  'dʒ': ['ʤ'],
  'ʤ': ['dʒ'],
  y: ['j'],
  j: ['y'],
};

export const BRITISH_NOTE_COUNTERPARTS: Record<string, string[]> = {
  'ɔ': ['ɑ'],
  'ɑ': ['ɔ'],
  'ɚ': ['ə'],
  'ə': ['ɚ'],
  'ɒ': ['ɑ', 'ɔ'],
};

// ====================================================================
// --- ARRAYS SIMBOL (URUTAN 100% LINIER SESUAI TABEL MASTER) ---
// ====================================================================

export const VOWEL_LAX_SYMBOLS = ['ʌ', 'ɪ', 'ʊ', 'ɛ', 'ə', 'ɚ'] as const;

export const VOWEL_TENSE_SYMBOLS = ['ɑ', 'i', 'u', 'æ', 'ɔ'] as const;

export const DIPHTHONG_SYMBOLS = ['aɪ', 'eɪ', 'ɔɪ', 'ɪr', 'ɛr', 'ʊr', 'oʊ', 'aʊ'] as const;

export const CONSONANT_VOICELESS_SYMBOLS = ['p', 't', 'k', 'f', 'θ', 's', 'ʃ', 'ʧ', 'h'] as const;

export const CONSONANT_VOICED_SYMBOLS = [
  'b', 'd', 'g', 'v', 'ð', 'z', 'ʒ', 'ʤ', 'l', 'm', 'n', 'ŋ', 'r', 'w', 'j',
] as const;

// ====================================================================
// --- CATATAN AKSEN BRITISH (URUTAN KEY MENGIKUTI TABEL MASTER) ---
// ====================================================================

export const BRITISH_NOTES_BY_SYMBOL: Record<string, {
  description: string;
  items: Array<{ word: string; britishIpa: string; americanIpa: string }>;
}> = {
  // --- Kategori 1: Vowel (Lax) ---
  'ɚ': {
    description: 'Akhiran -er pada daftar ini kadang ditulis non-rhotic (gaya British menggunakan /ə/). American biasanya memakai /ɚ/ atau /əɹ/.',
    items: [
      { word: 'teacher', britishIpa: "/'tiːtʃə/", americanIpa: "/'tiːtʃɚ/" },
      { word: 'doctor', britishIpa: "/'dɒktə/", americanIpa: "/'dɑktɚ/" },
      { word: 'water', britishIpa: "/'wɔːtə/", americanIpa: "/'wɔtɚ/" },
      { word: 'later', britishIpa: "/'leɪtə/", americanIpa: "/'leɪɾɚ/" },
    ],
  },

  // --- Kategori 2: Vowel (Tense) ---
  'ɔ': {
    description: 'Beberapa kata contoh di simbol ini sering ditulis/terdengar gaya British (/ɒ/); di banyak dialek AmE vokal ini terdengar lebih ke /ɑ/.',
    items: [
      { word: 'dog', britishIpa: '/dɔg/', americanIpa: '/dɑg/' },
      { word: 'long', britishIpa: '/lɔŋ/', americanIpa: '/lɑŋ/' },
      { word: 'song', britishIpa: '/sɔŋ/', americanIpa: '/sɑŋ/' },
      { word: 'strong', britishIpa: '/strɔŋ/', americanIpa: '/strɑŋ/' },
      { word: 'wrong', britishIpa: '/rɔŋ/', americanIpa: '/rɑŋ/' },
      { word: 'off', britishIpa: '/ɔf/', americanIpa: '/ɑf/' },
      { word: 'soft', britishIpa: '/sɔft/', americanIpa: '/sɑft/' },
      { word: 'boss', britishIpa: '/bɔs/', americanIpa: '/bɑs/' },
      { word: 'cross', britishIpa: '/krɔs/', americanIpa: '/krɑs/' },
      { word: 'cost', britishIpa: '/kɔst/', americanIpa: '/kɑst/' },
      { word: 'hot', britishIpa: '/hɔt/', americanIpa: '/hɑt/' },
      { word: 'not', britishIpa: '/nɔt/', americanIpa: '/nɑt/' },
      { word: 'lot', britishIpa: '/lɔt/', americanIpa: '/lɑt/' },
      { word: 'top', britishIpa: '/tɔp/', americanIpa: '/tɑp/' },
      { word: 'shop', britishIpa: '/ʃɔp/', americanIpa: '/ʃɑp/' },
      { word: 'stop', britishIpa: '/stɔp/', americanIpa: '/stɑp/' },
      { word: 'clock', britishIpa: '/klɔk/', americanIpa: '/klɑk/' },
      { word: 'rock', britishIpa: '/rɔk/', americanIpa: '/rɑk/' },
      { word: 'box', britishIpa: '/bɔks/', americanIpa: '/bɑks/' },
      { word: 'fox', britishIpa: '/fɔks/', americanIpa: '/fɑks/' },
    ],
  },

  // --- Kategori 3: Diphthong (Diselaraskan ke key Master Rhotic /ɪr/, /ɛr/, /ʊr/) ---
  'ɪr': {
    description: 'Di British sering ditulis menggunakan centring diphthong /ɪə/. Dalam American biasanya lebih konsisten ke arah rhotic /ɪr/.',
    items: [
      { word: 'near', britishIpa: '/nɪə/', americanIpa: '/nɪr/' },
      { word: 'clear', britishIpa: '/klɪə/', americanIpa: '/klɪr/' },
      { word: 'fear', britishIpa: '/fɪə/', americanIpa: '/fɪr/' },
      { word: 'year', britishIpa: '/jɪə/', americanIpa: '/jɪr/' },
    ],
  },
  'ɛr': {
    description: 'Simbol ini sangat umum di British sebagai /eə/. Dalam American, kata-kata ini menggunakan warna rhotic penuh /ɛr/.',
    items: [
      { word: 'care', britishIpa: '/keə/', americanIpa: '/kɛr/' },
      { word: 'share', britishIpa: '/ʃeə/', americanIpa: '/ʃɛr/' },
      { word: 'fair', britishIpa: '/feə/', americanIpa: '/fɛr/' },
      { word: 'bear', britishIpa: '/beə/', americanIpa: '/bɛr/' },
    ],
  },
  'ʊr': {
    description: 'Di British sering ditulis /ʊə/. Dalam American, kata yang sama cenderung menggunakan pelafalan rhotic /ʊr/.',
    items: [
      { word: 'tour', britishIpa: '/tʊə/', americanIpa: '/tʊr/' },
      { word: 'poor', britishIpa: '/pʊə/', americanIpa: '/pʊr/' },
      { word: 'sure', britishIpa: '/ʃʊə/', americanIpa: '/ʃʊr/' },
      { word: 'your', britishIpa: '/jʊə/', americanIpa: '/jʊr/' },
    ],
  },

  // --- Kategori 4: Consonant (Voiceless) ---
  h: {
    description: 'Untuk beberapa kata dengan huruf h + o, model American biasanya tidak memakai bunyi pendek /ɒ/ ala British melainkan vokal /ɑ/.',
    items: [
      { word: 'hot', britishIpa: '/hɒt/', americanIpa: '/hɑt/' },
      { word: 'holiday', britishIpa: "/'hɒlɪdeɪ/", americanIpa: "/'hɑlədeɪ/" },
    ],
  },

  // --- Kategori 5: Consonant (Voiced) ---
  w: {
    description: 'Khusus kata tertentu, pelafalan American punya ciri tambahan seperti flap /ɾ/ dan r-colored vowel.',
    items: [
      { word: 'water', britishIpa: "/'wɔːtə/", americanIpa: "/'wɔːɾɚ/" },
    ],
  },
};