import type { VocabularyItem, VocabularyTopicId } from '../types';
import { VOCAB_TOPIC_BODY_PARTS_WORDS } from './body-parts';
import { VOCAB_TOPIC_CLOTHES_WORDS } from './clothes';
import { VOCAB_TOPIC_COLOR_WORDS } from './color';
import { VOCAB_TOPIC_DAILY_ROUTINES_WORDS } from './daily-routines';
import { VOCAB_TOPIC_DRINKS_WORDS } from './drinks';
import { VOCAB_TOPIC_FEELINGS_WORDS } from './feelings';
import { VOCAB_TOPIC_FAMILY_WORDS } from './family';
import { VOCAB_TOPIC_FOOD_WORDS } from './food';
import { VOCAB_TOPIC_FRUIT_WORDS } from './fruit';
import { VOCAB_TOPIC_HOME_WORDS } from './home';
import { VOCAB_TOPIC_NUMBER_WORDS } from './number';
import { VOCAB_TOPIC_ORDINAL_NUMBER_WORDS } from './ordinal-number';
import { VOCAB_TOPIC_PLACES_WORDS } from './places';
import { VOCAB_TOPIC_SIZE_WORDS } from './size';
import { VOCAB_TOPIC_TASTE_WORDS } from './taste';
import { VOCAB_TOPIC_TIME_DATE_WORDS } from './time-date';
import { VOCAB_TOPIC_TRANSPORT_WORDS } from './transport';
import { VOCAB_TOPIC_WEATHER_WORDS } from './weather';
import { VOCAB_TOPIC_VEGETABLES_WORDS } from './vegetables';
import { VOCAB_TOPIC_SCHOOL_WORDS } from './school';
import { VOCAB_TOPIC_PERSONAL_INFORMATION_WORDS } from './personal-information';
import { VOCAB_TOPIC_PHYSICAL_APPEARANCE_WORDS } from './physical-appearance';
import { VOCAB_TOPIC_HOBBIES_INTERESTS_WORDS } from './hobbies-interests';
import { VOCAB_TOPIC_SPORTS_WORDS } from './sports';
import { VOCAB_TOPIC_GAMES_WORDS } from './games';
import { VOCAB_TOPIC_ENTERTAINMENT_MEDIA_WORDS } from './entertainment-media';
import { VOCAB_TOPIC_EDUCATION_WORDS } from './education';
import { VOCAB_TOPIC_SHAPES_WORDS } from './shapes';
import { VOCAB_TOPIC_ELECTRONICS_WORDS } from './electronics';
import { VOCAB_TOPIC_SHOPPING_WORDS } from './shopping';
import { VOCAB_TOPIC_BATHROOM_WORDS } from './bathroom';
import { VOCAB_TOPIC_KITCHEN_WORDS } from './kitchen';
import { VOCAB_TOPIC_SOCIAL_MEDIA_WORDS } from './social-media';

export const VOCABULARY_WORDS = [
  ...VOCAB_TOPIC_COLOR_WORDS,
  ...VOCAB_TOPIC_SIZE_WORDS,
  ...VOCAB_TOPIC_CLOTHES_WORDS,
  ...VOCAB_TOPIC_FOOD_WORDS,
  ...VOCAB_TOPIC_DRINKS_WORDS,
  ...VOCAB_TOPIC_FRUIT_WORDS,
  ...VOCAB_TOPIC_BODY_PARTS_WORDS,
  ...VOCAB_TOPIC_FAMILY_WORDS,
  ...VOCAB_TOPIC_DAILY_ROUTINES_WORDS,
  ...VOCAB_TOPIC_FEELINGS_WORDS,
  ...VOCAB_TOPIC_HOME_WORDS,
  ...VOCAB_TOPIC_PLACES_WORDS,
  ...VOCAB_TOPIC_TIME_DATE_WORDS,
  ...VOCAB_TOPIC_TRANSPORT_WORDS,
  ...VOCAB_TOPIC_WEATHER_WORDS,
  ...VOCAB_TOPIC_TASTE_WORDS,
  ...VOCAB_TOPIC_VEGETABLES_WORDS,
  ...VOCAB_TOPIC_SCHOOL_WORDS,
  ...VOCAB_TOPIC_PERSONAL_INFORMATION_WORDS,
  ...VOCAB_TOPIC_PHYSICAL_APPEARANCE_WORDS,
  ...VOCAB_TOPIC_HOBBIES_INTERESTS_WORDS,
  ...VOCAB_TOPIC_SPORTS_WORDS,
  ...VOCAB_TOPIC_GAMES_WORDS,
  ...VOCAB_TOPIC_ENTERTAINMENT_MEDIA_WORDS,
  ...VOCAB_TOPIC_EDUCATION_WORDS,
  ...VOCAB_TOPIC_SHAPES_WORDS,
  ...VOCAB_TOPIC_ELECTRONICS_WORDS,
  ...VOCAB_TOPIC_SHOPPING_WORDS,
  ...VOCAB_TOPIC_BATHROOM_WORDS,
  ...VOCAB_TOPIC_KITCHEN_WORDS,
  ...VOCAB_TOPIC_SOCIAL_MEDIA_WORDS,
  ...VOCAB_TOPIC_NUMBER_WORDS,
  ...VOCAB_TOPIC_ORDINAL_NUMBER_WORDS,
];

export const TOTAL_VOCABULARY_WORDS = VOCABULARY_WORDS.length;

export const VOCABULARY_WORDS_BY_TOPIC: Record<VocabularyTopicId, VocabularyItem[]> =
  VOCABULARY_WORDS.reduce(
    (acc, item) => {
      if (!acc[item.topicId]) {
        acc[item.topicId] = [];
      }
      acc[item.topicId].push(item);
      return acc;
    },
    {} as Record<VocabularyTopicId, VocabularyItem[]>,
  );

export function getVocabularyWordsByTopic(topicId: VocabularyTopicId) {
  return VOCABULARY_WORDS_BY_TOPIC[topicId] ?? [];
}
