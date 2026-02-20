export type MinimalPairCategory = 'vowel' | 'diphthong' | 'consonant';
export type MinimalPairSpeechLang = 'en-US' | 'en-GB' | 'id-ID';

export type MinimalPairWord = {
  a: string;
  b: string;
  ipaA?: string;
  ipaB?: string;
  ttsA?: string;
  ttsB?: string;
  ttsLangA?: MinimalPairSpeechLang;
  ttsLangB?: MinimalPairSpeechLang;
};

export type MinimalPairSentence = {
  a: string;
  b: string;
  ipaA?: string;
  ipaB?: string;
};

export type MinimalPairData = {
  id: string;
  category: MinimalPairCategory;
  pairLabel: string;
  words: MinimalPairWord[];
  sentences: MinimalPairSentence[];
  videoId: string;
  isVideoUnlocked: boolean;
  notes?: string;
  isTemplateContent?: boolean;
};
