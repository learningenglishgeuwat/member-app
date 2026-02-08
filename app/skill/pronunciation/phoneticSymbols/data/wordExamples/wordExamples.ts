// Word Examples for Phonetic Symbols
// Modular word examples data for IPA symbols

export interface WordExample {
  word: string;
  ipa: string;
}

export interface SymbolWordExamples {
  [key: string]: WordExample[];
}

// Import examples from categorized modules
import { vowelLaxExamples } from './vowelLaxWordExample/VowelLaxWordExample';
import { vowelTenseExamples } from './vowelTenseWordExamples/VowelTenseWordExample';
import { diphthongExamples } from './diphthongWordExample/DiphthongWordExample';
import { consonantVoicelessExamples } from './consonantVoicelessWordExample/ConsonantVoicelessWordExample';
import { consonantVoicedExamples } from './consonantVoicedWordExample/ConsonantVoicedWordExample';

// Combined vowel examples
export const vowelExamples: SymbolWordExamples = {
  ...vowelLaxExamples,
  ...vowelTenseExamples
};

// Combined consonant examples
export const consonantExamples: SymbolWordExamples = {
  ...consonantVoicelessExamples,
  ...consonantVoicedExamples
};

// Combined all examples
export const allWordExamples: SymbolWordExamples = {
  ...vowelExamples,
  ...consonantExamples,
  ...diphthongExamples
};

// Helper function to get word examples for a symbol
export function getWordExamples(symbol: string): WordExample[] {
  // First try direct lookup
  const directExamples = allWordExamples[symbol];
  if (directExamples) {
    return directExamples;
  }
  
  // If not found, try to map symbols to their formatted keys
  const symbolMappings: { [key: string]: string } = {
    // Consonant Voiceless
    'p': 'Consonant‑Voiceless‑p',
    't': 'Consonant‑Voiceless‑t',
    'k': 'Consonant‑Voiceless‑k',
    'f': 'Consonant‑Voiceless‑f',
    'θ': 'Consonant‑Voiceless‑θ',
    's': 'Consonant‑Voiceless‑s',
    'ʃ': 'Consonant‑Voiceless‑ʃ',
    'ʧ': 'Consonant‑Voiceless‑ʧ',
    'h': 'Consonant‑Voiceless‑h',
    
    // Consonant Voiced (some use single chars, others formatted)
    'b': 'Consonant‑Voiced‑b',
    'd': 'Consonant‑Voiced‑d',
    'g': 'Consonant‑Voiced‑g',
    'v': 'Consonant‑Voiced‑v',
    'ð': 'Consonant‑Voiced‑ð',
    'z': 'Consonant‑Voiced‑z',
    'ʒ': 'Consonant‑Voiced‑ʒ',
    'ʤ': 'Consonant‑Voiced‑ʤ',
    'l': 'Consonant‑Voiced‑l',
    'n': 'Consonant‑Voiced‑n',
    'r': 'Consonant‑Voiced‑r',
    'w': 'Consonant‑Voiced‑w',
    'y': 'Consonant‑Voiced‑y',
    'ŋ': 'Consonant‑Voiced‑ŋ',
    
    // Vowel Tense
    'i': 'Vowel‑Tense‑i',
    'u': 'Vowel‑Tense‑u',
    'æ': 'Vowel‑Tense‑æ',
    'ɔ': 'Vowel‑Tense‑ɔ',
    'ɑ': 'Vowel‑Tense‑ɑ'
  };
  
  const mappedKey = symbolMappings[symbol];
  if (mappedKey && allWordExamples[mappedKey]) {
    return allWordExamples[mappedKey];
  }
  
  // Return default example if still not found
  return [{ word: 'example', ipa: '/example/' }];
}

// Helper function to get examples by category
export function getExamplesByCategory(category: 'vowel' | 'consonant' | 'diphthong'): SymbolWordExamples {
  switch (category) {
    case 'vowel':
      return vowelExamples;
    case 'consonant':
      return consonantExamples;
    case 'diphthong':
      return diphthongExamples;
    default:
      return {};
  }
}

// Helper function to get all symbols with examples
export function getAllSymbolsWithExamples(): string[] {
  return Object.keys(allWordExamples);
}

// Helper function to get random examples for a symbol
export function getRandomExamples(symbol: string, count: number = 2): WordExample[] {
  const examples = getWordExamples(symbol);
  if (examples.length <= count) {
    return examples;
  }
  
  // Shuffle and take first 'count' items
  const shuffled = [...examples].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
