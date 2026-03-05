import { SPEAKING_GOALS, TOTAL_SPEAKING_GOALS } from './goals';
import { SPEAKING_PHASES } from './phases';
import { SPEAKING_GOAL_DETAILS } from './details';

export type SpeakingDatasetAudit = {
  totalGoals: number;
  totalPhases: number;
  goalsPerPhase: Record<string, number>;
  duplicateIds: string[];
  invalidGoals: string[];
  detailIssues: string[];
  hasError: boolean;
};

const EXPECTED_PHASE_COUNT = 3;
const EXPECTED_GOAL_COUNT = 36;
const EXPECTED_GOALS_PER_PHASE = 12;

function hasMeasurableTarget(value: string): boolean {
  const normalized = value.toLowerCase();
  const hasNumber = /\b\d+\b/.test(normalized);
  const hasUnit =
    /(detik|menit|minute|minutes|round|ronde|set|repetisi|repetition|kali|simulasi|simulation|dialog|dialogue|roleplay|role-play)/.test(
      normalized,
    );
  return hasNumber && hasUnit;
}

function toTrimmedLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function auditSpeakingDataset(): SpeakingDatasetAudit {
  const duplicateIds: string[] = [];
  const invalidGoals: string[] = [];
  const detailIssues: string[] = [];

  const idSet = new Set<string>();
  const goalsPerPhase = Object.fromEntries(
    SPEAKING_PHASES.map((phase) => [phase.id, 0]),
  ) as Record<string, number>;

  for (const goal of SPEAKING_GOALS) {
    const isA1_1 = goal.phaseId === 'cefr-a1-1';

    goalsPerPhase[goal.phaseId] = (goalsPerPhase[goal.phaseId] ?? 0) + 1;

    if (idSet.has(goal.id)) duplicateIds.push(goal.id);
    idSet.add(goal.id);

    if (goal.keySentences.length !== 5) {
      invalidGoals.push(`${goal.id}: keySentences harus tepat 5 kalimat.`);
    }

    if (!goal.goal.trim() || !goal.situation.trim() || !goal.drill.trim()) {
      invalidGoals.push(`${goal.id}: wrapper utama tidak lengkap.`);
    }

    if (!hasMeasurableTarget(goal.drill)) {
      invalidGoals.push(`${goal.id}: drill belum measurable.`);
    }

    if (isA1_1) {
      if (!goal.keySentencesId || goal.keySentencesId.length !== 5) {
        invalidGoals.push(`${goal.id}: keySentencesId untuk A1.1 wajib ada dan tepat 5 kalimat.`);
      } else if (goal.keySentencesId.some((line) => !line.trim())) {
        invalidGoals.push(`${goal.id}: keySentencesId tidak boleh kosong.`);
      }
    }

    const detail = SPEAKING_GOAL_DETAILS[goal.id];
    if (!detail) {
      detailIssues.push(`${goal.id}: detail tidak ditemukan.`);
      continue;
    }

    if (detail.guidedDrills.length < 3) {
      detailIssues.push(`${goal.id}: guidedDrills kurang dari 3 level.`);
    }
    if (detail.roleplayScenarios.length < 2) {
      detailIssues.push(`${goal.id}: roleplayScenarios kurang dari 2 skenario.`);
    }
    if (detail.selfCheck.length < 4) {
      detailIssues.push(`${goal.id}: selfCheck kurang dari 4 butir.`);
    }
    if (!detail.guidedDrillsExamples || detail.guidedDrillsExamples.length < 3) {
      detailIssues.push(`${goal.id}: guidedDrillsExamples belum lengkap.`);
    }
    if (!detail.roleplayExamples || detail.roleplayExamples.length < 2) {
      detailIssues.push(`${goal.id}: roleplayExamples belum lengkap.`);
    } else {
      detail.roleplayExamples.forEach((example, index) => {
        const lines = toTrimmedLines(example);

        if (lines.length < 4) {
          detailIssues.push(`${goal.id}: roleplayExamples[${index}] kurang dari 4 baris dialog.`);
        }

        if (!lines.some((line) => line.startsWith('Partner:'))) {
          detailIssues.push(`${goal.id}: roleplayExamples[${index}] wajib punya baris Partner:.`);
        }

        if (!lines.some((line) => line.startsWith('You:'))) {
          detailIssues.push(`${goal.id}: roleplayExamples[${index}] wajib punya baris You:.`);
        }
      });

      if (isA1_1) {
        if (!detail.roleplayExamplesId || detail.roleplayExamplesId.length !== detail.roleplayExamples.length) {
          detailIssues.push(
            `${goal.id}: roleplayExamplesId untuk A1.1 wajib ada dan jumlah skenario harus sama dengan roleplayExamples.`,
          );
        } else {
          detail.roleplayExamplesId.forEach((exampleId, index) => {
            const rawIdLines = exampleId.split('\n').map((line) => line.trim());
            const idLines = rawIdLines.filter(Boolean);
            const enLines = toTrimmedLines(detail.roleplayExamples?.[index] ?? '');

            if (idLines.length !== enLines.length) {
              detailIssues.push(
                `${goal.id}: roleplayExamplesId[${index}] jumlah baris harus sama dengan roleplayExamples[${index}].`,
              );
            }

            if (rawIdLines.some((line) => !line)) {
              detailIssues.push(`${goal.id}: roleplayExamplesId[${index}] memiliki baris kosong.`);
            }
          });
        }
      }
    }
    if (!detail.selfCheckExamples || detail.selfCheckExamples.length < 4) {
      detailIssues.push(`${goal.id}: selfCheckExamples belum lengkap.`);
    }
    if (!detail.nextActionExample?.trim()) {
      detailIssues.push(`${goal.id}: nextActionExample belum terisi.`);
    }
    if (!hasMeasurableTarget(detail.nextAction)) {
      detailIssues.push(`${goal.id}: nextAction belum measurable.`);
    }
  }

  for (const phase of SPEAKING_PHASES) {
    if ((goalsPerPhase[phase.id] ?? 0) !== EXPECTED_GOALS_PER_PHASE) {
      invalidGoals.push(
        `phase-count-mismatch:${phase.id} expected ${EXPECTED_GOALS_PER_PHASE}, got ${goalsPerPhase[phase.id] ?? 0}.`,
      );
    }
  }

  const hasError =
    TOTAL_SPEAKING_GOALS !== EXPECTED_GOAL_COUNT ||
    SPEAKING_PHASES.length !== EXPECTED_PHASE_COUNT ||
    duplicateIds.length > 0 ||
    invalidGoals.length > 0 ||
    detailIssues.length > 0;

  return {
    totalGoals: TOTAL_SPEAKING_GOALS,
    totalPhases: SPEAKING_PHASES.length,
    goalsPerPhase,
    duplicateIds,
    invalidGoals,
    detailIssues,
    hasError,
  };
}

export function assertSpeakingDatasetInDev(): void {
  if (process.env.NODE_ENV === 'production') return;

  const report = auditSpeakingDataset();
  if (report.hasError) {
    console.error('[SpeakingDataset] validation failed', report);
  }
}
