export type IntonationSectionKey =
  | 'concept'
  | 'patterns'
  | 'statementsQuestions'
  | 'listContinuation'
  | 'emphasisFeeling'
  | 'dialogueDrills'
  | 'commonMistakes'
  | 'practiceChecklist';

export type IntonationAudioSectionKey =
  | 'patterns'
  | 'statementsQuestions'
  | 'listContinuation'
  | 'emphasisFeeling'
  | 'dialogueDrills';

export type IntonationSelfStudyStep = {
  id: string;
  title: string;
  focus: string;
  targetOutput: string;
  durationMinutes: number;
};

export type IntonationLearningGuide = {
  apaIni: string;
  kapanDipakai: string;
  caraDengar: string;
  caraUcap: string;
  indoPitfall: string;
  latihan3Tahap: [string, string, string];
};

type IntonationLearningMeta = {
  translationId: string;
  whenToUse: string;
  listeningCue: string;
  speakingCue: string;
  indoPitfall: string;
  selfCheck: string;
};

export type IntonationExample = {
  id: string;
  pattern: string;
  sentence: string;
  contour: string;
  note: string;
  ttsText?: string;
} & IntonationLearningMeta;

export type IntonationPairExample = {
  id: string;
  prompt: string;
  statement: string;
  question: string;
  note: string;
  statementTts?: string;
  questionTts?: string;
} & IntonationLearningMeta;

export type IntonationListExample = {
  id: string;
  sentence: string;
  chunked: string;
  note: string;
  ttsText?: string;
} & IntonationLearningMeta;

export type IntonationEmotionExample = {
  id: string;
  intent: string;
  sentence: string;
  contour: string;
  note: string;
  ttsText?: string;
} & IntonationLearningMeta;

export type IntonationDrillSentence = {
  id: string;
  speaker: 'A' | 'B';
  sentence: string;
  targetPattern: string;
  note: string;
  ttsText?: string;
} & IntonationLearningMeta;
