import { GUIDE_QA_MAP, GUIDE_ROUTE_MAP, scopeFromPathname } from '../routeMap';
import { buildClarificationPrompt } from '../engine/clarification';
import { buildConfidenceScore, getConfidenceBand } from '../engine/confidence';
import { isDefinitionStyleQuery, normalizeGuideText, parseGuideQuery, toGuideTokens } from '../engine/nlu';
import { composeQaReply } from '../engine/response-composer';
import { loadConversationState, saveConversationState } from '../engine/session-memory';
import { trackGuideTelemetry } from '../engine/telemetry';
import { composeUnknownWordReply, composeWordExplanationReply } from '../engine/word-composer';
import { resolveWordExplanation } from '../engine/word-query';
import { SPEAKING_GOALS } from '../../skill/speaking/data/goals';
import { SPEAKING_PHASES } from '../../skill/speaking/data/phases';
import { VOCABULARY_TOPICS } from '../../skill/vocabulary/topic/data/topics';
import type {
  GuideAction,
  GuideDashboardViewId,
  GuideIndexedRoute,
  GuideModeResult,
  GuideQaEntry,
  ParsedQuery,
} from '../types';

const QA_DEFAULT_SUGGESTIONS = [
  'apa itu final sound s/es',
  'beda flap t dan glottal',
  'fungsi grammar resource',
];

const PRONUNCIATION_ROUTE_PREFIX = '/skill/pronunciation';
const SPEAKING_ROUTE_PREFIX = '/skill/speaking';
const VOCABULARY_ROUTE_PREFIX = '/skill/vocabulary';

const buildPhaseAlias = (phaseId: string): string => {
  const match = phaseId.match(/cefr-a1-(\d+)/);
  if (!match) return phaseId;
  return `a1.${match[1]}`;
};

const speakingHubEntry: GuideQaEntry = {
  topicId: 'speaking-roadmap-main',
  title: 'Speaking Roadmap',
  route: '/skill/speaking',
  keywords: [
    'speaking',
    'roadmap speaking',
    'speaking roadmap',
    'latihan speaking',
    'cefr speaking',
    'speaking a1',
  ],
  shortAnswer:
    'Speaking Roadmap dipakai untuk latihan komunikasi bertahap dari Survival Response sampai Simple Transaction and Direction.',
  sourceSections: [{ label: 'Buka Speaking Roadmap', route: '/skill/speaking' }],
};

const speakingPhaseEntries: GuideQaEntry[] = SPEAKING_PHASES.map((phase) => {
  const phaseAlias = buildPhaseAlias(phase.id);
  return {
    topicId: `speaking-phase-${phase.id}`,
    title: `Speaking Phase: ${phase.title}`,
    route: `/skill/speaking?phase=${phase.id}`,
    keywords: [
      phase.id,
      phase.id.replace(/-/g, ' '),
      phaseAlias,
      `phase ${phaseAlias}`,
      `phase ${phase.id}`,
      `speaking ${phaseAlias}`,
      phase.title,
      `speaking ${phase.title}`,
      phase.subtitle,
    ],
    shortAnswer: `${phase.subtitle} Targetnya: ${phase.targetOutput}`,
    sourceSections: [{ label: `Buka ${phase.title}`, route: `/skill/speaking?phase=${phase.id}` }],
  };
});

const speakingGoalEntries: GuideQaEntry[] = SPEAKING_GOALS.map((goal) => {
  const shortCodeMatch = goal.id.match(/g\d+$/i);
  const shortCode = shortCodeMatch ? shortCodeMatch[0].toLowerCase() : '';
  const phaseAlias = buildPhaseAlias(goal.phaseId);
  const topicTokens = [goal.id, goal.id.replace(/-/g, ' '), goal.goal, goal.situation].filter(Boolean);
  const codeAliases = shortCode
    ? [
        shortCode,
        `${phaseAlias} ${shortCode}`,
        `${goal.phaseId} ${shortCode}`,
        `goal ${shortCode}`,
        `goal ${goal.goalOrder}`,
      ]
    : [];

  return {
    topicId: `speaking-goal-${goal.id}`,
    title: `Speaking Goal ${goal.id.toUpperCase()}`,
    route: `/skill/speaking/cefr-a1/${goal.id}`,
    keywords: [
      ...topicTokens,
      ...codeAliases,
      `${goal.goal} speaking`,
      `latihan ${goal.goal}`,
      `${goal.phaseTitle} ${goal.goal}`,
    ],
    shortAnswer: `Goal ini melatih: ${goal.goal} Situasi: ${goal.situation} Drill: ${goal.drill}`,
    sourceSections: [{ label: `Buka goal ${goal.id.toUpperCase()}`, route: `/skill/speaking/cefr-a1/${goal.id}` }],
  };
});

const vocabularyHubEntry: GuideQaEntry = {
  topicId: 'vocabulary-topics-main',
  title: 'Vocabulary Topics',
  route: '/skill/vocabulary',
  keywords: [
    'vocabulary',
    'vocab',
    'kosakata',
    'topic vocabulary',
    'vocabulary topics',
    'roadmap vocabulary',
    'vocabulary roadmap',
  ],
  shortAnswer:
    'Vocabulary Topics berisi topik kosakata bertahap dari fondasi harian sampai konteks sosial, akademik, dan digital.',
  sourceSections: [{ label: 'Buka Vocabulary Topics', route: '/skill/vocabulary' }],
};

const vocabularyTopicEntries: GuideQaEntry[] = VOCABULARY_TOPICS.map((topic) => {
  const topicIdSpaced = topic.topicId.replace(/-/g, ' ');
  return {
    topicId: `vocabulary-topic-${topic.topicId}`,
    title: `Vocabulary: ${topic.title}`,
    route: `/skill/vocabulary/topic/pages/${topic.topicId}`,
    keywords: [
      topic.title,
      topic.topicId,
      topicIdSpaced,
      `vocabulary ${topic.title}`,
      `vocabulary ${topicIdSpaced}`,
      `kosakata ${topic.title}`,
      `kosakata ${topicIdSpaced}`,
      `topik ${topic.title}`,
      topic.subtitle,
    ],
    shortAnswer: `${topic.subtitle} Fokus materi: ${topic.description}`,
    sourceSections: [{ label: `Buka topic ${topic.title}`, route: `/skill/vocabulary/topic/pages/${topic.topicId}` }],
  };
});

const dashboardViewEntries: GuideQaEntry[] = [
  {
    topicId: 'dashboard-view-dashboard',
    title: 'Dashboard Overview',
    route: '/dashboard',
    keywords: ['dashboard', 'beranda member', 'home dashboard', 'start journey'],
    shortAnswer:
      'Dashboard adalah pusat kontrol belajar untuk masuk ke skill, memantau status, dan mengakses fitur utama GEUWAT.',
    sourceSections: [{ label: 'Buka Dashboard', route: '/dashboard' }],
  },
  {
    topicId: 'dashboard-view-notifications',
    title: 'Dashboard Notifications',
    route: '/dashboard',
    keywords: ['notifications', 'notifikasi', 'notif dashboard'],
    shortAnswer:
      'Notifications menampilkan update penting terkait pembelajaran, reminder aktivitas, dan informasi sistem akun.',
    sourceSections: [{ label: 'Buka Notifications', route: '/dashboard' }],
  },
  {
    topicId: 'dashboard-view-progress',
    title: 'Dashboard Progress',
    route: '/dashboard',
    keywords: ['progress dashboard', 'progres belajar', 'learning progress', 'practice progress'],
    shortAnswer:
      'Progress menampilkan ringkasan capaian belajar per skill, termasuk learning progress dan practice progress.',
    sourceSections: [{ label: 'Buka Progress', route: '/dashboard' }],
  },
  {
    topicId: 'dashboard-view-achievements',
    title: 'Dashboard Achievements',
    route: '/dashboard',
    keywords: ['achievements', 'pencapaian', 'tier benefits', 'benefit member'],
    shortAnswer:
      'Achievements dipakai untuk apresiasi member, menampilkan benefit tier, dan ringkasan nilai kontribusi akun.',
    sourceSections: [{ label: 'Buka Achievements', route: '/dashboard' }],
  },
  {
    topicId: 'dashboard-view-tutorial',
    title: 'Dashboard Tutorial',
    route: '/dashboard',
    keywords: ['tutorial dashboard', 'panduan aplikasi', 'roadmap tutorial'],
    shortAnswer:
      'Tutorial berisi roadmap terstruktur supaya kamu bisa mulai dari fitur dasar sampai alur belajar lanjutan.',
    sourceSections: [{ label: 'Buka Tutorial', route: '/dashboard' }],
  },
  {
    topicId: 'dashboard-view-settings',
    title: 'Dashboard Settings',
    route: '/dashboard',
    keywords: ['settings', 'pengaturan', 'setting akun'],
    shortAnswer:
      'Settings dipakai untuk mengatur preferensi akun, session, dan konfigurasi penggunaan aplikasi.',
    sourceSections: [{ label: 'Buka Settings', route: '/dashboard' }],
  },
  {
    topicId: 'dashboard-view-device-approve',
    title: 'Dashboard Approve Device',
    route: '/dashboard',
    keywords: ['approve device', 'device approve', 'verifikasi perangkat'],
    shortAnswer:
      'Approve Device dipakai untuk memverifikasi perangkat yang dipakai login agar akses akun lebih aman.',
    sourceSections: [{ label: 'Buka Approve Device', route: '/dashboard' }],
  },
  {
    topicId: 'dashboard-view-help-support',
    title: 'Dashboard Help and Support',
    route: '/dashboard',
    keywords: ['help support', 'bantuan', 'dukungan', 'pusat bantuan'],
    shortAnswer:
      'Help and Support berisi panduan troubleshooting, bantuan penggunaan fitur, dan kanal dukungan pengguna.',
    sourceSections: [{ label: 'Buka Help and Support', route: '/dashboard' }],
  },
];

const SYNTHETIC_QA_ENTRIES: GuideQaEntry[] = [
  speakingHubEntry,
  ...speakingPhaseEntries,
  ...speakingGoalEntries,
  vocabularyHubEntry,
  ...vocabularyTopicEntries,
  ...dashboardViewEntries,
];

const QA_KNOWLEDGE_MAP: GuideQaEntry[] = Array.from(
  [...GUIDE_QA_MAP, ...SYNTHETIC_QA_ENTRIES]
    .reduce((map, entry) => {
      map.set(entry.topicId, entry);
      return map;
    }, new Map<string, GuideQaEntry>())
    .values(),
);

const DASHBOARD_TOPIC_TO_VIEW_ID: Record<string, GuideDashboardViewId> = {
  'dashboard-view-dashboard': 'dashboard',
  'dashboard-view-notifications': 'notifications',
  'dashboard-view-progress': 'progress',
  'dashboard-view-achievements': 'achievements',
  'dashboard-view-tutorial': 'tutorial',
  'dashboard-view-settings': 'settings',
  'dashboard-view-device-approve': 'device-approve',
  'dashboard-view-help-support': 'help-support',
};

const QA_SCOPE_SUGGESTIONS: Record<string, string[]> = {
  pronunciation: ['apa itu final sound s/es', 'beda flap t dan glottal', 'cara pakai pronunciation text'],
  speaking: ['apa fokus survival response', 'jelaskan goal cefr-a1-2-g09', 'cara latihan speaking practice'],
  vocabulary: ['apa fokus topic family vocabulary', 'beda number dan ordinal number', 'cara latihan topic shopping'],
  grammar: ['apa itu present simple', 'beda simple past dan present perfect', 'fungsi grammar resource'],
  'grammar-resource': ['apa itu present simple', 'cara pakai conditionals', 'kapan pakai passive voice'],
  dashboard: ['fungsi approve device', 'fungsi progress dashboard', 'fungsi help and support'],
  general: QA_DEFAULT_SUGGESTIONS,
};

const PRONUNCIATION_COACHING_FOCUS: Record<string, string> = {
  'pronunciation-alphabet-core': 'ketepatan bunyi huruf satu per satu',
  'american-t-flap-vs-glottal': 'membedakan /ɾ/ (flap) vs /ʔ/ (glottal) di konteks nyata',
  'american-t-ending-patterns': 'kontrol final /t/ supaya tidak selalu dilepas keras',
  'pronunciation-hub-overview': 'memilih urutan latihan pronunciation yang paling efektif',
  'final-sound-hub-overview': 'membaca bunyi akhir kata sebelum sambung ke kata berikutnya',
  'final-sound-d-ed-rules': 'memilih bunyi /t/, /d/, /ɪd/ secara konsisten',
  'final-sound-s-es-core-rules': 'memilih bunyi /s/, /z/, /ɪz/ berdasarkan bunyi akhir dasar',
  'final-sound-s-es-practice': 'menjaga konsistensi bunyi akhir saat tempo bicara naik',
  'intonation-overview': 'mengatur naik-turun nada supaya maksud kalimat jelas',
  'phonetic-symbols-basics': 'membaca IPA sebagai peta bunyi, bukan hafalan simbol semata',
  'minimal-pairs-purpose': 'melatih telinga membedakan bunyi mirip',
  'phonetic-summary-fast-review': 'review cepat simbol yang paling sering dipakai',
  'tongue-twister-practice-goal': 'kelincahan artikulasi tanpa mengorbankan kejelasan bunyi',
  'stressing-word-stress-rules': 'menentukan suku kata yang harus ditekan',
  'pronunciation-text-how-to-use': 'menerapkan teori bunyi ke bacaan utuh',
};

const PRONUNCIATION_COACHING_STEPS: Record<string, string> = {
  'pronunciation-alphabet-core':
    'Latih 5 huruf dulu, rekam, lalu bandingkan dengan audio native sebelum lanjut set berikutnya.',
  'american-t-flap-vs-glottal':
    'Mulai dari pasangan kata sederhana, lalu naik ke frasa agar telinga cepat peka ke pola bunyinya.',
  'american-t-ending-patterns':
    'Ucapkan kata akhir + kata berikutnya sebagai satu unit, lalu cek kapan /t/ released atau unreleased.',
  'pronunciation-hub-overview':
    'Ambil satu topik inti per sesi 10 menit agar progres lebih stabil daripada lompat-lompat materi.',
  'final-sound-hub-overview':
    'Biasakan identifikasi bunyi akhir dulu, baru putuskan ending sound saat speaking cepat.',
  'final-sound-d-ed-rules':
    'Kelompokkan verb ke tiga kolom /t/ /d/ /ɪd/, lalu latih kolom per kolom.',
  'final-sound-s-es-core-rules':
    'Cek bunyi akhir kata dasar, tentukan rule, lalu ulangi 8-10 contoh sampai otomatis.',
  'final-sound-s-es-practice':
    'Pakai drill pendek harian: dengar, tirukan, rekam, dan koreksi bunyi akhir secara spesifik.',
  'intonation-overview':
    'Latih perbedaan rising vs falling di kalimat yang sama agar kontrol nadanya lebih terasa.',
  'phonetic-symbols-basics':
    'Fokuskan simbol yang paling sering muncul di kata harian sebelum masuk simbol lanjutan.',
  'minimal-pairs-purpose':
    'Latih pola A-B-A-B sambil rekam supaya selisih bunyi kecil tetap terdengar jelas.',
  'phonetic-summary-fast-review':
    'Gunakan ringkasan ini sebagai warm-up 3 menit sebelum latihan speaking utama.',
  'tongue-twister-practice-goal':
    'Mulai lambat dengan artikulasi bersih, lalu naikkan kecepatan bertahap.',
  'stressing-word-stress-rules':
    'Tepuk per suku kata, tandai stress utama, lalu ulangi kata dalam kalimat.',
  'pronunciation-text-how-to-use':
    'Baca origin text dulu untuk flow, lalu cek tab transcription untuk koreksi detail bunyi.',
};

const QA_LOW_CONFIDENCE_SCORE = 52;
const QA_STRONG_SCORE = 84;
const QA_AMBIGUOUS_GAP = 18;
const QA_NOISE_WORDS = new Set([
  'apa',
  'itu',
  'jelaskan',
  'definisi',
  'tentang',
  'dan',
  'yang',
  'dengan',
  'untuk',
  'the',
  'a',
  'an',
  'of',
  'to',
  'in',
  'on',
  'is',
  'are',
]);

const QA_TOPIC_DEFINITION_LEADS: Record<string, string> = {
  'grammar-resource-foundation-grammar-nouns-types-and-functions':
    'Noun adalah kata benda yang menamai orang, benda, tempat, ide, atau konsep.',
  'grammar-resource-foundation-grammar-verbs--main-verbs-and-auxiliaries-be-do-have':
    'Verb adalah kata kerja yang menyatakan aksi, proses, atau keadaan.',
  'grammar-resource-foundation-grammar-adjectives-function-and-position':
    'Adjective adalah kata sifat yang menjelaskan noun atau pronoun.',
  'grammar-resource-foundation-grammar-adverbs-function-and-position':
    'Adverb adalah kata keterangan yang memodifikasi verb, adjective, adverb lain, atau kalimat.',
  'grammar-resource-foundation-grammar-pronouns-subject-object-possessive-reflexive':
    'Pronoun adalah kata ganti yang menggantikan noun agar kalimat tidak berulang.',
  'grammar-resource-foundation-grammar-parts-of-speech':
    'Parts of speech adalah klasifikasi kata berdasarkan fungsi dalam kalimat.',
  'grammar-resource-noun-and-determiner-system-countable-and-uncountable-nouns':
    'Plural adalah bentuk jamak untuk menyatakan jumlah lebih dari satu.',
  'american-t-flap-vs-glottal':
    'American T adalah variasi pengucapan bunyi /t/ dalam aksen Amerika, terutama pada posisi tengah dan akhir kata.',
};

const QA_DIRECT_TOPIC_OVERRIDES: Array<{ phrases: string[]; topicId: string }> = [
  {
    phrases: [
      'alphabet',
      'apa itu alphabet',
      'alphabet itu apa',
      'jelaskan alphabet',
      'pronunciation alphabet',
      'alphabet pronunciation',
      'abjad',
      'apa itu abjad',
      'abjad itu apa',
      'huruf english',
      'huruf inggris',
    ],
    topicId: 'pronunciation-alphabet-core',
  },
  {
    phrases: [
      'speaking',
      'speaking roadmap',
      'roadmap speaking',
      'latihan speaking',
      'cefr speaking',
    ],
    topicId: 'speaking-roadmap-main',
  },
  {
    phrases: [
      'vocabulary',
      'vocab',
      'kosakata',
      'vocabulary topics',
      'topic vocabulary',
      'roadmap vocabulary',
      'vocabulary roadmap',
    ],
    topicId: 'vocabulary-topics-main',
  },
  {
    phrases: ['notifications dashboard', 'notifikasi dashboard', 'fungsi notifications'],
    topicId: 'dashboard-view-notifications',
  },
  {
    phrases: ['progress dashboard', 'fungsi progress dashboard', 'progres dashboard'],
    topicId: 'dashboard-view-progress',
  },
  {
    phrases: ['achievements dashboard', 'fungsi achievements', 'pencapaian dashboard'],
    topicId: 'dashboard-view-achievements',
  },
  {
    phrases: ['approve device', 'fungsi approve device', 'verifikasi perangkat'],
    topicId: 'dashboard-view-device-approve',
  },
  {
    phrases: ['help support', 'fungsi help support', 'pusat bantuan'],
    topicId: 'dashboard-view-help-support',
  },
  {
    phrases: [
      'noun',
      'nouns',
      'apa itu noun',
      'apa itu nouns',
      'jelaskan noun',
      'definisi noun',
      'kata benda',
      'apa itu kata benda',
    ],
    topicId: 'grammar-resource-foundation-grammar-nouns-types-and-functions',
  },
  {
    phrases: [
      'verb',
      'verbs',
      'apa itu verb',
      'apa itu verbs',
      'jelaskan verb',
      'kata kerja',
      'apa itu kata kerja',
    ],
    topicId: 'grammar-resource-foundation-grammar-verbs--main-verbs-and-auxiliaries-be-do-have',
  },
  {
    phrases: ['adjective', 'adjectives', 'apa itu adjective', 'apa itu adjectives', 'kata sifat'],
    topicId: 'grammar-resource-foundation-grammar-adjectives-function-and-position',
  },
  {
    phrases: ['adverb', 'adverbs', 'apa itu adverb', 'apa itu adverbs', 'kata keterangan'],
    topicId: 'grammar-resource-foundation-grammar-adverbs-function-and-position',
  },
  {
    phrases: ['pronoun', 'pronouns', 'apa itu pronoun', 'apa itu pronouns', 'kata ganti'],
    topicId: 'grammar-resource-foundation-grammar-pronouns-subject-object-possessive-reflexive',
  },
  {
    phrases: ['parts of speech', 'apa itu parts of speech'],
    topicId: 'grammar-resource-foundation-grammar-parts-of-speech',
  },
  {
    phrases: [
      'plural',
      'apa itu plural',
      'plural noun',
      'plural nouns',
      'apa itu plural noun',
      'jamak',
      'bentuk jamak',
    ],
    topicId: 'grammar-resource-noun-and-determiner-system-countable-and-uncountable-nouns',
  },
  {
    phrases: ['singular', 'apa itu singular', 'tunggal', 'bentuk tunggal'],
    topicId: 'grammar-resource-noun-and-determiner-system-countable-and-uncountable-nouns',
  },
  {
    phrases: ['american t', 'apa itu american t', 'jelaskan american t', 't american'],
    topicId: 'american-t-flap-vs-glottal',
  },
];

const toSearchTokens = (text: string): string[] =>
  toGuideTokens(text).filter((token) => token.length > 1 && !QA_NOISE_WORDS.has(token));

const isPronunciationQaEntry = (entry: GuideQaEntry): boolean =>
  entry.route.startsWith(PRONUNCIATION_ROUTE_PREFIX);

const buildPronunciationCoachingCore = (entry: GuideQaEntry, baseAnswer: string): string => {
  const focus =
    PRONUNCIATION_COACHING_FOCUS[entry.topicId] ??
    'kontrol bunyi utama, ritme, dan kejelasan saat bicara natural';
  const step =
    PRONUNCIATION_COACHING_STEPS[entry.topicId] ??
    'Latih dari unit kecil (kata/frasa), rekam singkat, lalu evaluasi satu target bunyi per sesi.';

  return `${baseAnswer} Fokus coaching: ${focus}. Cara latih cepat: ${step}`;
};

const buildPronunciationSuggestions = (entry: GuideQaEntry): string[] => {
  const keywordA = entry.keywords[0] || 'latihan pronunciation';
  const keywordB = entry.keywords[1] || entry.title.toLowerCase();
  return [`cara latihan ${keywordA}`, `contoh ${keywordB}`, `buka ${entry.title.toLowerCase()}`];
};

const getScopeSuggestionKey = (path?: string): keyof typeof QA_SCOPE_SUGGESTIONS => {
  if (path?.startsWith(SPEAKING_ROUTE_PREFIX)) return 'speaking';
  if (path?.startsWith(VOCABULARY_ROUTE_PREFIX)) return 'vocabulary';
  const scope = scopeFromPathname(path);
  if (scope === 'dashboard') return 'dashboard';
  if (scope === 'pronunciation') return 'pronunciation';
  if (scope === 'grammar') return 'grammar';
  if (scope === 'grammar-resource') return 'grammar-resource';
  return 'general';
};

const getScopedQaSuggestions = (pathname?: string, entryRoute?: string): string[] => {
  const key = getScopeSuggestionKey(entryRoute || pathname);
  return QA_SCOPE_SUGGESTIONS[key] ?? QA_DEFAULT_SUGGESTIONS;
};

const getEntrySuggestions = (entry: GuideQaEntry, pathname?: string): string[] => {
  if (isPronunciationQaEntry(entry)) {
    return buildPronunciationSuggestions(entry);
  }
  const title = entry.title.toLowerCase();
  if (entry.route.startsWith(SPEAKING_ROUTE_PREFIX)) {
    return [`cara latihan ${title}`, 'buka speaking roadmap', 'start speaking practice'];
  }
  if (entry.route.startsWith(VOCABULARY_ROUTE_PREFIX)) {
    return [`latihan cepat ${title}`, `contoh kalimat ${title}`, 'buka vocabulary roadmap'];
  }
  if (entry.route.startsWith('/dashboard')) {
    return ['fungsi notifications dashboard', 'fungsi progress dashboard', 'fungsi approve device'];
  }
  return getScopedQaSuggestions(pathname, entry.route);
};

const buildEntryPrimaryAction = (entry: GuideQaEntry): GuideAction => {
  const viewId = DASHBOARD_TOPIC_TO_VIEW_ID[entry.topicId];
  if (viewId) {
    return {
      kind: 'dashboard-view',
      label: `Buka Dashboard: ${entry.title.replace(/^Dashboard\s*/i, '')}`,
      viewId,
    };
  }

  return {
    kind: 'route',
    label: `Buka materi: ${entry.title}`,
    path: entry.route,
  };
};

const routeToAction = (route: GuideIndexedRoute): GuideAction => ({
  kind: 'route',
  label: route.label,
  path: route.path,
});

const qaSourceToLink = (entry: GuideQaEntry) => {
  if (!entry.sourceSections.length) {
    return [{ label: 'Buka sumber materi', path: entry.route }];
  }

  return entry.sourceSections.map((section) => {
    const basePath = section.route || entry.route;
    const path = section.anchor ? `${basePath}#${section.anchor}` : basePath;
    return { label: section.label, path };
  });
};

const buildDefinitionStyleReply = (entry: GuideQaEntry): string => {
  const directLead = QA_TOPIC_DEFINITION_LEADS[entry.topicId];
  if (directLead) {
    return `${directLead} ${entry.shortAnswer}`;
  }
  return entry.shortAnswer;
};

const resolveDirectTopicEntry = (normalizedQuery: string): GuideQaEntry | null => {
  if (!normalizedQuery) return null;

  const match = QA_DIRECT_TOPIC_OVERRIDES.find((item) =>
    item.phrases.some((phrase) => normalizeGuideText(phrase) === normalizedQuery),
  );
  if (!match) return null;

  return QA_KNOWLEDGE_MAP.find((entry) => entry.topicId === match.topicId) || null;
};

const scoreQaEntry = (queryNorm: string, entry: GuideQaEntry, pathname?: string): number => {
  const queryTokens = new Set(toSearchTokens(queryNorm));
  const titleNorm = normalizeGuideText(entry.title);
  const routeNorm = normalizeGuideText(entry.route);
  const keywordNorms = entry.keywords.map((keyword) => normalizeGuideText(keyword));

  let lexicalScore = 0;

  if (titleNorm === queryNorm) lexicalScore += 120;
  if (routeNorm.includes(queryNorm) || queryNorm.includes(routeNorm)) lexicalScore += 60;
  if (keywordNorms.some((keyword) => keyword === queryNorm)) lexicalScore += 140;
  if (titleNorm.includes(queryNorm) || queryNorm.includes(titleNorm)) lexicalScore += 70;

  keywordNorms.forEach((keyword) => {
    if (keyword.includes(queryNorm)) lexicalScore += 55;
    if (queryNorm.includes(keyword)) lexicalScore += 40;
    toSearchTokens(keyword).forEach((token) => {
      if (queryTokens.has(token)) lexicalScore += 10;
    });
  });

  if (lexicalScore <= 0) return 0;

  let score = lexicalScore;

  if (pathname) {
    const currentScope = scopeFromPathname(pathname);
    const entryScope = scopeFromPathname(entry.route);

    if (entry.route === pathname) score += 54;
    if (entryScope === currentScope) score += 28;
    if (currentScope === 'grammar' && entryScope === 'grammar-resource') score += 16;
    if (currentScope === 'grammar-resource' && entryScope === 'grammar') score += 10;
    if (currentScope === 'pronunciation' && entryScope === 'skill') score += 8;
  }

  return score;
};

const fallbackRoutes = (query: string, pathname?: string): GuideAction[] => {
  const queryNorm = normalizeGuideText(query);
  const currentScope = scopeFromPathname(pathname);

  const scopedDefaultRoutes = GUIDE_ROUTE_MAP.filter((route) => {
    if (!pathname) {
      return ['/dashboard', '/skill', '/skill/pronunciation', '/skill/speaking', '/skill/vocabulary'].includes(
        route.path,
      );
    }
    if (currentScope === 'dashboard') return route.path === '/dashboard';
    if (pathname.startsWith(PRONUNCIATION_ROUTE_PREFIX)) {
      return route.path.startsWith(PRONUNCIATION_ROUTE_PREFIX) || route.path === '/skill/pronunciation';
    }
    if (pathname.startsWith(SPEAKING_ROUTE_PREFIX)) {
      return route.path.startsWith(SPEAKING_ROUTE_PREFIX) || route.path === '/skill/speaking';
    }
    if (pathname.startsWith(VOCABULARY_ROUTE_PREFIX)) {
      return route.path.startsWith(VOCABULARY_ROUTE_PREFIX) || route.path === '/skill/vocabulary';
    }
    if (pathname.startsWith('/skill/grammar/grammar-resource')) {
      return route.path.startsWith('/skill/grammar/grammar-resource');
    }
    if (pathname.startsWith('/skill/grammar')) {
      return route.path.startsWith('/skill/grammar');
    }
    return ['/dashboard', '/skill', '/skill/pronunciation', '/skill/speaking', '/skill/vocabulary'].includes(
      route.path,
    );
  }).slice(0, 5);

  if (!queryNorm) return scopedDefaultRoutes.map(routeToAction);

  const queryTokens = new Set(toSearchTokens(queryNorm));
  return GUIDE_ROUTE_MAP.map((route) => {
    const labelNorm = normalizeGuideText(route.label);
    const keywordNorms = route.keywords.map((keyword) => normalizeGuideText(keyword));
    let score = 0;
    if (labelNorm.includes(queryNorm) || queryNorm.includes(labelNorm)) score += 50;
    keywordNorms.forEach((keyword) => {
      if (keyword.includes(queryNorm) || queryNorm.includes(keyword)) score += 30;
      toSearchTokens(keyword).forEach((token) => {
        if (queryTokens.has(token)) score += 8;
      });
    });
    if (pathname && scopeFromPathname(route.path) === currentScope) {
      score += 12;
    }
    return { route, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => routeToAction(item.route));
};

const buildTypoClarificationResult = (
  correctedQuery: string,
  entry?: GuideQaEntry,
): GuideModeResult => ({
  mode: 'qa',
  reply: `Aku mendeteksi kemungkinan typo. Maksudmu: "${correctedQuery}"?`,
  actions: entry ? [buildEntryPrimaryAction(entry)] : [],
  suggestions: [correctedQuery, ...QA_DEFAULT_SUGGESTIONS].slice(0, 5),
  confirmation: {
    kind: 'typo',
    correctedQuery,
  },
  meta: {
    source: 'qa-ai-like',
    confidence: 45,
    intent: 'clarification',
    answerType: 'clarification',
  },
});

const buildCandidateConfirmationResult = (
  queryTerm: string,
  candidates: Array<{ term: string; route?: string }>,
): GuideModeResult | null => {
  const top = candidates[0];
  if (!top?.term) return null;

  const nearbyTerms = candidates
    .slice(1, 3)
    .map((item) => item.term)
    .filter(Boolean);

  const reply =
    nearbyTerms.length > 0
      ? `Saya belum menemukan kata "${queryTerm}". Mungkin maksudmu "${top.term}"? (Yes/No). Alternatif lain: ${nearbyTerms
          .map((item) => `"${item}"`)
          .join(', ')}.`
      : `Saya belum menemukan kata "${queryTerm}". Mungkin maksudmu "${top.term}"? (Yes/No).`;

  const actions = top.route
    ? [{ kind: 'route' as const, label: `Buka: ${top.term}`, path: top.route }]
    : [];

  return {
    mode: 'qa',
    reply,
    actions,
    suggestions: candidates.slice(0, 3).map((item) => `jelaskan ${item.term}`),
    confirmation: {
      kind: 'candidate',
      correctedQuery: top.term,
    },
    meta: {
      source: 'qa-ai-like',
      confidence: 42,
      intent: 'clarification',
      answerType: 'clarification',
    },
  };
};

const buildClarificationResult = (
  parsed: ParsedQuery,
  candidates: Array<{ entry: GuideQaEntry; score: number }>,
  confidence: number,
): GuideModeResult => {
  const candidateTitles = candidates.slice(0, 3).map((item) => item.entry.title);
  const clarification = buildClarificationPrompt({
    parsed,
    candidateTitles,
  });

  const composed = composeQaReply({
    parsed,
    answerType: 'clarification',
    coreAnswer: clarification.question,
    suggestions: clarification.options,
  });

  return {
    mode: 'qa',
    reply: composed.text,
    actions: Array.from(
      new Map(
        candidates.slice(0, 3).map((item) => {
          const action = buildEntryPrimaryAction(item.entry);
          const key =
            action.kind === 'dashboard-view'
              ? `dashboard:${action.viewId}`
              : action.kind === 'route'
                ? `route:${action.path}`
                : action.kind === 'logout'
                  ? 'logout'
                  : `simulation:${action.simulationTopic}`;
          return [key, action];
        }),
      ).values(),
    ),
    suggestions: clarification.options,
    clarification,
    meta: {
      source: 'qa-ai-like',
      confidence,
      intent: parsed.intent,
      answerType: composed.answerType,
    },
  };
};

export const resolveQaMode = (
  query: string,
  options?: { pathname?: string; parsedQuery?: ParsedQuery },
): GuideModeResult => {
  const parsed = options?.parsedQuery ?? parseGuideQuery(query);
  const pathname = options?.pathname;
  const normalized = parsed.normalized;
  const memory = loadConversationState();
  const scopedSuggestions = getScopedQaSuggestions(pathname);

  if (!normalized) {
    return {
      mode: 'qa',
      reply:
        'Mode Tanya Materi aktif. Tanyakan konsep materi, aturan, atau perbedaan topik, nanti aku jawab singkat dengan sumber halaman.',
      actions: [],
      suggestions: scopedSuggestions,
      meta: {
        source: 'qa-ai-like',
        confidence: 100,
        intent: 'direct_answer',
        answerType: 'direct_answer',
      },
    };
  }

  if (!QA_KNOWLEDGE_MAP.length) {
    return {
      mode: 'qa',
      reply: 'Index Q&A belum tersedia. Kamu tetap bisa pakai mode Navigasi untuk buka halaman materi.',
      actions: fallbackRoutes(normalized, pathname),
      suggestions: scopedSuggestions,
      meta: {
        source: 'qa-ai-like',
        confidence: 20,
        intent: parsed.intent,
        answerType: 'fallback',
      },
    };
  }

  const directTopicEntry = resolveDirectTopicEntry(normalized);

  if (!directTopicEntry) {
    const wordMatch = resolveWordExplanation({
      parsed,
      memory,
    });

    if (wordMatch.isWordIntent) {
      if (wordMatch.entry && wordMatch.confidence >= 60) {
        const wordReply = composeWordExplanationReply(wordMatch.entry);
        saveConversationState({
          lastIntent: 'word_explanation',
          lastTopicId: wordMatch.entry.topicId,
          lastEntity: wordMatch.entry.term,
          lastMode: 'qa',
          lastAnswerType: 'word_explanation',
          lastExplainedTerm: wordMatch.entry.term,
          lastExplainedSourceType: wordMatch.entry.sourceType,
          updatedAt: Date.now(),
        });

        trackGuideTelemetry({
          query: parsed.raw,
          mode: 'qa',
          confidence: wordMatch.confidence,
          fallback: false,
          wordIntent: true,
          wordFound: true,
          wordSourceType: wordMatch.entry.sourceType,
        });

        return {
          mode: 'qa',
          reply: wordReply.reply,
          actions: wordReply.actions,
          suggestions: wordReply.suggestions,
          sources: wordReply.sources,
          meta: {
            source: 'qa-ai-like',
            confidence: wordMatch.confidence,
            intent: parsed.intent,
            answerType: 'word_explanation',
            wordSourceType: wordMatch.entry.sourceType,
            matchedTerm: wordMatch.entry.term,
          },
        };
      }

      const unknownWord = composeUnknownWordReply(
        wordMatch.queryTerm || parsed.entities[0] || normalized,
        wordMatch.candidates,
      );

      const candidateConfirmation = buildCandidateConfirmationResult(
        wordMatch.queryTerm || parsed.entities[0] || normalized,
        wordMatch.candidates.map((item) => ({ term: item.term, route: item.route })),
      );

      trackGuideTelemetry({
        query: parsed.raw,
        mode: 'qa',
        confidence: wordMatch.confidence,
        fallback: true,
        wordIntent: true,
        wordFound: false,
      });

      if (candidateConfirmation) {
        return candidateConfirmation;
      }

      return {
        mode: 'qa',
        reply: unknownWord.reply,
        actions: unknownWord.actions,
        suggestions: unknownWord.suggestions.length ? unknownWord.suggestions : scopedSuggestions,
        meta: {
          source: 'qa-ai-like',
          confidence: wordMatch.confidence,
          intent: parsed.intent,
          answerType: 'fallback',
        },
      };
    }
  }

  if (parsed.hasTypoCorrection && parsed.correctedQuery && parsed.correctedQuery !== normalizeGuideText(query)) {
    return buildTypoClarificationResult(parsed.correctedQuery, directTopicEntry || undefined);
  }

  const scoredEntries = QA_KNOWLEDGE_MAP.map((entry) => ({
    entry,
    score: scoreQaEntry(normalized, entry, pathname),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (directTopicEntry) {
    const withoutDirect = scoredEntries.filter((item) => item.entry.topicId !== directTopicEntry.topicId);
    withoutDirect.unshift({ entry: directTopicEntry, score: 210 });
    scoredEntries.splice(0, scoredEntries.length, ...withoutDirect);
  }

  if (
    parsed.isFollowUp &&
    memory?.lastTopicId &&
    !scoredEntries.length
  ) {
    const memoryEntry = QA_KNOWLEDGE_MAP.find((entry) => entry.topicId === memory.lastTopicId);
    if (memoryEntry) {
      scoredEntries.push({ entry: memoryEntry, score: 70 });
    }
  }

  if (!scoredEntries.length) {
    const composed = composeQaReply({
      parsed,
      answerType: 'fallback',
      coreAnswer: 'Coba tambahkan kata kunci yang lebih spesifik supaya saya bisa arahkan ke materi yang tepat.',
      suggestions: scopedSuggestions,
    });
    const actions = fallbackRoutes(normalized, pathname);

    trackGuideTelemetry({
      query: parsed.raw,
      mode: 'qa',
      confidence: 20,
      fallback: true,
      wordIntent: false,
    });

    return {
      mode: 'qa',
      reply: composed.text,
      actions,
      suggestions: composed.suggestions ?? scopedSuggestions,
      meta: {
        source: 'qa-ai-like',
        confidence: 20,
        intent: parsed.intent,
        answerType: composed.answerType,
      },
    };
  }

  const bestEntry = scoredEntries[0]?.entry;
  const bestScore = scoredEntries[0]?.score ?? 0;
  const secondScore = scoredEntries[1]?.score ?? 0;
  const lexicalConfidence = buildConfidenceScore({
    intentDetected: parsed.intent !== 'fallback',
    entityCount: parsed.entities.length,
    tokenCount: parsed.tokens.length,
    hasTypoCorrection: parsed.hasTypoCorrection,
    isFollowUp: parsed.isFollowUp,
    lexicalScore: bestScore,
  });
  const confidence = directTopicEntry ? 96 : lexicalConfidence;
  const confidenceBand = getConfidenceBand(confidence);
  const topCandidateUniqueRouteCount = new Set(
    scoredEntries.slice(0, 3).map((item) => item.entry.route),
  ).size;

  const isAmbiguous =
    scoredEntries.length > 1 &&
    topCandidateUniqueRouteCount > 1 &&
    (bestScore < QA_STRONG_SCORE || bestScore - secondScore <= QA_AMBIGUOUS_GAP);

  if (!bestEntry) {
    return {
      mode: 'qa',
      reply: 'Belum ada jawaban yang cocok untuk pertanyaan ini.',
      actions: fallbackRoutes(normalized, pathname),
      suggestions: scopedSuggestions,
      meta: {
        source: 'qa-ai-like',
        confidence: 10,
        intent: parsed.intent,
        answerType: 'fallback',
      },
    };
  }

  if (bestScore < QA_LOW_CONFIDENCE_SCORE || (parsed.needsClarification && confidenceBand !== 'high') || isAmbiguous) {
    const clarificationResult = buildClarificationResult(parsed, scoredEntries, confidence);
    trackGuideTelemetry({
      query: parsed.raw,
      mode: 'qa',
      confidence,
      fallback: false,
      wordIntent: false,
    });
    return clarificationResult;
  }

  const answerType = parsed.intent === 'fallback' ? 'direct_answer' : parsed.intent;
  const baseCoreAnswer = isDefinitionStyleQuery(normalized)
    ? buildDefinitionStyleReply(bestEntry)
    : bestEntry.shortAnswer;
  const isPronunciationEntry = isPronunciationQaEntry(bestEntry);
  const coreAnswer = isPronunciationEntry
    ? buildPronunciationCoachingCore(bestEntry, baseCoreAnswer)
    : baseCoreAnswer;

  const composed = composeQaReply({
    parsed,
    answerType,
    coreAnswer,
    suggestions: getEntrySuggestions(bestEntry, pathname),
    isFollowUpContext: parsed.isFollowUp && Boolean(memory?.lastTopicId),
  });

  saveConversationState({
    lastIntent: parsed.intent,
    lastTopicId: bestEntry.topicId,
    lastEntity: parsed.entities[0],
    lastMode: 'qa',
    lastAnswerType: composed.answerType,
    lastExplainedTerm: memory?.lastExplainedTerm,
    lastExplainedSourceType: memory?.lastExplainedSourceType,
    updatedAt: Date.now(),
  });

  trackGuideTelemetry({
    query: parsed.raw,
    mode: 'qa',
    confidence,
    fallback: false,
    wordIntent: false,
  });

  return {
    mode: 'qa',
    reply: composed.text,
    actions: [buildEntryPrimaryAction(bestEntry)],
    sources: qaSourceToLink(bestEntry),
    suggestions: composed.suggestions ?? scopedSuggestions,
    meta: {
      source: 'qa-ai-like',
      confidence,
      intent: parsed.intent,
      answerType: composed.answerType,
    },
  };
};
