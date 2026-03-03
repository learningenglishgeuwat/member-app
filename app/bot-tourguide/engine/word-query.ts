import {
  getWordKnowledgeEntries,
  getWordKnowledgePhraseMatches,
  getWordKnowledgeTokenMatches,
} from './word-knowledge';
import { normalizeGuideText, toGuideTokens } from './nlu';
import type { ConversationState, ParsedQuery, WordKnowledgeEntry, WordMatchResult } from '../types';

const getSourceBonus = (entry: WordKnowledgeEntry): number => {
  if (entry.sourceType === 'pronunciation-term') return 18;
  if (entry.sourceType === 'grammar-term') return 16;
  if (entry.sourceType === 'vocabulary') return 12;
  if (entry.sourceType === 'qa-term') return 6;
  return 0;
};

const LEADING_PATTERNS = [
  /^apa arti\s+/,
  /^artinya\s+/,
  /^arti kata\s+/,
  /^meaning of\s+/,
  /^what does\s+/,
  /^jelasin kata\s+/,
  /^jelaskan kata\s+/,
  /^jelasin\s+/,
  /^jelaskan\s+/,
  /^apa itu\s+/,
  /^definisi\s+/,
];

const TRAILING_PATTERNS = [/\s+itu apa$/, /\s+means what$/, /\?$/];

const isLikelyWordIntent = (parsed: ParsedQuery): boolean => {
  if (parsed.intent === 'word_explanation') return true;
  if (parsed.intent === 'example_request' && parsed.entities.length <= 3) return true;
  if (parsed.isFollowUp) return true;

  const normalized = parsed.normalized;
  if (
    normalized.includes('apa arti') ||
    normalized.includes('artinya') ||
    normalized.includes('meaning of') ||
    normalized.includes('jelasin') ||
    normalized.endsWith('itu apa')
  ) {
    return true;
  }

  return parsed.entities.length > 0 && parsed.tokens.length <= 4;
};

const cleanupCandidateTerm = (value: string): string => {
  let next = normalizeGuideText(value);
  for (const pattern of LEADING_PATTERNS) {
    next = next.replace(pattern, '');
  }
  for (const pattern of TRAILING_PATTERNS) {
    next = next.replace(pattern, '');
  }
  return next.trim();
};

const resolveQueryTerm = (parsed: ParsedQuery, memory?: ConversationState | null): string => {
  if (parsed.isFollowUp && memory?.lastExplainedTerm) {
    return cleanupCandidateTerm(memory.lastExplainedTerm);
  }

  const cleaned = cleanupCandidateTerm(parsed.normalized);
  if (cleaned) return cleaned;

  return parsed.entities.join(' ').trim();
};

const toConfidenceFromScore = (score: number): number => {
  if (score >= 120) return 95;
  if (score >= 90) return 84;
  if (score >= 60) return 68;
  if (score >= 35) return 52;
  return 0;
};

const rankWordCandidates = (queryTerm: string): Array<{ entry: WordKnowledgeEntry; score: number }> => {
  const normalizedTerm = normalizeGuideText(queryTerm);
  const tokens = toGuideTokens(normalizedTerm);
  const scored = new Map<string, { entry: WordKnowledgeEntry; score: number }>();

  const pushScore = (entry: WordKnowledgeEntry, score: number) => {
    const current = scored.get(entry.id);
    if (!current || current.score < score) {
      scored.set(entry.id, { entry, score });
    }
  };

  for (const entry of getWordKnowledgePhraseMatches(normalizedTerm)) {
    const exact = normalizeGuideText(entry.term) === normalizedTerm;
    pushScore(entry, (exact ? 130 : 108) + getSourceBonus(entry));
  }

  for (const token of tokens) {
    for (const entry of getWordKnowledgeTokenMatches(token)) {
      const normalizedEntryTerm = normalizeGuideText(entry.term);
      let score = 34;
      if (normalizedEntryTerm === token) score += 24;
      if (normalizedEntryTerm.includes(token) || token.includes(normalizedEntryTerm)) score += 12;
      score += getSourceBonus(entry);
      pushScore(entry, score);
    }
  }

  if (!scored.size && normalizedTerm) {
    for (const entry of getWordKnowledgeEntries()) {
      const haystack = [entry.term, ...entry.aliases].map((item) => normalizeGuideText(item));
      let overlap = 0;
      for (const token of tokens) {
        if (haystack.some((item) => item.includes(token))) overlap += 1;
      }
      if (!overlap) continue;
      pushScore(entry, 20 + overlap * 8 + getSourceBonus(entry));
    }
  }

  return Array.from(scored.values()).sort((a, b) => b.score - a.score);
};

export const resolveWordExplanation = (input: {
  parsed: ParsedQuery;
  memory?: ConversationState | null;
}): WordMatchResult => {
  const { parsed, memory } = input;
  const isWordIntent = isLikelyWordIntent(parsed);
  const queryTerm = resolveQueryTerm(parsed, memory);

  if (!isWordIntent || !queryTerm) {
    return {
      isWordIntent: false,
      queryTerm,
      entry: null,
      confidence: 0,
      candidates: [],
    };
  }

  const ranked = rankWordCandidates(queryTerm);
  const best = ranked[0];
  const confidence = best ? toConfidenceFromScore(best.score) : 0;

  return {
    isWordIntent: true,
    queryTerm,
    entry: best?.entry ?? null,
    confidence,
    candidates: ranked.slice(0, 3).map((item) => item.entry),
  };
};
