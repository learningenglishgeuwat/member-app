import type { GuideAction, GuideModeResult } from '../types';
import { VOCABULARY_TOPICS } from '../../skill/vocabulary/topic/data/topics';
import type { VocabularyTopicId } from '../../skill/vocabulary/topic/data/types';

const FLASHCARD_DEFAULT_ROUTE = '/skill/vocabulary/flashcard';
const FLASHCARD_ROUTE_BASE = '/skill/vocabulary/flashcard';
const FLASHCARD_ALPHABET_ROUTE = '/skill/pronunciation/flashcard/alphabet';
const FLASHCARD_PHONETIC_SYMBOLS_ROUTE = '/skill/pronunciation/flashcard/phonetic-symbols';

const FLASHCARD_TRIGGERS = [
  'flashcard',
  'kartu flashcard',
  'vocab flashcard',
  'flash card',
];

const TOPIC_ALIASES: Record<VocabularyTopicId, string[]> = {
  color: ['color', 'warna'],
  size: ['size', 'ukuran'],
  'body-parts': ['body parts', 'body part', 'parts of body', 'parts of the body'],
  family: ['family', 'keluarga'],
  'daily-routines': ['daily routines', 'daily routine', 'routines', 'rutinitas'],
  home: ['home', 'rumah'],
  'time-date': ['time date', 'time and date', 'waktu tanggal'],
  number: ['number', 'cardinal number', 'cardinal numbers'],
  'ordinal-number': ['ordinal number', 'ordinal numbers'],
  feelings: ['feelings', 'perasaan'],
  transport: ['transport', 'transportation', 'kendaraan'],
  places: ['places', 'tempat'],
  clothes: ['clothes', 'clothing', 'pakaian'],
  food: ['food', 'makanan'],
  drinks: ['drinks', 'drink', 'minuman'],
  weather: ['weather', 'cuaca'],
  taste: ['taste', 'rasa'],
  vegetables: ['vegetables', 'vegetable', 'sayur', 'sayuran'],
  fruit: ['fruit', 'buah'],
  school: ['school', 'sekolah'],
  'personal-information': ['personal information', 'personal info', 'informasi pribadi'],
  'physical-appearance': ['physical appearance', 'penampilan fisik'],
  'hobbies-interests': ['hobbies and interests', 'hobbies interests', 'hobby', 'interests'],
  sports: ['sports', 'sport', 'olahraga'],
  games: ['games', 'game'],
  'entertainment-media': ['entertainment media', 'media entertainment', 'hiburan media'],
  education: ['education', 'pendidikan'],
  shapes: ['shapes', 'shape', 'bentuk'],
  electronics: ['electronics', 'elektronik'],
  shopping: ['shopping', 'belanja'],
  bathroom: ['bathroom', 'kamar mandi'],
  kitchen: ['kitchen', 'dapur'],
  'social-media': ['social media', 'sosial media'],
};

const SPECIAL_FLASHCARD_TARGETS = [
  {
    id: 'alphabet',
    aliases: ['alphabet', 'abjad', 'huruf'],
    label: 'Flashcard Alphabet',
    path: FLASHCARD_ALPHABET_ROUTE,
    reply: 'Siap. Buka Flashcard Alphabet.',
  },
  {
    id: 'phonetic-symbols',
    aliases: [
      'phonetic symbols',
      'phonetic symbol',
      'symbol ipa',
      'ipa symbol',
      'ipa symbols',
      'ipa',
      'phonetic',
      'simbol fonetik',
      'simbol ipa',
    ],
    label: 'Flashcard Phonetic Symbols',
    path: FLASHCARD_PHONETIC_SYMBOLS_ROUTE,
    reply: 'Siap. Buka Flashcard Phonetic Symbols.',
  },
] as const;

const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9/\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getFlashcardAction = (topicId?: VocabularyTopicId): GuideAction => ({
  kind: 'route',
  label: topicId
    ? `Flashcard ${VOCABULARY_TOPICS.find((topic) => topic.topicId === topicId)?.title ?? topicId}`
    : 'Flashcard Vocabulary',
  path: topicId ? `${FLASHCARD_ROUTE_BASE}/${topicId}` : FLASHCARD_DEFAULT_ROUTE,
});

const getSpecialFlashcardAction = (target: (typeof SPECIAL_FLASHCARD_TARGETS)[number]): GuideAction => ({
  kind: 'route',
  label: target.label,
  path: target.path,
});

const isFlashcardIntent = (query: string): boolean => {
  const normalized = normalizeText(query);
  if (!normalized) return false;

  if (FLASHCARD_TRIGGERS.some((trigger) => normalized.includes(trigger))) return true;
  if (normalized.includes('flash') && normalized.includes('card')) return true;
  return normalized.includes('kartu') || normalized.includes('vocab');
};

const TOPIC_MATCHERS = (() => {
  const entries: Array<{ topicId: VocabularyTopicId; alias: string }> = [];
  const seen = new Set<string>();

  const addAlias = (topicId: VocabularyTopicId, rawAlias: string) => {
    const normalizedAlias = normalizeText(rawAlias);
    if (!normalizedAlias) return;
    const key = `${topicId}::${normalizedAlias}`;
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({ topicId, alias: normalizedAlias });
  };

  for (const topic of VOCABULARY_TOPICS) {
    addAlias(topic.topicId, topic.topicId);
    addAlias(topic.topicId, topic.topicId.replace(/-/g, ' '));
    addAlias(topic.topicId, topic.title);
    addAlias(topic.topicId, topic.title.replace(/&/g, 'and'));
    addAlias(topic.topicId, topic.title.replace(/&/g, ' '));

    const manualAliases = TOPIC_ALIASES[topic.topicId] ?? [];
    for (const alias of manualAliases) {
      addAlias(topic.topicId, alias);
    }
  }

  return entries.sort((a, b) => b.alias.length - a.alias.length);
})();

const resolveTopicFromQuery = (query: string): VocabularyTopicId | null => {
  const normalized = normalizeText(query);
  if (!normalized) return null;

  for (const matcher of TOPIC_MATCHERS) {
    if (normalized.includes(matcher.alias)) {
      return matcher.topicId;
    }
  }

  return null;
};

const resolveSpecialTargetFromQuery = (
  query: string,
): (typeof SPECIAL_FLASHCARD_TARGETS)[number] | null => {
  const normalized = normalizeText(query);
  if (!normalized) return null;

  for (const target of SPECIAL_FLASHCARD_TARGETS) {
    if (target.aliases.some((alias) => normalized.includes(alias))) {
      return target;
    }
  }

  return null;
};

export const resolveFlashcardMode = (query: string): GuideModeResult => {
  const normalized = normalizeText(query);
  const specialTarget = resolveSpecialTargetFromQuery(normalized);
  const resolvedTopicId = resolveTopicFromQuery(normalized);
  const action = getFlashcardAction(resolvedTopicId ?? undefined);

  const baseSuggestions = [
    'flashcard',
    'flashcard alphabet',
    'flashcard phonetic symbols',
    'flashcard kitchen',
    'flashcard social media',
    'flashcard cardinal number',
  ];

  if (!normalized) {
    return {
      mode: 'flashcard',
      reply:
        'Mode Flashcard aktif. Kamu bisa buka flashcard topic vocabulary, alphabet, dan phonetic symbols.',
      actions: [action],
      suggestions: baseSuggestions,
    };
  }

  if (specialTarget) {
    return {
      mode: 'flashcard',
      reply: specialTarget.reply,
      actions: [getSpecialFlashcardAction(specialTarget)],
      suggestions: baseSuggestions,
    };
  }

  if (resolvedTopicId) {
    const topicTitle =
      VOCABULARY_TOPICS.find((topic) => topic.topicId === resolvedTopicId)?.title ?? resolvedTopicId;
    return {
      mode: 'flashcard',
      reply: `Siap. Buka Flashcard ${topicTitle}.`,
      actions: [action],
      suggestions: baseSuggestions,
    };
  }

  if (isFlashcardIntent(normalized)) {
    return {
      mode: 'flashcard',
      reply: 'Siap. Buka flashcard topic terakhir yang kamu pakai (fallback: Body Parts).',
      actions: [getFlashcardAction()],
      suggestions: baseSuggestions,
    };
  }

  return {
    mode: 'flashcard',
    reply: 'Sebutkan topic agar saya buka flashcard yang tepat. Contoh: "flashcard kitchen".',
    actions: [getFlashcardAction()],
    suggestions: baseSuggestions,
  };
};
