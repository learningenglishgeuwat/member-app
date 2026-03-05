import type { SpeakingGoalDetail } from '../detailTypes';
import { AUTHORED_SPEAKING_DETAIL_ROUTES, AUTHORED_SPEAKING_GOAL_IDS } from './authored-goals';
import { CEFR_A1_DETAILS_MAP } from './cefr-a1';

export { AUTHORED_SPEAKING_DETAIL_ROUTES, AUTHORED_SPEAKING_GOAL_IDS };

export const SPEAKING_GOAL_DETAILS: Record<string, SpeakingGoalDetail> = {
  ...CEFR_A1_DETAILS_MAP,
};

export function getSpeakingGoalDetail(goalId: string): SpeakingGoalDetail | null {
  return SPEAKING_GOAL_DETAILS[goalId] ?? null;
}
