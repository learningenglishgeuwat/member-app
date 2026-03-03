import type { CefrSpeakingPhaseId } from './types';

export function isCefrSpeakingPhaseId(value: string): value is CefrSpeakingPhaseId {
  return value === 'cefr-a1-1' || value === 'cefr-a1-2' || value === 'cefr-a1-3';
}

export function mapPhaseQueryToCefrPhase(phaseQuery: string | null): CefrSpeakingPhaseId | null {
  if (!phaseQuery) return null;
  return isCefrSpeakingPhaseId(phaseQuery) ? phaseQuery : null;
}
