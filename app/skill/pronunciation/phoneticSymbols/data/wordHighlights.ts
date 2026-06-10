// Word highlight patterns generated from commonLetters category data.
// This file now extracts target letter patterns from the examples defined in commonLetters categories.

import { getAllCommonLetters } from './commonLetters/CommonLetters';
import { allWordExamples } from './wordExamples/wordExamples';
import { minimalPairsData } from '../MinimalPairs/data/index';

export type WordHighlightOverrides = Record<string, Record<string, string[]>>;

const COMMON_SYMBOL_ALIASES: Record<string, string[]> = {
  er: ['e\u0259', 'e\u025br'],
  'e\u0259': ['er', 'e\u025br'],
  'e\u025br': ['er', 'e\u0259'],
  '\u026ar': ['\u026a\u0259', 'i\u0259'],
  '\u026a\u0259': ['\u026ar', 'i\u0259'],
  'i\u0259': ['\u026ar', '\u026a\u0259'],
  '\u028ar': ['\u028a\u0259'],
  '\u028a\u0259': ['\u028ar'],
  '\u02a7': ['t\u0283'],
  't\u0283': ['\u02a7'],
  '\u02a4': ['d\u0292'],
  'd\u0292': ['\u02a4'],
  '\u025a': ['\u0259'],
  '\u0259': ['\u025a'],
  e: ['\u025b'],
  '\u025b': ['e'],
};

const normalizeIpaSymbols = (rawSymbol: string): string[] => {
  const matches = rawSymbol.match(/\/([^\/]+)\//g) ?? [];
  return matches.map((match) => match.replace(/\//g, '').trim());
};

const normalizePattern = (rawPattern: string): string =>
  rawPattern.trim().split(/\s*\(|\s+/)[0].trim();

const normalizeHighlightPattern = (pattern: string): string =>
  pattern.replace(/-/g, '').trim();

const patternMatchesWord = (word: string, pattern: string): boolean => {
  const normalizedPattern = normalizeHighlightPattern(pattern);
  if (!normalizedPattern) return false;

  if (normalizedPattern.includes('_')) {
    const regex = new RegExp(normalizedPattern.replace(/_/g, '.'), 'i');
    return regex.test(word);
  }

  return word.includes(normalizedPattern.toLowerCase());
};

const getAllSymbolPatterns = (): Record<string, string[]> => {
  const patternsBySymbol: Record<string, string[]> = {};

  getAllCommonLetters().forEach((letter) => {
    const symbols = normalizeIpaSymbols(letter.ipaSymbol);

    letter.examples.forEach((example) => {
      const arrowIndex = example.indexOf('->');
      if (arrowIndex === -1) return;

      const rawPattern = example.slice(0, arrowIndex).trim();
      const pattern = normalizePattern(rawPattern);
      const normalizedPattern = normalizeHighlightPattern(pattern);
      if (!normalizedPattern) return;

      symbols.forEach((symbol) => {
        patternsBySymbol[symbol] = patternsBySymbol[symbol] ?? [];
        if (!patternsBySymbol[symbol].includes(normalizedPattern)) {
          patternsBySymbol[symbol].push(normalizedPattern);
        }
      });
    });
  });

  return patternsBySymbol;
};

const getHighlightWords = (): Set<string> => {
  const words = new Set<string>();

  getAllCommonLetters().forEach((letter) => {
    letter.examples.forEach((example) => {
      const arrowIndex = example.indexOf('->');
      if (arrowIndex === -1) return;
      example
        .slice(arrowIndex + 2)
        .split(',')
        .map((word) => word.trim().replace(/\.$/, '').toLowerCase())
        .filter(Boolean)
        .forEach((word) => words.add(word));
    });
  });

  Object.values(allWordExamples).flat().forEach((item) => {
    words.add(item.word.toLowerCase());
  });

  minimalPairsData.forEach((pair) => {
    pair.words.forEach((wordPair) => {
      words.add(wordPair.a.toLowerCase());
      words.add(wordPair.b.toLowerCase());
    });
  });

  return words;
};

const MANUAL_WORD_HIGHLIGHT_OVERRIDES: WordHighlightOverrides = {
  'oʊ': {
    sew: ['ew'],
    sewed: ['ew'],
  },
};

const buildWordHighlightOverrides = (): WordHighlightOverrides => {
  const overrides: WordHighlightOverrides = {};
  const patternsBySymbol = getAllSymbolPatterns();
  const highlightWords = getHighlightWords();

  Object.entries(patternsBySymbol).forEach(([symbol, patterns]) => {
    highlightWords.forEach((word) => {
      const matchedPatterns = patterns.filter((pattern) => patternMatchesWord(word, pattern));
      if (matchedPatterns.length === 0) return;

      overrides[symbol] = overrides[symbol] ?? {};
      overrides[symbol][word] = Array.from(new Set(matchedPatterns));
    });
  });

  Object.entries(MANUAL_WORD_HIGHLIGHT_OVERRIDES).forEach(([symbol, entries]) => {
    overrides[symbol] = overrides[symbol] ?? {};
    Object.entries(entries).forEach(([word, patterns]) => {
      overrides[symbol][word] = Array.from(
        new Set([...(overrides[symbol][word] ?? []), ...patterns]),
      );
    });
  });

  Object.entries(COMMON_SYMBOL_ALIASES).forEach(([alias, mappedSymbols]) => {
    overrides[alias] = overrides[alias] ?? {};

    mappedSymbols.forEach((mappedSymbol) => {
      const mappedEntries = overrides[mappedSymbol] ?? {};
      Object.entries(mappedEntries).forEach(([word, patterns]) => {
        overrides[alias][word] = Array.from(
          new Set([...(overrides[alias][word] ?? []), ...patterns]),
        );
      });
    });
  });

  return overrides;
};

export const WORD_HIGHLIGHT_OVERRIDES = buildWordHighlightOverrides();
