// Pronunciation tips for phonetic symbols
// Aggregates category datasets and exposes helper selectors.

import type { PronunciationTip, SymbolPronunciationTips } from './types'
import { vowelTips } from './vowelTips'
import { consonantTips } from './consonantTips'
import { diphthongTips } from './diphthongTips'

export type { PronunciationTip, SymbolPronunciationTips } from './types'
export { vowelTips } from './vowelTips'
export { consonantTips } from './consonantTips'
export { diphthongTips } from './diphthongTips'

export const allPronunciationTips: SymbolPronunciationTips = {
  ...vowelTips,
  ...consonantTips,
  ...diphthongTips,
}

const DEFAULT_PRONUNCIATION_TIPS: PronunciationTip[] = [
  { tip: 'Posisikan lidah sesuai target bunyi sebelum suara keluar.', category: 'tongue' },
  { tip: 'Atur bukaan mulut dan bibir agar kualitas bunyi tetap jelas.', category: 'mouth' },
  { tip: 'Jaga aliran udara stabil, lalu ulangi perlahan sebelum menambah kecepatan.', category: 'airflow' },
]

// Helper function to get pronunciation tips for a symbol
export function getPronunciationTips(symbol: string): string[] {
  const tips = allPronunciationTips[symbol] || DEFAULT_PRONUNCIATION_TIPS
  return tips.map((tip) => tip.tip)
}

// Helper function to get tips by category
export function getTipsByCategory(
  category: 'mouth' | 'tongue' | 'lips' | 'airflow' | 'voice' | 'general',
  symbol: string
): string[] {
  const tips = allPronunciationTips[symbol] || DEFAULT_PRONUNCIATION_TIPS
  return tips
    .filter((tip) => tip.category === category)
    .map((tip) => tip.tip)
}

// Helper function to get all tips with categories
export function getAllTipsWithCategories(symbol: string): PronunciationTip[] {
  return allPronunciationTips[symbol] || DEFAULT_PRONUNCIATION_TIPS
}

// Helper function to get tips by symbol category
export function getTipsBySymbolCategory(
  symbolCategory: 'vowel' | 'consonant' | 'diphthong'
): SymbolPronunciationTips {
  switch (symbolCategory) {
    case 'vowel':
      return vowelTips
    case 'consonant':
      return consonantTips
    case 'diphthong':
      return diphthongTips
    default:
      return {}
  }
}

// Helper function to get random tips for a symbol
export function getRandomTips(symbol: string, count: number = 3): string[] {
  const tips = getPronunciationTips(symbol)
  if (tips.length <= count) {
    return tips
  }

  // Shuffle and take first 'count' items
  const shuffled = [...tips].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
