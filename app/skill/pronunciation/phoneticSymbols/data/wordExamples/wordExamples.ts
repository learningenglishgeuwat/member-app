// Word Examples for Phonetic Symbols
// Modular word examples data for IPA symbols

export type WordPosition = 'B' | 'M' | 'E' | 'beginning' | 'middle' | 'ending';

export interface WordExample {
  word: string;
  // `ipa` kept for backward compatibility and will default to American IPA when present.
  ipa?: string;
  // Explicit fields to store both variants when available.
  americanIpa?: string;
  britishIpa?: string;
  // Position in word: beginning / middle / ending, or B / M / E legacy values.
  position?: WordPosition;
}

export interface PositionGroups {
  beginning?: WordExample[];
  middle?: WordExample[];
  ending?: WordExample[];
}

export type WordExampleSource = WordExample[] | PositionGroups;

export interface SymbolWordExamples {
  [key: string]: WordExample[];
}

export type SymbolWordExamplesSource = Record<string, WordExampleSource>;

// Position structure metadata: defines start/end indices and position letter for each symbol
export interface PositionRange {
  start: number;
  end: number;
  position: 'B' | 'M' | 'E';
}

export const symbolPositionMap: Record<string, PositionRange[]> = {
  // Vowel Lax - based on actual data structure
  'ʌ': [
    { start: 0, end: 10, position: 'B' },
    { start: 10, end: 30, position: 'M' },
  ],
  'ɪ': [
    { start: 0, end: 10, position: 'B' },
    { start: 10, end: 30, position: 'M' },
  ],
  'ʊ': [{ start: 0, end: 30, position: 'M' }],
  'ɛ': [
    { start: 0, end: 15, position: 'B' },
    { start: 15, end: 30, position: 'M' },
  ],
  'ə': [
    { start: 0, end: 10, position: 'B' },
    { start: 10, end: 20, position: 'M' },
    { start: 20, end: 30, position: 'E' },
  ],
  'ɚ': [
    { start: 0, end: 15, position: 'M' },
    { start: 15, end: 30, position: 'E' },
  ],

  // Vowel Tense - based on actual data structure (30 items each: 10-10-10)
  'Vowel‑Tense‑ɑ': [
    { start: 0, end: 10, position: 'B' },
    { start: 10, end: 20, position: 'M' },
    { start: 20, end: 30, position: 'E' },
  ],
  'Vowel‑Tense‑i': [
    { start: 0, end: 10, position: 'B' },
    { start: 10, end: 20, position: 'M' },
    { start: 20, end: 30, position: 'E' },
  ],
  'Vowel‑Tense‑u': [
    { start: 0, end: 10, position: 'B' },
    { start: 10, end: 20, position: 'M' },
    { start: 20, end: 30, position: 'E' },
  ],
  'Vowel‑Tense‑æ': [
    { start: 0, end: 16, position: 'B' },
    { start: 16, end: 31, position: 'M' },
  ],
  'Vowel‑Tense‑ɔ': [
    { start: 0, end: 10, position: 'B' },
    { start: 10, end: 20, position: 'M' },
    { start: 20, end: 30, position: 'E' },
  ],
};


// Import examples from categorized modules
import { vowelLaxExamples } from './vowelLaxWordExample/VowelLaxWordExample';
import { vowelTenseExamples } from './vowelTenseWordExamples/VowelTenseWordExample';
import { diphthongExamples } from './diphthongWordExample/DiphthongWordExample';
import { consonantVoicelessExamples } from './consonantVoicelessWordExample/ConsonantVoicelessWordExample';
import { consonantVoicedExamples } from './consonantVoicedWordExample/ConsonantVoicedWordExample';

function flattenPositionGroups(groups: WordExampleSource): WordExample[] {
  if (Array.isArray(groups)) {
    return groups;
  }

  const out: WordExample[] = [];
  if (groups.beginning) {
    out.push(...groups.beginning.map((g) => ({ ...g, position: 'beginning' as WordPosition })));
  }
  if (groups.middle) {
    out.push(...groups.middle.map((g) => ({ ...g, position: 'middle' as WordPosition })));
  }
  if (groups.ending) {
    out.push(...groups.ending.map((g) => ({ ...g, position: 'ending' as WordPosition })));
  }

  return out;
}

function extractUiNotes(source: Record<string, WordExampleSource>): Record<string, string | undefined> {
  const map: Record<string, string | undefined> = {};
  for (const [symbol, groups] of Object.entries(source)) {
    if (!Array.isArray(groups) && (groups as any).uiNote) {
      map[symbol] = (groups as any).uiNote as string;
    }
  }
  return map;
}

// Extract per-symbol UI notes from nested sources (if provided)
export const symbolUiNotes: Record<string, string | undefined> = {
  ...extractUiNotes(vowelLaxExamples),
  ...extractUiNotes(vowelTenseExamples),
  ...extractUiNotes(diphthongExamples),
  ...extractUiNotes(consonantVoicelessExamples),
  ...extractUiNotes(consonantVoicedExamples),
};

// Combined vowel examples
export const vowelExamples: SymbolWordExamples = {
  ...Object.fromEntries(
    Object.entries(vowelLaxExamples).map(([symbol, groups]) => [symbol, flattenPositionGroups(groups)])
  ),
  ...Object.fromEntries(
    Object.entries(vowelTenseExamples).map(([symbol, groups]) => [symbol, flattenPositionGroups(groups)])
  ),
};

// Combined consonant examples
export const consonantExamples: SymbolWordExamples = {
  ...Object.fromEntries(
    Object.entries(consonantVoicelessExamples).map(([symbol, examples]) => [symbol, flattenPositionGroups(examples)])
  ),
  ...Object.fromEntries(
    Object.entries(consonantVoicedExamples).map(([symbol, examples]) => [symbol, flattenPositionGroups(examples)])
  ),
};

// Combined all examples - Urutan disesuaikan dengan Master: Vowel Lax -> Vowel Tense -> Diphthong -> Consonant Voiceless -> Consonant Voiced
export const allWordExamples: SymbolWordExamples = {
  ...Object.fromEntries(
    Object.entries(vowelLaxExamples).map(([symbol, groups]) => [symbol, flattenPositionGroups(groups)])
  ),
  ...Object.fromEntries(
    Object.entries(vowelTenseExamples).map(([symbol, groups]) => [symbol, flattenPositionGroups(groups)])
  ),
  ...Object.fromEntries(
    Object.entries(diphthongExamples).map(([symbol, examples]) => [symbol, flattenPositionGroups(examples)])
  ),
  ...Object.fromEntries(
    Object.entries(consonantVoicelessExamples).map(([symbol, examples]) => [symbol, flattenPositionGroups(examples)])
  ),
  ...Object.fromEntries(
    Object.entries(consonantVoicedExamples).map(([symbol, examples]) => [symbol, flattenPositionGroups(examples)])
  ),
};

// Helper function to normalize symbol key (matching symbolDescriptions normalization)
function normalizeSymbolForExamples(symbol: string): string {
  const s = symbol.trim();
  if (s === 'dʒ') return 'ʤ';
  if (s === 'tʃ') return 'ʧ';
  if (s === 'y') return 'j';
  // Normalize variants that refer to the same diphthong. Use the actual
  // IPA key 'ɛr' (epsilon + r) because the examples data uses that key.
  if (s === 'eə' || s === 'er') return 'ɛr';
  if (s === 'ɪə' || s === 'iə') return 'ɪr';
  if (s === 'ʊə') return 'ʊr';
  return s;
}

export function getWordExamples(symbol: string): WordExample[] {
  // Normalize symbol first (convert multi-char to single char variants)
  const normalizedSymbol = normalizeSymbolForExamples(symbol);
  
  // First try direct lookup
  const directExamples = allWordExamples[normalizedSymbol];
  if (directExamples) {
    return directExamples;
  }
  
  // Try to map symbols to their formatted keys with synchronized order
  const symbolMappings: { [key: string]: string } = {
    // Vowel Lax use single-char keys directly (ʌ, ɪ, ʊ, ɛ, ə, ɚ)
    
    // Vowel Tense (Master order: ɑ, i, u, æ, ɔ)
    'ɑ': 'Vowel‑Tense‑ɑ',
    'i': 'Vowel‑Tense‑i',
    'u': 'Vowel‑Tense‑u',
    'æ': 'Vowel‑Tense‑æ',
    'ɔ': 'Vowel‑Tense‑ɔ',
    
    // Legacy Diphthong Keys (Master order: ɪr, ɛr, ʊr)
    'ɪə': 'ɪr',
    'iə': 'ɪr',
    // map ASCII/alternate forms to the IPA key used in diphthongExamples
    'eə': 'ɛr',
    'er': 'ɛr',
    'ʊə': 'ʊr',
    
    // Consonant Voiceless (Master order: p, t, k, f, θ, s, ʃ, ʧ, h)
    'p': 'Consonant‑Voiceless‑p',
    't': 'Consonant‑Voiceless‑t',
    'k': 'Consonant‑Voiceless‑k',
    'f': 'Consonant‑Voiceless‑f',
    'θ': 'Consonant‑Voiceless‑θ',
    's': 'Consonant‑Voiceless‑s',
    'ʃ': 'Consonant‑Voiceless‑ʃ',
    'ʧ': 'Consonant‑Voiceless‑tʃ',
    'tʃ': 'Consonant‑Voiceless‑tʃ',
    'h': 'Consonant‑Voiceless‑h',
    
    // Consonant Voiced (Master order: b, d, g, v, ð, z, ʒ, ʤ, l, m, n, ŋ, r, w, j)
    'b': 'Consonant‑Voiced‑b',
    'd': 'Consonant‑Voiced‑d',
    'g': 'Consonant‑Voiced‑ɡ',
    'v': 'Consonant‑Voiced‑v',
    'ð': 'Consonant‑Voiced‑ð',
    'z': 'Consonant‑Voiced‑z',
    'ʒ': 'Consonant‑Voiced‑ʒ',
    'ʤ': 'Consonant‑Voiced‑dʒ',
    'dʒ': 'Consonant‑Voiced‑dʒ',
    'l': 'Consonant‑Voiced‑l',
    'm': 'Consonant‑Voiced‑m',
    'n': 'Consonant‑Voiced‑n',
    'ŋ': 'Consonant‑Voiced‑ŋ',
    'r': 'Consonant‑Voiced‑r',
    'w': 'Consonant‑Voiced‑w',
    'y': 'Consonant‑Voiced‑j',
    'j': 'Consonant‑Voiced‑j'
  };
  
  const mappedKey = symbolMappings[normalizedSymbol];
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
      return Object.fromEntries(
        Object.entries(diphthongExamples).map(([symbol, examples]) => [symbol, flattenPositionGroups(examples as WordExampleSource)])
      ) as SymbolWordExamples;
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

// Return the UI note (if any) for a symbol using the same normalization/mapping rules
export function getUiNote(symbol: string): string | undefined {
  const normalizedSymbol = normalizeSymbolForExamples(symbol);
  // direct
  if (symbolUiNotes[normalizedSymbol]) return symbolUiNotes[normalizedSymbol];

  // mapping fallbacks (reuse the same mappings from getWordExamples)
  const symbolMappings: { [key: string]: string } = {
    'ɑ': 'Vowel‑Tense‑ɑ',
    'i': 'Vowel‑Tense‑i',
    'u': 'Vowel‑Tense‑u',
    'æ': 'Vowel‑Tense‑æ',
    'ɔ': 'Vowel‑Tense‑ɔ',
    'ɪə': 'ɪr',
    'iə': 'ɪr',
    'eə': 'ɛr',
    'er': 'ɛr',
    'ʊə': 'ʊr',
    'p': 'Consonant‑Voiceless‑p',
    't': 'Consonant‑Voiceless‑t',
    'k': 'Consonant‑Voiceless‑k',
    'f': 'Consonant‑Voiceless‑f',
    'θ': 'Consonant‑Voiceless‑θ',
    's': 'Consonant‑Voiceless‑s',
    'ʃ': 'Consonant‑Voiceless‑ʃ',
    'ʧ': 'Consonant‑Voiceless‑tʃ',
    'tʃ': 'Consonant‑Voiceless‑tʃ',
    'h': 'Consonant‑Voiceless‑h',
    'b': 'Consonant‑Voiced‑b',
    'd': 'Consonant‑Voiced‑d',
    'g': 'Consonant‑Voiced‑ɡ',
    'v': 'Consonant‑Voiced‑v',
    'ð': 'Consonant‑Voiced‑ð',
    'z': 'Consonant‑Voiced‑z',
    'ʒ': 'Consonant‑Voiced‑ʒ',
    'ʤ': 'Consonant‑Voiced‑dʒ',
    'dʒ': 'Consonant‑Voiced‑dʒ',
    'l': 'Consonant‑Voiced‑l',
    'm': 'Consonant‑Voiced‑m',
    'n': 'Consonant‑Voiced‑n',
    'ŋ': 'Consonant‑Voiced‑ŋ',
    'r': 'Consonant‑Voiced‑r',
    'w': 'Consonant‑Voiced‑w',
    'y': 'Consonant‑Voiced‑j',
    'j': 'Consonant‑Voiced‑j'
  };

  const mappedKey = symbolMappings[normalizedSymbol];
  if (mappedKey) return symbolUiNotes[mappedKey];

  return undefined;
}