export const COMMON_LETTER_SYMBOL_ALIASES: Record<string, string[]> = {
  e: ['ɛ'],
  'ɛ': ['e'],
  'er': ['eə', 'ɛr'],
  'eə': ['er', 'ɛr'],
  'ɛr': ['er', 'eə'],
  'ɪr': ['ɪə', 'iə'],
  'ɪə': ['ɪr', 'iə'],
  'iə': ['ɪr', 'ɪə'],
  'ʊr': ['ʊə'],
  'ʊə': ['ʊr'],
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

export const VOWEL_LAX_SYMBOLS = ['ʌ', 'ɪ', 'ʊ', 'ɛ', 'ə', 'ɚ'] as const;
export const VOWEL_TENSE_SYMBOLS = ['ɑ', 'i', 'u', 'æ', 'ɔ'] as const;
export const CONSONANT_VOICELESS_SYMBOLS = ['p', 't', 'k', 'f', 'θ', 's', 'ʃ', 'tʃ', 'h'] as const;
export const CONSONANT_VOICED_SYMBOLS = [
  'b', 'd', 'g', 'v', 'ð', 'z', 'ʒ', 'dʒ', 'l', 'm', 'n', 'ŋ', 'r', 'w', 'j',
] as const;
export const DIPHTHONG_SYMBOLS = ['aɪ', 'eɪ', 'ɔɪ', 'ɪə', 'eə', 'ɛr', 'ʊə', 'oʊ', 'aʊ'] as const;

export const BRITISH_NOTES_BY_SYMBOL: Record<string, {
  description: string;
  items: Array<{ word: string; britishIpa: string; americanIpa: string }>;
}> = {
  'ɔ': {
    description: 'Beberapa kata contoh di simbol ini sering ditulis/terdengar gaya British; di banyak dialek AmE vokal ini terdengar lebih ke /ɑ/.',
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
  h: {
    description: 'Untuk beberapa kata dengan huruf h + o, model American biasanya tidak memakai bunyi /?/ British.',
    items: [
      { word: 'hot', britishIpa: '/h?t/', americanIpa: '/h?t/' },
      { word: 'holiday', britishIpa: "/'h?l?de?", americanIpa: "/'h?l?de?/" },
    ],
  },
  w: {
    description: 'Khusus kata tertentu, pelafalan American punya ciri tambahan seperti flap /?/ dan r-colored vowel.',
    items: [
      { word: 'water', britishIpa: "/'w??t?", americanIpa: "/'w???/" },
    ],
  },
  'ɚ': {
    description: 'Akhiran -er pada daftar ini kadang ditulis non-rhotic (gaya British). American biasanya memakai /ɚ/ atau /əɹ/.',
    items: [
      { word: 'teacher', britishIpa: "/'tiːtʃə/", americanIpa: "/'tiːtʃɚ/" },
      { word: 'doctor', britishIpa: "/'dɒktə/", americanIpa: "/'dɑktɚ/" },
      { word: 'water', britishIpa: "/'wɔːtə/", americanIpa: "/'wɔtɚ/" },
      { word: 'later', britishIpa: "/'leɪtə/", americanIpa: "/'leɪɾɚ/" },
    ],
  },
  'eə': {
    description: 'Simbol ini sangat umum di British. Dalam American, banyak kata biasanya terdengar lebih rhotic (pakai /r/).',
    items: [
      { word: 'care', britishIpa: '/keə/', americanIpa: '/kɚ/' },
      { word: 'share', britishIpa: '/ʃeə/', americanIpa: '/ʃɚ/' },
      { word: 'fair', britishIpa: '/feə/', americanIpa: '/fɚ/' },
      { word: 'bear', britishIpa: '/beə/', americanIpa: '/bɚ/' },
    ],
  },
  'ɪə': {
    description: 'Di British sering ditulis /ɪə/. Dalam American biasanya lebih dekat ke /ɪr/.',
    items: [
      { word: 'near', britishIpa: '/nɪə/', americanIpa: '/nɪr/' },
      { word: 'clear', britishIpa: '/klɪə/', americanIpa: '/klɪr/' },
      { word: 'fear', britishIpa: '/fɪə/', americanIpa: '/fɪr/' },
      { word: 'year', britishIpa: '/jɪə/', americanIpa: '/jɪr/' },
    ],
  },
  'ʊə': {
    description: 'Di British sering ditulis /ʊə/. Dalam American, kata yang sama biasanya cenderung /ʊr/ (atau variasi rhotic lain).',
    items: [
      { word: 'tour', britishIpa: '/tʊə/', americanIpa: '/tʊr/' },
      { word: 'poor', britishIpa: '/pʊə/', americanIpa: '/pʊr/' },
      { word: 'sure', britishIpa: '/ʃʊə/', americanIpa: '/ʃʊr/' },
      { word: 'your', britishIpa: '/jʊə/', americanIpa: '/jʊr/' },
    ],
  },
};
