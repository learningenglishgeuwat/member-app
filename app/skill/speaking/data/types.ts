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

export type CefrSpeakingPhaseId = 'cefr-a1-1' | 'cefr-a1-2' | 'cefr-a1-3';

export type SpeakingPhaseId = CefrSpeakingPhaseId;

export type ActiveSpeakingPhaseId = CefrSpeakingPhaseId;

export type SpeakingGoalPhase = {
  id: SpeakingPhaseId;
  order: number;
  title: string;
  subtitle: string;
  targetOutput: string;
  goalCount: number;
  levelBand: SpeakingLevelBand;
  domains: SpeakingDomain[];
};

export type SpeakingGoalCard = {
  id: string;
  phaseId: SpeakingPhaseId;
  phaseTitle: string;
  goalOrder: number;
  domain: SpeakingDomain;
  levelBand: SpeakingLevelBand;
  survivalPriority: SurvivalPriority;
  goal: string;
  situation: string;
  keySentences: string[];
  keySentencesId?: [string, string, string, string, string];
  drill: string;
};

export type SpeakingQuickFilter = 'all' | SpeakingDomain;
