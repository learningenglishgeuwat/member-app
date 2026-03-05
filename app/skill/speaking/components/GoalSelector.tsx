'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SPEAKING_GOALS } from '../data/goals';
import { SPEAKING_PHASES } from '../data/phases';
import { AUTHORED_SPEAKING_GOAL_IDS } from '../data/details/authored-goals';
import type { CefrSpeakingPhaseId } from '../data/types';

type GoalSelectorProps = {
  activeGoalId: string;
};

function toDetailRoute(goalId: string) {
  return `/skill/speaking/cefr-a1/${goalId}`;
}

export default function GoalSelector({ activeGoalId }: GoalSelectorProps) {
  const router = useRouter();

  const authoredSet = useMemo(
    () => new Set<string>([...AUTHORED_SPEAKING_GOAL_IDS]),
    [],
  );

  const activeGoal = useMemo(
    () => SPEAKING_GOALS.find((goal) => goal.id === activeGoalId) ?? null,
    [activeGoalId],
  );

  const availablePhases = useMemo(
    () =>
      SPEAKING_PHASES.filter((phase) =>
        SPEAKING_GOALS.some(
          (goal) => goal.phaseId === phase.id && authoredSet.has(goal.id),
        ),
      ),
    [authoredSet],
  );

  const selectedPhaseId = activeGoal?.phaseId ?? availablePhases[0]?.id ?? 'cefr-a1-1';

  const goalsInPhase = useMemo(
    () =>
      SPEAKING_GOALS.filter(
        (goal) => goal.phaseId === selectedPhaseId && authoredSet.has(goal.id),
      ),
    [authoredSet, selectedPhaseId],
  );

  if (!activeGoal) {
    return null;
  }

  const handlePhaseChange = (nextPhaseId: CefrSpeakingPhaseId) => {
    const firstGoal = SPEAKING_GOALS.find(
      (goal) => goal.phaseId === nextPhaseId && authoredSet.has(goal.id),
    );
    if (firstGoal) {
      router.push(toDetailRoute(firstGoal.id));
    }
  };

  const handleGoalChange = (nextGoalId: string) => {
    router.push(toDetailRoute(nextGoalId));
  };

  return (
    <div className="spk-detail-selector">
      <label className="spk-detail-selector-item">
        <span>Phase</span>
        <select
          value={selectedPhaseId}
          onChange={(event) => handlePhaseChange(event.target.value as CefrSpeakingPhaseId)}
        >
          {availablePhases.map((phase) => (
            <option key={phase.id} value={phase.id}>
              {phase.title}
            </option>
          ))}
        </select>
      </label>

      <label className="spk-detail-selector-item">
        <span>Goal</span>
        <select
          value={activeGoal.id}
          onChange={(event) => handleGoalChange(event.target.value)}
        >
          {goalsInPhase.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {String(goal.goalOrder).padStart(2, '0')} - {goal.goal}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
