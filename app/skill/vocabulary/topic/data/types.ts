export type VocabularyTopicId =
  | 'color'
  | 'size'
  | 'body-parts'
  | 'family'
  | 'daily-routines'
  | 'home'
  | 'time-date'
  | 'number'
  | 'ordinal-number'
  | 'feelings'
  | 'transport'
  | 'places'
  | 'clothes'
  | 'food'
  | 'drinks'
  | 'weather'
  | 'taste'
  | 'vegetables'
  | 'fruit'
  | 'school'
  | 'personal-information'
  | 'physical-appearance'
  | 'hobbies-interests'
  | 'sports'
  | 'games'
  | 'entertainment-media'
  | 'education'
  | 'shapes'
  | 'electronics'
  | 'shopping'
  | 'bathroom'
  | 'kitchen'
  | 'social-media';

export type VocabularyItem = {
  id: string;
  topicId: VocabularyTopicId;
  word: string;
  ipa: string;
  icon?: string;
  meaningId: string;
  exampleEn: string;
};

export type VocabularyTopicMeta = {
  topicId: VocabularyTopicId;
  title: string;
  subtitle: string;
  description: string;
};
