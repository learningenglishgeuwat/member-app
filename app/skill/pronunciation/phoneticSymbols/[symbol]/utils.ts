import type { WordExample } from '../data/wordExamples/wordExamples';
import {
  getCategoryDisplayName,
  getPronunciationTips,
  getSymbolDescription,
  getVideoIdBySymbol,
  getWordExamples,
  getUiNote,
} from '../data';
import {
  VOWEL_LAX_SYMBOLS,
  VOWEL_TENSE_SYMBOLS,
  CONSONANT_VOICELESS_SYMBOLS,
  CONSONANT_VOICED_SYMBOLS,
  DIPHTHONG_SYMBOLS,
} from './data/symbolLookups';

export type SymbolDetailSectionState = {
  practice?: boolean;
  tips?: boolean;
  video?: boolean;
  prompt?: boolean;
};

export type SymbolDetailData = {
  description: string;
  category: string;
  examples: WordExample[];
  tips: string[];
  videoId?: string;
  uiNote?: string;
};

export const toTourToken = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function getBaseGroup(category: string): 'vowel' | 'consonant' | 'diphthong' | null {
  if (category.startsWith('vowel')) return 'vowel';
  if (category.startsWith('consonant')) return 'consonant';
  if (category === 'diphthong') return 'diphthong';
  return null;
}

export function getSymbolNavGroups(category: string): Array<{ title: string; symbols: readonly string[] }> {
  const baseGroup = getBaseGroup(category);
  if (baseGroup === 'vowel') {
    return [
      { title: 'Vowel Lax', symbols: VOWEL_LAX_SYMBOLS },
      { title: 'Vowel Tense', symbols: VOWEL_TENSE_SYMBOLS },
    ];
  }
  if (baseGroup === 'consonant') {
    return [
      { title: 'Consonant Voiceless', symbols: CONSONANT_VOICELESS_SYMBOLS },
      { title: 'Consonant Voiced', symbols: CONSONANT_VOICED_SYMBOLS },
    ];
  }
  if (baseGroup === 'diphthong') {
    return [{ title: 'Diphthong Symbols', symbols: DIPHTHONG_SYMBOLS }];
  }
  return [];
}

export function getDefaultSymbolDetailData(): SymbolDetailData {
  return {
    description: 'International Phonetic Alphabet Symbol',
    category: 'Unknown',
    examples: [],
    tips: [],
    videoId: undefined,
  };
}

export function getSymbolDetailData(symbol: string): SymbolDetailData {
  if (!symbol) return getDefaultSymbolDetailData();

  try {
    return {
      description: getSymbolDescription(symbol),
      category: getCategoryDisplayName(symbol),
      examples: getWordExamples(symbol),
      tips: getPronunciationTips(symbol),
      videoId: getVideoIdBySymbol(symbol),
      uiNote: getUiNote(symbol),
    };
  } catch (error) {
    console.error('Failed to resolve symbol data:', error);
    return getDefaultSymbolDetailData();
  }
}

export function formatIpaSymbolForPrompt(symbol: string): string {
  const trimmed = symbol.trim();
  if (!trimmed) return '/?/';
  const core = trimmed.replace(/^\/|\/+$/g, '');
  return `/${core}/`;
}

export function buildAccentEvaluationPrompt(focusIpaSymbol: string): string {
  return `Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional yang sangat kritis. 1. Transkripsikan semua kata yang saya ucapkan dalam rekaman ini. 2. Analisis setiap kata tersebut dengan fokus pada American Accent (General American) terutama simbol ${focusIpaSymbol}. Nilai dan beri umpan balik pada pengucapan vokal dan konsonan. 3. Format Output: Sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kata yang diucapkan. - Kolom 2: Status Kualitatif ('🟢 Sangat Bagus', '🔵 Bagus', '🟠 Perlu sedikit perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan Balik spesifik yang menjelaskan secara singkat apa yang perlu diperbaiki. Berikan skor keseluruhan dari 1-100 berdasarkan akurasi fonetik American Accent. Sebutkan secara terpisah daftar kata yang ada di teks namun tidak ditemukan dalam rekaman audio. Berikan status kualitatif pada hasil keseluruhan dari seluruh daftar kata baik itu dari kata yang disebutkan audio atau tidak. Berikan penilaian yang jujur. Jika jumlah kata yang diucapkan kurang dari 100% dari daftar yang diberikan, berikan penalti skor secara proporsional. (Contoh: Hanya 50% kata yang diucapkan = Skor maksimal adalah 50). Ini bobotnya:🟢 Sangat Bagus = 100%, 🔵 Bagus = 80%, 🟠 Perlu sedikit perbaikan = 65%, 🔴 Perlu Perbaikan = 50%`;
}
