import { VOCABULARY_TOPIC_ID_SET, VOCABULARY_TOPICS } from './topics';
import { TOTAL_VOCABULARY_WORDS, VOCABULARY_WORDS } from './words';

export const MIN_WORDS_PER_TOPIC = 1;
export const EXPECTED_TOPIC_COUNT = 33;
export const EXPECTED_MIN_TOTAL_VOCAB = MIN_WORDS_PER_TOPIC * EXPECTED_TOPIC_COUNT;

export function assertVocabularyDatasetInDev() {
  const errors: string[] = [];

  if (VOCABULARY_TOPICS.length !== EXPECTED_TOPIC_COUNT) {
    errors.push(
      `Expected ${EXPECTED_TOPIC_COUNT} topics, got ${VOCABULARY_TOPICS.length}.`,
    );
  }

  if (TOTAL_VOCABULARY_WORDS < EXPECTED_MIN_TOTAL_VOCAB) {
    errors.push(
      `Expected at least ${EXPECTED_MIN_TOTAL_VOCAB} vocabulary items, got ${TOTAL_VOCABULARY_WORDS}.`,
    );
  }

  const idSet = new Set<string>();
  for (const item of VOCABULARY_WORDS) {
    if (idSet.has(item.id)) {
      errors.push(`Duplicate vocabulary id: ${item.id}`);
    }
    idSet.add(item.id);

    if (!VOCABULARY_TOPIC_ID_SET.has(item.topicId)) {
      errors.push(`Invalid topicId at ${item.id}: ${item.topicId}`);
    }

    if (!item.word.trim()) {
      errors.push(`Empty word at ${item.id}`);
    }
    if (!item.meaningId.trim()) {
      errors.push(`Empty meaningId at ${item.id}`);
    }
    if (!item.exampleEn.trim()) {
      errors.push(`Empty exampleEn at ${item.id}`);
    }
  }

  for (const topic of VOCABULARY_TOPICS) {
    const count = VOCABULARY_WORDS.filter(
      (item) => item.topicId === topic.topicId,
    ).length;
    if (count < MIN_WORDS_PER_TOPIC) {
      errors.push(
        `Topic ${topic.topicId} expected at least ${MIN_WORDS_PER_TOPIC} items, got ${count}.`,
      );
    }
  }

  if (errors.length) {
    throw new Error(`Vocabulary dataset invalid:\n- ${errors.join('\n- ')}`);
  }
}
