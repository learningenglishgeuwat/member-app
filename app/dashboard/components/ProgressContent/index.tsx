'use client'

import React, { useEffect, useState } from 'react';
import { BookOpen, Mic, Volume2, MessageCircle, BarChart3, Lock } from 'lucide-react';
import Link from 'next/link';
import { VOCABULARY_TOPICS } from '../../../skill/vocabulary/topic/data/topics';
import { SPEAKING_GOALS } from '../../../skill/speaking/data/goals';
import { SPEAKING_PHASES } from '../../../skill/speaking/data/phases';
import { AUTHORED_SPEAKING_GOAL_IDS } from '../../../skill/speaking/data/details/authored-goals';
import { SPEAKING_GOALS as GRAMMAR_FOR_SPEAKING_GOALS } from '../../../skill/grammar/analisis-grammar-for-speaking/data/speakingGoals';
import {
  SPEAKING_GOAL_COMPLETION_KEY,
  SPEAKING_PRACTICE_WITH_GEUWAT_PREFIX,
} from '../../../skill/speaking/data/progress';

interface SkillData {
  id: string;
  name: string;
  progress: number;
  icon: React.ElementType;
  description: string;
}

type PracticePopupItem = {
  id: string;
  label: string;
  percentage: number;
  href?: string;
};

type PracticePopupGroup = {
  id: string;
  title: string;
  labelVariant?: 'default' | 'symbol';
  items: PracticePopupItem[];
};

type PracticePopupData = {
  title: string;
  average: number;
  groups: PracticePopupGroup[];
};

type DashboardTopicProgress = {
  id?: string;
  name: string;
  percentage: number;
  practicePercentage?: number;
  lessonPercentage?: number;
  practicePopup?: PracticePopupData;
  lessonPopup?: PracticePopupData;
  practiceHref?: string;
  locked?: boolean;
};

const PRONUNCIATION_ROADMAP_CHECKLIST_KEY = 'dashboard-pronunciation-roadmap-checklist-v1';
const VOCABULARY_PROGRESS_KEY = 'vocabularyProgress';
const VOCABULARY_ROADMAP_CHECKLIST_KEY = 'dashboard-vocabulary-roadmap-checklist-v1';
const SAVED_ASSESSMENTS_KEY = 'savedAssessments';
const GRAMMAR_FOR_SPEAKING_PROGRESS_KEY = 'gfs_goal_progress_v1';
const GRAMMAR_FOR_SPEAKING_GOAL_IDS = new Set(GRAMMAR_FOR_SPEAKING_GOALS.map((goal) => goal.goalId));
const ROADMAP_LESSON_DETAIL_PREFIX = 'lesson:';

const PHONETIC_SYMBOL_GROUPS: Array<{ id: string; title: string; symbols: string[] }> = [
  {
    id: 'vowel-lax',
    title: 'Vowel (Lax)',
    symbols: ['\u028c', '\u026a', '\u028a', '\u025b', '\u0259', '\u025a'],
  },
  {
    id: 'vowel-tense',
    title: 'Vowel (Tense)',
    symbols: ['\u0251', 'i', 'u', '\u00e6', '\u0254'],
  },
  {
    id: 'diphthong',
    title: 'Diphthong',
    symbols: ['a\u026a', 'e\u026a', '\u0254\u026a', '\u026a\u0259', 'e\u0259', '\u028a\u0259', 'o\u028a', 'a\u028a'],
  },
  {
    id: 'consonant-voiceless',
    title: 'Consonant (Voiceless)',
    symbols: ['p', 't', 'k', 'f', '\u03b8', 's', '\u0283', '\u02a7', 'h'],
  },
  {
    id: 'consonant-voiced',
    title: 'Consonant (Voiced)',
    symbols: ['b', 'd', 'g', 'v', '\u00f0', 'z', '\u0292', '\u02a4', 'l', 'm', 'n', '\u014b', 'r', 'w', 'y'],
  },
];

const AMERICAN_T_PRACTICE_GROUPS: Array<{
  id: string;
  title: string;
  items: Array<{
    id: string;
    label: string;
    progressKey: string;
    assessmentTopicName: string;
    href: string;
  }>;
}> = [
  {
    id: 'american-t-beginning',
    title: 'Beginning',
    items: [
      {
        id: 'american-t-released-beginning',
        label: 'Released /t/',
        progressKey: 'americanTReleasedBeginning',
        assessmentTopicName: 'Released /t/',
        href: '/skill/pronunciation/american-t/beginning/clear-t',
      },
    ],
  },
  {
    id: 'american-t-middle',
    title: 'Middle',
    items: [
      {
        id: 'american-t-flap',
        label: 'Flap T /\u027e/',
        progressKey: 'americanTFlap',
        assessmentTopicName: 'Flap T /\u027e/',
        href: '/skill/pronunciation/american-t/middle/flap',
      },
      {
        id: 'american-t-glottal',
        label: 'Glottal Stop /\u0294/',
        progressKey: 'americanTGlottalStop',
        assessmentTopicName: 'Glottal Stop /\u0294/',
        href: '/skill/pronunciation/american-t/middle/glottal',
      },
      {
        id: 'american-t-silent',
        label: 'Silent /t/',
        progressKey: 'americanTSilent',
        assessmentTopicName: 'Silent /t/',
        href: '/skill/pronunciation/american-t/middle/silent-t',
      },
    ],
  },
  {
    id: 'american-t-ending',
    title: 'Ending',
    items: [
      {
        id: 'american-t-released-ending',
        label: 'Released /t/ Ending',
        progressKey: 'americanTReleasedEnding',
        assessmentTopicName: 'Released /t/ Ending',
        href: '/skill/pronunciation/american-t/ending/clear-t-ending',
      },
      {
        id: 'american-t-final-before-consonant',
        label: 'Final T Before Consonant',
        progressKey: 'americanTFinalTBeforeConsonant',
        assessmentTopicName: 'Final T Before Consonant',
        href: '/skill/pronunciation/american-t/ending/final-t',
      },
    ],
  },
];

const initialSkills: SkillData[] = [
  { id: 'pronunciation', name: 'Pronunciation', progress: 75, icon: Volume2, description: 'Speaking clarity and accent' },
  { id: 'vocabulary', name: 'Vocabulary', progress: 60, icon: BookOpen, description: 'Word knowledge and usage' },
  { id: 'grammar', name: 'Grammar', progress: 85, icon: MessageCircle, description: 'Sentence structure and rules' },
  { id: 'speaking', name: 'Speaking', progress: 45, icon: Mic, description: 'Conversation skills' },
];

const ProgressContent: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<{[key: string]: string[]}>({});
  const [expandedTopics, setExpandedTopics] = useState<{[key: string]: string[]}>({});
  const [practicePopup, setPracticePopup] = useState<
    | null
    | {
        data: PracticePopupData;
        activeGroupIndex: number;
      }
  >(null);

  const readLocalStorageObject = <T,>(key: string, fallback: T): T => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  };

  const toPercent = (value: unknown): number => {
    if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
    return Math.min(100, Math.max(0, Math.round(value)));
  };

  const toAssessmentKey = (topicName: string) => topicName.toLowerCase().replace(/\s+/g, '_');
  const readSavedAssessmentPercent = (
    savedAssessments: Record<string, { percentage?: unknown }>,
    topicName: string,
  ): number => toPercent(savedAssessments[toAssessmentKey(topicName)]?.percentage);

  useEffect(() => {
    if (!practicePopup) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPracticePopup(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [practicePopup]);

  const getPracticePopupItemCount = (data: PracticePopupData) =>
    data.groups.reduce((total, group) => total + group.items.length, 0);

  const openPopup = (data?: PracticePopupData) => {
    if (!data) return;
    if (getPracticePopupItemCount(data) <= 1) return;
    setPracticePopup({ data, activeGroupIndex: 0 });
  };

  const closePracticePopup = () => setPracticePopup(null);

  const navigatePracticePopup = (direction: -1 | 1) => {
    setPracticePopup((prev) => {
      if (!prev) return prev;
      const totalGroups = prev.data.groups.length;
      if (totalGroups <= 1) return prev;

      const nextIndex = (prev.activeGroupIndex + direction + totalGroups) % totalGroups;
      return { ...prev, activeGroupIndex: nextIndex };
    });
  };
  
  // Helper function to calculate phonetic symbols average
  const calculatePhoneticAverage = (topicProgress: Record<string, number>) => {
    const allSymbols = PHONETIC_SYMBOL_GROUPS.flatMap((group) => group.symbols);
    const phoneticSymbolProgress = allSymbols.map((symbol) => toPercent(topicProgress[`phoneticSymbols_${symbol}`]));
    return phoneticSymbolProgress.length > 0
      ? Math.round(phoneticSymbolProgress.reduce((acc, curr) => acc + curr, 0) / phoneticSymbolProgress.length)
      : 0;
  };
  
  // Load pronunciation topic progress from localStorage
  const getPronunciationTopicProgress = (): DashboardTopicProgress[] => {
    const topicProgress = readLocalStorageObject<Record<string, number>>('pronunciationProgress', {});
    const savedAssessments = readLocalStorageObject<Record<string, { percentage?: unknown }>>(
      SAVED_ASSESSMENTS_KEY,
      {},
    );
    const lessonChecklist = readLocalStorageObject<Record<string, boolean>>(
      PRONUNCIATION_ROADMAP_CHECKLIST_KEY,
      {}
    );
    const averagePhoneticProgress = calculatePhoneticAverage(topicProgress);

    const finalSoundSEsProgress =
      toPercent(topicProgress['finalSoundSEs']) ||
      readSavedAssessmentPercent(savedAssessments, 'Final Sound S/ES');
    const finalSoundDEdProgress =
      toPercent(topicProgress['finalSoundDEd']) ||
      readSavedAssessmentPercent(savedAssessments, 'Final Sound D/ED');
    const finalSoundPracticeAverage = Math.round((finalSoundSEsProgress + finalSoundDEdProgress) / 2);

    const phoneticSymbolsPracticePopup: PracticePopupData = {
      title: 'Phonetic Symbols',
      average: averagePhoneticProgress,
      groups: PHONETIC_SYMBOL_GROUPS.map((group) => ({
        id: group.id,
        title: group.title,
        labelVariant: 'symbol',
        items: group.symbols.map((symbol) => ({
          id: `phoneticSymbols_${symbol}`,
          label: symbol,
          percentage: toPercent(topicProgress[`phoneticSymbols_${symbol}`]),
          href: `/skill/pronunciation/phoneticSymbols/${encodeURIComponent(symbol)}`,
        })),
      })),
    };

    const americanTItemsFlat = AMERICAN_T_PRACTICE_GROUPS.flatMap((group) => group.items);
    const americanTItemProgress = americanTItemsFlat.map((item) => ({
      id: item.id,
      label: item.label,
      percentage:
        toPercent(topicProgress[item.progressKey]) ||
        readSavedAssessmentPercent(savedAssessments, item.assessmentTopicName),
    }));
    const americanTPracticeAverage =
      americanTItemProgress.length > 0
        ? Math.round(
            americanTItemProgress.reduce((sum, entry) => sum + entry.percentage, 0) / americanTItemProgress.length,
          )
        : 0;
    const americanTPracticePopup: PracticePopupData = {
      title: 'American /t/',
      average: americanTPracticeAverage,
      groups: AMERICAN_T_PRACTICE_GROUPS.map((group) => ({
        id: group.id,
        title: group.title,
        items: group.items.map((item) => ({
          id: item.id,
          label: item.label,
          percentage:
            toPercent(topicProgress[item.progressKey]) ||
            readSavedAssessmentPercent(savedAssessments, item.assessmentTopicName),
          href: item.href,
        })),
      })),
    };

    const finalSoundPracticePopup: PracticePopupData = {
      title: 'Final Sound',
      average: finalSoundPracticeAverage,
      groups: [
        {
          id: 'final-sound',
          title: 'Final Sound',
          items: [
            {
              id: 'final-sound-s-es',
              label: 'S/ES',
              percentage: finalSoundSEsProgress,
              href: '/skill/pronunciation/final-sound-new/s/es',
            },
            {
              id: 'final-sound-d-ed',
              label: 'D/ED',
              percentage: finalSoundDEdProgress,
              href: '/skill/pronunciation/final-sound-new/d/ed',
            },
          ],
        },
      ],
    };

    const toLessonDetailKey = (itemId: string) => `${ROADMAP_LESSON_DETAIL_PREFIX}${itemId}`;
    const isTopicLessonDone = (topicId: string) => lessonChecklist[topicId] === true;
    const isLessonDetailDone = (topicId: string, itemId: string) =>
      isTopicLessonDone(topicId) || lessonChecklist[toLessonDetailKey(itemId)] === true;

    const phoneticSymbolsLessonTopicDone = isTopicLessonDone('phonetic-symbols');
    const phoneticSymbolsLessonItems = PHONETIC_SYMBOL_GROUPS.flatMap((group) =>
      group.symbols.map((symbol) => `phoneticSymbols_${symbol}`),
    );
    const phoneticSymbolsLessonDoneCount = phoneticSymbolsLessonTopicDone
      ? phoneticSymbolsLessonItems.length
      : phoneticSymbolsLessonItems.filter((itemId) => isLessonDetailDone('phonetic-symbols', itemId)).length;
    const phoneticSymbolsLessonPercentage =
      phoneticSymbolsLessonItems.length > 0
        ? Math.round((phoneticSymbolsLessonDoneCount / phoneticSymbolsLessonItems.length) * 100)
        : 0;
    const phoneticSymbolsLessonPopup: PracticePopupData = {
      title: 'Phonetic Symbols - Lesson',
      average: phoneticSymbolsLessonPercentage,
      groups: PHONETIC_SYMBOL_GROUPS.map((group) => ({
        id: group.id,
        title: group.title,
        labelVariant: 'symbol',
        items: group.symbols.map((symbol) => {
          const itemId = `phoneticSymbols_${symbol}`;
          const done = isLessonDetailDone('phonetic-symbols', itemId);
          return {
            id: itemId,
            label: symbol,
            percentage: done ? 100 : 0,
            href: `/skill/pronunciation/phoneticSymbols/${encodeURIComponent(symbol)}`,
          };
        }),
      })),
    };

    const finalSoundLessonSEsDone = isLessonDetailDone('final-sound', 'final-sound-s-es');
    const finalSoundLessonDEdDone = isLessonDetailDone('final-sound', 'final-sound-d-ed');
    const finalSoundLessonDoneCount =
      Number(finalSoundLessonSEsDone) + Number(finalSoundLessonDEdDone);
    const finalSoundLessonPercentage = Math.round((finalSoundLessonDoneCount / 2) * 100);
    const finalSoundLessonPopup: PracticePopupData = {
      title: 'Final Sound - Lesson',
      average: finalSoundLessonPercentage,
      groups: [
        {
          id: 'final-sound-lesson',
          title: 'Final Sound',
          items: [
            {
              id: 'final-sound-s-es',
              label: 'S/ES',
              percentage: finalSoundLessonSEsDone ? 100 : 0,
              href: '/skill/pronunciation/final-sound-new/s/es',
            },
            {
              id: 'final-sound-d-ed',
              label: 'D/ED',
              percentage: finalSoundLessonDEdDone ? 100 : 0,
              href: '/skill/pronunciation/final-sound-new/d/ed',
            },
          ],
        },
      ],
    };

    const americanTLessonTopicDone = isTopicLessonDone('american-t');
    const americanTLessonItemIds = americanTItemsFlat.map((item) => item.id);
    const americanTLessonDoneCount = americanTLessonTopicDone
      ? americanTLessonItemIds.length
      : americanTLessonItemIds.filter((itemId) => isLessonDetailDone('american-t', itemId)).length;
    const americanTLessonPercentage =
      americanTLessonItemIds.length > 0 ? Math.round((americanTLessonDoneCount / americanTLessonItemIds.length) * 100) : 0;
    const americanTLessonPopup: PracticePopupData = {
      title: 'American /t/ - Lesson',
      average: americanTLessonPercentage,
      groups: AMERICAN_T_PRACTICE_GROUPS.map((group) => ({
        id: `${group.id}-lesson`,
        title: group.title,
        items: group.items.map((item) => ({
          id: item.id,
          label: item.label,
          percentage: isLessonDetailDone('american-t', item.id) ? 100 : 0,
          href: item.href,
        })),
      })),
    };

    const practiceByRoadmapId: Record<string, number> = {
      alphabet: topicProgress['alphabet'] || 0,
      'phonetic-symbols': averagePhoneticProgress,
      stressing: stressingPracticeAverage,
      intonation: topicProgress['intonation'] || 0,
      'final-sound': finalSoundPracticeAverage,
      'american-t': americanTPracticeAverage,
      'text-practice': topicProgress['textPractice'] || 0,
    };

    const lessonByRoadmapId: Record<string, { percentage: number; popup?: PracticePopupData }> = {
      alphabet: { percentage: isTopicLessonDone('alphabet') ? 100 : 0 },
      'phonetic-symbols': { percentage: phoneticSymbolsLessonPercentage, popup: phoneticSymbolsLessonPopup },
      stressing: { percentage: isTopicLessonDone('stressing') ? 100 : 0 },
      intonation: { percentage: isTopicLessonDone('intonation') ? 100 : 0 },
      'final-sound': { percentage: finalSoundLessonPercentage, popup: finalSoundLessonPopup },
      'american-t': { percentage: americanTLessonPercentage, popup: americanTLessonPopup },
      'text-practice': { percentage: 0 },
    };

    const roadmapTopics: Array<{ id: string; name: string }> = [
      { id: 'alphabet', name: 'Alphabet' },
      { id: 'phonetic-symbols', name: 'Phonetic Symbols' },
      { id: 'stressing', name: 'Stressing' },
      { id: 'intonation', name: 'Intonation' },
      { id: 'final-sound', name: 'Final Sound' },
      { id: 'american-t', name: 'American /t/' },
      { id: 'text-practice', name: 'Text Practice' },
      { id: 'reading-text', name: 'Reading Text' },
    ];

    const practiceHrefByRoadmapId: Record<string, string> = {
      alphabet: '/skill/pronunciation/alphabet',
      'phonetic-symbols': '/skill/pronunciation/phoneticSymbols',
      stressing: '/skill/pronunciation/stressing',
      intonation: '/skill/pronunciation/intonation',
      'final-sound': '/skill/pronunciation/final-sound-new',
      'american-t': '/skill/pronunciation/american-t',
      'text-practice': '/skill/pronunciation/text',
    };

    return roadmapTopics.map((topic) => {
      const practicePercentage = practiceByRoadmapId[topic.id] ?? 0;
      const lessonPercentage = lessonByRoadmapId[topic.id]?.percentage ?? 0;
      const combinedPercentage =
        topic.id === 'text-practice'
          ? practicePercentage
          : Math.round((practicePercentage + lessonPercentage) / 2);
      return {
        id: topic.id,
        name: topic.name,
        percentage: combinedPercentage,
        practicePercentage,
        lessonPercentage,
        practiceHref: practiceHrefByRoadmapId[topic.id],
        lessonPopup: lessonByRoadmapId[topic.id]?.popup,
        practicePopup:
          topic.id === 'final-sound'
            ? finalSoundPracticePopup
            : topic.id === 'phonetic-symbols'
              ? phoneticSymbolsPracticePopup
              : topic.id === 'american-t'
                ? americanTPracticePopup
                : undefined,
      };
    });
  };

  const getVocabularyTopicProgress = (): DashboardTopicProgress[] => {
    const vocabularyProgress = readLocalStorageObject<Record<string, number>>(VOCABULARY_PROGRESS_KEY, {});
    const vocabularyRoadmapChecklist = readLocalStorageObject<Record<string, boolean>>(
      VOCABULARY_ROADMAP_CHECKLIST_KEY,
      {}
    );

    return VOCABULARY_TOPICS.map((topic) => {
      const practicePercentage = vocabularyProgress[topic.topicId];
      const learningPercentage = vocabularyRoadmapChecklist[topic.topicId] ? 100 : 0;
      const safePracticePercentage =
        typeof practicePercentage === 'number' && Number.isFinite(practicePercentage)
          ? practicePercentage
          : 0;
      const combinedPercentage = Math.round((safePracticePercentage + learningPercentage) / 2);

      return {
        id: topic.topicId,
        name: topic.title,
        percentage: combinedPercentage,
        practicePercentage: safePracticePercentage,
        lessonPercentage: learningPercentage,
        practiceHref: `/skill/vocabulary/topic/pages/${topic.topicId}`,
      };
    });
  };

  const getSpeakingTopicProgress = (): DashboardTopicProgress[] => {
    const speakingCompletionMap = readLocalStorageObject<Record<string, boolean>>(
      SPEAKING_GOAL_COMPLETION_KEY,
      {},
    );
    const authoredSet = new Set<string>(AUTHORED_SPEAKING_GOAL_IDS);

    const chunkArray = <T,>(items: T[], size: number): T[][] => {
      if (size <= 0) return [items];
      const chunks: T[][] = [];
      for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
      }
      return chunks;
    };

    return SPEAKING_PHASES.map((phase) => {
      const phaseGoals = SPEAKING_GOALS.filter(
        (goal) => goal.phaseId === phase.id && authoredSet.has(goal.id),
      );
      const totalGoals = phaseGoals.length;

      const learningDone = phaseGoals.filter((goal) => speakingCompletionMap[goal.id] === true).length;
      const practiceDone = phaseGoals.filter(
        (goal) =>
          speakingCompletionMap[`${SPEAKING_PRACTICE_WITH_GEUWAT_PREFIX}${goal.id}`] === true,
      ).length;

      const lessonPercentage =
        totalGoals > 0 ? Math.round((learningDone / totalGoals) * 100) : 0;
      const practicePercentage =
        totalGoals > 0 ? Math.round((practiceDone / totalGoals) * 100) : 0;

      const goalGroups = chunkArray(phaseGoals, 6);
      const lessonPopup: PracticePopupData | undefined =
        totalGoals > 1
          ? {
              title: `${phase.title} - Lesson Progress`,
              average: lessonPercentage,
              groups: goalGroups.map((chunk, index) => {
                const start = index * 6 + 1;
                const end = start + chunk.length - 1;
                return {
                  id: `${phase.id}-lesson-${index + 1}`,
                  title: `Goals ${start}-${end}`,
                  items: chunk.map((goal) => ({
                    id: goal.id,
                    label: `${goal.goalOrder}. ${goal.goal}`,
                    percentage: speakingCompletionMap[goal.id] ? 100 : 0,
                    href: `/skill/speaking/cefr-a1/${goal.id}`,
                  })),
                };
              }),
            }
          : undefined;

      const practicePopup: PracticePopupData | undefined =
        totalGoals > 1
          ? {
              title: `${phase.title} - Practice Progress`,
              average: practicePercentage,
              groups: goalGroups.map((chunk, index) => {
                const start = index * 6 + 1;
                const end = start + chunk.length - 1;
                return {
                  id: `${phase.id}-practice-${index + 1}`,
                  title: `Goals ${start}-${end}`,
                  items: chunk.map((goal) => ({
                    id: `${SPEAKING_PRACTICE_WITH_GEUWAT_PREFIX}${goal.id}`,
                    label: `${goal.goalOrder}. ${goal.goal}`,
                    percentage:
                      speakingCompletionMap[`${SPEAKING_PRACTICE_WITH_GEUWAT_PREFIX}${goal.id}`] ? 100 : 0,
                    href: `/skill/speaking/cefr-a1/${goal.id}`,
                  })),
                };
              }),
            }
          : undefined;

      return {
        id: phase.id,
        name: phase.title,
        percentage: Math.round((lessonPercentage + practicePercentage) / 2),
        lessonPercentage,
        practicePercentage,
        practiceHref: `/skill/speaking?phase=${phase.id}`,
        lessonPopup,
        practicePopup,
      };
    });
  };

  // Update initial skills with loaded progress and recalculate averages
  const [skills] = useState(() => {
    const topicProgress = readLocalStorageObject<Record<string, number>>('pronunciationProgress', {});
    const savedAssessments = readLocalStorageObject<Record<string, { percentage?: unknown }>>(
      SAVED_ASSESSMENTS_KEY,
      {},
    );
    const grammarProgress = readLocalStorageObject<Record<string, number>>('grammarSpeakingProgress', {});
    const vocabularyProgress = readLocalStorageObject<Record<string, number>>(VOCABULARY_PROGRESS_KEY, {});
    const speakingCompletionMap = readLocalStorageObject<Record<string, boolean>>(
      SPEAKING_GOAL_COMPLETION_KEY,
      {},
    );
    
    // Get progress from each individual topic
    const alphabetProgress = topicProgress['alphabet'] || 0;
    const stressingWordProgress =
      toPercent(topicProgress['stressingWord']) || readSavedAssessmentPercent(savedAssessments, 'Word Stress');
    const stressingSentenceProgress =
      toPercent(topicProgress['stressingSentence']) ||
      readSavedAssessmentPercent(savedAssessments, 'Sentence Stress');
    const stressingProgress = Math.round((stressingWordProgress + stressingSentenceProgress) / 2);
    const intonationProgress = topicProgress['intonation'] || 0;
    const finalSoundSEsProgress =
      toPercent(topicProgress['finalSoundSEs']) ||
      readSavedAssessmentPercent(savedAssessments, 'Final Sound S/ES');
    const finalSoundDEdProgress =
      toPercent(topicProgress['finalSoundDEd']) ||
      readSavedAssessmentPercent(savedAssessments, 'Final Sound D/ED');
    const finalSoundProgress = Math.round((finalSoundSEsProgress + finalSoundDEdProgress) / 2);

    const americanTItemsFlat = AMERICAN_T_PRACTICE_GROUPS.flatMap((group) => group.items);
    const americanTItemProgress = americanTItemsFlat.map((item) => ({
      percentage:
        toPercent(topicProgress[item.progressKey]) ||
        readSavedAssessmentPercent(savedAssessments, item.assessmentTopicName),
    }));
    const americanTProgress =
      americanTItemProgress.length > 0
        ? Math.round(americanTItemProgress.reduce((sum, entry) => sum + entry.percentage, 0) / americanTItemProgress.length)
        : 0;
    const textPracticeProgress = topicProgress['textPractice'] || 0;
    
    // Calculate phonetic symbols average using helper function
    const averagePhoneticProgress = calculatePhoneticAverage(topicProgress);
    
    // Calculate pronunciation average from all roadmap topics.
    // Include topics with 0% so the bar reflects full roadmap completion (each topic max 100%).
    const allTopicProgress = [
      alphabetProgress,
      stressingProgress, 
      intonationProgress,
      finalSoundProgress,
      americanTProgress,
      textPracticeProgress,
      readingTextProgress,
      averagePhoneticProgress
    ];
    
    const pronunciationAverage = allTopicProgress.length > 0 
      ? Math.round(allTopicProgress.reduce((acc, curr) => acc + curr, 0) / allTopicProgress.length)
      : 0;
    const grammarValues = Object.values(grammarProgress);
    const grammarAverage = grammarValues.length > 0
      ? Math.round(grammarValues.reduce((acc, curr) => acc + curr, 0) / grammarValues.length)
      : 0;

    const completedGrammarGoalIdsRaw = readLocalStorageObject<unknown[]>(
      GRAMMAR_FOR_SPEAKING_PROGRESS_KEY,
      [],
    );
    const completedGrammarGoalCount = Array.isArray(completedGrammarGoalIdsRaw)
      ? new Set(
          completedGrammarGoalIdsRaw.filter(
            (goalId): goalId is string =>
              typeof goalId === 'string' && GRAMMAR_FOR_SPEAKING_GOAL_IDS.has(goalId),
          ),
        ).size
      : 0;
    const grammarForSpeakingAverage =
      GRAMMAR_FOR_SPEAKING_GOALS.length > 0
        ? Math.round((completedGrammarGoalCount / GRAMMAR_FOR_SPEAKING_GOALS.length) * 100)
        : 0;

    const vocabularyTopicProgress = VOCABULARY_TOPICS.map((topic) => {
      const value = vocabularyProgress[topic.topicId];
      if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
      return Math.min(100, Math.max(0, value));
    });
    const vocabularyAverage =
      vocabularyTopicProgress.length > 0
        ? Math.round(
            vocabularyTopicProgress.reduce((acc, curr) => acc + curr, 0) / vocabularyTopicProgress.length,
          )
        : 0;

    const speakingPhaseProgress = SPEAKING_PHASES.map((phase) => {
      const phaseGoals = SPEAKING_GOALS.filter((goal) => goal.phaseId === phase.id);
      const totalGoals = phaseGoals.length;
      if (totalGoals === 0) return 0;

      const learningDone = phaseGoals.filter((goal) => speakingCompletionMap[goal.id] === true).length;
      const practiceDone = phaseGoals.filter(
        (goal) => speakingCompletionMap[`${SPEAKING_PRACTICE_WITH_GEUWAT_PREFIX}${goal.id}`] === true,
      ).length;

      const lessonPercentage = Math.round((learningDone / totalGoals) * 100);
      const practicePercentage = Math.round((practiceDone / totalGoals) * 100);
      return Math.round((lessonPercentage + practicePercentage) / 2);
    });

    const speakingAverage =
      speakingPhaseProgress.length > 0
        ? Math.round(speakingPhaseProgress.reduce((acc, curr) => acc + curr, 0) / speakingPhaseProgress.length)
        : 0;
    
    return initialSkills.map(skill => {
      if (skill.id === 'pronunciation') {
        return { ...skill, progress: pronunciationAverage };
      }
      if (skill.id === 'grammar') {
        return { ...skill, progress: grammarForSpeakingAverage || grammarAverage };
      }
      if (skill.id === 'vocabulary') {
        return { ...skill, progress: vocabularyAverage };
      }
      if (skill.id === 'speaking') {
        return { ...skill, progress: speakingAverage };
      }
      return skill;
    });
  });

  // All skills are displayed
  const displayedSkills = skills;
  const lockedSkillIds = new Set<string>([]);
  const unlockedSkills = displayedSkills.filter(skill => !lockedSkillIds.has(skill.id));
  const fallbackSkill: SkillData = {
    id: 'none',
    name: '-',
    progress: 0,
    icon: BarChart3,
    description: ''
  };

  const getGrammarTrackProgress = (): DashboardTopicProgress[] => {
    const grammarSpeakingProgress = readLocalStorageObject<Record<string, number>>('grammarSpeakingProgress', {});
    const legacyValues = Object.values(grammarSpeakingProgress).filter(
      (value): value is number => typeof value === 'number' && Number.isFinite(value),
    );
    const legacyAverage =
      legacyValues.length > 0
        ? Math.round(legacyValues.reduce((acc, curr) => acc + curr, 0) / legacyValues.length)
        : 0;

    const completedGoalsRaw = readLocalStorageObject<unknown[]>(GRAMMAR_FOR_SPEAKING_PROGRESS_KEY, []);
    const completedGoalCount = Array.isArray(completedGoalsRaw)
      ? new Set(
          completedGoalsRaw.filter(
            (goalId): goalId is string =>
              typeof goalId === 'string' && GRAMMAR_FOR_SPEAKING_GOAL_IDS.has(goalId),
          ),
        ).size
      : 0;

    const grammarForSpeakingPercentage =
      GRAMMAR_FOR_SPEAKING_GOALS.length > 0
        ? Math.round((completedGoalCount / GRAMMAR_FOR_SPEAKING_GOALS.length) * 100)
        : 0;

    return [
      { name: 'Grammar for Speaking', percentage: grammarForSpeakingPercentage || legacyAverage },
      { name: 'Grammar for Writing', percentage: 0, locked: true },
    ];
  };

  const totalProgress = unlockedSkills.reduce((acc, curr) => acc + curr.progress, 0);
  const avgProgress = unlockedSkills.length > 0 ? totalProgress / unlockedSkills.length : 0;

  // Calculate strongest and weakest skills from unlocked skills only
  const strongestSkill = unlockedSkills.length > 0
    ? unlockedSkills.reduce((prev, curr) => (curr.progress > prev.progress ? curr : prev))
    : fallbackSkill;
  const weakestSkill = unlockedSkills.length > 0
    ? unlockedSkills.reduce((prev, curr) => (curr.progress < prev.progress ? curr : prev))
    : fallbackSkill;

  const handleTopicClick = (skillId: string, topicName: string) => {
    setSelectedTopics(prev => {
      const currentTopics = prev[skillId] || [];
      const isCurrentlySelected = currentTopics.includes(topicName);
      
      if (isCurrentlySelected) {
        // Deselect this topic
        return { ...prev, [skillId]: [] };
      } else {
        // Select only this topic, deselect others
        return { ...prev, [skillId]: [topicName] };
      }
    });
  };

  const toggleTopicExpansion = (skillId: string, topicName: string) => {
    setExpandedTopics(prev => {
      const currentExpanded = prev[skillId] || [];
      const isCurrentlyExpanded = currentExpanded.includes(topicName);
      
      if (isCurrentlyExpanded) {
        // Collapse this topic
        return { ...prev, [skillId]: currentExpanded.filter(t => t !== topicName) };
      } else {
        // Expand only this topic, collapse others
        return { ...prev, [skillId]: [topicName] };
      }
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wider">
            VIEW <span className="text-purple-500">PROGRESS</span>
          </h2>
          <p className="text-slate-400 mt-1 font-mono text-xs sm:text-sm">
            Track your English language skills and set your proficiency levels.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-1 gap-4 sm:gap-6">
        
        {/* Skills Overview */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-3 sm:p-4 md:p-5 backdrop-blur-sm flex flex-col items-center justify-center min-h-[240px] sm:min-h-[260px] md:min-h-[340px] relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-200 mb-2 md:mb-3 w-full text-left flex items-center gap-2 z-10 font-display">
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-cyan-400" /> 
            <span className="text-xs sm:text-sm md:text-base">Skills Overview</span>
          </h3>
          
          <div className="w-full h-[200px] sm:h-[220px] md:h-[300px] relative z-10 flex items-start justify-center overflow-y-auto">
            {/* Skills Overview - Clickable Subjects */}
            <div className="w-full space-y-2 md:space-y-3 px-1">
              {displayedSkills.map((skill) => {
                const percentage = skill.progress;
                const isSelected = selectedSkill === skill.id;
                const isDisabled = lockedSkillIds.has(skill.id); // Lock selected skills only.
                const displayPercentage = isDisabled ? null : percentage;
                
                return (
                  <div key={skill.id} className="space-y-2">
                    <div 
                      className={`flex items-center gap-2 md:gap-3 p-2 sm:p-2.5 md:p-3 rounded-lg transition-all duration-200 ${
                        isDisabled
                          ? 'bg-slate-900/50 border border-slate-700/30 cursor-not-allowed opacity-60'
                          : isSelected 
                            ? 'bg-purple-600/20 border border-purple-500/50 cursor-pointer' 
                            : 'bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50 cursor-pointer'
                      }`}
                      onClick={() => !isDisabled && setSelectedSkill(isSelected ? null : skill.id)}
                    >
                      {(() => {
                        const Icon = isDisabled ? Lock : skill.icon;
                        return <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${isDisabled ? 'text-slate-500' : 'text-purple-400'}`} />;
                      })()}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 md:gap-2">
                          <div className="text-xs sm:text-sm md:text-base font-semibold text-white truncate font-display">{skill.name}</div>
                        {isDisabled && (
                          <span className="text-[11px] sm:text-xs text-slate-400 ml-0 sm:ml-2">(Locked)</span>
                        )}
                        </div>
                        <div className="flex-1 bg-slate-800/50 rounded-full h-1.5 md:h-2 relative overflow-hidden mt-1">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full transition-all duration-500"
                            style={{ width: `${displayPercentage ?? 0}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-cyan-400 font-semibold hidden sm:block">
                        {displayPercentage === null ? '' : `${displayPercentage.toFixed(0)}%`}
                      </div>
                    </div>
                    
                    {/* Show topics when selected */}
                    {isSelected && (
                      <div className="pl-3 sm:pl-4 md:pl-6 pr-1 sm:pr-2 md:pr-3 space-y-1 md:space-y-2 animate-fade-in">
                        {(() => {
                          switch(skill.id) {
                            case 'pronunciation':
                              return getPronunciationTopicProgress();
                            case 'vocabulary':
                              return getVocabularyTopicProgress();
                            case 'grammar':
                              return getGrammarTrackProgress();
                            case 'speaking':
                              return getSpeakingTopicProgress();
                            default:
                              return [];
                          }
                        })().map((topic, index) => {
                          const isTopicLocked = topic.locked === true;
                          const isSelected = !isTopicLocked && selectedTopics[skill.id]?.includes(topic.name);
                          const isExpanded = expandedTopics[skill.id]?.includes(topic.name);
                          return (
                            <div key={index} className="space-y-1 md:space-y-2">
                              <button
                                onClick={() => {
                                  if (isTopicLocked) return;
                                  handleTopicClick(skill.id, topic.name);
                                  toggleTopicExpansion(skill.id, topic.name);
                                }}
                                disabled={isTopicLocked}
                                className={`
                                  relative py-1.5 md:py-2 px-2 md:px-3 rounded-lg font-display font-semibold text-[11px] sm:text-xs md:text-sm transition-all duration-200 border w-full
                                  ${isTopicLocked
                                    ? 'bg-slate-900/50 border-slate-700/40 text-slate-500 cursor-not-allowed opacity-70'
                                    : isSelected 
                                    ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105 z-10' 
                                    : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-700/50 hover:text-cyan-200'
                                  }
                                `}
                              >
                                <div className="flex flex-col gap-1 w-full">
                                  <div className="flex items-center justify-between w-full gap-2">
                                    <span className="text-[10px] sm:text-xs md:text-sm truncate">{topic.name}</span>
                                    {isTopicLocked ? (
                                      <span className="text-[10px] sm:text-xs text-slate-500 shrink-0">(Locked)</span>
                                    ) : (
                                      <span className="text-[10px] sm:text-xs text-cyan-300 font-semibold shrink-0">
                                        {topic.percentage}%
                                      </span>
                                    )}
                                  </div>
                                  {!isTopicLocked ? (
                                    <div className="bg-slate-900/40 rounded-full h-1.5 md:h-2 relative overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full transition-all duration-500"
                                        style={{ width: `${topic.percentage}%` }}
                                      />
                                    </div>
                                  ) : null}
                                </div>
                                {isSelected && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 md:w-2.5 md:h-2.5 bg-cyan-400 rounded-full border-2 border-slate-900 shadow-[0_0_8px_#22d3ee]">
                                  </div>
                                )}
                              </button>
                              
                              {/* Progress bar chart below button when expanded */}
                              {isExpanded && !isTopicLocked && (
                                <div className="pl-2 md:pl-4 pr-1 md:pr-2 animate-fade-in">
                                  <div className="bg-slate-800/30 rounded-lg p-2 md:p-3">
                                    {skill.id === 'pronunciation' ? (
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 md:gap-3">
                                          {topic.practicePopup &&
                                          getPracticePopupItemCount(topic.practicePopup) > 1 ? (
                                            <button
                                              type="button"
                                              onClick={() => openPopup(topic.practicePopup)}
                                              className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px] text-left underline underline-offset-2 decoration-slate-600/60 hover:text-cyan-200 hover:decoration-cyan-300/80 transition-colors"
                                              aria-haspopup="dialog"
                                              title="Show details"
                                            >
                                              Practice Progress
                                            </button>
                                          ) : topic.practiceHref ? (
                                            <Link
                                              href={topic.practiceHref}
                                              className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px] inline-block text-left underline underline-offset-2 decoration-slate-600/60 hover:text-cyan-200 hover:decoration-cyan-300/80 transition-colors"
                                              title="Open practice page"
                                            >
                                              Practice Progress
                                            </Link>
                                          ) : (
                                            <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px]">
                                              Practice Progress
                                            </div>
                                          )}
                                          <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-700"
                                              style={{ width: `${topic.practicePercentage ?? topic.percentage}%` }}
                                            />
                                          </div>
                                          <div className="text-[10px] sm:text-xs text-cyan-300 font-bold">
                                            {topic.practicePercentage ?? topic.percentage}%
                                          </div>
                                        </div>
                                        {topic.id !== 'text-practice' && topic.id !== 'reading-text' && (
                                          <div className="flex items-center gap-2 md:gap-3">
                                            {topic.lessonPopup &&
                                            getPracticePopupItemCount(topic.lessonPopup) > 1 ? (
                                              <button
                                                type="button"
                                                onClick={() => openPopup(topic.lessonPopup)}
                                                className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px] text-left underline underline-offset-2 decoration-slate-600/60 hover:text-emerald-200 hover:decoration-emerald-300/80 transition-colors"
                                                aria-haspopup="dialog"
                                                title="Show details"
                                              >
                                                Lesson Progress
                                              </button>
                                            ) : topic.practiceHref ? (
                                              <Link
                                                href={topic.practiceHref}
                                                className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px] inline-block text-left underline underline-offset-2 decoration-slate-600/60 hover:text-emerald-200 hover:decoration-emerald-300/80 transition-colors"
                                                title="Open lesson page"
                                              >
                                                Lesson Progress
                                              </Link>
                                            ) : (
                                              <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px]">
                                                Lesson Progress
                                              </div>
                                            )}
                                            <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                                              <div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-700"
                                                style={{ width: `${topic.lessonPercentage ?? 0}%` }}
                                              />
                                            </div>
                                            <div className="text-[10px] sm:text-xs text-emerald-300 font-bold">
                                              {topic.lessonPercentage ?? 0}%
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : skill.id === 'vocabulary' ? (
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 md:gap-3">
                                          {topic.practiceHref ? (
                                            <Link
                                              href={topic.practiceHref}
                                              className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px] inline-block text-left underline underline-offset-2 decoration-slate-600/60 hover:text-cyan-200 hover:decoration-cyan-300/80 transition-colors"
                                              title="Open practice page"
                                            >
                                              Practice Progress
                                            </Link>
                                          ) : (
                                            <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px]">
                                              Practice Progress
                                            </div>
                                          )}
                                          <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-700"
                                              style={{ width: `${topic.practicePercentage ?? topic.percentage}%` }}
                                            />
                                          </div>
                                          <div className="text-[10px] sm:text-xs text-cyan-300 font-bold">
                                            {topic.practicePercentage ?? topic.percentage}%
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 md:gap-3">
                                          {topic.lessonPopup &&
                                          getPracticePopupItemCount(topic.lessonPopup) > 1 ? (
                                            <button
                                              type="button"
                                              onClick={() => openPopup(topic.lessonPopup)}
                                              className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px] text-left underline underline-offset-2 decoration-slate-600/60 hover:text-emerald-200 hover:decoration-emerald-300/80 transition-colors"
                                              aria-haspopup="dialog"
                                              title="Show details"
                                            >
                                              Learning Progress
                                            </button>
                                          ) : topic.practiceHref ? (
                                            <Link
                                              href={topic.practiceHref}
                                              className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px] inline-block text-left underline underline-offset-2 decoration-slate-600/60 hover:text-emerald-200 hover:decoration-emerald-300/80 transition-colors"
                                              title="Open lesson page"
                                            >
                                              Learning Progress
                                            </Link>
                                          ) : (
                                            <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px]">
                                              Learning Progress
                                            </div>
                                          )}
                                          <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-700"
                                              style={{ width: `${topic.lessonPercentage ?? 0}%` }}
                                            />
                                          </div>
                                          <div className="text-[10px] sm:text-xs text-emerald-300 font-bold">
                                            {topic.lessonPercentage ?? 0}%
                                          </div>
                                        </div>
                                      </div>
                                    ) : skill.id === 'speaking' ? (
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 md:gap-3">
                                          {topic.lessonPopup &&
                                          getPracticePopupItemCount(topic.lessonPopup) > 1 ? (
                                            <button
                                              type="button"
                                              onClick={() => openPopup(topic.lessonPopup)}
                                              className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px] text-left underline underline-offset-2 decoration-slate-600/60 hover:text-emerald-200 hover:decoration-emerald-300/80 transition-colors"
                                              aria-haspopup="dialog"
                                              title="Show details"
                                            >
                                              Lesson Progress
                                            </button>
                                          ) : topic.practiceHref ? (
                                            <Link
                                              href={topic.practiceHref}
                                              className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px] inline-block text-left underline underline-offset-2 decoration-slate-600/60 hover:text-emerald-200 hover:decoration-emerald-300/80 transition-colors"
                                              title="Open lesson page"
                                            >
                                              Lesson Progress
                                            </Link>
                                          ) : (
                                            <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px]">
                                              Lesson Progress
                                            </div>
                                          )}
                                          <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-700"
                                              style={{ width: `${topic.lessonPercentage ?? 0}%` }}
                                            />
                                          </div>
                                          <div className="text-[10px] sm:text-xs text-emerald-300 font-bold">
                                            {topic.lessonPercentage ?? 0}%
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 md:gap-3">
                                          {topic.practicePopup &&
                                          getPracticePopupItemCount(topic.practicePopup) > 1 ? (
                                            <button
                                              type="button"
                                              onClick={() => openPopup(topic.practicePopup)}
                                              className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px] text-left underline underline-offset-2 decoration-slate-600/60 hover:text-cyan-200 hover:decoration-cyan-300/80 transition-colors"
                                              aria-haspopup="dialog"
                                              title="Show details"
                                            >
                                              Practice Progress
                                            </button>
                                          ) : topic.practiceHref ? (
                                            <Link
                                              href={topic.practiceHref}
                                              className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px] inline-block text-left underline underline-offset-2 decoration-slate-600/60 hover:text-cyan-200 hover:decoration-cyan-300/80 transition-colors"
                                              title="Open practice page"
                                            >
                                              Practice Progress
                                            </Link>
                                          ) : (
                                            <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px]">
                                              Practice Progress
                                            </div>
                                          )}
                                          <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-700"
                                              style={{ width: `${topic.practicePercentage ?? 0}%` }}
                                            />
                                          </div>
                                          <div className="text-[10px] sm:text-xs text-cyan-300 font-bold">
                                            {topic.practicePercentage ?? 0}%
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 md:gap-3">
                                        <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider">Progress</div>
                                        <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                                          <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-700"
                                            style={{ width: `${topic.percentage}%` }}
                                          />
                                        </div>
                                        <div className="text-[10px] sm:text-xs text-cyan-300 font-bold">{topic.percentage}%</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Background Grid Decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] pointer-events-none" />
        </div>
      </div>

      {/* Skill Progress Summary */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <div className="bg-slate-900/50 border border-cyan-500/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm text-center max-w-xs sm:max-w-sm mx-auto">
          <div className="text-[11px] sm:text-xs text-slate-400 font-mono">Average Score</div>
          <div className="text-lg sm:text-xl font-mono text-cyan-400">{avgProgress.toFixed(1)}%</div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-slate-900/50 border border-green-500/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm text-center">
            <div className="flex flex-col gap-1 items-center">
              <span className="text-green-400 text-xs sm:text-sm">Strongest Skill</span>
              <div className="text-base sm:text-lg font-bold text-white">{strongestSkill.name}</div>
              <div className="text-[11px] sm:text-xs text-slate-400">{strongestSkill.progress}% Complete</div>
            </div>
          </div>
          
          <div className="bg-slate-900/50 border border-purple-500/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm text-center">
            <div className="flex flex-col gap-1 items-center">
              <span className="text-purple-400 text-xs sm:text-sm">Needs Focus</span>
              <div className="text-base sm:text-lg font-bold text-white">{weakestSkill.name}</div>
              <div className="text-[11px] sm:text-xs text-slate-400">{weakestSkill.progress}% Complete</div>
            </div>
          </div>
        </div>
      </div>

      {practicePopup ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={closePracticePopup} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="practice-popup-title"
            className="relative w-full max-w-lg rounded-2xl border border-slate-700/60 bg-slate-900/90 shadow-[0_30px_120px_rgba(0,0,0,0.55)] overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 p-4 border-b border-slate-700/50">
              <div className="min-w-0">
                <div id="practice-popup-title" className="text-sm sm:text-base font-display font-bold text-white truncate">
                  {practicePopup.data.title}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-mono">
                  Details (avg {practicePopup.data.average}%)
                </div>
              </div>
              <button
                type="button"
                onClick={closePracticePopup}
                className="shrink-0 px-2 py-1 rounded-md text-slate-200 hover:text-white hover:bg-slate-800/70 transition-colors text-sm"
                aria-label="Close"
              >
                X
              </button>
            </div>

            {practicePopup.data.groups.length > 1 ? (
              <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-slate-700/40">
                <button
                  type="button"
                  onClick={() => navigatePracticePopup(-1)}
                  className="px-2 py-1 rounded-md border border-slate-700/60 bg-slate-900/40 text-slate-200 hover:bg-slate-800/60 transition-colors text-xs"
                  aria-label="Previous category"
                >
                  Prev
                </button>
                <div className="flex flex-col items-center min-w-0">
                  <div className="text-xs sm:text-sm text-slate-200 font-semibold truncate max-w-[220px]">
                    {practicePopup.data.groups[practicePopup.activeGroupIndex]?.title ?? ''}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {practicePopup.activeGroupIndex + 1}/{practicePopup.data.groups.length}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigatePracticePopup(1)}
                  className="px-2 py-1 rounded-md border border-slate-700/60 bg-slate-900/40 text-slate-200 hover:bg-slate-800/60 transition-colors text-xs"
                  aria-label="Next category"
                >
                  Next
                </button>
              </div>
            ) : null}

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${practicePopup.activeGroupIndex * 100}%)` }}
              >
                {practicePopup.data.groups.map((group) => (
                  <div key={group.id} className="w-full shrink-0 p-4">
                    <div className="max-h-[55vh] overflow-y-auto space-y-3 pr-1">
                      {group.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 md:gap-3">
                          {item.href ? (
                            <Link
                              href={item.href}
                              onClick={closePracticePopup}
                              className={
                                (group.labelVariant === 'symbol'
                                  ? 'w-[64px] text-base sm:text-lg font-mono'
                                  : 'w-[160px] text-[11px] sm:text-xs font-semibold leading-tight') +
                                ' block text-slate-200 underline underline-offset-2 decoration-slate-600/60 hover:text-cyan-200 hover:decoration-cyan-300/80 transition-colors'
                              }
                              title="Open page"
                            >
                              {item.label}
                            </Link>
                          ) : (
                            <div
                              className={
                                group.labelVariant === 'symbol'
                                  ? 'w-[64px] text-base sm:text-lg font-mono text-slate-200'
                                  : 'w-[160px] text-[11px] sm:text-xs text-slate-200 font-semibold leading-tight'
                              }
                            >
                              {item.label}
                            </div>
                          )}
                          <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-700"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <div className="text-[10px] sm:text-xs text-cyan-300 font-bold">{item.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProgressContent;
