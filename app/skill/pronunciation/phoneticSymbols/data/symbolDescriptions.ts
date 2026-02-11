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

// Vowel Descriptions
const vowelDescriptions: SymbolDescriptions = {
  'i': {
    description: 'Close front unrounded vowel',
    category: 'vowel',
    subcategory: 'close'
  },
  'ɪ': {
    description: 'Near-close near-front unrounded vowel',
    category: 'vowel',
    subcategory: 'near-close'
  },
  'e': {
    description: 'Close-mid front unrounded vowel',
    category: 'vowel',
    subcategory: 'close-mid'
  },
  'ɛ': {
    description: 'Open-mid front unrounded vowel',
    category: 'vowel',
    subcategory: 'open-mid'
  },
  'æ': {
    description: 'Near-open front unrounded vowel',
    category: 'vowel',
    subcategory: 'near-open'
  },
  'ɑ': {
    description: 'Open back unrounded vowel',
    category: 'vowel',
    subcategory: 'open'
  },
  'ɔ': {
    description: 'Open-mid back rounded vowel',
    category: 'vowel',
    subcategory: 'open-mid'
  },
  'ʊ': {
    description: 'Near-close near-back rounded vowel',
    category: 'vowel',
    subcategory: 'near-close'
  },
  'ʌ': {
    description: 'Open-mid back unrounded vowel',
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
  'u': {
    description: 'Close back rounded vowel',
    category: 'vowel',
    subcategory: 'close'
  }
};

// Consonant Descriptions
const consonantDescriptions: SymbolDescriptions = {
  'p': {
    description: 'Voiceless bilabial plosive',
    category: 'consonant',
    subcategory: 'plosive'
  },
  'b': {
    description: 'Voiced bilabial plosive',
    category: 'consonant',
    subcategory: 'plosive'
  },
  't': {
    description: 'Voiceless alveolar plosive',
    category: 'consonant',
    subcategory: 'plosive'
  },
  'd': {
    description: 'Voiced alveolar plosive',
    category: 'consonant',
    subcategory: 'plosive'
  },
  'k': {
    description: 'Voiceless velar plosive',
    category: 'consonant',
    subcategory: 'plosive'
  },
  'g': {
    description: 'Voiced velar plosive',
    category: 'consonant',
    subcategory: 'plosive'
  },
  'f': {
    description: 'Voiceless labiodental fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'v': {
    description: 'Voiced labiodental fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'θ': {
    description: 'Voiceless dental fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'ð': {
    description: 'Voiced dental fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  's': {
    description: 'Voiceless alveolar fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'z': {
    description: 'Voiced alveolar fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'ʃ': {
    description: 'Voiceless postalveolar fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'ʒ': {
    description: 'Voiced postalveolar fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'h': {
    description: 'Voiceless glottal fricative',
    category: 'consonant',
    subcategory: 'fricative'
  },
  'ʧ': {
    description: 'Voiceless postalveolar affricate',
    category: 'consonant',
    subcategory: 'affricate'
  },
  'ʤ': {
    description: 'Voiced postalveolar affricate',
    category: 'consonant',
    subcategory: 'affricate'
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
  'l': {
    description: 'Alveolar lateral approximant',
    category: 'consonant',
    subcategory: 'approximant'
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

// Diphthong Descriptions
const diphthongDescriptions: SymbolDescriptions = {
  'aɪ': {
    description: 'Closing diphthong ending in front close vowel',
    category: 'diphthong',
    subcategory: 'closing'
  },
  'aʊ': {
    description: 'Closing diphthong ending in back close vowel',
    category: 'diphthong',
    subcategory: 'closing'
  },
  'eɪ': {
    description: 'Closing diphthong ending in front close vowel',
    category: 'diphthong',
    subcategory: 'closing'
  },
  'ɔɪ': {
    description: 'Closing diphthong ending in back close vowel',
    category: 'diphthong',
    subcategory: 'closing'
  },
  'oʊ': {
    description: 'Closing diphthong ending in back close vowel',
    category: 'diphthong',
    subcategory: 'closing'
  },
  'eə': {
    description: 'Centering diphthong ending in schwa',
    category: 'diphthong',
    subcategory: 'centering'
  },
  'ɪə': {
    description: 'Centering diphthong ending in schwa',
    category: 'diphthong',
    subcategory: 'centering'
  },
  'ʊə': {
    description: 'Centering diphthong ending in schwa',
    category: 'diphthong',
    subcategory: 'centering'
  }
};

// Combined all descriptions
const allSymbolDescriptions: SymbolDescriptions = {
  ...vowelDescriptions,
  ...consonantDescriptions,
  ...diphthongDescriptions
};

// Helper function to get symbol description
export function getSymbolDescription(symbol: string): string {
  return allSymbolDescriptions[symbol]?.description || 'International Phonetic Alphabet Symbol';
}

// Helper function to get category display name
export function getCategoryDisplayName(symbol: string): string {
  const symbolData = allSymbolDescriptions[symbol];
  if (!symbolData) return 'Unknown';
  
  const { category, subcategory } = symbolData;
  
  // Map to specific category names based on your requirements
  if (category === 'vowel') {
    // Determine if vowel is tense or lax based on subcategory
    const tenseVowels = ['close', 'close-mid'];
    const laxVowels = ['near-close', 'open', 'open-mid', 'near-open', 'mid', 'r-colored'];
    
    if (tenseVowels.includes(subcategory || '')) {
      return 'vowel_tense';
    } else if (laxVowels.includes(subcategory || '')) {
      return 'vowel_lax';
    }
  } else if (category === 'consonant') {
    // Determine if consonant is voiced or voiceless based on description
    const description = symbolData.description.toLowerCase();
    if (description.includes('voiced')) {
      return 'consonant_voiced';
    } else if (description.includes('voiceless')) {
      return 'consonant_voiceless';
    }
  } else if (category === 'diphthong') {
    return 'diphthong';
  }
  
  // Fallback to category name
  return category;
}
