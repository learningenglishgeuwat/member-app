import type { MinimalPairData } from '../types';

export type PartialMinimalPair = Omit<MinimalPairData, 'videoId' | 'isVideoUnlocked'> & {
  videoId?: string;
  isVideoUnlocked?: boolean;
};

const DEFAULT_WORDS = Array.from({ length: 10 }, (_, index) => ({
  a: `Sample A${index + 1}`,
  b: `Sample B${index + 1}`,
}));

const buildSentencePairs = (words: { a: string; b: string }[]) =>
  words.slice(0, 5).map((item) => ({
    a: `Please say "${item.a}" clearly.`,
    b: `Please say "${item.b}" clearly.`,
  }));

export const createTemplatePair = (pair: PartialMinimalPair): MinimalPairData => ({
  ...pair,
  words: pair.words?.length ? pair.words : DEFAULT_WORDS,
  sentences: pair.sentences?.length ? pair.sentences : buildSentencePairs(pair.words?.length ? pair.words : DEFAULT_WORDS),
  videoId: pair.videoId ?? 'dQw4w9WgXcQ',
  isVideoUnlocked: pair.isVideoUnlocked ?? false,
  isTemplateContent: !pair.words?.length ? true : pair.isTemplateContent,
});
