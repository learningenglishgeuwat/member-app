// Symbol Descriptions for Phonetic Symbols
// Modular symbol descriptions data for IPA symbols

export interface SymbolDescription {
  description: string;
  category: 'vowel' | 'consonant' | 'diphthong';
  subcategory?: string;
}

export interface SymbolDescriptions {
  [key: string]: SymbolDescription;
}

// ==========================================
// 1. VOWEL DESCRIPTIONS (LAX THEN TENSE)
// ==========================================
const vowelDescriptions: SymbolDescriptions = {
  // --- Vowel (Lax) ---
  'ʌ': {
    description: 'Open-mid back unrounded vowel',
    category: 'vowel',
    subcategory: 'open-mid'
  },
  'ɪ': {
    description: 'Near-close near-front unrounded vowel',
    category: 'vowel',
    subcategory: 'near-close'
  },
  'ʊ': {
    description: 'Near-close near-back rounded vowel',
    category: 'vowel',
    subcategory: 'near-close'
  },
  'ɛ': {
    description: 'Open-mid front unrounded vowel',
    category: 'vowel',
    subcategory: 'open-mid'
  },
  'ə': {
    description: 'Mid central vowel (schwa)',
    category: 'vowel',
    subcategory: 'mid'
  },
  'ɚ': {
    description: 'R-colored mid central vowel',
    category: 'vowel',
    subcategory: 'r-colored'
  },

  // --- Vowel (Tense) ---
  'ɑ': {
    description: 'Open back unrounded vowel',
    category: 'vowel',
    subcategory: 'open'
  },
  'i': {
    description: 'Close front unrounded vowel',
    category: 'vowel',
    subcategory: 'close'
  },
  'u': {
    description: 'Close back rounded vowel',
    category: 'vowel',
    subcategory: 'close'
  },
  'æ': {
    description: 'Near-open front unrounded vowel',
    category: 'vowel',
    subcategory: 'near-open'
  },
  'ɔ': {
    description: 'Open-mid back rounded vowel',
    category: 'vowel',
    subcategory: 'open-mid'
  }
};

// ==========================================
// 2. DIPHTHONG DESCRIPTIONS
// ==========================================
const diphthongDescriptions: SymbolDescriptions = {
  'aɪ': {
    description: 'Closing diphthong ending in front close vowel',
    category: 'diphthong',
    subcategory: 'closing'
  },
  'eɪ': {
    description: 'Closing diphthong ending in front close vowel',
    category: 'diphthong',
    subcategory: 'closing'
  },
  'ɔɪ': {
    description: 'Closing diphthong ending in front close vowel',
    category: 'diphthong',
    subcategory: 'closing'
  },
  'ɪr': {
    description: 'Rhotic centering diphthong starting near-close front',
    category: 'diphthong',
    subcategory: 'centering'
  },
  'ɛr': {
    description: 'Rhotic centering diphthong starting open-mid front',
    category: 'diphthong',
    subcategory: 'centering'
  },
  'ʊr': {
    description: 'Rhotic centering diphthong starting near-close back',
    category: 'diphthong',
    subcategory: 'centering'
  },
  'oʊ': {
    description: 'Closing diphthong ending in back close vowel',
    category: 'diphthong',
    subcategory: 'closing'
  },
  'aʊ': {
    description: 'Closing diphthong ending in back close vowel',
    category: 'diphthong',
    subcategory: 'closing'
  }
};

// ==========================================
// 3. CONSONANT DESCRIPTIONS (VOICELESS THEN VOICED)
// ==========================================
const consonantDescriptions: SymbolDescriptions = {
  // --- Consonant (Voiceless) ---
  'p': {
    description: 'Voiceless bilabial plosive',
    category: 'consonant',
    subcategory: 'plosive'
  },
  't': {
    description: 'Voiceless alveolar plosive',
    category: 'consonant',
    subcategory: 'plosive'
  },
  'k': {
    description: 'Voiceless velar plosive',
    category: 'consonant',
    subcategory: 'plosive'
  },
  'f': {
    description: 'Voiceless labiodental fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'θ': {
    description: 'Voiceless dental fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  's': {
    description: 'Voiceless alveolar fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'ʃ': {
    description: 'Voiceless postalveolar fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'ʧ': {
    description: 'Voiceless postalveolar affricate',
    category: 'consonant',
    subcategory: 'affricate'
  },
  'h': {
    description: 'Voiceless glottal fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },

  // --- Consonant (Voiced) ---
  'b': {
    description: 'Voiced bilabial plosive',
    category: 'consonant',
    subcategory: 'plosive'
  },
  'd': {
    description: 'Voiced alveolar plosive',
    category: 'consonant',
    subcategory: 'plosive'
  },
  'g': {
    description: 'Voiced velar plosive',
    category: 'consonant',
    subcategory: 'plosive'
  },
  'v': {
    description: 'Voiced labiodental fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'ð': {
    description: 'Voiced dental fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'z': {
    description: 'Voiced alveolar fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'ʒ': {
    description: 'Voiced postalveolar fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'ʤ': {
    description: 'Voiced postalveolar affricate',
    category: 'consonant',
    subcategory: 'affricate'
  },
  'l': {
    description: 'Alveolar lateral approximant',
    category: 'consonant',
    subcategory: 'approximant'
  },
  'm': {
    description: 'Bilabial nasal',
    category: 'consonant',
    subcategory: 'nasal'
  },
  'n': {
    description: 'Alveolar nasal',
    category: 'consonant',
    subcategory: 'nasal'
  },
  'ŋ': {
    description: 'Velar nasal',
    category: 'consonant',
    subcategory: 'nasal'
  },
  'r': {
    description: 'Alveolar approximant',
    category: 'consonant',
    subcategory: 'approximant'
  },
  'w': {
    description: 'Labial-velar approximant',
    category: 'consonant',
    subcategory: 'approximant'
  },
  'j': {
    description: 'Palatal approximant',
    category: 'consonant',
    subcategory: 'approximant'
  }
};

// Combined all descriptions strictly ordered
const allSymbolDescriptions: SymbolDescriptions = {
  ...vowelDescriptions,
  ...diphthongDescriptions,
  ...consonantDescriptions
};

function normalizeSymbolKey(symbol: string): string {
  const s = symbol.trim();
  if (s === 'dʒ') return 'ʤ';
  if (s === 'tʃ') return 'ʧ';
  if (s === 'y') return 'j';
  if (s === 'eə' || s === 'er') return 'ɛr';
  if (s === 'ɪə' || s === 'iə') return 'ɪr';
  if (s === 'ʊə') return 'ʊr';
  return s;
}

// Helper function to get symbol description
export function getSymbolDescription(symbol: string): string {
  const normalizedKey = normalizeSymbolKey(symbol);
  return allSymbolDescriptions[normalizedKey]?.description || 'International Phonetic Alphabet Symbol';
}

// Helper function to get category display name
export function getCategoryDisplayName(symbol: string): string {
  const normalizedKey = normalizeSymbolKey(symbol);
  const normalizedSymbol = normalizedKey
    .replace('Ã¦', '\u00e6')
    .replace('Ã°', '\u00f0')
    .replace('Å‹', '\u014b')
    .replace('É‘', '\u0251')
    .replace('É”', '\u0254')
    .replace('ÊŒ', '\u028c')
    .replace('Éª', '\u026a')
    .replace('ÊŠ', '\u028a')
    .replace('É›', '\u025b')
    .replace('É™', '\u0259')
    .replace('Éš', '\u025a')
    .replace('Î¸', '\u03b8')
    .replace('Êƒ', '\u0283')
    .replace('Ê§', '\u02a7')
    .replace('Ê’', '\u0292')
    .replace('Ê¤', '\u02a4');

  const symbolData = allSymbolDescriptions[normalizedSymbol] || allSymbolDescriptions[normalizedKey];
  if (!symbolData) return 'Unknown';

  // Explicit category sets matching master portal layout
  const vowelLax = new Set(['ʌ', 'ɪ', 'ʊ', 'ɛ', 'ə', 'ɚ']);
  const vowelTense = new Set(['ɑ', 'i', 'u', 'æ', 'ɔ']);
  const diphthong = new Set(['aɪ', 'eɪ', 'ɔɪ', 'ɪr', 'ɛr', 'ʊr', 'oʊ', 'aʊ']);
  const consonantVoiceless = new Set(['p', 't', 'k', 'f', 'θ', 's', 'ʃ', 'ʧ', 'h']);
  const consonantVoiced = new Set([
    'b', 'd', 'g', 'v', 'ð', 'z', 'ʒ', 'ʤ', 'l', 'm', 'n', 'ŋ', 'r', 'w', 'j',
  ]);

  if (vowelLax.has(normalizedSymbol)) {
    return 'vowel_lax';
  }
  if (vowelTense.has(normalizedSymbol)) {
    return 'vowel_tense';
  }
  if (diphthong.has(normalizedSymbol)) {
    return 'diphthong';
  }
  if (consonantVoiceless.has(normalizedSymbol)) {
    return 'consonant_voiceless';
  }
  if (consonantVoiced.has(normalizedSymbol)) {
    return 'consonant_voiced';
  }
  
  const { category, subcategory } = symbolData;
  
  if (category === 'vowel') {
    const tenseVowels = ['close', 'close-mid'];
    const laxVowels = ['near-close', 'open', 'open-mid', 'near-open', 'mid', 'r-colored'];
    
    if (tenseVowels.includes(subcategory || '')) {
      return 'vowel_tense';
    } else if (laxVowels.includes(subcategory || '')) {
      return 'vowel_lax';
    }
  } else if (category === 'consonant') {
    const description = symbolData.description.toLowerCase();
    if (description.includes('voiced')) {
      return 'consonant_voiced';
    } else if (description.includes('voiceless')) {
      return 'consonant_voiceless';
    }
  } else if (category === 'diphthong') {
    return 'diphthong';
  }
  
  return category;
}