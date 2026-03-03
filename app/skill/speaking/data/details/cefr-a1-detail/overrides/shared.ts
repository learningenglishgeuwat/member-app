import type { SpeakingGoalDetail } from '../../../detailTypes';

export type ManualRoleplayPair = [string, string];

export type CoherenceSectionOverride = Pick<
  SpeakingGoalDetail,
  | 'goalSnapshot'
  | 'whyThisMatters'
  | 'situationBreakdown'
  | 'pronunciationNotes'
  | 'commonMistakes'
  | 'roleplayScenarios'
  | 'roleplayExamples'
  | 'roleplayExamplesId'
>;

export const DEFAULT_SCENARIO_B_MISSION =
  'Partner memberi informasi kurang jelas atau ada detail yang salah tangkap. Pakai repair phrase, ulang detail penting, lalu tutup dengan konfirmasi akhir.';
