import {
  GUIDE_FOLLOW_UP_PHRASES,
  GUIDE_INTENT_PATTERNS,
  GUIDE_NORMALIZATION_RULES,
  GUIDE_STOPWORDS,
} from '../data/synonyms.id-en';
import { buildConfidenceScore } from './confidence';
import type { GuideAnswerIntent, ParsedQuery } from '../types';

export const normalizeGuideText = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9/\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const normalizeGuideTokenForLookup = (token: string): string => {
  const normalized = normalizeGuideText(token).replace(/'/g, '').trim();
  if (!normalized) return '';

  if (normalized.endsWith('ies') && normalized.length > 4) {
    return `${normalized.slice(0, -3)}y`;
  }
  if (normalized.endsWith('es') && normalized.length > 4) {
    return normalized.slice(0, -2);
  }
  if (normalized.endsWith('s') && normalized.length > 3) {
    return normalized.slice(0, -1);
  }

  return normalized;
};

const applyNormalizationRules = (
  text: string,
): { normalized: string; hasTypoCorrection: boolean; correctedQuery?: string } => {
  let normalized = normalizeGuideText(text);
  let hasTypoCorrection = false;

  GUIDE_NORMALIZATION_RULES.forEach((rule) => {
    const next = normalized.replace(rule.pattern, rule.replacement);
    if (next !== normalized && rule.kind === 'typo') {
      hasTypoCorrection = true;
    }
    normalized = next;
  });

  return {
    normalized: normalized.replace(/\s+/g, ' ').trim(),
    hasTypoCorrection,
    correctedQuery: normalized.replace(/\s+/g, ' ').trim(),
  };
};

export const toGuideTokens = (text: string): string[] =>
  normalizeGuideText(text).split(' ').filter(Boolean);

const isFollowUpQuery = (normalized: string): boolean =>
  GUIDE_FOLLOW_UP_PHRASES.some((phrase) => normalized.includes(phrase));

const detectIntent = (normalized: string): GuideAnswerIntent => {
  if (!normalized) return 'fallback';

  if (GUIDE_INTENT_PATTERNS.word_explanation?.some((pattern) => pattern.test(normalized))) {
    return 'word_explanation';
  }
  if (GUIDE_INTENT_PATTERNS.comparison?.some((pattern) => pattern.test(normalized))) {
    return 'comparison';
  }
  if (GUIDE_INTENT_PATTERNS.how_to?.some((pattern) => pattern.test(normalized))) {
    return 'how_to';
  }
  if (GUIDE_INTENT_PATTERNS.example_request?.some((pattern) => pattern.test(normalized))) {
    return 'example_request';
  }
  if (GUIDE_INTENT_PATTERNS.direct_answer?.some((pattern) => pattern.test(normalized))) {
    return 'direct_answer';
  }

  return 'fallback';
};

const extractEntities = (tokens: string[]): string[] =>
  tokens
    .filter((token) => token.length > 1 && !GUIDE_STOPWORDS.has(token))
    .filter((token, index, array) => array.indexOf(token) === index)
    .slice(0, 8);

export const parseGuideQuery = (query: string): ParsedQuery => {
  const raw = query ?? '';
  const { normalized, hasTypoCorrection, correctedQuery } = applyNormalizationRules(raw);
  const tokens = toGuideTokens(normalized);
  const entities = extractEntities(tokens);
  const intent = detectIntent(normalized);
  const isFollowUp = isFollowUpQuery(normalized);
  const intentDetected = intent !== 'fallback';

  const confidence = buildConfidenceScore({
    intentDetected,
    entityCount: entities.length,
    tokenCount: tokens.length,
    hasTypoCorrection,
    isFollowUp,
  });

  return {
    raw,
    normalized,
    correctedQuery: hasTypoCorrection ? correctedQuery : undefined,
    hasTypoCorrection,
    tokens,
    entities,
    intent,
    confidence,
    needsClarification: confidence < 50 || (!intentDetected && entities.length < 2),
    isFollowUp,
  };
};

export const isDefinitionStyleQuery = (normalizedQuery: string): boolean =>
  ['apa itu ', 'jelaskan ', 'definisi ', 'what is '].some((prefix) =>
    normalizedQuery.startsWith(prefix),
  );
