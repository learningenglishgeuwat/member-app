import { resolveNavigationMode } from './modes/navigation';
import { resolveQaMode } from './modes/qa';
import { resolveSimulationMode } from './modes/simulation';
import { resolveFlashcardMode } from './modes/flashcard';
import { resolveTutorialMode } from './modes/tutorial';
import { resolveSpeakingPracticeMode } from './modes/speaking-practice';
import { resolveLearningPathMode } from './modes/learning-path';
import { parseGuideQuery } from './engine/nlu';
import type { GuideMode, GuideModeResult, ParsedQuery, TutorialDeviceProfile } from './types';

export const DEFAULT_SUGGESTION_PROMPTS = [
  'buka pronunciation',
  'learning path',
  'simulasi final sound s/es',
  'flashcard kitchen',
  'start speaking practice',
];

export const BOT_AI_STYLE_V1 = process.env.NEXT_PUBLIC_BOT_AI_STYLE_V1 !== '0';

type GuideIntentOptions = {
  mode: GuideMode;
  pathname?: string;
  deviceProfile?: TutorialDeviceProfile;
};

const parseQuery = (query: string, mode: GuideMode): ParsedQuery | null => {
  if (!BOT_AI_STYLE_V1) return null;
  if (mode !== 'qa') return null;
  return parseGuideQuery(query);
};

const rankIntent = (
  query: string,
  options: GuideIntentOptions,
  parsedQuery: ParsedQuery | null,
): GuideModeResult => {
  const { mode, pathname, deviceProfile } = options;

  if (mode === 'simulation') {
    return resolveSimulationMode(query);
  }

  if (mode === 'flashcard') {
    return resolveFlashcardMode(query);
  }

  if (mode === 'qa') {
    return resolveQaMode(query, { pathname, parsedQuery: parsedQuery ?? undefined });
  }

  if (mode === 'tutorial') {
    return resolveTutorialMode(query, { pathname, deviceProfile });
  }

  if (mode === 'speaking-practice') {
    return resolveSpeakingPracticeMode(query, { pathname });
  }

  if (mode === 'learning-path') {
    return resolveLearningPathMode(query);
  }

  return resolveNavigationMode(query, { pathname });
};

const composeResponse = (result: GuideModeResult): GuideModeResult => result;

export const resolveGuideIntent = (
  query: string,
  options: GuideIntentOptions,
): GuideModeResult => {
  const parsedQuery = parseQuery(query, options.mode);
  const ranked = rankIntent(query, options, parsedQuery);
  return composeResponse(ranked);
};

export const getInitialGuideResult = (
  mode: GuideMode,
  options?: { pathname?: string; deviceProfile?: TutorialDeviceProfile },
): GuideModeResult =>
  resolveGuideIntent('', {
    mode,
    pathname: options?.pathname,
    deviceProfile: options?.deviceProfile,
  });
