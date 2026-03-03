import {
  BASIC_INTONATION_PATTERNS,
  COMMON_MISTAKES,
  DIALOGUE_DRILLS,
  EMPHASIS_FEELING_EXAMPLES,
  INTONATION_SECTION_LEARNING_GUIDES,
  LIST_CONTINUATION_EXAMPLES,
  PRACTICE_CHECKLIST,
  STATEMENT_QUESTION_PAIRS,
} from './intonationData';
import type { IntonationSectionKey } from './types';

type ExampleWithLearningMeta = {
  id: string;
  translationId: string;
  whenToUse: string;
  listeningCue: string;
  speakingCue: string;
  indoPitfall: string;
  selfCheck: string;
};

function validateLearningMeta(items: ExampleWithLearningMeta[], bucket: string, issues: string[]) {
  items.forEach((item) => {
    if (!item.translationId.trim()) issues.push(`${bucket}:${item.id} missing translationId`);
    if (!item.whenToUse.trim()) issues.push(`${bucket}:${item.id} missing whenToUse`);
    if (!item.listeningCue.trim()) issues.push(`${bucket}:${item.id} missing listeningCue`);
    if (!item.speakingCue.trim()) issues.push(`${bucket}:${item.id} missing speakingCue`);
    if (!item.indoPitfall.trim()) issues.push(`${bucket}:${item.id} missing indoPitfall`);
    if (!item.selfCheck.trim()) issues.push(`${bucket}:${item.id} missing selfCheck`);
  });
}

function validateGuides(issues: string[]) {
  const requiredSections: IntonationSectionKey[] = [
    'concept',
    'patterns',
    'statementsQuestions',
    'listContinuation',
    'emphasisFeeling',
    'dialogueDrills',
    'commonMistakes',
    'practiceChecklist',
  ];

  requiredSections.forEach((section) => {
    const guide = INTONATION_SECTION_LEARNING_GUIDES[section];
    if (!guide) {
      issues.push(`guide missing for section ${section}`);
      return;
    }

    if (!guide.apaIni.trim()) issues.push(`guide ${section} missing apaIni`);
    if (!guide.kapanDipakai.trim()) issues.push(`guide ${section} missing kapanDipakai`);
    if (!guide.caraDengar.trim()) issues.push(`guide ${section} missing caraDengar`);
    if (!guide.caraUcap.trim()) issues.push(`guide ${section} missing caraUcap`);
    if (!guide.indoPitfall.trim()) issues.push(`guide ${section} missing indoPitfall`);
    if (!Array.isArray(guide.latihan3Tahap) || guide.latihan3Tahap.length !== 3) {
      issues.push(`guide ${section} latihan3Tahap must contain exactly 3 steps`);
    } else if (guide.latihan3Tahap.some((step) => !step.trim())) {
      issues.push(`guide ${section} latihan3Tahap has empty step`);
    }
  });
}

export function runIntonationQualityGate() {
  if (process.env.NODE_ENV === 'production') return;

  const issues: string[] = [];

  validateLearningMeta(BASIC_INTONATION_PATTERNS, 'patterns', issues);
  validateLearningMeta(STATEMENT_QUESTION_PAIRS, 'statementQuestionPairs', issues);
  validateLearningMeta(LIST_CONTINUATION_EXAMPLES, 'listContinuation', issues);
  validateLearningMeta(EMPHASIS_FEELING_EXAMPLES, 'emphasisFeeling', issues);
  validateLearningMeta(DIALOGUE_DRILLS, 'dialogueDrills', issues);

  if (COMMON_MISTAKES.length < 5) {
    issues.push('common mistakes should contain at least 5 items');
  }

  if (PRACTICE_CHECKLIST.some((item) => !/\d/.test(item))) {
    issues.push('practice checklist must contain measurable numeric targets');
  }

  validateGuides(issues);

  if (issues.length > 0) {
    console.error('[IntonationQuality] Issues found:\n' + issues.map((item) => `- ${item}`).join('\n'));
  }
}
