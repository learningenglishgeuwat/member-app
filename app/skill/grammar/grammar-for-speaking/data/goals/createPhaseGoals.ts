import type {
  SpeakingDomain,
  SpeakingGoalCard,
  SpeakingGoalPhaseId,
  SpeakingLevelBand,
  SurvivalPriority,
} from '../types';

export type GoalSeed = {
  goal: string;
  situation: string;
  keySentence: string;
  drill: string;
  domain: SpeakingDomain;
  survivalPriority?: SurvivalPriority;
  keySentence2?: string;
  keySentence3?: string;
};

type CreatePhaseGoalsInput = {
  phaseId: SpeakingGoalPhaseId;
  phaseTitle: string;
  levelBand: SpeakingLevelBand;
  defaultKeySentence2: string;
  defaultKeySentence3: string;
  seeds: GoalSeed[];
};

export function createPhaseGoals({
  phaseId,
  phaseTitle,
  levelBand,
  defaultKeySentence2,
  defaultKeySentence3,
  seeds,
}: CreatePhaseGoalsInput): SpeakingGoalCard[] {
  return seeds.map((seed, index) => ({
    id: `${phaseId}-g${String(index + 1).padStart(2, '0')}`,
    goal: seed.goal,
    situation: seed.situation,
    keySentences: [
      seed.keySentence,
      seed.keySentence2 ?? defaultKeySentence2,
      seed.keySentence3 ?? defaultKeySentence3,
    ],
    drill: seed.drill,
    phaseId,
    phaseTitle,
    domain: seed.domain,
    levelBand,
    goalOrder: index + 1,
    survivalPriority: seed.survivalPriority ?? 'high',
  }));
}
