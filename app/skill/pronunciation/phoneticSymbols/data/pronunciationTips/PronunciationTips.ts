// Pronunciation Tips for Phonetic Symbols
// Modular pronunciation tips data for IPA symbols

export interface PronunciationTip {
  tip: string;
  category: 'mouth' | 'tongue' | 'lips' | 'airflow' | 'voice' | 'general';
}

export interface SymbolPronunciationTips {
  [key: string]: PronunciationTip[];
}

// Vowel Tips
export const vowelTips: SymbolPronunciationTips = {
  'i': [
    { tip: 'Tongue high and forward', category: 'tongue' },
    { tip: 'Lips spread wide', category: 'lips' },
    { tip: 'Long vowel sound', category: 'general' },
    { tip: 'Front of tongue touches hard palate', category: 'tongue' }
  ],
  'ɪ': [
    { tip: 'Tongue slightly lower than for /iː/', category: 'tongue' },
    { tip: 'Lips relaxed, not spread', category: 'lips' },
    { tip: 'Short vowel sound', category: 'general' },
    { tip: 'Tongue position is near-close', category: 'tongue' }
  ],
  'e': [
    { tip: 'Tongue mid-high position', category: 'tongue' },
    { tip: 'Lips slightly spread', category: 'lips' },
    { tip: 'Long vowel sound', category: 'general' },
    { tip: 'Front of tongue is raised', category: 'tongue' }
  ],
  'ɛ': [
    { tip: 'Tongue mid-low position', category: 'tongue' },
    { tip: 'Lips neutral', category: 'lips' },
    { tip: 'Short vowel sound', category: 'general' },
    { tip: 'Mouth moderately open', category: 'mouth' }
  ],
  'æ': [
    { tip: 'Tongue low front position', category: 'tongue' },
    { tip: 'Lips wide open', category: 'mouth' },
    { tip: 'Short vowel sound', category: 'general' },
    { tip: 'Jaw dropped significantly', category: 'mouth' }
  ],
  'ɑ': [
    { tip: 'Tongue low back position', category: 'tongue' },
    { tip: 'Mouth wide open', category: 'mouth' },
    { tip: 'Long vowel sound', category: 'general' },
    { tip: 'Jaw completely relaxed', category: 'mouth' }
  ],
  'ɔ': [
    { tip: 'Tongue mid-back position', category: 'tongue' },
    { tip: 'Lips rounded', category: 'lips' },
    { tip: 'Short vowel sound', category: 'general' },
    { tip: 'Mouth moderately open', category: 'mouth' }
  ],
  'ʊ': [
    { tip: 'Tongue high back position', category: 'tongue' },
    { tip: 'Lips slightly rounded', category: 'lips' },
    { tip: 'Short vowel sound', category: 'general' },
    { tip: 'Tongue is near-close', category: 'tongue' }
  ],
  'ʌ': [
    { tip: 'Tongue mid-back position', category: 'tongue' },
    { tip: 'Lips neutral', category: 'lips' },
    { tip: 'Short vowel sound', category: 'general' },
    { tip: 'Mouth moderately open', category: 'mouth' }
  ],
  'ə': [
    { tip: 'Tongue mid-central position', category: 'tongue' },
    { tip: 'Lips completely relaxed', category: 'lips' },
    { tip: 'Weak unstressed vowel', category: 'general' },
    { tip: 'Most common sound in English', category: 'general' }
  ],
  'ɚ': [
    { tip: 'Tongue mid-central position', category: 'tongue' },
    { tip: 'Lips neutral', category: 'lips' },
    { tip: 'R-colored vowel', category: 'voice' },
    { tip: 'Tongue slightly retracted', category: 'tongue' }
  ],
  'u': [
    { tip: 'Tongue high back position', category: 'tongue' },
    { tip: 'Lips fully rounded', category: 'lips' },
    { tip: 'Long vowel sound', category: 'general' },
    { tip: 'Back of tongue raised', category: 'tongue' }
  ]
};

// Consonant Tips
export const consonantTips: SymbolPronunciationTips = {
  'p': [
    { tip: 'Both lips close completely', category: 'lips' },
    { tip: 'Build up air pressure', category: 'airflow' },
    { tip: 'Release suddenly', category: 'airflow' },
    { tip: 'Voiceless - no vocal cord vibration', category: 'voice' }
  ],
  'b': [
    { tip: 'Same as /p/ but with voice', category: 'voice' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Air pressure builds', category: 'airflow' },
    { tip: 'Both lips close completely', category: 'lips' }
  ],
  't': [
    { tip: 'Tongue tip touches alveolar ridge', category: 'tongue' },
    { tip: 'Build up air pressure', category: 'airflow' },
    { tip: 'Release suddenly', category: 'airflow' },
    { tip: 'Voiceless - no vocal cord vibration', category: 'voice' }
  ],
  'd': [
    { tip: 'Same as /t/ but with voice', category: 'voice' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Tongue tip touches alveolar ridge', category: 'tongue' },
    { tip: 'Air pressure builds and releases', category: 'airflow' }
  ],
  'k': [
    { tip: 'Back of tongue touches soft palate', category: 'tongue' },
    { tip: 'Build up air pressure', category: 'airflow' },
    { tip: 'Release suddenly', category: 'airflow' },
    { tip: 'Voiceless - no vocal cord vibration', category: 'voice' }
  ],
  'g': [
    { tip: 'Same as /k/ but with voice', category: 'voice' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Back of tongue touches soft palate', category: 'tongue' },
    { tip: 'Air pressure builds and releases', category: 'airflow' }
  ],
  'f': [
    { tip: 'Top teeth touch bottom lip', category: 'mouth' },
    { tip: 'Air flows continuously', category: 'airflow' },
    { tip: 'No vocal cord vibration', category: 'voice' },
    { tip: 'Create friction sound', category: 'airflow' }
  ],
  'v': [
    { tip: 'Same as /f/ but with voice', category: 'voice' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Top teeth touch bottom lip', category: 'mouth' },
    { tip: 'Air flows with friction', category: 'airflow' }
  ],
  'θ': [
    { tip: 'Tongue between teeth', category: 'tongue' },
    { tip: 'Air flows continuously', category: 'airflow' },
    { tip: 'No vocal cord vibration', category: 'voice' },
    { tip: 'Create soft friction sound', category: 'airflow' }
  ],
  'ð': [
    { tip: 'Same tongue position as /θ/', category: 'tongue' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Voiced counterpart', category: 'voice' },
    { tip: 'Air flows with friction', category: 'airflow' }
  ],
  's': [
    { tip: 'Tongue tip near alveolar ridge', category: 'tongue' },
    { tip: 'Air flows continuously', category: 'airflow' },
    { tip: 'No vocal cord vibration', category: 'voice' },
    { tip: 'Create hissing sound', category: 'airflow' }
  ],
  'z': [
    { tip: 'Same as /s/ but with voice', category: 'voice' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Tongue tip near alveolar ridge', category: 'tongue' },
    { tip: 'Create buzzing sound', category: 'airflow' }
  ],
  'ʃ': [
    { tip: 'Tongue pulled back', category: 'tongue' },
    { tip: 'Lips rounded', category: 'lips' },
    { tip: 'Air creates friction', category: 'airflow' },
    { tip: 'Voiceless shushing sound', category: 'voice' }
  ],
  'ʒ': [
    { tip: 'Same as /ʃ/ but with voice', category: 'voice' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Tongue pulled back', category: 'tongue' },
    { tip: 'Create buzzing sh sound', category: 'airflow' }
  ],
  'h': [
    { tip: 'Air flows from glottis', category: 'airflow' },
    { tip: 'No vocal cord vibration', category: 'voice' },
    { tip: 'Open mouth position', category: 'mouth' },
    { tip: 'Breathy sound', category: 'airflow' }
  ],
  'ʧ': [
    { tip: 'Start with /t/ position', category: 'tongue' },
    { tip: 'End with /ʃ/ position', category: 'tongue' },
    { tip: 'Voiceless combination', category: 'voice' },
    { tip: 'Tongue moves back during release', category: 'tongue' }
  ],
  'ʤ': [
    { tip: 'Same as /ʧ/ but with voice', category: 'voice' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Start with /d/ position', category: 'tongue' },
    { tip: 'End with /ʒ/ position', category: 'tongue' }
  ],
  'm': [
    { tip: 'Both lips close completely', category: 'lips' },
    { tip: 'Air flows through nose', category: 'airflow' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Create humming sound', category: 'voice' }
  ],
  'n': [
    { tip: 'Tongue tip touches alveolar ridge', category: 'tongue' },
    { tip: 'Air flows through nose', category: 'airflow' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Create nasal sound', category: 'voice' }
  ],
  'ŋ': [
    { tip: 'Back of tongue touches soft palate', category: 'tongue' },
    { tip: 'Air flows through nose', category: 'airflow' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Create singing nasal sound', category: 'voice' }
  ],
  'l': [
    { tip: 'Tongue tip touches alveolar ridge', category: 'tongue' },
    { tip: 'Air flows around sides', category: 'airflow' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Create clear liquid sound', category: 'voice' }
  ],
  'r': [
    { tip: 'Tongue slightly curled back', category: 'tongue' },
    { tip: 'Air flows continuously', category: 'airflow' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Create bunched r sound', category: 'voice' }
  ],
  'w': [
    { tip: 'Lips rounded tightly', category: 'lips' },
    { tip: 'Tongue back raised', category: 'tongue' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Create smooth glide', category: 'voice' }
  ],
  'j': [
    { tip: 'Tongue front raised high', category: 'tongue' },
    { tip: 'Lips spread', category: 'lips' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Create y-glide sound', category: 'voice' }
  ]
};

// Diphthong Tips
export const diphthongTips: SymbolPronunciationTips = {
  'aɪ': [
    { tip: 'Start with open mouth', category: 'mouth' },
    { tip: 'Glide to high front position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ɪ/ position', category: 'tongue' }
  ],
  'aʊ': [
    { tip: 'Start with open mouth', category: 'mouth' },
    { tip: 'Glide to high back position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ʊ/ position', category: 'tongue' }
  ],
  'eɪ': [
    { tip: 'Start with mid-front position', category: 'tongue' },
    { tip: 'Glide to high front position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ɪ/ position', category: 'tongue' }
  ],
  'ɔɪ': [
    { tip: 'Start with mid-back position', category: 'tongue' },
    { tip: 'Glide to high front position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ɪ/ position', category: 'tongue' }
  ],
  'oʊ': [
    { tip: 'Start with mid-back position', category: 'tongue' },
    { tip: 'Glide to high back position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ʊ/ position', category: 'tongue' }
  ],
  'eə': [
    { tip: 'Start with mid-front position', category: 'tongue' },
    { tip: 'Glide to schwa position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ə/ position', category: 'tongue' }
  ],
  'ɪə': [
    { tip: 'Start with near-close front position', category: 'tongue' },
    { tip: 'Glide to schwa position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ə/ position', category: 'tongue' }
  ],
  'ʊə': [
    { tip: 'Start with near-close back position', category: 'tongue' },
    { tip: 'Glide to schwa position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ə/ position', category: 'tongue' }
  ]
};

// Combined all tips
export const allPronunciationTips: SymbolPronunciationTips = {
  ...vowelTips,
  ...consonantTips,
  ...diphthongTips
};

// Helper function to get pronunciation tips for a symbol
export function getPronunciationTips(symbol: string): string[] {
  const tips = allPronunciationTips[symbol] || [];
  return tips.map(tip => tip.tip);
}

// Helper function to get tips by category
export function getTipsByCategory(category: 'mouth' | 'tongue' | 'lips' | 'airflow' | 'voice' | 'general', symbol: string): string[] {
  const tips = allPronunciationTips[symbol] || [];
  return tips
    .filter(tip => tip.category === category)
    .map(tip => tip.tip);
}

// Helper function to get all tips with categories
export function getAllTipsWithCategories(symbol: string): PronunciationTip[] {
  return allPronunciationTips[symbol] || [
    { tip: 'Practice listening first', category: 'general' },
    { tip: 'Repeat slowly', category: 'general' },
    { tip: 'Record and compare', category: 'general' }
  ];
}

// Helper function to get tips by symbol category
export function getTipsBySymbolCategory(symbolCategory: 'vowel' | 'consonant' | 'diphthong'): SymbolPronunciationTips {
  switch (symbolCategory) {
    case 'vowel':
      return vowelTips;
    case 'consonant':
      return consonantTips;
    case 'diphthong':
      return diphthongTips;
    default:
      return {};
  }
}

// Helper function to get random tips for a symbol
export function getRandomTips(symbol: string, count: number = 3): string[] {
  const tips = getPronunciationTips(symbol);
  if (tips.length <= count) {
    return tips;
  }
  
  // Shuffle and take first 'count' items
  const shuffled = [...tips].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
