import {
  PRONUNCIATION_ROADMAP_ITEMS,
  PRONUNCIATION_ROADMAP_TOTAL_DAYS,
} from '../../dashboard/components/TutorialContent/roadmap-data/pronunciation-roadmap';
import {
  SPEAKING_ROADMAP_ITEMS,
  SPEAKING_ROADMAP_TOTAL_DAYS,
  SPEAKING_ROADMAP_TOTAL_GOALS,
} from '../../dashboard/components/TutorialContent/roadmap-data/speaking-roadmap';
import {
  VOCABULARY_ROADMAP_ITEMS,
  VOCABULARY_ROADMAP_TOTAL_DAYS,
  VOCABULARY_ROADMAP_TOTAL_WORDS,
} from '../../dashboard/components/TutorialContent/roadmap-data/vocabulary-roadmap';
import type { GuideAction, GuideModeResult } from '../types';

type LearningPathRoadmapType = 'overview' | 'pronunciation' | 'speaking' | 'vocabulary';

const LEARNING_PATH_SUGGESTIONS = [
  'pronunciation roadmap',
  'speaking roadmap',
  'vocabulary roadmap',
];

const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9/\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const buildOverviewActions = (): GuideAction[] => [
  { kind: 'route', label: 'Buka Pronunciation', path: '/skill/pronunciation' },
  { kind: 'route', label: 'Buka Speaking', path: '/skill/speaking' },
  { kind: 'route', label: 'Buka Vocabulary', path: '/skill/vocabulary' },
];

const resolveRoadmapType = (query: string): LearningPathRoadmapType => {
  if (!query) return 'overview';

  if (query.includes('pronunciation') || query.includes('pelafalan')) {
    return 'pronunciation';
  }

  if (query.includes('speaking')) {
    return 'speaking';
  }

  if (query.includes('vocabulary') || query.includes('vocab') || query.includes('kosakata')) {
    return 'vocabulary';
  }

  if (query.includes('learning path') || query.includes('roadmap') || query.includes('tutorial')) {
    return 'overview';
  }

  return 'overview';
};

const buildOverviewResult = (): GuideModeResult => {
  const totalDays =
    PRONUNCIATION_ROADMAP_TOTAL_DAYS + SPEAKING_ROADMAP_TOTAL_DAYS + VOCABULARY_ROADMAP_TOTAL_DAYS;
  const reply =
    'Learning Path aktif. Klik tombol roadmap di overlay untuk buka Pronunciation, Speaking, atau Vocabulary roadmap.';

  return {
    mode: 'learning-path',
    reply,
    actions: buildOverviewActions(),
    suggestions: LEARNING_PATH_SUGGESTIONS,
    meta: {
      source: 'learning-path',
      learningPath: {
        roadmapType: 'overview',
        itemCount: 3,
        totalDays,
        totalGoals: SPEAKING_ROADMAP_TOTAL_GOALS,
        totalWords: VOCABULARY_ROADMAP_TOTAL_WORDS,
      },
    },
  };
};

const buildPronunciationResult = (): GuideModeResult => {
  return {
    mode: 'learning-path',
    reply:
      'Pronunciation roadmap tersedia di overlay. Klik tombol Open Pronunciation Roadmap untuk lihat tabel detail.',
    actions: [{ kind: 'route', label: 'Buka Pronunciation', path: '/skill/pronunciation' }],
    suggestions: LEARNING_PATH_SUGGESTIONS,
    meta: {
      source: 'learning-path',
      learningPath: {
        roadmapType: 'pronunciation',
        itemCount: PRONUNCIATION_ROADMAP_ITEMS.length,
        totalDays: PRONUNCIATION_ROADMAP_TOTAL_DAYS,
      },
    },
  };
};

const buildSpeakingResult = (): GuideModeResult => {
  return {
    mode: 'learning-path',
    reply:
      'Speaking roadmap tersedia di overlay. Klik tombol Open Speaking Roadmap untuk lihat phase, fokus, dan estimasi.',
    actions: [{ kind: 'route', label: 'Buka Speaking', path: '/skill/speaking' }],
    suggestions: LEARNING_PATH_SUGGESTIONS,
    meta: {
      source: 'learning-path',
      learningPath: {
        roadmapType: 'speaking',
        itemCount: SPEAKING_ROADMAP_ITEMS.length,
        totalDays: SPEAKING_ROADMAP_TOTAL_DAYS,
        totalGoals: SPEAKING_ROADMAP_TOTAL_GOALS,
      },
    },
  };
};

const buildVocabularyResult = (): GuideModeResult => {
  return {
    mode: 'learning-path',
    reply:
      'Vocabulary roadmap tersedia di overlay. Klik tombol Open Vocabulary Roadmap untuk lihat topik, jumlah kata, dan estimasi.',
    actions: [{ kind: 'route', label: 'Buka Vocabulary', path: '/skill/vocabulary' }],
    suggestions: LEARNING_PATH_SUGGESTIONS,
    meta: {
      source: 'learning-path',
      learningPath: {
        roadmapType: 'vocabulary',
        itemCount: VOCABULARY_ROADMAP_ITEMS.length,
        totalDays: VOCABULARY_ROADMAP_TOTAL_DAYS,
        totalWords: VOCABULARY_ROADMAP_TOTAL_WORDS,
      },
    },
  };
};

export const resolveLearningPathMode = (query: string): GuideModeResult => {
  const normalizedQuery = normalizeText(query);
  const roadmapType = resolveRoadmapType(normalizedQuery);

  if (roadmapType === 'pronunciation') {
    return buildPronunciationResult();
  }

  if (roadmapType === 'speaking') {
    return buildSpeakingResult();
  }

  if (roadmapType === 'vocabulary') {
    return buildVocabularyResult();
  }

  return buildOverviewResult();
};
