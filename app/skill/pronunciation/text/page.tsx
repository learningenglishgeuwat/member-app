'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronDown, Copy } from 'lucide-react';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../components/buttonSavedProgress';
import { primeBestEnglishVoice } from '../final-sound-new/tts-utils';
import { createUtterance, stopSpeech } from '@/lib/tts/speech';
import { MATERIALS, TOPIC_HIGHLIGHTS, type TextMaterial, type TopicHighlightConfig } from './data/textData';
import './text.css';

const RecordingControlsButton = dynamic(() => import('../../components/RecordingControlsButton'), {
  ssr: false,
});

type TabKey = 'origin' | 'phonetic';
type TextSectionUiState = {
  practiceOpen?: boolean;
  promptOpen?: boolean;
};
const TEXT_TAB_PROGRESS_STORAGE_KEY = 'pronunciationTextTabProgress';
const TEXT_SECTION_UI_STATE_STORAGE_KEY = 'pronunciationTextSectionUiState';
const VISIBLE_MATERIALS = MATERIALS.filter((item) => item.id !== 'phonetic-symbols');
const APPLIED_TEXT_DEFAULT_EVALUATION_PROMPT =
  "Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan paragraf yang saya bacakan pada section Applied Pronunciation Text. 2. Analisis pengucapan dengan fokus pada American Accent (General American), terutama kejelasan bunyi, akurasi stress, intonation, serta kelancaran ritme antar-kalimat. 3. Format output: sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kalimat/frasa yang diucapkan. - Kolom 2: Status kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟡 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan balik spesifik yang menjelaskan bagian pronunciation mana yang perlu diperbaiki.";

const APPLIED_TEXT_EVALUATION_PROMPTS: Record<string, string> = {
  'final-sound-s-es':
    "Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan paragraf yang saya bacakan pada section Applied Pronunciation Text topik Final Sound S/ES. 2. Analisis pengucapan dengan fokus pada American Accent (General American), terutama akurasi final sound S/ES (/s/, /z/, /ɪz/), kejelasan bunyi akhir kata, dan konsistensi grammar endings saat membaca teks. 3. Format output: sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kalimat/frasa yang diucapkan (fokus ending -s/-es). - Kolom 2: Status kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟡 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan balik spesifik yang menjelaskan bunyi akhir S/ES mana yang perlu diperbaiki.",
  'final-sound-d-ed':
    "Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan paragraf yang saya bacakan pada section Applied Pronunciation Text topik Final Sound D/ED. 2. Analisis pengucapan dengan fokus pada American Accent (General American), terutama akurasi final sound D/ED (/t/, /d/, /ɪd/), kejelasan bunyi akhir bentuk past tense, dan konsistensi pelafalan ending -ed saat membaca teks. 3. Format output: sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kalimat/frasa yang diucapkan (fokus ending -d/-ed). - Kolom 2: Status kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟡 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan balik spesifik yang menjelaskan bunyi akhir D/ED mana yang perlu diperbaiki.",
  'american-t':
    "Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan paragraf yang saya bacakan pada section Applied Pronunciation Text topik American T. 2. Analisis pengucapan dengan fokus pada American Accent (General American), terutama akurasi flap T (/ɾ/), glottal stop (/ʔ/), dan final T sebelum konsonan dalam frasa/kalimat. 3. Format output: sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kalimat/frasa yang diucapkan (fokus pola American T). - Kolom 2: Status kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟡 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan balik spesifik yang menjelaskan bagian American T mana yang perlu diperbaiki.",
};

const readTextTabProgressFromStorage = (): Partial<Record<TabKey, number>> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(TEXT_TAB_PROGRESS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    const next: Partial<Record<TabKey, number>> = {};
    if (typeof parsed.origin === 'number' && Number.isFinite(parsed.origin)) {
      next.origin = parsed.origin;
    }
    if (typeof parsed.phonetic === 'number' && Number.isFinite(parsed.phonetic)) {
      next.phonetic = parsed.phonetic;
    }
    return next;
  } catch {
    return {};
  }
};

const writeTextTabProgressToStorage = (payload: Partial<Record<TabKey, number>>) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TEXT_TAB_PROGRESS_STORAGE_KEY, JSON.stringify(payload));
};

const readTextSectionUiStateFromStorage = (): TextSectionUiState => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(TEXT_SECTION_UI_STATE_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      practiceOpen: typeof parsed.practiceOpen === 'boolean' ? parsed.practiceOpen : undefined,
      promptOpen: typeof parsed.promptOpen === 'boolean' ? parsed.promptOpen : undefined,
    };
  } catch {
    return {};
  }
};

const writeTextSectionUiStateToStorage = (payload: TextSectionUiState) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TEXT_SECTION_UI_STATE_STORAGE_KEY, JSON.stringify(payload));
};

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const STOP_WORDS = new Set([
  'this',
  'that',
  'with',
  'from',
  'into',
  'only',
  'not',
  'just',
  'more',
  'than',
  'part',
  'topic',
  'section',
  'practice'
]);

const S_ES_STRICT_TERMS = new Set(
  (TOPIC_HIGHLIGHTS['final-sound-s-es']?.letterTerms ?? []).map((term) => term.toLowerCase())
);
const D_ED_STRICT_TERMS = new Set(
  (TOPIC_HIGHLIGHTS['final-sound-d-ed']?.letterTerms ?? []).map((term) => term.toLowerCase())
);

const S_ES_EXCLUDED_WORDS = new Set([
  'is',
  'was',
  'this',
  'his',
  'as',
  'us',
  'yes',
  'plus'
]);
const D_ED_EXCLUDED_WORDS = new Set(['red', 'bed', 'need']);

const isPlainWord = (term: string): boolean => /^[A-Za-z]+$/.test(term);

const toWordVariants = (term: string): string[] => {
  const value = term.trim();
  if (!isPlainWord(value) || value.length < 4) return [value];

  const variants = new Set<string>([value]);
  const lower = value.toLowerCase();

  if (value.endsWith('e')) {
    variants.add(`${value}d`);
    variants.add(`${value.slice(0, -1)}ing`);
  } else {
    variants.add(`${value}ed`);
    variants.add(`${value}ing`);
  }

  if (value.endsWith('y') && !/[aeiou]y$/i.test(value)) {
    variants.add(`${value.slice(0, -1)}ies`);
  } else if (!value.endsWith('s')) {
    variants.add(`${value}s`);
  }

  if (lower.endsWith('tion')) variants.add(`${value.slice(0, -3)}e`);
  if (lower.endsWith('s')) variants.add(value.slice(0, -1));

  return [...variants].filter(Boolean);
};

const extractTitleTerms = (title: string): TopicHighlightConfig => {
  const fullTitle = title.trim();
  const parts = fullTitle
    .split(/[^A-Za-z/]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const keyTerms = [fullTitle, ...parts.filter((part) => part.length >= 5 && !part.includes('/'))];
  const letterTerms = parts.filter((part) => part.includes('/'));

  return {
    keyTerms,
    letterTerms
  };
};

const extractFocusTerms = (focus: string): TopicHighlightConfig => {
  const slashAndSuffix = focus.match(/\/[^/]+\/|-[A-Za-z]+|[A-Za-z]+\/[A-Za-z]+/g) ?? [];
  return {
    keyTerms: [],
    letterTerms: slashAndSuffix
  };
};

const isSEndingTargetWord = (rawWord: string): boolean => {
  const word = rawWord.toLowerCase();
  if (!/^[a-z]+$/.test(word)) return false;
  if (S_ES_EXCLUDED_WORDS.has(word)) return false;
  if (S_ES_STRICT_TERMS.has(word)) return true;

  if (word.endsWith('es')) return word.length >= 4;
  if (!word.endsWith('s')) return false;
  if (word.length < 4) return false;
  if (/(ss|us|is)$/.test(word)) return false;
  return true;
};

const highlightSEndingsByRule = (text: string, keyPrefix: string) => {
  const strictTokens = [...S_ES_STRICT_TERMS].sort((a, b) => b.length - a.length);
  const strictRegex =
    strictTokens.length > 0 ? new RegExp(`(${strictTokens.map(escapeRegExp).join('|')})`, 'gi') : null;
  const strictChunks = strictRegex ? text.split(strictRegex) : [text];

  return strictChunks.flatMap((chunk, chunkIndex) => {
    if (!chunk) return [];

    const normalizedChunk = chunk.toLowerCase();
    if (S_ES_STRICT_TERMS.has(normalizedChunk)) {
      return (
        <span key={`${keyPrefix}-strict-${chunkIndex}`} className='text-hl-letter'>
          {chunk}
        </span>
      );
    }

    const wordChunks = chunk.split(/(\b[A-Za-z']+\b)/g);
    return wordChunks.map((wordChunk, wordIndex) => {
      if (!wordChunk) return null;

      if (isSEndingTargetWord(wordChunk)) {
        return (
          <span key={`${keyPrefix}-word-${chunkIndex}-${wordIndex}`} className='text-hl-letter'>
            {wordChunk}
          </span>
        );
      }

      return (
        <React.Fragment key={`${keyPrefix}-plain-${chunkIndex}-${wordIndex}`}>
          {wordChunk}
        </React.Fragment>
      );
    });
  });
};

const stripPhoneticTokenEdges = (token: string): string =>
  token.replace(/^[\/()[\]{}.,;:!?'"`]+/, '').replace(/[\/()[\]{}.,;:!?'"`]+$/, '');

const getWordOrdinalAtCharIndex = (text: string, charIndex: number): number =>
  (text.slice(0, charIndex).match(/[A-Za-z']+/g) ?? []).length;

const getOriginTargetWordOrdinals = (
  originParagraph: string,
  materialId: 'final-sound-s-es' | 'final-sound-d-ed'
) => {
  const words = originParagraph.match(/[A-Za-z']+/g) ?? [];
  const ordinals = new Set<number>();

  words.forEach((word, index) => {
    if (materialId === 'final-sound-s-es' && isSEndingTargetWord(word)) {
      ordinals.add(index);
      return;
    }

    if (materialId === 'final-sound-d-ed' && isDEdTargetWord(word)) {
      ordinals.add(index);
    }
  });

  const patternMap =
    materialId === 'final-sound-s-es'
      ? [/S\/ES/gi, /\/s\//gi, /\/z\//gi, /\/[iɪ]z\//gi, /-s\b/gi, /-es\b/gi]
      : [/D\/ED/gi, /\/t\//gi, /\/d\//gi, /\/[iɪ]d\//gi, /-ed\b/gi];

  patternMap.forEach((pattern) => {
    for (const match of originParagraph.matchAll(pattern)) {
      const matchIndex = match.index ?? 0;
      const ordinal = getWordOrdinalAtCharIndex(originParagraph, matchIndex);
      ordinals.add(ordinal);
    }
  });

  return { totalWords: words.length, targetOrdinals: [...ordinals].sort((a, b) => a - b) };
};

const D_ED_PHONETIC_EXCLUDED = new Set([
  'ænd',
  'ənd',
  'ðæt',
  'bʌt',
  'ɪt',
  'æt',
  'mʌst',
  'pæst',
  'faʊnd'
]);

const S_ES_PHONETIC_EXCLUDED = new Set(['ðɪs', 'ɪz', 'hɪz']);

const isPhoneticCandidateForMaterial = (
  coreRaw: string,
  materialId: 'final-sound-s-es' | 'final-sound-d-ed'
): boolean => {
  const core = coreRaw.toLowerCase();
  if (!core) return false;

  if (materialId === 'final-sound-s-es') {
    if (['s', 'z', 'ɪz', 'iz'].includes(core)) return true;
    if (core.length < 3 || S_ES_PHONETIC_EXCLUDED.has(core)) return false;
    return core.endsWith('ɪz') || core.endsWith('iz') || core.endsWith('s') || core.endsWith('z');
  }

  if (['t', 'd', 'ɪd', 'id', 'əd'].includes(core)) return true;
  if (core.length < 3 || D_ED_PHONETIC_EXCLUDED.has(core)) return false;
  return (
    core.endsWith('ɪd') ||
    core.endsWith('id') ||
    core.endsWith('əd') ||
    core.endsWith('t') ||
    core.endsWith('d')
  );
};

const mapOriginTargetsToPhoneticWordOrdinals = (
  originTargetOrdinals: number[],
  totalOriginWords: number,
  phoneticCandidateOrdinals: number[],
  totalPhoneticWords: number
) => {
  if (!originTargetOrdinals.length || !phoneticCandidateOrdinals.length || totalPhoneticWords === 0) {
    return new Set<number>();
  }

  const mapped = new Set<number>();
  let lastPicked = -1;

  originTargetOrdinals.forEach((originOrdinal) => {
    const approx =
      totalOriginWords > 1
        ? Math.round((originOrdinal / (totalOriginWords - 1)) * (totalPhoneticWords - 1))
        : 0;

    let bestOrdinal: number | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    phoneticCandidateOrdinals.forEach((candidateOrdinal) => {
      if (candidateOrdinal <= lastPicked) return;
      const distance = Math.abs(candidateOrdinal - approx);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestOrdinal = candidateOrdinal;
      }
    });

    if (bestOrdinal !== null) {
      mapped.add(bestOrdinal);
      lastPicked = bestOrdinal;
    }
  });

  return mapped;
};

const highlightPhoneticByOriginWords = (
  phoneticParagraph: string,
  keyPrefix: string,
  originParagraph: string,
  materialId: 'final-sound-s-es' | 'final-sound-d-ed'
) => {
  const { totalWords: totalOriginWords, targetOrdinals: originTargetOrdinals } =
    getOriginTargetWordOrdinals(originParagraph, materialId);

  const parts = phoneticParagraph.split(/(\s+)/);
  const phoneticWordOrdinals: number[] = [];
  let wordOrdinalCursor = 0;

  parts.forEach((part) => {
    if (!part || /^\s+$/.test(part)) return;
    const core = stripPhoneticTokenEdges(part);
    if (!core) return;
    if (isPhoneticCandidateForMaterial(core, materialId)) {
      phoneticWordOrdinals.push(wordOrdinalCursor);
    }
    wordOrdinalCursor += 1;
  });

  const highlightedWordOrdinals = mapOriginTargetsToPhoneticWordOrdinals(
    originTargetOrdinals,
    totalOriginWords,
    phoneticWordOrdinals,
    wordOrdinalCursor
  );

  let displayWordOrdinal = 0;

  return parts.map((part, index) => {
    if (!part) return null;
    if (/^\s+$/.test(part)) {
      return <React.Fragment key={`${keyPrefix}-space-${index}`}>{part}</React.Fragment>;
    }

    const core = stripPhoneticTokenEdges(part);
    if (!core) {
      return <React.Fragment key={`${keyPrefix}-plain-${index}`}>{part}</React.Fragment>;
    }

    const shouldHighlight = highlightedWordOrdinals.has(displayWordOrdinal);
    displayWordOrdinal += 1;

    if (shouldHighlight) {
      return (
        <span key={`${keyPrefix}-word-${index}`} className='text-hl-letter'>
          {part}
        </span>
      );
    }

    return <React.Fragment key={`${keyPrefix}-plain-${index}`}>{part}</React.Fragment>;
  });
};

const highlightSEndingsInPhonetic = (
  phoneticParagraph: string,
  keyPrefix: string,
  originParagraph: string
) => highlightPhoneticByOriginWords(phoneticParagraph, keyPrefix, originParagraph, 'final-sound-s-es');

const highlightDEdEndingsInPhonetic = (
  phoneticParagraph: string,
  keyPrefix: string,
  originParagraph: string
) => highlightPhoneticByOriginWords(phoneticParagraph, keyPrefix, originParagraph, 'final-sound-d-ed');

const isDEdTargetWord = (rawWord: string): boolean => {
  const word = rawWord.toLowerCase();
  if (!/^[a-z]+$/.test(word)) return false;
  if (D_ED_EXCLUDED_WORDS.has(word)) return false;
  if (D_ED_STRICT_TERMS.has(word)) return true;

  return word.endsWith('ed') && word.length >= 4;
};

const highlightDEdByRule = (text: string, keyPrefix: string) => {
  const strictTokens = [...D_ED_STRICT_TERMS].sort((a, b) => b.length - a.length);
  const strictRegex =
    strictTokens.length > 0 ? new RegExp(`(${strictTokens.map(escapeRegExp).join('|')})`, 'gi') : null;
  const strictChunks = strictRegex ? text.split(strictRegex) : [text];

  return strictChunks.flatMap((chunk, chunkIndex) => {
    if (!chunk) return [];

    const normalizedChunk = chunk.toLowerCase();
    if (D_ED_STRICT_TERMS.has(normalizedChunk)) {
      return (
        <span key={`${keyPrefix}-strict-${chunkIndex}`} className='text-hl-letter'>
          {chunk}
        </span>
      );
    }

    const wordChunks = chunk.split(/(\b[A-Za-z']+\b)/g);
    return wordChunks.map((wordChunk, wordIndex) => {
      if (!wordChunk) return null;

      if (isDEdTargetWord(wordChunk)) {
        return (
          <span key={`${keyPrefix}-word-${chunkIndex}-${wordIndex}`} className='text-hl-letter'>
            {wordChunk}
          </span>
        );
      }

      return (
        <React.Fragment key={`${keyPrefix}-plain-${chunkIndex}-${wordIndex}`}>
          {wordChunk}
        </React.Fragment>
      );
    });
  });
};

const AMERICAN_T_MARKERS = ['ɾ', 'ʔ'] as const;
const AMERICAN_T_MANUAL_ORIGIN_HIGHLIGHTS = new Set([
  'textbook',
  'confused',
  'later',
  'pattern',
  'light',
  'shorter',
  'supporting',
  'not',
  'isolated',
  'used',
  'center'
]);
const IPA_VOWEL_INITIALS = new Set([
  'i', 'y', 'ɨ', 'ʉ', 'ɯ', 'u', 'ɪ', 'ʏ', 'ʊ', 'e', 'ø', 'ɘ', 'ɵ', 'ɤ', 'o', 'ə', 'ɛ', 'œ', 'ɜ',
  'ɞ', 'ʌ', 'ɔ', 'æ', 'a', 'ɶ', 'ɑ', 'ɒ'
]);

const stripIpaStressMarks = (token: string) => token.replace(/^[ˈˌ]+/, '');

const startsWithIpaConsonant = (token: string) => {
  const normalized = stripIpaStressMarks(token);
  if (!normalized) return false;
  const firstChar = normalized[0];
  return !IPA_VOWEL_INITIALS.has(firstChar);
};

const tokenizeIpaWords = (ipaText: string) => {
  const parts = ipaText.split(/(\s+)/);
  const words: string[] = [];

  parts.forEach((part) => {
    if (!part || /^\s+$/.test(part)) return;
    const core = stripPhoneticTokenEdges(part);
    if (!core) return;
    words.push(core);
  });

  return words;
};

const getAmericanTPhoneticTargetOrdinals = (ipaText: string) => {
  const ipaWords = tokenizeIpaWords(ipaText);
  const targetOrdinals = new Set<number>();

  ipaWords.forEach((rawWord, index) => {
    const current = stripIpaStressMarks(rawWord);
    if (!current) return;

    const hasMarker = AMERICAN_T_MARKERS.some((marker) => current.includes(marker));
    if (hasMarker) {
      targetOrdinals.add(index);
      return;
    }

    if (index >= ipaWords.length - 1) return;
    const nextWord = stripIpaStressMarks(ipaWords[index + 1]);
    if (!nextWord) return;

    const hasFinalTBeforeConsonant =
      current.length >= 2 && current.endsWith('t') && startsWithIpaConsonant(nextWord);
    if (hasFinalTBeforeConsonant) {
      targetOrdinals.add(index);
    }
  });

  return {
    totalWords: ipaWords.length,
    targetOrdinals: [...targetOrdinals].sort((a, b) => a - b)
  };
};

const mapPhoneticTargetsToOriginWordOrdinals = (
  phoneticTargetOrdinals: number[],
  totalPhoneticWords: number,
  totalOriginWords: number
) => {
  if (!phoneticTargetOrdinals.length || totalOriginWords === 0 || totalPhoneticWords === 0) {
    return new Set<number>();
  }

  const mapped = new Set<number>();
  let lastPicked = -1;

  phoneticTargetOrdinals.forEach((phoneticOrdinal) => {
    const approx =
      totalPhoneticWords > 1
        ? Math.round((phoneticOrdinal / (totalPhoneticWords - 1)) * (totalOriginWords - 1))
        : 0;

    let bestOrdinal: number | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let originOrdinal = lastPicked + 1; originOrdinal < totalOriginWords; originOrdinal += 1) {
      const distance = Math.abs(originOrdinal - approx);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestOrdinal = originOrdinal;
      }
    }

    if (bestOrdinal !== null) {
      mapped.add(bestOrdinal);
      lastPicked = bestOrdinal;
    }
  });

  return mapped;
};

const highlightOriginWordsByOrdinals = (originText: string, ordinals: Set<number>, keyPrefix: string) => {
  if (!ordinals.size) return originText;

  const parts = originText.split(/(\b[A-Za-z']+\b)/g);
  let currentWordOrdinal = 0;

  return parts.map((part, index) => {
    if (!part) return null;

    if (/^[A-Za-z']+$/.test(part)) {
      const shouldHighlight = ordinals.has(currentWordOrdinal);
      currentWordOrdinal += 1;

      if (shouldHighlight) {
        return (
          <span key={`${keyPrefix}-word-${index}`} className='text-hl-letter'>
            {part}
          </span>
        );
      }

      return <React.Fragment key={`${keyPrefix}-plain-${index}`}>{part}</React.Fragment>;
    }

    return <React.Fragment key={`${keyPrefix}-sep-${index}`}>{part}</React.Fragment>;
  });
};

const getAmericanTOriginHighlightOrdinals = (
  originText: string,
  phoneticText: string
) => {
  const originWords = originText.match(/[A-Za-z']+/g) ?? [];
  const manualOrdinals = new Set<number>();
  originWords.forEach((word, index) => {
    if (AMERICAN_T_MANUAL_ORIGIN_HIGHLIGHTS.has(word.toLowerCase())) {
      manualOrdinals.add(index);
    }
  });

  if (!phoneticText.trim()) {
    return manualOrdinals;
  }

  const { totalWords: totalPhoneticWords, targetOrdinals } = getAmericanTPhoneticTargetOrdinals(phoneticText);
  if (!targetOrdinals.length) {
    return manualOrdinals;
  }

  const totalOriginWords = originWords.length;
  const mappedOriginOrdinals = mapPhoneticTargetsToOriginWordOrdinals(
    targetOrdinals,
    totalPhoneticWords,
    totalOriginWords
  );

  manualOrdinals.forEach((ordinal) => mappedOriginOrdinals.add(ordinal));
  return mappedOriginOrdinals;
};

const highlightAmericanTByIpaMapping = (
  originText: string,
  phoneticText: string,
  keyPrefix: string
) => {
  const originOrdinals = getAmericanTOriginHighlightOrdinals(originText, phoneticText);
  return highlightOriginWordsByOrdinals(originText, originOrdinals, keyPrefix);
};

const highlightPhoneticWordsByOrdinals = (
  phoneticText: string,
  ordinals: Set<number>,
  keyPrefix: string
) => {
  if (!ordinals.size) return phoneticText;

  const parts = phoneticText.split(/(\s+)/);
  let displayWordOrdinal = 0;

  return parts.map((part, index) => {
    if (!part) return null;
    if (/^\s+$/.test(part)) {
      return <React.Fragment key={`${keyPrefix}-space-${index}`}>{part}</React.Fragment>;
    }

    const core = stripPhoneticTokenEdges(part);
    if (!core) {
      return <React.Fragment key={`${keyPrefix}-plain-${index}`}>{part}</React.Fragment>;
    }

    const shouldHighlight = ordinals.has(displayWordOrdinal);
    displayWordOrdinal += 1;

    if (shouldHighlight) {
      return (
        <span key={`${keyPrefix}-word-${index}`} className='text-hl-letter'>
          {part}
        </span>
      );
    }

    return <React.Fragment key={`${keyPrefix}-plain-${index}`}>{part}</React.Fragment>;
  });
};

const highlightAmericanTPhoneticByOriginMapping = (
  phoneticText: string,
  originText: string,
  keyPrefix: string
) => {
  if (!phoneticText.trim()) return phoneticText;

  const originOrdinals = getAmericanTOriginHighlightOrdinals(originText, phoneticText);
  if (!originOrdinals.size) return phoneticText;

  const totalOriginWords = (originText.match(/[A-Za-z']+/g) ?? []).length;
  const totalPhoneticWords = tokenizeIpaWords(phoneticText).length;
  const phoneticCandidateOrdinals = Array.from({ length: totalPhoneticWords }, (_, index) => index);

  const phoneticOrdinals = mapOriginTargetsToPhoneticWordOrdinals(
    [...originOrdinals].sort((a, b) => a - b),
    totalOriginWords,
    phoneticCandidateOrdinals,
    totalPhoneticWords
  );

  return highlightPhoneticWordsByOrdinals(phoneticText, phoneticOrdinals, keyPrefix);
};

const renderHighlightedParagraph = (
  paragraph: string,
  material: TextMaterial,
  paragraphIndex: number
) => {
  // Khusus section Final Sound S/ES:
  // highlight semua kata target berakhiran -s/-es yang relevan.
  if (material.id === 'final-sound-s-es') {
    return highlightSEndingsByRule(paragraph, material.id);
  }

  // Khusus section Final Sound D/ED:
  // highlight kata target berakhiran -ed yang relevan.
  if (material.id === 'final-sound-d-ed') {
    return highlightDEdByRule(paragraph, material.id);
  }

  // Khusus section American T:
  // highlight kata berdasarkan indikator cara baca di IPA pasangan (ɾ, ʔ, final t + consonant).
  if (material.id === 'american-t') {
    return highlightAmericanTByIpaMapping(
      paragraph,
      material.phoneticParagraphs[paragraphIndex] ?? '',
      `${material.id}-${paragraphIndex}`
    );
  }

  const config = TOPIC_HIGHLIGHTS[material.id] ?? { keyTerms: [], letterTerms: [] };
  const titleConfig = extractTitleTerms(material.title);
  const focusConfig = extractFocusTerms(material.focus);

  const rawKeyTerms = [...config.keyTerms, ...titleConfig.keyTerms];
  const rawLetterTerms = [...config.letterTerms, ...titleConfig.letterTerms, ...focusConfig.letterTerms];

  const expandedKeyTerms = new Set<string>();
  rawKeyTerms.forEach((term) => {
    const normalized = term.trim();
    if (!normalized) return;
    expandedKeyTerms.add(normalized);

    const splitWords = normalized.split(/[\s-]+/).filter(Boolean);
    splitWords.forEach((word) => {
      if (word.length < 4 || STOP_WORDS.has(word.toLowerCase()) || word.includes('/')) return;
      toWordVariants(word).forEach((variant) => expandedKeyTerms.add(variant));
    });
  });

  const keySet = new Set([...expandedKeyTerms].map((term) => term.toLowerCase()));
  const letterSet = new Set(rawLetterTerms.map((term) => term.toLowerCase()));

  const tokens = [...new Set([...expandedKeyTerms, ...rawLetterTerms])]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (!tokens.length) return paragraph;

  const regex = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'gi');
  const parts = paragraph.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;
    const normalized = part.toLowerCase();

    if (letterSet.has(normalized)) {
      return (
        <span key={`letter-${index}-${part}`} className='text-hl-letter'>
          {part}
        </span>
      );
    }

    if (keySet.has(normalized)) {
      return (
        <span key={`key-${index}-${part}`} className='text-hl-key'>
          {part}
        </span>
      );
    }

    return <React.Fragment key={`plain-${index}`}>{part}</React.Fragment>;
  });
};

const renderPhoneticHighlightedParagraph = (
  paragraph: string,
  material: TextMaterial,
  keyPrefix: string,
  originParagraph: string
) => {
  if (material.id === 'final-sound-s-es') {
    return highlightSEndingsInPhonetic(paragraph, keyPrefix, originParagraph);
  }

  if (material.id === 'final-sound-d-ed') {
    return highlightDEdEndingsInPhonetic(paragraph, keyPrefix, originParagraph);
  }

  if (material.id === 'american-t') {
    return highlightAmericanTPhoneticByOriginMapping(paragraph, originParagraph, keyPrefix);
  }

  return paragraph;
};

export default function PronunciationTextPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(VISIBLE_MATERIALS[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState<TabKey>('origin');
  const [isClient, setIsClient] = useState(false);
  const [savedProgressByTab, setSavedProgressByTab] = useState<Record<TabKey, boolean>>({
    origin: false,
    phonetic: false,
  });
  const [activeSubsectionId, setActiveSubsectionId] = useState<string>('');
  const [activeSpeechKey, setActiveSpeechKey] = useState<string | null>(null);
  const [activeSpeechGroup, setActiveSpeechGroup] = useState<'main' | 'subsection' | null>(null);
  const [isPracticeOpen, setIsPracticeOpen] = useState<boolean>(() => {
    const uiState = readTextSectionUiStateFromStorage();
    return uiState.practiceOpen ?? false;
  });
  const [isPromptOpen, setIsPromptOpen] = useState<boolean>(() => {
    const uiState = readTextSectionUiStateFromStorage();
    return uiState.promptOpen ?? false;
  });
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const speechTokenRef = useRef(0);
  const promptCopyTimeoutRef = useRef<number | null>(null);
  const readingCardRef = useRef<HTMLElement | null>(null);

  const activeMaterial = useMemo(
    () => VISIBLE_MATERIALS.find((item) => item.id === activeId) ?? VISIBLE_MATERIALS[0]!,
    [activeId]
  );

  const paragraphs = useMemo(
    () =>
      activeTab === 'origin'
        ? activeMaterial?.originParagraphs ?? []
        : activeMaterial?.phoneticParagraphs ?? [],
    [activeMaterial, activeTab]
  );
  const subsections = useMemo(() => activeMaterial?.subsections ?? [], [activeMaterial]);
  const activeSubsection = useMemo(
    () => subsections.find((subsection) => subsection.id === activeSubsectionId) ?? subsections[0] ?? null,
    [subsections, activeSubsectionId]
  );
  const subsectionParagraphs = useMemo(
    () =>
      activeSubsection
        ? activeTab === 'origin'
          ? activeSubsection.originParagraphs
          : activeSubsection.phoneticParagraphs
        : [],
    [activeSubsection, activeTab]
  );

  const mainSpeechItems = useMemo(
    () =>
      paragraphs.map((paragraph, index) => ({
        key: `main-${activeMaterial.id}-${index}`,
        text: (activeMaterial.originParagraphs[index] ?? paragraph).trim(),
      })),
    [activeMaterial, paragraphs]
  );

  const subsectionSpeechItems = useMemo(
    () =>
      subsectionParagraphs.map((paragraph, index) => ({
        key: `sub-${activeSubsection?.id ?? 'none'}-${index}`,
        text: (activeSubsection?.originParagraphs[index] ?? paragraph).trim(),
      })),
    [activeSubsection, subsectionParagraphs]
  );
  const activeProgressTopicName = useMemo(
    () =>
      activeTab === 'origin'
        ? 'Pronunciation Text Origin'
        : 'Pronunciation Text Phonetic',
    [activeTab]
  );
  const activeTextEvaluationPrompt = useMemo(
    () =>
      APPLIED_TEXT_EVALUATION_PROMPTS[activeMaterial.id] ??
      APPLIED_TEXT_DEFAULT_EVALUATION_PROMPT,
    [activeMaterial.id]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timerId = window.setTimeout(() => {
      const tabProgress = readTextTabProgressFromStorage();
      setIsClient(true);
      setSavedProgressByTab({
        origin: typeof tabProgress.origin === 'number',
        phonetic: typeof tabProgress.phonetic === 'number',
      });
    }, 0);
    return () => window.clearTimeout(timerId);
  }, []);

  const syncPronunciationDashboardProgress = useCallback((pronunciationProgress: Record<string, number>) => {
    if (!isClient || typeof window === 'undefined') return;
    const allPronunciationProgress = Object.values(pronunciationProgress).filter(
      (value): value is number => typeof value === 'number' && Number.isFinite(value)
    );
    const pronunciationAverage = allPronunciationProgress.length
      ? Math.round(
          allPronunciationProgress.reduce((total, current) => total + current, 0) /
            allPronunciationProgress.length
        )
      : 0;

    const dashboardProgress = JSON.parse(
      window.localStorage.getItem('dashboardProgress') || '{}'
    ) as Record<string, number>;
    dashboardProgress.pronunciation = pronunciationAverage;
    window.localStorage.setItem('dashboardProgress', JSON.stringify(dashboardProgress));
  }, [isClient]);

  const handleSaveProgressByTab = useCallback(async (tab: TabKey, percentage: number) => {
    if (!isClient || typeof window === 'undefined') return;

    setSavedProgressByTab((prev) => ({ ...prev, [tab]: true }));

    const tabProgress = readTextTabProgressFromStorage();
    tabProgress[tab] = percentage;
    writeTextTabProgressToStorage(tabProgress);

    const tabValues = Object.values(tabProgress).filter(
      (value): value is number => typeof value === 'number' && Number.isFinite(value)
    );
    const textAverage = tabValues.length
      ? Math.round(tabValues.reduce((total, current) => total + current, 0) / tabValues.length)
      : 0;

    const pronunciationProgress = JSON.parse(
      window.localStorage.getItem('pronunciationProgress') || '{}'
    ) as Record<string, number>;
    pronunciationProgress.text = textAverage;
    window.localStorage.setItem('pronunciationProgress', JSON.stringify(pronunciationProgress));
    syncPronunciationDashboardProgress(pronunciationProgress);
  }, [isClient, syncPronunciationDashboardProgress]);

  const handleUnsaveProgressByTab = useCallback(async (tab: TabKey) => {
    if (!isClient || typeof window === 'undefined') return;

    setSavedProgressByTab((prev) => ({ ...prev, [tab]: false }));

    const tabProgress = readTextTabProgressFromStorage();
    delete tabProgress[tab];
    writeTextTabProgressToStorage(tabProgress);

    const tabValues = Object.values(tabProgress).filter(
      (value): value is number => typeof value === 'number' && Number.isFinite(value)
    );

    const pronunciationProgress = JSON.parse(
      window.localStorage.getItem('pronunciationProgress') || '{}'
    ) as Record<string, number>;

    if (tabValues.length) {
      pronunciationProgress.text = Math.round(
        tabValues.reduce((total, current) => total + current, 0) / tabValues.length
      );
    } else {
      delete pronunciationProgress.text;
    }

    window.localStorage.setItem('pronunciationProgress', JSON.stringify(pronunciationProgress));
    syncPronunciationDashboardProgress(pronunciationProgress);
  }, [isClient, syncPronunciationDashboardProgress]);

  const stopAllSpeech = useCallback(() => {
    speechTokenRef.current += 1;
    stopSpeech();
    setActiveSpeechKey(null);
    setActiveSpeechGroup(null);
  }, []);

  const speakQueueItem = useCallback((text: string, key: string, token: number): Promise<void> => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return Promise.resolve();
    }

    if (speechTokenRef.current !== token) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const utterance = createUtterance(text, {
        preferredEnglish: 'en-US',
        rate: 0.84,
        pitch: 1,
        volume: 1,
        cancelBeforeSpeak: false,
      });
      if (!utterance) {
        resolve();
        return;
      }

      const finish = () => {
        if (speechTokenRef.current === token) {
          setActiveSpeechKey((current) => (current === key ? null : current));
        }
        resolve();
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      if (speechTokenRef.current !== token) {
        resolve();
        return;
      }

      setActiveSpeechKey(key);
      synth.speak(utterance);
    });
  }, []);

  const playSingleParagraph = useCallback(
    async (text: string, key: string) => {
      if (!text) return;

      stopAllSpeech();
      const token = speechTokenRef.current;
      await primeBestEnglishVoice();
      if (speechTokenRef.current !== token) return;

      setActiveSpeechGroup(null);
      await speakQueueItem(text, key, token);
    },
    [speakQueueItem, stopAllSpeech]
  );

  const playAllGroup = useCallback(
    async (items: Array<{ key: string; text: string }>, group: 'main' | 'subsection') => {
      const validItems = items.filter((item) => item.text.length > 0);
      if (!validItems.length) return;

      stopAllSpeech();
      const token = speechTokenRef.current;
      await primeBestEnglishVoice();
      if (speechTokenRef.current !== token) return;

      setActiveSpeechGroup(group);

      for (let index = 0; index < validItems.length; index += 1) {
        if (speechTokenRef.current !== token) return;

        const item = validItems[index];
        await speakQueueItem(item.text, item.key, token);
        if (speechTokenRef.current !== token) return;

        if (index < validItems.length - 1) {
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, 260);
          });
        }
      }

      if (speechTokenRef.current === token) {
        setActiveSpeechKey(null);
        setActiveSpeechGroup(null);
      }
    },
    [speakQueueItem, stopAllSpeech]
  );

  const toggleMainPlayAll = useCallback(() => {
    if (activeSpeechGroup === 'main') {
      stopAllSpeech();
      return;
    }
    void playAllGroup(mainSpeechItems, 'main');
  }, [activeSpeechGroup, mainSpeechItems, playAllGroup, stopAllSpeech]);

  const toggleSubsectionPlayAll = useCallback(() => {
    if (activeSpeechGroup === 'subsection') {
      stopAllSpeech();
      return;
    }
    void playAllGroup(subsectionSpeechItems, 'subsection');
  }, [activeSpeechGroup, playAllGroup, stopAllSpeech, subsectionSpeechItems]);

  const toggleSinglePlay = useCallback(
    (text: string, key: string) => {
      if (activeSpeechGroup === null && activeSpeechKey === key) {
        stopAllSpeech();
        return;
      }
      void playSingleParagraph(text, key);
    },
    [activeSpeechGroup, activeSpeechKey, playSingleParagraph, stopAllSpeech]
  );

  const handleSelectMaterial = useCallback(
    (nextId: string) => {
      stopAllSpeech();
      setActiveId(nextId);
    },
    [stopAllSpeech]
  );

  const handleSelectTab = useCallback(
    (nextTab: TabKey) => {
      stopAllSpeech();
      setActiveTab(nextTab);
    },
    [stopAllSpeech]
  );

  const handleSelectSubsection = useCallback(
    (nextSubsectionId: string) => {
      stopAllSpeech();
      setActiveSubsectionId(nextSubsectionId);
    },
    [stopAllSpeech]
  );

  const handlePracticeJumpToOrigin = useCallback(() => {
    stopAllSpeech();
    if (activeTab !== 'origin') {
      setActiveTab('origin');
    }

    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        readingCardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 80);
    }
  }, [activeTab, stopAllSpeech]);

  const handleCopyPrompt = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(activeTextEvaluationPrompt);
      setIsPromptCopied(true);
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      promptCopyTimeoutRef.current = window.setTimeout(() => {
        setIsPromptCopied(false);
        promptCopyTimeoutRef.current = null;
      }, 1800);
    } catch {
      setIsPromptCopied(false);
    }
  }, [activeTextEvaluationPrompt]);

  useEffect(() => () => {
    if (promptCopyTimeoutRef.current) {
      window.clearTimeout(promptCopyTimeoutRef.current);
    }
    stopAllSpeech();
  }, [stopAllSpeech]);

  useEffect(() => {
    writeTextSectionUiStateToStorage({
      practiceOpen: isPracticeOpen,
      promptOpen: isPromptOpen,
    });
  }, [isPracticeOpen, isPromptOpen]);

  return (
    <div className='pronunciation-layout text-pronunciation-layout'>
      <div className='back-button-fixed'>
        <BackButton to='/skill/pronunciation' />
      </div>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <div className='text-pronunciation-page'>
        <div className='text-pronunciation-overlay' />

        <main className='text-pronunciation-main'>
          <header className='text-pronunciation-header'>
            <p className='text-pronunciation-kicker'>Pronunciation Text Lab</p>
            <h1>Applied Pronunciation Text</h1>
            <p>
              Pilih topik, baca versi teks asli atau transkripsi fonetik, lalu latih
              pengucapan dalam paragraf utuh agar ritme bicara tetap natural.
            </p>
          </header>

          <section className='text-pronunciation-menu' aria-label='Text material topics'>
            {VISIBLE_MATERIALS.map((item) => (
              <button
                key={item.id}
                type='button'
                className={`text-material-btn ${item.id === activeId ? 'active' : ''}`}
                onClick={() => handleSelectMaterial(item.id)}
              >
                {item.title}
              </button>
            ))}
          </section>

          <section className='text-pronunciation-content'>
            <div className='text-pronunciation-content-top'>
              <div className='text-pronunciation-topic-meta'>
                <h2>{activeMaterial?.title}</h2>
                <p>{activeMaterial?.focus}</p>
              </div>

              <div className='text-pronunciation-top-actions'>
                <div className='text-pronunciation-tabs' role='tablist' aria-label='text tabs'>
                  <button
                    type='button'
                    role='tab'
                    aria-selected={activeTab === 'origin'}
                    className={activeTab === 'origin' ? 'active' : ''}
                    onClick={() => handleSelectTab('origin')}
                  >
                    Origin Text
                  </button>
                  <button
                    type='button'
                    role='tab'
                    aria-selected={activeTab === 'phonetic'}
                    className={activeTab === 'phonetic' ? 'active' : ''}
                    onClick={() => handleSelectTab('phonetic')}
                  >
                    Phonetic Transcription
                  </button>
                </div>
                <div className='text-pronunciation-tab-progress'>
                  <ButtonSavedProgress
                    isSaved={savedProgressByTab[activeTab]}
                    onSave={(percentage) => handleSaveProgressByTab(activeTab, percentage)}
                    onUnsave={() => handleUnsaveProgressByTab(activeTab)}
                    size='small'
                    variant='outline'
                    topicName={activeProgressTopicName}
                  />
                </div>
              </div>
            </div>

            <section className='text-pronunciation-practice' aria-label='Practice mission'>
              <button
                type='button'
                className='text-pronunciation-section-toggle'
                aria-expanded={isPracticeOpen}
                onClick={() => setIsPracticeOpen((prev) => !prev)}
              >
                <span className='text-pronunciation-section-toggle-title'>Practice</span>
                <span className='text-pronunciation-section-toggle-icon-wrap' aria-hidden='true'>
                  <ChevronDown
                    size={14}
                    className={`text-pronunciation-section-toggle-icon ${isPracticeOpen ? 'open' : ''}`}
                  />
                </span>
              </button>
              {isPracticeOpen ? (
                <div className='text-pronunciation-practice-body'>
                  <p>
                    <strong>Mission:</strong> Bacakan teks Final Sound S/ES dalam{' '}
                    <button
                      type='button'
                      className='text-pronunciation-practice-link'
                      onClick={handlePracticeJumpToOrigin}
                    >
                      origin teks
                    </button>
                    .
                  </p>
                </div>
              ) : null}
            </section>

            <section className='text-pronunciation-prompt' aria-label='Prompt penilaian'>
              <button
                type='button'
                className='text-pronunciation-section-toggle'
                aria-expanded={isPromptOpen}
                onClick={() => setIsPromptOpen((prev) => !prev)}
              >
                <span className='text-pronunciation-section-toggle-title'>Prompt</span>
                <span className='text-pronunciation-section-toggle-icon-wrap' aria-hidden='true'>
                  <ChevronDown
                    size={14}
                    className={`text-pronunciation-section-toggle-icon ${isPromptOpen ? 'open' : ''}`}
                  />
                </span>
              </button>
              {isPromptOpen ? (
                <div className='text-pronunciation-prompt-body'>
                  <div className='text-pronunciation-prompt-actions'>
                    <button
                      type='button'
                      className='text-pronunciation-prompt-copy-btn'
                      onClick={() => void handleCopyPrompt()}
                      aria-label='Salin prompt'
                      title='Salin prompt'
                    >
                      <Copy size={13} />
                      <span>{isPromptCopied ? 'Tersalin' : 'Salin Prompt'}</span>
                    </button>
                  </div>
                  <div className='text-pronunciation-prompt-card'>
                    <p className='text-pronunciation-prompt-quote'>
                      &quot;{activeTextEvaluationPrompt}&quot;
                    </p>
                  </div>
                </div>
              ) : null}
            </section>

            <article className='text-pronunciation-reading-card' ref={readingCardRef}>
              <div className='text-pronunciation-tts-toolbar'>
                <button
                  type='button'
                  className={`text-pronunciation-tts-btn ${activeSpeechGroup === 'main' ? 'is-active' : ''}`}
                  onClick={toggleMainPlayAll}
                >
                  {activeSpeechGroup === 'main' ? 'Stop' : 'Play All'}
                </button>
              </div>

              <div className='text-pronunciation-reading-group'>
                {paragraphs.map((paragraph, index) => {
                  const speechItem = mainSpeechItems[index];
                  const rowKey = `${activeMaterial?.id}-${activeTab}-${index}`;
                  const isSinglePlaying = activeSpeechGroup === null && activeSpeechKey === speechItem?.key;
                  return (
                    <div
                      key={rowKey}
                      className={`text-pronunciation-reading-row ${
                        activeSpeechKey === speechItem?.key ? 'is-speaking' : ''
                      }`}
                    >
                      <p>
                        {activeTab === 'origin'
                          ? renderHighlightedParagraph(paragraph, activeMaterial, index)
                          : renderPhoneticHighlightedParagraph(
                              paragraph,
                              activeMaterial,
                              `${activeMaterial.id}-${index}`,
                              activeMaterial.originParagraphs[index] ?? '',
                            )}
                      </p>
                      <button
                        type='button'
                        className={`text-pronunciation-tts-chip ${isSinglePlaying ? 'is-active' : ''}`}
                        aria-label={isSinglePlaying ? 'Stop paragraph audio' : 'Play paragraph audio'}
                        title={isSinglePlaying ? 'Stop' : 'Play'}
                        onClick={() => {
                          if (!speechItem) return;
                          toggleSinglePlay(speechItem.text, speechItem.key);
                        }}
                      >
                        <span
                          aria-hidden='true'
                          className={`text-pronunciation-tts-chip-icon ${isSinglePlaying ? 'is-stop' : 'is-play'}`}
                        >
                          {isSinglePlaying ? '■' : '▶'}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </article>

            {subsections.length > 0 ? (
              <>
                <section
                  className='text-pronunciation-subsection-switch'
                  aria-label='Text subsection buttons'
                >
                  {subsections.map((subsection) => (
                    <button
                      key={`${activeMaterial?.id}-${subsection.id}`}
                      type='button'
                      className={`text-subsection-btn ${
                        activeSubsection?.id === subsection.id ? 'active' : ''
                      }`}
                      onClick={() => handleSelectSubsection(subsection.id)}
                    >
                      {subsection.title}
                    </button>
                  ))}
                </section>

                {activeSubsection ? (
                  <section className='text-pronunciation-subsection-card' aria-label='Active subsection text'>
                    <h3>{activeSubsection.title}</h3>
                    <div className='text-pronunciation-tts-toolbar text-pronunciation-tts-toolbar--sub'>
                      <button
                        type='button'
                        className={`text-pronunciation-tts-btn ${activeSpeechGroup === 'subsection' ? 'is-active' : ''}`}
                        onClick={toggleSubsectionPlayAll}
                      >
                        {activeSpeechGroup === 'subsection' ? 'Stop' : 'Play All'}
                      </button>
                    </div>
                    <div className='text-pronunciation-reading-group text-pronunciation-reading-group--sub'>
                      {subsectionParagraphs.map((paragraph, paragraphIndex) => {
                        const speechItem = subsectionSpeechItems[paragraphIndex];
                        const isSinglePlaying = activeSpeechGroup === null && activeSpeechKey === speechItem?.key;
                        return (
                          <div
                            key={`${activeSubsection.id}-${activeTab}-${paragraphIndex}`}
                            className={`text-pronunciation-reading-row text-pronunciation-reading-row--sub ${
                              activeSpeechKey === speechItem?.key ? 'is-speaking' : ''
                            }`}
                          >
                            <p>
                              {activeTab === 'origin'
                                ? renderHighlightedParagraph(paragraph, activeMaterial, paragraphIndex)
                                : renderPhoneticHighlightedParagraph(
                                    paragraph,
                                    activeMaterial,
                                    `${activeSubsection.id}-${paragraphIndex}`,
                                    activeSubsection.originParagraphs[paragraphIndex] ?? '',
                                  )
                              }
                            </p>
                            <button
                              type='button'
                              className={`text-pronunciation-tts-chip ${isSinglePlaying ? 'is-active' : ''}`}
                              aria-label={isSinglePlaying ? 'Stop paragraph audio' : 'Play paragraph audio'}
                              title={isSinglePlaying ? 'Stop' : 'Play'}
                              onClick={() => {
                                if (!speechItem) return;
                                toggleSinglePlay(speechItem.text, speechItem.key);
                              }}
                            >
                              <span
                                aria-hidden='true'
                                className={`text-pronunciation-tts-chip-icon ${isSinglePlaying ? 'is-stop' : 'is-play'}`}
                              >
                                {isSinglePlaying ? '■' : '▶'}
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ) : null}
              </>
            ) : null}
          </section>
        </main>
      </div>
      <RecordingControlsButton
        className='text-recording-anchor'
        downloadFileName='applied-pronunciation-text-GEUWAT-recording.wav'
      />
    </div>
  );
}

