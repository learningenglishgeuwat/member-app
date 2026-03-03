import type { CefrSpeakingPhaseId, SpeakingGoalCard } from './types';

export type SpeakingDetailDrillLevel = 'basic' | 'bridge' | 'stretch';

export type SpeakingDetailMistake = {
  mistake: string;
  correction: string;
};

export type SpeakingDetailDrill = {
  level: SpeakingDetailDrillLevel;
  title: string;
  instruction: string;
  target: string;
};

export type SpeakingRoleplayScenario = {
  title: string;
  partnerRole: string;
  mission: string;
};

export type SpeakingDialogTurnSpeaker = 'Partner' | 'You';

export type SpeakingDialogTurn = {
  speaker: SpeakingDialogTurnSpeaker;
  line: string;
};

export type SpeakingDialogScript = {
  title: string;
  mission: string;
  turns: SpeakingDialogTurn[];
};

export type SpeakingGoalDetail = {
  id: string;
  phaseId: CefrSpeakingPhaseId;
  goalOrder: number;
  goalSnapshot: string;
  whyThisMatters: string;
  situationBreakdown: string[];
  pronunciationNotes: string[];
  commonMistakes: SpeakingDetailMistake[];
  guidedDrills: SpeakingDetailDrill[];
  roleplayScenarios: SpeakingRoleplayScenario[];
  dialogScripts?: SpeakingDialogScript[];
  guidedDrillsExamples?: string[];
  roleplayExamples?: string[];
  roleplayExamplesId?: string[];
  selfCheckExamples?: string[];
  guidedDrillsExample?: string;
  roleplayExample?: string;
  selfCheckExample?: string;
  nextActionExample?: string;
  selfCheck: string[];
  nextAction: string;
};

export type SpeakingGoalDetailSeed = {
  id: string;
  phaseId: CefrSpeakingPhaseId;
  goalOrder: number;
  focus: string;
  context: string;
  risk: string;
  successSignal: string;
  partnerRole: string;
};

export type SpeakingGoalLookup = {
  byId: Record<string, SpeakingGoalCard>;
};
