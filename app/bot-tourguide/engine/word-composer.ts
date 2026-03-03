import type { GuideAction, GuideSourceLink, WordKnowledgeEntry } from '../types';

type WordComposedResult = {
  reply: string;
  suggestions: string[];
  actions: GuideAction[];
  sources?: GuideSourceLink[];
};

const uniqueBy = <T>(items: T[], keyGetter: (item: T) => string): T[] => {
  const map = new Map<string, T>();
  for (const item of items) {
    const key = keyGetter(item);
    if (!map.has(key)) {
      map.set(key, item);
    }
  }
  return Array.from(map.values());
};

const toRouteAction = (route?: string, label?: string): GuideAction | null => {
  if (!route) return null;
  return {
    kind: 'route',
    label: label ?? 'Buka materi',
    path: route,
  };
};

const ensureSentence = (text: string): string => {
  const trimmed = text.trim();
  if (!trimmed) return '';
  if (/[.!?]$/.test(trimmed)) return trimmed;
  return `${trimmed}.`;
};

const pickVariant = (seed: string, variants: string[]): string => {
  if (!variants.length) return '';
  const total = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return variants[total % variants.length] ?? variants[0] ?? '';
};

const guideActionKey = (item: GuideAction): string => {
  if (item.kind === 'route') return `route:${item.path}`;
  if (item.kind === 'dashboard-view') return `dashboard-view:${item.viewId}`;
  if (item.kind === 'logout') return 'logout';
  return `simulation:${item.simulationTopic}`;
};

export const isDisplayableIpa = (value?: string): boolean => {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes('\\u')) return false;
  if (trimmed.includes('�')) return false;
  if (!trimmed.startsWith('/') || !trimmed.endsWith('/')) return false;
  return true;
};

const composePronunciationReply = (entry: WordKnowledgeEntry): WordComposedResult => {
  const opening = pickVariant(entry.id, [
    `Sederhananya, "${entry.term}" itu`,
    `Kalau gampangnya, "${entry.term}" itu`,
    `Singkatnya, "${entry.term}" itu`,
  ]);

  const sentence1 = entry.definitionId
    ? ensureSentence(`${opening} ${entry.definitionId}`)
    : ensureSentence(
        `${opening} istilah bunyi yang bantu ucapanmu lebih jelas dan natural`,
      );

  const sentence2 = entry.coachingTipId
    ? ensureSentence(`Biar cepat kebayang, coba gini: ${entry.coachingTipId}`)
    : ensureSentence('Mulai pelan dulu, lalu naikkan tempo setelah bunyi utamanya stabil');

  const sentence3 =
    entry.exampleEn && entry.exampleTranslation
      ? ensureSentence(`Contoh cepat: "${entry.exampleEn}" (${entry.exampleTranslation})`)
      : entry.exampleEn
        ? ensureSentence(`Contoh cepat: "${entry.exampleEn}"`)
        : '';

  const suggestions = [
    `cara latihan ${entry.term}`,
    `contoh ${entry.term}`,
    entry.route ? `buka ${entry.term.toLowerCase()}` : 'buka pronunciation',
  ];

  const actions = uniqueBy(
    [toRouteAction(entry.route, 'Buka latihan pronunciation')].filter(
      (item): item is GuideAction => Boolean(item),
    ),
    guideActionKey,
  );

  return {
    reply: [sentence1, sentence2, sentence3].filter(Boolean).join(' '),
    suggestions,
    actions,
    sources: entry.route ? [{ label: `Pronunciation: ${entry.term}`, path: entry.route }] : undefined,
  };
};

const composeGrammarTermReply = (entry: WordKnowledgeEntry): WordComposedResult => {
  const opening = pickVariant(entry.id, [
    `Kalau di Grammar Resource, "${entry.term}" itu`,
    `Untuk grammar, "${entry.term}" itu`,
    `Gampangnya, "${entry.term}" itu`,
  ]);

  const sentence1 = entry.definitionId
    ? ensureSentence(`${opening} ${entry.definitionId}`)
    : ensureSentence(`${opening} konsep yang dipakai untuk membangun kalimat yang lebih tepat`);

  const sentence2 = entry.coachingTipId
    ? ensureSentence(`Cara latih cepat: ${entry.coachingTipId}`)
    : ensureSentence('Cara latih cepat: ambil satu pola, buat tiga contoh kalimat, lalu cek strukturnya');

  const sentence3 = ensureSentence('Kalau kamu mau, saya bisa kasih contoh kalimat paling sering dipakai');

  const suggestions = [
    `contoh ${entry.term}`,
    `cara latihan ${entry.term}`,
    entry.route ? `buka ${entry.term.toLowerCase()}` : 'buka grammar resource',
  ];

  const actions = uniqueBy(
    [toRouteAction(entry.route, 'Buka materi grammar resource')].filter(
      (item): item is GuideAction => Boolean(item),
    ),
    guideActionKey,
  );

  return {
    reply: [sentence1, sentence2, sentence3].filter(Boolean).join(' '),
    suggestions,
    actions,
    sources: entry.route ? [{ label: `Grammar Resource: ${entry.term}`, path: entry.route }] : undefined,
  };
};

const composeVocabularyReply = (entry: WordKnowledgeEntry): WordComposedResult => {
  const sentence1 = entry.topicTitle
    ? `"${entry.term}" artinya "${entry.meaningId ?? '-'}" dan biasanya dipakai dalam topik ${entry.topicTitle}.`
    : `"${entry.term}" artinya "${entry.meaningId ?? '-'}".`;
  const sentence2 =
    entry.exampleEn && entry.exampleTranslation
      ? `Contoh natural: "${entry.exampleEn}" yang berarti "${entry.exampleTranslation}".`
      : `Kata ini umum dipakai dalam percakapan sehari-hari untuk konteks sederhana.`;
  const sentence3 = isDisplayableIpa(entry.ipa)
    ? `Pengucapan (IPA): ${entry.ipa}.`
    : '';

  const suggestions = [
    `jelaskan ${entry.term}`,
    `contoh ${entry.term}`,
    entry.topicTitle ? `buka topik ${entry.topicTitle.toLowerCase()}` : 'buka vocabulary',
  ];

  const actions = uniqueBy(
    [toRouteAction(entry.route, entry.topicTitle ? `Buka topik: ${entry.topicTitle}` : 'Buka Vocabulary')].filter(
      (item): item is GuideAction => Boolean(item),
    ),
    guideActionKey,
  );

  const sources = entry.route
    ? [{ label: entry.topicTitle ?? 'Topic Vocabulary', path: entry.route }]
    : undefined;

  return {
    reply: [sentence1, sentence2, sentence3].filter(Boolean).join(' '),
    suggestions,
    actions,
    sources,
  };
};

const composeNonVocabularyReply = (entry: WordKnowledgeEntry): WordComposedResult => {
  const sentence1 = `"${entry.term}" terkait materi di aplikasi belajar ini.`;
  const sentence2 =
    entry.shortAnswer ??
    `Istilah ini dipakai untuk menandai topik atau halaman belajar tertentu agar kamu bisa navigasi lebih cepat.`;
  const sentence3 = entry.route
    ? `Kalau mau, buka langsung halamannya untuk lihat penjelasan lengkap.`
    : '';

  const suggestions = [
    `apa itu ${entry.term}`,
    `jelaskan ${entry.term}`,
    entry.route ? `buka ${entry.term.toLowerCase()}` : 'buka skill',
  ];

  const action = toRouteAction(entry.route, `Buka materi: ${entry.term}`);

  return {
    reply: [sentence1, sentence2, sentence3].filter(Boolean).join(' '),
    suggestions,
    actions: action ? [action] : [],
    sources: entry.route ? [{ label: entry.term, path: entry.route }] : undefined,
  };
};

export const composeWordExplanationReply = (entry: WordKnowledgeEntry): WordComposedResult => {
  if (entry.sourceType === 'pronunciation-term') {
    return composePronunciationReply(entry);
  }
  if (entry.sourceType === 'grammar-term') {
    return composeGrammarTermReply(entry);
  }
  if (entry.sourceType === 'vocabulary') {
    return composeVocabularyReply(entry);
  }
  return composeNonVocabularyReply(entry);
};

export const composeUnknownWordReply = (
  queryTerm: string,
  candidates: WordKnowledgeEntry[],
): WordComposedResult => {
  const suggestionTerms = uniqueBy(candidates, (item) => item.term).map((item) => item.term).slice(0, 3);
  const actions = uniqueBy(
    candidates
      .map((item) => toRouteAction(item.route, `Buka: ${item.term}`))
      .filter((item): item is GuideAction => Boolean(item))
      .slice(0, 3),
    guideActionKey,
  );

  return {
    reply: `Saya belum menemukan kata "${queryTerm}" di index materi saat ini. Coba pakai kata yang lebih spesifik atau pilih kata terdekat di bawah ini.`,
    suggestions: suggestionTerms.length ? suggestionTerms.map((term) => `jelaskan ${term}`) : ['buka vocabulary'],
    actions: actions.length ? actions : [{ kind: 'route', label: 'Buka Vocabulary', path: '/skill/vocabulary' }],
  };
};
