export type ConfidenceBand = 'low' | 'medium' | 'high';

export const clampConfidence = (value: number): number => {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return Math.round(value);
};

export const getConfidenceBand = (value: number): ConfidenceBand => {
  if (value >= 78) return 'high';
  if (value >= 45) return 'medium';
  return 'low';
};

export const buildConfidenceScore = (signals: {
  intentDetected: boolean;
  entityCount: number;
  tokenCount: number;
  hasTypoCorrection: boolean;
  isFollowUp: boolean;
  lexicalScore?: number;
}): number => {
  let score = 20;

  if (signals.intentDetected) score += 20;
  if (signals.entityCount > 0) score += Math.min(22, signals.entityCount * 8);
  if (signals.tokenCount >= 3) score += 10;
  if (signals.isFollowUp) score += 8;
  if (signals.hasTypoCorrection) score -= 12;
  if (typeof signals.lexicalScore === 'number') {
    score += Math.max(0, Math.min(40, signals.lexicalScore * 0.25));
  }

  return clampConfidence(score);
};
