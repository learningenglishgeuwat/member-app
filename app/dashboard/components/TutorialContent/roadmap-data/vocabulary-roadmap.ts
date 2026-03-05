import { VOCABULARY_TOPICS } from '../../../../skill/vocabulary/topic/data/topics';
import { getVocabularyWordsByTopic } from '../../../../skill/vocabulary/topic/data/words';

export type VocabularyRoadmapItem = {
  id: string;
  title: string;
  href: string;
  focus: string;
  wordCount: number;
  estimatedDays: number;
};

export const estimateVocabularyDays = (wordCount: number): number => {
  // Baseline: +/- 12 kata per hari (belajar + review) dalam 30 menit.
  return Math.max(2, Math.ceil(wordCount / 12));
};

export const VOCABULARY_ROADMAP_ITEMS: ReadonlyArray<VocabularyRoadmapItem> =
  VOCABULARY_TOPICS.map((topic) => {
    const wordCount = getVocabularyWordsByTopic(topic.topicId).length;
    return {
      id: topic.topicId,
      title: topic.title,
      href: `/skill/vocabulary/topic/pages/${topic.topicId}`,
      focus: topic.subtitle,
      wordCount,
      estimatedDays: estimateVocabularyDays(wordCount),
    };
  });

export const VOCABULARY_ROADMAP_TOTAL_WORDS = VOCABULARY_ROADMAP_ITEMS.reduce(
  (sum, item) => sum + item.wordCount,
  0,
);

export const VOCABULARY_ROADMAP_TOTAL_DAYS = VOCABULARY_ROADMAP_ITEMS.reduce(
  (sum, item) => sum + item.estimatedDays,
  0,
);
