// Common letters and IPA mappings used by the Common Letters modal.
// The number of mappings/examples per symbol is intentionally dynamic.

export type { CommonLetter, CommonLettersCategory } from './types';

import {
  laxVowelLetters,
  tenseVowelLetters,
  diphthongLetters,
  voicelessConsonantLetters,
  voicedConsonantLetters,
} from './categories';

import type { CommonLetter, CommonLettersCategory } from './types';

export const commonLettersData: CommonLettersCategory[] = [
  {
    category: 'LAX VOWEL',
    letters: laxVowelLetters,
  },
  {
    category: 'TENSE VOWEL',
    letters: tenseVowelLetters,
  },
  {
    category: 'DIPHTHONG',
    letters: diphthongLetters,
  },
  {
    category: 'CONSONANT',
    letters: [...voicelessConsonantLetters, ...voicedConsonantLetters],
  },
];

// Helper functions to get common letters data
export const getCommonLettersByCategory = (category: string): CommonLetter[] => {
  const categoryData = commonLettersData.find((cat) => cat.category === category);
  return categoryData ? categoryData.letters : [];
};

export const getCommonLetterByIPA = (ipaSymbol: string): CommonLetter | undefined => {
  for (const category of commonLettersData) {
    const letter = category.letters.find((item) => item.ipaSymbol === ipaSymbol);
    if (letter) return letter;
  }
  return undefined;
};

export const getCommonLetterByLetter = (letter: string): CommonLetter[] => {
  const results: CommonLetter[] = [];
  for (const category of commonLettersData) {
    const letters = category.letters.filter((item) => item.letter.toLowerCase() === letter.toLowerCase());
    results.push(...letters);
  }
  return results;
};

export const getAllCommonLetters = (): CommonLetter[] => {
  return commonLettersData.flatMap((category) => category.letters);
};

export const getCommonLettersCategories = (): string[] => {
  return commonLettersData.map((category) => category.category);
};
