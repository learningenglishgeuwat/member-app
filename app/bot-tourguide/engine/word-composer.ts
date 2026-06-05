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
  if (trimmed.includes('\uFFFD')) return false;
  if (/\u00C3|\u00C2|\u00EF\u00BF\u00BD/.test(trimmed)) return false;
  if (!trimmed.startsWith('/') || !trimmed.endsWith('/')) return false;
  return true;
};

const getPronunciationFallbackExample = (entry: WordKnowledgeEntry): string => {
  const key = `${entry.id} ${entry.term} ${entry.aliases.join(' ')}`.toLowerCase();

  if (key.includes('s-es') || key.includes('final sound s') || key.includes('plural s')) {
    return 'Contoh cepat: cats -> /s/, dogs -> /z/, watches -> /Iz/. Pilih ending dari bunyi akhir kata dasar, bukan dari huruf terakhir saja.';
  }
  if (key.includes('ed-ending') || key.includes('final sound d') || key.includes('past ending')) {
    return 'Contoh cepat: watched -> /t/, played -> /d/, wanted -> /Id/. Kelompokkan verb ke tiga pola ini saat latihan.';
  }
  if (key.includes('flap')) {
    return 'Contoh cepat: water dan better sering memakai flap t, yaitu ketukan lidah cepat yang terdengar seperti soft d.';
  }
  if (key.includes('glottal')) {
    return 'Contoh cepat: button bisa memakai glottal stop pada speech casual, seperti ada hentian mikro di tenggorokan.';
  }
  if (key.includes('unreleased')) {
    return 'Contoh cepat: pada right now, final /t/ bisa ditahan ringan sebelum /n/ tanpa letupan penuh.';
  }
  if (key.includes('intonation')) {
    return 'Contoh cepat: You are ready. biasanya falling, sedangkan Are you ready? sering rising di akhir.';
  }
  if (key.includes('word stress')) {
    return 'Contoh cepat: PREsent dan preSENT punya tekanan berbeda, sehingga ritme dan fungsi katanya ikut berubah.';
  }
  if (key.includes('sentence stress')) {
    return 'Contoh cepat: I WANT tea dan I want TEA menekan informasi yang berbeda.';
  }
  if (key.includes('linking')) {
    return 'Contoh cepat: an apple terdengar lebih menyambung karena konsonan akhir bertemu vokal awal.';
  }
  if (key.includes('contraction')) {
    return 'Contoh cepat: I am -> I\'m, do not -> don\'t, going to -> gonna untuk konteks lisan santai.';
  }
  if (key.includes('minimal pair')) {
    return 'Contoh cepat: ship vs sheep. Satu bunyi kecil berubah, makna ikut berubah.';
  }

  return '';
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

  const fallbackExample = getPronunciationFallbackExample(entry);
  const sentence3 =
    entry.exampleEn && entry.exampleTranslation
      ? ensureSentence(`Contoh cepat: "${entry.exampleEn}" (${entry.exampleTranslation})`)
      : entry.exampleEn
        ? ensureSentence(`Contoh cepat: "${entry.exampleEn}"`)
        : fallbackExample;

  const sentence4 = ensureSentence(
    'Pola latihan aman: dengarkan target, tirukan pelan, rekam singkat, lalu koreksi satu bunyi saja',
  );

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
    reply: [sentence1, sentence2, sentence3, sentence4].filter(Boolean).join(' '),
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
