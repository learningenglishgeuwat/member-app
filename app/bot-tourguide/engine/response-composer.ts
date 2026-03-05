import { GUIDE_RESPONSE_TEMPLATES } from '../data/response-templates';
import type { ComposedReply, GuideAnswerIntent, ParsedQuery } from '../types';

type ComposeQaReplyInput = {
  parsed: ParsedQuery;
  answerType: GuideAnswerIntent;
  coreAnswer: string;
  suggestions?: string[];
  isFollowUpContext?: boolean;
};

const hashSeed = (text: string): number => {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const pickVariant = (values: string[], seed: number): string =>
  values.length ? values[seed % values.length] || '' : '';

export const composeQaReply = (input: ComposeQaReplyInput): ComposedReply => {
  const template = GUIDE_RESPONSE_TEMPLATES[input.answerType] ?? GUIDE_RESPONSE_TEMPLATES.fallback;
  const seed = hashSeed(`${input.parsed.normalized}:${input.answerType}`);

  const opener = pickVariant(template.openers, seed);
  const closer = pickVariant(template.closers, seed + 1);
  const followUpPrefix =
    input.parsed.isFollowUp || input.isFollowUpContext ? 'Lanjutan dari topik sebelumnya. ' : '';

  const segments = [followUpPrefix, opener, input.coreAnswer, closer]
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    text: segments.join(' '),
    suggestions: input.suggestions,
    toneVariantId: `${input.answerType}-${seed % 7}`,
    answerType: input.answerType,
  };
};
