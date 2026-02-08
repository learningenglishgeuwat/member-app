// Index file for phonetic symbols detail modular data
// Centralized exports for all phonetic symbols data

// Export word examples
export * from './wordExamples/wordExamples';
export {
  getWordExamples,
  getExamplesByCategory,
  getAllSymbolsWithExamples,
  getRandomExamples
} from './wordExamples/wordExamples';

// Export symbol descriptions
export * from './symbolDescriptions';
export {
  getSymbolDescription,
  getSymbolCategory,
  getSymbolSubcategory,
  getDescriptionsByCategory,
  getSymbolsByCategory,
  getSymbolsBySubcategory,
  getCategoryDisplayName
} from './symbolDescriptions';

// Export pronunciation tips
export * from './pronunciationTips/PronunciationTips';

// Export video IDs
export * from './videoIds';
export {
  getVideoIdBySymbol,
  getVideoIdByCategoryAndSymbol,
  getVideoMappingsByCategory,
  getAllVideoMappings
} from './videoIds';

// Export common letters data
export * from './commonLetters/CommonLetters';
export {
  getCommonLettersByCategory,
  getCommonLetterByIPA,
  getCommonLetterByLetter,
  getAllCommonLetters,
  getCommonLettersCategories
} from './commonLetters/CommonLetters';

// Re-export types for convenience
export type { WordExample, SymbolWordExamples } from './wordExamples/wordExamples';
export type { SymbolDescription, SymbolDescriptions } from './symbolDescriptions';
export type { PronunciationTip, SymbolPronunciationTips } from './pronunciationTips/PronunciationTips';
export type { VideoMapping, VideoCategory } from './videoIds';
export type { CommonLetter, CommonLettersCategory } from './commonLetters/CommonLetters';
