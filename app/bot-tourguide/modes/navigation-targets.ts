import type { GuideDashboardViewId } from '../types';
import { SPEAKING_GOALS } from '../../skill/speaking/data/goals';
import type { CefrSpeakingPhaseId } from '../../skill/speaking/data/types';
import { VOCABULARY_TOPICS } from '../../skill/vocabulary/topic/data/topics';
import type { VocabularyTopicId } from '../../skill/vocabulary/topic/data/types';

export type NavigationDashboardTarget = {
  viewId: GuideDashboardViewId;
  label: string;
  triggers: string[];
};

export type NavigationHubTarget = {
  path: string;
  label: string;
  triggers: string[];
};

export type NavigationPronunciationTarget = {
  path: string;
  label: string;
  triggers: string[];
  isGenericTrigger?: boolean;
};

export type NavigationVocabularyTarget = {
  path: string;
  label: string;
  triggers: string[];
  genericTriggers?: string[];
};

export type NavigationGrammarTarget = {
  path: string;
  label: string;
  triggers: string[];
  genericTriggers?: string[];
};

export type NavigationSpeakingTargetType = 'hub' | 'phase' | 'goal';

export type NavigationSpeakingTarget = {
  path: string;
  label: string;
  triggers: string[];
  targetType: NavigationSpeakingTargetType;
  phaseId?: CefrSpeakingPhaseId;
  goalId?: string;
  shortCode?: string;
  isGenericTrigger?: boolean;
};

export type NavigationTypoRule = {
  pattern: RegExp;
  replacement: string;
};

export const DASHBOARD_VIEW_TARGETS: NavigationDashboardTarget[] = [
  {
    viewId: 'dashboard',
    label: 'Start Journey',
    triggers: ['dashboard', 'start journey', 'beranda', 'home', 'home private'],
  },
  {
    viewId: 'notifications',
    label: 'Notifications',
    triggers: ['notifications', 'notification', 'notifikasi', 'notif'],
  },
  {
    viewId: 'progress',
    label: 'Progress',
    triggers: ['progress', 'progres', 'kemajuan'],
  },
  {
    viewId: 'achievements',
    label: 'Achievements',
    triggers: ['achievements', 'achievement', 'pencapaian', 'prestasi'],
  },
  {
    viewId: 'tutorial',
    label: 'Tutorial',
    triggers: ['tutorial', 'panduan', 'guide'],
  },
  {
    viewId: 'settings',
    label: 'Settings',
    triggers: ['settings', 'setting', 'pengaturan'],
  },
  {
    viewId: 'device-approve',
    label: 'Approve Device',
    triggers: ['approve device', 'device approve', 'approval device', 'device'],
  },
  {
    viewId: 'help-support',
    label: 'Help & Support',
    triggers: ['help support', 'help', 'support', 'bantuan'],
  },
];

export const HUB_ROUTE_TARGETS: NavigationHubTarget[] = [
  {
    path: '/skill',
    label: 'Skill Hub',
    triggers: ['skill hub', 'menu skill', 'halaman skill', 'skill'],
  },
  {
    path: '/skill/pronunciation',
    label: 'Pronunciation Hub',
    triggers: ['pronunciation', 'menu pronunciation', 'pronunciation hub', 'materi pronunciation'],
  },
  {
    path: '/skill/game-links',
    label: 'Skill Games',
    triggers: ['game links', 'skill games', 'games', 'game'],
  },
];

const SPEAKING_GOAL_TOKEN_STOPWORDS = new Set([
  'dan',
  'yang',
  'untuk',
  'dengan',
  'pada',
  'di',
  'ke',
  'dari',
  'secara',
  'lalu',
  'agar',
  'saat',
  'dalam',
]);

const normalizeNavigationTrigger = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9/\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const buildSpeakingGoalCompactTrigger = (goalText: string): string => {
  const tokens = normalizeNavigationTrigger(goalText)
    .split(' ')
    .filter((token) => token.length > 2 && !SPEAKING_GOAL_TOKEN_STOPWORDS.has(token));

  return tokens.slice(0, 6).join(' ').trim();
};

const dedupeNonEmpty = (items: string[]): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const normalized = normalizeNavigationTrigger(item);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
};

const VOCABULARY_TOPIC_ALIASES: Record<VocabularyTopicId, string[]> = {
  color: ['color', 'warna'],
  size: ['size', 'ukuran'],
  'body-parts': ['body parts', 'body part', 'parts of body', 'parts of the body', 'bagian tubuh'],
  family: ['family', 'keluarga'],
  'daily-routines': ['daily routines', 'daily routine', 'routines', 'rutinitas', 'kegiatan harian'],
  home: ['home', 'rumah'],
  'time-date': ['time date', 'time and date', 'waktu tanggal', 'jam tanggal'],
  number: ['number', 'cardinal number', 'cardinal numbers', 'angka'],
  'ordinal-number': ['ordinal number', 'ordinal numbers', 'angka urutan'],
  feelings: ['feelings', 'perasaan'],
  transport: ['transport', 'transportation', 'kendaraan', 'transportasi'],
  places: ['places', 'tempat'],
  clothes: ['clothes', 'clothing', 'pakaian'],
  food: ['food', 'makanan'],
  drinks: ['drinks', 'drink', 'minuman'],
  weather: ['weather', 'cuaca'],
  taste: ['taste', 'rasa'],
  vegetables: ['vegetables', 'vegetable', 'sayur', 'sayuran'],
  fruit: ['fruit', 'buah'],
  school: ['school', 'sekolah'],
  'personal-information': ['personal information', 'personal info', 'informasi pribadi', 'data pribadi'],
  'physical-appearance': ['physical appearance', 'penampilan fisik'],
  'hobbies-interests': ['hobbies and interests', 'hobbies interests', 'hobby', 'interests', 'hobi minat'],
  sports: ['sports', 'sport', 'olahraga'],
  games: ['games', 'game', 'permainan'],
  'entertainment-media': ['entertainment media', 'media entertainment', 'hiburan media'],
  education: ['education', 'pendidikan'],
  shapes: ['shapes', 'shape', 'bentuk'],
  electronics: ['electronics', 'elektronik'],
  shopping: ['shopping', 'belanja'],
  bathroom: ['bathroom', 'kamar mandi'],
  kitchen: ['kitchen', 'dapur'],
  'social-media': ['social media', 'sosial media', 'media sosial'],
};

const buildVocabularyTopicAliases = (
  topicId: VocabularyTopicId,
  title: string,
): string[] =>
  dedupeNonEmpty([
    topicId,
    topicId.replace(/-/g, ' '),
    title,
    title.replace(/&/g, 'and'),
    title.replace(/&/g, ' '),
    ...(VOCABULARY_TOPIC_ALIASES[topicId] ?? []),
  ]);

const buildVocabularyExplicitTriggers = (aliases: string[]): string[] =>
  dedupeNonEmpty(
    aliases.flatMap((alias) => [
      `${alias} vocabulary`,
      `vocabulary ${alias}`,
      `kosakata ${alias}`,
      `topic ${alias}`,
      `topik ${alias}`,
    ]),
  );

const buildVocabularyGenericTriggers = (
  topicId: VocabularyTopicId,
  title: string,
  aliases: string[],
): string[] =>
  dedupeNonEmpty([topicId, topicId.replace(/-/g, ' '), title, ...aliases]);

export const VOCABULARY_HUB_TARGET: NavigationVocabularyTarget = {
  path: '/skill/vocabulary',
  label: 'Vocabulary Topics',
  triggers: [
    'vocabulary',
    'vocab',
    'kosakata',
    'topic vocabulary',
    'vocabulary topics',
    'vocabulary roadmap',
    'roadmap vocabulary',
  ],
};

export const VOCABULARY_TOPIC_TARGETS: NavigationVocabularyTarget[] = VOCABULARY_TOPICS.map(
  (topic) => {
    const aliases = buildVocabularyTopicAliases(topic.topicId, topic.title);
    return {
      path: `/skill/vocabulary/topic/pages/${topic.topicId}`,
      label: `Vocabulary: ${topic.title}`,
      triggers: buildVocabularyExplicitTriggers(aliases),
      genericTriggers: buildVocabularyGenericTriggers(topic.topicId, topic.title, aliases),
    };
  },
);

export const VOCABULARY_ROUTE_TARGETS: NavigationVocabularyTarget[] = [
  VOCABULARY_HUB_TARGET,
  ...VOCABULARY_TOPIC_TARGETS,
];

export const GRAMMAR_ROUTE_TARGETS: NavigationGrammarTarget[] = [
  {
    path: '/skill/grammar',
    label: 'Grammar Hub',
    triggers: [
      'grammar',
      'menu grammar',
      'grammar hub',
      'halaman grammar',
      'materi grammar',
      'roadmap grammar',
    ],
  },
  {
    path: '/skill/grammar/grammar-resource',
    label: 'Grammar Resource',
    triggers: [
      'grammar resource',
      'resource grammar',
      'grammar references',
      'materi grammar resource',
      'topik grammar',
    ],
    genericTriggers: ['resource', 'references'],
  },
  {
    path: '/skill/grammar/grammar-for-speaking',
    label: 'Grammar for Speaking',
    triggers: [
      'grammar for speaking',
      'speaking grammar',
      'grammar speaking',
      'latihan grammar speaking',
      'roadmap grammar speaking',
      'speaking goals grammar',
    ],
    genericTriggers: ['speaking grammar'],
  },
  {
    path: '/skill/grammar/grammar-for-writing',
    label: 'Grammar for Writing',
    triggers: [
      'grammar for writing',
      'writing grammar',
      'grammar writing',
      'materi grammar writing',
      'latihan grammar writing',
    ],
    genericTriggers: ['writing grammar'],
  },
  {
    path: '/skill/grammar/analisis-grammar-for-speaking',
    label: 'Analisis Grammar for Speaking',
    triggers: [
      'analisis grammar for speaking',
      'analysis grammar for speaking',
      'audit gap grammar',
      'workflow grammar speaking',
      'grammar speaking analysis',
    ],
  },
  {
    path: '/skill/grammar/grammar-resource/resource/foundation-grammar/parts-of-speech',
    label: 'Parts of Speech',
    triggers: ['parts of speech', 'kelas kata', 'part of speech'],
  },
  {
    path: '/skill/grammar/grammar-resource/resource/foundation-grammar/pronouns-subject-object-possessive-reflexive',
    label: 'Pronouns',
    triggers: ['pronouns', 'kata ganti', 'pronoun subject object'],
  },
  {
    path: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-simple-habits-and-facts',
    label: 'Present Simple',
    triggers: ['present simple', 'simple present', 'present tense simple'],
    genericTriggers: ['present simple'],
  },
  {
    path: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-perfect-vs-past-simple',
    label: 'Present Perfect vs Past Simple',
    triggers: ['present perfect vs past simple', 'present perfect', 'past simple vs present perfect'],
    genericTriggers: ['present perfect'],
  },
  {
    path: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/conditionals-type-0-1-2-3',
    label: 'Conditionals Type 0/1/2/3',
    triggers: ['conditionals', 'conditional type', 'if clause conditionals'],
  },
  {
    path: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/passive-voice-form-and-use-across-tenses',
    label: 'Passive Voice',
    triggers: ['passive voice', 'kalimat pasif', 'passive tenses'],
  },
];

export const SPEAKING_HUB_TARGET: NavigationSpeakingTarget = {
  path: '/skill/speaking',
  label: 'Speaking Roadmap',
  targetType: 'hub',
  isGenericTrigger: true,
  triggers: [
    'speaking',
    'roadmap speaking',
    'speaking roadmap',
    'latihan speaking',
    'cefr speaking',
    'speaking a1',
  ],
};

export const SPEAKING_PHASE_TARGETS: NavigationSpeakingTarget[] = [
  {
    path: '/skill/speaking?phase=cefr-a1-1',
    label: 'Survival Response',
    targetType: 'phase',
    phaseId: 'cefr-a1-1',
    triggers: [
      'phase a1.1',
      'phase a1 1',
      'cefr a1 1',
      'cefr-a1-1',
      'survival response',
      'respons survival',
    ],
  },
  {
    path: '/skill/speaking?phase=cefr-a1-2',
    label: 'Identity and Daily Needs',
    targetType: 'phase',
    phaseId: 'cefr-a1-2',
    triggers: [
      'phase a1.2',
      'phase a1 2',
      'cefr a1 2',
      'cefr-a1-2',
      'identity and daily needs',
      'identitas kebutuhan harian',
    ],
  },
  {
    path: '/skill/speaking?phase=cefr-a1-3',
    label: 'Simple Transaction and Direction',
    targetType: 'phase',
    phaseId: 'cefr-a1-3',
    triggers: [
      'phase a1.3',
      'phase a1 3',
      'cefr a1 3',
      'cefr-a1-3',
      'simple transaction and direction',
      'transaksi sederhana arah',
    ],
  },
];

export const SPEAKING_GOAL_TARGETS: NavigationSpeakingTarget[] = SPEAKING_GOALS.map((goal) => {
  const shortCode = (goal.id.match(/g\d{2}$/i)?.[0] ?? '').toLowerCase();
  const fullGoalId = goal.id.toLowerCase();
  const compact = buildSpeakingGoalCompactTrigger(goal.goal);

  return {
    path: `/skill/speaking/cefr-a1/${goal.id}`,
    label: goal.goal,
    targetType: 'goal',
    phaseId: goal.phaseId,
    goalId: goal.id,
    shortCode: shortCode || undefined,
    triggers: dedupeNonEmpty([
      fullGoalId,
      shortCode,
      goal.goal,
      compact,
      `${goal.phaseId} ${shortCode}`,
      `${goal.phaseId} ${goal.goal}`,
    ]),
  };
});

export const SPEAKING_ROUTE_TARGETS: NavigationSpeakingTarget[] = [
  SPEAKING_HUB_TARGET,
  ...SPEAKING_PHASE_TARGETS,
  ...SPEAKING_GOAL_TARGETS,
];

export const PRONUNCIATION_ROUTE_TARGETS: NavigationPronunciationTarget[] = [
  {
    path: '/skill/pronunciation',
    label: 'Pronunciation Hub',
    triggers: [
      'pronunciation',
      'pelafalan',
      'menu pronunciation',
      'pronunciation hub',
      'materi pronunciation',
      'halaman pronunciation',
    ],
  },
  {
    path: '/skill/pronunciation/alphabet',
    label: 'Pronunciation Alphabet',
    triggers: ['alphabet', 'alphabet pronunciation', 'abjad', 'huruf english', 'huruf pronunciation'],
  },
  {
    path: '/skill/pronunciation/phoneticSymbols',
    label: 'Phonetic Symbols',
    triggers: [
      'phonetic symbols',
      'phonetic',
      'simbol fonetik',
      'ipa',
      'phonetic chart',
      'phonetic symbol',
      'phoneticsymbols',
    ],
  },
  {
    path: '/skill/pronunciation/phoneticSymbols/MinimalPairs',
    label: 'Minimal Pairs',
    triggers: ['minimal pairs', 'pair minimal', 'pasangan minimal', 'latihan minimal pairs'],
  },
  {
    path: '/skill/pronunciation/phoneticSymbols/summary-of-phonetic-symbols',
    label: 'Summary of Phonetic Symbols',
    triggers: [
      'summary of phonetic symbols',
      'phonetic summary',
      'ringkasan simbol fonetik',
      'rekap simbol fonetik',
    ],
  },
  {
    path: '/skill/pronunciation/phoneticSymbols/tongue-twister',
    label: 'Tongue Twister',
    triggers: ['tongue twister', 'twister', 'latihan lidah', 'tongue'],
  },
  {
    path: '/skill/pronunciation/stressing',
    label: 'Word Stressing',
    triggers: ['stressing', 'stress', 'word stress', 'penekanan kata', 'tekanan kata'],
  },
  {
    path: '/skill/pronunciation/intonation',
    label: 'Intonation',
    triggers: ['intonation', 'intonasi', 'rising falling', 'melodi kalimat'],
  },
  {
    path: '/skill/pronunciation/final-sound-new',
    label: 'Final Sound Hub',
    triggers: ['final sound', 'final sound hub', 'akhir bunyi', 'bunyi akhir'],
  },
  {
    path: '/skill/pronunciation/final-sound-new/s/es',
    label: 'Final Sound S/ES',
    triggers: ['final sound s/es', 'final sound s es', 's/es', 's es', 'ending s es'],
  },
  {
    path: '/skill/pronunciation/final-sound-new/d/ed',
    label: 'Final Sound D/ED',
    triggers: ['final sound d/ed', 'final sound d ed', 'd/ed', 'd ed', 'ending d ed'],
  },
  {
    path: '/skill/pronunciation/american-t',
    label: 'American T',
    triggers: ['american t', 'american /t/', 't american', 'aksen american t'],
  },
  {
    path: '/skill/pronunciation/american-t/beginning/clear-t',
    label: 'Released T',
    triggers: [
      'released t',
      'released t beginning',
      'clear t beginning',
      't beginning',
      'awal t',
    ],
  },
  {
    path: '/skill/pronunciation/american-t/middle/flap',
    label: 'Flap T',
    triggers: ['flap t', 'flap', 't flap', 'middle flap'],
  },
  {
    path: '/skill/pronunciation/american-t/middle/silent-t',
    label: 'Silent T',
    triggers: ['silent t', 'middle silent t', 't silent', 'casual silent t'],
  },
  {
    path: '/skill/pronunciation/american-t/middle/glottal',
    label: 'Glottal Stop',
    triggers: ['glottal', 'glottal stop', 'middle glottal', 'glotal'],
  },
  {
    path: '/skill/pronunciation/american-t/ending/clear-t-ending',
    label: 'Released T Ending',
    triggers: ['released t ending', 'clear t ending', 'ending released t', 't ending released'],
  },
  {
    path: '/skill/pronunciation/american-t/ending/final-t',
    label: 'Final T Before Consonant',
    triggers: ['final t before consonant', 'final t', 'ending final t', 't before consonant'],
  },
  {
    path: '/skill/pronunciation/text',
    label: 'Pronunciation Text Practice',
    triggers: ['pronunciation text', 'text pronunciation', 'applied pronunciation text', 'teks pronunciation'],
  },
  {
    path: '/skill/pronunciation/text',
    label: 'Pronunciation Text Practice',
    triggers: ['text'],
    isGenericTrigger: true,
  },
  {
    path: '/skill/pronunciation/phoneticSymbols/summary-of-phonetic-symbols',
    label: 'Summary of Phonetic Symbols',
    triggers: ['summary'],
    isGenericTrigger: true,
  },
  {
    path: '/skill/pronunciation/phoneticSymbols/MinimalPairs',
    label: 'Minimal Pairs',
    triggers: ['minimal'],
    isGenericTrigger: true,
  },
];

export const LOGOUT_TRIGGERS = ['logout', 'log out', 'sign out', 'keluar akun'];

export const NAVIGATION_TYPO_RULES: NavigationTypoRule[] = [
  { pattern: /\bnotifkasi\b/g, replacement: 'notifikasi' },
  { pattern: /\bnotifiksi\b/g, replacement: 'notifikasi' },
  { pattern: /\bachievment\b/g, replacement: 'achievement' },
  { pattern: /\bseting\b/g, replacement: 'setting' },
  { pattern: /\bspeking\b/g, replacement: 'speaking' },
  { pattern: /\bphoneticsymbol\b/g, replacement: 'phonetic symbols' },
  { pattern: /\bphoneticsymbols\b/g, replacement: 'phonetic symbols' },
  { pattern: /\bphonetik\b/g, replacement: 'phonetic' },
  { pattern: /\bglotal\b/g, replacement: 'glottal' },
  { pattern: /\bminmal\b/g, replacement: 'minimal' },
  { pattern: /\bstresing\b/g, replacement: 'stressing' },
  { pattern: /\bintonasion\b/g, replacement: 'intonation' },
  { pattern: /\bamerikan t\b/g, replacement: 'american t' },
  { pattern: /\bamercan t\b/g, replacement: 'american t' },
  { pattern: /\bfinalsound\b/g, replacement: 'final sound' },
  { pattern: /\bsurvival respon\b/g, replacement: 'survival response' },
  { pattern: /\bidentitiy\b/g, replacement: 'identity' },
  { pattern: /\btransction\b/g, replacement: 'transaction' },
  { pattern: /\bdirrection\b/g, replacement: 'direction' },
  { pattern: /\bvocabolary\b/g, replacement: 'vocabulary' },
  { pattern: /\bvocubulary\b/g, replacement: 'vocabulary' },
  { pattern: /\bkosakatta\b/g, replacement: 'kosakata' },
  { pattern: /\bbodypart\b/g, replacement: 'body parts' },
  { pattern: /\bpersonel information\b/g, replacement: 'personal information' },
  { pattern: /\bgramar\b/g, replacement: 'grammar' },
  { pattern: /\bgrammer\b/g, replacement: 'grammar' },
  { pattern: /\bgramma\b/g, replacement: 'grammar' },
  { pattern: /\btence\b/g, replacement: 'tense' },
  { pattern: /\barticel\b/g, replacement: 'article' },
  { pattern: /\bcondtional\b/g, replacement: 'conditional' },
  { pattern: /\bpasive\b/g, replacement: 'passive' },
];

export const applyNavigationTypoRules = (query: string): string =>
  NAVIGATION_TYPO_RULES.reduce((acc, rule) => acc.replace(rule.pattern, rule.replacement), query);
