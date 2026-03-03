import { getVocabularyExampleTranslation } from '../../skill/vocabulary/topic/data/example-meta';
import { VOCABULARY_TOPIC_MAP } from '../../skill/vocabulary/topic/data/topics';
import { VOCABULARY_WORDS } from '../../skill/vocabulary/topic/data/words';
import { PRONUNCIATION_TERM_SEEDS } from '../data/pronunciation-terms';
import { GUIDE_QA_MAP, GUIDE_ROUTE_MAP } from '../routeMap';
import { normalizeGuideText, normalizeGuideTokenForLookup, toGuideTokens } from './nlu';
import type { WordKnowledgeEntry } from '../types';

const TOPIC_ROUTE_BASE = '/skill/vocabulary/topic/pages';
const GRAMMAR_RESOURCE_ROUTE_PREFIX = '/skill/grammar/grammar-resource';

const phraseIndex = new Map<string, WordKnowledgeEntry[]>();
const tokenIndex = new Map<string, WordKnowledgeEntry[]>();
const allEntries: WordKnowledgeEntry[] = [];
const seenEntryIds = new Set<string>();

const pushUnique = (bucket: WordKnowledgeEntry[], entry: WordKnowledgeEntry) => {
  if (!bucket.some((item) => item.id === entry.id)) {
    bucket.push(entry);
  }
};

const upsertPhrase = (phrase: string, entry: WordKnowledgeEntry) => {
  const normalized = normalizeGuideText(phrase);
  if (!normalized) return;
  const bucket = phraseIndex.get(normalized) ?? [];
  pushUnique(bucket, entry);
  phraseIndex.set(normalized, bucket);

  const lookupBucket = phraseIndex.get(normalizeGuideTokenForLookup(normalized)) ?? [];
  pushUnique(lookupBucket, entry);
  phraseIndex.set(normalizeGuideTokenForLookup(normalized), lookupBucket);
};

const upsertToken = (token: string, entry: WordKnowledgeEntry) => {
  const normalized = normalizeGuideTokenForLookup(token);
  if (!normalized) return;
  const bucket = tokenIndex.get(normalized) ?? [];
  pushUnique(bucket, entry);
  tokenIndex.set(normalized, bucket);
};

const addEntryToIndexes = (entry: WordKnowledgeEntry) => {
  if (seenEntryIds.has(entry.id)) return;
  seenEntryIds.add(entry.id);
  allEntries.push(entry);

  upsertPhrase(entry.term, entry);
  upsertPhrase(entry.normalizedTerm, entry);

  for (const alias of entry.aliases) {
    const aliasTokens = toGuideTokens(alias);
    const aliasNormalized = normalizeGuideText(alias);
    const entryTermNormalized = normalizeGuideText(entry.term);
    const shouldIndexAliasAsPhrase =
      entry.sourceType !== 'route-term' ||
      aliasTokens.length > 1 ||
      aliasNormalized === entryTermNormalized;

    if (shouldIndexAliasAsPhrase) {
      upsertPhrase(alias, entry);
    }

    for (const token of aliasTokens) {
      upsertToken(token, entry);
    }
  }

  for (const token of toGuideTokens(entry.term)) {
    upsertToken(token, entry);
  }
};

const buildVocabularyEntries = () => {
  for (const item of VOCABULARY_WORDS) {
    const topic = VOCABULARY_TOPIC_MAP[item.topicId];
    const entry: WordKnowledgeEntry = {
      id: `vocabulary:${item.id}`,
      sourceType: 'vocabulary',
      term: item.word,
      normalizedTerm: normalizeGuideText(item.word),
      aliases: [
        item.word,
        item.meaningId,
        topic?.title ?? item.topicId,
        topic?.subtitle ?? '',
      ].filter(Boolean),
      topicId: item.topicId,
      topicTitle: topic?.title ?? item.topicId,
      meaningId: item.meaningId,
      ipa: item.ipa,
      exampleEn: item.exampleEn,
      exampleTranslation: getVocabularyExampleTranslation(item.exampleEn),
      route: `${TOPIC_ROUTE_BASE}/${item.topicId}`,
    };
    addEntryToIndexes(entry);
  }
};

const buildPronunciationTermEntries = () => {
  for (const term of PRONUNCIATION_TERM_SEEDS) {
    addEntryToIndexes({
      id: `pronunciation-term:${term.id}`,
      sourceType: 'pronunciation-term',
      term: term.term,
      normalizedTerm: normalizeGuideText(term.term),
      aliases: [term.term, ...term.aliases],
      definitionId: term.definitionId,
      coachingTipId: term.coachingTipId,
      exampleEn: term.exampleEn,
      exampleTranslation: term.exampleTranslationId,
      shortAnswer: term.definitionId,
      route: term.route,
    });
  }
};

const inferGrammarCoachingTip = (entry: { topicId: string; title: string }): string => {
  const normalized = normalizeGuideText(`${entry.topicId} ${entry.title}`);

  if (normalized.includes('tense') || normalized.includes('aspect')) {
    return 'Tentukan time marker dulu, lalu pilih tense yang pas sebelum membuat kalimat penuh.';
  }
  if (normalized.includes('conditionals') || normalized.includes('if')) {
    return 'Latih per pola: tulis 3 contoh kalimat if-clause untuk tiap tipe sebelum naik level.';
  }
  if (normalized.includes('modal')) {
    return 'Fokus beda fungsi modal (ability, advice, possibility) dengan contoh situasi harian.';
  }
  if (normalized.includes('passive')) {
    return 'Mulai dari pola dasar be + V3, lalu cek siapa fokus utama dalam kalimat.';
  }
  if (normalized.includes('article') || normalized.includes('determiner')) {
    return 'Cek noun dulu (countable/uncountable, singular/plural), baru pilih determiner yang tepat.';
  }
  if (normalized.includes('noun') || normalized.includes('pronoun')) {
    return 'Cari fungsi kata di kalimat dulu (subjek, objek, pelengkap), baru tentukan bentuknya.';
  }
  if (normalized.includes('verb')) {
    return 'Pastikan verb utama jelas, lalu sesuaikan auxiliary dengan tense dan subject.';
  }
  if (normalized.includes('adjective') || normalized.includes('adverb')) {
    return 'Latih posisi kata dalam kalimat supaya makna tidak berubah dan kalimat tetap natural.';
  }
  if (normalized.includes('preposition')) {
    return 'Hafalkan dalam chunk pendek (misal: interested in, depend on), jangan kata per kata.';
  }
  if (normalized.includes('clause')) {
    return 'Pisahkan main clause dan subordinate clause dulu, lalu gabungkan perlahan.';
  }
  if (normalized.includes('question')) {
    return 'Latih urutan kata pertanyaan secara pelan dulu, lalu ulangi sampai otomatis.';
  }
  if (normalized.includes('punctuation') || normalized.includes('capitalization')) {
    return 'Edit satu kalimat per langkah: cek kapital, tanda baca, lalu cek kejelasan makna.';
  }

  return 'Mulai dari satu pola inti, buat tiga kalimat sendiri, lalu cek akurasi bentuk dan fungsi kata.';
};

const buildGrammarTermEntries = () => {
  for (const entry of GUIDE_QA_MAP) {
    if (!entry.route.startsWith(GRAMMAR_RESOURCE_ROUTE_PREFIX)) continue;

    const routeTail = entry.route.split('/').filter(Boolean).pop() ?? '';
    const routeAlias = routeTail.replace(/-/g, ' ').trim();

    addEntryToIndexes({
      id: `grammar-term:${entry.topicId}`,
      sourceType: 'grammar-term',
      term: entry.title,
      normalizedTerm: normalizeGuideText(entry.title),
      aliases: [entry.title, routeAlias, entry.topicId, ...entry.keywords].filter(Boolean),
      definitionId: entry.shortAnswer,
      coachingTipId: inferGrammarCoachingTip(entry),
      shortAnswer: entry.shortAnswer,
      route: entry.route,
    });
  }
};

const buildQaEntries = () => {
  for (const entry of GUIDE_QA_MAP) {
    addEntryToIndexes({
      id: `qa:${entry.topicId}`,
      sourceType: 'qa-term',
      term: entry.title,
      normalizedTerm: normalizeGuideText(entry.title),
      aliases: [entry.title, entry.topicId, ...entry.keywords],
      shortAnswer: entry.shortAnswer,
      route: entry.route,
    });
  }
};

const buildRouteEntries = () => {
  for (const route of GUIDE_ROUTE_MAP) {
    addEntryToIndexes({
      id: `route:${route.path}`,
      sourceType: 'route-term',
      term: route.label,
      normalizedTerm: normalizeGuideText(route.label),
      aliases: [route.label, route.path, ...route.keywords],
      shortAnswer: `Halaman ${route.label} berisi materi sesuai topik ${route.scope}.`,
      route: route.path,
    });
  }
};

buildVocabularyEntries();
buildPronunciationTermEntries();
buildGrammarTermEntries();
buildQaEntries();
buildRouteEntries();

export const getWordKnowledgeEntries = (): WordKnowledgeEntry[] => allEntries;

export const getWordKnowledgePhraseMatches = (phrase: string): WordKnowledgeEntry[] =>
  phraseIndex.get(normalizeGuideText(phrase)) ?? [];

export const getWordKnowledgeTokenMatches = (token: string): WordKnowledgeEntry[] =>
  tokenIndex.get(normalizeGuideTokenForLookup(token)) ?? [];
