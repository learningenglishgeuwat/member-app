export type SpeakingGoalPhaseId =
  | 'phase-00'
  | 'phase-01'
  | 'phase-02'
  | 'phase-03'
  | 'phase-04'
  | 'phase-05'
  | 'phase-06'
  | 'phase-07'
  | 'phase-08'
  | 'phase-09'
  | 'phase-10'
  | 'phase-11'
  | 'phase-12'
  | 'phase-13';

export type SpeakingDomain =
  | 'daily'
  | 'work'
  | 'public'
  | 'emergency'
  | 'legal'
  | 'finance';

export type SpeakingLevelBand =
  | 'starter'
  | 'basic'
  | 'functional'
  | 'intermediate'
  | 'upper-intermediate'
  | 'advanced'
  | 'professional';

export type SurvivalPriority = 'critical' | 'high' | 'medium';

export type SpeakingGoalCard = {
  id: string;
  goal: string;
  situation: string;
  keySentences: string[];
  drill: string;
  phaseId: SpeakingGoalPhaseId;
  phaseTitle: string;
  domain: SpeakingDomain;
  levelBand: SpeakingLevelBand;
  goalOrder: number;
  survivalPriority: SurvivalPriority;
};

export type SpeakingGoalPhase = {
  id: SpeakingGoalPhaseId;
  order: number;
  title: string;
  subtitle: string;
  targetOutput: string;
  levelBand: SpeakingLevelBand;
  domains: SpeakingDomain[];
  goalCount: number;
};

export type SpeakingQuickFilter = 'all' | SpeakingDomain;
