const CEFR_A1_PHASES = ['cefr-a1-1', 'cefr-a1-2', 'cefr-a1-3'] as const;
const GOALS_PER_PHASE = 12;

export const AUTHORED_SPEAKING_GOAL_IDS: string[] = CEFR_A1_PHASES.flatMap((phaseId) =>
  Array.from({ length: GOALS_PER_PHASE }, (_, index) =>
    `${phaseId}-g${String(index + 1).padStart(2, '0')}`,
  ),
);

export const AUTHORED_SPEAKING_DETAIL_ROUTES: string[] = AUTHORED_SPEAKING_GOAL_IDS.map(
  (goalId) => `/skill/speaking/cefr-a1/${goalId}`,
);
